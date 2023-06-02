const sqlite3 = require("sqlite3");
const dbConfig = require("../config/db.config");

// Create a connection to the database
const database = new sqlite3.Database(dbConfig.DATABASE_URL);

module.exports = database;
