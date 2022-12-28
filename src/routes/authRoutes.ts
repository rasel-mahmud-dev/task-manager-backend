import * as express from "express"
import User from "../models/User";
import {createToken, parseToken} from "../jwt";
import {NextFunction, Request} from "express";
import bcrypt from "bcryptjs"

const router = express.Router()


router.post("/registration", async function (request: Request, response: Response, next: NextFunction) {
    const {
        username,
        avatar,
        email,
        password,
    } = request.body

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
                return response.status(403).send("User creation fail, Please try again")
            }

            let token = createToken(email)
            return response.status(201).json({user, token})
        }

       response.status(401).json({ message: "Your already registered, Please login"})

    } catch (ex) {
        next(ex)
    }
})


router.post("/generate-token", async function (request: Request, response: Response, next: NextFunction) {
    const {
        username,
        avatar,
        email,
    } = request.body

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
                return response.status(403).send("User creation fail, Please try again")
            }
        }

        // check current token valid or not
        token = request.headers.token
        let [tokenData, error]  = await parseToken(token)
        if(!error && tokenData) {
            return response.status(200).json({user})
        }
        token = createToken(email)
        return response.status(201).json({user, token})

    } catch (ex) {
        next(ex)
    }
})


router.post("/login", async function (request: Request, response: Response, next: NextFunction) {
    const {
        email,
        password
    } = request.body

    try {

        let user = await User.findOne({email: email})
        if (!user) {
            return response.status(404).send("Your are not registered")
        }


        if (!user.password) {
            return response.status(404).send("Your password not set yet, please login with Google")
        }

        let isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return response.status(404).send("Your password wrong")
        }
        let token = createToken(email)
        return response.status(201).json({user, token})

    } catch (ex) {

        next(ex)
    }
})

router.get("/fetch-current-auth-user", async function (request: Request, response: Response, next: NextFunction) {
    try {

        let token = request.headers.token || ""
        if (!token) {
            return response.status(404).send("Please login first")
        }

        const [tokenData, error] = await parseToken(token)
        if(error){
            return response.status(404).send("Please login first")
        }

        let user =  await User.findOne({email: tokenData.email})
        user.password = ""
        return response.status(200).json(user)

    } catch (ex) {

        next(ex)
    }
})


export default router