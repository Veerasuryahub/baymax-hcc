# 🩺 BAYMAX: Healthcare Companion Chatbot

Welcome to the **BAYMAX Health Assistant** project! 
This project is an AI-powered medical assistant that functions like Baymax from the movie *Big Hero 6*. It listens to your symptoms and acts as a virtual triage nurse to predict a possible illness and offer basic treatment suggestions.

This document is written so that **anyone**, from an experienced developer to a complete beginner, can easily understand how it works!

---

## 🛠️ The Architecture (How It Works)

Imagine running a restaurant. This project has three workers:

### 1. The Waiter (Frontend - `/front`)
- **What it is:** A beautiful web interface built with React (Vite).
- **What it does:** It interacts with the users. Just like a waiter takes your order, the frontend app asks, "How are you feeling?", accepts your voice input (using SpeechRecognition) or typed text, and hands that message over to the backend.

### 2. The Memory Journal (Backend - `/backend`)
- **What it is:** A lightweight server built in Node.js connected to a MongoDB database.
- **What it does:** It securely logs and Remembers. It tracks who registers or logs in (Authentication), and stores reviews so the Waiter can display user feedback on the history pages.

### 3. The Doctor (AI Bot - `/Bot`)
- **What it is:** A smart Python web service running an Artificial Intelligence brain.
- **What it does:** It acts as the core predictive engine for the app. When "The Waiter" sends it a symptom, it uses an Artificial Neural Network tool to "diagnose" the user, then looks up a cure, and hands the final answer back to the frontend.

---

## 🧠 The Engine: How It Makes Predictions

The real "magic" happens inside a file at **`Bot/app.py`**. 

Inside this file, there is a core pipeline called `predict()`. When the website sends a symptom over to the Python Bot, this exact, simple sequence occurs:

1. **Step 1: Listening for Symptoms**
   The bot takes what you say (e.g., *"I have a headache and a cold"*) and checks it against a giant list of known medical symptoms. If it spots `"headache"`, it isolates that keyword.

2. **Step 2: Asking the Brain (TensorFlow Model)**
   It sends that `"headache"` keyword to a pre-trained ML model (`mlp_model.h5`). It asks, *"If someone has a headache, what disease do they most likely have?"*
   The brain returns the name of a disease (e.g., `"Migraine"`, or `"Common Cold"`).

3. **Step 3: Finding the Treatment (Wikipedia)**
   It instantly queries the Medical Wikipedia servers for that disease name to retrieve a clean, 3-sentence summary of clinical treatments.

4. **Step 4: Returning the Answer**
   The text is securely passed back to the Waiter, where the frontend app then reads it aloud to the user using text-to-speech!

---

## 🚀 Running the Project

If you want to run this project on your own machine, you need to turn on all three workers in three different terminal tabs:

### 1. Start the Memory Journal (Database)
1. Open a terminal and navigate (`cd`) into the `backend/` folder.
2. Ensure you have MongoDB installed and running on your local machine.
3. Run `npm install` and then `npm start`.
   > It should say: `Server running on port 5000`

### 2. Start the Doctor (AI Bot)
1. Open a terminal and navigate (`cd`) into the `Bot/` folder.
2. Run `pip install tensorflow flask python-dotenv flask-cors wikipedia joblib numpy`
3. Run `python app.py`
   > It should say: `Running on http://0.0.0.0:5001/`

### 3. Start the Waiter (Frontend App)
1. Open a terminal and navigate (`cd`) into the `front/` folder.
2. Run `npm install` and then `npm run dev`
3. Go to `http://localhost:5173` in your web browser.

You are now ready to chat with Baymax! 🔴
Voice or Type these 5 phrases into the chat:
Sample #1 (Common Illness)

"I have a severe headache, I'm shivering, and I have a high fever."

Sample #2 (Heart Issues)

"I am experiencing heavy chest pain, sweating, and difficulty breathing."

Sample #3 (Digestive Issues)

"My stomach hurts badly, I feel nauseous, and I keep vomiting all day."

Sample #4 (Allergies or Skin Reactions)

"I have an incredibly itchy skin rash, sneezing, and continuous watering eyes."

Sample #5 (Stress/Fatigue)

"I am feeling extremely dizzy, I've lost my appetite, and I have terrible back pain."