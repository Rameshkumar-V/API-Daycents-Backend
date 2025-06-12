const { uploadFileFromBuffer, deleteFileByName } = require('../services/File.service.js');
const  generateShortUniqueFilename  = require('../utils/uniqueFilename.js')
const { UserPost, UserPostImages} = require('../models');

exports.createUserPostImg = async (req, res,next) => {
  try {
    
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
        const img = await UserPostImages.create(
          {
            post_id: postId,
            image_url : img_url
          })
        uploadedImages.push({
          "id":img.id,
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
   return res.status(201).json({message:"Image Uploaded Successfully",data:[uploadedImages]});
  } catch (error) {
    console.log("ERROR : 🔴 "+ error);
    next(error);
    
  }
}

exports.deleteUserPostImg = async (req, res, next) => {
  try {
    

  const imgId =  req.params.image_id;
  // const postId = req.params.post_id;
  
  const userPostImg = await UserPostImages.findByPk(imgId);
  if(!userPostImg) {  return res.status(404).json({message : "Opps, Image Not Found!"}); }

  const image_name ="uploads/" + userPostImg.image_url.toString().split('/').pop().toString();
  const deleteFile= await deleteFileByName(image_name);
  
  if(!deleteFile){ return res.status(400).json({message:'File Upload Failed, due to Deletion.'}); }
  await userPostImg.destroy();

  res.status(201).json({message : "Image Deleted Successfully", data : [userPostImg]});
} catch (error) {
  console.log("ERROR : 🔴 "+ error);
  next(error);
}

  
};

exports.updatePostImage= async (req, res) =>{
  
    const {post_id : postId} = req.params;
    const {image_id : imageId}= req.params;

    if (!postId) { return res.status(401).json({message:"Post Id Missing!"}); }
    if (!imageId) { return res.status(401).json({message:"Image Id Missing!"}); }
    
    const post = await UserPost.findByPk(postId.toString());
    if (!post) {  return res.status(404).json({message:"Post  Not Found !"}); }

    const image = await UserPostImages.findByPk(imageId);
    if (!post) {  return res.status(404).json({message:"Image  Not Found !"}); }
    
    if (!req.files || Object.keys(req.files).length === 0) { return res.status(400).json({message:'No files were uploaded.'}); }
    
    console.log("img url"+image.image_url);
    
    const image_name ="uploads/" + image.image_url.toString().split('/').pop().toString();
    console.log("image name : "+image_name);
    // return true;
    const deleteFile= await deleteFileByName(image_name);
    console.log(deleteFile+"=delete file");
    if(!deleteFile){ return res.status(400).json({message:'File Upload Failed, due to Deletion.'}); }
    
    const uploadedImages = [];
    for (const file of req.files) {
      const uniqueName = generateShortUniqueFilename();
      const remoteFileName = `uploads/file_${postId}_${uniqueName}`;
      const img_url = await uploadFileFromBuffer(file.buffer, remoteFileName, file.mimetype);
      // console.log("img url"+img_url);
      try{
        
        image.image_url =img_url;
        await image.update();
  
        uploadedImages.push({
          "image_id":image.id,
          "img_url":image.image_url,
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
    res.status(201).json({message:"Image Updated Successfully",data:[uploadedImages]});
  
  }
  
  
  
exports.getPostImages= async (req, res) => {
    const postId =  req.params.post_id;
    if (!postId) { return res.status(401).json({message:"Post Id Missing!"}); }
  
    
    try {
      const posts_images = await UserPostImages.findOne({
        where : {  post_id : postId}
      });
  
      if(!posts_images){
        return res.status(404).json({message : "Opps, Post Not Found!"})
      }
  
       return res.status(200).json({message : "Post Getted Successfully", data : [posts_images]});
  
    } catch (err) {
      console.log(err);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  };
  
