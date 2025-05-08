const { body, param } = require('express-validator');

const validateCategoryId = [
  param('category_id')
  .isUUID().withMessage('name must be a string')
];
const validateCreateCategory = [
  body('name')
    .optional({ checkFalsy: true })  // Check for falsy values (e.g., empty strings) as well
    .isString().withMessage('name must be a string')
    .isLength({ min: 3 }).withMessage('name must be at least 3 characters')
    .notEmpty().withMessage('name is required')
    .trim(),

  body('url')
    .optional({ checkFalsy: true })  // Make sure it's optional but validate if provided
    .isURL().withMessage('url must be a valid URL'),

  body('is_show')
    .optional({ checkFalsy: true })  // Ensure it's optional but validate if provided
    .isBoolean().withMessage('is_show must be a boolean'),
];


const validateUpdateCategory = [
  ...validateCategoryId,
  ...validateCreateCategory
];

module.exports = {
  validateCategoryId,
  validateCreateCategory,
  validateUpdateCategory
};
