import axios from "axios";
import React, { useContext } from "react";
import { Link, useLocation } from "react-router-dom";
import { toast } from "sonner";
import { LayoutDashboard, Plus, Users, LogOut, LogIn } from "lucide-react";
import { VscGitPullRequestNewChanges } from "react-icons/vsc";
import { PiUsersFour } from "react-icons/pi";
import { StateContext } from "@/context/stateContext";

const Sidebar = () => {
  const {
    user,
    backend_url,
    accessToken,
    setUser,
    setAccessToken,
    userBoards,
    userTeamBoards,
    setuserBoards,
    setuserTeamBoards,
    setBoard,
    setRequests,
    setTeams,
  } = useContext(StateContext);
  const location = useLocation();
  if (!accessToken) return;
  const logout = async () => {
    try {
      const { data } = await axios.delete(`${backend_url}/api/v1/user/logout`, {
        headers: { Authorization: `Bearer ${accessToken}` },
        withCredentials: true,
      });

      if (data.success) {
        toast.success(data.message || "Logged out");

        // ✅ CLEAR ALL STATE
        setUser(null);
        setAccessToken(null);
        setuserBoards([]);
        setuserTeamBoards([]);
        setBoard(null);
        setTeams([]);
        setRequests([]);
      }
    } catch (error) {
      console.log("some frontend error while logout :", error);
      toast.error("Logout failed");
    }
  };
  const isActive = (path) =>
    location.pathname === path
      ? "bg-cyan-500/20 text-cyan-400"
      : "hover:bg-white/10";

  return (
    <div className="min-h-screen w-72 bg-black  text-white flex flex-col justify-between border-r border-white/10">
      {/* LOGO */}
      <div className="p-6">
        <Link to="/" className="flex items-center gap-2">
          <LayoutDashboard className="text-cyan-400" />
          <h1 className="text-xl font-extrabold tracking-wide">
            Collab<span className="text-cyan-400">Space</span>
          </h1>
        </Link>

        {/* ACTIONS */}
        <div className="mt-8 space-y-3">
          <Link
            to="/createboard"
            className="flex items-center gap-2 w-full py-2 px-3 rounded-xl border border-dashed border-cyan-400/50 hover:bg-cyan-400/10 transition"
          >
            <Plus size={18} />
            Create Board
          </Link>

          <Link
            to="/allusers"
            className={`flex items-center gap-2 px-3 py-2 rounded-xl transition ${isActive(
              "/allusers",
            )}`}
          >
            <Users size={18} />
            All Users
          </Link>
          <Link
            to="/allrequest"
            className={`flex items-center gap-2 px-3 py-2 rounded-xl transition ${isActive(
              "/teamrequest",
            )}`}
          >
            <VscGitPullRequestNewChanges size={18} />
            All Requests
          </Link>
          <Link
            to="/allteams"
            className={`flex items-center gap-2 px-3 py-2 rounded-xl transition ${isActive(
              "/allteams",
            )}`}
          >
            <PiUsersFour size={18} />
            All Teams
          </Link>
        </div>

        {/* BOARDS */}
        <div className="mt-8">
          <p className="text-xs text-gray-400 mb-2 uppercase tracking-widest">
            Your Own Created Boards
          </p>

          <div className="space-y-2">
            {userBoards.map((board) => (
              <>
                <Link
                  key={board.id}
                  to={`/board/${board.id}`}
                  className="block px-3 py-2 rounded-xl bg-white/5 hover:bg-cyan-400/20 transition"
                >
                  {board.title}
                </Link>
              </>
            ))}
          </div>
        </div>
        <div className="mt-8">
          <p className="text-xs text-gray-400 mb-2 uppercase tracking-widest">
            Your Team Boards
          </p>

          <div className="space-y-2">
            {userTeamBoards.map((board) => (
              <>
                <Link
                  key={board.id}
                  to={`/board/${board.id}`}
                  className="block px-3 py-2 rounded-xl bg-white/5 hover:bg-cyan-400/20 transition"
                >
                  {board.title}
                </Link>
              </>
            ))}
          </div>
        </div>
      </div>

      {/* USER FOOTER */}
      <div className="p-4 border-t border-white/10">
        {user ? (
          <button
            onClick={logout}
            className="flex items-center justify-center gap-2 w-full py-2 rounded-xl bg-red-500/80 hover:bg-red-500 transition"
          >
            <LogOut size={18} />
            Exit Workspace
          </button>
        ) : (
          <Link
            to="/authenticate"
            className="flex items-center justify-center gap-2 w-full py-2 rounded-xl bg-green-600 hover:bg-green-500 transition"
          >
            <LogIn size={18} />
            Join Workspace
          </Link>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
