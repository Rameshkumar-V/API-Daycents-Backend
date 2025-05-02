require('dotenv').config();
const { Sequelize } = require('sequelize');
const pg = require('pg');

// console.log(process.env); // This will show all loaded environment variables

// console.log(process.env.DATABASE_URL)

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'postgres',
  dialectModule: pg,
  dialectOptions: {
    ssl: {
      rejectUnauthorized: false
    }
  }
});

// Test connection
sequelize.authenticate()
  .then(() => {
    console.log('✅ Connected to Neon PostgreSQL successfully.');
  })
  .catch(err => {
    console.error('❌ Unable to connect to the database:', err);
  });

module.exports = sequelize;
