import express from "express";
import sginin from "../handler/sgininHandler.js"

const signInRouter = express.Router();

signInRouter.post("/sign-in", sginin)

export default signInRouter;
