// Copyright 2025, Battelle Energy Alliance, LLC, ALL RIGHTS RESERVED
import { Navigate, Outlet } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const authIsDisabled = import.meta.env.VITE_DISABLE_AUTH === "true"

const ProtectedRoute = () => {

  var token = localStorage.getItem("token")

  if (authIsDisabled) {
    return <Outlet />;
  }

  if (token == null) {
    return <Navigate to="/login" />;
  }

  let decodedToken = jwtDecode(token);
  let currentDate = new Date();

  // JWT exp is in seconds
  if (decodedToken.exp * 1000 < currentDate.getTime()) {
    localStorage.removeItem("token")
    return <Navigate to="/login" />;
  }

  // If authenticated, render the child routes
  return <Outlet />;
};

export default ProtectedRoute