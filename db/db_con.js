const mariadb = require("mariadb");
const vals = require("../db_config");

const pool = mariadb.createPool({
  host: vals.DBHost,
  port: vals.DBPort,
  user: vals.DBUser,
  password: vals.DBPassword,
  database: vals.Database,
  connectionLimit: 5,
  dateStrings: "date",
});

// Connect and check for errors
// pool.getConnection((err, connection) => {
//   //   let conn, rows;
//   //   conn = pool.getConnection();
//   //   rows = conn.query("SELECT * FROM Users");
//   //   console.log(rows);
//   if (err) {
//     if (err.code === "PROTOCOL_CONNECTION_LOST") {
//       console.error("Database connection lost");
//     }
//     if (err.code === "ER_CON_COUNT_ERROR") {
//       console.error("Database has too many connection");
//     }
//     if (err.code === "ECONNREFUSED") {
//       console.error("Database connection was refused");
//     }
//   }
//   if (connection) connection.release();

//   return;
// });

module.exports = pool;
