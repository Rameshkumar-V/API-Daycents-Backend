module.exports = (sequelize, DataTypes) => {
  return sequelize.define('UserPost', {
    id:  {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    user_id: { type: DataTypes.UUID, allowNull: false },
    category_id: { type: DataTypes.UUID, allowNull: false },

    title: { type: DataTypes.STRING(100), allowNull: false },
    description: { type: DataTypes.TEXT(600) },
    pincode: { type: DataTypes.STRING(6), allowNull: false },
    amount: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
    mobile_no: { type: DataTypes.STRING(10), allowNull: false },
    working_hour: { type: DataTypes.STRING(100) },
    no_of_workers: { type: DataTypes.INTEGER },
    is_show : { type: DataTypes.BOOLEAN,allowNull: false,defaultValue: true },
    status: {
      type: DataTypes.ENUM('pending', 'in_progress', 'completed','cancelled'),
      defaultValue: 'pending',
    },
    location_lat: { type: DataTypes.DECIMAL(10, 6), allowNull: true,default:null },
    location_long: { type: DataTypes.DECIMAL(10, 6), allowNull: true,default:null },
    location_name: { type: DataTypes.STRING(100), allowNull: true,default:null },
    job_date : {type:DataTypes.DATE}
    

  }, {
    tableName: 'user_posts',
    timestamps: true,
  });
};
