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
      // Fallback message indicating the backend needs DB access
      setError("Server error. Please ensure the backend is connected to the database.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center bg-no-repeat relative font-sans px-4 sm:px-6 lg:px-8"
      style={{ backgroundImage: `url(${baymaxGif})` }}
    >
      {/* Dark overlay for better readability */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-[2px] z-0"></div>

      {/* Form Container */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md relative z-10"
      >
        <div className="bg-white/95 backdrop-blur-md rounded-[2rem] p-8 sm:p-10 shadow-[0_20px_60px_rgba(0,0,0,0.5)] border border-white/20 w-full">
          {/* Header Title inside the form */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-extrabold text-red-600 tracking-tight drop-shadow-sm mb-1">BAYMAX</h1>
            <p className="text-gray-500 font-medium">Healthcare Companion</p>
          </div>

          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2 border-b border-gray-100 pb-4">
            {isSignIn ? "Welcome Back" : "Create Account"}
          </h2>
          <p className="text-gray-500 mb-6 text-sm sm:text-base">
            {isSignIn ? "Please enter your details to sign in." : "Sign up securely to get started."}
          </p>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`p-4 rounded-xl mb-6 text-sm font-medium border ${error.includes("successful") ? "bg-green-50 text-green-700 border-green-200" : "bg-red-50 text-red-600 border-red-200"}`}
            >
              {error}
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Username</label>
              <input
                type="text"
                placeholder="e.g. johndoe"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-4 focus:ring-red-600/10 focus:border-red-600 focus:bg-white outline-none transition-all duration-200"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Password</label>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-4 focus:ring-red-600/10 focus:border-red-600 focus:bg-white outline-none transition-all duration-200"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-red-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-red-700 shadow-md hover:shadow-[0_8px_20px_rgba(220,38,38,0.4)] hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-70 disabled:hover:translate-y-0 disabled:hover:shadow-none mt-4 flex items-center justify-center gap-3"
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

          <div className="mt-8 text-center border-t border-gray-200 pt-6">
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
