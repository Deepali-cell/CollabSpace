import express from "express";
import {
  allUsers,
  getUserDashboard,
  login,
  logout,
  refreshAccessToken,
  register,
  userData,
} from "../controllers/userController.js";
import middleware from "../services/Middleware.js";

const userRoute = express.Router();

userRoute.post("/register", register);
userRoute.post("/login", login);
userRoute.post("/refresh-token", refreshAccessToken);
userRoute.get("/profile", middleware, userData);
userRoute.delete("/logout", middleware, logout);
userRoute.get("/allusers", middleware, allUsers);
userRoute.get("/userdashboarddata", middleware, getUserDashboard);

export default userRoute;
