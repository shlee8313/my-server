const express = require("express");
const router = express.Router();
const pool = require("../db/db_con");
const bcrypt = require("bcrypt");

router.get("/", async (req, res) => {
  // if (req.user) {
  //   return res.send(`${req.user.username}님 환영합니다!`);
  // }
  let conn;
  try {
    conn = await pool.getConnection();
    const sql = "SELECT * FROM ComUser ";
    // const rows = await pool.query(sql);
    const rows = await conn.query(sql);
    res.json(rows);
    console.log(rows); //[ {val: 1}, meta: ... ]
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
    const sql = `SELECT id, email, password, created_at FROM ComUser WHERE id=?`;
    const rows = await conn.query(sql, req.params.id);
    res.json(rows);
  } catch (error) {
    res.json(error);
  } finally {
    if (conn) return conn.end();
  }
  // res.json({ id: req.params.id });
});

router.post("/register", async function (req, res) {
  let conn;
  try {
    conn = await pool.getConnection();

    console.log("회원등록" + JSON.stringify(req.body));
    const { user_id, data } = req.body;
    const { user_name, password, com_name, email, tel, biz_no, com_no, address } = data;
    const encryptedPassword = await bcrypt.hash(password, 10);
    const sql =
      "INSERT INTO `ComUser`( user_id, user_name, password, com_name, email, tel, biz_no, com_no, address) VALUES (?,?,?,?,?,?,?,?,?)";

    console.log(
      "인서트" +
        sql +
        [user_id, user_name, encryptedPassword, com_name, email, tel, biz_no, com_no, address]
    );

    const result = await conn.query(sql, [
      user_id,
      user_name,
      encryptedPassword,
      com_name,
      email,
      tel,
      biz_no,
      com_no,
      address,
    ]);
    BigInt.prototype.toJSON = function () {
      return this.toString();
    };
    res.status(200).json({ userId: result.insertId });
    console.log("회원등록 성공");
  } catch (error) {
    res.json(error);
    console.log("회원등록 실패" + error);
  } finally {
    if (conn) return conn.end();
  }
});

router.post("/login", async function (req, res) {
  let conn;
  try {
    const { username, password } = req.body;
    // console.log("비번암호화==" + (await bcrypt.hash(password, 10)));
    conn = await pool.getConnection();
    const sql = "SELECT * FROM ComUser WHERE user_name=?";
    // const sql = `SELECT user_id, password FROM ComUser WHERE user_name='${username}' and password='${password}'`;
    // console.log("login" + sql);
    const rows = await conn.query(sql, username);
    // const rows = await conn.query(sql);
    // console.log("login" + conn.query(sql, username, password));
    if (rows) {
      const isValid = await bcrypt.compare(password, rows[0].password);

      if (isValid) {
        const sql2 =
          "SELECT user_id, user_name, com_name, email, tel, biz_no, com_no, address FROM ComUser WHERE user_name=?";
        const rows2 = await conn.query(sql2, username);
        res.json({ valid_password: isValid, user: rows2 });
      } else {
        res.json({ valid_password: isValid });
      }

      // res.json({ valid_password: true, user_id: rows[0].user_id });
    }
    res.status(200).json({ notfound: true });
  } catch (error) {
    res.json(error);
  } finally {
    if (conn) return conn.end();
  }
});

module.exports = router;
