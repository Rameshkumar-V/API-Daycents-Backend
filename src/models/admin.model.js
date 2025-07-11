module.exports  = (sequelize, DataTypes) => {
  return sequelize.define('Admin', {
  id:  {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  username: { type: DataTypes.STRING, allowNull: false },
  email: { type: DataTypes.STRING, unique: true, allowNull: false },
  password: { type: DataTypes.STRING, allowNull: false },
  role_id: { type: DataTypes.UUID, allowNull: false },
  isVerified: { type: DataTypes.BOOLEAN, defaultValue: false },
  
})
};
