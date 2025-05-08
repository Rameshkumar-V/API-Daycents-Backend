const {User} = require('../models');
const bcrypt = require('bcryptjs');
const { generateOtp, verifyOtp } = require('../services/otp.service');
const { generateToken } = require('../utils/jwt.util');
const { validatePhone, validateEmail } = require('../validators/userRegistervalidator');

exports.register = async (req, res, next) => {
  try {
    const { phone_no } = req.body;

    if (!validatePhone(phone_no)) return res.status(400).json({ message: 'Invalid phone number' });

    const userExists = await User.findOne({ where: { phone_no } });
    if (userExists) return res.status(400).json({ message: 'Phone already registered' });

    const otp = await generateOtp(phone_no);
    // TODO: Send OTP via SMS/email
    return res.status(200).json({ message: 'OTP sent', otp }); // Remove `otp` in production!
  } catch (err) {
    next(err);
  }
};

exports.verifyOtpAndCreateUser = async (req, res, next) => {
  try {
    let { phone_no, otp, name,  password } = req.body;

    if (! await verifyOtp(phone_no, otp)) return res.status(401).json({ message: 'Invalid or expired OTP' });

    password = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      phone_no,
      password,
      is_verified: true,
    });

    const token = generateToken({
      "user_id": newUser.id,
      "isVerified": newUser.is_verified,
      "role": newUser.role
    });
    return res.status(201).json({ message: 'User created', token });
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

    const token = generateToken({
      "user_id":user.id,
      "role":user.role,
    }
    );
    return res.status(200).json({ token });
  } catch (err) {
    next(err);
  }
};
