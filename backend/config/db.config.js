const path = require("path");
const databasePath = path.join(__dirname, "../../database/radnja.db");

module.exports = {
  DATABASE_URL: databasePath,
};
