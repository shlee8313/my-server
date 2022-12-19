const express = require("express");
const router = express.Router();
const pool = require("../db/db_con");
const bcrypt = require("bcrypt");

router.get("/", async (req, res) => {
  if (req.user) {
    return res.send(`${req.user.username}님 환영합니다!`);
  }
  let conn;
  try {
    conn = await pool.getConnection();
    const sql = "SELECT * FROM Users ";
    // const rows = await pool.query(sql);
    const rows = await conn.query(sql);
    res.json(rows);
    // console.log(rows); //[ {val: 1}, meta: ... ]
    // const res = await conn.query("INSERT INTO myTable value (?, ?)", [1, "mariadb"]);
    // console.log(res); // { affectedRows: 1, insertId: 1, warningStatus: 0 }
  } catch (err) {
    throw err;
  } finally {
    if (conn) return conn.end();
  }
});

router.get("/:id", async function (req, res) {
  let conn;
  try {
    conn = await pool.getConnection();
    const sql = `SELECT id, email, password, created_at FROM user WHERE id=?`;
    const rows = await conn.query(sql, req.params.id);
    res.json(rows);
  } catch (error) {
    res.send(error.message);
  } finally {
    if (conn) return conn.end();
  }
  // res.json({ id: req.params.id });
});

router.post("/register", async function (req, res) {
  let conn;
  try {
    conn = await pool.getConnection();
    const { email, password } = req.body;
    const encryptedPassword = await bcrypt.hash(password, 10);
    const sql = "INSERT INTO user (email, password) VALUES (?,?)";
    const result = await conn.query(sql, [email, encryptedPassword]);

    res.status(200).json({ userId: result.insertId });
  } catch (error) {
    res.status(400).send(error.message);
  } finally {
    if (conn) return conn.end();
  }
});

router.post("/login", async function (req, res) {
  let conn;
  try {
    const { id, password } = req.body;
    conn = await pool.getConnection();
    const sql = "SELECT password FROM user WHERE id=?";
    const rows = await conn.query(sql, id);
    if (rows) {
      const isValid = await bcrypt.compare(password, rows[0].password);
      res.status(200).json({ valid_password: isValid });
    }
    res.status(200).send(`User with id ${id} was not found`);
  } catch (error) {
    res.status(400).send(error.message);
  } finally {
    if (conn) return conn.end();
  }
});

module.exports = router;
