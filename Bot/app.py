import os
import json
import numpy as np
import joblib
import tensorflow as tf
from flask import Flask, request, jsonify
from dotenv import load_dotenv
from flask_cors import CORS
import re
import wikipedia

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
    words = text.split()
    
    matched = []
    for symptom in known_symptoms:
        symptom_phrase = symptom.replace('_', ' ')
        symptom_words = set(symptom_phrase.split())
        
        # Match if any significant word of the symptom is within the user's text
        if any(w in words for w in symptom_words if len(w) > 3): 
            matched.append(symptom)
            continue
            
        # Or check exact string overlap
        if symptom_phrase in ' '.join(words):
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

        # Limit input length to prevent abuse
        if len(input_text) > 1000:
            return jsonify({"error": "Input too long. Please keep it under 1000 characters."}), 400

        # Step 1: Extract symptoms from the sentence
        known_symptoms = [s.lower() for s in mlb.classes_]
        filtered_symptoms = extract_symptoms_from_text(input_text, known_symptoms)

        print(f"🔹 Found Symptoms: {filtered_symptoms}")

        if not filtered_symptoms:
            return jsonify({"error": "No recognizable symptoms found in the sentence."}), 400

        # Step 2: Ask the ML model to predict what the disease is
        X_input = mlb.transform([filtered_symptoms])
        X_input = scaler.transform(X_input)
        predictions = model.predict(X_input)

        predicted_class = np.argmax(predictions, axis=1)
        disease_name = encoder.inverse_transform(predicted_class)[0]

        print(f"🔹 Predicted Disease: {disease_name}")

        # Step 3: Get treatment advice from Wikipedia
        try:
            summary = wikipedia.summary(f"{disease_name} symptoms and treatment", sentences=3)
            treatment = summary
        except Exception as e:
            print(f"Wikipedia query error: {e}")
            treatment = f"Common treatments for {disease_name} involve medical consultation. Please see a doctor immediately."

        # Return the response
        return jsonify({
            "predicted_disease": disease_name,
            "extracted_symptoms": filtered_symptoms,
            "treatment_recommendation": treatment
        })

    except Exception as e:
        print(f"❌ Error: {str(e)}")
        return jsonify({"error": "An internal error occurred. Please try again."}), 500

# Run Server
if __name__ == '__main__':
    port = int(os.environ.get("PORT", 5001))
    app.run(host="0.0.0.0", port=port, debug=False)
