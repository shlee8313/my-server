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
    const sql = "SELECT * FROM labors ";
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
    const sql = `SELECT *  FROM labors WHERE labor_id=?`;
    const rows = await conn.query(sql, req.params.id);
    res.json(rows);
  } catch (error) {
    res.json(error);
  } finally {
    if (conn) return conn.end();
  }
  // res.json({ id: req.params.id });
});

router.post("/change-pass/:id", async function (req, res) {
  let conn;
  try {
    const { username, password, newpassword } = req.body;
    // console.log("비번암호화==" + (await bcrypt.hash(password, 10)));
    conn = await pool.getConnection();
    const sql = "SELECT labor_id, password FROM labors WHERE labor_id=?";
    // const sql = `SELECT user_id, password FROM ComUser WHERE user_name='${username}' and password='${password}'`;
    // console.log("login" + sql);
    const rows = await conn.query(sql, req.params.id);
    // const rows = await conn.query(sql);
    console.log("비번==>" + (await bcrypt.hash(newpassword, 10)));

    if (rows) {
      const nameValid = username == rows[0].labor_id;
      const isValid = await bcrypt.compare(password, rows[0].password);
      console.log("네임벨리드==>" + nameValid + "패스밸리드=>" + isValid);
      if (isValid & nameValid) {
        const encryptedPassword = await bcrypt.hash(newpassword, 10);

        const sql2 = `UPDATE labors SET password="${encryptedPassword}"  WHERE labor_id=?`;
        const rows2 = await conn.query(sql2, req.params.id);
        res.json({ pass_valid: isValid, name_valid: nameValid });
      } else {
        res.json({ pass_valid: isValid, name_valid: nameValid });
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

router.post("/register", async function (req, res) {
  let conn;
  try {
    conn = await pool.getConnection();

    console.log("회원등록" + JSON.stringify(req.body));
    const { user_id, data } = req.body;
    const { user_name, password, com_name, email, tel, biz_no, com_no, address } = data;
    const encryptedPassword = await bcrypt.hash(password, 10);
    const sql =
      "INSERT INTO `labors`( user_id, user_name, password, com_name, email, tel, biz_no, com_no, address) VALUES (?,?,?,?,?,?,?,?,?)";

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
    res.json({ userId: result.insertId });
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
    console.log("비번암호화==" + (await bcrypt.hash(password, 10)));
    conn = await pool.getConnection();
    const sql = "SELECT * FROM labors WHERE labor_id=?";
    // const sql = `SELECT user_id, password FROM ComUser WHERE user_name='${username}' and password='${password}'`;
    console.log("login" + sql);
    const rows = await conn.query(sql, username);
    // const rows = await conn.query(sql);
    // console.log("login" + conn.query(sql, username, password));
    if (rows) {
      const isValid = await bcrypt.compare(password, rows[0].password);
      if (isValid) {
        res.json({ valid_password: isValid, user: rows });
      } else {
        res.json({ valid_password: isValid });
      }

      // res.json({ valid_password: true, user_id: rows[0].user_id });
    }
    res.json({ notfound: true });
  } catch (error) {
    res.json(error);
  } finally {
    if (conn) return conn.end();
  }
});

module.exports = router;
