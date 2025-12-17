import express from "express";
import loginHandler from "../controller/loginHandler.js";
const loginRouter = express.Router();
loginRouter.post("/", (req, res) => {
  loginHandler(req, res);
});

export default loginRouter;