// const mdbConn = require("./getUser");
const express = require("express");
const cors = require("cors");
const app = express();
// const bodyParser = require("body-parser");
const PORT = 3050;

app.use(cors());

// // app.listen(port, () => {
// //   console.log(`listening on ${port}`);
// // });

// /**
//  * Middleware
//  */
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// mdbConn
//   .getUserList()
//   .then((rows) => {
//     console.log(rows);
//   })
//   .catch((errMsg) => {
//     console.log(errMsg);
//   });
// /**
//  * Routes
//  */

app.get("/", (req, res) => {
  res.send("This is not why you're here.");
});
app.get("/home", function (req, res) {
  res.send("home");
});
/**
 * 유저
 * **/
const userRouter = require("./routes/users");
app.use("/user", userRouter);
/**
 * 공사현장
 * **/
const conSiteRouter = require("./routes/constructionSite");
app.use("/construction-site", conSiteRouter);

/**
 *
 * 일용직
 */
const labor = require("./routes/labor");
app.use("/labor", labor);

const testRouter = require("./routes/test");
app.use("/test", testRouter);

/**
 * 구인공고
 */
const wantedRouter = require("./routes/wanted");
app.use("/wanted", wantedRouter);

/**
 * 직종 디테일 조회
 */
const detailJobRouter = require("./routes/detailJob");
app.use("/job-details", detailJobRouter);

/**
 *
 * home Calendar에
 */

const homeCalenderRouter = require("./routes/home-calendar");
app.use("/home-calendar", homeCalenderRouter);

/**Start listening */
app.listen(PORT, () => {
  console.log(`Listening for requests on port ${PORT}`);
});

// const express = require("express");
// const app = express();
// const port = 3000;
// app.use(express.json());
// app.use(
//   express.urlencoded({
//     extended: true,
//   })
// );
// app.get("/", (req, res) => {
//   res.json({ message: "ok" });
// });
// app.listen(port, () => {
//   console.log(`Example app listening at http://localhost:${port}`);
// });
