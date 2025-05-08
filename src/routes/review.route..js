const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/review.controller');

router.post('/', reviewController.createOrUpdateReview);
router.get('/post/:post_id', reviewController.getReviewsByPost);
router.get('/post/:post_id/average', reviewController.getAverageRating);
router.get('/users/:user_id', reviewController.getReviewsByUser);

module.exports = router;
