import React, { useEffect, useState } from "react";

let rawApiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
if (rawApiUrl.endsWith('/')) rawApiUrl = rawApiUrl.slice(0, -1);
const API_URL = rawApiUrl.endsWith('/api') ? rawApiUrl : `${rawApiUrl}/api`;

// A styled star rating component
const StarRating = ({ rating }) => {
  const fullStars = Math.floor(rating);
  const emptyStars = 5 - fullStars;
  return (
    <div className="flex items-center gap-1">
      {[...Array(fullStars)].map((_, i) => (
        <span key={`full-${i}`} className="text-amber-400 text-lg">★</span>
      ))}
      {[...Array(emptyStars)].map((_, i) => (
        <span key={`empty-${i}`} className="text-slate-200 text-lg">★</span>
      ))}
      <span className="ml-2 text-sm font-bold text-slate-500">{rating}/5</span>
    </div>
  );
};

const Testimonials = () => {
  const [feedbacks, setFeedbacks] = useState([]);

  useEffect(() => {
    fetch(`${API_URL}/review/getall`)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          const sorted = data.sort((a, b) => b.rating - a.rating);
          setFeedbacks(sorted);
        }
      })
      .catch(err => console.error("Failed to load testimonials:", err));
  }, []);

  if (feedbacks.length === 0) {
    return (
      <div className="text-center py-12 sm:py-16">
        <div className="w-16 h-16 mx-auto mb-6 bg-slate-100 rounded-full flex items-center justify-center">
          <span className="text-2xl">💬</span>
        </div>
        <p className="text-slate-400 font-bold text-sm uppercase tracking-widest">No reviews yet</p>
        <p className="text-slate-300 text-sm mt-2">Be the first to share your experience!</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-8 mt-6 sm:mt-8">
      {feedbacks.map((item) => (
        <div
          key={item._id}
          className="bg-white p-5 sm:p-8 rounded-2xl sm:rounded-3xl border border-slate-100 shadow-[0_8px_30px_rgba(0,0,0,0.04)] hover:shadow-[0_16px_40px_rgba(224,60,49,0.08)] hover:border-red-100 transition-all duration-500"
        >
          <p className="text-slate-700 mb-4 sm:mb-6 text-sm sm:text-base leading-relaxed font-medium italic">
            "{item.comment}"
          </p>
          <StarRating rating={item.rating} />
          {item.userName && (
            <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-slate-50 flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center text-white font-bold text-xs">
                {item.userName.charAt(0).toUpperCase()}
              </div>
              <p className="text-sm text-slate-500 font-semibold">{item.userName}</p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default Testimonials;
