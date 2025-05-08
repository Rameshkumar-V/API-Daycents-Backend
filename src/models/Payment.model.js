module.exports = (sequelize, DataTypes) => {
    const Payment = sequelize.define('Payment', {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
      },
      user_id: {
        type: DataTypes.UUID,
        allowNull: false
      },
      post_id: {
        type: DataTypes.UUID,
        allowNull: false
      },
      order_id: {
        type: DataTypes.STRING,
        allowNull: true,
        unique: true
      },
      payment_id: {
        type: DataTypes.STRING,
        allowNull: true // Will be filled after payment is completed
      },
      status: {
        type: DataTypes.ENUM('CREATED', 'SUCCESS', 'FAILED'),
        defaultValue: 'CREATED'
      },
      amount: {
        type: DataTypes.FLOAT,
        allowNull: false
      },
      currency: {
        type: DataTypes.STRING,
        defaultValue: 'INR'
      }
    }, {
      tableName: 'payments',
      timestamps: true,
      indexes: [
        {
          unique: true,
          fields: ['user_id', 'post_id'] // Enforce one order per post per user
        }
      ]
    });
  
    return Payment;
  };
  