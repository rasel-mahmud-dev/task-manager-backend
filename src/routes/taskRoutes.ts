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


router.get("/:id", auth, async function (request: Request, response: Response, next: NextFunction) {
    try {
        const task = await Task.findOne({_id: new ObjectId(request.params.id), email: request.authUser.email});
        response.status(200).send(task)
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


router.post("/update", auth, async function (request: Request, response: Response, next: NextFunction) {

    const {
        title,
        image,
        description,
        _id
    } = request.body

    try {

        let doc = await Task.updateOne({
            email: request.authUser.email,
            _id: new ObjectId(_id)
        }, {
            $set: {
                title,
                image,
                description
            }
        })


        if(!doc.matchedCount){
            return response.status(404).send("Task Not fount")
        }

        if (doc.modifiedCount) {
            response.status(201).send("Task updated")
        } else {
            next("Task update fail")
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

    const {tasks = []} = request.body

    try {


        let dbTasks = await Task.find({email: request.authUser.email}) || []
        let unique = []

        for (const task1 of tasks) {
             let index  = dbTasks.findIndex(task=>task._id.toString() === task1._id.toString())
            if(index === -1) {
                if (task1._id.length !== 24) {
                    let item = {
                        ...task1,
                        email: request.authUser.email,
                        _id: new ObjectId()
                    }
                    dbTasks.push(item)
                    unique.push(item)
                } else {
                    unique.push(item)
                    dbTasks.push(task1)
                }
            }
        }

        // skip silently
        Task.insertMany(unique).then((data)=>{
        }).catch((e)=> {
            response.status(201).send(dbTasks)
        })

    } catch (ex) {
        next(ex)
    }

})

export default router