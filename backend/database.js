const mysql = require("mysql");
const dotenv = require("dotenv");

dotenv.config();

const connection = mysql.createPool({
  connectionLimit: 1000,
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: "citybike",
});
const closeConnectionPool = () => {
  connectionPool.end((err) => {
    if (err) {
      console.error("Error closing database connection pool:", err);
    } else {
      console.log("Database connection pool closed");
    }
  });
};
module.exports = connection;
