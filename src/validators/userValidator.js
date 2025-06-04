const { body, param } = require('express-validator');
const { isUUID } = require('validator');

const createUserValidator = [
  body('phone_no')
    .isNumeric().withMessage('Phone number must be numeric')
    .isLength({ min: 10, max: 10 }).withMessage('Phone number must be exactly 10 digits'),

  body('email_id')
    .optional({ checkFalsy: true })
    .isEmail().withMessage('Must be a valid email'),

  body('pushnotification_id')
    .optional({ checkFalsy: true })
    .isString().withMessage('Push notification ID must be a string'),

  body('role')
    .isIn(['worker', 'guest']).withMessage("Role must be either 'worker' or 'guest'"),

  body('name')
    .optional({ checkFalsy: true })
    .isLength({ max: 40 }).withMessage('Name can be up to 40 characters'),
  body('location_lat')
    .optional({ checkFalsy: true })
    .isFloat({ min: -90, max: 90 }).withMessage('Latitude must be between -90 and 90'),
  
  body('location_long')
    .optional({ checkFalsy: true })
    .isFloat({ min: -180, max: 180 }).withMessage('Longitude must be between -180 and 180'),
  
  body('is_active')
    .optional()
    .isBoolean().withMessage('is_active must be a boolean')
];

const updateUserValidator = [
  param('user_id').optional({ checkFalsy: true })
    .custom(value => isUUID(value)).withMessage('Invalid user ID'),

  body('phone_no')
    .optional()
    .isNumeric().withMessage('Phone number must be numeric')
    .isLength({ min: 10, max: 10 }).withMessage('Phone number must be exactly 10 digits'),

  body('email_id')
    .optional()
    .isEmail().withMessage('Must be a valid email'),

  body('pushnotification_id')
    .optional()
    .isString().withMessage('Push notification ID must be a string'),

  body('role')
    .optional()
    .isIn(['USER', 'WORKER']).withMessage("Role must be either 'worker' or 'guest'"),

  body('name')
    .optional()
    .isLength({ max: 40 }).withMessage('Name can be up to 40 characters'),

  body('location_lat')
    .optional({ checkFalsy: true })
    .isFloat({ min: -90, max: 90 }).withMessage('Latitude must be between -90 and 90'),
  
  body('location_long')
    .optional({ checkFalsy: true })
    .isFloat({ min: -180, max: 180 }).withMessage('Longitude must be between -180 and 180'),
  
  body('is_active')
    .optional()
    .isBoolean().withMessage('is_active must be a boolean'),
    body('address')
    .optional()
    .isLength({ max: 150 }).withMessage('Address can be up to 150 characters'),

];

const idParamValidator = [
  param('user_id').optional()
    .custom(value => isUUID(value)).withMessage('Invalid user ID')
];

module.exports = {
  createUserValidator,
  updateUserValidator,
  idParamValidator
};
