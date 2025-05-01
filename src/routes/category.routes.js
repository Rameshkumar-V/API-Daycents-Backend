const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/category.controller');

router.post('/', categoryController.createCategory);
router.get('/', categoryController.getAllCategories);
router.get('/:category_id', categoryController.getCategory);
router.delete('/:category_id',categoryController.deleteCategory)

module.exports = router;
