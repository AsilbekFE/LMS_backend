import jwt from "jsonwebtoken"

export const authGuard = (req, res, next) => {
    try {
        const auth = req.headers.authorization

        if (!auth || !auth.startsWith("Bearer ")) {
            return res.status(401).json({
                status: 401,
                message: "token berilmagan"
            })
        }

        const token = auth.split(" ")[1]
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET || process.env.JWT_SECRET || "access_secret")

        req.user = decoded
        next()
    } catch (err) {
        return res.status(401).json({
            status: 401,
            message: "token yaroqsiz yoki muddati otgan"
        })
    }
}
