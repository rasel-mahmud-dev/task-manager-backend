import express, {NextFunction, Response, Router} from "express"
import Task from "../models/Task";
import {ObjectId} from "mongodb";
import auth from "../middleware/auth"

const router: Router = express.Router()


router.get("/", auth, async function (request: Request, response: Response, next: NextFunction) {
    try {
        const tasks = await Task.find({email: request.authUser.email});
        response.send(tasks)
    } catch (ex) {
        next(ex)
    }
})


router.post("/add", auth, async function (request: Request, response: Response, next: NextFunction) {

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
            email: request.authUser.email,
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


router.patch("/toggle-favorite/:taskId", auth, async function (request: Request, response: Response, next: NextFunction) {

    const {isFavorite} = request.body

    try {

        await Task.updateOne(
            { email: request.authUser.email, _id: new ObjectId(request.params.taskId)}, {
                $set: {
                    isFavorite: !isFavorite
                }
            })

        response.status(201).send(!isFavorite)

    } catch (ex) {
        next(ex)
    }

})

router.patch("/toggle-completed/:taskId", auth, async function (request: Request, response: Response, next: NextFunction) {

    const {isCompleted} = request.body

    try {

        await Task.updateOne(
            {email: request.authUser.email, _id: new ObjectId(request.params.taskId)}, {
                $set: {
                    isCompleted: !isCompleted
                }
            })

        response.status(201).send(!isCompleted)


    } catch (ex) {
        next(ex)
    }

})


router.patch("/delete/:taskId",auth, async function (request: Request, response: Response, next: NextFunction) {

    const {isDeleted} = request.body

    try {

        await Task.updateOne(
            {email: request.authUser.email, _id: new ObjectId(request.params.taskId)}, {
                $set: {
                    isDeleted: !isDeleted
                }
            })

        response.status(201).send(!isDeleted)


    } catch (ex) {
        next(ex)
    }

})



router.post("/sync", auth, async function (request: Request, response: Response, next: NextFunction) {

    const {localTasks = []} = request.body

    try {

        let allTasks = []
        let tasks = await Task.find({email: request.authUser.email})
        if(tasks){
            allTasks.concat(tasks)
        }

        for (const task1 of localTasks) {
             let index  = allTasks.findIndex(task=>task._id === task1._id)
            if(index === -1) {
                if (task1._id.length !== 24) {
                    allTasks.push({
                        ...task1,
                        email: request.authUser.email,
                        _id: new ObjectId()
                    })
                } else {
                    allTasks.push(task1)
                }
            }
        }

        console.log(allTasks)

        // await Task.insertMany(
        //     {_id: new ObjectId(request.params.taskId)}, {
        //         $set: {
        //             isDeleted: !isDeleted
        //         }
        //     })

        response.status(201).send(allTasks)


    } catch (ex) {
        next(ex)
    }

})

export default router