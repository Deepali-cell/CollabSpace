import React from "react";
import { Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import AuthenticatedPage from "./pages/AuthenticatedPage";
import AddBoardPage from "./pages/AddBoardPage";
import Layout from "./components/Layout";
import BoardPage from "./pages/BoardPage";
import AllUsersPage from "./pages/AllUsersPage";
import AllTeamsPage from "./pages/AllTeamsPage";
import AllRequestPage from "./pages/AllRequestPage";
import ProtectedRoute from "./protectection/ProtectedRoute";

const App = () => {
  return (
    <Routes>
      {/* Public Route */}
      <Route path="/authenticate" element={<AuthenticatedPage />} />

      {/* Layout Wrapper */}
      <Route element={<Layout />}>
        {/* Public HomePage */}
        <Route path="/" element={<HomePage />} />

        {/* Protected Routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/createboard" element={<AddBoardPage />} />
          <Route path="/allusers" element={<AllUsersPage />} />
          <Route path="/allrequest" element={<AllRequestPage />} />
          <Route path="/allteams" element={<AllTeamsPage />} />
          <Route path="/boardview/:boardId" element={<BoardPage />} />
        </Route>
      </Route>
    </Routes>
  );
};

export default App;
