import express from "express";
import tokenVerify from "../Middleware/TokenVerfy.js";

const homeRouter = express.Router();

homeRouter.post("/home", tokenVerify, (req, res) => {
  res.status(200).json({
    message: "Welcome to home",
    userId: req.userId,
  });
});

export default homeRouter;
