import { io } from "../index.js";
import { prisma } from "../lib/prisma.js";

const createBoard = async (req, res) => {
  try {
    const { title } = req.body;

    const userId = req.userId;

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      return res.json({ success: false, message: "You are not Authorized" });
    }

    const existingBoard = await prisma.board.findFirst({
      where: { title, ownerId: userId },
    });

    if (existingBoard) {
      return res.json({
        success: false,
        message: "Board title already exists",
      });
    }
    const newBoard = await prisma.board.create({
      data: {
        title,
        owner: { connect: { id: userId } },
      },
    });

    return res.json({
      success: true,
      message: "Board created successfully",
      data: newBoard,
    });
  } catch (error) {
    console.log("Error while creating the board:", error);
    return res.json({ success: false, message: "Some backend error" });
  }
};
const userBoards = async (req, res) => {
  try {
    const userId = req.userId;

    // ✅ user ke khud ke boards
    const myBoards = await prisma.board.findMany({
      where: {
        ownerId: userId,
      },
      include: {
        team: {
          select: { id: true, name: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    // ✅ team boards jahan user member hai (but owner nahi)
    const teamBoards = await prisma.board.findMany({
      where: {
        team: {
          members: {
            some: { userId },
          },
        },
        NOT: {
          ownerId: userId,
        },
      },
      include: {
        owner: {
          select: { id: true, name: true },
        },
        team: {
          select: { id: true, name: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return res.json({
      success: true,
      myBoards,
      teamBoards,
    });
  } catch (error) {
    console.log("some error while fetching the user boards:", error);
    return res.status(500).json({
      success: false,
      message: "Some Backend error",
    });
  }
};
const boardById = async (req, res) => {
  try {
    const userId = req.userId;
    const boardId = Number(req.params.boardId);

    const board = await prisma.board.findUnique({
      where: { id: boardId },
      include: {
        owner: {
          select: { id: true, name: true, email: true },
        },

        team: {
          include: {
            members: {
              include: {
                user: {
                  select: { id: true, name: true, email: true },
                },
              },
            },
          },
        },

        lists: {
          orderBy: { order: "asc" },
          include: {
            tasks: {
              orderBy: { order: "asc" },
              include: {
                assignedTo: {
                  select: { id: true, name: true, email: true },
                },
              },
            },
          },
        },

        // unlisted tasks (bucket / unassigned)
        tasks: {
          where: { listId: null },
          orderBy: { order: "asc" },
          include: {
            assignedTo: {
              select: { id: true, name: true, email: true },
            },
          },
        },
      },
    });

    if (!board) {
      return res.status(404).json({
        success: false,
        message: "Board not found",
      });
    }

    // ✅ ACCESS CHECK
    const isOwner = board.ownerId === userId;
    const isTeamMember = board.team?.members.some((m) => m.userId === userId);

    if (!isOwner && !isTeamMember) {
      return res.status(403).json({
        success: false,
        message: "Access denied",
      });
    }

    // optional: frontend ke liye role info
    const myRole = isOwner
      ? "leader"
      : (board.team?.members.find((m) => m.userId === userId)?.role ??
        "member");

    return res.json({
      success: true,
      board,
      myRole,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      success: false,
      message: "Backend error",
    });
  }
};
const createTask = async (req, res) => {
  try {
    const { title, description, listId } = req.body;
    const userId = req.userId;
    const boardId = Number(req.params.boardId);

    const board = await prisma.board.findUnique({ where: { id: boardId } });
    if (!board || board.ownerId !== userId) {
      return res
        .status(403)
        .json({ success: false, message: "Only leader can create tasks" });
    }

    const lastTask = await prisma.task.findFirst({
      where: { boardId },
      orderBy: { order: "desc" },
    });

    const newTask = await prisma.task.create({
      data: {
        title,
        description,
        boardId,
        listId: listId ? Number(listId) : null,
        order: lastTask ? lastTask.order + 1 : 0,
      },
      include: { assignedTo: true }, // so frontend has member info
    });

    // Emit only the new task, not the full board
    io.to(boardId.toString()).emit("task-created", newTask);

    res.json({ success: true, task: newTask });
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false });
  }
};
const createList = async (req, res) => {
  try {
    const { title } = req.body;
    const userId = req.userId;
    const boardId = Number(req.params.boardId);

    const board = await prisma.board.findUnique({ where: { id: boardId } });
    if (!board || board.ownerId !== userId) {
      return res
        .status(403)
        .json({ success: false, message: "Only leader can create lists" });
    }

    const existingList = await prisma.list.findFirst({
      where: { title, boardId },
    });
    if (existingList)
      return res.json({ success: false, message: "List title exists" });

    const lastList = await prisma.list.findFirst({
      where: { boardId },
      orderBy: { order: "desc" },
    });

    const newList = await prisma.list.create({
      data: { title, boardId, order: lastList ? lastList.order + 1 : 0 },
      include: { tasks: true }, // tasks will be empty initially
    });

    // Emit only the new list
    io.to(boardId.toString()).emit("list-created", newList);

    res.json({ success: true, list: newList });
  } catch (err) {
    res.status(500).json({ success: false });
  }
};

export { createBoard, boardById, createTask, createList, userBoards };
