const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/payment.controller');

router.post('/create-order', paymentController.createOrder);
router.post('/verify-payment', paymentController.verifyPayment);
router.post('/report-to-verify', paymentController.reportToVerify);



module.exports = router;
