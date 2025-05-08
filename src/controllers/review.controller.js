const { Review, UserPost } = require('../models');

exports.createOrUpdateReview = async (req, res, next) => {
  try {
    const { user_id, post_id, rating, review } = req.body;

    if (!user_id || !post_id || !rating) {
      return res.status(400).json({ error: 'user_id, post_id, and rating are required' });
    }

    const isAssociated = await UserPost.findOne({
      where: {
        id: post_id,
        user_id: user_id
      }
    });

    if (!isAssociated) {
      return res.status(403).json({ error: 'You are not authorized to review this post' });
    }

    const [reviewRecord, created] = await Review.upsert(
      { user_id, post_id, rating, review },
      { returning: true }
    );

    res.status(200).json({
      message: created ? 'Review created' : 'Review updated',
      review: reviewRecord
    });

  } catch (err) {
    next(err);
  }
};



exports.getReviewsByPost = async (req, res, next) => {
  try {
    const { post_id } = req.params;

    const reviews = await Review.findAll({
      where: { post_id },
      order: [['createdAt', 'DESC']]
    });

    res.status(200).json({ post_id, reviews });

  } catch (err) {
    next(err);
  }
};

exports.getAverageRating = async (req, res, next) => {
  try {
    const { post_id } = req.params;

    const { avg } = await Review.findOne({
      attributes: [
        [Review.sequelize.fn('AVG', Review.sequelize.col('rating')), 'avg']
      ],
      where: { post_id },
      raw: true
    });

    res.status(200).json({ post_id, average_rating: parseFloat(avg || 0).toFixed(2) });

  } catch (err) {
    next(err);
  }
};

exports.getReviewsByUser = async (req, res, next) => {
  const { user_id } = req.params;

  try {
    if (!user_id) {
      return res.status(400).json({ error: 'User ID is required' });
    }

    const reviews = await Review.findAll({
      where: { user_id },
      include: [
        {
          model: UserPost,
          attributes: ['id', 'title','createdAt']
        }
      ],
      order: [['createdAt', 'DESC']]
    });

    res.status(200).json({
      user_id,
      total_reviews: reviews.length,
      reviews
    });

  } catch (err) {
    next(err);
  }
};

