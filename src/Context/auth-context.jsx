import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { api } from "../api";

export const AuthContext = createContext(null);

const TOKEN_KEY = "shipkart_token";

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY));
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(Boolean(token));
  const [error, setError] = useState("");

  useEffect(() => {
    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }

    let cancelled = false;
    setLoading(true);
    api("/api/auth/me", { token })
      .then((payload) => {
        if (!cancelled) {
          setUser(payload.data.user);
        }
      })
      .catch(() => {
        if (!cancelled) {
          localStorage.removeItem(TOKEN_KEY);
          setToken(null);
          setUser(null);
        }
      })
      .finally(() => {
        if (!cancelled) {
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [token]);

  const persistSession = (payload) => {
    localStorage.setItem(TOKEN_KEY, payload.token);
    setToken(payload.token);
    setUser(payload.data.user);
    setError("");
  };

  const register = async (form) => {
    setError("");
    const payload = await api("/api/auth/register", { method: "POST", body: form });
    persistSession(payload);
    return payload;
  };

  const login = async (form) => {
    setError("");
    const payload = await api("/api/auth/login", { method: "POST", body: form });
    persistSession(payload);
    return payload;
  };

  const logout = () => {
    localStorage.removeItem(TOKEN_KEY);
    setToken(null);
    setUser(null);
  };

  const value = useMemo(
    () => ({ token, user, loading, error, setError, register, login, logout, isAuthenticated: Boolean(user) }),
    [token, user, loading, error]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
