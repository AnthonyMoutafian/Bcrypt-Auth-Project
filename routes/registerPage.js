const express = require("express");
const { readDB } = require("../middleware/readDB");

const router = express.Router();

router.get("/register-page", readDB, (req, res) => {
    const users = res.locals.users;

    if (
        users[0].currentUser &&
        Object.keys(users[0].currentUser).length > 0
    ) {
        return res.redirect("/");
    }

    res.render("register", { users });
});

module.exports = router;
