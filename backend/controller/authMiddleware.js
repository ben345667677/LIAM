import dotenv from "dotenv"
import jwt from "jsonwebtoken";
dotenv.config();
const ACCESS_SECRET = process.env.ACCESS_SECRET;

export const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.sendStatus(401);

  const token = authHeader.split(" ")[1];

  jwt.verify(token, ACCESS_SECRET, (err, payload) => {
    if (err) return res.sendStatus(403);

    req.user = {
      id: payload.userId,
      role: payload.role,
    };

    next();
  });
};
