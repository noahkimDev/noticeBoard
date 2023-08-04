const express = require("express");
const db = require("./models/index");
const bcrypt = require("bcrypt");
const path = require("path");
const router = express.Router();

router.get("/", async (req, res) => {
  try {
    let allList;
    allList = await db.Content.findAll({
      attributes: ["id", "title", "author", "createdAt"],
    });
    console.log(allList);
    res.json(allList);
    // res.send("쟂");
  } catch (error) {
    console.log(error);
    res.status(403).send("Bringing the list was failed");
  }
});

router.post("/signup", async (req, res) => {
  // console.log("혹시");
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

router.post("/writethenew", (req, res) => {
  // console.log(req.body);
  try {
    db.Content.create({
      title: req.body.title,
      content: req.body.write,
    });
    res.send("submit 완료");
  } catch (error) {
    console.log("에러발생", error);
    res.status(403).send("error났네");
  }
});

// router.use(express.static(path.join(__dirname, "build")));
// router.get("*", function (req, res) {
//   res.sendFile(path.join(__dirname, "build/index.html"));
// });

module.exports = router;
