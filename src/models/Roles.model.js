module.exports = (sequelize, DataTypes) => {
    return sequelize.define('Roles', {
      id: { type:  DataTypes.UUID,   defaultValue: DataTypes.UUIDV4,  primaryKey: true },
      name: { type: DataTypes.STRING(40), allowNull: false,nullable:false }
    }
  )};