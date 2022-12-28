import jwt from 'jsonwebtoken'

export const createToken = (email: string, expiresIn?: string) => {
    return jwt.sign({
            email
        },
        process.env.JWT_SECRET, {expiresIn: expiresIn ? expiresIn : '30d'}
    )
}


export const parseToken = (token: string) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (token) {
                let d = await jwt.verify(token, process.env.JWT_SECRET)
                resolve(d)
            } else {
                reject(new Error("Token not found"))
            }
        } catch (ex) {
            reject(ex)
        }
    })
}

