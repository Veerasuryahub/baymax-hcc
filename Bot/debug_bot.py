import joblib
import os
import re

def extract_symptoms_from_text(text, known_symptoms):
    text = text.lower().strip()
    text = re.sub(r'[^\w\s]', ' ', text)
    words = text.split()
    matched = []
    for symptom in [s.lower() for s in known_symptoms]:
        symptom_phrase = symptom.replace('_', ' ')
        symptom_words = set(symptom_phrase.split())
        if any(w in words for w in symptom_words if len(w) > 3): 
            matched.append(symptom)
            continue
        if symptom_phrase in ' '.join(words):
            matched.append(symptom)
    return list(set(matched))

try:
    mlb = joblib.load("mlb.pkl")
    classes = sorted(list(mlb.classes_))
    # print(f"Total Symptoms: {len(classes)}")
    # print(f"Some symptoms: {classes[:20]}")
    
    test_text = "I have a fever and headache"
    found = extract_symptoms_from_text(test_text, classes)
    print(f"Tested: '{test_text}' -> Found: {found}")

    test_text2 = "I feel unwell"
    found2 = extract_symptoms_from_text(test_text2, classes)
    print(f"Tested: '{test_text2}' -> Found: {found2}")

except Exception as e:
    print(f"Error: {e}")
