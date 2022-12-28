import express, {response} from "express"
import cors from "cors"

require("dotenv").config({})

import taskRoutes from "../routes/taskRoutes";
import authRoutes from "../routes/authRoutes";

const app = express()


app.use(express.json())


app.use(cors())

app.use("/api/v1/tasks", taskRoutes)
app.use("/api/v1/auth", authRoutes)



// error handler middleware
app.use((err, _request, response, _next)=>{
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