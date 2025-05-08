const express = require('express');
const router = express.Router();
const authController = require('../controllers/user.auth.controller');
const {
    registerValidator,
    verifyOTPValidator,
    loginValidator } = require('../validators/userAuthValidator')
const handleValidation = require('../middleware/validateRequest');

router.post('/register',
    registerValidator
    ,handleValidation, 
    authController.register);
router.post('/verify',
    verifyOTPValidator,
    handleValidation,
    authController.verifyOtpAndCreateUser);
router.post('/login',
    loginValidator, 
    handleValidation,
    authController.login);

module.exports = router;
