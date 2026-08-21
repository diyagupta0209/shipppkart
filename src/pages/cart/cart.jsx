import React, { useContext } from "react";
import { ShopContext } from "../../Context/shop-context";
import { CartItem } from "./cart-item";
import "./cart.css";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../Context/auth-context";
import { formatPrice } from "../../utils/productImage";

export const Cart = () => {
  const { cart, getTotalCartAmount } = useContext(ShopContext);
  const { isAuthenticated } = useAuth();
  const totalAmount = getTotalCartAmount();
  const navigate = useNavigate();

  if (!isAuthenticated) {
    return (
      <div className="cart">
        <div className="empty-card">
          <h1>Sign in to manage your cart</h1>
          <p>Your items are saved to your account so you can check out on any device.</p>
          <button type="button" onClick={() => navigate("/login")}>
            Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="cart">
      <h1>Your cart</h1>
      <div className="cartItems">
        {cart.items.map((item) => (
          <CartItem key={item.product.id} data={item} />
        ))}
      </div>
      {totalAmount > 0 ? (
        <div className="checkout">
          <p>
            Subtotal: <b>{formatPrice(totalAmount)}</b>
          </p>
          <button type="button" onClick={() => navigate("/")}>
            Continue shopping
          </button>
          <button className="primary" type="button" onClick={() => navigate("/checkout")}>
            Checkout
          </button>
        </div>
      ) : (
        <div className="empty-card">
          <h2>Your cart is empty</h2>
          <button type="button" onClick={() => navigate("/")}>
            Browse products
          </button>
        </div>
      )}
    </div>
  );
};
