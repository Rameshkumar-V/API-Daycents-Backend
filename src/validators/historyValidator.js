const { param } = require('express-validator');

const validateUserId = [
  param('user_id')
    .isUUID().withMessage('user_id must be a UUID')
    .isLength({ min: 10 }).withMessage('user_id is too short') // adjust based on UUID or Firebase UID length
];

const validateWorkerId = [
  param('worker_id')
    .isUUID().withMessage('worker_id must be a UUID')
    .isLength({ min: 10 }).withMessage('worker_id is too short')
];

module.exports = {
  validateUserId,
  validateWorkerId
};
