import product1 from "../assets/download.jpeg";
import product2 from "../assets/download (1).jpeg";
import product3 from "../assets/download (2).jpeg";
import product4 from "../assets/download (3).jpeg";
import product5 from "../assets/download (4).jpeg";
import product6 from "../assets/download (5).jpeg";
import product7 from "../assets/download (6).jpeg";
import product8 from "../assets/download (7).jpeg";
import product9 from "../assets/download (8).jpeg";
import product10 from "../assets/download (9).jpeg";

const LOCAL_BY_SKU = {
  "BAG-001": product1,
  "WATCH-001": product2,
  "SHOE-001": product3,
  "PHONE-001": product4,
  "BEAUTY-001": product5,
  "APPAREL-001": product6,
  "BEAUTY-002": product7,
  "LAPTOP-001": product8,
  "AUDIO-001": product9,
  "CAM-001": product10,
};

const REMOTE_BY_SKU = {
  "BAG-001": "https://images.unsplash.com/photo-1590874103328-eac38a941978?auto=format&fit=crop&w=900&q=80",
  "WATCH-001": "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=900&q=80",
  "SHOE-001": "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=900&q=80",
  "PHONE-001": "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=900&q=80",
  "BEAUTY-001": "https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=900&q=80",
  "APPAREL-001": "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=900&q=80",
  "BEAUTY-002": "https://images.unsplash.com/photo-1586495777744-4413f21062fa?auto=format&fit=crop&w=900&q=80",
  "LAPTOP-001": "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=900&q=80",
  "AUDIO-001": "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=900&q=80",
  "CAM-001": "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=900&q=80",
};

const publicUrl = (process.env.PUBLIC_URL || "").replace(/\/$/, "");

export const getProductImageFallback = (product = {}) =>
  LOCAL_BY_SKU[product.sku] || `${publicUrl}/logo192.png`;

export const getProductImage = (product = {}) => {
  if (REMOTE_BY_SKU[product.sku]) {
    return REMOTE_BY_SKU[product.sku];
  }
  if (LOCAL_BY_SKU[product.sku]) {
    return LOCAL_BY_SKU[product.sku];
  }
  if (product.imageUrl && product.imageUrl.startsWith("http")) {
    return product.imageUrl;
  }
  if (product.imageUrl) {
    return `${publicUrl}${product.imageUrl}`;
  }
  return getProductImageFallback(product);
};

export const formatPrice = (value) =>
  `$${Number(value || 0).toLocaleString("en-IN")}`;
