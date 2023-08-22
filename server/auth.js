const express = require("express");
const router = express.Router();
const cookie = require("cookie");
const db = require("./models/index");
const bcrypt = require("bcrypt");
const { check } = require("prettier");
const {
  jwtLogin,
  // logout,
  // accessToken,
  // refreshToken,
  // success,
} = require("./jwtController/tokenFunc");
// const sessionAuth = require("./sessionAuth");

router.get("/logout", async (req, res) => {
  //-----------쿠키 로그아웃 방식

  // await res.clearCookie("email");
  // await res.clearCookie("password");
  // if (!req.headers.cookies) {
  //   // console.log(req.headers.cookies);
  //   res.json({ msg: "로그아웃 성공", boolean: false });
  // } else {
  //   res.json({ msg: "로그아웃 실패", boolean: true });
  // }

  //----------세션 로그아웃 방식

  // try {
  //   req.session.destroy(function (err) {
  //     if (err) {
  //       return res.status(403).send("logout failed");
  //     }
  //     res.send("로그아웃 성공");
  //   });
  // } catch (error) {
  //   res.status(403).send("delete session data failed");
  // }

  //--------jwt 로그아웃 방식(쿠키에 담긴 토큰)
  try {
    await res.cookie("accessToken2", "");
    await res.cookie("refreshToken2", "");
    await res.send("logout success");
  } catch (error) {
    res.status(403).json(error);
  }
});
///////////////////////
//TOKEN

router.post("/jwtlogin", jwtLogin);
// router.get("/accessToken", accessToken);
// router.get("/refreshToken", refreshToken);
// router.get("/success", success);
// router.post("/jwtlogout", logout);

////////////////////////////////////////////
router.post("/sessionLogin", async (req, res) => {
  const { email, pw } = req.body;
  try {
    let findMember = await db.Member.findOne({ where: { email: email } });
    bcrypt.compare(pw, findMember.password, function (err, result) {
      if (err) return res.status(403).send("bcyrpt error");

      if (result && findMember) {
        req.session.member = findMember.id;
        req.session.author = findMember.nickname;
        res.send("세션로그인 성공");
      } else {
        res.status(403).send("Invalid information");
      }
    });
  } catch (error) {
    console.log(error);
    res.status(403).send("internal server error");
  }
});

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
    // bcrypt 함수
    await bcrypt.compare(
      req.body.pw, // 내가 작성한 pw
      dbPw.dataValues.password, // db에 저장되어있던 pw
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
