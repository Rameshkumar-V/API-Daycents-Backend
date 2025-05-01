const express = require('express');
const router = express.Router();
const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage: storage,limits: { fileSize: 5 * 1024 * 1024 } });

const userPostController = require('../controllers/userPost.controller');
// , upload.array('files', 3)
router.post('/', userPostController.createUserPost);
router.put('/:id', userPostController.updatePost);
router.delete('/:id', userPostController.deletePost);
router.get('/', userPostController.getAllUserPosts);
router.get('/:id', userPostController.getUserPost);

// ✅ NEW: Nearby posts API
router.get('/nearby', userPostController.getNearbyPosts);
router.post('/:post_id/image', upload.array('files', 3), userPostController.createUserPostImg);
router.delete('/:post_id/image', userPostController.deleteUserPostImg);
module.exports = router;
