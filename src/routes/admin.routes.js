
const express = require('express');
const router = express.Router();
const adminController = require('../controllers/admin.controller');
const adminAuthController = require('../controllers/admin.controller');
const { isAdmin } = require('../middleware/auth.middleware');


// ADMIN CRUD
router.use(isAdmin);
router.get('/',  adminAuthController.getAllAdmins);
router.put('/:admin_id',  adminAuthController.updateAdmin);
router.delete('/:admin_id',  adminAuthController.deleteAdmin);

//  ADMIN DASHBOARD ANALYZES
router.get('/users/count', adminController.getUserCount);
router.get('/posts/count', adminController.getPostsCount);
router.get('/jobs/count', adminController.getJobCount);
router.get('/jobs', adminController.getJobs);
router.get('/earnings/summary', adminController.getEarningsSummary);

module.exports = router;
