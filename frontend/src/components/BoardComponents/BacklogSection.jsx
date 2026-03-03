import React from "react";
import { Droppable } from "@hello-pangea/dnd";
import { Lock } from "lucide-react";
import TaskCard from "./TaskCard";

const BacklogSection = ({ unassignedTasks, isLeader, onFinalize }) => {
  return (
    <div className="bg-amber-50/50 border border-amber-100 p-4 rounded-xl">
      <h3 className="text-amber-800 font-bold mb-3 flex items-center gap-2">
        <Lock size={16} /> Unassigned Backlog
      </h3>
      <Droppable droppableId="unassigned" direction="horizontal">
        {(p) => (
          <div
            ref={p.innerRef}
            {...p.droppableProps}
            className="flex flex-wrap gap-2 min-h-[60px]"
          >
            {unassignedTasks.map((t, i) => (
              <TaskCard
                key={t.id}
                task={t}
                index={i}
                isLeader={isLeader}
                onFinalize={onFinalize}
              />
            ))}
            {p.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  );
};

export default BacklogSection;
