// module.exports = (sequelize, DataTypes) => {
//     const UserHistory = sequelize.define('UserHistory', {
//       id: {
//         type: DataTypes.INTEGER,
//         primaryKey: true,
//         autoIncrement: true,
//       },
//       user_id: {
//         type: DataTypes.STRING,
//         allowNull: false,
//         references: {
//           model: 'Users',
//           key: 'id',
//         },
//       },
//       post_id: {
//         type: DataTypes.INTEGER,
//         allowNull: false,
//         references: {
//           model: 'user_posts', // ✅ FIXED to match actual table name
//           key: 'id',
//         },
//       }
//       ,
//       action: {
//         type: DataTypes.ENUM('created', 'updated', 'deleted'),  // 'created', 'updated', 'deleted'
//         allowNull: false,
//       },
//       description: {
//         type: DataTypes.STRING(100),  // Stores the changes made in the post
//       },
//       timestamp: {
//         type: DataTypes.DATE,
//         defaultValue: DataTypes.NOW,
//       },
//     });
  
//     History.associate = (models) => {
//       History.belongsTo(models.User, { foreignKey: 'user_id' });
//       History.belongsTo(models.UserPost, { foreignKey: 'post_id' });
//     };
  
//     return History;
//   };
  