import BoardForm from "@/components/BoardForm";
import { StateContext } from "@/context/stateContext";
import React, { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const AddBoardPage = () => {
  const { user } = useContext(StateContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) navigate("/authenticate");
  }, [user, navigate]);
  return (
    <>
      <div className="min-h-screen bg-white flex items-center justify-center">
        <BoardForm />
      </div>
    </>
  );
};

export default AddBoardPage;
