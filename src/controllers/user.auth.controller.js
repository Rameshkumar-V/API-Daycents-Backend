const {User, Roles} = require('../models');
const bcrypt = require('bcryptjs');
const { sendOTP, verifyOtp } = require('../services/otp.service');
const { getAccessToken, getRefreshToken,verifyToken } = require('../utils/jwt.util');
const { validatePhone, validateEmail } = require('../validators/userRegistervalidator');
const { where } = require('sequelize');

exports.register = async (req, res, next) => {
  try {
    const { phone_no } = req.body;

    if (!validatePhone(phone_no)) return res.status(400).json({ message: 'Invalid phone number' });

    const userExists = await User.findOne({ where: { phone_no } });
    if (userExists) return res.status(400).json({ message: 'Phone already registered' });

    const otp = await sendOTP(phone_no);
    // TODO: Send OTP via SMS/email
    return res.status(200).json({ message: 'OTP sent' }); // Remove `otp` in production!
  } catch (err) {
    next(err);
  }
};

exports.verifyOtpAndCreateUser = async (req, res, next) => {
  try {
    let { phone_no, otp,   password } = req.body;
    let roleName = req.body.role ||  'USER';
    let allowedRoles = ['USER','WORKER']

    if (! await verifyOtp(phone_no, otp)) return res.status(401).json({ message: 'Invalid or expired OTP' });
    if (!allowedRoles.includes(roleName)) {
      return res.status(401).json({ message: 'Unauthorized role' });
    }
    
    password = await bcrypt.hash(password, 10);
    const RoleId = await Roles.findOne({where:{name:roleName}})
    const newUser = await User.create({
      phone_no,
      password,
      role_id:RoleId.id,
      is_verified: true,
    });

    return res.status(201).json({ message: 'User created Successfully', user_id : newUser.id });
  } catch (err) {
    next(err);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { phone_no,password } = req.body;
    const user = await User.findOne({ where: { phone_no, is_verified: true },
      include: [
        {
          model: Roles,
          as: 'role', // must match the alias in association
          attributes: ['id', 'name'] // optional: limit fields
        }
      ] });

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

  

  return res.status(200).json({ message: 'Reset OTP send to SMS' });
};

exports.forgotPasswordOTPVerify = async (req, res) => {
  const { otp,phone_no} = req.body;

  try {
    const is_valid = await verifyOtp(phone_no, otp);
    console.log("is valid: "+is_valid);
    if (is_valid !== true) {
      return res.status(404).json({ message: "Invalid OTP!" });
    }
    

    const oldUser = await User.findOne({
      where:{
        phone_no:phone_no
      },
      includes:[]
      
    });

    const access_token = getAccessToken({
      "user_id": oldUser.id,
      "isVerified": oldUser.is_verified,
      "role": {
        "id":oldUser.role_id
      }
    });
    
  
   

    res.status(201).json({ message: 'OTP verified successfully',access_token: access_token });
  } catch (err) {
    console.log("error : "+err);
    res.status(400).json({ message: 'Invalid or expired token' });
  }
};

exports.resetPassword = async (req, res) => {
  const { newPassword } = req.body;

  try {
   
    const user = await User.findByPk(req.user.user_id);

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    res.json({ message: 'Password updated successfully' });
  } catch (err) {
    console.log("error: "+err);
    res.status(400).json({ message: 'Invalid Request' });
  }
};

exports.getAccessToken = async (req, res,next) => {

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
