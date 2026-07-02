const express = require("express");
const { readDB } = require("../middleware/readDB");
const { writeDB } = require("../helpers/writeDB");
const bcrypt = require("bcryptjs");

const router = express.Router();

router.post("/login", [readDB], async (req, res) => {
  try {
    const { email, password } = req.body;

    const users = res.locals.users;

    const usersDatabase = users[0]?.usersDB;
    const currentUser = users[0]?.currentUser;

    if (!usersDatabase) {
      return res.status(500).json({
        error: "database is not available",
      });
    }

    if (currentUser && Object.keys(currentUser).length > 0) {
      return res.status(400).json({
        error: "already logged in.",
      });
    }

    if (!email || !password) {
      return res.status(400).json({
        error: "email and password are required.",
      });
    }

    const user = usersDatabase.find((user) => user.email === email);

    if (!user) {
      return res.status(400).json({
        error: "invalid email or password.",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({
        error: "Invalid email or password.",
      });
    }

    users[0].currentUser = {
      name: user.name,
      email: user.email,
    };

    await writeDB(users);

    res.redirect("/");
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
});

module.exports = router;
