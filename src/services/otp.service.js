const axios = require('axios');
const redis = require('../config/redis.config');
const twilio = require("twilio"); 

require('dotenv').config();
const OTP_EXPIRY = 300; 
// const OTP_EXPIRY = 10; 

const generateOtp = async (phone) => {
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  await redis.setEx(`otp:${phone}`, OTP_EXPIRY, otp);
  
  return otp;
};

const verifyOtp = async (phone, enteredOtp) => {
  const storedOtp = await redis.get(`otp:${phone}`);
  console.log("VERFIY OTP : "+storedOtp);
  if (!storedOtp) return false;
  return storedOtp === enteredOtp;
};



const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = twilio(accountSid, authToken);

async function createMessage(receiver_number) {
  const otp = await generateOtp(receiver_number);
  console.log(otp);
  const message = await client.messages.create({
    body: `Hello there! OTP is : ${otp}`,
    from: "whatsapp:+14155238886",
    to: `whatsapp:+91${receiver_number}`,
  });

  // console.log(message.body);
}

// createMessage(7010554788);
// createMessage(9944577398);
console.log("MESSAGE SENDED")

module.exports = { generateOtp, verifyOtp,sendOTP:createMessage };
