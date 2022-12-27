import Base from "./Base";


export interface TaskType {
    _id?: string
    title: string,
    image: string,
    description: string
    isFavorite: boolean
    date?: Date
    isCompleted?: boolean
    comment?: string
    createdAt?: Date
    updatedAt?: Date
}


class Task extends Base implements TaskType{

    _id?: string
    title: string = ""
    image: string = ""
    description: string = ""
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
        this.description = data.description
        this.image = data.image
        this.isFavorite = data.isFavorite
        this.comment = data.comment
        this.date = data.date
    }
}


export default Task;
