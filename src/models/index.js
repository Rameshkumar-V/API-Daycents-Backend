const Sequelize = require('sequelize');
const sequelize = require('../config/database');

const User = require('./user.model')(sequelize, Sequelize.DataTypes);
const Category = require('./category.model')(sequelize, Sequelize.DataTypes);
const UserPost = require('./userPosts.model')(sequelize, Sequelize.DataTypes);
const UserPostImages = require('./PostImages.model')(sequelize, Sequelize.DataTypes);
const UserTakenWorks = require('./UserTakenWorks.model')(sequelize, Sequelize.DataTypes);
const Payment = require('./Payment.model')(sequelize, Sequelize.DataTypes);
const admin = require('./admin.model')(sequelize, Sequelize.DataTypes);
const Review = require('./Review.model')(sequelize, Sequelize.DataTypes);
const Report = require('./report.model')(sequelize, Sequelize.DataTypes);
const Notification = require('./Notifications.model')(sequelize, Sequelize.DataTypes);
const Roles = require('./Roles.model')(sequelize, Sequelize.DataTypes);
const PostIsShow = require('./postIsShow.model')(sequelize, Sequelize.DataTypes);

// User <-> UserPost (One-to-Many)
User.hasMany(UserPost, { foreignKey: 'user_id' });
UserPost.belongsTo(User, { foreignKey: 'user_id' }); // ✔️ Matches 'user_id' in UserPost
// User -> Roles
User.belongsTo(Roles, { as: 'role', foreignKey: 'role_id' });
Roles.hasMany(User, { as: 'users', foreignKey: 'role_id' });

// // Category <-> UserPost (One-to-Many)
Category.hasMany(UserPost, { foreignKey: 'category_id' });
UserPost.belongsTo(Category, { foreignKey: 'category_id', as: 'category' }); // ✔️ Make sure foreignKey matches

// User have Many Works
User.hasMany(UserTakenWorks,{foreignKey: 'worker_id'});
UserTakenWorks.belongsTo(User,{ foreignKey: 'id', targetKey: 'id'});

UserPost.hasOne(UserTakenWorks, {
  foreignKey: 'post_id',
  as: 'takenWork', // alias when including from UserPost
});

UserTakenWorks.belongsTo(UserPost, {
  foreignKey: 'post_id',
  as: 'post', // alias when including from UserTakenWorks
});

UserPost.hasMany(UserPostImages, { foreignKey: 'post_id' });
UserPostImages.belongsTo(UserPost, { foreignKey: 'post_id' });


// models/Review.js
Review.belongsTo(UserPost, { foreignKey: 'post_id' });
Review.belongsTo(User, { foreignKey: 'user_id' });  // optional, for reviewer details
// models/UserPost.js
UserPost.hasMany(Review, { foreignKey: 'post_id' });
// Notification
Notification
User.hasMany(Notification, { foreignKey: 'user_id' });
Notification.belongsTo(User, { foreignKey: 'user_id' }); // ✔️ Matches 'user_id' in UserPost

// ADMIN
admin.belongsTo(Roles, { as: 'role', foreignKey: 'role_id' });
Roles.hasMany(admin, { as: 'admins', foreignKey: 'role_id' });

console.log("I AM WORKING !");

module.exports = {
  sequelize,
  Sequelize,
  User,
  Category,
  UserPost,
  UserPostImages,
  UserTakenWorks,
  Payment,
  Admin:admin,
  Notification,
  Roles,
  PostIsShow
};
