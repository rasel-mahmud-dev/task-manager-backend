
require("dotenv").config()

import {Collection, Db, ObjectId, MongoClient, Filter, Document, UpdateFilter, UpdateResult, OptionalId} from "mongodb";


const client = new MongoClient(process.env.MONGODB_URL as string);

let database: Db;


export default class Base {

    collectionName: string = ""
    _id?: ObjectId
    static readonly collectionName: string;

    constructor(collectionName: string) {
        this.collectionName = collectionName
    }


    static async getDatabase() {
        return new Promise<Db>(async (resolve, reject) => {
            const clientPromise = client.connect();
            try {
                // we use mongodb client caching
                if (!database) {
                    database = (await clientPromise).db("task-manager");
                }
                resolve(database)
            } catch (ex) {
                reject(ex)
            }
        })
    }


    static async getCollection(collectionName: string) {
        return new Promise<Collection>(async (resolve, reject) => {
            try {
                let db = await Base.getDatabase();
                resolve(db.collection(collectionName))
            } catch (ex) {
                reject("Database connection fail")
            }
        })
    }


    static findOne<T>(filter: Filter<Document>) {
        return new Promise<T>(async (resolve, reject) => {
            try {
                let docs = (await Base.getCollection(this.collectionName)).findOne(filter)
                resolve(docs as T)

            } catch (ex) {
                reject(ex)
            }
        })
    }


    static find<T>(filter: Filter<Document>) {
        return new Promise<T | null>(async (resolve, reject) => {
            try {
                let docs = (await Base.getCollection(this.collectionName)).find(filter).toArray();
                resolve(docs as T)

            } catch (ex) {
                reject(ex)
            }
        })
    }

    save<T>() {
        return new Promise<T | null>(async (resolve, reject) => {
            try {
                const {collectionName, ...other} = this
                let doc = await (await Base.getCollection(this.collectionName)).insertOne(other)
                if (doc.insertedId) {
                    other._id = doc.insertedId
                    resolve(other as T)
                } else {
                    resolve(null)
                }

            } catch (ex) {
                reject(ex)
            }
        })
    }


    static updateOne(filter: Filter<Document>, update: UpdateFilter<Document> | Partial<Document>){
        return new Promise<UpdateResult>(async (resolve, reject) => {
            try {
                let doc = await (await Base.getCollection(this.collectionName)).updateOne(filter, update)
                resolve(doc)

            } catch (ex) {
                reject(ex)
            }
        })
    }


    static insertMany<T>(insert: any) {
        return new Promise<T>(async (resolve, reject) => {
            try {
                let doc = (await Base.getCollection(this.collectionName)).insertMany(insert, {ordered: false})
                resolve(doc as T)

            } catch (ex) {
                reject(ex)
            }
        })
    }

    static deleteOne(filter: Filter<Document>) {
        return new Promise<boolean>(async (resolve, reject) => {
            try {
                let doc = await (await Base.getCollection(this.collectionName)).deleteOne(filter)
                if (doc.deletedCount) {
                    resolve(true)
                } else {
                    resolve(false)
                }

            } catch (ex) {
                reject(ex)
            }
        })
    }

}

