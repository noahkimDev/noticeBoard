const express = require("express");
const http = require("http");
const app = express();
const cors = require("cors");
const { sequelize } = require("./models/index");
const route = require("./router.js");
const auth = require("./auth.js");
const session = require("express-session");
// const FileStore = require("session-file-store")(session);
const MySQLStore = require("express-mysql-session")(session);
const cookieParser = require("cookie-parser");
const dotenv = require("dotenv");
dotenv.config();
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

// 세션 로그인
// app.use(
//   session({
//     secret: process.env.SECRET,
//     resave: false,
//     saveUninitialized: true,
//     store: new MySQLStore({
//       host: "localhost",
//       port: 3306, // mysql은 포트 기본이 3306
//       user: process.env.USERNAME23,
//       password: process.env.PASSWORD,
//       database: process.env.DBNAME,
//     }),
//     // store: new FileStore(),
//   })
// );

sequelize
  .sync({ alter: true }) //
  .then(() => {
    console.log("sequelize-db 연결 성공");
  })
  .catch((err) => {
    console.log(err);
  });

app.use(cookieParser());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/auth", auth);
app.use("/", route);

app.listen(8000, function () {
  console.log("welcome to 8000 server!");
});
