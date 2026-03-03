import AllTeams from "@/components/AllTeams";
import Loader from "@/components/Loader";
import { StateContext } from "@/context/stateContext";
import React, { useContext, useEffect } from "react";

const AllTeamsPage = () => {
  const { accessToken, fetchAllTeams, teams, loading } =
    useContext(StateContext);

  useEffect(() => {
    if (accessToken) fetchAllTeams();
  }, [accessToken]);

  if (loading) return <Loader title={"fetching your teams..."} />;

  return <AllTeams teams={teams} fetchAllTeams={fetchAllTeams} />;
};

export default AllTeamsPage;
