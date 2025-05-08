
const { body, param } = require('express-validator');

const registerValidator = [
body('phone_no')
.isNumeric().withMessage('Phone number must be numeric')
.isLength({ min: 10, max: 10 }).withMessage('Phone number must be exactly 10 digits')
]


const verifyOTPValidator = [
    body('phone_no')
    .isNumeric().withMessage('Phone number must be numeric')
    .isLength({ min: 10, max: 10 }).withMessage('Phone number must be exactly 10 digits'),

    body('otp')
    .isNumeric().withMessage('OTP number must be numeric')
    .isLength({ min: 6, max: 6 }).withMessage('OTP must be exactly 6 digits'),

]
const loginValidator = [
    body('phone_no')
    .isNumeric().withMessage('Phone number must be numeric')
    .isLength({ min: 10, max: 10 }).withMessage('Phone number must be exactly 10 digits'),

    body("password").isString().withMessage('Password must be a string')
    .isLength({ min: 1, max: 20 }).withMessage('Password must be between 1 and 20 characters'),

]

module.exports= {
    registerValidator,
    verifyOTPValidator,
    loginValidator
};
