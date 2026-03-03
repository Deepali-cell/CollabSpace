import React, { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { stateContext } from "@/context/stateContext";

const ProtectedRoute = () => {
  const { user, accessToken } = useContext(stateContext);

  if (!user || !accessToken) {
    return <Navigate to="/authenticate" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
