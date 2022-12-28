import * as express from "express"
import User from "../models/User";
import {createToken} from "../jwt";
import {NextFunction, Request} from "express";
import bcrypt from  "bcryptjs"

const router = express.Router()


router.post("/generate-token", async function (request: Request, response: Response, next: NextFunction) {
    const {
        username,
        avatar,
        email,
        password,
        isEntry =  false
    } = request.body

    try {

        let user = await User.findOne({email: email})
        let token = ""


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

        } else {


        }

        if(!isEntry) {
            token = createToken(email)
        }

        return response.status(201).json({user, token})

    } catch (ex) {
        next(ex)
    }
})




export default router