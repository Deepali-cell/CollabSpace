import { StateContext } from "@/context/stateContext";
import axios from "axios";
import React, { useContext, useState } from "react";
import { Link } from "react-router-dom";

const AllTeams = ({ teams, fetchAllTeams }) => {
  const { backend_url, accessToken, userBoards } = useContext(StateContext);
  const [selectedBoard, setSelectedBoard] = useState("");
  const [assigningTeamId, setAssigningTeamId] = useState(null);

  const handleAssignBoard = async (teamId) => {
    if (!selectedBoard) return;

    try {
      await axios.post(
        `${backend_url}/api/v1/team/assignboardtoteam`,
        {
          teamId,
          boardId: selectedBoard,
        },
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        },
      );

      setSelectedBoard("");
      setAssigningTeamId(null);
      fetchAllTeams();
    } catch (error) {
      console.log("Error assigning board:", error);
    }
  };
  return (
    <div className="min-h-screen bg-white text-black p-10">
      <h1 className="text-4xl font-bold mb-10 tracking-tight">My Teams</h1>

      {teams.length === 0 ? (
        <div className="text-gray-500 text-lg">
          You are not part of any team yet.
        </div>
      ) : (
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {teams?.map((team) => (
            <div
              key={team.teamId}
              className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-lg transition duration-300"
            >
              {/* Team Header */}
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-xl font-semibold">{team.teamName}</h2>
                  <p className="text-sm text-gray-500 capitalize">
                    Role: {team.role}
                  </p>
                </div>

                {team.role === "leader" && (
                  <button
                    onClick={() =>
                      setAssigningTeamId(
                        assigningTeamId === team.teamId ? null : team.teamId,
                      )
                    }
                    className="text-sm bg-black text-white px-3 py-1.5 rounded-lg hover:bg-gray-800 transition"
                  >
                    Assign Board
                  </button>
                )}
              </div>

              {/* Assign Board */}
              {team.role === "leader" && assigningTeamId === team.teamId && (
                <div className="mb-6 space-y-3">
                  <select
                    value={selectedBoard}
                    onChange={(e) => setSelectedBoard(e.target.value)}
                    className="w-full border border-gray-300 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black"
                  >
                    <option value="">Select your board</option>
                    {userBoards.length === 0 ? (
                      <option disabled>No available boards</option>
                    ) : (
                      userBoards.map((board) => (
                        <option key={board.id} value={board.id}>
                          {board.title}
                        </option>
                      ))
                    )}
                  </select>

                  <button
                    disabled={!selectedBoard}
                    onClick={() => handleAssignBoard(team.teamId)}
                    className="w-full bg-black text-white py-2.5 rounded-xl hover:bg-gray-800 transition disabled:bg-gray-300 disabled:text-gray-500"
                  >
                    Assign to Team
                  </button>
                </div>
              )}

              {/* Members */}
              <div className="mb-6">
                <h3 className="font-medium mb-3">Members</h3>

                <div className="flex flex-wrap gap-2">
                  {team.members?.map((member) => (
                    <div
                      key={member.id}
                      className="flex items-center gap-2 px-3 py-1.5 border border-gray-200 rounded-full text-sm bg-gray-50"
                    >
                      <div className="w-6 h-6 rounded-full bg-black text-white flex items-center justify-center text-xs font-semibold">
                        {member.name[0].toUpperCase()}
                      </div>
                      <span>{member.name}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Boards */}
              <div>
                <h3 className="font-medium mb-3">Boards</h3>

                {team.boards.length === 0 ? (
                  <p className="text-sm text-gray-500">No boards assigned</p>
                ) : (
                  <ul className="space-y-2">
                    {team.boards?.map((board) => (
                      <Link key={board.id} to={`/boardview/${board.id}`}>
                        <li className="border border-gray-200 rounded-xl px-3 py-2 hover:bg-black hover:text-white transition cursor-pointer">
                          {board.title}
                        </li>
                      </Link>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AllTeams;
