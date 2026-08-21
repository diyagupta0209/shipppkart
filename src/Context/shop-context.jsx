import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { api } from "../api";
import { useAuth } from "./auth-context";

export const ShopContext = createContext(null);

const emptyCart = { items: [], subtotal: 0, itemCount: 0 };

export const ShopContextProvider = ({ children }) => {
  const { token, isAuthenticated } = useAuth();
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState(emptyCart);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadProducts = useCallback(async () => {
    const payload = await api("/api/products");
    setProducts(payload.data.products);
  }, []);

  const loadCart = useCallback(async () => {
    if (!token) {
      setCart(emptyCart);
      return;
    }
    const payload = await api("/api/cart", { token });
    setCart(payload.data.cart);
  }, [token]);

  useEffect(() => {
    let cancelled = false;
    const bootstrap = async () => {
      setLoading(true);
      setError("");
      try {
        await loadProducts();
        if (!cancelled && token) {
          await loadCart();
        }
      } catch (err) {
        if (!cancelled) {
          setError(err.message);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };
    bootstrap();
    return () => {
      cancelled = true;
    };
  }, [loadProducts, loadCart, token]);

  const quantityFor = (productId) => {
    const match = cart.items.find((item) => item.product.id === productId);
    return match ? match.quantity : 0;
  };

  const addToCart = async (productId, quantity = 1) => {
    const payload = await api("/api/cart/items", {
      method: "POST",
      token,
      body: { productId, quantity },
    });
    setCart(payload.data.cart);
  };

  const removeFromCart = async (productId) => {
    const current = quantityFor(productId);
    if (current <= 1) {
      const payload = await api(`/api/cart/items/${productId}`, { method: "DELETE", token });
      setCart(payload.data.cart);
      return;
    }
    const payload = await api(`/api/cart/items/${productId}`, {
      method: "PATCH",
      token,
      body: { quantity: current - 1 },
    });
    setCart(payload.data.cart);
  };

  const updateCartItemCount = async (quantity, productId) => {
    const payload = await api(`/api/cart/items/${productId}`, {
      method: "PATCH",
      token,
      body: { quantity },
    });
    setCart(payload.data.cart);
  };

  const checkout = async (shippingAddress) => {
    const payload = await api("/api/orders", {
      method: "POST",
      token,
      body: { shippingAddress },
    });
    setCart(emptyCart);
    await loadProducts();
    return payload.data.order;
  };

  const value = useMemo(
    () => ({
      products,
      cart,
      loading,
      error,
      isAuthenticated,
      addToCart,
      removeFromCart,
      updateCartItemCount,
      quantityFor,
      getTotalCartAmount: () => cart.subtotal,
      checkout,
      refresh: loadProducts,
    }),
    [products, cart, loading, error, isAuthenticated, token]
  );

  return <ShopContext.Provider value={value}>{children}</ShopContext.Provider>;
};
