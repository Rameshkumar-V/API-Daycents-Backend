const { verifyToken } = require('../utils/jwt.util');
const { Admin, User } = require('../models');


const Authentication = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    // console.log("TOEKEN : "+token)
    if (!token) return res.status(401).json({ message: 'Token required' });

    const decoded = verifyToken(token);
   
    if(decoded.role=="admin")
      {
        let admin = await Admin.findByPk(decoded.id);
        req.admin = {
          "admin_id": admin.id,
          "role": "admin",
          "isAuthenticated": true

        };
      if (!admin) return res.status(401).json({ message: 'Admin not found' });
      }
    else{
      let user = await User.findByPk(decoded.user_id);
      req.user = {
        "user_id": user.id,
        "role": "user",
        "isAuthenticated": true

      };
      if (!user) return res.status(401).json({ message: 'User not found' });

    }
    
    
    next();
  } catch (err) {
    console.log("ERROR"+err)
    res.status(401).json({ message: 'Invalid token' });
  }
};


const isAdmin = (req, res, next) => {
  if (req.admin.role !== 'admin') return res.status(403).json({ message: 'Admins only' });
  next();
};
const isWorker = (req, res, next) => {
  if (req.user.role !== 'worker') return res.status(403).json({ message: 'Worker only' });
  next();
};

const isAuthenticated= (req, res, next) => {
  if (req.admin.isAuthenticated === false) return res.status(403).json({ message: 'Authentication Required !' });
  next();
};


exports.isUserOrAdmin = (req, res, next) => {
  if (req.user.role === 'admin' || req.user.role === 'user') return next();
  return res.status(403).json({ message: 'Access denied' });
};


module.exports = { 
  Authentication, 
  isAdmin,
  isWorker,
  isAuthenticated 
};
