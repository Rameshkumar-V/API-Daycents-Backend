const express = require('express');
const app = express();
const adminRoutes = require('./admin.routes');
const { sequelize } = require('../models');
app.use(express.json());
const setStaticUserId = (req, res, next) => {
  const s=sequelize.authenticate();
  if(s){
    console.log("db available");
  }else{
    console.log("db unavailable");
  }

    req.user = {
      user_id: '8168dec4-0f24-48bb-a935-35388e431d17', 
    };
    next(); 
  };
  
app.use(setStaticUserId);
app.use('/api/users', require('./user.routes'));
// app.use('/api/profiles', require('./profile.routes'));
app.use('/api/categories', require('./category.routes'));
app.use('/api/posts', require('./userPost.routes'));
app.use('/api/histroy', require('./history.routes'));
app.use('/admin', adminRoutes);
app.use('/api', require('./Payment'));
app.use('/api/works',setStaticUserId,require('./work.routes'));
module.exports = app;
