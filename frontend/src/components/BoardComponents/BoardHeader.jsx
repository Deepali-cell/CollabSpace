import { Plus } from "lucide-react";
import React from "react";

const BoardHeader = ({
  isLeader,
  setIsAddTaskOpen,
  setIsAddListOpen,
  title,
}) => {
  return (
    <>
      <div className="bg-white p-6 rounded-2xl shadow-sm border flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">{title}</h1>
          <p className="text-slate-500 text-sm">
            Team Board • {isLeader ? "LEADER" : "MEMBER"}
          </p>
        </div>
        {isLeader && (
          <div className="flex gap-2">
            <button
              onClick={() => setIsAddTaskOpen(true)}
              className="bg-indigo-600 text-white px-4 py-2 rounded-lg flex gap-2 items-center text-sm font-medium hover:bg-indigo-700 transition-colors"
            >
              <Plus size={16} /> Task
            </button>
            <button
              onClick={() => setIsAddListOpen(true)}
              className="bg-slate-100 text-slate-700 px-4 py-2 rounded-lg flex gap-2 items-center text-sm font-medium hover:bg-slate-200 transition-colors"
            >
              <Plus size={16} /> List
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default BoardHeader;
