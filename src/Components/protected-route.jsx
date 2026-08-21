import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../Context/auth-context";

export const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <p className="status-copy">Checking your session...</p>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
};
