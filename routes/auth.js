const express = require("express");
const User = require("../models/user");
const router = express.Router();
const passport = require("passport");

// router.get("/fakeUser", async (req, res) => {
//   const user = new User({ email: "abhilash@gmail.com", username: "abhilash" });
//   const newUser = await User.register(user, "avinash12");
//   res.send(newUser);
// });

//Get the Sign up Form
router.get("/register", async (req, res) => {
  res.render("auth/signup");
});
router.post("/register", async (req, res) => {
  try {
    const user = new User({
      username: req.body.username,
      email: req.body.email,
    });
    const newUser = await User.register(user, req.body.password);
    req.flash("success", "Registered Successfully");
    res.redirect("/products");
  } catch (e) {
    req.flash("error", e.message);
    res.redirect("/register");
  }
});

//get the login form
router.get("/login", async (req, res) => {
  res.render("auth/login");
});

router.post(
  "/login",
  passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: true,
  }),
  (req, res) => {
    req.flash("success", `Welcome Back ${req.user.username} !! ` );
    // console.log(req.user);
    res.redirect("/products");
  }
);

router.get("/logout", (req, res) => {
  req.logout();
  req.flash("success", "Logged Out Successfully");
  res.redirect("/login");
});
module.exports = router;
