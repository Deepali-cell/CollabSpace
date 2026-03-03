import React from "react";
import { Droppable } from "@hello-pangea/dnd";
import { Users } from "lucide-react";
import TaskCard from "./TaskCard";

const MembersSection = ({ members, isLeader, onFinalize }) => {
  return (
    <div className="bg-white p-6 rounded-2xl border shadow-sm">
      <h3 className="font-bold text-slate-800 mb-6 flex items-center gap-2">
        <Users size={18} /> Member Buckets
      </h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {members.map((m) => (
          <Droppable droppableId={`member-${m.id}`} key={m.id}>
            {(p, snap) => (
              <div
                ref={p.innerRef}
                {...p.droppableProps}
                className={`p-4 rounded-xl border-2 border-dashed transition-colors ${
                  snap.isDraggingOver
                    ? "bg-indigo-50 border-indigo-300"
                    : "bg-slate-50 border-slate-200"
                }`}
              >
                <p className="text-xs font-bold text-slate-400 uppercase mb-3 tracking-wider">
                  {m.name}
                </p>
                <div className="space-y-2">
                  {m.tasks.map((t, i) => (
                    <TaskCard
                      key={t.id}
                      task={t}
                      index={i}
                      isLeader={isLeader}
                      onFinalize={onFinalize}
                    />
                  ))}
                </div>
                {p.placeholder}
              </div>
            )}
          </Droppable>
        ))}
      </div>
    </div>
  );
};

export default MembersSection;
