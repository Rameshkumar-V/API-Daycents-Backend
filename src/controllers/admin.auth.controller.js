const bcrypt = require('bcryptjs');
const { Admin, Roles } = require('../models');
const { generateToken } = require('../utils/jwt.util');
const { sendVerificationEmail } = require('../utils/mail.util');
const {verifyToken}=require('../utils/jwt.util');
const { where } = require('sequelize');

exports.addAdmin = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const hashed = await bcrypt.hash(password, 10);
    const roleData = await Roles.findOne({where:{"name":"ADMIN"}})
    const [admin, created] = await Admin.findOrCreate({
      where: { email }, // or username — whatever identifies uniqueness
      defaults: {
        username,
        email,
        password: hashed,
        role_id: roleData.id
      }
    });
    
    const token = generateToken({ id: admin.id },'2m');
    await sendVerificationEmail("daycentsdevelopment@gmail.com", token);

    res.status(201).json({ message: 'Registered! Please verify your email.' });
  } catch (err) {
    console.log("error:"+err)

    res.status(500).json({ message: err.message });
  }
};

exports.verifyEmail = async (req, res) => {
  try {
    const token  = verifyToken(req.params.token);
    await Admin.update({ isVerified: true }, { where: { id:token.id } });
    res.json({ message: 'Email verified successfully' });
  } catch {
    res.status(400).json({ message: 'Invalid or expired token' });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const admin = await Admin.findOne({ where: { email:email },
      include: [
      {
        model: Roles,
        as: 'role', // must match the alias in association
        attributes: ['id', 'name'] // optional: limit fields
      } ]});
    if (!admin || !await bcrypt.compare(password, admin.password))
      return res.status(401).json({ message: 'Invalid credentials' });

    if (!admin.isVerified) return res.status(403).json({ message: 'Please verify your email' });

    const token = generateToken({ id: admin.id, role: admin.role },'7d');
    res.json({ token });
  } catch(err) {
    console.log(err)
    res.status(500).json({ message: 'Login failed' });
  }
};
