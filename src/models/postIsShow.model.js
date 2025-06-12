module.exports = (sequelize, DataTypes) => {
    const Report = sequelize.define('PostIsShow', {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      is_show: { type: DataTypes.BOOLEAN, defaultValue:true },
    });
  
    return Report;
  };
  