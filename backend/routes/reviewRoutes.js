const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/reviewController');
const auth = require('../middleware/auth');

// POST /api/reviews - create a new review (auth required)
router.post('/', auth, reviewController.createReview);

// GET /api/reviews - get all reviews (public)
router.get('/getall', reviewController.getAllReviews);

module.exports = router;
