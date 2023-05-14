const mysql = require("mysql");
const dotenv = require("dotenv");

dotenv.config();

const connection = mysql.createPool({
  connectionLimit: 1000,
  host: "127.0.0.1",
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: "citybike",
});

module.exports = connection;
