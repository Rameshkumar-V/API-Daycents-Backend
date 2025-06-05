const { verifyToken } = require('../utils/jwt.util');
const { Admin, User, Roles } = require('../models');
const { messaging } = require('firebase-admin');


const Authentication = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'Token required' });

    const decoded = verifyToken(token);
    const roleData = await Roles.findOne({where: {id: decoded.role.id}})
    if(!roleData) return res.status(401).json({message:"Role Not Foud !"});
   
    if(roleData.name==="ADMIN")
      {
        let admin = await Admin.findByPk(decoded.id);
        if(!admin) return res.status(401).json("Admin Not Found !");
        req.user = {
          "admin_id": admin.id,
          "roleName": "ADMIN",
          "isAuthenticated": true

        };
      if (!admin) return res.status(401).json({ message: 'Admin not found' });
      }
    else{
      let user = await User.findByPk(decoded.user_id);
      req.user = {
        user_id: user.id,
        roleName: "USER",
        isAuthenticated: true,
        ...(user.isAllowNotification && { expoPushToken: user.pushnotification_id })

      };
      
      if (!user) return res.status(401).json({ message: 'User not found' });

    }
    
    
    next();
  } catch (err) {
    console.log("ERROR"+err)
    res.status(401).json({ message: 'Invalid token' });
  }
};


// middleware/roleChecks.js
const isAdmin = (req, res, next) => {
  if (req.user?.roleName !== 'ADMIN') {
    return res.status(403).json({ message: 'Admins only' });
  }
  next();
};

const isWorker = (req, res, next) => {
  if (req.user?.roleName !== 'WORKER') {
    return res.status(403).json({ message: 'Workers only' });
  }
  next();
};

module.exports = { isAdmin, isWorker };


const isAuthenticated= (req, res, next) => {
  if (req.admin.isAuthenticated === false) return res.status(403).json({ message: 'Authentication Required !' });
  next();
};


exports.isUserOrAdmin = (req, res, next) => {
  if (req.user.roleName === 'ADMIN' || req.user.roleName === 'USER') return next();
  return res.status(403).json({ message: 'Access denied' });
};


module.exports = { 
  Authentication, 
  isAdmin,
  isWorker,
  isAuthenticated 
};
