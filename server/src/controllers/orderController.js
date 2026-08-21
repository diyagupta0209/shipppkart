const { body, param } = require("express-validator");
const Cart = require("../models/Cart");
const Order = require("../models/Order");
const Product = require("../models/Product");
const AppError = require("../utils/AppError");
const asyncHandler = require("../utils/asyncHandler");
const validate = require("../middleware/validate");

const addressValidators = [
  body("shippingAddress.fullName").trim().notEmpty().withMessage("Full name is required"),
  body("shippingAddress.street").trim().notEmpty().withMessage("Street is required"),
  body("shippingAddress.city").trim().notEmpty().withMessage("City is required"),
  body("shippingAddress.state").trim().notEmpty().withMessage("State is required"),
  body("shippingAddress.postalCode").trim().notEmpty().withMessage("Postal code is required"),
  body("shippingAddress.country").trim().notEmpty().withMessage("Country is required"),
];

const restoreStock = async (items) => {
  await Promise.all(
    items.map((item) =>
      Product.findByIdAndUpdate(item.product, { $inc: { stock: item.quantity } })
    )
  );
};

const createOrder = [
  ...addressValidators,
  validate,
  asyncHandler(async (req, res) => {
    const cart = await Cart.findOne({ user: req.user.id });
    if (!cart || cart.items.length === 0) {
      throw new AppError("Your cart is empty", 400);
    }

    const reserved = [];
    try {
      const orderItems = [];
      let subtotal = 0;

      for (const item of cart.items) {
        const product = await Product.findOneAndUpdate(
          {
            _id: item.product,
            isActive: true,
            stock: { $gte: item.quantity },
          },
          { $inc: { stock: -item.quantity } },
          { new: true }
        );

        if (!product) {
          throw new AppError("Insufficient stock or a product is no longer available", 400);
        }

        reserved.push({ product: product._id, quantity: item.quantity });
        orderItems.push({
          product: product._id,
          name: product.name,
          imageUrl: product.imageUrl,
          price: product.price,
          quantity: item.quantity,
        });
        subtotal += product.price * item.quantity;
      }

      const order = await Order.create({
        user: req.user.id,
        items: orderItems,
        shippingAddress: req.body.shippingAddress,
        subtotal,
        status: "confirmed",
      });

      cart.items = [];
      await cart.save();

      res.status(201).json({ status: "success", data: { order } });
    } catch (error) {
      if (reserved.length) {
        await restoreStock(reserved);
      }
      throw error;
    }
  }),
];

const listOrders = asyncHandler(async (req, res) => {
  const filter = req.user.role === "admin" ? {} : { user: req.user.id };
  const orders = await Order.find(filter).sort({ createdAt: -1 });
  res.json({ status: "success", results: orders.length, data: { orders } });
});

const getOrder = [
  param("id").isMongoId().withMessage("Invalid order id"),
  validate,
  asyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id);
    if (!order) {
      throw new AppError("Order not found", 404);
    }
    if (req.user.role !== "admin" && order.user.toString() !== req.user.id) {
      throw new AppError("You do not have permission to view this order", 403);
    }
    res.json({ status: "success", data: { order } });
  }),
];

const cancelOrder = [
  param("id").isMongoId().withMessage("Invalid order id"),
  validate,
  asyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id);
    if (!order) {
      throw new AppError("Order not found", 404);
    }
    if (req.user.role !== "admin" && order.user.toString() !== req.user.id) {
      throw new AppError("You do not have permission to cancel this order", 403);
    }
    if (["shipped", "delivered", "cancelled"].includes(order.status)) {
      throw new AppError(`Cannot cancel an order that is ${order.status}`, 400);
    }

    await restoreStock(order.items);
    order.status = "cancelled";
    await order.save();
    res.json({ status: "success", data: { order } });
  }),
];

module.exports = { createOrder, listOrders, getOrder, cancelOrder };
