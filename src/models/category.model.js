module.exports = (sequelize, DataTypes) => {
  return sequelize.define('Category', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    name: { type: DataTypes.STRING(100), allowNull: false, unique: true },
    url: { type: DataTypes.STRING(255) },
    is_show : { type: DataTypes.BOOLEAN,defaultValue : true },
  }, {
    tableName: 'categories',
    timestamps: false,
  });
};
