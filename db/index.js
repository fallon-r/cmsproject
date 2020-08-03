
require('dotenv').config()
const util = require("util");
const mysql = require("mysql");

const connection = mysql.createConnection({
  host: "localhost",
  user: process.env.MYSQLU,
  password: process.env.MYSQLPASS,
  database: "employees"
});

connection.connect();


connection.query = util.promisify(connection.query);

module.exports = connection;
