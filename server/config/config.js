require("dotenv").config();

const development = {
  username: process.env.USERNAME23,
  password: process.env.PASSWORD,
  database: process.env.DBNAME,
  host: "127.0.0.1",
  dialect: "mysql",
};
const test = {
  username: process.env.USERNAME23,
  password: process.env.PASSWORD,
  database: process.env.DBNAME,
  host: "127.0.0.1",
  dialect: "mysql",
};
const production = {
  username: process.env.USERNAME23,
  password: process.env.PASSWORD,
  database: process.env.DBNAME,
  host: "127.0.0.1",
  dialect: "mysql",
};
module.exports = { test, production, development };
