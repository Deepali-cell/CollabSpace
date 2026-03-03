import React, { useContext, useEffect } from "react";
import { stateContext } from "@/context/stateContext";
import { useNavigate } from "react-router-dom";
import Loader from "@/components/Loader";
import AllUsers from "@/components/AllUsers";

const AllUsersPage = () => {
  const { user, allUsers, fetchUsers, loading } = useContext(stateContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) navigate("/authenticate");
  }, [user, navigate]);

  useEffect(() => {
    if (user) fetchUsers();
  }, [user]);

  if (loading) return <Loader title={"fetching all users..."} />;

  return <AllUsers allUsers={allUsers} loadUsers={fetchUsers} />;
};

export default AllUsersPage;
