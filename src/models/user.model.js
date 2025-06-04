module.exports = (sequelize, DataTypes) => {
  return sequelize.define('User', {
    id: { type:  DataTypes.UUID,   defaultValue: DataTypes.UUIDV4,  primaryKey: true },
    phone_no: { type: DataTypes.DECIMAL(10), allowNull: false, unique: true, primaryKey: true },
    email_id: { type: DataTypes.STRING(80), allowNull: true, unique: true,default : null },
    password: { type: DataTypes.STRING(100), allowNull: false },
    pushnotification_id: { type: DataTypes.STRING(100), allowNull: true, unique: true,default : null },
    role_id: { type: DataTypes.UUID, allowNull: false },// default role after Firebase sign-in
    name: { type: DataTypes.STRING(40), allowNull: true,default:null },
    location_lat: { type: DataTypes.DECIMAL(10, 6), allowNull: true,default:null },
    location_long: { type: DataTypes.DECIMAL(10, 6), allowNull: true,default:null },
    is_active: { type: DataTypes.BOOLEAN, defaultValue:true },
    is_verified: { type: DataTypes.BOOLEAN, defaultValue:false },
    address: { type: DataTypes.STRING(150), allowNull: true,default:null },
    favourite_category: {
      type: DataTypes.JSON, // [{ id: UUID, name: 'Plumbing' }]
      allowNull: true,
    },
    
    known_works: {
      type: DataTypes.JSON, // e.g., ['Painting', 'Cleaning']
      allowNull: true,
    },
    isAllowNotification: { type: DataTypes.BOOLEAN, defaultValue:false },
  }, {
    timestamps: true,
  },
)};
