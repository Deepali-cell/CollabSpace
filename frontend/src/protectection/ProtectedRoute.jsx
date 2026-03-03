import { StateContext } from "@/context/stateContext";
import React, { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = () => {
  const { user, accessToken } = useContext(StateContext);

  if (!user || !accessToken) {
    return <Navigate to="/authenticate" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
