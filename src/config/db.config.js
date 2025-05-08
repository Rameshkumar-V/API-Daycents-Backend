// db.config.js
const pg = require('pg'); // needed only if using custom dialectModule

const dev = {
  dialect: 'sqlite',
  storage: './database.sqlite',
  logging: console.log
};

const prod = {
  use_env_variable: 'DATABASE_URL', // Sequelize will use process.env.DATABASE_URL
  dialect: 'postgres',
  dialectModule: pg,
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false // for Supabase, Railway, etc.
    }
  }
};

module.exports = {
  development: dev,
  production: prod
};
