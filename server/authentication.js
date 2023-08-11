const cookie = require("cookie");

function authentication(req) {
  let cookies = {};
  let areYouMember = false;

  if (req.headers.cookie) {
    cookies = cookie.parse(req.headers.cookie);
  }

  if (cookies.email && cookies.password) {
    areYouMember = true;
  }

  return { areYouMember: areYouMember, cookies: cookies };
}

module.exports = authentication;
