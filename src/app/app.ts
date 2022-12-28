import express from "express"
import cors from "cors"

require("dotenv").config({})

import taskRoutes from "../routes/taskRoutes";
import authRoutes from "../routes/authRoutes";

const app = express()


app.use(express.json())


app.use(cors())

app.use("/api/v1/tasks", taskRoutes)
app.use("/api/v1/auth", authRoutes)



export default app