// db.config.js
const pg = require('pg'); // needed only if using custom dialectModule

const dev = {
  dialect: 'sqlite',
  storage: './database.sqlite',
  logging: console.log
};

const prod = {
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
