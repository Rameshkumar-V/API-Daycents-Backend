const Sequelize = require('sequelize');
const sequelize = require('../config/database');

// Import Models
const User = require('./user.model')(sequelize, Sequelize.DataTypes);
// const Profile = require('./profile.model')(sequelize, Sequelize.DataTypes);
const Category = require('./category.model')(sequelize, Sequelize.DataTypes);
const UserPost = require('./userPosts.model')(sequelize, Sequelize.DataTypes);
// const History = require('./history.model')(sequelize, Sequelize.DataTypes);
// const Work = require('./UserTakenWorks.model')(sequelize, Sequelize.DataTypes);
const UserPostImages = require('./UserPostImages')(sequelize, Sequelize.DataTypes);
const UserTakenWorks = require('./UserTakenWorks.model')(sequelize, Sequelize.DataTypes);

// User <-> UserPost (One-to-Many)
User.hasMany(UserPost, { foreignKey: 'id' }); // User has many UserPosts
UserPost.belongsTo(User, { foreignKey: 'id' }); // UserPost belongs to User
// Category <-> UserPost (One-to-Many)
Category.hasMany(UserPost, { foreignKey: 'category_id' });
UserPost.belongsTo(Category, { foreignKey: 'id', as: 'Category' }); // Alias for includes

// User have Many Works
User.hasMany(UserTakenWorks,{
  foreignKey: 'worker_id',
});
UserTakenWorks.belongsTo(User);
// Posts Have One Work
UserPost.hasOne(UserTakenWorks, {
  foreignKey: 'post_id',
});
UserTakenWorks.belongsTo(UserPost);



// // User <-> Work (One-to-Many)
// User.hasMany(Work, { foreignKey: 'worker_id' });
// Work.belongsTo(User, { foreignKey: 'worker_id' });


UserPost.hasMany(UserPostImages, { foreignKey: 'post_id' });
UserPostImages.belongsTo(UserPost, { foreignKey: 'id' });
console.log("I AM WORKING !");

module.exports = {
  sequelize,
  Sequelize,
  User,
  // Profile,
  Category,
  UserPost,
  // History,
  UserPostImages,
  UserTakenWorks
};
