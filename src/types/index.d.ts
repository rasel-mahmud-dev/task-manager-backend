export {}

declare global {
    namespace Express {
        export interface Request {
            authUser: {
                email: string
            }
        }
    }
}