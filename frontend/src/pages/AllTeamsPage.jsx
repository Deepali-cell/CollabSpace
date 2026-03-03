import AllTeams from "@/components/AllTeams";
import Loader from "@/components/Loader";
import { StateContext } from "@/context/stateContext";
import React, { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const AllTeamsPage = () => {
  const { accessToken, fetchAllTeams, teams, loading, user } =
    useContext(StateContext);

  const navigate = useNavigate();

  useEffect(() => {
    if (!user) navigate("/authenticate");
  }, [user]);

  useEffect(() => {
    if (accessToken) fetchAllTeams();
  }, [accessToken]);

  if (loading) return <Loader title={"fetching your teams..."} />;

  return <AllTeams teams={teams} fetchAllTeams={fetchAllTeams} />;
};

export default AllTeamsPage;
