const { UserPost,  Category, Profile, UserPostImages, User} = require('../models');
const haversine = require('haversine'); // Import Haversine for distance calculation
const { Op } = require('sequelize');




/*
CREATING : SINGLE -  Users Post or JOB posting.
*/
exports.createUserPost = async (req, res) => {
  try {
    const userId = req.user.user_id;  
    console.log(userId+":isuserid")

    const user=await User.findByPk(userId);
    console.log("USER : "+JSON.stringify(user))
    const categoryid = req.body.category_id;
    console.log("CAT ID :"+categoryid)
    const cate=await Category.findByPk(categoryid.toString());
    console.log("category : "+JSON.stringify(cate))

    const postData = {
      ...req.body,
      user_id: userId.toString() 
    };

    // console.log("post data : "+JSON.stringify(postData))

    const post = await UserPost.create(postData);

    // Optional: handle history logging in background
    // setImmediate(() => SaveHistory(post));

    res.status(201).json({ status: true, message: "Post Created", data: post });
  } catch (err) {
    console.error(err)
    res.status(400).json({ status: false, message: `Failed to Create Post! ${err}` });
  }
};

/*
GETTING : ALL - Users Posts
*/
// GET /posts?page=2&limit=5&sort=-createdAt

exports.getAllPosts = async (req, res) => {
  try {
    // Parse query params
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const sortQuery = req.query.sort || 'createdAt';

    const offset = (page - 1) * limit;

    const sortField = sortQuery.replace(/^-/, '');
    const sortOrder = sortQuery.startsWith('-') ? 'DESC' : 'ASC';

    const { count, rows: posts } = await UserPost.findAndCountAll({
      limit,
      offset,
      order: [[sortField, sortOrder]]
    });

    const totalPages = Math.ceil(count / limit);

    res.status(200).json({
      totalItems: count,
      totalPages,
      currentPage: page,
      posts
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch posts' });
  }
};


/*
GETTING : singe - User Post
*/
exports.getUserPost = async (req, res, next) => {
  const postId = req.params.post_id;

  if (!postId) {
    return res.status(400).json({ message: "Post ID is required" });
  }

  try {
    const post = await UserPost.findOne({
      where: { id: postId },
    });

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    return res.status(200).json({
      message: "Post retrieved successfully",
      data: post,
    });

  } catch (err) {
    return next(err);
  }
};



/*

DELETING : Post with post_id
Validating User is Owner for this post.
*/
exports.deletePost = async (req, res, next) => {
  const postId = req.params.post_id;
  const userId = req.user?.user_id;

  if (!userId) {
    return res.status(401).json({ message: "User not authenticated" });
  }

  if (!postId) {
    return res.status(400).json({ message: "Post ID is required" });
  }

  try {
    const userPost = await UserPost.findOne({
      where: {
        id: postId,
        user_id: userId,
      },
    });

    if (!userPost) {
      return res.status(404).json({ message: "Post not found or access denied" });
    }

    await userPost.destroy();

    return res.status(200).json({
      message: "Post deleted successfully",
      data: userPost, // No need to wrap in array
    });

  } catch (err) {
    next(err); // Forward error to global error handler
  }
};


exports.updatePost = async (req, res) => {
  const userId = req.user.user_id;
  const postId = req.params.post_id;
  const updatedPostData = req.body;

  if (!userId) {
    return res.status(401).json({ message: 'User credentials missing!' });
  }

  if (!postId) {
    return res.status(400).json({ message: 'Post ID is required!' });
  }

  try {
    const post = await UserPost.findByPk(postId);

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    if (post.user_id !== userId) {
      return res.status(403).json({ message: 'You are not authorized to update this post' });
    }

    await post.update(updatedPostData);

    return res.status(200).json({
      message: "Post updated successfully",
      data: post
    });

  } catch (error) {
    console.error('Error updating post:', error);
    res.status(500).json({ message: 'Failed to update post' });
  }
};




//  NEARBY POSTS
const { getBoundingBox, getDistanceFromLatLonInKm } = require('../utils/location.util');

exports.getNearbyPosts = async (req, res) => {
  let { lat, long, radius = 10, page = 1, limit = 10 } = req.query;

  lat = parseFloat(lat);
  long = parseFloat(long);
  radius = parseFloat(radius);
  page = parseInt(page);
  limit = parseInt(limit);
  const offset = (page - 1) * limit;

  if (!lat || !long) {
    return res.status(400).json({ error: 'Latitude and longitude are required.' });
  }

  const bounds = getBoundingBox(lat, long, radius);

  try {
    const { count, rows } = await UserPost.findAndCountAll({
      where: {
        is_show: true,
        location_lat: { [Op.between]: [bounds.minLat, bounds.maxLat] },
        location_long: { [Op.between]: [bounds.minLon, bounds.maxLon] },
        status : "pending"
      },
      attributes : ["category_id","title", "description","location_lat","location_long","createdAt"],
      offset,
      limit,
    });

    // Filter posts based on actual distance within the bounding box
    const filtered = rows.filter(post => {
      const distance = getDistanceFromLatLonInKm(
        lat,
        long,
        parseFloat(post.location_lat),
        parseFloat(post.location_long)
      );
      return distance <= radius;
    });

    res.json({
      total: count,
      currentPage: page,
      totalPages: Math.ceil(count / limit),
      results: filtered,
    });
  } catch (error) {
    console.error('Error fetching nearby posts:', error);
    res.status(500).json({ error: 'Internal server error.' });
  }
};






exports.getPostContacts = async (req, res) => {
  const n=1;

}