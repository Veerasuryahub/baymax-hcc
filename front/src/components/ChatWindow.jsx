
import React, { useState } from "react";
import { addMessageToChat, submitReview } from "../api/chatApi";
import { Star, Plus, Send, Mic, Volume2, Circle, CheckCircle2, AlertCircle, Info } from "lucide-react";
import { toast } from "react-toastify";

let __BOT_URL = import.meta.env.VITE_BOT_URL || "http://localhost:5001";
if (__BOT_URL.endsWith('/')) __BOT_URL = __BOT_URL.slice(0, -1);
const BOT_URL = __BOT_URL;

const ChatWindow = ({ section, sectionIndex, refresh, onNewChat }) => {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [showReview, setShowReview] = useState(false);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");
  if (!section) {
    return (
      <div className="flex-1 p-8 bg-[#f8fafc] flex items-center justify-center h-full relative overflow-hidden">
        {/* Decorative Background Elements */}
        <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-[#E03C31]/5 rounded-full blur-[120px] animate-pulse"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-500/5 rounded-full blur-[120px]"></div>

        <div className="text-center z-10 bg-white/70 backdrop-blur-2xl p-16 rounded-[40px] shadow-[0_32px_64px_-12px_rgba(0,0,0,0.08)] max-w-xl border border-white/40 flex flex-col items-center transition-all hover:scale-[1.02] duration-500">
          <div className="relative mb-10 w-32 h-32">
            <div className="absolute inset-0 bg-[#E03C31] rounded-full blur-2xl opacity-20 animate-pulse"></div>
            <div className="relative w-full h-full bg-gradient-to-br from-[#E03C31] to-[#ff6b6b] rounded-full flex items-center justify-center text-white font-bold text-6xl shadow-[0_20px_40px_rgba(224,60,49,0.4)] border-4 border-white">
              B
            </div>
          </div>
          <h2 className="text-4xl font-extrabold text-slate-900 tracking-tight mb-4">Hello, I'm <span className="text-[#E03C31]">BAYMAX</span></h2>
          <p className="text-slate-500 mb-10 text-xl leading-relaxed font-light">
            Your personal AI healthcare companion. <br />
            Select a session or start a new triage to begin.
          </p>
          <button 
            onClick={onNewChat}
            className="flex items-center space-x-3 text-white font-semibold bg-[#E03C31] px-10 py-5 rounded-2xl hover:bg-red-600 transition-all shadow-lg hover:shadow-red-200 active:scale-95 group"
          >
            <Plus className="w-6 h-6 group-hover:rotate-90 transition-transform duration-300" />
            <span>Initialize Triage</span>
          </button>
        </div>
      </div>
    );
  }

  const handleSend = async () => {
    if (message.trim()) {
      const userMessage = message;
      setMessage("");
      setLoading(true);

      await addMessageToChat(sectionIndex, "user", userMessage);

      try {
        const response = await fetch(`${BOT_URL}/predict`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ sentence: userMessage }),
        });

        const data = await response.json();
        
        let botText;
        if (response.ok) {
          botText = `**🩺 Prediction:** ${data.predicted_disease}\n\n**💊 Advice:** ${data.treatment_recommendation}`;
        } else {
          // If the bot returns a specific error (like no symptoms found), show it cleanly
          botText = data.error || "I encountered an error processing your request.";
          if (!botText.startsWith("❌")) botText = `❌ ${botText}`;
        }

        await addMessageToChat(sectionIndex, "bot", botText);

        // Synthesize speech (cleaned up Markdown)
        const voiceText = botText.replace(/\*\*(.*?)\*\*/g, '$1').replace(/❌/g, 'Error').replace(/🩺/g, 'Prediction').replace(/💊/g, 'Advice');
        const utterance = new SpeechSynthesisUtterance(voiceText);
        utterance.lang = 'en-US';
        utterance.onstart = () => setIsSpeaking(true);
        utterance.onend = () => setIsSpeaking(false);
        window.speechSynthesis.speak(utterance);
      } catch (err) {
        console.error("Fetch error:", err);
        await addMessageToChat(sectionIndex, "bot", "❌ Server Connection Error. Please ensure the AI Bot is online.");
      }

      setLoading(false);
      refresh();
    }
  };

  // ... rest of the logic (voice input, review) ...

  return (
    <div className="relative w-full bg-[#f8fafc] flex items-center justify-center h-full overflow-hidden">
      {/* Mesh Gradient Background */}
      <div className="absolute top-0 left-0 w-full h-full opacity-[0.03] pointer-events-none" style={{ backgroundImage: `radial-gradient(circle at 20% 20%, #E03C31 0%, transparent 40%), radial-gradient(circle at 80% 80%, #3b82f6 0%, transparent 40%)` }}></div>

      {/* Main Container */}
      <div className="w-full h-full flex flex-col relative z-10">

        {/* Modern Header */}
        <div className="bg-white/80 backdrop-blur-md border-b border-slate-200/60 flex items-center justify-between px-8 py-5 flex-shrink-0">
          <div className="flex items-center">
            <div className="relative mr-4">
              <div className="w-12 h-12 bg-gradient-to-br from-[#E03C31] to-[#ff6b6b] rounded-2xl flex items-center justify-center text-white font-bold text-2xl shadow-lg ring-4 ring-red-50">
                B
              </div>
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900 tracking-tight">BAYMAX-1.0</h2>
              <div className="flex items-center text-xs font-semibold uppercase tracking-wider text-slate-400">
                <span className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></span>
                System Active
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="hidden sm:block text-right">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-1">Clinic Status</p>
              <p className="text-sm font-bold text-[#E03C31]">Online & Ready</p>
            </div>
          </div>
        </div>

        {/* Messages Container */}
        <div className="flex-1 overflow-y-auto px-6 py-8 scroll-smooth scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-transparent">
          <div className="max-w-4xl mx-auto space-y-10">
            {section.messages.map((msg, index) => (
              <div
                key={index}
                className={`flex w-full group ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
              >
                <div className={`flex max-w-[85%] sm:max-w-[75%] ${msg.sender === "user" ? "flex-row-reverse" : "flex-row"}`}>
                  
                  {/* Avatar */}
                  <div className={`flex-shrink-0 mt-1 ${msg.sender === "user" ? "ml-4" : "mr-4"}`}>
                    <div className={`w-10 h-10 rounded-2xl flex items-center justify-center text-sm font-bold shadow-md transition-transform group-hover:scale-110 ${
                      msg.sender === "user" ? "bg-slate-800 text-white" : "bg-gradient-to-br from-[#E03C31] to-[#ff6b6b] text-white"
                    }`}>
                      {msg.sender === "user" ? "U" : "B"}
                    </div>
                  </div>

                  {/* Bubble */}
                  <div className={`relative flex flex-col ${msg.sender === "user" ? "items-end" : "items-start"}`}>
                    <div
                      className={`px-5 py-4 rounded-3xl shadow-[0_4px_20px_rgba(0,0,0,0.03)] text-[15px] leading-relaxed transition-all ${
                        msg.sender === "user"
                          ? "bg-slate-900 text-white rounded-tr-none"
                          : "bg-white border border-slate-100/80 text-slate-800 rounded-tl-none"
                      } ${msg.text.startsWith("❌") ? "!bg-red-50 !border-red-100 !text-red-800" : ""}`}
                    >
                      <div 
                        dangerouslySetInnerHTML={{
                          __html: msg.text.replace(/\*\*(.*?)\*\*/g, '<strong class="text-blue-500">$1</strong>').replace(/\n/g, '<br/>')
                        }}
                      />
                    </div>
                    {/* Timestamp Placeholder / Decorative */}
                    <span className="text-[10px] font-bold text-slate-300 mt-2 uppercase tracking-tighter opacity-0 group-hover:opacity-100 transition-opacity">
                      {msg.sender === "user" ? "Sent" : "Received"}
                    </span>
                  </div>
                </div>
              </div>
            ))}

            {/* Typing Loader */}
            {loading && (
              <div className="flex justify-start">
                <div className="flex max-w-[75%] items-start animate-fade-in-up">
                  <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#E03C31] to-[#ff6b6b] text-white flex items-center justify-center text-sm font-bold mr-4 shadow-md flex-shrink-0">
                    B
                  </div>
                  <div className="bg-white border border-slate-100/80 p-4 rounded-3xl rounded-tl-none shadow-sm flex items-center gap-2">
                    <span className="flex space-x-1">
                      <span className="w-2 h-2 bg-slate-300 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                      <span className="w-2 h-2 bg-slate-300 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                      <span className="w-2 h-2 bg-slate-300 rounded-full animate-bounce"></span>
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Input Area */}
        <div className="p-6 flex-shrink-0 flex justify-center pb-10">
          <div className="w-full max-w-4xl relative">
            <div className="flex items-end gap-3 bg-white p-3 rounded-[32px] shadow-[0_20px_48px_-12px_rgba(0,0,0,0.12)] border border-slate-200/80 transition-all focus-within:ring-4 focus-within:ring-[#E03C31]/10 focus-within:border-[#E03C31]/40">
              
              <button
                onClick={handleVoiceInput}
                className={`p-4 rounded-2xl flex items-center justify-center transition-all ${
                  isSpeaking ? "bg-red-100 text-[#E03C31]" : "text-slate-400 hover:text-[#E03C31] hover:bg-red-50"
                }`}
                title="Voice Input"
              >
                <div className="relative">
                  {isSpeaking && <span className="absolute inset-0 animate-ping bg-red-400 rounded-full opacity-75"></span>}
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-6 h-6 relative z-10">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 01-3-3V4.5a3 3 0 116 0v8.25a3 3 0 01-3 3z" />
                  </svg>
                </div>
              </button>

              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSend();
                  }
                }}
                placeholder="Describe your symptoms (e.g. I have a high fever and muscle pain)..."
                rows={1}
                className="flex-1 bg-transparent border-none focus:ring-0 py-4 px-2 text-slate-800 placeholder-slate-400 font-medium resize-none outline-none max-h-48 overflow-y-auto"
                style={{ height: 'auto', minHeight: '52px' }}
              />

              <button
                onClick={handleSend}
                disabled={loading || !message.trim()}
                className="bg-gradient-to-r from-[#E03C31] to-[#ff6b6b] text-white p-4 rounded-2xl hover:scale-105 active:scale-95 transition-all disabled:opacity-30 disabled:grayscale disabled:scale-100 shadow-[0_10px_20px_rgba(224,60,49,0.3)]"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
                </svg>
              </button>
            </div>
            
            {/* Minimal Footer Info */}
            <p className="text-center text-[10px] text-slate-400 mt-4 leading-none font-bold uppercase tracking-widest">
              AI Triage System • Clinical Reference: Wikipedia Medical API
            </p>
          </div>
        </div>
      </div>

      {/* Floating Star Button */}
      <button
        onClick={() => setShowReview(!showReview)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-tr from-yellow-400 to-amber-500 text-white rounded-[22px] shadow-xl hover:rotate-12 transition-all flex items-center justify-center z-50 ring-4 ring-white"
      >
        <Star className={`w-7 h-7 ${showReview ? "fill-white" : ""}`} />
      </button>

      {/* Modern Review Box */}
      {showReview && (
        <div className="fixed bottom-24 right-6 w-80 bg-white/90 backdrop-blur-2xl p-6 rounded-3xl shadow-[0_20px_40px_rgba(0,0,0,0.15)] border border-white z-50 animate-fade-in-up">
          <h3 className="text-xl font-bold text-slate-900 mb-4">Feedback</h3>
          <div className="flex mb-6 space-x-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={`w-7 h-7 cursor-pointer transition-colors ${(hoverRating || rating) >= star ? "text-yellow-400 fill-yellow-400" : "text-slate-200"
                  }`}
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
                onClick={() => setRating(star)}
              />
            ))}
          </div>
          <textarea
            rows={3}
            className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 mb-4 focus:ring-2 focus:ring-[#E03C31]/20 focus:border-[#E03C31] outline-none transition-all text-sm font-medium"
            placeholder="Tell us about your experience..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
          <div className="flex space-x-3">
            <button
              onClick={handleReviewSubmit}
              className="flex-1 bg-[#E03C31] text-white py-3 rounded-xl font-bold hover:bg-red-600 transition shadow-lg shadow-red-100"
            >
              Send
            </button>
            <button
              onClick={() => setShowReview(false)}
              className="px-4 py-3 text-slate-500 font-bold hover:bg-slate-100 rounded-xl transition"
            >
              Later
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatWindow;

export default ChatWindow;
