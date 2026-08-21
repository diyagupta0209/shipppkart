const express = require("express");
const { protect } = require("../middleware/auth");
const { createOrder, listOrders, getOrder, cancelOrder } = require("../controllers/orderController");

const router = express.Router();

router.use(protect);
router.post("/", createOrder);
router.get("/", listOrders);
router.get("/:id", getOrder);
router.patch("/:id/cancel", cancelOrder);

module.exports = router;
