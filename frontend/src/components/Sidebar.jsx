import axios from "axios";
import React, { useContext, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import {
  LayoutDashboard,
  Plus,
  Users,
  LogOut,
  LogIn,
  Menu,
  X,
} from "lucide-react";
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
  const [open, setOpen] = useState(false);

  const navigate = useNavigate();
  if (!accessToken) return null;
  const logout = async () => {
    try {
      const { data } = await axios.delete(`${backend_url}/api/v1/user/logout`, {
        headers: { Authorization: `Bearer ${accessToken}` },
        withCredentials: true,
      });

      if (data.success) {
        // Clear all state
        setUser(null);
        setAccessToken(null);
        setuserBoards([]);
        setuserTeamBoards([]);
        setBoard(null);
        setTeams([]);
        setRequests([]);

        // Navigate to home or authenticate
        navigate("/", { replace: true }); // or "/authenticate"
        toast.success(data.message || "Logged out");
      }
    } catch (error) {
      console.log(error);
      toast.error("Logout failed");
    }
  };

  const isActive = (path) =>
    location.pathname === path
      ? "bg-cyan-500/20 text-cyan-400"
      : "hover:bg-white/10";

  const handleMobileClick = () => {
    if (window.innerWidth < 768) {
      setOpen(false);
    }
  };

  return (
    <>
      {/* MOBILE HAMBURGER */}
      <div className="md:hidden fixed top-4 left-4 z-50">
        <button
          onClick={() => setOpen(true)}
          className="p-2 bg-black rounded-lg shadow-lg border border-white/10 hover:bg-white/10 transition"
        >
          <Menu size={26} className="text-white" />
        </button>
      </div>

      {/* OVERLAY */}
      {open && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] md:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* SIDEBAR CONTAINER */}
      <aside
        className={`fixed inset-y-0 left-0 w-[280px] md:w-72 bg-black text-white z-[70] transform transition-transform duration-300 ease-in-out border-r border-white/10
        ${open ? "translate-x-0" : "-translate-x-full"}
        md:translate-x-0 md:sticky top-0 h-screen flex flex-col`}
      >
        {/* Header (Logo & Mobile Close) */}
        <div className="p-6 flex items-center justify-between border-b border-white/10 md:border-none">
          <div className="flex items-center gap-2">
            <LayoutDashboard className="text-cyan-400" />
            <h1 className="text-xl font-extrabold">
              Collab<span className="text-cyan-400">Space</span>
            </h1>
          </div>
          <button
            onClick={() => setOpen(false)}
            className="md:hidden p-2 rounded-lg hover:bg-white/10 transition"
          >
            <X size={26} />
          </button>
        </div>

        {/* Scrollable Middle Section */}
        <div className="flex-1 overflow-y-auto p-4 space-y-6 custom-scrollbar">
          {/* Main Navigation */}
          <nav className="space-y-2">
            <Link
              to="/createboard"
              onClick={handleMobileClick}
              className="flex items-center gap-2 py-2 px-3 rounded-xl border border-dashed border-cyan-400/40 hover:bg-cyan-400/10 transition text-sm"
            >
              <Plus size={18} />
              Create Board
            </Link>

            <Link
              to="/allusers"
              onClick={handleMobileClick}
              className={`flex items-center gap-2 px-3 py-2 rounded-xl transition text-sm ${isActive("/allusers")}`}
            >
              <Users size={18} />
              All Users
            </Link>

            <Link
              to="/allrequest"
              onClick={handleMobileClick}
              className={`flex items-center gap-2 px-3 py-2 rounded-xl transition text-sm ${isActive("/teamrequest")}`}
            >
              <VscGitPullRequestNewChanges size={18} />
              All Requests
            </Link>

            <Link
              to="/allteams"
              onClick={handleMobileClick}
              className={`flex items-center gap-2 px-3 py-2 rounded-xl transition text-sm ${isActive("/allteams")}`}
            >
              <PiUsersFour size={18} />
              All Teams
            </Link>
          </nav>

          {/* Boards Section */}
          <div>
            <p className="text-[10px] text-gray-500 mb-3 uppercase tracking-[0.2em] font-semibold px-3">
              Your Boards
            </p>
            <div className="space-y-1">
              {userBoards?.map((board) => (
                <Link
                  key={board.id}
                  to={`/boardview/${board.id}`}
                  onClick={handleMobileClick}
                  className="block px-3 py-2 text-sm rounded-xl bg-white/5 hover:bg-cyan-400/20 transition truncate"
                >
                  {board.title}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <p className="text-[10px] text-gray-500 mb-3 uppercase tracking-[0.2em] font-semibold px-3">
              Team Boards
            </p>
            <div className="space-y-1">
              {userTeamBoards?.map((board) => (
                <Link
                  key={board.id}
                  to={`/boardview/${board.id}`}
                  onClick={handleMobileClick}
                  className="block px-3 py-2 text-sm rounded-xl bg-white/5 hover:bg-cyan-400/20 transition truncate"
                >
                  {board.title}
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Fixed Footer */}
        <div className="p-4 border-t border-white/10 bg-black">
          {user ? (
            <button
              onClick={logout}
              className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-red-500/10 text-red-500 border border-red-500/20 hover:bg-red-500 hover:text-white transition font-medium text-sm"
            >
              <LogOut size={18} />
              Exit Workspace
            </button>
          ) : (
            <Link
              to="/authenticate"
              onClick={handleMobileClick}
              className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-green-600 hover:bg-green-500 transition font-medium text-sm"
            >
              <LogIn size={18} />
              Join Workspace
            </Link>
          )}
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
