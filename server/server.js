const express = require("express");
const app = express();
const dotenv = require("dotenv");

dotenv.config();

const { Sequelize, Model, DataTypes } = require("sequelize");
const sequelize = new Sequelize(
  process.env.DBNAME,
  process.env.USERNAME23,
  process.env.PASSWORD,
  {
    host: "localhost",
    dialect: "mysql",
  }
);

try {
  sequelize.authenticate();
  console.log("sequelize 연결성공");
} catch (error) {
  console.error("sequelize 연결실패", error);
}

const User = sequelize.define("user", {
  name: DataTypes.TEXT,
  favoriteColor: {
    type: DataTypes.TEXT,
    defaultValue: "green",
  },
  age: DataTypes.INTEGER,
  cash: DataTypes.INTEGER,
});

(async () => {
  await sequelize.sync({ force: true });
  // Code here
  const jane = User.create({ name: "Jane" });
  //   console.log(jane instanceof User); // true
  //   console.log(jane.name); // "Jane"
  //   await jane.save();
  //   console.log("Jane was saved to the database!");
})();

app.listen(8000, function () {
  console.log("welcome to 8000 server!");
});
