import {Collection, Db} from "mongodb";

require("dotenv").config()

const MongoClient = require("mongodb").MongoClient;

const client = new MongoClient(process.env.MONGODB_URL);

let database: Db;


export default class Base {

    collectionName: string = ""
    private static readonly collectionName: string;

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


    static async getCollection() {
        return new Promise<Collection>(async (resolve, reject) => {
            try {
                let db = await this.getDatabase();
                resolve(db.collection(this.collectionName))
            } catch (ex) {
                reject("Database connection fail")
            }
        })
    }


    static find() {
        return new Promise(async (resolve, reject) => {
            try {
                let docs = await (await this.getCollection()).find().toArray();
                resolve(docs)

            } catch (ex) {
                reject(ex)
            }
        })
    }

}

