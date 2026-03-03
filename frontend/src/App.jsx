import React from "react";
import { Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage";
import AuthenticatedPage from "./pages/AuthenticatedPage";
import AddBoardPage from "./pages/AddBoardPage";
import Layout from "./components/Layout";
import BoardPage from "./pages/BoardPage";
import AllUsersPage from "./pages/AllUsersPage";
import AllTeamsPage from "./pages/AllTeamsPage";
import AllRequestPage from "./pages/AllRequestPage";

const App = () => {
  return (
    <>
      <Routes>
        <Route path="/authenticate" element={<AuthenticatedPage />} />
        <Route element={<Layout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/createboard" element={<AddBoardPage />} />
          <Route path="/allusers" element={<AllUsersPage />} />
          <Route path="/allrequest" element={<AllRequestPage />} />
          <Route path="/allteams" element={<AllTeamsPage />} />
          <Route path="/boardview/:boardId" element={<BoardPage />} />
        </Route>
      </Routes>
    </>
  );
};

export default App;
