const express = require("express");
const db = require("./models/index");
const bcrypt = require("bcrypt");
const path = require("path");
const router = express.Router();
const { Op } = require("sequelize");
const authentication = require("./authentication");

router.get("/", async (req, res) => {
  try {
    console.log("홈에서 쿠키 확인", req.headers.cookie);

    let allList = await db.Content.findAll({
      attributes: ["id", "title", "author", "createdAt"],
    });
    allList = allList.sort(function (a, b) {
      return b.id - a.id;
    });
    // console.log(allList);
    res.json({
      allList: allList,
      areYouMember: authentication(req).areYouMember,
    });
    // res.send("쟂");
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

router.post("/writethenew", async (req, res) => {
  console.log("새글쓰기", req.headers);
  // console.log(req.body);
  if (authentication(req).areYouMember) {
    console.log("샬라샬라");
    try {
      let nickName = await db.Member.findOne({
        attributes: ["nickname"],
        where: { email: authentication(req).cookies.email },
      });

      console.log("닉네임왔느", nickName.dataValues.nickname);
      await db.Content.create({
        title: req.body.title,
        content: req.body.write,
        // author: nickName.dataValues.nickname,
        author: "나야나",
      });

      return res.send("submit 완료");
    } catch (error) {
      console.log("에러발생", error);
      res.status(403).send("error났네");
    }
  } else {
    try {
      await db.Content.create({
        title: req.body.title,
        content: req.body.write,
      });
      return res.send("submit 완료");
    } catch (error) {
      console.log("에러발생", error);
      res.status(403).send("error났네");
    }
  }
});

router.get("/readTxt/:id", async (req, res) => {
  try {
    let chosenData = await db.Content.findOne({
      where: { id: req.params.id },
    });

    res.send(chosenData);
  } catch (error) {
    console.log(error);
    res.status(403).send("reading txt has an error");
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
  console.log("파람 확인", req.params.txt);
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
