const express = require("express");
const router = express.Router();
const isLoggedIn = require("../middleware");
const Product = require("../models/product");
const User = require("../models/user");

router.get("/user/:userId/cart", isLoggedIn, async (req, res) => {
  try {
    const user = await User.findById(req.params.userId).populate("cart");
    res.render("cart/showCart", { cart: user.cart });
  } catch (e) {
    req.flash("error", "Cannot find the cart");
    res.render("error");
  }
});

router.post("/user/:id/cart", isLoggedIn, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    const user = req.user;
    user.cart.push(product);
    await user.save();
    res.redirect(`/user/${user._id}/cart`);
  } catch (e) {
    req.flash("error", "cannot add product to cart");
    res.render("error");
  }
});

router.delete("/user/:userid/cart/:id", isLoggedIn, async (req, res) => {
  try {
    const { userid, id } = req.params;
    await User.findByIdAndUpdate(userid, { $pull: { cart: id } });
    req.flash("success", "Product Removed!!");
    res.redirect(`/user/${req.user._id}/cart`);
  } catch (e) {
    req.flash("error", "cannot delete product at this moment");
    res.render("error");
  }
});
router.get("/user/:userId/payment", isLoggedIn,async (req, res) => {
  res.render("payment");
});
module.exports = router;
