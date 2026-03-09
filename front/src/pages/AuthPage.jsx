import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { setAuthToken } from "../utils/auth";

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
    <div
      className="min-h-screen flex flex-col items-center justify-center p-6"
      style={{
        background: "linear-gradient(135deg, #ef4444 0%, #dc2626 50%, #b91c1c 100%)",
      }}
    >
      <div className="bg-white/90 p-8 rounded-xl shadow-xl w-full max-w-md backdrop-blur-sm">
        <h2 className="text-2xl font-bold text-center mb-6">
          {isSignIn ? "Sign In" : "Sign Up"} to BAYMAX
        </h2>

        {error && <div className="text-red-500 mb-4 text-center text-sm">{error}</div>}

        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
          className="w-full mb-4 p-3 border rounded-md"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
          className="w-full mb-4 p-3 border rounded-md"
        />
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full bg-red-500 text-white p-3 rounded-md hover:bg-red-600 transition disabled:opacity-50"
        >
          {loading ? "Please wait..." : (isSignIn ? "Login" : "Register")}
        </button>

        <p className="mt-4 text-sm text-center text-gray-700">
          {isSignIn ? "Don't have an account?" : "Already have an account?"}{" "}
          <span
            className="text-red-500 cursor-pointer font-semibold"
            onClick={() => { setIsSignIn(!isSignIn); setError(""); }}
          >
            {isSignIn ? "Sign Up" : "Sign In"}
          </span>
        </p>
      </div>
    </div>
  );
}

export default AuthPage;
