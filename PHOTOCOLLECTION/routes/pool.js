var mysql = require("mysql");
var pool = mysql.createPool({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "12345",
  database: "tech",
  connectionLimit: "1000",
});
module.exports = pool;
