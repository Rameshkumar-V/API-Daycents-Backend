// history.routes.js
const express = require('express');
const router = express.Router();
const historyController = require('../controllers/history.controller');
const userPostController = require('../controllers/userPost.controller');
const workController = require('../controllers/work.controller');


// router.post('/', historyController.createHistory);
// router.get('/:post_id', historyController.getPostHistory);

// Get history of a user
// router.get('/user/:user_id', historyController.getUserHistory);
router.get('/users/:user_id/posts', userPostController.getPostHistroyByUserId);
router.get('/users/:worker_id/works', workController.getWorkHistroy);// Get all work assigned to a specific worker

module.exports = router;
