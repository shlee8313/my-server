const express = require("express");
const mariadb = require("mariadb");
const router = express.Router();
const pool = require("../db/db_con");

router.get("/", async (req, res) => {
  // if (req.user) {
  //   return res.send(`${req.user.username}님 환영합니다!`);
  // }

  let conn;
  try {
    conn = await pool.getConnection();
    const sql = "SELECT * FROM table_test";
    // const rows = await pool.query(sql);
    const rows = await conn.query(sql);
    res.json(rows);
    console.log("table test호출잘됨"); //[ {val: 1}, meta: ... ]
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
    const sql = `SELECT * FROM table_test WHERE id=?`;
    const rows = await conn.query(sql, req.params.id);
    res.json(rows);
  } catch (err) {
    throw err;
  } finally {
    if (conn) return conn.end();
  }
  // res.json({ id: req.params.id });
});

router.post("/", async function (req, res) {
  let conn;
  console.log("POST 호출 호출" + req.body);
  try {
    conn = await pool.getConnection();
    const { fullName, address, phoneNumber, email } = req.body;
    // const encryptedPassword = await bcrypt.hash(password, 10);
    const sql = "INSERT INTO table_test (fullName, address,phoneNumber, email) VALUES (?,?,?,?)";
    const result = await conn.query(sql, [fullName, address, phoneNumber, email]);

    res.status(200).json({ result });
  } catch (err) {
    throw err;
  } finally {
    if (conn) return conn.end();
  }
});

router.put("/:id", async function (req, res) {
  try {
    conn = await pool.getConnection();
    const id = req.params.id;
    // console.log("업데이트 아이디:" + id);
    const { fullName, address, phoneNumber, email } = req.body;
    // console.log("업데이트 데이타:" + JSON.stringify(req.body));
    // const encryptedPassword = await bcrypt.hash(password, 10);
    const sql = `UPDATE table_test SET fullName='${fullName}',address='${address}',phoneNumber='${phoneNumber}',email='${email}' WHERE id=${id}`;
    // console.log("업데이트 sql:" + sql);
    const result = await conn.query(sql);

    res.status(200).json({ result });
  } catch (err) {
    console.log("db error" + err);
    throw err;
  } finally {
    if (conn) return conn.end();
  }
});

router.delete("/:id", async function (req, res) {
  try {
    conn = await pool.getConnection();
    const id = req.params.id;
    //   console.log("업데이트 아이디:" + id);
    // const id = req.body;
    // console.log("업데이트 데이타:" + id + JSON.stringify(req.body));
    // const encryptedPassword = await bcrypt.hash(password, 10);
    const sql = `DELETE FROM table_test  WHERE id=${id}`;
    // console.log("업데이트 sql:" + sql);
    const result = await conn.query(sql);

    res.status(200).json({ result });
  } catch (err) {
    // console.log("db error" + err);
    throw err;
  } finally {
    if (conn) return conn.end();
  }
});

// router.post("/login", async function (req, res) {
//   let conn;
//   try {
//     const { id, password } = req.body;
//     conn = await pool.getConnection();
//     const sql = "SELECT password FROM user WHERE id=?";
//     const rows = await conn.query(sql, id);
//     if (rows) {
//       const isValid = await bcrypt.compare(password, rows[0].password);
//       res.status(200).json({ valid_password: isValid });
//     }
//     res.status(200).send(`User with id ${id} was not found`);
//   } catch (error) {
//     res.status(400).send(error.message);
//   } finally {
//     if (conn) return conn.end();
//   }
// });

module.exports = router;
