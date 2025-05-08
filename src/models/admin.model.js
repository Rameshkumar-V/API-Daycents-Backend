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
  role: { type: DataTypes.ENUM('admin', 'staff'), defaultValue: 'admin' },
  isVerified: { type: DataTypes.BOOLEAN, defaultValue: false },
})
};
