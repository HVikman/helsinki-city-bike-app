const mysql = require("mysql");
const dotenv = require("dotenv");

dotenv.config();

const connection = mysql.createConnection({
  host: "localhost",
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: "citybike",
});
module.exports = connection;
