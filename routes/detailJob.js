const express = require("express");
const mariadb = require("mariadb");
const router = express.Router();
const pool = require("../db/db_con");
// const bcrypt = require("bcrypt");

router.get("/", async (req, res) => {
  // if (req.user) {
  //   return res.send(`${req.user.username}님 환영합니다!`);
  // }
  console.log(req.query);
  let conn;
  const date = req.query.date;
  const jobtype = req.query.job_type;
  const metro = req.query.metro_city;
  const city = req.query.city;
  try {
    conn = await pool.getConnection();

    const sql = `select a.event_id, a.date, a.metro_city,  a.city, a.job_type , a.job_count, a.amount, a.description , b.com_name, b.tel, b.address, b.biz_no from wanted_man as a left join users as b on a.user_id = b.user_id  where a.job_type="${jobtype}"  and a.date="${date}" and  a.metro_city="${metro}" and a.city="${city}"`; //and metro_city=${} and city=${}
    console.log(sql);
    const rows = await conn.query(sql);
    console.log("호출" + JSON.stringify(rows));
    res.json(rows);

    // console.log("호출잘됨" + JSON.stringify(rows)); //[ {val: 1}, meta: ... ]
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
    const sql = `SELECT * FROM wanted_man WHERE user_id=? ORDER BY created_at DESC;`;
    const rows = await conn.query(sql, req.params.id);
    console.log("호출잘됨");
    res.json(rows);
  } catch (error) {
    res.json(error);
    console.log("일용직에러 " + error.message);
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
    const {
      site_id,
      user_id,
      com_name,
      site_name,
      site_address,
      start_date,
      end_date,
      include_sunday,
      include_holiday,
      captain_name,
      captain_phone,
      pay_method,
    } = req.body;
    // const encryptedPassword = await bcrypt.hash(password, 10);
    const sql =
      "INSERT INTO wanted_man (user_id,site_id, com_name, site_name, site_address, start_date, end_date, include_sunday, include_holiday, captain_name, captain_phone, pay_method) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)";

    const result = await conn.query(sql, [
      user_id,
      site_id,
      com_name,
      site_name,
      site_address,
      start_date.substring(0, 10),
      end_date.substring(0, 10),
      Number(include_sunday),
      Number(include_holiday),
      captain_name,
      captain_phone,
      Number(pay_method),
    ]);

    res.status(200).json({ result });
  } catch (error) {
    res.json(error);
    console.log("일용직에러 " + error.message);
  } finally {
    if (conn) return conn.end();
  }
});

router.get("/edit/:id", async function (req, res) {
  let conn;
  try {
    conn = await pool.getConnection();
    const sql = `SELECT * FROM wanted_man WHERE id=?`;
    console.log("req.params.id" + req.params.id);
    const rows = await conn.query(sql, req.params.id);
    console.log("수정시 조회" + JSON.stringify(rows));
    res.json(rows);
  } catch (err) {
    throw err;
  } finally {
    if (conn) return conn.end();
  }
  // res.json({ id: req.params.id });
});

router.put("/edit/:id", async function (req, res) {
  try {
    conn = await pool.getConnection();
    const id = req.params.id;
    console.log("업데이트 아이디:" + id);
    const {
      site_name,
      site_address,
      start_date,
      end_date,
      include_sunday,
      include_holiday,
      captain_name,
      captain_phone,
      pay_method,
    } = req.body;
    // console.log("업데이트 데이타:" + JSON.stringify(req.body));
    // const encryptedPassword = await bcrypt.hash(password, 10);
    const sql = `UPDATE wanted_man SET site_name='${site_name}',site_address='${site_address}',start_date='${start_date}',end_date='${end_date}',
    include_sunday='${include_sunday}',include_holiday='${include_holiday}',captain_name='${captain_name}',
    captain_phone='${captain_phone}',pay_method='${pay_method}' WHERE id=${id}`;
    console.log("업데이트 sql:" + sql);
    const result = await conn.query(sql);

    BigInt.prototype.toJSON = function () {
      return this.toString();
    };

    res.json({ result });
  } catch (error) {
    res.json(error);
  } finally {
    if (conn) return conn.end();
  }
});

router.delete("/:id", async function (req, res) {
  try {
    conn = await pool.getConnection();
    const id = req.params.id;
    console.log("딜리트 아이디:" + id);
    // const id = req.body;
    // console.log("업데이트 데이타:" + id + JSON.stringify(req.body));
    // const encryptedPassword = await bcrypt.hash(password, 10);
    const sql = `DELETE FROM wanted_man  WHERE site_id=${id}`;
    // console.log("업데이트 sql:" + sql);
    const result = await conn.query(sql);
    BigInt.prototype.toJSON = function () {
      return this.toString();
    };
    res.status(200).json({ result });
  } catch (error) {
    console.log("db error" + error);
    res.json(error);
  } finally {
    if (conn) return conn.end();
  }
});

module.exports = router;
