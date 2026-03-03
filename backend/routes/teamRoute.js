import express from "express";
import middleware from "../services/Middleware.js";
import {
  acceptRequest,
  assignBoardToTeam,
  assignTaskToMember,
  declineRequest,
  finalizeTask,
  getAllTeamsOfUser,
  getRequest,
  sendRequest,
  taskMove,
  unassignTask,
} from "../controllers/teamController.js";

const teamRoute = express.Router();

teamRoute.post("/sendrequest", middleware, sendRequest);
teamRoute.post("/acceptrequest", middleware, acceptRequest);
teamRoute.post("/declinerequest", middleware, declineRequest);
teamRoute.get("/allrequest", middleware, getRequest);
teamRoute.get("/alluserteam", middleware, getAllTeamsOfUser);
teamRoute.post("/assignboardtoteam", middleware, assignBoardToTeam);
teamRoute.post("/assigntasktomember/:taskId", middleware, assignTaskToMember);
teamRoute.put("/movetask/:boardId/task/:taskId/list", middleware, taskMove);
teamRoute.post("/finalizetask/:taskId", middleware, finalizeTask);
teamRoute.post("/unassigntask/:taskId", middleware, unassignTask);

export default teamRoute;
