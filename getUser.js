const mariadb = require("mariadb");
const vals = require("./db_config");

const pool = mariadb.createPool({
  host: vals.DBHost,
  port: vals.DBPort,
  user: vals.DBUser,
  password: vals.DBPassword,
  database: vals.Database,
  connectionLimit: 5,
});

async function GetUserList() {
  let conn, rows;
  try {
    conn = await pool.getConnection();
    // conn.query("USE myDB");
    rows = await conn.query("SELECT * FROM Users");
  } catch (err) {
    throw err;
  } finally {
    if (conn) conn.end();
    return rows;
  }
}

module.exports = {
  getUserList: GetUserList,
};
