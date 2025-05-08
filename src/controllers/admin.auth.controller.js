const bcrypt = require('bcryptjs');
const { Admin } = require('../models');
const { generateToken } = require('../utils/jwt.util');
const { sendVerificationEmail } = require('../utils/mail.util');
const {verifyToken}=require('../utils/jwt.util');

exports.addAdmin = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const hashed = await bcrypt.hash(password, 10);
    const admin = await Admin.create({ username, email, password: hashed });

    const token = generateToken({ id: admin.id });
    await sendVerificationEmail("vrameshkumar260@gmail.com", token);

    res.status(201).json({ message: 'Registered! Please verify your email.' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.verifyEmail = async (req, res) => {
  try {
    const { token } = verifyToken(req.params.token);
    await Admin.update({ isVerified: true }, { where: { id } });
    res.json({ message: 'Email verified successfully' });
  } catch {
    res.status(400).json({ message: 'Invalid or expired token' });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const admin = await Admin.findOne({ where: { email } });
    if (!admin || !await bcrypt.compare(password, admin.password))
      return res.status(401).json({ message: 'Invalid credentials' });

    if (!admin.isVerified) return res.status(403).json({ message: 'Please verify your email' });

    const token = generateToken({ id: admin.id, role: admin.role });
    res.json({ token });
  } catch {
    res.status(500).json({ message: 'Login failed' });
  }
};
