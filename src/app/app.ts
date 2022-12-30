import express, {NextFunction, Request, Response} from "express"
import cors from "cors"

require("dotenv").config({})

import taskRoutes from "../routes/taskRoutes";
import authRoutes from "../routes/authRoutes";

const app = express()


app.use(express.json())


const allowedOrigin = [process.env.FRONTEND as string]

const corsOptions: any = {
    credentials: true,
    origin: (origin: any[], cb: any)=>{
        if(allowedOrigin.indexOf(origin as unknown as string) !== -1){
            cb(null, true)
        } else{
            cb(null, false)
            // cb(new Error("You are Blocked"))
        }
    }
}

app.use(cors(corsOptions))

app.use("/api/v1/tasks", taskRoutes)
app.use("/api/v1/auth", authRoutes)

app.get("/", (req: Request, res: Response)=>{
    res.send("hello")
})


// error handler middleware
app.use((err: any, _request: Request, response: Response, _next: NextFunction)=>{
    let message = "Internal error"
    let status = 500
    if(typeof err === "object"){
        if(err.message){
            message = err.message
        }
        if(err.status){
            status = err.status
        }
    } else if(typeof  err === "string") {
        message = err;
    }
    response.status(status).json({message: message})
})



export default app
module.exports =  app