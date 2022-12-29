import {NextFunction, Request, Response} from "express";
import {parseToken} from "../jwt";

export default async function (request: Request, response: Response, next: NextFunction){

    try{
        let token = request.headers.token

        if(!token){
            return response.status(401).send("You are unauthorized")
        }

        let [tokenData, error]  = await parseToken(token)

        if(tokenData && !error){
            request.authUser = tokenData
            next()
        } else {
            response.status(401).send("You are unauthorized")
        }
    } catch (ex){
        response.status(401).send("You are unauthorized")
    }
}
