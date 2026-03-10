
import React, { useState } from "react";
import { addMessageToChat, submitReview } from "../api/chatApi";
import { Star } from "lucide-react";
import { toast } from "react-toastify";

let __BOT_URL = import.meta.env.VITE_BOT_URL || "http://localhost:5001";
if (__BOT_URL.endsWith('/')) __BOT_URL = __BOT_URL.slice(0, -1);
const BOT_URL = __BOT_URL;

const ChatWindow = ({ section, sectionIndex, refresh }) => {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [showReview, setShowReview] = useState(false);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");
  if (!section) {
    return (
      <div className="flex-1 p-6 bg-slate-50 flex items-center justify-center h-full">
        <div className="text-center bg-white p-12 rounded-3xl shadow-xl max-w-lg border border-slate-200 flex flex-col items-center">
          <div className="w-24 h-24 bg-[#E03C31] rounded-full flex items-center justify-center text-white font-bold text-5xl mb-6 shadow-[0_0_20px_rgba(224,60,49,0.3)]">
            B
          </div>
          <h2 className="text-3xl font-bold text-slate-800 tracking-wide mb-3">Welcome to BAYMAX</h2>
          <p className="text-slate-500 mb-8 text-lg">Your AI Healthcare Assistant. Select a chat from the sidebar or start a new one to begin diagnosing symptoms.</p>
          <div className="flex items-center space-x-2 text-[#E03C31] font-medium bg-red-50 px-6 py-3 rounded-full border border-red-100">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            <span>Click "New Chat" to start</span>
          </div>
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
        const botText = response.ok
          ? `**🩺 Predicted Disease:**\n${data.predicted_disease}\n\n**💊 Treatment Recommendation:**\n${data.treatment_recommendation}`
          : `❌ Error: ${data.error}`;

        await addMessageToChat(sectionIndex, "bot", botText);

        const utterance = new SpeechSynthesisUtterance(botText.replace(/[\n\u{1F53A}\u{1FA7A}\u{1F48A}\u{274C}]/gu, ''));
        utterance.lang = 'en-US';
        utterance.onstart = () => setIsSpeaking(true);
        utterance.onend = () => setIsSpeaking(false);
        window.speechSynthesis.speak(utterance);
      } catch {
        await addMessageToChat(sectionIndex, "bot", "❌ Server error.");

        const utterance = new SpeechSynthesisUtterance("Server error occurred.");
        utterance.lang = 'en-US';
        utterance.onstart = () => setIsSpeaking(true);
        utterance.onend = () => setIsSpeaking(false);
        window.speechSynthesis.speak(utterance);
      }

      setLoading(false);
      refresh();
    }
  };

  const handleVoiceInput = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      toast.error("Your browser does not support voice input.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      setIsSpeaking(true);
      toast.success("Listening...", { icon: "🎤" });
    };

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setMessage((prev) => (prev ? prev + " " + transcript : transcript));
    };

    recognition.onerror = (event) => {
      console.error("Speech recognition error", event.error);
      toast.error("Microphone error or not allowed.");
    };

    recognition.onend = () => {
      setIsSpeaking(false);
    };

    recognition.start();
  };

  const handleReviewSubmit = async () => {
    if (!rating || !comment.trim()) {
      toast.error("Please provide both a rating and a comment.");
      return;
    }
    try {
      await submitReview(rating, comment);
      toast.success("Review submitted!");
      setShowReview(false);
      setRating(0);
      setComment("");
    } catch {
      toast.error("Failed to submit review.");
    }
  };


  return (
    <div className="relative w-full bg-slate-50 flex items-center justify-center p-4 h-screen">

      {/* Chat Window */}
      <div className="w-full max-w-5xl h-[95vh] bg-white shadow-2xl rounded-2xl overflow-hidden flex flex-col border border-slate-200">

        {/* Title Bar */}
        <div className="bg-[#E03C31] text-white flex items-center px-6 py-4 shadow-md z-10">
          <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-[#E03C31] font-bold text-xl mr-4 shadow-sm">
            B
          </div>
          <div>
            <h2 className="text-xl font-bold tracking-wide">BAYMAX Assistant</h2>
            <p className="text-red-100 text-sm opacity-90">Always here to help</p>
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 p-6 flex flex-col overflow-y-auto bg-slate-50/50">
          <div className="flex-1 overflow-y-auto mb-4 space-y-6 scrollbar-thin scrollbar-thumb-slate-300">
            {section.messages.map((msg, index) => (
              <div
                key={index}
                className={`flex items-end max-w-[85%] ${msg.sender === "user" ? "self-end ml-auto" : "self-start"}`}
              >
                {/* Bot Icon */}
                {msg.sender === "bot" && (
                  <div className="w-8 h-8 rounded-full bg-[#E03C31] text-white flex items-center justify-center text-sm font-bold mr-3 shadow-md flex-shrink-0">
                    B
                  </div>
                )}

                {/* Message Bubble */}
                <div
                  className={`p-4 rounded-2xl shadow-sm text-[15px] leading-relaxed ${msg.sender === "user"
                    ? "bg-[#E03C31] text-white rounded-br-none"
                    : "bg-white border border-slate-200 text-slate-800 rounded-bl-none"
                    }`}
                  dangerouslySetInnerHTML={{
                    __html: msg.text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\n/g, '<br/>')
                  }}
                />

                {/* User Icon */}
                {msg.sender === "user" && (
                  <div className="w-8 h-8 rounded-full bg-slate-800 text-white flex items-center justify-center text-sm font-bold ml-3 shadow-md flex-shrink-0">
                    U
                  </div>
                )}
              </div>
            ))}
            {loading && (
              <div className="flex items-end max-w-[85%] self-start animate-fade-in-up">
                <div className="w-8 h-8 rounded-full bg-[#E03C31] text-white flex items-center justify-center text-sm font-bold mr-3 shadow-md flex-shrink-0">
                  B
                </div>
                <div className="bg-white border border-slate-200 text-slate-500 p-4 rounded-2xl rounded-bl-none shadow-sm flex items-center gap-2">
                  <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                </div>
              </div>
            )}
          </div>

          <div className="flex items-center space-x-3 bg-white p-2 rounded-2xl shadow-sm border border-slate-200 focus-within:ring-2 focus-within:ring-[#E03C31]/20 focus-within:border-[#E03C31] transition-all">
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
              placeholder="Type your symptoms here..."
              rows={1}
              className="flex-1 bg-transparent border-none focus:ring-0 p-3 resize-none outline-none max-h-32 min-h-[44px]"
            />
            <button
              onClick={handleVoiceInput}
              className="text-slate-400 hover:text-[#E03C31] p-2 rounded-full hover:bg-red-50 transition"
              title="Voice Input"
            >
              {isSpeaking ? (
                <span className="relative flex h-5 w-5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#E03C31] opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-5 w-5 bg-[#E03C31]"></span>
                </span>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 01-3-3V4.5a3 3 0 116 0v8.25a3 3 0 01-3 3z" />
                </svg>
              )}
            </button>
            <button
              onClick={handleSend}
              disabled={loading || !message.trim()}
              className="bg-[#E03C31] text-white p-3 rounded-xl hover:bg-red-700 transition disabled:opacity-50 shadow-md group"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 group-hover:translate-x-1 transition-transform">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Floating Star Button */}
      <button
        onClick={() => setShowReview(!showReview)}
        className="fixed bottom-4 right-4 bg-yellow-400 text-white p-3 rounded-full shadow-lg hover:bg-yellow-500 z-50"
      >
        <Star className="w-5 h-5" />
      </button>

      {/* Review Box */}
      {showReview && (
        <div className="fixed bottom-20 right-4 w-80 bg-white p-4 rounded-lg shadow-xl border z-50">
          <h3 className="text-lg font-semibold mb-2">Leave a Review</h3>
          <div className="flex mb-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={`w-6 h-6 cursor-pointer ${(hoverRating || rating) >= star ? "text-yellow-400" : "text-gray-300"
                  }`}
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
                onClick={() => setRating(star)}
              />
            ))}
          </div>
          <textarea
            rows={3}
            className="w-full border border-gray-300 rounded-md p-2 mb-2"
            placeholder="Write your comment..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
          <div className="flex justify-between">
            <button
              onClick={handleReviewSubmit}
              className="bg-red-500 text-white px-4 py-1 rounded-md hover:bg-red-600"
            >
              Submit
            </button>
            <button
              onClick={() => setShowReview(false)}
              className="text-gray-600 hover:underline"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatWindow;
