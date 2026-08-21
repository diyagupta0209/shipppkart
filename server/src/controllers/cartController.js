const { body, param } = require("express-validator");
const Cart = require("../models/Cart");
const Product = require("../models/Product");
const AppError = require("../utils/AppError");
const asyncHandler = require("../utils/asyncHandler");
const validate = require("../middleware/validate");

const getOrCreateCart = async (userId) => {
  let cart = await Cart.findOne({ user: userId });
  if (!cart) {
    cart = await Cart.create({ user: userId, items: [] });
  }
  return cart;
};

const serializeCart = async (cart) => {
  await cart.populate("items.product");
  const items = cart.items
    .filter((item) => item.product)
    .map((item) => ({
      product: {
        id: item.product._id,
        name: item.product.name,
        price: item.product.price,
        imageUrl: item.product.imageUrl,
        stock: item.product.stock,
        sku: item.product.sku,
      },
      quantity: item.quantity,
      lineTotal: item.quantity * item.product.price,
    }));

  const subtotal = items.reduce((sum, item) => sum + item.lineTotal, 0);
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  return { items, subtotal, itemCount };
};

const getCart = asyncHandler(async (req, res) => {
  const cart = await getOrCreateCart(req.user.id);
  res.json({ status: "success", data: { cart: await serializeCart(cart) } });
});

const addItem = [
  body("productId").isMongoId().withMessage("Valid productId is required"),
  body("quantity").optional().isInt({ min: 1 }).withMessage("Quantity must be at least 1"),
  validate,
  asyncHandler(async (req, res) => {
    const quantity = req.body.quantity || 1;
    const product = await Product.findById(req.body.productId);
    if (!product || !product.isActive) {
      throw new AppError("Product not found", 404);
    }

    const cart = await getOrCreateCart(req.user.id);
    const existing = cart.items.find((item) => item.product.toString() === product.id);
    const nextQuantity = (existing ? existing.quantity : 0) + quantity;

    if (nextQuantity > product.stock) {
      throw new AppError(`Only ${product.stock} units available in inventory`, 400);
    }

    if (existing) {
      existing.quantity = nextQuantity;
    } else {
      cart.items.push({ product: product._id, quantity });
    }

    await cart.save();
    res.status(201).json({ status: "success", data: { cart: await serializeCart(cart) } });
  }),
];

const updateItem = [
  param("productId").isMongoId().withMessage("Invalid product id"),
  body("quantity").isInt({ min: 0 }).withMessage("Quantity must be a non-negative integer"),
  validate,
  asyncHandler(async (req, res) => {
    const cart = await getOrCreateCart(req.user.id);
    const item = cart.items.find((entry) => entry.product.toString() === req.params.productId);
    if (!item) {
      throw new AppError("Item is not in the cart", 404);
    }

    if (req.body.quantity === 0) {
      cart.items = cart.items.filter((entry) => entry.product.toString() !== req.params.productId);
    } else {
      const product = await Product.findById(req.params.productId);
      if (!product || req.body.quantity > product.stock) {
        throw new AppError(`Only ${product ? product.stock : 0} units available in inventory`, 400);
      }
      item.quantity = req.body.quantity;
    }

    await cart.save();
    res.json({ status: "success", data: { cart: await serializeCart(cart) } });
  }),
];

const removeItem = [
  param("productId").isMongoId().withMessage("Invalid product id"),
  validate,
  asyncHandler(async (req, res) => {
    const cart = await getOrCreateCart(req.user.id);
    cart.items = cart.items.filter((entry) => entry.product.toString() !== req.params.productId);
    await cart.save();
    res.json({ status: "success", data: { cart: await serializeCart(cart) } });
  }),
];

const clearCart = asyncHandler(async (req, res) => {
  const cart = await getOrCreateCart(req.user.id);
  cart.items = [];
  await cart.save();
  res.json({ status: "success", data: { cart: await serializeCart(cart) } });
});

module.exports = { getCart, addItem, updateItem, removeItem, clearCart };
