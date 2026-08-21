import React, { useEffect, useState } from "react";
import { api } from "../../api";
import { useAuth } from "../../Context/auth-context";
import "../auth/auth.css";

export const Orders = () => {
  const { token } = useAuth();
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState("");

  const loadOrders = async () => {
    const payload = await api("/api/orders", { token });
    setOrders(payload.data.orders);
  };

  useEffect(() => {
    loadOrders().catch((err) => setError(err.message));
  }, [token]);

  const cancelOrder = async (id) => {
    try {
      await api(`/api/orders/${id}/cancel`, { method: "PATCH", token });
      await loadOrders();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="orders-page">
      <div className="orders-list">
        <h1>Your orders</h1>
        {error && <p className="form-error">{error}</p>}
        {orders.length === 0 && <p>No orders yet.</p>}
        {orders.map((order) => (
          <div className="order-card" key={order._id}>
            <div className="order-header">
              <div>
                <p>
                  <b>Status:</b> {order.status}
                </p>
                <p>
                  <b>Total:</b> ${order.subtotal}
                </p>
                <p>
                  <b>Placed:</b> {new Date(order.createdAt).toLocaleString()}
                </p>
              </div>
              {["pending", "confirmed"].includes(order.status) && (
                <button type="button" onClick={() => cancelOrder(order._id)}>
                  Cancel order
                </button>
              )}
            </div>
            <ul className="order-items">
              {order.items.map((item) => (
                <li key={`${order._id}-${item.product}`}>
                  {item.name} x {item.quantity} — ${item.price * item.quantity}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};
