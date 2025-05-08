const axios = require('axios');
const redis = require('../config/redis.config');
require('dotenv').config();
const OTP_EXPIRY = 300; 

const generateOtp = async (phone) => {
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  await redis.setEx(`otp:${phone}`, OTP_EXPIRY, otp);
  
  return otp;
};

const verifyOtp = async (phone, enteredOtp) => {
  const storedOtp = await redis.get(`otp:${phone}`);
  if (!storedOtp) return false;
  return storedOtp === enteredOtp;
};

// const FAST2SMS_API_KEY = process.env.FAST2SMS_API_KEY; // Replace with your API Key
// console.log("KEY: "+FAST2SMS_API_KEY);
// const SENDER_ID = 'FSTSMS'; // Default sender ID
// const OTP_LENGTH = 6;

// // Generate random 6-digit OTP
// const generateOtp = () => {
//   return Math.floor(100000 + Math.random() * 900000).toString();
// };

// // Send OTP via Fast2SMS
// const sendOtp = async (phone) => {
//   const otp = generateOtp();
//   const message = `Your OTP is ${otp}. Please do not share it with anyone.`;

//   try {
//     const response = await axios.post('https://www.fast2sms.com/dev/bulkV2', {
//       route: 'otp',
//       message,
//       language: 'english',
//       flash: 0,
//       numbers: phone,
//       sender_id: SENDER_ID
//     }, {
//       headers: {
//         'authorization': FAST2SMS_API_KEY,
//         'Content-Type': 'application/json'
//       }
//     });

//     return { success: true, otp, response: response.data };
//   } catch (error) {
//     console.error('Error sending OTP:', error.response?.data || error.message);
//     return { success: false, error: 'Failed to send OTP' };
//   }
// };

// // In-memory store for demo (Fast2SMS doesn't provide verify API)
// const otpStore = new Map();

// // Store and send OTP
// const sendOtpAndStore = async (phone) => {
//   const { success, otp, error } = await sendOtp(phone);
//   if (success) {
//     otpStore.set(phone, { otp, expiresAt: Date.now() + 1 * 60 * 1000 }); // 5 mins expiry
//   }
//   return { success, error };
// };

// // Verify OTP
// const verifyOtp = (phone, enteredOtp) => {
//   const record = otpStore.get(phone);
//   if (!record) return false;
//   if (Date.now() > record.expiresAt) return false;
//   return record.otp === enteredOtp;
// };

// console.log("SENDING SMS ...");
// const res=sendOtpAndStore("7010554788");
// console.log(res);
// // sendOtpAndStore("7010554788");

// // module.exports = { sendOtpAndStore, verifyOtp };


module.exports = { generateOtp, verifyOtp };
