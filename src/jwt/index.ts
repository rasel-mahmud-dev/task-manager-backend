import jwt from 'jsonwebtoken'

export const createToken = (email: string, expiresIn?: string) => {
    return jwt.sign({
            email
        },
        process.env.JWT_SECRET as string, {expiresIn: expiresIn ? expiresIn : '30d'}
    )
}

interface JwtPayload {
    email: string
}


export const parseToken = (token: string) => {
    return new Promise<[JwtPayload | undefined, string | undefined]>(async (resolve, _) => {
        try {
            if (token) {
                let d = jwt.verify(token, process.env.JWT_SECRET as string) as JwtPayload
                resolve([d, undefined])
            } else {
                resolve([undefined, "Token not found"])
            }
        } catch (ex: any) {
            resolve([undefined, ex.message])
        }
    })
}

