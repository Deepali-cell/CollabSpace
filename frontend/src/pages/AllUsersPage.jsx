import React, { useContext, useEffect } from "react";
import Loader from "@/components/Loader";
import AllUsers from "@/components/AllUsers";
import { StateContext } from "@/context/stateContext";

const AllUsersPage = () => {
  const { user, allUsers, fetchUsers, loading } = useContext(StateContext);

  useEffect(() => {
    if (user) fetchUsers();
  }, [user]);

  if (loading) return <Loader title={"fetching all users..."} />;

  return <AllUsers allUsers={allUsers} loadUsers={fetchUsers} />;
};

export default AllUsersPage;
