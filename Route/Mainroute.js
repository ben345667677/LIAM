import express from "express"
const Mainrouter = express.Router()
import signInRouter from "./sgininRouter.js"
import loginRouter from './loginRouter.js'
import homeRouter from "./homeRouter.js"


Mainrouter.get('/',(req,res) => {
    res.send("API is runing")
})
Mainrouter.use('/',signInRouter)
Mainrouter.use('/',loginRouter)
Mainrouter.use("/",homeRouter)


export default Mainrouter;
