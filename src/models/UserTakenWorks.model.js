module.exports = (sequelize, DataTypes) => {
    return sequelize.define('UserTakenWorks', {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      post_id : {
        type: DataTypes.UUID,
        allowNull: false,
      },
      worker_id: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      status: {
        type: DataTypes.ENUM('pending','assigned', 'finished','cancelled'),
        defaultValue: 'pending',
      },
      
    },
  {
    indexes: [
      {
        unique: true,
        fields: ['worker_id', 'post_id'] // prevents duplicates
      }
    ]
  });

  };
  