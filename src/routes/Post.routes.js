const express = require('express');
const router = express.Router();


// MULTER USED FOR FILE HANDLING
const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage: storage,limits: { fileSize: 5 * 1024 * 1024 } });

const handleValidation = require('../middleware/validateRequest');
const userPostController = require('../controllers/userPost.controller');
const userPostImageController = require('../controllers/postImages.controller');
const {
    createPostValidator,
    updatePostValidator,
    deletePostValidator,
    getPostValidator
  } = require('../validators/userPostValidator');
  
const {
      validateGetImages,
      validateCreateImages,
      validateDeleteImage,
      validateUpdateImage
    } = require('../validators/postImageValidator');
  
// POSTS ROUTERS
router.post('/',
  createPostValidator,
  handleValidation,   
  userPostController.createUserPost);

router.put('/:post_id',
  updatePostValidator,
  handleValidation,  
  userPostController.updatePost);

router.delete('/:post_id', 
  deletePostValidator, 
  handleValidation, 
  userPostController.deletePost 
);

router.get('/', 
  userPostController.getAllPosts  
);

router.get('/nearby', 
  userPostController.getNearbyPosts
);
router.get('/:post_id',
  getPostValidator, 
  handleValidation, 
  userPostController.getUserPost  
);

  
// POSTS IMAGE ROUTERS
router.get('/:post_id/images',
  validateGetImages, 
  handleValidation,
  userPostImageController.getPostImages 
);

router.post('/:post_id/images', 
  validateCreateImages, 
  handleValidation, 
  upload.array('files', 3), 
  userPostImageController.createUserPostImg 
);

router.delete('/images/:image_id',
  validateDeleteImage, 
  handleValidation, 
  userPostImageController.deleteUserPostImg 
);
  
router.patch('/images/:image_id',
  validateUpdateImage, 
  handleValidation, 
  upload.array('files', 1), 
  userPostImageController.updatePostImage 
)
// // payment to show contact
// router.post('/posts/:post_id/contact',userPostController.getPostContacts)
module.exports = router;
