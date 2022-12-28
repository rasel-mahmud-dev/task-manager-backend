import Base from "./Base";
import {ObjectId} from "mongodb";

export interface UserType {
    _id?: ObjectId
    username: string,
    avatar: string,
    email: string
    password?: string
    createdAt?: Date
    updatedAt?: Date
}

class User extends Base implements UserType{

    _id?: ObjectId
    username: string = ""
    avatar: string = ""
    email: string = ""
    password?: string = ""
    createdAt?: Date = new Date()
    updatedAt?: Date = new Date()

    static collectionName = "users";

    constructor(data: UserType) {
        super(User.collectionName)
        this.username = data.username
        this.avatar = data.avatar
        this.password = data.password
        this.email = data.email
    }
}


export default User;
