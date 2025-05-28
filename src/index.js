require("dotenv").config();
const app = require('./routes/app');
const { sequelize } = require('./models');


// DATABASE
if (process.env.NODE_ENV === "development") {
  sequelize.sync({ force: true}).then(() => {
  console.log("Database synced");
});
}else
{    sequelize.authenticate();
}

const PORT = process.env.PORT || 3000;

if( process.env.NODE_ENV=="production")
{
  module.exports = app;
}
else if (process.env.NODE_ENV=="development")
{
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
