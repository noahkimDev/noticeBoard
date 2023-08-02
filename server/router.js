const express = require("express");
const memberDb = require("./models/member");
const bcrypt = require("bcrypt");
const path = require("path");
const router = express.Router();

router.post("/signup", async (req, res) => {
  const alreadyMember = await memberDb.findOne({
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
        memberDb.create({
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

// router.use(express.static(path.join(__dirname, "build")));
// router.get("*", function (req, res) {
//   res.sendFile(path.join(__dirname, "build/index.html"));
// });

module.exports = router;
