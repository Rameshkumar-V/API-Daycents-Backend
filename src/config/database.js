require('dotenv').config();
const { Sequelize } = require('sequelize');
const {production, development} = require('./db.config');
const pg = require('pg'); // needed only if using custom dialectModule

function db_connect(){
  sequelize.authenticate()
  .then(() => {
    console.log('✅ Connected to Neon PostgreSQL successfully.');
    return true;
  })
  .catch(err => {
    console.error('❌ Unable to connect to the database:', err);
    return false;
  });
}

if( process.env.NODE_ENV=="production" ){
  console.log("RUNNING : PRODUCTION");
  var sequelize = new Sequelize(process.env.DATABASE_URL,{
    dialect: 'postgres',
    dialectModule: pg,
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false // for Supabase, Railway, etc.
      }
    }
  });
}
else if( process.env.NODE_ENV=="development" ){
  console.log("RUNNING : DEVELOPMENT")
  var sequelize = new Sequelize(development);
}else{
  new Error("Database NODE_ENV not Setted Properly.")
}

// console.log(sequelize);
module.exports = sequelize;
