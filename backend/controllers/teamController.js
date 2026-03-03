import { io } from "../index.js";
import { prisma } from "../lib/prisma.js";
import { isLeader } from "../services/helperFunctions.js";

/* ================= SEND REQUEST ================= */
const sendRequest = async (req, res) => {
  try {
    const senderId = req.userId;
    const { receiverId } = req.body;

    if (!senderId || !receiverId) {
      return res.json({ success: false, message: "Invalid request" });
    }

    if (senderId === receiverId) {
      return res.json({
        success: false,
        message: "You cannot send request to yourself",
      });
    }

    // ❌ duplicate pending request
    const existing = await prisma.teamRequest.findFirst({
      where: {
        senderId,
        receiverId,
        status: "pending",
      },
    });

    if (existing) {
      return res.json({
        success: false,
        message: "Request already sent",
      });
    }

    await prisma.teamRequest.create({
      data: {
        senderId,
        receiverId,
        status: "pending",
      },
    });

    return res.json({ success: true, message: "Request sent successfully" });
  } catch (err) {
    console.log(err);
    return res.json({ success: false, message: "Backend error" });
  }
};

/* ================= ACCEPT REQUEST ================= */
const acceptRequest = async (req, res) => {
  try {
    const userId = req.userId;
    const { requestId } = req.body;

    const request = await prisma.teamRequest.findUnique({
      where: { id: requestId },
    });

    if (!request || request.receiverId !== userId) {
      return res.json({ success: false, message: "Invalid request" });
    }

    if (request.senderId === userId) {
      return res.json({
        success: false,
        message: "You cannot accept your own request",
      });
    }

    if (request.status !== "pending") {
      return res.json({
        success: false,
        message: "Request already handled",
      });
    }

    // ❌ already in same team
    const alreadyTogether = await prisma.teamMember.findFirst({
      where: {
        userId: request.senderId,
        team: {
          members: {
            some: { userId: request.receiverId },
          },
        },
      },
    });

    if (alreadyTogether) {
      return res.json({
        success: false,
        message: "You are already in a team together",
      });
    }

    const team = await prisma.team.create({
      data: {
        name: `Team-${Date.now()}`,
        members: {
          create: [
            { userId: request.receiverId, role: "member" },
            { userId: request.senderId, role: "leader" },
          ],
        },
      },
    });

    await prisma.teamRequest.update({
      where: { id: requestId },
      data: {
        status: "accepted",
        teamId: team.id,
      },
    });

    return res.json({
      success: true,
      message: "Team created successfully",
      teamId: team.id,
    });
  } catch (err) {
    console.log(err);
    return res.json({ success: false, message: "Backend error" });
  }
};

/* ================= DECLINE REQUEST ================= */
const declineRequest = async (req, res) => {
  try {
    const userId = req.userId;
    const { requestId } = req.body;

    const request = await prisma.teamRequest.findUnique({
      where: { id: requestId },
    });

    if (!request || request.receiverId !== userId) {
      return res.json({ success: false, message: "Invalid request" });
    }

    await prisma.teamRequest.update({
      where: { id: requestId },
      data: { status: "rejected" },
    });

    return res.json({ success: true, message: "Request declined" });
  } catch (err) {
    console.log(err);
    return res.json({ success: false, message: "Backend error" });
  }
};

