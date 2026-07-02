const express = require("express");
const { readDB } = require("../middleware/readDB");
const { writeDB } = require("../helpers/writeDB");

const router = express.Router();

router.get("/logout", readDB, async (req, res) => {
  try {
    const users = res.locals.users;

    if (!users[0]) {
      return res.redirect("/");
    }

    users[0].currentUser = {};

    await writeDB(users);

    res.redirect("/");
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
});

module.exports = router;
