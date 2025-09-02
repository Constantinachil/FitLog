import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "./authcontext";
import { isTokenExpired, clearToken } from "../components/auth";

const ProtectedRoute = ({ children }) => {
  const { token, isLoggedIn, logout } = useAuth();

  if (!isLoggedIn || !token || isTokenExpired(token)) {
    clearToken();
    logout(); // make sure context updates
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
