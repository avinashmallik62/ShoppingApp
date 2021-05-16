const express = require("express");
const app = express();
const mongoose = require("mongoose");
const seedDB = require("./seed");
const Product = require("./models/product");
const path = require("path");
const methodOverride = require("method-override");
mongoose
  .connect("mongodb://localhost:27017/shoppingApp", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  })
  .then(() => {
    console.log("DB Connected");
  })
  .catch((err) => {
    console.log("DB connection failed");
    console.log(err);
  });
// seedDB();

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

app.get("/", (req, res) => {
  res.send("Hello World");
});
app.get("/products", async (req, res) => {
  const products = await Product.find({});
  res.render("index", { products });
});
app.get("/products/new", async (req, res) => {
  res.render("new");
});
app.post("/products", async (req, res) => {
  await Product.create(req.body);
  res.redirect("/products");
});
app.get("/products/:id", async (req, res) => {
  const product = await Product.findById(req.params.id);
  res.render("show", { product });
});
app.get("/products/:id/edit", async (req, res) => {
  const product = await Product.findById(req.params.id);
  res.render("edit", { product });
});
app.patch("/products/:id", async (req, res) => {
  await Product.findByIdAndUpdate(req.params.id, req.body);
  res.redirect(`/products/${req.params.id}`);
});
app.delete("/products/:id", async (req, res) => {
  await Product.findByIdAndDelete(req.params.id);
  res.redirect(`/products`);
});
app.listen(3000, () => {
  console.log("Server started at port 3000");
});
