import jwt from "jsonwebtoken";
import { prisma } from "../lib/prisma.js";
import bcryt from "bcryptjs";
import {
  generateAccessToken,
  generateRefreshToken,
} from "../services/helperFunctions.js";

const register = async (req, res) => {
  try {
    const { email, password, name } = req.body;

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });
    if (existingUser) {
      return res.json({ success: false, message: "Email already registerd" });
    }

    const hashPassword = await bcryt.hash(password, 10);
    const newUser = await prisma.user.create({
      data: { email, password: hashPassword, name },
    });

    if (!newUser) {
      return res.json({ success: false, message: "Some error while adding" });
    }
    return res.json({
      success: true,
      message: "You are successfully registered",
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ success: false, message: "Some Backend error" });
  }
};
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const isUser = await prisma.user.findUnique({
      where: { email },
    });
    if (!isUser) {
      return res.json({ success: false, message: "You are not authorized" });
    }

    const isPasswordValid = await bcryt.compare(password, isUser.password);

    if (!isPasswordValid) {
      return res.json({ success: false, message: "Invalid Password" });
    }
    const accessToken = await generateAccessToken(isUser.id);
    const refreshToken = await generateRefreshToken(isUser.id);

    await prisma.user.update({
      where: { id: isUser.id },
      data: { refreshToken: { set: refreshToken } },
    });
    // sameSite: "none" and secure: true. in production
    res.cookie("refreshtoken", refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      path: "/",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    return res.json({
      success: true,
      accessToken,
      data: {
        id: isUser.id,
        name: isUser.name,
        email: isUser.email,
      },
    });
  } catch (error) {
    console.log(error);
    return res.json({ success: false, message: "Some Backend error" });
  }
};
const refreshAccessToken = async (req, res) => {
  const refreshToken = await req.cookies.refreshtoken;
  if (!refreshToken) return res.sendStatus(401);
  try {
    const payLoad = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    const user = await prisma.user.findFirst({
      where: { id: payLoad.userId, refreshToken },
    });
    if (!user) return res.json({ success: false, message: "User not found" });
    const newAccessToken = await generateAccessToken(user.id);
    return res.json({
      success: true,
      message: "new token generate",
      accessToken: newAccessToken,
    });
  } catch (error) {
    console.log(error);
    return res.json({ success: false, message: "some backend error" });
  }
};
const userData = async (req, res) => {
  try {
    const userId = req.userId;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
      },
    });

    if (!user) {
      return res.json({ success: false, message: "Unauthorized" });
    }

    return res.json({
      success: true,
      data: user,
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ success: false, message: "Some backend error" });
  }
};
const logout = async (req, res) => {
  try {
    const userId = req.userId;

    if (userId) {
      await prisma.user.update({
        where: { id: userId },
        data: { refreshToken: { set: null } },
      });
      res.clearCookie("refreshtoken", {
        httpOnly: true,
        secure: false,
        sameSite: "lax",
        path: "/",
      });
    }

    return res
      .status(200)
      .json({ success: true, message: "Logout successfully" });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ success: false, message: "Some backend error" });
  }
};
const allUsers = async (req, res) => {
  try {
    const loggedInUserId = req.userId;

    const users = await prisma.user.findMany({
      where: { id: { not: loggedInUserId } },
      select: {
        id: true,
        name: true,
        email: true,
        receivedRequests: {
          where: { senderId: loggedInUserId },
          select: { id: true, status: true },
        },
        sentRequests: {
          where: { receiverId: loggedInUserId },
          select: { id: true, status: true },
        },
      },
    });

    const allUsersWithRequests = users.map((user) => {
      const sentReq = user.receivedRequests[0] || null;
      const receivedReq = user.sentRequests[0] || null;

      return {
        id: user.id,
        name: user.name,
        email: user.email,

        // request info
        iSentRequestToUser: !!sentReq,
        myRequestStatus: sentReq ? sentReq.status : null,

        userSentRequestToMe: !!receivedReq,
        userRequestStatus: receivedReq ? receivedReq.status : null,

        hasRequest: !!sentReq || !!receivedReq,
      };
    });
    return res.json({
      success: true,
      message: "All users fetched with request status",
      allUsers: allUsersWithRequests,
    });
  } catch (error) {
    console.log("Error fetching users with request info:", error);
    return res
      .status(500)
      .json({ success: false, message: "Some backend error" });
  }
};
const getUserDashboard = async (req, res) => {
  try {
    const userId = req.userId;

    const [
      ownedBoards,
      teamBoards,
      totalTasks,
      completedTasks,
      pendingTasks,
      teamsCount,
      pendingRequests,
      recentTasks,
    ] = await Promise.all([
      // Boards owned by user
      prisma.board.count({
        where: { ownerId: userId },
      }),

      // Boards from teams where user is member
      prisma.board.count({
        where: {
          team: {
            members: {
              some: { userId },
            },
          },
        },
      }),

      // All assigned tasks
      prisma.task.count({
        where: { assignedToId: userId },
      }),

      // Completed tasks
      prisma.task.count({
        where: {
          assignedToId: userId,
          finalized: true,
        },
      }),

      // Pending tasks
      prisma.task.count({
        where: {
          assignedToId: userId,
          finalized: false,
        },
      }),

      // Teams joined
      prisma.teamMember.count({
        where: { userId },
      }),

      // Pending team requests received
      prisma.teamRequest.count({
        where: {
          receiverId: userId,
          status: "pending",
        },
      }),

      // Recent 5 tasks
      prisma.task.findMany({
        where: { assignedToId: userId },
        orderBy: { createdAt: "desc" },
        take: 5,
        select: {
          id: true,
          title: true,
          finalized: true,
          createdAt: true,
        },
      }),
    ]);

    res.json({
      myBoards: ownedBoards,
      teamBoards: teamBoards,
      totalBoards: ownedBoards + teamBoards,
      totalTasks,
      completedTasks,
      pendingTasks,
      teamsCount,
      pendingRequests,
      recentTasks,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Dashboard fetch failed" });
  }
};
export {
  register,
  login,
  refreshAccessToken,
  userData,
  logout,
  allUsers,
  getUserDashboard,
};
