const express = require("express");
const router = express.Router();
const cookie = require("cookie");
const db = require("./models/index");
const bcrypt = require("bcrypt");

router.post("/cookieLogin", async (req, res) => {
  // console.log("로그인", req.body);
  console.log("젝", req.headers);
  try {
    let dbPw = await db.Member.findOne({
      attributes: ["password"],
      where: { email: req.body.email },
    });
    console.log(req.body.pw, dbPw.dataValues.password);
    // 입력한 비번과 db내 비번 비교

    await bcrypt.compare(
      req.body.pw,
      dbPw.dataValues.password,
      function (err, result) {
        if (result) {
          // 아이디,비번 정보를 담은 쿠키를 생성한다.
          // 쿠키가 보안에 취약한 이유
          // '/cookieLogin'에 요청보낼때만 cookie 보임
          res.cookie(`email`, `${req.body.email}`);
          res.cookie(`password`, `${req.body.pw}`);
          return res.send("success");
        } else {
          res.send("fail");
        }
      }
    );
    // let cookies = {};
    // cookies = cookie.parse(req.headers.cookie);
    // console.log(cookies);

    // console.log(req.headers.cookie);
  } catch (error) {
    res.status(403).send("log-in is not working");
  }
});

module.exports = router;

// res.writeHead(200, {
//   "Set-Cookie": "go=kim",
// });
