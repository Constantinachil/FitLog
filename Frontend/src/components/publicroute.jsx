import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "./authcontext";
import { isTokenExpired } from "../components/auth";

const PublicRoute = ({ children }) => {
  const { token, isLoggedIn } = useAuth();

  if (isLoggedIn && token && !isTokenExpired(token)) {
    return <Navigate to="/homepage" replace />;
  }

  return children;
};

export default PublicRoute;
