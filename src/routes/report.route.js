const express = require('express');
const router = express.Router();
const reportController = require('../controllers/reports.controller');
const { Authentication, isAdmin } = require('../middleware/auth.middleware');


router.post('/',  reportController.createReport);
router.get('/',  isAdmin, reportController.getAllReports);

module.exports = router;
