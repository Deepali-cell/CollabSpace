import React, { useContext, useEffect } from "react";
import { Link } from "react-router-dom";
import roller from "../assets/roller2.png";
import { StateContext } from "@/context/stateContext";

const HomePage = () => {
  const { user, dashboard, fetchDashboard, accessToken } =
    useContext(StateContext);

  useEffect(() => {
    if (accessToken) fetchDashboard();
  }, [accessToken]);
  // const renderEmptyBoards = () => (
  //   <div className="flex flex-col items-center justify-center text-center px-4 mt-20">
  //     <div className="relative">
  //       <div className="absolute inset-0 blur-3xl bg-cyan-500/20 rounded-full"></div>
  //       <img
  //         src={roller}
  //         alt="No boards"
  //         className="relative w-56 md:w-64 animate-bounce-slow"
  //       />
  //     </div>

  //     <h2 className=" text-3xl md:text-4xl font-extrabold text-white">
  //       Welcome back, <span className="text-cyan-400">{user.name}</span>
  //     </h2>

  //     <p className="mt-3 text-gray-400 max-w-lg text-base md:text-lg">
  //       Looks like your workspace is empty right now. Create your first board
  //       and start organizing ideas, tasks, and teamwork in one place.
  //     </p>
  //   </div>
  // );

  const renderNotLoggedIn = () => (
    <div className="flex flex-col items-center justify-center mt-20 space-y-6">
      <div className="relative">
        <div className="absolute inset-0 blur-3xl bg-cyan-500/20 rounded-full"></div>
        <img
          src={roller}
          alt="No boards"
          className="relative w-56 md:w-64 animate-bounce-slow"
        />
      </div>
      <h2 className="text-2xl font-bold text-gray-200">
        Welcome to CollabSpace!
      </h2>
      <p className="text-gray-400 text-center max-w-md">
        Please login to access your boards and collaborate with your team.
      </p>
      <Link
        to="/authenticate"
        className="mt-4 px-6 py-3 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-semibold shadow-lg hover:scale-105 transition-transform duration-200"
      >
        Login
      </Link>
    </div>
  );

  const renderBoards = () => {
    const completionPercentage =
      dashboard?.totalTasks > 0
        ? Math.round((dashboard.completedTasks / dashboard.totalTasks) * 100)
        : 0;

    return (
      <div className="space-y-12">
        {/* HEADER */}
        <div>
          <h1 className="text-4xl font-bold text-black">Dashboard 👋</h1>
          <p className="text-gray-500 mt-2">
            Welcome back, {user.name}( {user.email} )
          </p>
        </div>

        {/* MAIN STATS */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <StatCard title="My Boards" value={dashboard?.myBoards} />
          <StatCard title="Team Boards" value={dashboard?.teamBoards} />
          <StatCard title="Total Tasks" value={dashboard?.totalTasks} dark />
          <StatCard title="Teams Joined" value={dashboard?.teamsCount} />
        </div>

        {/* TASK PROGRESS */}
        <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-200">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-black">Task Progress</h2>
            <span className="text-sm font-medium text-gray-500">
              {completionPercentage}% Completed
            </span>
          </div>

          {/* Progress Bar */}
          <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-black transition-all duration-500"
              style={{ width: `${completionPercentage}%` }}
            />
          </div>

          <div className="grid grid-cols-2 gap-6 mt-6">
            <div>
              <p className="text-sm text-gray-500">Completed</p>
              <p className="text-2xl font-bold text-green-600">
                {dashboard?.completedTasks}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Pending</p>
              <p className="text-2xl font-bold text-red-500">
                {dashboard?.pendingTasks}
              </p>
            </div>
          </div>
        </div>

        {/* RECENT TASKS */}
        <div className="bg-black rounded-3xl p-8 text-white shadow-xl">
          <h2 className="text-xl font-semibold mb-6">Recent Tasks</h2>

          {dashboard?.recentTasks?.length > 0 ? (
            <div className="space-y-4">
              {dashboard.recentTasks.map((task) => (
                <div
                  key={task.id}
                  className="flex justify-between items-center bg-white/10 rounded-2xl p-4 hover:bg-white/20 transition"
                >
                  <div>
                    <p className="font-semibold">{task.title}</p>
                    <p className="text-xs text-gray-400">
                      {new Date(task.createdAt).toLocaleDateString()}
                    </p>
                  </div>

                  <span
                    className={`text-xs px-3 py-1 rounded-full ${
                      task.finalized
                        ? "bg-green-500/20 text-green-400"
                        : "bg-yellow-500/20 text-yellow-400"
                    }`}
                  >
                    {task.finalized ? "Completed" : "Pending"}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-400">No recent tasks found.</p>
          )}
        </div>
      </div>
    );
  };

  const StatCard = ({ title, value, dark }) => {
    return (
      <div
        className={`rounded-3xl p-6 transition shadow-sm hover:shadow-md ${
          dark
            ? "bg-black text-white"
            : "bg-white border border-gray-200 text-black"
        }`}
      >
        <h3 className="text-sm text-gray-500">{title}</h3>
        <p className="text-3xl font-bold mt-2">{value || 0}</p>
      </div>
    );
  };
  return (
    <div className="flex-1 bg-gray-100 text-black p-8 overflow-y-auto min-h-screen">
      {!user ? renderNotLoggedIn() : renderBoards()}
    </div>
  );
};

export default HomePage;
