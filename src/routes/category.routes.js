const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/category.controller');
const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage: storage,limits: { fileSize: 1 * 1024 * 1024 } });
const { 
    validateCategoryId, 
    validateCreateCategory, 
    validateUpdateCategory 
  } = require('../validators/categoryValidator');
const {isAdmin} = require('../middleware/auth.middleware');
const validateRequest = require('../middleware/validateRequest');
// Category



router.post('/',isAdmin, upload.single('image'),validateCreateCategory, validateRequest, categoryController.createCategory);
router.get('/', categoryController.getAllCategories);
router.get('/:category_id', validateCategoryId, validateRequest, categoryController.getCategory);
router.put('/:category_id',isAdmin,upload.single('image'),validateUpdateCategory,  categoryController.updateCategory);
router.delete('/:category_id',isAdmin, validateCategoryId, validateRequest, categoryController.deleteCategory)





module.exports = router;
