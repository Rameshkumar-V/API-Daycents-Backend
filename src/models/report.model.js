module.exports = (sequelize, DataTypes) => {
    const Report = sequelize.define('Report', {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      user_id: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      type: {
        type: DataTypes.STRING, // e.g., "Bug", "Abuse", "Other"
        allowNull: false,
      },
      subject: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      message: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      status: {
        type: DataTypes.ENUM('pending', 'reviewed', 'resolved'),
        defaultValue: 'pending',
      }
    }, {
      tableName: 'reports',
      timestamps: true,
    });
  
    return Report;
  };
  