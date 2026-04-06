import os
import json
import numpy as np
import joblib
import tensorflow as tf
from flask import Flask, request, jsonify
from flask_cors import CORS
import re

# Initialize Flask app
app = Flask(__name__)

# ✅ CORS: Allow all origins (fixes CORS errors on Render free tier)
CORS(app, origins="*", methods=["GET", "POST", "OPTIONS"], allow_headers=["Content-Type", "Authorization"])

# ─── Built-in Treatment Database ─────────────────────────────────────────────
# Replaces Wikipedia (which caused timeouts on Render free tier)
TREATMENT_DB = {
    "fungal infection": "Antifungal medications (topical or oral) such as clotrimazole or fluconazole. Keep the area clean and dry. Avoid sharing personal items. Consult a dermatologist if it persists beyond 2 weeks.",
    "allergy": "Antihistamines (cetirizine, loratadine) for symptom relief. Identify and avoid allergens. Use prescribed epinephrine for severe reactions. Consult an allergist for immunotherapy options.",
    "gerd": "Proton pump inhibitors (omeprazole) or antacids. Avoid spicy and fatty foods, alcohol, caffeine. Eat smaller meals. Elevate head while sleeping. Consult a gastroenterologist.",
    "chronic cholestasis": "Fat-soluble vitamin supplementation. Ursodeoxycholic acid may be prescribed. Avoid alcohol. Regular liver function monitoring. Hepatologist consultation recommended.",
    "drug reaction": "Stop the offending drug immediately. Antihistamines for mild reactions. Corticosteroids for severe cases. Epinephrine for anaphylaxis. Seek emergency care if breathing is affected.",
    "peptic ulcer disease": "Proton pump inhibitors (omeprazole, pantoprazole). H. pylori eradication therapy if positive. Avoid NSAIDs, alcohol, and smoking. Follow-up endoscopy recommended.",
    "aids": "Antiretroviral therapy (ART) — combination of HIV medicines. Regular CD4 count and viral load monitoring. Prophylactic antibiotics for opportunistic infections. Infectious disease specialist care.",
    "diabetes": "Blood sugar monitoring. Metformin or insulin as prescribed. Low-carbohydrate diet. Regular exercise. Monitor for complications (kidney, eye, nerve). Endocrinologist follow-up.",
    "gastroenteritis": "Oral rehydration salts (ORS) to prevent dehydration. Rest and light diet (BRAT diet). Antiemetics for nausea. IV fluids if severely dehydrated. Usually resolves in 1-3 days.",
    "bronchial asthma": "Short-acting bronchodilators (salbutamol) for acute attacks. Inhaled corticosteroids for long-term control. Avoid triggers (dust, smoke, allergens). Pulmonologist consultation.",
    "hypertension": "Lifestyle changes: reduce salt, exercise regularly, limit alcohol. ACE inhibitors, beta-blockers, or diuretics as prescribed. Regular BP monitoring. Cardiologist follow-up.",
    "migraine": "Pain relievers (ibuprofen, sumatriptan). Rest in a dark, quiet room. Cold compress on forehead. Preventive medications (topiramate, propranolol) for frequent attacks. Neurologist consultation.",
    "cervical spondylosis": "Physiotherapy and neck exercises. Pain relievers (NSAIDs). Use ergonomic pillow. Hot/cold therapy. Surgery in severe cases. Orthopedic or neurosurgeon consultation.",
    "paralysis (brain hemorrhage)": "Emergency hospitalization required. Surgery to relieve pressure. Rehabilitation (physiotherapy, speech therapy). Blood pressure management. Neurologist care.",
    "jaundice": "Rest and adequate hydration. Treat underlying cause (hepatitis, gallstones). Avoid alcohol completely. Regular liver function tests. Hepatologist consultation.",
    "malaria": "Antimalarial drugs (chloroquine, artemisinin-based combination therapy). Rest and hydration. Fever management with paracetamol. Mosquito prevention. Infectious disease specialist.",
    "chicken pox": "Calamine lotion for itching. Antiviral (acyclovir) for severe cases. Paracetamol for fever (avoid aspirin in children). Keep skin clean. Isolate to prevent spread.",
    "dengue": "Rest and hydration. Paracetamol for fever (avoid ibuprofen/aspirin). Monitor platelet count. Hospitalize if severe. No specific antiviral — supportive care only.",
    "typhoid": "Antibiotics (ciprofloxacin, azithromycin). Rest and hydration. Soft diet. Isolate patient. Complete the full antibiotic course. Follow-up stool cultures.",
    "hepatitis a": "Rest and adequate nutrition. Avoid alcohol and hepatotoxic drugs. Supportive care. Usually self-limiting in 4-8 weeks. Vaccination for prevention.",
    "hepatitis b": "Antiviral therapy (tenofovir, entecavir) for chronic cases. Regular liver function and HBV DNA monitoring. Avoid alcohol. Hepatologist follow-up. Vaccination for contacts.",
    "hepatitis c": "Direct-acting antiviral (DAA) therapy (sofosbuvir-based regimens) — high cure rates. Avoid alcohol. Regular liver monitoring. Hepatologist consultation.",
    "hepatitis d": "Pegylated interferon-alpha therapy. Manage underlying hepatitis B. Avoid alcohol. Regular monitoring. Hepatologist care.",
    "hepatitis e": "Rest and supportive care. Avoid alcohol. Usually self-limiting. Ribavirin for severe/chronic cases. Monitor liver function. Safe drinking water and sanitation.",
    "alcoholic hepatitis": "Stop alcohol immediately. Nutritional support. Corticosteroids for severe cases. Pentoxifylline as alternative. Liver transplant for end-stage. Addiction counseling.",
    "tuberculosis": "DOTS therapy — 6-month course (isoniazid, rifampicin, pyrazinamide, ethambutol). Isolation during active phase. Nutritional support. Pulmonologist/infectious disease specialist.",
    "common cold": "Rest and hydration. Saline nasal rinse. Paracetamol for fever/pain. Honey and warm liquids for throat. Usually resolves in 7-10 days. Antibiotics NOT effective.",
    "pneumonia": "Antibiotics (amoxicillin, azithromycin) for bacterial pneumonia. Rest and hydration. Antipyretics. Hospitalization for severe cases. Chest physiotherapy. Pulmonologist care.",
    "dimorphic hemorrhoids (piles)": "High-fiber diet and adequate hydration. Sitz baths. Topical hemorrhoid creams. Rubber band ligation. Surgery (hemorrhoidectomy) for severe cases. Colorectal surgeon.",
    "heart attack": "EMERGENCY — Call ambulance immediately. Aspirin (if not allergic). Nitroglycerin. Primary PCI (angioplasty) or thrombolytic therapy. Cardiac ICU care. Cardiologist.",
    "varicose veins": "Compression stockings. Elevate legs regularly. Exercise. Sclerotherapy or laser treatment. Endovenous ablation for severe cases. Vascular surgeon consultation.",
    "hypothyroidism": "Levothyroxine (thyroid hormone replacement). Regular TSH monitoring. Lifelong treatment usually required. Adequate iodine in diet. Endocrinologist follow-up.",
    "hyperthyroidism": "Antithyroid drugs (methimazole, propylthiouracil). Radioactive iodine therapy. Beta-blockers for symptom control. Thyroidectomy in some cases. Endocrinologist care.",
    "hypoglycemia": "Immediate glucose intake (juice, glucose tablets). Glucagon injection for severe cases. Identify and address underlying cause. Frequent small meals. Endocrinologist follow-up.",
    "osteoarthritis": "Pain relievers (acetaminophen, NSAIDs). Physiotherapy and exercise. Weight management. Joint injections (corticosteroids, hyaluronic acid). Joint replacement surgery. Rheumatologist.",
    "arthritis": "Anti-inflammatory medications (NSAIDs). Disease-modifying drugs (methotrexate) for RA. Physiotherapy. Hot/cold therapy. Joint protection techniques. Rheumatologist.",
    "vertigo": "Epley maneuver for BPPV. Anti-vertigo medications (betahistine, meclizine). Vestibular rehabilitation. Treat underlying cause. ENT/neurologist consultation.",
    "acne": "Topical retinoids, benzoyl peroxide, or salicylic acid. Oral antibiotics for moderate cases. Isotretinoin for severe acne. Gentle skincare routine. Dermatologist consultation.",
    "urinary tract infection": "Antibiotics (trimethoprim, nitrofurantoin, ciprofloxacin). Increased water intake. Avoid irritants (caffeine, alcohol). Complete the antibiotic course. Urologist if recurrent.",
    "psoriasis": "Topical corticosteroids and vitamin D analogues. Phototherapy (UVB). Systemic drugs (methotrexate, cyclosporine). Biologics for severe cases. Dermatologist management.",
    "impetigo": "Topical antibiotics (mupirocin). Oral antibiotics for widespread infection. Keep the area clean. Avoid touching or scratching. Highly contagious — limit contact.",
    "default": "Please consult a qualified medical professional for proper diagnosis and treatment. Rest, stay hydrated, and monitor your symptoms. Seek emergency care if symptoms are severe or worsening."
}

