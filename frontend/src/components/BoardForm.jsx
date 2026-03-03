import { stateContext } from "@/context/stateContext";
import axios from "axios";
import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const BoardForm = () => {
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(false);
  const { accessToken, backend_url, fetchUserBoards } =
    useContext(stateContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await axios.post(
        `${backend_url}/api/v1/workspace/createboard`,
        { title },
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        },
      );

      if (data.success) {
        fetchUserBoards();
        navigate("/");
        toast(data.message || "Board created Successfully");
      } else {
        console.log("some error while creating the board");
      }
    } catch (error) {
      console.log("some error while creating the board :", error);
    } finally {
      setTitle("");
      setLoading(false);
    }
  };

  return (
    <div
      className="relative z-10 w-[360px] p-8 rounded-3xl
        bg-white/10 backdrop-blur-2xl border border-white/20
        shadow-xl flex flex-col items-center"
      style={{
        boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.37)",
      }}
    >
      <h2
        className="text-2xl font-bold mb-6 text-white"
        style={{ textShadow: "0 2px 6px rgba(0,0,0,0.4)" }}
      >
        Create New Board
      </h2>
      <form className="flex flex-col gap-4 w-full" onSubmit={handleSubmit}>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter board title"
          className="px-4 py-3 w-full rounded-xl bg-white/20 placeholder-white text-white
          focus:outline-none focus:ring-2 focus:ring-[#196bbd] backdrop-blur-sm
          transition-all duration-300"
        />
        <button
          type="submit"
          disabled={loading}
          className={`w-full py-3 rounded-xl font-semibold text-black 
    bg-gradient-to-r from-cyan-400 to-indigo-500 
    hover:scale-105 transition-transform duration-200
    ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
        >
          {loading ? "Please Wait..." : "Create Board"}
        </button>
      </form>
    </div>
  );
};

export default BoardForm;
