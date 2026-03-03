import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";

const Layout = () => {
  return (
    <div className="flex">
      <Sidebar />
      <main className="flex-1 bg-black min-h-screen text-white">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
