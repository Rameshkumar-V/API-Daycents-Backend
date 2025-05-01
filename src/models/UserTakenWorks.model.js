module.exports = (sequelize, DataTypes) => {
    return sequelize.define('UserTakenWorks', {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      post_id : {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      worker_id: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      status: {
        type: DataTypes.ENUM('pending','assigned', 'finished','cancelled'),
        defaultValue: 'pending',
      },

    
   
    });

  };
  