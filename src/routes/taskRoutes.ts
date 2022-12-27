import express, {NextFunction, Response, Router} from "express"
import Task from "../models/Task";


const router: Router = express.Router()


router.get("/", async function (request: Request, response: Response, next: NextFunction) {
    try {
        const tasks = await Task.find();
        response.send(tasks)
    } catch (ex) {
        next(ex)
    }
})


router.post("/add", async function (request: Request, response: Response, next: NextFunction) {

    const {
        title,
        image,
        description,
        isFavorite,
        date,
        comment
    } = request.body

    try {
        let newTask = await new Task({
            title,
            image,
            description,
            isFavorite,
            date,
            comment
        });

        newTask = await newTask.save<Task>()

        if (newTask) {
            response.status(201).send(newTask)
        } else {
            next("Task adding fail")
        }

    } catch (ex) {
        next(ex)
    }

})

export default router