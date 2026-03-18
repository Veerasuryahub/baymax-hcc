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
    <div className="text-white font-sans selection:bg-red-500/30">
      {/* Navbar */}
      <header className="fixed top-0 w-full z-50 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-8 py-4 bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 shadow-[0_8px_32px_rgba(0,0,0,0.1)] transition-all">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center text-red-600 font-black text-lg shadow-inner">B</div>
            <h1 className="text-xl font-black tracking-widest text-white">BAYMAX</h1>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex space-x-12 text-sm font-bold uppercase tracking-widest text-slate-100/80">
            <a href="#home" className="hover:text-white transition-colors relative group">
              Home
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-white transition-all group-hover:w-full"></span>
            </a>
            <a href="#features" className="hover:text-white transition-colors relative group">
              Features
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-white transition-all group-hover:w-full"></span>
            </a>
            <a href="#about" className="hover:text-white transition-colors relative group">
              About
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-white transition-all group-hover:w-full"></span>
            </a>
          </nav>

          {/* Sign In / Up Button */}
          <div className="hidden md:block">
            <button
              onClick={() => navigate("/auth")}
              className="bg-white text-slate-900 px-8 py-2.5 rounded-xl font-bold text-sm tracking-wide hover:bg-slate-100 hover:shadow-xl hover:-translate-y-0.5 transition-all shadow-md"
            >
              Initialize Access
            </button>
          </div>

          {/* Mobile Toggle Button */}
          <button className="lg:hidden p-2 text-white" onClick={handleToggle}>
            {menuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="lg:hidden mt-4 px-8 py-10 space-y-6 bg-slate-900/95 backdrop-blur-2xl rounded-3xl border border-white/10 shadow-2xl animate-fade-in-down">
            <a href="#home" onClick={handleToggle} className="block text-2xl font-black tracking-tight">Home</a>
            <a href="#features" onClick={handleToggle} className="block text-2xl font-black tracking-tight">Features</a>
            <a href="#about" onClick={handleToggle} className="block text-2xl font-black tracking-tight">About</a>
            <button
              onClick={() => {
                navigate("/auth");
                handleToggle();
              }}
              className="block bg-red-600 text-white w-full py-5 rounded-2xl font-bold text-xl"
            >
              Sign In / Up
            </button>
          </div>
        )}
      </header>

      {/* Hero Section */}
      <section id="home" className="min-h-screen bg-[#0f1012] flex flex-col lg:flex-row items-center justify-center overflow-hidden relative px-6 md:px-20 py-20">
        
        {/* Advanced Background Elements */}
        <div className="absolute inset-0 z-0">
          <div className="absolute top-[-20%] right-[-10%] w-[800px] h-[800px] bg-red-600/20 rounded-full blur-[160px] animate-pulse"></div>
          <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[140px]"></div>
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-[0.03] pointer-events-none"></div>
        </div>

        {/* Left Text */}
        <div className="z-10 max-w-2xl text-center lg:text-left mt-8 lg:mt-0 flex flex-col items-center lg:items-start lg:w-1/2">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-block px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-red-500 text-xs font-black uppercase tracking-[0.3em] mb-6 shadow-xl"
          >
            Clinical Grade AI Bot • v1.0
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-5xl md:text-8xl font-black mb-8 leading-[0.9] tracking-tighter"
          >
            I am <br /><span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-red-600">BAYMAX</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-xl md:text-2xl mb-12 font-medium max-w-lg text-slate-400 leading-relaxed"
          >
            Your personal healthcare companion — bridging the gap between clinical data and human care.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="flex flex-col sm:flex-row justify-center lg:justify-start gap-6 w-full sm:w-auto"
          >
            <button
              onClick={() => navigate("/auth")}
              className="bg-gradient-to-r from-red-600 to-red-500 text-white font-black px-12 py-5 rounded-2xl shadow-[0_20px_40px_rgba(224,60,49,0.3)] hover:shadow-[0_25px_50px_rgba(224,60,49,0.45)] hover:scale-105 active:scale-95 transition-all text-lg tracking-wide uppercase"
            >
              Start Triage
            </button>
            <button
              onClick={() => navigate("/auth")}
              className="bg-white/5 border-2 border-white/10 px-12 py-5 rounded-2xl font-black hover:bg-white hover:text-red-600 hover:shadow-2xl transition-all text-lg tracking-wide uppercase"
            >
              Whitepaper
            </button>
          </motion.div>
        </div>

        {/* Right Side - Baymax Character */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.2, ease: "circOut" }}
          className="flex items-center justify-center relative lg:w-1/2 mt-16 lg:mt-0"
        >
          <div className="absolute inset-0 bg-red-600/5 rounded-full blur-[100px] scale-150 animate-pulse"></div>
          <img
            src={baymaxImg}
            alt="Baymax"
            className="w-[300px] md:w-[500px] lg:w-[600px] object-contain drop-shadow-[0_40px_80px_rgba(0,0,0,0.5)] z-10 transition-transform duration-700 ease-in-out hover:scale-110"
          />
        </motion.div>
      </section>

      {/* Features Section */}
      <section id="features" className="bg-white text-slate-900 py-32 px-6 md:px-20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-24">
             <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="text-4xl md:text-6xl font-black mb-6 tracking-tight text-slate-900"
            >
              Why Trust <span className="text-red-500">BAYMAX</span>?
            </motion.h2>
            <p className="text-slate-500 font-bold text-lg max-w-2xl mx-auto uppercase tracking-widest">Advanced Neural Diagnostic Systems</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: "🧠", title: "Smart AI Chatbot", desc: "Get instant symptom analysis powered by deep learning neural networks trained on clinical data." },
              { icon: "💊", title: "Evidence-Based", desc: "Every recommendation is cross-referenced with verified medical documentation and protocols." },
              { icon: "🩺", title: "Real-time Support", desc: "24/7 availability for triage, mental health check-ins, and health monitoring." },
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 * index }}
                className="p-10 bg-slate-50 rounded-[40px] border border-slate-100 hover:bg-white hover:border-red-100 hover:shadow-[0_32px_64px_rgba(224,60,49,0.1)] transition-all duration-500 group"
              >
                <div className="text-6xl mb-8 group-hover:scale-110 transition-transform">{feature.icon}</div>
                <h3 className="text-2xl font-black mb-4 text-slate-900">{feature.title}</h3>
                <p className="text-slate-500 leading-relaxed font-medium">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-slate-50 py-32">
         <div className="max-w-7xl mx-auto px-6">
            <h2 className="text-3xl font-black text-center mb-16 tracking-widest uppercase text-slate-400">Trusted Worldwide</h2>
            <Testimonials />
         </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-24 px-6">
        <div className="max-w-7xl mx-auto flex flex-col items-center">
          <div className="w-20 h-20 rounded-3xl bg-red-600 flex items-center justify-center text-white font-black text-4xl mb-10 shadow-2xl">B</div>
          <h3 className="text-4xl md:text-6xl font-black mb-12 text-center tracking-tight">Your health is our <br/><span className="text-red-500">priority.</span></h3>
          <button
            onClick={() => navigate("/auth")}
            className="bg-white text-slate-900 px-12 py-5 rounded-3xl font-black text-xl hover:bg-red-600 hover:text-white transition-all shadow-2xl"
          >
            Access Baymax Now
          </button>
          <div className="mt-24 pt-12 border-t border-white/5 w-full flex flex-col md:flex-row justify-between items-center gap-6">
            <p className="text-slate-500 font-bold tracking-widest text-xs uppercase">© 2025 Baymax Healthcare Systems</p>
            <div className="flex gap-12 text-xs font-black uppercase tracking-widest text-slate-500">
               <a href="#" className="hover:text-red-500 transition-colors">Privacy</a>
               <a href="#" className="hover:text-red-500 transition-colors">Compliance</a>
               <a href="#" className="hover:text-red-500 transition-colors">Contact</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default LandingPage;
