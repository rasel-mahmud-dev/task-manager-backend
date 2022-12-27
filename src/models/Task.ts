import Base from "./Base";


export interface TaskType {
    _id?: string
    title: string,
    image: string,
    isCompleted: boolean
    comment?: string
    createdAt: Date
    updatedAt: Date
}


class Task extends Base implements TaskType{

    _id?: string
    title: string = ""
    image: string = ""
    isCompleted: boolean = false
    comment?: string
    createdAt: Date = new Date()
    updatedAt: Date = new Date()

    static collectionName = "tasks";

    constructor() {
        super(Task.collectionName)
    }
}


export default Task;
