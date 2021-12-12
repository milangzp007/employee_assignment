const mysql = require("mysql");
const dbConfig = require("../config.js");
const addBulkData = require('../scritp')

// Create a connection to the database
const connection = mysql.createConnection({
  host: dbConfig.dbDev.HOST || `127.0.0.1`,
  user: dbConfig.dbDev.USER || `root`,
  password: dbConfig.dbDev.PASSWORD || `password`,
  database: dbConfig.dbDev.DB || `testings`,
  port: dbConfig.dbDev.PORT || `3306`
});

// open the MySQL connection
connection.connect(error => {
  if (error) throw error;
  console.log("Successfully connected to the database.");
  addBulkData(connection)

});
module.exports = connection;