/* ================= GET REQUESTS ================= */
const getRequest = async (req, res) => {
  try {
    const userId = req.userId;

    const requests = await prisma.teamRequest.findMany({
      where: {
        OR: [{ senderId: userId }, { receiverId: userId }],
      },
      include: {
        sender: { select: { id: true, name: true } },
        receiver: { select: { id: true, name: true } },
        team: { select: { id: true, name: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    return res.json({ success: true, requests });
  } catch (err) {
    console.log(err);
    return res.json({ success: false, message: "Backend error" });
  }
};

/* ================= GET ALL TEAMS ================= */
const getAllTeamsOfUser = async (req, res) => {
  try {
    const userId = req.userId;

    const teams = await prisma.teamMember.findMany({
      where: { userId },
      include: {
        team: {
          include: {
            members: {
              include: {
                user: { select: { id: true, name: true, email: true } },
              },
            },
            boards: true,
          },
        },
      },
    });

    return res.json({
      success: true,
      teams: teams.map((t) => ({
        teamId: t.team.id,
        teamName: t.team.name,
        role: t.role,
        members: t.team.members.map((m) => ({
          id: m.user.id,
          name: m.user.name,
          role: m.role,
        })),
        boards: t.team.boards,
      })),
    });
  } catch (err) {
    console.log(err);
    return res.json({ success: false, message: "Backend error" });
  }
};

/* ================= ASSIGN BOARD TO TEAM ================= */
const assignBoardToTeam = async (req, res) => {
  try {
    const userId = req.userId;
    const teamId = Number(req.body.teamId);
    const boardId = Number(req.body.boardId);

    if (!teamId || !boardId) {
      return res.status(400).json({ success: false, message: "Invalid IDs" });
    }

    const member = await prisma.teamMember.findFirst({
      where: { teamId, userId, role: "leader" },
    });

    if (!member) {
      return res
        .status(403)
        .json({ success: false, message: "Only leader can assign board" });
    }

    const board = await prisma.board.findUnique({
      where: { id: boardId }, // ✅ INT now
    });

    if (!board || board.ownerId !== userId) {
      return res.status(403).json({
        success: false,
        message: "Only board owner can assign board",
      });
    }

    await prisma.board.update({
      where: { id: boardId },
      data: { teamId },
    });

    io.to(boardId.toString()).emit("board-updated");
    return res.json({
      success: true,
      message: "Board assigned to team",
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      success: false,
      message: "Backend error",
    });
  }
};

/* ================= ASSIGN TASK ================= */
const assignTaskToMember = async (req, res) => {
  try {
    const userId = req.userId;
    const taskId = Number(req.params.taskId);
    const { memberId } = req.body;

    const task = await prisma.task.findUnique({
      where: { id: taskId },
      include: {
        board: {
          include: {
            team: { include: { members: true } },
          },
        },
      },
    });

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }

    // ✅ only leader
    if (!isLeader(task.board, userId)) {
      return res.status(403).json({
        success: false,
        message: "Only leader can assign tasks",
      });
    }

    // ✅ member must belong to same team
    const isTeamMember = task.board.team?.members.some(
      (m) => m.userId === memberId,
    );

    if (!isTeamMember) {
      return res.json({
        success: false,
        message: "User not part of this team",
      });
    }

    // ✅ ASSIGN
    const updatedTask = await prisma.task.update({
      where: { id: taskId },
      data: {
        assignedToId: memberId,
        listId: null, // goes to member bucket
      },
    });

    io.to(task.board.id.toString()).emit("task-updated", updatedTask);
    return res.json({
      success: true,
      message: "Task assigned successfully",
      task: updatedTask,
    });
  } catch (err) {
    console.log(err);
    return res.json({ success: false, message: "Backend error" });
  }
};
const taskMove = async (req, res) => {
  try {
    const userId = req.userId;
    const { boardId, taskId } = req.params;
    const { listId } = req.body;

    const task = await prisma.task.findUnique({
      where: { id: Number(taskId) },
      include: { board: true },
    });

    if (!task || task.boardId !== Number(boardId)) {
      return res.status(404).json({ success: false });
    }

    if (task.finalized) {
      return res.json({
        success: false,
        message: "Finalized task cannot be moved",
      });
    }

    const leader = isLeader(task.board, userId);
    const isAssignedToMe = task.assignedToId === userId;

    if (!leader && listId === null) {
      return res.status(403).json({
        success: false,
        message: "Members cannot unassign tasks",
      });
    }

    if (!leader && !isAssignedToMe) {
      return res.status(403).json({
        success: false,
        message: "You can move only your tasks",
      });
    }

    const updatedTask = await prisma.task.update({
      where: { id: Number(taskId) },
      data: { listId },
    });
    io.to(boardId.toString()).emit("task-updated", updatedTask);
    res.json({ success: true, task: updatedTask });
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, message: "Backend error" });
  }
};
const finalizeTask = async (req, res) => {
  const userId = req.userId;
  const taskId = Number(req.params.taskId);

  const task = await prisma.task.findUnique({
    where: { id: taskId },
    include: { board: true },
  });

  if (!task) {
    return res.status(404).json({ success: false, message: "Task not found" });
  }

  // Leader check logic (ensure isLeader function is working correctly)
  if (!isLeader(task.board, userId)) {
    return res.status(403).json({
      success: false,
      message: "Only leader can finalize task",
    });
  }

  if (task.finalized) {
    return res.json({ success: false, message: "Already finalized" });
  }

  // 🔥 FIX START: Include 'assignedTo' in the update response
  const updated = await prisma.task.update({
    where: { id: taskId },
    data: {
      finalized: true,
      listId: null,
      // assignedToId ko hum yahan nahi chhed rahe,
      // toh wo purana wala hi rahega (correct logic)
    },
    include: {
      assignedTo: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  });
  // 🔥 FIX END

  // Pura object emit hoga jisme assignedTo.name maujood hai
  io.to(task.boardId.toString()).emit("task-updated", updated);

  res.json({ success: true, task: updated });
};
const unassignTask = async (req, res) => {
  try {
    const userId = req.userId;
    const taskId = Number(req.params.taskId);

    const task = await prisma.task.findUnique({
      where: { id: taskId },
      include: {
        board: {
          include: {
            team: true,
          },
        },
      },
    });

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }
    if (task.finalized) {
      return res.json({
        success: false,
        message: "Finalized task cannot be unassigned",
      });
    }
    // ✅ only leader
    if (!isLeader(task.board, userId)) {
      return res.status(403).json({
        success: false,
        message: "Only leader can unassign tasks",
      });
    }

    const updatedTask = await prisma.task.update({
      where: { id: taskId },
      data: {
        assignedToId: null,
        listId: null, // goes back to unassigned bucket
      },
    });

    io.to(task.boardId.toString()).emit("task-updated", updatedTask);
    return res.json({
      success: true,
      message: "Task unassigned successfully",
      task: updatedTask,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      success: false,
      message: "Backend error",
    });
  }
};
export {
  sendRequest,
  acceptRequest,
  declineRequest,
  getRequest,
  getAllTeamsOfUser,
  assignBoardToTeam,
  assignTaskToMember,
  taskMove,
  finalizeTask,
  unassignTask,
};
