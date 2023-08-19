const db = require("../models/index");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
// const dotenv = require("dotenv");
// dotenv.config();
const cookie = require("cookie");
const login = async (req, res, next) => {
  const { email, pw } = req.body;

  try {
    let findMember = await db.Member.findOne({ where: { email: email } });
    await bcrypt.compare(pw, findMember.password, function (err, result) {
      if (err) {
        return res.status(403).send("bcyrpt error");
      }
      console.log(result);
      if (result && findMember) {
        // 회원정보 확이된다면
        // access 토큰 발급
        const accessToken = jwt.sign(
          {
            // sign함수에 어떤 유저정보 담을지 결정
            id: findMember.id,
            nickName: findMember.nickname,
            email: findMember.email,
          },
          // secret키
          process.env.ACCESS_SECRET,
          //유효기간 + 발행자가 누구인지
          { expiresIn: "1m", issuer: "notice_board" }
        );
        // refresh 토큰 발급
        const refreshToken = jwt.sign(
          {
            id: findMember.id,
            nickName: findMember.nickname,
            email: findMember.email,
          },
          process.env.REFRESH_SECRET,
          {
            expiresIn: "24h", // accecctoken보다 유효기간 훨씬 길어야함
            issuer: "notice_board",
          }
        );

        // 두 토큰을 쿠키에 담아서 client에게 전송
        res.cookie("accessToken", accessToken, {
          secure: false,
          httpOnly: true,
        });

        res.cookie("refreshToken", refreshToken, {
          secure: false,
          httpOnly: true,
        });

        res.send("token생성 로그인 성공");
      } else {
        res.status(403).send("Invalid information");
      }
    });
  } catch (err) {
    res.status(403).json(err);
  }
};

const accessToken = async (req, res, next) => {
  // 요청에 첨부된 토큰을 갖고 db데이터를 가져오는 코드
  let cookies = cookie.parse(req.headers.cookie);
  try {
    const token = await cookies.accessToken;
    const data = await jwt.verify(token, process.env.ACCESS_SECRET);
    const bringMember = await db.Member.findOne({
      where: { email: data.email },
    });
    res.status(200).send(bringMember);
  } catch (error) {
    res.status(500).json(error);
  }
};

const refreshToken = async (req, res) => {
  // refreshToken : accesstoken을 갱신하는 용도
  let cookies = cookie.parse(req.headers.cookie);
  try {
    const token = await cookies.refreshToken;
    const data = await jwt.verify(token, process.env.REFRESH_SECRET);
    //1 토큰을 통해 db에서 데이터를 가져왔다면
    const recreateAccess = await db.Member.findOne({
      attributes: { exclude: ["password"] },
      where: { email: data.email },
    });
    //2 access Token을 갱신(재발행)하는 코드
    const accessToken = jwt.sign(
      {
        // sign함수에 어떤 유저정보 담을지 결정
        id: recreateAccess.id,
        nickName: recreateAccess.nickname,
        email: recreateAccess.email,
      },
      // secret키
      process.env.ACCESS_SECRET,
      //유효기간 + 발행자가 누구인지
      { expiresIn: "1m", issuer: "notice_board" }
    );
    res.cookie("accessToken", accessToken, {
      secure: false,
      httpOnly: true,
    });

    res.status(200).send("Access token recreated");
  } catch (error) {
    res.status(500).json(error);
  }
};
const success = async (req, res) => {
  try {
    const cookies = await cookie.parse(req.headers.cookie);
    const token = cookies.accessToken;
    const data = jwt.verify(token, process.env.ACCESS_SECRET);

    const bringData = await db.Member.findOne({
      attributes: { exclude: ["password"] },
      where: { email: data.email },
    });
    console.log(token);
    res.send(bringData);
  } catch (error) {
    res.status(403).json(error);
  }
  // const checkifornot = await db.Member.
};
const logout = async (req, res) => {
  try {
    // await res.clearCookie("accessToken");
    // await res.clearCookie("refreshToken");
    await res.cookie(`accessToken`, "");
    await res.cookie(`refreshToken`, "");
    await res.send("로그아웃 완료");
  } catch (error) {
    res.status(403).json(error);
  }
};

module.exports = {
  login,
  accessToken,
  refreshToken,
  success,
  logout,
};
