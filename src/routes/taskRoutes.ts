import express, {Response, Router} from "express"
import Task from "../models/Task";


const router: Router = express.Router()



router.get("/", async function (request: Request, response: Response){

    const tasks = await Task.find();


})

export default router