const { UserPost,  Category, User, PostIsShow, UserTakenWorks} = require('../models');
const haversine = require('haversine'); // Import Haversine for distance calculation
const { Op, where } = require('sequelize');
const {userNotificationStore} = require("./notifications.controller");
const { buildFilters, buildPaginationAndSorting } = require('../utils/queryBuilder');

exports.isShow = async (req,res,next) =>{
  try {
    const postIsShow = await PostIsShow.findOne();
    return res.status(201).json({"data":postIsShow,message:"Is Post Show or Not"})
  } catch (error) {
    next(error);
    
  }
}


exports.postRequests = async (req, res, next) =>{
  try {
    const {post_id} = req.params;
    const { count, rows: users }  = await UserTakenWorks.findAndCountAll({
      where:{
        post_id : post_id
      }
    });
    return res.status(201).json({"data":
      {users: users,count: count},
      message:"Posts Requests Succcessfully getted"
    })
    
    
  } catch (error) {
    next(error)
  }
}

exports.postIsShowUpdate = async (req,res,next) =>{
  
    try {
      const { is_show } = req.body;
  
      // Find or create the record by UUID
      const [postIsShow] = await PostIsShow.findOrCreate({
        where: { id: 'f07b9142-794f-44c8-af29-18c82c4f0210' },
        defaults: { is_show },
      });
  
      // Update the value even if it was just created or already existed
      postIsShow.is_show = is_show;
      await postIsShow.save();
  
      return res.status(201).json({ data: postIsShow });
    } catch (error) {
      next(error);
    }
 
  
}
/*
CREATING : SINGLE -  Users Post or JOB posting.
*/
exports.createUserPost = async (req, res) => {
  try {
    const userId = req.user.user_id;  

    const user=await User.findByPk(userId);
    const postData = {
      ...req.body,
        "user_id": userId,
        
      
    };

    const post = await UserPost.create(postData);

    setImmediate(()=>userNotificationStore(
      user_id=userId,
      status='SUCCESS',
      title="Post Creation",
      message="Post Created Successfully"))

    res.status(201).json({ status: true, message: "Post Created", data: post });
  } catch (err) {
    console.error(err)
    res.status(400).json({ status: false, message: `Failed to Create Post! ${err}` });
  }
};

/*
GETTING : ALL - Users Posts
*/
exports.getAllPosts = async (req, res) => {
  try {
    const allowedFields = [
      'category_id', 'user_id', 'status', 'amount',
      'title', 'pincode', 'is_show', 'job_date'
    ];

    const allowedRelations = {
      user: ['name', 'email_id'],
      category: ['name']
    };

    const { baseFilters, includeFilters } = buildFilters(req.query, allowedFields, allowedRelations);
    const { pagination, sort, meta } = buildPaginationAndSorting(req.query);
    
    // RELATIONS
    const includes = [];

    if (includeFilters.user) {
      includes.push({
        model: User,
        as: 'user',
        where: includeFilters.user,
        required: true
      });
    }

    if (includeFilters.category) {
      includes.push({
        model: Category,
        as: 'category',
        where: includeFilters.category,
        required: true
      });
    }

    const { count, rows: posts } = await UserPost.findAndCountAll({
      where: baseFilters,
      include: includes,
      limit: pagination.limit,
      offset: pagination.offset,
      order: sort
    });

    res.status(200).json({
      totalItems: count,
      totalPages: Math.ceil(count / pagination.limit),
      currentPage: meta.page,
      data: posts
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
    console.log("ERROR : 🔴 "+err)
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
    setImmediate(()=>{
      if(req.user.roleName == "ADMIN" && post.is_show===false){
        userNotificationStore(
              expoPushToken=req.user.expoPushToken || '',
              user_id=post.user_id,
              status='CANCEL',
              title="Post Banned",
              message="Your post was banned due to fake or misleading information including address sharing.")
      }
    })

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
  console.log("GET NEARBY POSTS : "+lat+long)

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
      // attributes : ["category_id","title", "description","location_lat","location_long","createdAt","job_date","amount"],
      offset,
      limit,
      raw:true
    });

    // console.log("row="+JSON.stringify(rows));

    const postsWithDistance = rows.map(post => {
      const distance = getDistanceFromLatLonInKm(
        lat,
        long,
        parseFloat(post.location_lat),
        parseFloat(post.location_long)
      );
      return { ...post, 'distance':distance };
    });
    // console.log("post with distance= "+JSON.stringify(postsWithDistance));
    
    const filtered = postsWithDistance.filter(post => post.distance <= radius);
    // console.log("f="+JSON.stringify(filtered));
    
    res.json({
      total: count,
      currentPage: page,
      totalPages: Math.ceil(count / limit),
      data: filtered,
    });
  } catch (error) {
    console.error('Error fetching nearby posts:', error);
    res.status(500).json({ error: 'Internal server error.' });
  }
};






exports.getPostContacts = async (req, res) => {
  const n=1;

}