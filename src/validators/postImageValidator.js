const { param } = require('express-validator');

const postIdParamValidator = [
  param('post_id')
  .isUUID().withMessage('post_id must be a valid UUID')
];

const imageIdParamValidator = [
  param('image_id')
  .isUUID().withMessage('image_id must be a valid UUID')
];

module.exports = {
  validateGetImages: postIdParamValidator,
  validateCreateImages: postIdParamValidator,
  validateDeleteImage: imageIdParamValidator,
  validateUpdateImage: imageIdParamValidator
};
