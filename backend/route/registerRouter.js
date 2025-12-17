import express from "express";
import registerHandler from "../controller/registerHandle.js";

const registerRouter = express.Router();

// 🔥 זה הקריטי
registerRouter.post("/", registerHandler);

export default registerRouter;
