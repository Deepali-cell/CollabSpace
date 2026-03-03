import AllTeams from "@/components/AllTeams";
import Loader from "@/components/Loader";
import { stateContext } from "@/context/stateContext";
import React, { useContext, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

const AllTeamsPage = () => {
  const { accessToken, fetchAllTeams, teams, loading, user } =
    useContext(stateContext);

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
