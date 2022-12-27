import express from "express"
import cors from "cors"

require("dotenv").config({})

import taskRoutes from "../routes/taskRoutes";

const app = express()


app.use(express.json())


app.use(cors())

app.use("/api/v1/tasks", taskRoutes)



export default app