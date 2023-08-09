const express = require("express");
const router = express.Router();

router.get("/login", (req, res) => {
  console.log("로그인");
  try {
    // res.writeHead(200, {
    //   "Set-Cookie": "go=kim",
    // });
    // res.cookie("exampleCookie", "exampleValue", {
    //   secure: true,
    //   httpOnly: true,
    // });
    // res.cookie("wow=good");
    res.send("쿠키 생성");
  } catch (error) {
    res.status(403).send("log-in is not working");
  }
});

module.exports = router;
