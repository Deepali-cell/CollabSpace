import express from "express";
import {
  boardById,
  createBoard,
  createList,
  createTask,
  userBoards,
} from "../controllers/workspaceController.js";
import middleware from "../services/Middleware.js";

const workspaceRoute = express.Router();

workspaceRoute.post("/createboard", middleware, createBoard);
workspaceRoute.get("/userboards", middleware, userBoards);
workspaceRoute.get("/boardbyid/:boardId", middleware, boardById);
workspaceRoute.post("/createtask/:boardId", middleware, createTask);
workspaceRoute.post("/createlist/:boardId", middleware, createList);

export default workspaceRoute;
