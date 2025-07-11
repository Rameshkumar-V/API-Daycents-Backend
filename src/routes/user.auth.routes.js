const express = require('express');
const router = express.Router();
const authController = require('../controllers/user.auth.controller');
const {Authentication} = require('../middleware/auth.middleware');

const {
    registerValidator,
    verifyOTPValidator,
    loginValidator } = require('../validators/userAuthValidator')
const handleValidation = require('../middleware/validateRequest');

router.post('/password-reset/request',
    authController.requestPasswordReset);
router.post('/password-reset/verify',
    authController.forgotPasswordOTPVerify);
router.post('/password-reset/confirm', Authentication,
    authController.resetPassword);
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
router.post('/refresh',
    authController.getAccessToken
)


    

module.exports = router;
