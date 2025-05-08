const { body, param } = require('express-validator');

const postFieldsValidation = [

  body('category_id')
  .isUUID().withMessage('category_id must be an UUID'),

  body('title').isString()
    .withMessage('Title must be a UID')
    .isLength({ min: 1, max: 100 }).withMessage('Title must be between 1 and 100 characters'),

  body("description")
    .trim()
    .notEmpty().withMessage("Description is required.")
    .custom(value => {
      const phoneRegex = /\b\d{10,}\b/;
      const emailRegex = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z]{2,}\b/i;
      const addressKeywords = /(street|road|avenue|lane|city|district|door\s?no|near|behind)/i;

      if (phoneRegex.test(value) || emailRegex.test(value) || addressKeywords.test(value)) {
        throw new Error("Description must not contain contact info or address.");
      }
      return true;
    }),

  body('pincode')
    .matches(/^\d{6}$/).withMessage('Pincode must be exactly 6 digits'),

  body('amount')
    .isDecimal({ decimal_digits: '0,2' }).withMessage('Amount must be a decimal number'),

  body('mobile_no')
    .matches(/^\d{10}$/).withMessage('Mobile number must be exactly 10 digits'),

  body('working_hour')
    .optional()
    .isString().withMessage('Working hour must be a string')
    .isLength({ max: 100 }).withMessage('Working hour can be up to 100 characters'),

  body('no_of_workers')
    .optional()
    .isInt({ min: 0 }).withMessage('Number of workers must be a positive integer'),

  body('is_show')
    .optional()
    .isBoolean().withMessage('is_show must be a boolean'),

  body('status')
    .optional()
    .isIn(['pending', 'in_progress', 'completed', 'cancelled'])
    .withMessage("Status must be one of: 'pending', 'in_progress', 'completed', 'cancelled'")
];

const postIdParamValidator = [
  param('id')
  .isUUID().withMessage('Post ID must be an integer')
];

const getPostIdValidator = [
  param('post_id')
  .isUUID().withMessage('Post ID must be an integer')
];

module.exports = {
  createPostValidator: postFieldsValidation,
  updatePostValidator: [...postIdParamValidator, ...postFieldsValidation],
  deletePostValidator: postIdParamValidator,
  getPostValidator: getPostIdValidator
};
