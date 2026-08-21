import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { ShoppingCart } from "phosphor-react";
import { useAuth } from "../Context/auth-context";
import { ShopContext } from "../Context/shop-context";
import "./navbar.css";

export const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const { cart } = React.useContext(ShopContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="navbar">
      <Link className="brand" to="/">
        SHIPKART
      </Link>
      <div className="links">
        <Link to="/">Shop</Link>
        {isAuthenticated && <Link to="/orders">Orders</Link>}
        <Link to="/cart" className="cart-link">
          <ShoppingCart size={28} />
          {cart.itemCount > 0 && <span className="cart-badge">{cart.itemCount}</span>}
        </Link>
        {isAuthenticated ? (
          <>
            <span className="user-label">{user.name}</span>
            <button className="nav-button" onClick={handleLogout} type="button">
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        )}
      </div>
    </div>
  );
};
