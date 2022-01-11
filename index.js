const express = require("express");
const app = express();
const path = require("path");
const mongoose = require("mongoose");

const methodOverride = require("method-override");
const seedDB = require("./seed");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user");

const productRoutes = require("./routes/product");
const authRoutes = require("./routes/auth");
const cartRoutes = require("./routes/cart");

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "/public")));

const sessionConfig = {
  secret: "mysecret",
  resave: false,
  saveUninitialized: true,
};
app.use(session(sessionConfig));
app.use(flash());

//initialising the passport and sessions to store user info
app.use(passport.initialize());
app.use(passport.session());

//configuring the passport to use local strategy
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

mongoose
  .connect("mongodb://localhost:27017/shopApp", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("DB Connected");
  })
  .catch((err) => {
    console.log("Connection Failed");
    console.log(err);
  });


//things written inside res.locals is available on the templates
app.use(function (req, res, next) {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currentUser = req.user;
  next();
});

app.use(productRoutes);
app.use(authRoutes);
app.use(cartRoutes);
// seedDB();
app.listen(3000, () => {
  console.log("Server started at port 3000");
});