def get_treatment(disease_name):
    """Look up treatment from built-in DB. Falls back to default."""
    key = disease_name.lower().strip().replace('_', ' ')
    # Try direct match first
    if key in TREATMENT_DB:
        return TREATMENT_DB[key]
    # Try partial match
    for db_key, treatment in TREATMENT_DB.items():
        if db_key in key or key in db_key:
            return treatment
    return TREATMENT_DB["default"]

# ─── Load ML Model ────────────────────────────────────────────────────────────
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

# ─── Symptom Extraction ───────────────────────────────────────────────────────
def extract_symptoms_from_text(text, known_symptoms):
    """Extract known medical symptoms from free-text input."""
    text = text.lower().strip()
    text = re.sub(r'[^\w\s]', ' ', text)
    words = set(re.findall(r'\b\w+\b', text))

    matched = []
    for symptom in known_symptoms:
        clean_symptom = symptom.lower().strip().replace('_', ' ')
        symptom_words = set(re.findall(r'\b\w+\b', clean_symptom))

        # Exact phrase match
        if clean_symptom in text:
            matched.append(symptom)
            continue

        # Word-level match (words > 2 chars to skip stop words)
        if any(w in words for w in symptom_words if len(w) > 2):
            matched.append(symptom)

    return list(set(matched))

