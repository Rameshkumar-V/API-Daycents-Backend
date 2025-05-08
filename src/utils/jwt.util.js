const jwt = require('jsonwebtoken');
require('dotenv').config();


const generateToken = (payload) => {

    if (!payload || typeof payload !== 'object') {
      throw new Error('JWT payload must be a plain object');
    }
  
    return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1d' });
    
  };
const verifyToken = (token) => jwt.verify(token, process.env.JWT_SECRET);

module.exports = { generateToken, verifyToken };
