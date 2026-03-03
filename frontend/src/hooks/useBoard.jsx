import { useContext, useEffect, useState, useCallback } from "react";
import axios from "axios";
import { stateContext } from "@/context/stateContext";
import socket from "@/lib/Socket";
import { toast } from "sonner";

export const useBoard = (boardId) => {
  const { backend_url, accessToken, user } = useContext(stateContext);

  // --- 1. All States ---
  const [board, setBoard] = useState(null);
  const [lists, setLists] = useState([]);
  const [unassignedTasks, setUnassignedTasks] = useState([]);
  const [finalizedTasks, setFinalizedTasks] = useState([]);
  const [members, setMembers] = useState([]);
  const [myRole, setMyRole] = useState("member");
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  const isLeader = myRole === "leader";
  const currentUserId = user?.id;

  // --- 2. Centralized State Manager (The "Brain") ---
  // Ye function task ko purani jagah se nikal kar nayi sahi jagah daal deti hai
  const syncTaskToState = useCallback((task) => {
    if (!task) return;

    // Remove from ALL states first to avoid duplicates
    setUnassignedTasks((prev) => prev.filter((t) => t.id !== task.id));
    setFinalizedTasks((prev) => prev.filter((t) => t.id !== task.id));
    setLists((prev) =>
      prev.map((l) => ({
        ...l,
        tasks: l.tasks.filter((t) => t.id !== task.id),
      })),
    );
    setMembers((prev) =>
      prev.map((m) => ({
        ...m,
        tasks: m.tasks.filter((t) => t.id !== task.id),
      })),
    );

    // Place in the correct state based on task properties
    if (task.finalized) {
      setFinalizedTasks((prev) => [...prev, task]);
    } else if (task.listId) {
      setLists((prev) =>
        prev.map((l) =>
          l.id === task.listId ? { ...l, tasks: [...l.tasks, task] } : l,
        ),
      );
    } else if (task.assignedToId) {
      setMembers((prev) =>
        prev.map((m) =>
          m.userId === task.assignedToId
            ? { ...m, tasks: [...m.tasks, task] }
            : m,
        ),
      );
    } else {
      setUnassignedTasks((prev) => [...prev, task]);
    }
  }, []);

  // --- 3. Data Fetching ---
  const fetchData = useCallback(async () => {
    if (!boardId || !accessToken) return;
    try {
      const { data } = await axios.get(
        `${backend_url}/api/v1/workspace/boardbyid/${boardId}`,
        { headers: { Authorization: `Bearer ${accessToken}` } },
      );

      const b = data.board;
      setBoard(b);
      setMyRole(data.myRole);

      // Initializing states using the same logic
      setFinalizedTasks(b.tasks.filter((t) => t.finalized));
      setUnassignedTasks(
        b.tasks.filter((t) => !t.assignedToId && !t.listId && !t.finalized),
      );
      setLists(
        b.lists.map((l) => ({
          ...l,
          tasks: l.tasks.filter((t) => !t.finalized),
        })),
      );
      setMembers(
        b.team?.members.map((m) => ({
          id: m.id,
          userId: m.user.id,
          name: m.user.name,
          role: m.role || "member",
          tasks: b.tasks.filter(
            (t) => t.assignedToId === m.user.id && !t.listId && !t.finalized,
          ),
        })) || [],
      );
    } catch (err) {
      console.error("Fetch error", err);
      toast.error("Failed to load board data");
    } finally {
      setLoading(false);
    }
  }, [boardId, backend_url, accessToken]);

  // --- 4. Sockets ---
  useEffect(() => {
    if (!boardId) return;
    fetchData();

    socket.emit("join-board", boardId);
    socket.on("task-created", syncTaskToState);
    socket.on("task-updated", syncTaskToState);
    socket.on("list-created", (list) =>
      setLists((prev) => [...prev, { ...list, tasks: [] }]),
    );

    return () => {
      socket.off("task-created");
      socket.off("task-updated");
      socket.off("list-created");
    };
  }, [boardId, fetchData, syncTaskToState]);

  // --- 5. Actions (Optimized) ---
  const onDragEnd = async (result) => {
    const { source, destination, draggableId } = result;
    if (
      !destination ||
      (source.droppableId === destination.droppableId &&
        source.index === destination.index)
    )
      return;

    const taskId = Number(draggableId);
    const allTasks = [
      ...unassignedTasks,
      ...lists.flatMap((l) => l.tasks),
      ...members.flatMap((m) => m.tasks),
    ];
    const task = allTasks.find((t) => t.id === taskId);

    if (!task || task.finalized) return;

    // Validation
    const destIsList = destination.droppableId.startsWith("list-");
    const destIsMember = destination.droppableId.startsWith("member-");
    const destIsUnassigned = destination.droppableId === "unassigned";

    if (!task.assignedToId && destIsList)
      return toast.error("Assign task first");
    if (source.droppableId.startsWith("list-") && !destIsList)
      return toast.error("Cannot move back to bucket");

    // Role Permission
    if (!isLeader && (destIsMember || destIsUnassigned))
      return toast.error("Only leaders can unassign/reassign");
    if (!isLeader && task.assignedToId !== currentUserId)
      return toast.error("Not your task");

    // Backup for rollback
    const backup = { unassignedTasks, lists, members };

    // Step 1: Optimistic UI Update (Immediate response)
    const updatedTask = { ...task };
    if (destIsList)
      updatedTask.listId = Number(destination.droppableId.split("-")[1]);
    if (destIsMember) {
      updatedTask.listId = null;
      updatedTask.assignedToId = members.find(
        (m) => `member-${m.id}` === destination.droppableId,
      )?.userId;
    }
    if (destIsUnassigned) {
      updatedTask.listId = null;
      updatedTask.assignedToId = null;
    }

    syncTaskToState(updatedTask);

    // Step 2: API Call
    try {
      setActionLoading(true);
      if (destIsMember) {
        const mId = Number(destination.droppableId.split("-")[1]);
        const target = members.find((m) => m.id === mId);
        await axios.post(
          `${backend_url}/api/v1/team/assigntasktomember/${taskId}`,
          { memberId: target.userId },
          { headers: { Authorization: `Bearer ${accessToken}` } },
        );
      } else if (destIsUnassigned) {
        await axios.post(
          `${backend_url}/api/v1/team/unassigntask/${taskId}`,
          {},
          { headers: { Authorization: `Bearer ${accessToken}` } },
        );
      } else if (destIsList) {
        const lId = Number(destination.droppableId.split("-")[1]);
        await axios.put(
          `${backend_url}/api/v1/team/movetask/${boardId}/task/${taskId}/list`,
          { listId: lId },
          { headers: { Authorization: `Bearer ${accessToken}` } },
        );
      }
      toast.success("Board updated");
    } catch (err) {
      // Step 3: Rollback on failure
      setUnassignedTasks(backup.unassignedTasks);
      setLists(backup.lists);
      setMembers(backup.members);
      toast.error(err.response?.data?.message || "Move failed");
    } finally {
      setActionLoading(false);
    }
  };

  const handleFinalize = async (taskId) => {
    try {
      setActionLoading(true);
      const allTasks = [
        ...unassignedTasks,
        ...lists.flatMap((l) => l.tasks),
        ...members.flatMap((m) => m.tasks),
      ];
      const task = allTasks.find((t) => t.id === taskId);
      if (!task) return;

      // Optimistic Update
      syncTaskToState({ ...task, finalized: true, listId: null });

      await axios.post(
        `${backend_url}/api/v1/team/finalizetask/${taskId}`,
        {},
        { headers: { Authorization: `Bearer ${accessToken}` } },
      );
      toast.success("Task finalized");
    } catch (err) {
      console.log(err);
      toast.error("Finalize failed");
      fetchData(); // Reset state on error
    } finally {
      setActionLoading(false);
    }
  };

  return {
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
  };
};
