import express from "express";
import login from "../handler/loginHandeler.js"

const loginRouter = express.Router();

loginRouter.post("/login", login)

export default loginRouter;
