import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ShopContext } from "../../Context/shop-context";
import { useAuth } from "../../Context/auth-context";
import { ProductImage } from "../../Components/product-image";
import { formatPrice } from "../../utils/productImage";

export const Product = (props) => {
  const product = props.data;
  const { _id, name, price, stock, category } = product;
  const { addToCart, quantityFor } = useContext(ShopContext);
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [message, setMessage] = useState("");
  const cartItemAmount = quantityFor(_id);

  const handleAdd = async () => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    try {
      await addToCart(_id);
      setMessage("");
    } catch (error) {
      setMessage(error.message);
    }
  };

  return (
    <article className="product-card">
      <div className="product-media">
        <span className="product-chip">{category}</span>
        <ProductImage product={product} />
      </div>
      <div className="product-body">
        <h3>{name}</h3>
        <p className="product-price">{formatPrice(price)}</p>
        <p className={`stock ${stock < 8 ? "low" : ""}`}>
          {stock < 1 ? "Out of stock" : `${stock} in stock`}
        </p>
        <button className="addToCartBttn" onClick={handleAdd} disabled={stock < 1}>
          {stock < 1 ? "Sold out" : `Add to cart${cartItemAmount > 0 ? ` (${cartItemAmount})` : ""}`}
        </button>
        {message && <p className="product-error">{message}</p>}
      </div>
    </article>
  );
};
