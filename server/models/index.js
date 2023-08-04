"use strict";

const Sequelize = require("sequelize");
const env = process.env.NODE_ENV || "development";
const config = require(__dirname + "/../config/config.js")[env];
const db = {};

const Member = require("./member");
const Content = require("./content");

let sequelize;
// sequelize와 db를 연결하는 구문
sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  config
);

// 1. db를 export하게 되면
// 서버에서 import하여 각 모델을 사용할 수 있게 된다.
// 2. 그리고 db.sequeilize = sequelize의 경우는
// 연결객체를 나중에 재사용하기 위해서 db객체에 넣어둠
db.sequelize = sequelize;
db.Member = Member;
db.Content = Content;

//Member,Content 모델을 생성한다.
// 즉, 테이블이 모델과 연결됨.
Member.initiate(sequelize);
Content.initiate(sequelize);

// Member&Content 관계를 형성한다
Member.associate(db);
Content.associate(db);

module.exports = db;
