const express = require('express');
const router = express.Router();
const auth = require('../controllers/admin.auth.controller');


router.post('/register', auth.addAdmin);
router.get('/verify/:token', auth.verifyEmail);
router.post('/login', auth.login);

module.exports = router;
