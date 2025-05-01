const {createOrder,verifyPayment} =require('../utils/PaymentService');
const express = require('express');
const router = express.Router();

// Route to handle order creation
router.post('/create-order', async (req, res) => {
    const  data={ amount:1, currency:'INR', receipt:'', notes:{description:'Post View'} };
    const order = await createOrder(data);

    if(order.status == 'failed'){
        return res.status(500).json(order)
    }else{
        return res.status(201).json(order)
    }
});


// Route to handle payment verification
router.post('/verify-payment',async (req, res) => {
    const  { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body ;

    if(!( razorpay_order_id && razorpay_payment_id && razorpay_signature)){
        return res.status(401).json({message:"Parameters Missing"});
    }

    const verification = await verifyPayment(req.body);

    if(verification.status=='failed'){
        return res.status(500).json(verification);
    }else{
        return res.status(201).json(verification);
    }
});


// // Route to serve the success page
// app.get('/payment-success', (req, res) => {

//   res.sendFile(path.join(__dirname, 'success.html'));
// });
module.exports = router;
