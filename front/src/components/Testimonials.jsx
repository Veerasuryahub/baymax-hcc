import React, { useEffect, useState } from "react";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

// A simple component to display stars
const StarRating = ({ rating }) => {
  const fullStars = Math.floor(rating);
  const emptyStars = 5 - fullStars;
  return (
    <div className="flex items-center">
      {[...Array(fullStars)].map((_, i) => (
        <span key={i} className="text-yellow-500 text-lg">★</span>
      ))}
      {[...Array(emptyStars)].map((_, i) => (
        <span key={i} className="text-gray-300 text-lg">★</span>
      ))}
      <span className="ml-2 text-sm text-gray-700">{rating}/5</span>
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
      <div className="text-center text-gray-500 mt-8 py-8">
        <p>No reviews yet. Be the first to share your experience!</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left mt-8">
      {feedbacks.map((item) => (
        <div key={item._id} className="bg-red-100 p-6 rounded-xl">
          <p className="mb-4">"{item.comment}"</p>
          <StarRating rating={item.rating} />
          {item.userName && (
            <p className="mt-2 text-sm text-gray-600 font-medium">— {item.userName}</p>
          )}
        </div>
      ))}
    </div>
  );
};

export default Testimonials;
