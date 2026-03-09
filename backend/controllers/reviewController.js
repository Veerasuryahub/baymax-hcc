const Review = require('../models/Review');

exports.createReview = async (req, res) => {
  const { rating, comment } = req.body;
  const userId = req.user._id;
  const userName = req.user.username; // Fixed: use 'username' (matches User model)

  if (!rating || !comment) {
    return res.status(400).json({ error: 'Rating and comment are required' });
  }

  if (rating < 1 || rating > 5) {
    return res.status(400).json({ error: 'Rating must be between 1 and 5' });
  }

  try {
    const review = new Review({ userId, userName, rating, comment });
    await review.save();
    res.status(201).json({ message: 'Review created successfully', review });
  } catch (error) {
    console.error('Review creation error:', error);
    res.status(500).json({ error: 'Failed to create review' });
  }
};

exports.getAllReviews = async (req, res) => {
  try {
    const reviews = await Review.find().sort({ createdAt: -1 });
    res.json(reviews);
  } catch (error) {
    console.error('Review fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch reviews' });
  }
};
