const express = require("express");
const { readDB } = require("../middleware/readDB");
const bcrypt = require("bcryptjs");
const schema = require("../schema/schema");
const fs = require("fs/promises");
const path = require("path");
const router = express.Router();

router.post("/register", [readDB], async (req, res) => {
  try {
    const body = req.body;
    const users = res.locals.users;

    const userDatabase = users[0]?.usersDB;
    const currentUser = users[0]?.currentUser;

    if (!userDatabase) {
      return res.status(500).json({
        error: "database is not available",
      });
    }

    if (currentUser && Object.keys(currentUser).length > 0) {
      return res.status(400).json({
        error: "already logged in. Please logout first.",
      });
    }

    const { error } = schema.validate(body);

    if (error) {
      return res.status(400).json({
        error: error.details[0].message,
      });
    }

    const existingUser = userDatabase.find((user) => user.email === body.email);

    if (existingUser) {
      return res.status(400).json({
        error: "user already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(body.password, 10);

    const newUser = {
      name: body.name,
      email: body.email,
      password: hashedPassword,
    };

    userDatabase.push(newUser);

    const dbPath = path.join(__dirname, "../db/users.json");

    await fs.writeFile(dbPath, JSON.stringify(users, null, 2), "utf8");

    res.redirect("/login-page");
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
});

module.exports = router;
