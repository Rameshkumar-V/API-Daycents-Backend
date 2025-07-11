module.exports = (sequelize, DataTypes) => {
    const Notification = sequelize.define('Notification', {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
      },
      user_id: {
        type: DataTypes.UUID,
        allowNull: false
      },
      title: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      description:{
        type: DataTypes.STRING,
        allowNull: true,
      },
      status: {
        type: DataTypes.ENUM('MESSAGE', 'SUCCESS', 'FAILED'),
        defaultValue: 'MESSAGE'
      },
      
    }, {
      timestamps: true,
    });
  
    return Notification;
  };
  