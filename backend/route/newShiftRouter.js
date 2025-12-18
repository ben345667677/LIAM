import express from "express";
import newShift from "../controller/updateShiftHandler.js";

const newShiftRouter = express.Router();

newShiftRouter.post("/", newShift);

export default newShiftRouter;
