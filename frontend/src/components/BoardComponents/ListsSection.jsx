import { Droppable } from "@hello-pangea/dnd";
import React from "react";
import TaskCard from "./TaskCard";

const ListsSection = ({ lists, isLeader, handleFinalize }) => {
  return (
    <>
      {lists.map((list) => (
        <div
          key={list.id}
          className="bg-slate-200/40 p-4 rounded-2xl border min-h-[300px]"
        >
          <h4 className="font-bold text-slate-700 mb-4 px-1">{list.title}</h4>
          <Droppable droppableId={`list-${list.id}`}>
            {(p) => (
              <div ref={p.innerRef} {...p.droppableProps} className="space-y-3">
                {list.tasks.map((t, i) => (
                  <TaskCard
                    key={t.id}
                    task={t}
                    index={i}
                    isLeader={isLeader}
                    onFinalize={handleFinalize}
                  />
                ))}
                {p.placeholder}
              </div>
            )}
          </Droppable>
        </div>
      ))}
    </>
  );
};

export default ListsSection;
