import React, { useContext, useState } from "react";
import { ShopContext } from "../../Context/shop-context";
import { ProductImage } from "../../Components/product-image";
import { formatPrice } from "../../utils/productImage";

export const CartItem = (props) => {
  const { product, quantity } = props.data;
  const { addToCart, removeFromCart, updateCartItemCount } = useContext(ShopContext);
  const [error, setError] = useState("");

  const run = async (action) => {
    try {
      setError("");
      await action();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="cartItem">
      <ProductImage product={product} />
      <div className="description">
        <p>
          <b>{product.name}</b>
        </p>
        <p>{formatPrice(product.price)}</p>
        <div className="countHandler">
          <button type="button" onClick={() => run(() => removeFromCart(product.id))}>
            -
          </button>
          <input
            value={quantity}
            onChange={(e) => run(() => updateCartItemCount(Number(e.target.value) || 0, product.id))}
          />
          <button type="button" onClick={() => run(() => addToCart(product.id))}>
            +
          </button>
        </div>
        {error && <p className="product-error">{error}</p>}
      </div>
    </div>
  );
};
