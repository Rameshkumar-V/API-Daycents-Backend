module.exports = (sequelize, DataTypes) => {
    const Review = sequelize.define('Review', {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      user_id: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      post_id: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      rating: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          min: 1,
          max: 5
        }
      },
      review: {
        type: DataTypes.TEXT,
        allowNull: true,
      }
    }, {
      tableName: 'reviews',
      timestamps: true,
      indexes: [
        {
          unique: true,
          fields: ['user_id', 'post_id']  // Composite unique constraint
        }
      ]
    });
  
    return Review;
  };
  