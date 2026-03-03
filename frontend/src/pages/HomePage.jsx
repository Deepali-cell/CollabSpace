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

  const renderNotLoggedIn = () => (
    <div className="flex-1 bg-black min-h-screen flex items-center justify-center p-4 sm:p-6">
      <div className="flex flex-col items-center text-center space-y-6 max-w-md w-full">
        <div className="relative">
          <div className="absolute inset-0 blur-3xl bg-cyan-500/20 rounded-full"></div>
          <img
            src={roller}
            alt="No boards"
            className="relative w-40 sm:w-52 md:w-64 animate-bounce-slow"
          />
        </div>

        <h2 className="text-2xl sm:text-3xl font-bold text-white">
          Welcome to CollabSpace!
        </h2>

        <p className="text-gray-400 text-sm sm:text-base">
          Please login to access your boards and collaborate with your team.
        </p>

        <Link
          to="/authenticate"
          className="px-6 py-3 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-semibold shadow-lg hover:scale-105 transition-transform duration-200"
        >
          Login
        </Link>
      </div>
    </div>
  );

  const renderBoards = () => {
    const completionPercentage =
      dashboard?.totalTasks > 0
        ? Math.round((dashboard.completedTasks / dashboard.totalTasks) * 100)
        : 0;

    return (
      <div className="flex-1 bg-gray-100 text-black min-h-screen p-4 sm:p-6 md:p-8">
        <div className="space-y-10">
          {/* HEADER */}
          <div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold">
              Dashboard 👋
            </h1>
            <p className="text-gray-500 mt-2 text-sm sm:text-base break-all">
              Welcome back, {user?.name} ({user?.email})
            </p>
          </div>

          {/* MAIN STATS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            <StatCard title="My Boards" value={dashboard?.myBoards} />
            <StatCard title="Team Boards" value={dashboard?.teamBoards} />
            <StatCard title="Total Tasks" value={dashboard?.totalTasks} dark />
            <StatCard title="Teams Joined" value={dashboard?.teamsCount} />
          </div>

          {/* TASK PROGRESS */}
          <div className="bg-white rounded-2xl sm:rounded-3xl p-5 sm:p-6 md:p-8 shadow-sm border border-gray-200">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 mb-6">
              <h2 className="text-lg sm:text-xl font-semibold">
                Task Progress
              </h2>
              <span className="text-sm font-medium text-gray-500">
                {completionPercentage}% Completed
              </span>
            </div>

            <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-black transition-all duration-500"
                style={{ width: `${completionPercentage}%` }}
              />
            </div>

            <div className="grid grid-cols-2 gap-4 sm:gap-6 mt-6">
              <div>
                <p className="text-sm text-gray-500">Completed</p>
                <p className="text-xl sm:text-2xl font-bold text-green-600">
                  {dashboard?.completedTasks || 0}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Pending</p>
                <p className="text-xl sm:text-2xl font-bold text-red-500">
                  {dashboard?.pendingTasks || 0}
                </p>
              </div>
            </div>
          </div>

          {/* RECENT TASKS */}
          <div className="bg-black rounded-2xl sm:rounded-3xl p-5 sm:p-6 md:p-8 text-white shadow-xl">
            <h2 className="text-lg sm:text-xl font-semibold mb-6">
              Recent Tasks
            </h2>

            {dashboard?.recentTasks?.length > 0 ? (
              <div className="space-y-4">
                {dashboard.recentTasks.map((task) => (
                  <div
                    key={task.id}
                    className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 bg-white/10 rounded-2xl p-4 hover:bg-white/20 transition"
                  >
                    <div>
                      <p className="font-semibold text-sm sm:text-base">
                        {task.title}
                      </p>
                      <p className="text-xs text-gray-400">
                        {new Date(task.createdAt).toLocaleDateString()}
                      </p>
                    </div>

                    <span
                      className={`text-xs px-3 py-1 rounded-full w-fit ${
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
              <p className="text-gray-400 text-sm">No recent tasks found.</p>
            )}
          </div>
        </div>
      </div>
    );
  };

  const StatCard = ({ title, value, dark }) => (
    <div
      className={`rounded-2xl sm:rounded-3xl p-5 sm:p-6 transition shadow-sm hover:shadow-md ${
        dark
          ? "bg-black text-white"
          : "bg-white border border-gray-200 text-black"
      }`}
    >
      <h3 className="text-sm text-gray-500">{title}</h3>
      <p className="text-2xl sm:text-3xl font-bold mt-2">{value || 0}</p>
    </div>
  );

  return user ? renderBoards() : renderNotLoggedIn();
};

export default HomePage;
