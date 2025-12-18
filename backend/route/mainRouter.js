import express from 'express';
import registerRouter from './registerRouter.js';
const mainRouter = express.Router();
import loginRouter from './loginRouter.js';
import newShiftRouter from './newShiftRouter.js'
import HomeRouter from "./HomeRouter.js"

mainRouter.use('/login', loginRouter);
mainRouter.use('/register', registerRouter);
mainRouter.use('/newShift', newShiftRouter)
mainRouter.use('/home', HomeRouter)

export default mainRouter;