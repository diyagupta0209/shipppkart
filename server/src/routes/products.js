const express = require("express");
const { protect, restrictTo } = require("../middleware/auth");
const {
  listProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
} = require("../controllers/productController");

const router = express.Router();

router.get("/", listProducts);
router.get("/:id", getProduct);
router.post("/", protect, restrictTo("admin"), createProduct);
router.patch("/:id", protect, restrictTo("admin"), updateProduct);
router.delete("/:id", protect, restrictTo("admin"), deleteProduct);

module.exports = router;
