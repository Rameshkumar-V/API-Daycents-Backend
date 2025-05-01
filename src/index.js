require("dotenv").config();
const app = require('./routes/app');
const { sequelize } = require('./models');

const PORT = process.env.PORT;

sequelize.sync({ force: false}).then(() => {
  console.log("Database synced");
  
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });

// module.exports = app;
