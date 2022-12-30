import * as express from "express"
import {NextFunction, Request, Response} from "express";

import Task, {TaskType} from "../models/Task";
import {ObjectId} from "mongodb";
import auth from "../middleware/auth"

const router: any = express.Router()


router.get("/", auth, async function (req: Request, res: Response, next: NextFunction) {
    try {
        const tasks = await Task.find({email: req.authUser.email});
        res.send(tasks)
    } catch (ex) {
        next(ex)
    }
})


router.get("/:id", auth, async function (req: Request, res: Response, next: NextFunction) {
    try {
        const task = await Task.findOne({_id: new ObjectId(req.params.id), email: req.authUser.email});
        res.status(200).send(task)
    } catch (ex) {
        next(ex)
    }
})


router.post("/add", auth, async function (req: Request, res: Response, next: NextFunction) {

    const {
        title,
        image,
        description,
        isFavorite,
        date,
        comment
    } = req.body as any

    try {
        let newTask: Task | null = await new Task({
            title,
            email: req.authUser.email,
            image,
            description,
            isFavorite,
            date,
            comment
        });

        newTask = await newTask.save<Task>()

        if (newTask) {
            res.status(201).send(newTask)
        } else {
            next("Task adding fail")
        }

    } catch (ex) {
        next(ex)
    }

})


router.post("/update", auth, async function (req: Request, res: Response, next: NextFunction) {

    const {
        title,
        image,
        description,
        _id
    } = req.body

    try {

        let doc = await Task.updateOne({
            email: req.authUser.email,
            _id: new ObjectId(_id)
        }, {
            $set: {
                title,
                image,
                description
            }
        })


        if (!doc.matchedCount) {
            return res.status(404).send("Task Not fount")
        }

        if (doc.modifiedCount) {
            res.status(201).send("Task updated")
        } else {
            next("Task update fail")
        }

    } catch (ex) {
        next(ex)
    }

})


router.patch("/toggle-favorite/:taskId", auth, async function (req: Request, res: Response, next: NextFunction) {

    const {isFavorite} = req.body

    try {

        await Task.updateOne(
            {email: req.authUser.email, _id: new ObjectId(req.params.taskId)}, {
                $set: {
                    isFavorite: !isFavorite
                }
            })

        res.status(201).send(!isFavorite)

    } catch (ex) {
        next(ex)
    }

})

router.patch("/toggle-completed/:taskId", auth, async function (req: Request, res: Response, next: NextFunction) {

    const {isCompleted} = req.body

    try {

        await Task.updateOne(
            {email: req.authUser.email, _id: new ObjectId(req.params.taskId)}, {
                $set: {
                    isCompleted: !isCompleted
                }
            })

        res.status(201).send(!isCompleted)


    } catch (ex) {
        next(ex)
    }

})


router.patch("/delete/:taskId", auth, async function (req: Request, res: Response, next: NextFunction) {

    const {isDeleted} = req.body

    try {

        await Task.updateOne(
            {email: req.authUser.email, _id: new ObjectId(req.params.taskId)}, {
                $set: {
                    isDeleted: !isDeleted
                }
            })

        res.status(201).send(!isDeleted)


    } catch (ex) {
        next(ex)
    }

})


router.post("/sync", auth, async function (req: Request, res: Response, next: NextFunction) {

    const {tasks = []} = req.body

    try {


        let dbTasks = await Task.find<Task[]>({email: req.authUser.email}) || []
        let unique: TaskType[] = []

        for (const task1 of tasks) {
            let index = dbTasks.findIndex((task: Task) => (task._id as unknown as string).toString() === task1._id.toString())
            if (index === -1) {
                if (task1._id.length !== 24) {
                    let item = {
                        ...task1,
                        email: req.authUser.email,
                        _id: new ObjectId(),
                        createdAt: new Date(task1.createdAt || new Date())
                    }
                    dbTasks.push(item)
                    unique.push(item)
                } else {
                    unique.push(task1)
                    dbTasks.push(task1)
                }
            }
        }

        // skip duplicate error silently
        Task.insertMany(unique).then((data) => {
        }).catch((e) => {
        }).finally(async () => {
            let allTasks = await Task.find<Task[]>({email: req.authUser.email}) || []
            res.status(201).send(allTasks)
        })
    } catch (ex) {
        next(ex)
    }

})

export default router