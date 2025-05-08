// utils/otpService.js
const redis = require('../redisClient');

const OTP_EXPIRY = 300; // 5 minutes

// Generate random 6-digit OTP
const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

/**
 * Save OTP to Redis with expiry.
 * @param {string} key - Usually phone number or email.
 * @returns {string} - The OTP.
 */
const saveOTP = async (key) => {
  const otp = generateOTP();
  await redis.setEx(`otp:${key}`, OTP_EXPIRY, otp); // Set with 5-min expiry
  return otp;
};

/**
 * Retrieve OTP from Redis
 */
const getOTP = async (key) => {
  return await redis.get(`otp:${key}`);
};

/**
 * Delete OTP from Redis after verification
 */
const deleteOTP = async (key) => {
  await redis.del(`otp:${key}`);
};

module.exports = { saveOTP, getOTP, deleteOTP };
