import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { setAuthToken } from "../utils/auth";
import baymaxGif from "../assets/OnVZ.gif";

let rawApiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
if (rawApiUrl.endsWith('/')) rawApiUrl = rawApiUrl.slice(0, -1);
const API_URL = rawApiUrl.endsWith('/api') ? rawApiUrl : `${rawApiUrl}/api`;

function AuthPage() {
  const [isSignIn, setIsSignIn] = useState(true);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e?.preventDefault();
    setError("");

    if (!username.trim() || !password.trim()) {
      setError("Please fill in all fields.");
      return;
    }

    if (!isSignIn && password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    const url = isSignIn
      ? `${API_URL}/auth/login`
      : `${API_URL}/auth/register`;

    setLoading(true);
    try {
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (res.ok) {
        if (data.token) {
          setAuthToken(data.token);
          navigate("/home");
        } else {
          setIsSignIn(true);
          setError("Registration successful! Please sign in.");
          setUsername("");
          setPassword("");
        }
      } else {
        setError(data.error || "Authentication failed.");
      }
    } catch (err) {
      console.error("Error:", err);
      setError("Server error. Please ensure the backend is connected to the database.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center bg-no-repeat relative font-sans px-3 sm:px-6 lg:px-8 overflow-hidden"
      style={{ backgroundImage: `url(${baymaxGif})` }}
    >
      {/* Dark overlay for better readability */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-[2px] z-0"></div>

      {/* Back to Home */}
      <button
        onClick={() => navigate("/")}
        className="absolute top-4 left-4 sm:top-6 sm:left-6 z-20 flex items-center gap-2 text-white/70 hover:text-white transition-colors text-sm font-medium"
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
          <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
        </svg>
        Back
      </button>

      {/* Form Container */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md relative z-10"
      >
        <div className="bg-white/95 backdrop-blur-md rounded-2xl sm:rounded-[2rem] p-6 sm:p-8 md:p-10 shadow-[0_20px_60px_rgba(0,0,0,0.5)] border border-white/20 w-full">
          {/* Header Title inside the form */}
          <div className="text-center mb-6 sm:mb-8">
            <h1 className="text-3xl sm:text-4xl font-extrabold text-red-600 tracking-tight drop-shadow-sm mb-1">BAYMAX</h1>
            <p className="text-gray-500 font-medium text-sm">Healthcare Companion</p>
          </div>

          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-2 border-b border-gray-100 pb-3 sm:pb-4">
            {isSignIn ? "Welcome Back" : "Create Account"}
          </h2>
          <p className="text-gray-500 mb-5 sm:mb-6 text-sm">
            {isSignIn ? "Please enter your details to sign in." : "Sign up securely to get started."}
          </p>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`p-3 sm:p-4 rounded-xl mb-4 sm:mb-6 text-sm font-medium border ${error.includes("successful") ? "bg-green-50 text-green-700 border-green-200" : "bg-red-50 text-red-600 border-red-200"}`}
            >
              {error}
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5 sm:mb-2">Username</label>
              <input
                type="text"
                placeholder="e.g. johndoe"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-3.5 sm:px-4 py-3 sm:py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-4 focus:ring-red-600/10 focus:border-red-600 focus:bg-white outline-none transition-all duration-200 text-sm sm:text-base"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5 sm:mb-2">Password</label>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3.5 sm:px-4 py-3 sm:py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-4 focus:ring-red-600/10 focus:border-red-600 focus:bg-white outline-none transition-all duration-200 text-sm sm:text-base"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-red-600 text-white py-3.5 sm:py-4 rounded-xl font-bold text-base sm:text-lg hover:bg-red-700 shadow-md hover:shadow-[0_8px_20px_rgba(220,38,38,0.4)] hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-70 disabled:hover:translate-y-0 disabled:hover:shadow-none mt-2 sm:mt-4 flex items-center justify-center gap-3"
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                  Processing...
                </>
              ) : (
                isSignIn ? "Sign In" : "Register"
              )}
            </button>
          </form>

          <div className="mt-6 sm:mt-8 text-center border-t border-gray-200 pt-4 sm:pt-6">
            <p className="text-gray-600 font-medium text-sm">
              {isSignIn ? "Don't have an account?" : "Already have an account?"}{" "}
              <button
                type="button"
                className="text-red-600 font-bold hover:text-red-800 transition-colors ml-1"
                onClick={() => { setIsSignIn(!isSignIn); setError(""); }}
              >
                {isSignIn ? "Sign Up" : "Sign In"}
              </button>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default AuthPage;
