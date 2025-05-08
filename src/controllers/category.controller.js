const { Category,sequelize } = require('../models');
const { uploadFileFromBuffer, deleteFileByName } = require('../services/File.service.js');
const generateShortUniqueFilename  = require('../utils/uniqueFilename.js')


/*
CREATING - Category

*/

exports.createCategory = async (req, res) => {
  const t = await sequelize.transaction(); // Start transaction

  try {
    const { name } = req.body;
    const file = req.file;

    if (!name || !file) {
      return res.status(400).json({ message: 'Name or image file missing.' });
    }

    // 1. Create the category
    const category = await Category.create({ name }, { transaction: t });

    // 2. Upload the file (outside of the transaction)
    const uniqueName = generateShortUniqueFilename();
    const remoteFileName = `uploads/file_${category.id}_${uniqueName}`;
    const img_url = await uploadFileFromBuffer(file.buffer, remoteFileName, file.mimetype);

    // 3. Update category with img_url (optional)
    category.url = img_url;
    await category.save({ transaction: t });

    // 4. Commit transaction if everything succeeds
    await t.commit();

    return res.status(201).json({
      message: 'Category Created Successfully',
      data: { category, img_url }
    });
  } catch (err) {
    await t.rollback(); // Rollback if any error occurs
    console.error('Transaction failed:', err);
    return res.status(500).json({ message: 'Category creation failed.' });
  }
};


// controllers/categoryController.js
exports.getAllCategories = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    const { count, rows: categories } = await Category.findAndCountAll({
      limit,
      offset,
      // order: [['createdAt', 'DESC']] // Optional sorting
    });

    const totalPages = Math.ceil(count / limit);

    return res.status(200).json({
      status: true,
      message: 'Categories fetched successfully',
      data: categories,
      pagination: {
        totalItems: count,
        totalPages,
        currentPage: page
      }
    });
  } catch (err) {
    console.error('Error fetching categories:', err);
    return res.status(500).json({
      status: false,
      message: 'Failed to fetch categories',
      error: err.message
    });
  }
};

exports.getCategory = async (req, res) => {
  const { category_id } = req.params;

  if (!category_id) {
    return res.status(400).json({
      status: false,
      message: 'Category ID is required.'
    });
  }

  try {
    const category = await Category.findByPk(category_id);

    if (!category) {
      return res.status(404).json({
        status: false,
        message: 'Category not found.'
      });
    }

    return res.status(200).json({
      status: true,
      message: 'Category retrieved successfully.',
      data: category
    });
  } catch (error) {
    console.error('Error fetching category:', error);
    return res.status(500).json({
      status: false,
      message: 'Internal server error.'
    });
  }
};

exports.updateCategory = async (req, res) => {
  const { category_id } = req.params;

  if (!category_id) {
    return res.status(400).json({ message: "Category ID is required." });
  }

  const { name } = req.body;  // Destructure safely
  if (!name) {
    return res.status(400).json({ message: "No updates provided (name)." });
  }

  const file = req.file;  // File will be handled by multer middleware
  const transaction = await sequelize.transaction();
  try {
    const category = await Category.findByPk(category_id, { transaction });
    if (!category) {
      await transaction.rollback();
      return res.status(404).json({ message: "Category not found." });
    }

    // Update name if present
    if (name) {
      await category.update({ name }, { transaction });
    }

    // Handle image upload
    if (file) {
      const uniqueName = `file_${category_id}_${Date.now()}`;
      const remoteFileName = `uploads/${uniqueName}`;
      const img_url = await uploadFileFromBuffer(file.buffer, remoteFileName, file.mimetype);

      // Deleting previous image if exists
      const image_name = "uploads/" + category.url.split('/').pop();  // Use category.url for the image
      await deleteFileByName(image_name);  // delete old image

      // Update image URL if a new image is uploaded
      await category.update({ url: img_url }, { transaction });
    }

    await transaction.commit();
    return res.status(200).json({
      status: true,
      message: "Category updated successfully.",
      data: category
    });

  } catch (err) {
    console.error("Update Error:", err);
    await transaction.rollback();
    return res.status(500).json({ message: "Failed to update category." });
  }
};



/*
Deleting Category with Id
*/
exports.deleteCategory = async (req, res) => {
  const categoryId = req.params.category_id;

  if (!categoryId) {
    return res.status(422).json({ message: 'Category ID Missing!' });
  }

  try {
    const category = await Category.findByPk(categoryId);

    if (!category) {
      return res.status(404).json({ message: 'Category Not Found!' });
    }

    // Delete the image file if exists
    if (category.url) {
      const image_name = category.url.split('/').pop();
      await deleteFileByName(`uploads/${image_name}`);
    }

    // Delete category record
    await category.destroy();
    return res.status(200).json({
      message: 'Category Deleted Successfully',
      data: category
    });
  } catch (err) {
    console.error('Delete Error:', err);
    return res.status(500).json({ message: 'Failed to delete category.' });
  }
};
