import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
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

  const handleSubmit = async () => {
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
          // Registration succeeded but no token (fallback)
          setIsSignIn(true);
          setError("Registration successful! Please sign in.");
        }
      } else {
        setError(data.error || "Authentication failed");
      }
    } catch (err) {
      console.error("Error:", err);
      setError("Server error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Left side - Image/Gif (Hidden on small screens) */}
      <div className="hidden md:flex w-1/2 bg-[#E03C31] items-center justify-center p-12 overflow-hidden relative">
        <div className="z-10 text-white text-center">
          <h1 className="text-5xl font-extrabold mb-4 drop-shadow-md">Welcome Back</h1>
          <p className="text-xl font-light text-white/90">Your personal healthcare companion awaits.</p>
        </div>
        <img
          src={baymaxGif}
          alt="Baymax"
          className="absolute bottom-0 w-[120%] h-auto object-cover opacity-90 drop-shadow-2xl mix-blend-screen"
        />
        {/* Decorative elements */}
        <div className="absolute top-10 left-10 w-32 h-32 bg-white rounded-full mix-blend-overlay opacity-20 blur-2xl"></div>
        <div className="absolute bottom-1/2 right-0 w-64 h-64 bg-black rounded-full mix-blend-overlay opacity-10 blur-3xl"></div>
      </div>

      {/* Right side - Form */}
      <div className="w-full md:w-1/2 flex flex-col items-center justify-center p-6 bg-white relative">
        <div className="w-full max-w-md">
          {/* Mobile only icon/header */}
          <div className="md:hidden text-center mb-8">
            <h1 className="text-4xl font-extrabold text-[#E03C31]">BAYMAX</h1>
            <p className="text-gray-500 mt-2">Healthcare Companion</p>
          </div>

          <div className="bg-white p-8 sm:p-10 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 w-full">
            <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">
              {isSignIn ? "Sign In" : "Create Account"}
            </h2>

            {error && (
              <div className="bg-red-50 text-[#E03C31] p-3 rounded-lg mb-6 text-sm text-center border border-red-100">
                {error}
              </div>
            )}

            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
                <input
                  type="text"
                  placeholder="Enter your username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#E03C31] focus:border-transparent outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                <input
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#E03C31] focus:border-transparent outline-none transition-all"
                />
              </div>

              <button
                onClick={handleSubmit}
                disabled={loading}
                className="w-full bg-[#E03C31] text-white p-4 rounded-xl font-bold text-lg hover:bg-red-700 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:hover:translate-y-0 mt-4"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                    Processing...
                  </span>
                ) : (
                  isSignIn ? "Login" : "Register"
                )}
              </button>
            </div>

            <div className="mt-8 text-center">
              <p className="text-gray-600">
                {isSignIn ? "Don't have an account?" : "Already have an account?"}{" "}
                <button
                  className="text-[#E03C31] font-bold hover:underline"
                  onClick={() => { setIsSignIn(!isSignIn); setError(""); }}
                >
                  {isSignIn ? "Sign Up" : "Sign In"}
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AuthPage;
