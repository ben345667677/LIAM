import express from "express";
import { authMiddleware } from "../controller/authMiddleware.js";
import { isUser } from "../controller/UserMiddleware.js";
import newShiftRouter from "./newShiftRouter.js";

const HomeRouter = express.Router();

// /home
HomeRouter.get(
  "/",
  authMiddleware,
  isUser,
  (req, res) => {
    res.send("Welcome Home");
  }
);

// /home/newShift/*
HomeRouter.use(
  "/newShift",
  authMiddleware,
  isUser,
  newShiftRouter
);

export default HomeRouter;
