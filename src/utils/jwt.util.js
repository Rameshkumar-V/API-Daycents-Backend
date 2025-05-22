const jwt = require('jsonwebtoken');
require('dotenv').config();


const generateToken = (payload,expiresIn) => {

    if (!payload || typeof payload !== 'object') {
      throw new Error('JWT payload must be a plain object');
    }
  
    return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: expiresIn });
    
  };
const verifyToken = (token) => jwt.verify(token, process.env.JWT_SECRET);

const getAccessToken = (payload) =>{
 return generateToken(payload,'1h');

};

const getRefreshToken = (payload) =>{
  return generateToken(payload,'7d');

};

module.exports = { generateToken, verifyToken,getAccessToken, getRefreshToken };
