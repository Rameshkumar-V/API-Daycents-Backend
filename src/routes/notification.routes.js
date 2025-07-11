const express = require('express');
const router = express.Router();
const validateRequest = require('../middleware/validateRequest');
const notifications = require('../controllers/notifications.controller');
const { validateUserId, validateWorkerId } = require('../validators/historyValidator');
  

router.get('/users/:user_id', 
  validateUserId, 
  validateRequest, 
  notifications.getNotifications
  
);




module.exports = router;