import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ShopContext } from "../../Context/shop-context";
import "../auth/auth.css";

const INITIAL_ADDRESS = {
  fullName: "",
  street: "",
  city: "",
  state: "",
  postalCode: "",
  country: "",
};

export const Checkout = () => {
  const { cart, checkout, getTotalCartAmount } = useContext(ShopContext);
  const [address, setAddress] = useState(INITIAL_ADDRESS);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleChange = (event) => {
    setAddress((prev) => ({ ...prev, [event.target.name]: event.target.value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setError("");
    try {
      await checkout(address);
      navigate("/orders");
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (!cart.items.length) {
    return (
      <div className="checkout-page">
        <div className="checkout-card">
          <h1>Your cart is empty</h1>
          <button type="button" onClick={() => navigate("/")}>
            Back to shop
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="checkout-page">
      <form className="checkout-card" onSubmit={handleSubmit}>
        <h1>Checkout</h1>
        <p>Order total: ${getTotalCartAmount()}</p>
        {Object.keys(INITIAL_ADDRESS).map((field) => (
          <label key={field}>
            {field.replace(/([A-Z])/g, " $1")}
            <input name={field} value={address[field]} onChange={handleChange} required />
          </label>
        ))}
        {error && <p className="form-error">{error}</p>}
        <button type="submit" disabled={submitting}>
          {submitting ? "Placing order..." : "Place order"}
        </button>
      </form>
    </div>
  );
};
