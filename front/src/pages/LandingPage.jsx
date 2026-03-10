import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import { FaBars, FaTimes } from "react-icons/fa";
import Testimonials from "../components/Testimonials";
import baymaxImg from "../assets/bay.png";

function LandingPage() {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleToggle = () => setMenuOpen(!menuOpen);

  return (
    <div className="text-white font-sans">
      {/* Navbar */}
      <header className="bg-red-500/80 backdrop-blur fixed top-0 w-full z-50 shadow-md">
        <div className="flex items-center justify-between px-6 md:px-16 py-4 relative">
          {/* Logo */}
          <h1 className="text-xl md:text-2xl font-bold text-white z-10">BAYMAX</h1>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex absolute left-1/2 transform -translate-x-1/2 space-x-20 text-white font-medium z-0">
            <a href="#home" className="hover:text-gray-200 transition">Home</a>
            <a href="#features" className="hover:text-gray-200 transition">Features</a>
            <a href="#about" className="hover:text-gray-200 transition">About</a>
          </nav>

          {/* Sign In / Up Button */}
          <div className="hidden md:block z-10">
            <button
              onClick={() => navigate("/auth")}
              className="bg-white text-red-500 px-4 py-2 rounded-md hover:bg-red-100 transition"
            >
              Sign In / Up
            </button>
          </div>

          {/* Mobile Toggle Button */}
          <button className="md:hidden z-10" onClick={handleToggle}>
            {menuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="md:hidden px-6 pb-4 space-y-4 bg-red-500">
            <a href="#home" onClick={handleToggle} className="block">Home</a>
            <a href="#features" onClick={handleToggle} className="block">Features</a>
            <a href="#about" onClick={handleToggle} className="block">About</a>
            <button
              onClick={() => {
                navigate("/auth");
                handleToggle();
              }}
              className="block bg-white text-red-500 w-full py-2 rounded-md"
            >
              Sign In / Up
            </button>
          </div>
        )}
      </header>

      {/* Hero Section */}
      <section id="home" className="pt-24 min-h-screen bg-red-600 flex flex-col md:flex-row items-center justify-between overflow-hidden relative px-6 md:px-16 py-12">
        {/* Left Text */}
        <div className="z-10 max-w-xl text-center md:text-left mt-8 md:mt-0 flex flex-col items-center md:items-start">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-4xl md:text-7xl font-extrabold mb-4 leading-tight tracking-tight drop-shadow-lg"
          >
            Hello, I'm <br /><span className="text-white drop-shadow-xl">BAYMAX</span>
          </motion.h1>

          {/* Chat bubble */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1.2 }}
            className="absolute right-10 bottom-[28%] bg-white text-red-500 px-5 py-3 rounded-xl shadow-xl hidden md:block"
          >
            "Hello! How can I help you today?"
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-lg md:text-2xl mb-8 font-light max-w-lg text-white/90 drop-shadow-sm"
          >
            Your personal healthcare companion — powered by AI & empathy.
          </motion.p>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9 }}
            className="flex justify-center md:justify-start gap-4"
          >
            <button
              onClick={() => navigate("/auth")}
              className="bg-white text-red-600 font-bold px-8 py-4 rounded-full shadow-2xl hover:bg-gray-100 hover:scale-105 transition-all duration-300"
            >
              Sign In
            </button>
            <button
              onClick={() => navigate("/auth")}
              className="border-2 border-white px-8 py-4 rounded-full font-bold hover:bg-white hover:text-red-600 hover:shadow-2xl hover:scale-105 transition-all duration-300 relative overflow-hidden group"
            >
              Sign Up
            </button>
          </motion.div>
        </div>

        {/* Right Side - Baymax Character */}
        <motion.div
          initial={{ x: 300, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 1 }}
          className="flex items-center justify-center relative w-full md:w-1/2 mt-16 md:mt-0 mx-auto"
        >
          <img
            src={baymaxImg}
            alt="Baymax"
            className="w-full sm:w-[80%] md:w-[120%] lg:w-[130%] xl:w-[150%] max-w-none md:-ml-10 lg:-ml-20 drop-shadow-[0_20px_50px_rgba(0,0,0,0.4)] z-10 hover:scale-105 hover:-translate-y-4 transition-all duration-500 cursor-pointer object-contain overflow-visible"
          />
          {/* Soft white glow behind baymax */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 md:w-[500px] md:h-[500px] bg-white rounded-full blur-[100px] opacity-30 pointer-events-none"></div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section id="features" className="bg-white text-gray-900 py-16 px-6 md:px-20 text-center">
        <motion.h2
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-3xl md:text-4xl font-bold mb-10"
        >
          Why Choose <span className="text-red-500">BAYMAX</span>?
        </motion.h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {[
            { icon: "🧠", title: "Smart AI Chatbot", desc: "Get instant symptom analysis powered by neural networks." },
            { icon: "💊", title: "Treatment Suggestions", desc: "Receive evidence-based treatment recommendations." },
            { icon: "🩺", title: "Health Reports & Tips", desc: "Wikipedia-sourced medical information at your fingertips." },
          ].map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 * index }}
              className="p-6 bg-gray-100 rounded-xl shadow hover:shadow-lg transition"
            >
              <div className="text-5xl mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-gray-600 text-sm">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="bg-white text-gray-900 py-16 px-6 md:px-20">
        <h2 className="text-3xl font-bold text-center mb-8">What Users Say</h2>
        <Testimonials />
      </section>

      {/* About Section */}
      <section id="about" className="bg-gray-50 py-16 px-6 md:px-20 text-center text-gray-800">
        <motion.h2
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-3xl md:text-4xl font-bold mb-6"
        >
          About BAYMAX
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-lg max-w-3xl mx-auto"
        >
          BAYMAX is designed to support your well-being by providing personalized care through a friendly AI assistant. Whether you need medical advice, mental support, or daily health monitoring — BAYMAX is always there.
        </motion.p>
      </section>

      {/* Footer */}
      <footer className="bg-red-500 text-white py-10 text-center">
        <h3 className="text-2xl font-semibold mb-4">Ready to get started?</h3>
        <button
          onClick={() => navigate("/auth")}
          className="bg-white text-red-500 px-6 py-3 rounded-xl hover:bg-red-100 transition"
        >
          Join Now
        </button>
        <p className="mt-4 text-sm text-gray-100 italic">© 2025 Baymax Healthcare. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default LandingPage;
