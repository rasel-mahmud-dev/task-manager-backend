import Base from "./Base";
import {ObjectId} from "mongodb";


export interface TaskType {
    _id?: ObjectId
    title: string,
    email: string,
    image: string,
    description: string
    isFavorite: boolean
    date?: Date
    isCompleted?: boolean
    isDeleted?: boolean
    comment?: string
    createdAt?: Date
    updatedAt?: Date
}


class Task extends Base implements TaskType{

    _id?: ObjectId
    email: string = ""
    title: string = ""
    image: string = ""
    description: string = ""
    isDeleted?: boolean = false
    isCompleted?: boolean = false
    isFavorite: boolean = false
    comment?: string
    date?: Date = undefined
    createdAt?: Date = new Date()
    updatedAt?: Date = new Date()

    static collectionName = "tasks";

    constructor(data: TaskType) {
        super(Task.collectionName)
        this.title = data.title
        this.email = data.email
        this.description = data.description
        this.image = data.image
        this.isFavorite = data.isFavorite
        this.comment = data.comment
        this.date = data.date
    }
}


export default Task;
