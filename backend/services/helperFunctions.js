import jwt from "jsonwebtoken";

const generateAccessToken = async (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET);
};

const generateRefreshToken = async (userId) => {
  return jwt.sign({ userId }, process.env.JWT_REFRESH_SECRET);
};

const isLeader = (board, userId) => {
  if (board.ownerId === userId) return true;

  return board.team?.members?.some(
    (m) => m.userId === userId && m.role === "leader",
  );
};
export { generateAccessToken, generateRefreshToken, isLeader };
