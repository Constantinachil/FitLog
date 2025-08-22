import React from "react";
import { Navigate } from "react-router-dom";
import { isLoggedIn } from "../components/auth";

const PublicRoute = ({ children }) => {
  return isLoggedIn() ? <Navigate to="/homepage" /> : children;
};

export default PublicRoute;
