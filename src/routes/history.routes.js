const express = require('express');
const router = express.Router();
const validateRequest = require('../middleware/validateRequest');
const histroy = require('../controllers/history.controller');
const { validateUserId, validateWorkerId } = require('../validators/historyValidator');
  


router.get('/users/:user_id/posts', 
  validateUserId, 
  validateRequest, 
  histroy.getPostHistroyByUserId
);
router.get('/users/:worker_id/works',
  validateWorkerId, 
  validateRequest, 
  histroy.getWorkHistory
);

module.exports = router;
