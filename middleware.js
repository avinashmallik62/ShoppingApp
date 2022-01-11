const isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.flash("error", "You need to Login First");
    return res.redirect("/login");
  }
  next();
};

module.exports = isLoggedIn;
