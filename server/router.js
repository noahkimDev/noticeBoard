const express = require("express");
const db = require("./models/index");
const bcrypt = require("bcrypt");
const router = express.Router();
const { Op } = require("sequelize");
const authentication = require("./authentication");
const { checkJwtAccess } = require("./jwtController/tokenFunc");

router.get("/", checkJwtAccess, async (req, res) => {
  try {
    console.log("www", req.check);
    // console.log("홈에서 쿠키 확인", req.headers.cookie);
    // console.log("홈에서 세션 확인", req.session);
    let memberChkWithSession = false;
    // console.log("로그인 여부 확인", req.session.member);

    // session 확인
    // if (req.session.member) {

    // if (true) {
    /* req.check는 checkJwtAccess에서 왓음*/
    if (req.check) {
      // 삭제 필요
      //  token확인값 들어와야함
      console.log("로그인 이미 했음", req.loginInfo);
      memberChkWithSession = req.check;

      let allList = await db.Content.findAll({
        include: db.Member,
        attributes: ["id", "title", "author", "createdAt"],
      });
      allList = allList.sort(function (a, b) {
        return b.id - a.id;
      });

      res.json({
        allList: allList,
        // 쿠키 방식
        // areYouMember: authentication(req).areYouMember,

        // 세션 방식
        areYouMember: memberChkWithSession,
        loginInfo: req.loginInfo.nickname,
      });
    } else {
      // req.sesson.member이 undefired일 때
      console.log("로그인 안했음");
      let allList = await db.Content.findAll({
        include: db.Member,
        attributes: ["id", "title", "author", "createdAt"],
      });
      allList = allList.sort(function (a, b) {
        return b.id - a.id;
      });
      res.json({
        allList: allList,
        areYouMember: memberChkWithSession,
      });
    }
    // }
  } catch (error) {
    console.log(error);
    res.status(403).send("Bringing the list was failed");
  }
});

router.post("/signup", async (req, res) => {
  console.log("회원가입");
  const alreadyMember = await db.Member.findOne({
    where: { email: req.body.emailInfo },
  });

  if (alreadyMember) {
    res.status(403).send("This member is already joined");
  } else {
    try {
      bcrypt.hash(req.body.passwordInfo, 12, function (err, hash) {
        if (err) {
          console.log(err);
        }
        // Store hash in your password DB.
        db.Member.create({
          email: req.body.emailInfo,
          nickname: req.body.nickNameInfo,
          password: hash,
        });
      });
      res.send("회원가입 완료");
      // console.log(path.join(__dirname, "../src/home/home.js"));
      // res.sendFile(path.join(__dirname, "../src/home/home.js"));
    } catch (error) {
      console.log(error);
    }
  }
});

router.post("/writethenew", checkJwtAccess, async (req, res) => {
  // console.log("새글쓰기", req.body.authorEmail);
  // console.log(req.body);
  // console.log(req.session.member);
  // if (authentication(req).areYouMember) { // 쿠키
  // if (req.session.member) {
  // console.log(req.check);
  if (req.check) {
    // session
    try {
      // let nickName = await db.Member.findOne({
      // attributes: ["nickname"],
      // where: { email: req.body.authorEmail },
      // });
      // console./og("확인", req.session.author);
      // console.log( nickName);
      await db.Content.create({
        title: req.body.title,
        content: req.body.write,
        // author: req.session.member,
        // foreign키는 숫자값의 데이터를 할당해야함.
        author: req.loginInfo.id,
      });

      return res.send("submit 완료");
    } catch (error) {
      console.log("에러발생", error);
      res.status(403).send("error");
    }
  } else {
    // console.log("쿠키없는 경우");
    console.log("유효한 jwt토큰이 없는 경우");
    try {
      await db.Content.create({
        title: req.body.title,
        content: req.body.write,
      });
      return res.send("author없이 submit 완료");
    } catch (error) {
      console.log("에러발생", error);
      res.status(403).send("error");
    }
  }
});

router.get("/readTxt/:id", checkJwtAccess, async (req, res) => {
  // console.log("지금유저", req.session.member);
  try {
    let chosenData = await db.Content.findOne({
      include: db.Member,
      where: { id: req.params.id },
    });
    // res.send(chosenData);
    // if (req.session.member == chosenData.author) { // session 관련
    if (req.loginInfo.nickname === chosenData.Member.nickname) {
      res.json({ chosenData: chosenData, sameUser: true });
    } else {
      res.json({ chosenData: chosenData, sameUser: false });
    }
  } catch (error) {
    console.log(error);
    let chosenData = await db.Content.findOne({
      include: db.Member,
      where: { id: req.params.id },
    });
    res.json({ chosenData: chosenData, sameUser: false });

    // res.status(403).send("reading txt has an error");
  }
});

router.put("/edit/:id", async (req, res) => {
  // console.log(req.body.newContent);
  try {
    await db.Content.update(
      { title: req.body.newTitle, content: req.body.newContent },
      { where: { id: req.params.id } }
    );

    res.send("update 성공");
  } catch (error) {
    console.log(error);
    res.status(403).send("edit has an error");
  }
});

router.delete("/delete/:id", async (req, res) => {
  // console.log("삭제", req.params.id);
  try {
    db.Content.destroy({
      where: { id: req.params.id },
    });
    res.send("completed delete");
  } catch (error) {
    console.log(error);
    res.status(403).send("delete has an error");
  }
});
// router.get("/search", async (req, res) => {
//   console.log("성공");
// });
router.get("/search/:txt", async (req, res) => {
  // console.log("파람 확인", req.params.txt);
  try {
    let searchedList = await db.Content.findAll({
      attributes: ["id", "title", "author", "createdAt"],
      // 아래 txt를 포함하는 조건(앞뒤 상관없이 포함만 하면)
      where: { title: { [Op.like]: `%${req.params.txt}%` } },
    });
    searchedList.sort((a, b) => b.id - a.id);
    console.log(searchedList);
    res.send(searchedList);
  } catch (error) {
    console.log(error);
    res.status(403).send("searching data has an error");
  }
});
// router.use(express.static(path.join(__dirname, "build")));
// router.get("*", function (req, res) {
//   res.sendFile(path.join(__dirname, "build/index.html"));
// });

module.exports = router;
