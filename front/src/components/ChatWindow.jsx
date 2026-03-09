
import React, { useState } from "react";
import { addMessageToChat, submitReview } from "../api/chatApi";
import { Star } from "lucide-react";
import { toast } from "react-toastify";

const BOT_URL = import.meta.env.VITE_BOT_URL || "http://localhost:5001";

const ChatWindow = ({ section, sectionIndex, refresh }) => {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [showReview, setShowReview] = useState(false);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");

  if (!section) return <div className="flex-1 p-6">Select a chat</div>;

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
          ? `🩺 Predicted Disease: ${data.predicted_disease}\n💊 Treatment: ${data.treatment_recommendation}`
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
    <div className="relative w-full bg-gray-100 flex items-center justify-center px-4">
      <div
        className="absolute inset-0 flex items-center justify-center pointer-events-none select-none"
        style={{
          zIndex: 0,
          fontSize: "18rem",
          fontWeight: "bold",
          color: "rgba(255, 49, 49, 0.1)",
          filter: "blur(6px)",
          userSelect: "none",
          whiteSpace: "nowrap",
        }}
      >
        BAYMAX
      </div>

      {/* Chat Window */}
      <div
        className="w-full max-w-4xl h-[90vh] bg-white shadow-lg rounded-xl overflow-hidden flex flex-col"
        style={{ zIndex: 10, position: "relative" }}
      >
        {/* Title Bar */}
        <div className="bg-red-500 text-white text-center text-xl font-bold p-4 rounded-t-xl">
          BAYMAX Health Assistant 🩺
        </div>

        <div className="flex-1 p-4 flex flex-col overflow-y-auto">
          <div className="flex-1 overflow-y-auto mb-4 space-y-2">
            {section.messages.map((msg, index) => (
              <div
                key={index}
                className={`flex items-start max-w-[75%] ${msg.sender === "user" ? "self-end ml-auto" : "self-start"
                  }`}
              >
                {/* Bot icon on left */}
                {msg.sender === "bot" && (
                  <div className="w-8 h-8 rounded-full bg-red-500 text-white flex items-center justify-center text-sm font-bold mr-2 flex-shrink-0">B</div>
                )}

                {/* Message bubble */}
                <div
                  className={`whitespace-pre-line p-3 rounded-lg ${msg.sender === "user"
                    ? "bg-red-500 text-white"
                    : "bg-gray-100 text-gray-800"
                    }`}
                >
                  {msg.text}
                </div>

                {/* User icon on right */}
                {msg.sender === "user" && (
                  <div className="w-8 h-8 rounded-full bg-gray-500 text-white flex items-center justify-center text-sm font-bold ml-2 flex-shrink-0">U</div>
                )}
              </div>
            ))}
            {loading && (
              <div className="bg-gray-100 text-gray-800 p-3 rounded-lg max-w-[75%] self-start animate-pulse">
                ⏳ Analyzing your symptoms...
              </div>
            )}
          </div>

          <div className="flex items-center space-x-2 mt-2">
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
              placeholder="Type or speak your symptoms..."
              rows={2}
              className="flex-1 border border-gray-300 rounded-md p-3 resize-none"
            />
            <button
              onClick={handleSend}
              disabled={loading}
              className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition disabled:opacity-50"
            >
              Send
            </button>
            <button
              onClick={handleVoiceInput}
              className="bg-white text-red-500 border border-red-500 px-3 py-2 rounded-md hover:bg-red-100 transition"
            >
              {isSpeaking ? "🔊" : "🎤"}
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
