import React, { useState } from "react";
import { getProductImage, getProductImageFallback } from "../utils/productImage";

export const ProductImage = ({ product, alt, className }) => {
  const [src, setSrc] = useState(() => getProductImage(product));

  return (
    <img
      className={className}
      src={src}
      alt={alt || product?.name || "Product"}
      onError={() => setSrc(getProductImageFallback(product))}
    />
  );
};
