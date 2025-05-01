const { v4: uuidv4 } = require('uuid');

module.exports = (sequelize, DataTypes) => {
  return sequelize.define('User', {
    id: { type:  DataTypes.STRING(200),  primaryKey: true,   defaultValue: () => uuidv4() },
    phone_no: { type: DataTypes.DECIMAL(10), allowNull: false, unique: true, primaryKey: true },
    email_id: { type: DataTypes.STRING(80), allowNull: true, unique: true,default : null },
    pushnotification_id: { type: DataTypes.STRING(100), allowNull: true, unique: true,default : null },
    role: { type: DataTypes.ENUM('worker', 'guest'), allowNull: false, defaultValue: 'guest' },// default role after Firebase sign-in
    name: { type: DataTypes.STRING(40), allowNull: true,default:null },
    location_lat: { type: DataTypes.DECIMAL(10, 6), allowNull: true,default:null },
    location_long: { type: DataTypes.DECIMAL(10, 6), allowNull: true,default:null },
    is_active: { type: DataTypes.BOOLEAN, defaultValue:true },

  }, {
    // tableName: 'users',
    timestamps: true,
  },
 

)};
