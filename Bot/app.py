import os
import json
import numpy as np
import joblib
import tensorflow as tf
from flask import Flask, request, jsonify
from dotenv import load_dotenv
from flask_cors import CORS
import re
import requests

# Load environment variables
load_dotenv()

# Initialize Flask app
app = Flask(__name__)

# CORS: restrict to allowed origins
allowed_origins = os.environ.get("ALLOWED_ORIGINS", "http://localhost:5173,http://localhost:4173").split(",")
CORS(app, origins=allowed_origins)

# Load ML Model and Preprocessing Tools
model = None
encoder = None
scaler = None
mlb = None

try:
    model = tf.keras.models.load_model("mlp_model.h5")
    encoder = joblib.load("label_encoder.pkl")
    scaler = joblib.load("scaler.pkl")
    mlb = joblib.load("mlb.pkl")
    print("✅ ML Model & data tools successfully loaded!")
except Exception as e:
    print(f"❌ Error loading model or tools: {e}")

# Improved Symptom Extraction
def extract_symptoms_from_text(text, known_symptoms):
    """
    Looks at what the user typed (text) and tries to find medical symptoms 
    from our known list of symptoms.
    """
    text = text.lower().strip()
    text = re.sub(r'[^\w\s]', ' ', text)  # Remove punctuation
    words = set(re.findall(r'\b\w+\b', text)) # Use set for faster O(1) lookups
    
    matched = []
    for symptom in known_symptoms:
        clean_symptom = symptom.lower().strip().replace('_', ' ')
        symptom_words = set(re.findall(r'\b\w+\b', clean_symptom))
        
        # 1. Exact string matching (e.g. "skin rash" inside "i have a skin rash")
        if clean_symptom in text:
            matched.append(symptom)
            continue
            
        # 2. Key word heuristic: match if ANY word of the symptom is in user text
        # (Exclude common stop words if necessary, but here we check significance by length > 2)
        if any(w in words for w in symptom_words if len(w) > 2): 
            matched.append(symptom)

    return list(set(matched))

# API Health Check
@app.route('/health', methods=['GET'])
def health():
    model_loaded = model is not None
    return jsonify({
        "status": "API is running. Baymax is online!",
        "model_loaded": model_loaded
    }), 200

# Prediction API (sentence-based)
@app.route('/predict', methods=['POST'])
def predict():
    """
    Main function: receives text symptoms, predicts disease, grabs treatment from Wikipedia.
    """
    try:
        if model is None:
            return jsonify({"error": "ML model not loaded. Please check server logs."}), 503

        data = request.get_json()
        if not data:
            return jsonify({"error": "Invalid JSON payload."}), 400

        input_text = data.get("sentence", "")
        if not input_text or not isinstance(input_text, str):
            return jsonify({"error": "Invalid input. Please provide a sentence."}), 400

        # Step 1: Extract symptoms from the sentence
        classes = [s for s in mlb.classes_] # raw class names (e.g. ' itching', 'skin_rash')
        filtered_symptoms = extract_symptoms_from_text(input_text, classes)

        print(f"🔹 Found Symptoms: {filtered_symptoms}")

        if not filtered_symptoms:
            return jsonify({"error": "I couldn't identify specific medical symptoms in your message. Could you please describe your symptoms more specifically (e.g., 'fever', 'headache', 'skin rash')?"}), 400

        # Step 2: Ask the ML model to predict what the disease is
        try:
            X_input = mlb.transform([filtered_symptoms])
            X_input = scaler.transform(X_input)
            predictions = model.predict(X_input)

            predicted_class = np.argmax(predictions, axis=1)
            disease_name = encoder.inverse_transform(predicted_class)[0]
            print(f"🔹 Predicted Disease: {disease_name}")
        except Exception as pred_err:
            print(f"❌ Prediction Error: {pred_err}")
            return jsonify({"error": "Our diagnostic engine failed to process these symptoms. Please try rephrasing."}), 500

        # Step 3: Get treatment advice from Wikipedia
        try:
            # Clean up disease name for better wiki search
            search_query = disease_name.replace('_', ' ').strip()
            
            # Use requests for a fast, reliable API call with timeout
            wiki_url = f"https://en.wikipedia.org/w/api.php"
            params = {
                "action": "query",
                "format": "json",
                "prop": "extracts",
                "exintro": True,
                "explaintext": True,
                "titles": f"{search_query} medical condition"
            }
            resp = requests.get(wiki_url, params=params, timeout=3.0)
            data = resp.json()
            
            pages = data.get("query", {}).get("pages", {})
            extract = ""
            for page_id, page_info in pages.items():
                if page_id != "-1":
                    extract = page_info.get("extract", "")
                    break
            
            if not extract:
                # Fallback to just the disease name without "medical condition"
                params["titles"] = search_query
                resp = requests.get(wiki_url, params=params, timeout=3.0)
                data = resp.json()
                pages = data.get("query", {}).get("pages", {})
                for page_id, page_info in pages.items():
                    if page_id != "-1":
                        extract = page_info.get("extract", "")
                        break
            
            if extract:
                # Take first 3 sentences
                sentences = extract.split('. ')
                treatment = '. '.join(sentences[:3]) + "."
            else:
                treatment = f"Common treatments for {search_query} involve rest, hydration, and professional medical consultation. Please see a doctor immediately for a formal diagnosis."
                
        except Exception as e:
            print(f"Wikipedia query error: {e}")
            treatment = f"Common treatments for {search_query} involve rest, hydration, and professional medical consultation. Please see a doctor immediately for a formal diagnosis."

        # Return the response
        return jsonify({
            "predicted_disease": disease_name.replace('_', ' ').strip().title(),
            "extracted_symptoms": [s.strip().replace('_', ' ') for s in filtered_symptoms],
            "treatment_recommendation": treatment
        })

    except Exception as e:
        print(f"❌ Global Error: {str(e)}")
        return jsonify({"error": "An internal error occurred. Please try again later."}), 500

# Run Server
if __name__ == '__main__':
    port = int(os.environ.get("PORT", 5001))
    app.run(host="0.0.0.0", port=port, debug=False)
