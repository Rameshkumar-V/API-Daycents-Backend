const { Sequelize } = require('sequelize');
const { UserPost,  Category, Profile,  SaveHistroy, UserPostImages, User } = require('../models');
const haversine = require('haversine'); // Import Haversine for distance calculation
const { uploadFileFromBuffer } = require('../utils/fileService.js');

function generateShortUniqueFilename() {
  const now = Date.now().toString(36); // Convert current timestamp to base-36 string
  const random = Math.random().toString(36).substring(2, 7); // Short random string
  return `${now}-${random}`;
}

// Example usage:
const shortUniqueName = generateShortUniqueFilename();
console.log(shortUniqueName); // Output will be something like: 1l2o3p4q-abcde
exports.createUserPostImg = async (req, res) => {
 
    const {post_id : postId} = req.params;
    if (!postId) { return res.status(401).json({message:"Post Id Missing!"}); }
    
    const post = await UserPost.findByPk(postId.toString());
    if (!post) {  return res.status(404).json({message:"Post  Not Found !"}); }
    
    if (!req.files || Object.keys(req.files).length === 0) {
      return res.status(400).json({message:'No files were uploaded.'});
    }
    const uploadedImages = [];
    for (const file of req.files) {
      const uniqueName = generateShortUniqueFilename();
      const remoteFileName = `uploads/file_${postId}_${uniqueName}`;
      const img_url = await uploadFileFromBuffer(file.buffer, remoteFileName, file.mimetype);
      console.log("img url"+img_url);
      try{
        const img=await UserPostImages.create(
          {
            post_id: 1,
            image_url : img_url
          })
        uploadedImages.push({
          "img_url":img.image_url,
          "status" :"uploaded"
        })
      }catch(error){
        uploadedImages.push({
          "img_url":null,
          "status" :"unuploaded",
          "error":error
        })
      }
    }
    res.status(201).json({message:"Image Uploaded Successfully",data:[uploadedImages]});
}

exports.deleteUserPostImg = async (req, res) => {

  const imgId =  req.params.post_id;

  // if(!userId){
  //   return res.status(404).json({message : "Opps, User Missing!"})
  // }
  
  const userPostImg = await UserPostImages.find(
    {
      where : {id : imgId}
    }
  );

  if(!userPostImg){
    return res.status(404).json({message : "Opps, Image Not Found!"})
  }

  
  await userPostImg.destroy()
  return res.status(204).json({message : "Image Deleted Successfully", data : [userPostImg]});
  
};


/*
CREATING : SINGLE -  Users Post or JOB posting.
*/
exports.createUserPost = async (req, res) => {


  try {
    const post = await UserPost.create(req.body);
    // setImmediate(SaveHistroy(post))
    res.status(201).json(post); // History Saving : Run history log in background
  } catch (err) {
    res.status(400).json({ status:false, message:`Failed to Create Post ! ${err}` });
  }
};

/*
GETTING : ALL - Users Posts
*/
exports.getAllUserPosts = async (req, res) => {
  try {
    const posts = await UserPost.findAll({
      include: ['User', 'Category']
    });
    res.json(posts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/*
GETTING : singe - User Post
*/
exports.getUserPost = async (req, res) => {
  const postId =  req.params.post_id;
  
  try {
    const posts = await UserPost.find({
      where : {  id : postId}
    });

    if(!posts){
      res.status(404).json({message : "Opps, Post Not Found!"})
    }

     res.status(200).json({message : "Post Getted Successfully", data : [posts]});

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


async function GetNearByPosts(latitude, longitude, radius){
    // Fetch all posts with their user profile and category information
    const posts = await UserPost.findAll({
      include: [
        {
          model: Profile,
          as: 'Profile', // Make sure this matches the alias defined in your associations
          attributes: ['location_lat', 'location_long', 'name'],
        },
        {
          model: Category,
          as: 'Category', // Include category for additional post information
          attributes: ['name'],
        }
      ],
    });

    // Filter the posts based on proximity (within the radius provided)
    const nearbyPosts = posts.filter(post => {
      // Get the post's location from the Profile model
      const postLocation = {
        latitude: post.User.location_lat,
        longitude: post.User.location_long,
      };
      
      const userLocation = {
        latitude: parseFloat(latitude), // Get the user's location
        longitude: parseFloat(longitude),
      };

      
      const distance = haversine(userLocation, postLocation, { unit: 'kilometer' });  // Calculate the distance using the Haversine formula

      // Only include posts within the specified radius
      return distance <= parseFloat(radius); // Radius is a dynamic parameter (default 10 km)
    });
    return nearbyPosts;
}
// Controller to get nearby posts with dynamic radius
exports.getNearbyPosts = async (req, res) => {
  // await sendToUser(user.expoPushToken, title, body, data);
  const { latitude, longitude, radius = 10 } = req.query;  // Get latitude, longitude, and radius from query params

  if (!latitude || !longitude) {
    return res.status(400).json({ error: 'Latitude and Longitude are required' });
  }
  const nearbypost = await GetNearByPosts(latitude,longitude,radius);
  res.status(200).json({status:true, message:"Data Retrived Successfully", data: nearbypost});
};


/*

DELETING : Post with post_id
Validating User is Owner for this post.
*/
exports.deletePost = async (req, res) => {

  const postId =  req.params.post_id;
  const userId =  req.user.user_id;

  if(!userId){
    res.status(404).json({message : "Opps, User Missing!"})
  }
  console.log("Post id : "+postId);
  
  const userPost = await UserPost.find(
    {
      where : {user_id : userId, id : postId}
    }
  );

  if(!userPost){
    res.status(404).json({message : "Opps, Post Not Found!"})
  }

  console.log("is User Valid: "+(userPost));
  
  await userPost.destroy()
  res.status(204).json({message : "Post Deleted Successfully", data : [userPost]});
  
};


exports.updatePost= async (req, res) => {
  const userId = req.user.id;
  const updatedPostData = req.body;

  if(!userId){
    return res.status(404).json({ message: 'Credentials Missing !' });
  }

  try {
    const post = await UserPost.findByPk(postId);
    const isValid = post.user_id == userId ? true:false;

    if(!isValid){
      return res.status(404).json({ message: 'You are not able to access this Record' });
    }

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    await post.update(updatedPostData);

    const updatedPost = await UserPost.findByPk(userId);
    res.status(200).json(updatedPost);
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ message: 'Failed to update user' });
  }
};


exports.getPostHistroyByUserId= async (req, res) => {
  
  try {
    const userId = req.params.user_id;
    if(!userId){
      return res.status(401).json({"message":"User Id Missing!"});
    }
    const posts = await UserPost.findAll({
      where : {"user_id":userId},
      attributes: ['id','status',],
      include: [{
        model: Category,
        attributes: ['name'],
        as: 'Category', 
      }],
    });
    
   return res.status(200).json({message:"Getted Posts Histroy Successfully",data : [await posts.map(e=>e.toJSON())]});
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: 'Error fetching Post Histroy!', error });
  }
};



