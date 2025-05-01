// work.routes.js
const express = require('express');
const router = express.Router();
const workController = require('../controllers/work.controller');


router.post('/assign', workController.assignToWork);// Assign work to a user post
router.post('/decline', workController.declineWork);// Assign work to a user post
router.get('/assigned',workController.getAssignedWorks)

module.exports = router;
