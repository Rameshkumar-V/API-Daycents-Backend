const Razorpay = require('razorpay');
const dotenv = require('dotenv');
dotenv.config();

const instance = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
});

if(instance){
    console.log("razorpay : "+ instance);
}else{
    console.log("razorpay : "+ "not");
}

module.exports = instance;
