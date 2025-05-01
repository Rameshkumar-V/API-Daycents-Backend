module.exports = (sequelize, DataTypes) => {
  return sequelize.define('UserPost', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    user_id: { type: DataTypes.STRING(100), allowNull: false },
    category_id: { type: DataTypes.INTEGER, allowNull: false },

    title: { type: DataTypes.STRING(100), allowNull: false },
    description: { type: DataTypes.TEXT(600) },
    pincode: { type: DataTypes.STRING(6), allowNull: false },
    amount: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
    mobile_no: { type: DataTypes.STRING(10), allowNull: false },
    working_hour: { type: DataTypes.STRING(100) },
    no_of_workers: { type: DataTypes.INTEGER },
    is_show : { type: DataTypes.BOOLEAN,allowNull: false,defaultValue: true },
    status: {
      type: DataTypes.ENUM('pending', 'in_progress', 'completed','cancelled'),
      defaultValue: 'pending',
    },
  }, {
    tableName: 'user_posts',
    timestamps: true,
  });
};
