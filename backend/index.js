import express from "express";
import cors from "cors";
import "dotenv/config.js";
import userRoute from "./routes/userRoute.js";
import cookieParser from "cookie-parser";
import workspaceRoute from "./routes/workspaceRoute.js";
import teamRoute from "./routes/teamRoute.js";
import http from "http";
import { Server } from "socket.io";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  }),
);

app.get("/", (req, res) => {
  res.send("server is working fine");
});
app.use("/api/v1/user", userRoute);
app.use("/api/v1/workspace", workspaceRoute);
app.use("/api/v1/team", teamRoute);

// socket setup
const server = http.createServer(app);
export const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL,
    methods: ["GET", "POST"],
  },
});
io.on("connection", (socket) => {
  console.log("🟢 User connected:", socket.id);

  socket.on("join-board", (boardId) => {
    socket.join(boardId);
    console.log(`User ${socket.id} joined board ${boardId}`);
  });

  socket.on("disconnect", () => {
    console.log("🔴 User disconnected:", socket.id);
  });
});
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Server running at ${PORT}`));
