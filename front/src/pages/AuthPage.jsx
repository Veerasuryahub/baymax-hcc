import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { setAuthToken } from "../utils/auth";
import baymaxGif from "../assets/OnVZ.gif";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

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
    <div className="min-h-screen flex bg-gray-50 flex-col md:flex-row font-sans">
      {/* Left side - Stunning Marketing Banner (Hidden on mobile) */}
      <div className="hidden md:flex flex-col w-1/2 bg-red-600 relative overflow-hidden items-center justify-center p-10 shadow-2xl z-10">

        {/* Background Decorative Blur Orbs */}
        <div className="absolute top-[-10%] left-[-10%] w-[400px] h-[400px] bg-white rounded-full mix-blend-overlay opacity-20 blur-[100px] pointer-events-none"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-red-900 rounded-full mix-blend-multiply opacity-40 blur-[120px] pointer-events-none"></div>

        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="z-20 text-center mt-10"
        >
          <h1 className="text-5xl lg:text-6xl font-extrabold text-white mb-6 drop-shadow-md tracking-tight">
            BAYMAX
          </h1>
          <p className="text-lg lg:text-xl font-medium text-red-100 max-w-sm mx-auto leading-relaxed border-t border-red-400 pt-6">
            Your personal AI healthcare companion, ready to assist you anytime.
          </p>
        </motion.div>

        {/* 3D Image Representation */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.3, duration: 1 }}
          className="relative z-20 mt-12 w-full max-w-sm flex justify-center"
        >
          <img
            src={baymaxGif}
            alt="Baymax Companion"
            className="w-full h-auto object-contain drop-shadow-[0_20px_50px_rgba(0,0,0,0.4)] transition-transform hover:scale-105 duration-500"
          />
        </motion.div>
      </div>

      {/* Right side - Login Form */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-6 sm:p-12 relative bg-white">
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-[420px]"
        >
          {/* Mobile Header (Only visible on small screens) */}
          <div className="md:hidden text-center mb-10">
            <h1 className="text-4xl font-extrabold text-red-600 tracking-tight">BAYMAX</h1>
            <p className="text-gray-500 mt-2 font-medium">Healthcare Companion</p>
          </div>

          <div className="bg-white rounded-[2rem] p-8 sm:p-10 shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-gray-100/60 w-full relative overflow-hidden">
            {/* Soft decorative glow behind form */}
            <div className="absolute -top-20 -right-20 w-40 h-40 bg-red-100 rounded-full blur-[40px] opacity-60"></div>

            <h2 className="text-3xl font-extrabold text-gray-900 mb-2 relative z-10">
              {isSignIn ? "Welcome Back" : "Create Account"}
            </h2>
            <p className="text-gray-500 mb-8 relative z-10">
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

            <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Username</label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="e.g. johndoe"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full px-4 py-3.5 bg-gray-50/50 border border-gray-200 rounded-xl focus:ring-4 focus:ring-red-600/10 focus:border-red-600 focus:bg-white outline-none transition-all duration-200"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Password</label>
                <div className="relative">
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-3.5 bg-gray-50/50 border border-gray-200 rounded-xl focus:ring-4 focus:ring-red-600/10 focus:border-red-600 focus:bg-white outline-none transition-all duration-200"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-red-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-red-700 hover:shadow-[0_8px_20px_rgba(220,38,38,0.3)] hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-70 disabled:hover:translate-y-0 disabled:hover:shadow-none mt-2 flex items-center justify-center gap-3"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                    Processing...
                  </>
                ) : (
                  isSignIn ? "Sign In" : "Register a New Account"
                )}
              </button>
            </form>

            <div className="mt-8 text-center relative z-10 border-t border-gray-100 pt-6">
              <p className="text-gray-500 font-medium">
                {isSignIn ? "Don't have an account?" : "Already have an account?"}{" "}
                <button
                  type="button"
                  className="text-red-600 font-bold hover:text-red-800 transition-colors"
                  onClick={() => { setIsSignIn(!isSignIn); setError(""); }}
                >
                  {isSignIn ? "Sign Up" : "Sign In"}
                </button>
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default AuthPage;
