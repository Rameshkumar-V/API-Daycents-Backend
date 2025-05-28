const axios = require('axios');
const redis = require('../config/redis.config');
 

require('dotenv').config();
// const OTP_EXPIRY = 300; 
const OTP_EXPIRY = 10; 

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





async function sendOTP(receiver_number) {
  const otp = await generateOtp(receiver_number);
  console.log(otp);
  const smsUrl = `https://apihome.in/panel/api/bulksms/?key=${process.env.APIHOME_API_KEY}&mobile=${receiver_number}&otp=${otp}`;

  try {
    const response = await axios.get(smsUrl);
    return { success: true, otp, apiResponse: response.data };
  } catch (error) {
    console.error('Error sending OTP:', error.message);
    return { success: false, message: 'Failed to send OTP' };
  }


  // console.log(message.body);
}

// sendOTP(7010554788);
// createMessage(9944577398);
console.log("MESSAGE SENDED")

module.exports = { generateOtp, verifyOtp,sendOTP };
