import React, { useState } from "react";
import { Draggable } from "@hello-pangea/dnd";
import {
  User as UserIcon,
  AlignLeft,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

const TaskCard = ({ task, index, isLeader, onFinalize }) => {
  const [showDesc, setShowDesc] = useState(false);

  return (
    <Draggable
      draggableId={`${task.id}`}
      index={index}
      isDragDisabled={task.finalized}
    >
      {(p, snap) => (
        <div
          ref={p.innerRef}
          {...p.draggableProps}
          {...p.dragHandleProps}
          className={`bg-white p-3 rounded-xl border shadow-sm transition-all ${
            snap.isDragging
              ? "shadow-lg ring-2 ring-indigo-200 rotate-2"
              : "hover:border-indigo-300"
          }`}
        >
          {/* Header: Title and Description Toggle */}
          <div className="flex items-start justify-between gap-2">
            <p className="text-sm font-semibold text-slate-700 leading-tight">
              {task.title}
            </p>
            {task.description && (
              <button
                onClick={(e) => {
                  e.stopPropagation(); // Prevents drag triggers
                  setShowDesc(!showDesc);
                }}
                className={`p-1 rounded-md transition-colors ${
                  showDesc
                    ? "bg-indigo-50 text-indigo-600"
                    : "text-slate-400 hover:bg-slate-100"
                }`}
                title="View Description"
              >
                <AlignLeft size={14} />
              </button>
            )}
          </div>

          {/* Collapsible Description Area */}
          <div
            className={`overflow-hidden transition-all duration-300 ease-in-out ${
              showDesc ? "max-h-40 mt-2 opacity-100" : "max-h-0 opacity-0"
            }`}
          >
            <p className="text-[11px] text-slate-500 bg-slate-50 p-2 rounded-lg border border-slate-100">
              {task.description}
            </p>
          </div>

          {/* Footer: User and Action */}
          <div className="flex items-center justify-between mt-3">
            {task.assignedTo && (
              <div className="flex items-center gap-1.5 bg-slate-100 px-2 py-0.5 rounded-md">
                <UserIcon size={10} className="text-slate-500" />
                <span className="text-[10px] font-bold text-slate-600">
                  {task.assignedTo.name}
                </span>
              </div>
            )}

            {isLeader && !task.finalized && (
              <button
                onClick={() => onFinalize(task.id)}
                className="text-[10px] font-bold text-indigo-600 hover:text-indigo-800 transition-colors"
              >
                Finalize
              </button>
            )}
          </div>
        </div>
      )}
    </Draggable>
  );
};

export default TaskCard;
