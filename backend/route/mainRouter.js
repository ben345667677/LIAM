import express from 'express';
import registerRouter from './registerRouter.js';
const mainRouter = express.Router();
import loginRouter from './loginRouter.js';
import newShiftRouter from './newShifrRouter.js'

mainRouter.use('/login', loginRouter);
mainRouter.use('/register', registerRouter);
mainRouter.use('/newShift', newShiftRouter)

export default mainRouter;