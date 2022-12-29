import {Collection, Db, Filter, ObjectId, UpdateFilter, UpdateResult} from "mongodb";

require("dotenv").config()

const MongoClient = require("mongodb").MongoClient;

const client = new MongoClient(process.env.MONGODB_URL);

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


    static findOne(filter: Filter<Document>) {
        return new Promise(async (resolve, reject) => {
            try {
                let docs = await (await Base.getCollection(this.collectionName)).findOne(filter)
                resolve(docs)

            } catch (ex) {
                reject(ex)
            }
        })
    }


    static find(filter: Filter<Document>) {
        return new Promise(async (resolve, reject) => {
            try {
                let docs = await (await Base.getCollection(this.collectionName)).find(filter).toArray();
                resolve(docs)

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


    static updateOne<T>(filter: Filter<Document>, update: UpdateFilter<Document> | Partial<Document>): UpdateResult {
        return new Promise<T>(async (resolve, reject) => {
            try {
                let doc = await (await Base.getCollection(this.collectionName)).updateOne(filter, update)
                resolve(doc)

            } catch (ex) {
                reject(ex)
            }
        })
    }


    static insertMany<T>(insert: UpdateFilter<Document> | Partial<Document>) {
        return new Promise<T>(async (resolve, reject) => {
            try {
                let doc = await (await Base.getCollection(this.collectionName)).insertMany(insert, {ordered: true})
                resolve(doc)

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

