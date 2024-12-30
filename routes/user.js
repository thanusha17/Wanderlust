const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync");
const ExpressError = require("../utils/expressError");
const passport = require("passport");
const { saveUrl } = require("../middleware.js");

const userController = require("../controllers/users.js");

router.route("/signup")
.get(wrapAsync(userController.signupForm))
.post(wrapAsync(userController.signup));

router.route("/login")
.get(wrapAsync(userController.loginForm))
.post(saveUrl,
    passport.authenticate('local', { failureRedirect: '/login', failureFlash: true }),
    wrapAsync(userController.login)
);

router.get("/logout",userController.logout);

module.exports = router;