module.exports = (sequelize, DataTypes) => {
    return sequelize.define('UserPostImages', {
      id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
      post_id: { type: DataTypes.INTEGER, nullable:false},
      image_url: { type: DataTypes.TEXT, unique:true, nullable:false},
   
    }, {
      tableName: 'user_post_images',
      timestamps: true,
    });
  };
  