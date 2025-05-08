module.exports = (sequelize, DataTypes) => {
  return sequelize.define('Category', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: { type: DataTypes.STRING(100), allowNull: false, unique: true },
    url: { type: DataTypes.STRING(255) },
    is_show : { type: DataTypes.BOOLEAN,defaultValue : true },
  }, {
    tableName: 'categories',
    timestamps: false,
  });
};
