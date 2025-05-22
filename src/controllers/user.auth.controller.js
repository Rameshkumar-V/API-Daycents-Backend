const {User} = require('../models');
const bcrypt = require('bcryptjs');
const { sendOTP, verifyOtp } = require('../services/otp.service');
const { getAccessToken, getRefreshToken,verifyToken } = require('../utils/jwt.util');
const { validatePhone, validateEmail } = require('../validators/userRegistervalidator');

exports.register = async (req, res, next) => {
  try {
    const { phone_no } = req.body;

    if (!validatePhone(phone_no)) return res.status(400).json({ message: 'Invalid phone number' });

    const userExists = await User.findOne({ where: { phone_no } });
    if (userExists) return res.status(400).json({ message: 'Phone already registered' });

    const otp = await sendOTP(phone_no);
    // TODO: Send OTP via SMS/email
    return res.status(200).json({ message: 'OTP sent', otp }); // Remove `otp` in production!
  } catch (err) {
    next(err);
  }
};

exports.verifyOtpAndCreateUser = async (req, res, next) => {
  try {
    let { phone_no, otp,   password } = req.body;

    if (! await verifyOtp(phone_no, otp)) return res.status(401).json({ message: 'Invalid or expired OTP' });

    password = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      phone_no,
      password,
      is_verified: true,
    });

    const access_token = getAccessToken({
      "user_id": newUser.id,
      "isVerified": newUser.is_verified,
      "role": newUser.role
    });
    const refresh_token = getRefreshToken({
      "user_id": newUser.id,
      "isVerified": newUser.is_verified,
      "role": newUser.role
    });
    return res.status(201).json({ message: 'User created', token : {
      access_token: access_token,
      refresh_token : refresh_token
    }, user_id : newUser.id });
  } catch (err) {
    next(err);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { phone_no,password } = req.body;
    const user = await User.findOne({ where: { phone_no, is_verified: true } });

    if (!user) return res.status(404).json({ message: 'User not found or not verified' });

    if(!await bcrypt.compare(password, user.password)){
      return res.status(404).json({ message: 'User Pasword Mismatch!' });
    }

   
    const access_token = getAccessToken({
      "user_id": user.id,
      "isVerified": user.is_verified,
      "role": user.role
    });
    const refresh_token = getRefreshToken({
      "user_id": user.id,
      "isVerified": user.is_verified,
      "role": user.role
    });
    return res.status(200).json({ token : {
      access_token: access_token,
      refresh_token : refresh_token
    }, user_id: user.id });
  } catch (err) {
    next(err);
  }
};

exports.requestPasswordReset = async (req, res) => {
  const { phone_no } = req.body;
  const user = await User.findOne({ where: { phone_no: phone_no } });

  if (!user) return res.status(404).json({ message: 'User not found' });

  const otp = await sendOTP(user.phone_no);

  

  return res.status(200).json({ message: 'Reset OTP send to Whatsapp' });
};


exports.resetPassword = async (req, res) => {
  const { otp,phone_no, newPassword } = req.body;

  try {
    const is_valid = await verifyOtp(phone_no, otp);
    if(!is_valid){return res.status(404).json({message : "Invalid OTP!"})}
    const user = await User.findByPk(req.id);

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    res.json({ message: 'Password updated successfully' });
  } catch (err) {
    res.status(400).json({ message: 'Invalid or expired token' });
  }
};

exports.getAccessToken = async (req, res) => {

  try{


  const refreshToken = req.body.refresh_token;

  const verify = verifyToken(refreshToken);
  
  
  const access_token = getAccessToken({
    "user_id": verify.user_id,
    "isVerified": verify.isVerified,
    "role": verify.role
  });

  return res.status(200).json({ token : {
    access_token: access_token
  } });
      
}catch(err){
  next(err);
}

};
