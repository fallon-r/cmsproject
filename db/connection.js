const util = require("util");
const mysql = require("mysql");
require('dotenv').config()



const connection = mysql.createConnection({
  host: "localhost",
  user: process.env.MYSQLU,
  password: process.env.MYSQLPW,
  database: "employees"
});

connection.connect();

connection.query = util.promisify(connection.query);

module.exports = connection;
