import React, { useContext } from "react";
import { ShopContext } from "../../Context/shop-context";
import { CartItem } from "./cart-item";
import "./cart.css";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../Context/auth-context";

export const Cart = () => {
    const { cart, getTotalCartAmount } = useContext(ShopContext);
    const { isAuthenticated } = useAuth();
    const totalAmount = getTotalCartAmount();
    const navigate = useNavigate();

    if (!isAuthenticated) {
        return (
            <div className="cart">
                <h1>Sign in to manage your cart</h1>
                <button onClick={() => navigate("/login")}>Login</button>
            </div>
        );
    }

    return (
     <div className="cart">
        <div>
            <h1>Your Cart Items</h1>
        </div>
        <div className="cartItems">
            {cart.items.map((item) => (
                <CartItem key={item.product.id} data={item} />
            ))}
        </div>
        {totalAmount > 0 ? (
        <div className="checkout">
            <p>Subtotal: ${totalAmount}</p>
            <button onClick={() => navigate("/")}>Continue Shopping</button>
            <button onClick={() => navigate("/checkout")}>Checkout</button>
        </div>
    ) : (
        <h1>Your Cart is Empty</h1>
    )}
      </div>
    );
};
