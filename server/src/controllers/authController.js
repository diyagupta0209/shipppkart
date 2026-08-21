const { body, param } = require("express-validator");
const User = require("../models/User");
const AppError = require("../utils/AppError");
const asyncHandler = require("../utils/asyncHandler");
const validate = require("../middleware/validate");
const { protect } = require("../middleware/auth");

const registerValidators = [
  body("name").trim().isLength({ min: 2, max: 80 }).withMessage("Name must be 2-80 characters"),
  body("email").isEmail().withMessage("Valid email is required").normalizeEmail(),
  body("password")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters")
    .matches(/[A-Za-z]/)
    .withMessage("Password must contain a letter")
    .matches(/\d/)
    .withMessage("Password must contain a number"),
];

const loginValidators = [
  body("email").isEmail().withMessage("Valid email is required").normalizeEmail(),
  body("password").notEmpty().withMessage("Password is required"),
];

const sendAuth = (user, res, statusCode = 200) => {
  const token = user.signToken();
  res.status(statusCode).json({
    status: "success",
    token,
    data: { user: user.toSafeJSON() },
  });
};

const register = [
  ...registerValidators,
  validate,
  asyncHandler(async (req, res) => {
    const { name, email, password } = req.body;
    const existing = await User.findOne({ email });
    if (existing) {
      throw new AppError("An account with this email already exists", 409);
    }

    const user = await User.create({ name, email, password });
    sendAuth(user, res, 201);
  }),
];

const login = [
  ...loginValidators,
  validate,
  asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select("+password");
    if (!user || !(await user.comparePassword(password))) {
      throw new AppError("Incorrect email or password", 401);
    }
    sendAuth(user, res);
  }),
];

const me = [
  protect,
  asyncHandler(async (req, res) => {
    res.json({
      status: "success",
      data: { user: req.user.toSafeJSON() },
    });
  }),
];

module.exports = { register, login, me };
