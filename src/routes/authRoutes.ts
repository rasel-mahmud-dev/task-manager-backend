
import { NextFunction, Request, Response } from "express";
import * as express from "express"

import User, {UserType} from "../models/User";

import {createToken, parseToken} from "../jwt";
import bcrypt from "bcryptjs"


const router  = express.Router()


router.post("/registration", async (req: Request, res: Response, next: NextFunction)=> {
    const {
        username,
        avatar,
        email,
        password,
    } = req.body

    try {

        let user = await User.findOne({email: email})

        if (!user) {
            // store new user

            let salt = await bcrypt.genSalt(12)
            let hash = await bcrypt.hash(password, salt)
            let newUser = new User({
                username,
                email,
                avatar,
                password: hash
            })

            user = await newUser.save();
            if (!user) {
                return res.status(403).send("User creation fail, Please try again")
            }

            let token = createToken(email)
            return res.status(201).json({user, token})
        }

        res.status(401).json({ message: "Your already registered, Please login"})

    } catch (ex) {
        next(ex)
    }
})


router.post("/generate-token", async function (req: Request, res: Response, next: NextFunction) {
    const {
        username,
        avatar,
        email,
    } = req.body

    try {

        let user = await User.findOne({email: email})
        let token = ""


        if (!user) {
            // store new user if not register
            let newUser = new User({
                username,
                email,
                avatar,
                password: ""
            })

            user = await newUser.save();
            if (!user) {
                return res.status(403).send("User creation fail, Please try again")
            }
        }

        // check current token valid or not
        token = req.headers.token as string
        let [tokenData, error]  = await parseToken(token)
        if(!error && tokenData) {
            return res.status(200).json({user})
        }
        token = createToken(email)
        return res.status(201).json({user, token})

    } catch (ex) {
        next(ex)
    }
})


router.post("/login", async (req: Request, res: Response, next: NextFunction)=> {
    const {
        email,
        password
    } = req.body

    try {

        let user = await User.findOne<UserType>({email: email})
        if (!user) {
            return res.status(404).send("Your are not registered")
        }


        if (!user.password) {
            return res.status(404).send("Your password not set yet, please login with Google")
        }

        let isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(404).send("Your password wrong")
        }
        let token = createToken(email)
        return res.status(201).json({user, token})

    } catch (ex) {

        next(ex)
    }
})


router.get("/fetch-current-auth-user", async function (req: Request, res: Response, next: NextFunction) {
    try {

        let token = req.headers.token as string || ""
        if (!token) {
            return res.status(404).send("Please login first")
        }

        const [tokenData, error] = await parseToken(token)
        if(error){
            return res.status(404).send("Please login first")
        }

        let user =  await User.findOne<UserType>({email: tokenData?.email})
        user.password = ""

        return res.status(200).json(user)

    } catch (ex) {

        next(ex)
    }
})


export default router