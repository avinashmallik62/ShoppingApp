const express = require("express");
const router = express.Router();
const Product = require("../models/product");
const Review = require("../models/review");
const isLoggedIn = require("../middleware");

router.get("/products", async (req, res) => {
  try {
    const products = await Product.find({});
    // console.log(products);
    res.render("home", { products });
  } catch (e) {
    console.log("Something Went Wrong");
    req.flash("error", "Cannot Find Products");
    res.render("error");
  }
});
router.get("/products/new", isLoggedIn, (req, res) => {
  res.render("new");
});
router.post("/products", async (req, res) => {
  try {
    await Product.create(req.body.product);
    req.flash("success", "Product Created Successfully");
    res.redirect("/products");
  } catch (e) {
    console.log(e.message);
    req.flash("error", "Cannot Create Products");
    res.redirect("error");
  }
});
router.get("/products/:id", async (req, res) => {
  try {
    //populate method replaces the objectID with the whole content from reviews array
    const product = await Product.findById(req.params.id).populate("reviews");
    // console.log(product);
    res.render("show", { product });
  } catch (e) {
    console.log(e.message);
    req.flash("error", "Cannot Find Product");
    res.redirect("/error");
  }
});
router.get("/products/:id/edit", isLoggedIn, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    res.render("edit", { product });
  } catch (e) {
    console.log(e.message);
    req.flash("error", "Cannot Edit this Product");
    res.redirect("/error");
  }
});
router.patch("/products/:id", async (req, res) => {
  try {
    await Product.findByIdAndUpdate(req.params.id, req.body.product);
    req.flash("success", "Updated Successfully!");
    res.redirect(`/products/${req.params.id}`);
  } catch (e) {
    console.log(e.message);
    req.flash("error", "Cannot update this Product");
    res.redirect("/error");
  }
});
router.delete("/products/:id", isLoggedIn, async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    req.flash("success", "Deleted the product successfully");
    res.redirect("/products");
  } catch (e) {
    console.log(e.message);
    req.flash("error", "Cannot delete this Product");
    res.redirect("/error");
  }
});
router.post("/products/:id/review", isLoggedIn,async (req, res) => {
  try {
    let product = await Product.findById(req.params.id);
    const review = new Review({
      user:req.user.username,
      ...req.body
    });
    //only objectId of review will be pushed
    product.reviews.push(review);
    await review.save();
    await product.save();
    req.flash("success","Successfully added Your Review !!");
    res.redirect(`/products/${req.params.id}`);
  } catch (e) {
    console.log(e.message);
    req.flash("error", "Cannot add review to this Product");
    res.redirect("/error");
  }
});
router.get("/error", (req, res) => {
  res.status(404).render("error");
});
module.exports = router;
