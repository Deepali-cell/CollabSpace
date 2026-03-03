import React, { useState } from "react";
import { DragDropContext } from "@hello-pangea/dnd";
import { useBoard } from "@/hooks/useBoard";
import AddTaskModal from "../components/AddTaskModal";
import AddListModal from "../components/AddListModal";
import BoardHeader from "../components/BoardComponents/BoardHeader";
import BacklogSection from "../components/BoardComponents/BacklogSection";
import FinalizedSection from "../components/BoardComponents/FinalizedSection";
import MembersSection from "../components/BoardComponents/MembersSection";
import { useParams } from "react-router-dom";
import ListsSection from "@/components/BoardComponents/ListsSection";
import Loader from "@/components/Loader";

const BoardPage = () => {
  const { boardId } = useParams();
  const {
    board,
    lists,
    members,
    unassignedTasks,
    finalizedTasks,
    isLeader,
    loading,
    actionLoading,
    onDragEnd,
    handleFinalize,
  } = useBoard(boardId);

  const [isAddTaskOpen, setIsAddTaskOpen] = useState(false);
  const [isAddListOpen, setIsAddListOpen] = useState(false);

  if (loading) return <Loader title={"fetching board details..."}/>;

  return (
    <>
      {actionLoading && (
        <div className="fixed inset-0 bg-white/50 z-50 flex flex-col justify-center items-center">
          <div className="w-12 h-12 border-4 border-slate-200 border-t-indigo-600 rounded-full animate-spin" />
        </div>
      )}

      <DragDropContext onDragEnd={onDragEnd}>
        <div className="min-h-screen bg-slate-50 p-6 space-y-6">
          <BoardHeader
            isLeader={isLeader}
            setIsAddTaskOpen={setIsAddTaskOpen}
            setIsAddListOpen={setIsAddListOpen}
            title={board?.title}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <BacklogSection
              unassignedTasks={unassignedTasks}
              isLeader={isLeader}
              onFinalize={handleFinalize}
            />
            <FinalizedSection finalizedTasks={finalizedTasks} />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <ListsSection
              lists={lists}
              isLeader={isLeader}
              handleFinalize={handleFinalize}
            />
          </div>

          <MembersSection
            members={members}
            isLeader={isLeader}
            onFinalize={handleFinalize}
          />
        </div>
      </DragDropContext>

      {/* add task and add list modal */}
      <AddTaskModal
        open={isAddTaskOpen}
        onClose={() => setIsAddTaskOpen(false)}
        boardId={boardId}
      />
      <AddListModal
        open={isAddListOpen}
        onClose={() => setIsAddListOpen(false)}
        boardId={boardId}
      />
    </>
  );
};

export default BoardPage;
