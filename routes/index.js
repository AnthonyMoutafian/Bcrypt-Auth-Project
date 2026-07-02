var express = require("express");
const { readDB } = require("../middleware/readDB");
var router = express.Router();

router.get("/", [readDB], async (req, res, next) => {
  const users = res.locals.users;

  res.render("index", { users });
});

module.exports = router;
