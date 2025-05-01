
const express = require('express');
const router = express.Router();
const adminController = require('../controllers/admin.controller');

router.get('/workers/count', adminController.getTotalWorkers);
router.get('/jobs/active', adminController.getActiveJobsByDate);
router.get('/jobs/completed', adminController.getCompletedJobs);
router.get('/earnings/summary', adminController.getEarningsSummary);
router.get('/jobs/live-feed', adminController.getLiveJobFeed);

module.exports = router;