# ─── Routes ───────────────────────────────────────────────────────────────────

@app.route('/health', methods=['GET'])
def health():
    return jsonify({
        "status": "Baymax bot is online!",
        "model_loaded": model is not None
    }), 200

@app.route('/predict', methods=['POST', 'OPTIONS'])
def predict():
    # Handle preflight
    if request.method == 'OPTIONS':
        return jsonify({}), 200

    try:
        if model is None:
            return jsonify({"error": "ML model not loaded. Please check server logs."}), 503

        data = request.get_json(force=True, silent=True)
        if not data:
            return jsonify({"error": "Invalid JSON payload."}), 400

        input_text = data.get("sentence", "").strip()
        if not input_text:
            return jsonify({"error": "Please provide a sentence describing your symptoms."}), 400

        # Step 1: Extract symptoms
        classes = list(mlb.classes_)
        filtered_symptoms = extract_symptoms_from_text(input_text, classes)
        print(f"🔹 Input: {input_text}")
        print(f"🔹 Found Symptoms: {filtered_symptoms}")

        if not filtered_symptoms:
            return jsonify({
                "error": "I couldn't identify specific medical symptoms in your message. Could you please describe your symptoms more specifically (e.g., 'fever', 'headache', 'skin rash')?"
            }), 400

        # Step 2: ML Prediction
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

        # Step 3: Get treatment from built-in DB (no network call — instant!)
        treatment = get_treatment(disease_name)

        return jsonify({
            "predicted_disease": disease_name.replace('_', ' ').strip().title(),
            "extracted_symptoms": [s.strip().replace('_', ' ') for s in filtered_symptoms],
            "treatment_recommendation": treatment
        })

    except Exception as e:
        print(f"❌ Global Error: {str(e)}")
        return jsonify({"error": "An internal error occurred. Please try again later."}), 500


# ─── Run ──────────────────────────────────────────────────────────────────────
if __name__ == '__main__':
    port = int(os.environ.get("PORT", 5001))
    app.run(host="0.0.0.0", port=port, debug=False)
