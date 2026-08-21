const { body, param } = require("express-validator");
const Product = require("../models/Product");
const AppError = require("../utils/AppError");
const asyncHandler = require("../utils/asyncHandler");
const validate = require("../middleware/validate");

const productBodyValidators = [
  body("name").trim().isLength({ min: 2, max: 120 }).withMessage("Name must be 2-120 characters"),
  body("sku").trim().isLength({ min: 2, max: 40 }).withMessage("SKU is required"),
  body("description").optional().isString(),
  body("price").isFloat({ min: 0 }).withMessage("Price must be a non-negative number"),
  body("imageUrl").trim().notEmpty().withMessage("Image URL is required"),
  body("category").trim().notEmpty().withMessage("Category is required"),
  body("stock").isInt({ min: 0 }).withMessage("Stock must be a non-negative integer"),
  body("isActive").optional().isBoolean(),
];

const listProducts = asyncHandler(async (req, res) => {
  const filter = { isActive: true };
  if (req.query.category) {
    filter.category = req.query.category;
  }
  if (req.query.search) {
    filter.name = { $regex: req.query.search, $options: "i" };
  }

  const products = await Product.find(filter).sort({ createdAt: 1 });
  res.json({
    status: "success",
    results: products.length,
    data: { products },
  });
});

const getProduct = [
  param("id").isMongoId().withMessage("Invalid product id"),
  validate,
  asyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id);
    if (!product || !product.isActive) {
      throw new AppError("Product not found", 404);
    }
    res.json({ status: "success", data: { product } });
  }),
];

const createProduct = [
  ...productBodyValidators,
  validate,
  asyncHandler(async (req, res) => {
    const product = await Product.create(req.body);
    res.status(201).json({ status: "success", data: { product } });
  }),
];

const updateProduct = [
  param("id").isMongoId().withMessage("Invalid product id"),
  ...productBodyValidators.map((rule) => rule.optional()),
  validate,
  asyncHandler(async (req, res) => {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!product) {
      throw new AppError("Product not found", 404);
    }
    res.json({ status: "success", data: { product } });
  }),
];

const deleteProduct = [
  param("id").isMongoId().withMessage("Invalid product id"),
  validate,
  asyncHandler(async (req, res) => {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    );
    if (!product) {
      throw new AppError("Product not found", 404);
    }
    res.json({ status: "success", data: { product } });
  }),
];

module.exports = {
  listProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
};
