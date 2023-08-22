const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const db = require("../models/index");
const cookie = require("cookie");
const { nextTick } = require("process");

async function jwtLogin(req, res) {
  const { email, pw } = req.body;
  try {
    let findMember = await db.Member.findOne({ where: { email: email } });
    await bcrypt.compare(pw, findMember.password, function (err, result) {
      if (err) return res.status(403).send("bcrypt error");
      if (findMember && result) {
        // 토큰 생성 및 발급(with cookie)
        // 엑세스토큰, 리프레쉬토큰 2가지 생성 및 발급

        // access토큰 생성
        const accessToken = jwt.sign(
          {
            id: findMember.id,
            nickname: findMember.nickname,
            email: findMember.email,
          },
          process.env.ACCESS_SECRET,
          { issuer: "notice_board", expiresIn: "1m" }
        );

        const refreshToken = jwt.sign(
          {
            id: findMember.id,
            nickname: findMember.nickname,
            email: findMember.email,
          },
          process.env.REFRESH_SECRET,
          { issuer: "notice_board", expiresIn: "24h" }
        );

        res.cookie("accessToken2", accessToken);
        res.cookie("refreshToken2", refreshToken);

        res.send("로그인 성공, Two tokens are made!");
      }
    });
  } catch (error) {
    console.log("에러", error);
    res.send("실패");
    // res.status(403).json(error);
  }
}
async function checkJwtAccess(req, res, next) {
  try {
    // ACCESS TOKEN 유효성 검사
    const cookies = await cookie.parse(req.headers.cookie);
    const token = await cookies.accessToken2;
    // 토큰이 유효할 경우 verify의 결과를 얻을 수 있음
    // 토큰이 유효하지 않다면 바로 catch로 이동함
    const tokenData = await jwt.verify(token, process.env.ACCESS_SECRET);
    req.loginInfo = tokenData;
    // await res.json({ message: `${tokenData.nickname}님 안녕하세요` });
    req.check = true;
    console.log("try");
    next();
  } catch (error) {
    // ACCESS ToKEN 유효성 검사실패했을때
    // Refresh Token 유효성 검사해서 통과하면 ACCESS TOKEN 갱신하는 곳
    console.log("catch");
    try {
      const cookies = await cookie.parse(req.headers.cookie);
      const refreshToken = await cookies.refreshToken2;
      const refreshTokenData = await jwt.verify(
        refreshToken,
        process.env.REFRESH_SECRET
      );
      const bringDataFromDb = await db.Member.findOne({
        attributes: { exclude: ["password"] },
        where: { email: refreshTokenData.email },
      });
      const newAccessToken = await jwt.sign(
        {
          // sign함수에 어떤 유저정보 담을지 결정
          id: bringDataFromDb.id,
          nickname: bringDataFromDb.nickname,
          email: bringDataFromDb.email,
        },
        // secret키
        process.env.ACCESS_SECRET,
        //유효기간 + 발행자가 누구인지
        { expiresIn: "1m", issuer: "notice_board" }
      );
      // console.log("엑세스 토큰만 만료", newAccessToken);
      //   req.newAccessToken = newAccessToken;
      await res.cookie("accessToken2", newAccessToken, {
        secure: false,
        httpOnly: true,
      });
      req.loginInfo = refreshToken;
      req.check = true;
      next();
    } catch (error) {
      // refreshToken의 유효성이 실패했을 때
      console.log("둘다 유효기간 지남");
      req.check = false;
      // req.loginInfo = { id: "", nickname: "", email: "" };

      next();
    }
  }
}

module.exports = { checkJwtAccess, jwtLogin };
