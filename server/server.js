const express = require("express");
const app = express();
const cors = require("cors");
const { sequelize } = require("./models/index");
const route = require("./router.js");
// const bodyParser = require("body-parser");

sequelize
  .sync({ alter: true }) //
  .then(() => {
    console.log("sequelize-db 연결 성공");
  })
  .catch((err) => {
    console.log(err);
  });

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/", route);

app.listen(8000, function () {
  console.log("welcome to 8000 server!");
});
