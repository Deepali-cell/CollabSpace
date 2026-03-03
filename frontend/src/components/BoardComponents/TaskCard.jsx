import React from "react";
import { Draggable } from "@hello-pangea/dnd";
import { User as UserIcon } from "lucide-react";

const TaskCard = ({ task, index, isLeader, onFinalize }) => (
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
        <p className="text-sm font-semibold text-slate-700">{task.title}</p>
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

export default TaskCard;
