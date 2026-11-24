import pool from "../config/db.js"
import argon from "argon2"
import jwt from "jsonwebtoken"
import { NotFoundError, ConflictError, BadRwquestError } from "../utils/error.utils.js"

class AuthService {
    async register(req, next) {
        const { fullname, phone, password, course_id, payment_type } = req.body

        const existUser = await pool.query("SELECT * FROM users WHERE phone=$1", [phone])
        if (existUser.rows.length) {
            return next(new ConflictError(409, "User already exists with this phone number"))
        }

        let courseData = null
        if (course_id) {
            const courseRes = await pool.query("SELECT id, name, direction, price FROM courses WHERE id=$1", [course_id])
            if (!courseRes.rows.length) {
                return next(new NotFoundError(404, "Kurs topilmadi"))
            }
            courseData = courseRes.rows[0]
        }

        const roleRes = await pool.query("SELECT id FROM roles WHERE LOWER(name) = 'student'")
        const roleId = roleRes.rows.length ? roleRes.rows[0].id : 3

        const hashPassword = await argon.hash(password)

        const newUser = await pool.query(
            "INSERT INTO users(fullname, phone, password, roles_id) VALUES($1, $2, $3, $4) RETURNING id, fullname, phone, roles_id",
            [fullname, phone, hashPassword, roleId]
        )

        const user = newUser.rows[0]

        let order = null
        if (courseData) {
            const newOrder = await pool.query(
                "INSERT INTO orders(student_id, course_id, direction, price, payment_type, status) VALUES($1, $2, $3, $4, $5, $6) RETURNING *",
                [user.id, course_id, courseData.direction || null, courseData.price || 0, payment_type || "payme", "paid"]
            )
            order = newOrder.rows[0]
        }

        const accessToken = jwt.sign(
            { id: user.id, phone: user.phone, role_id: user.roles_id, role_name: "student" },
            process.env.ACCESS_TOKEN_SECRET || process.env.JWT_SECRET || "access_secret",
            { expiresIn: "1h" }
        )

        const refreshToken = jwt.sign(
            { id: user.id },
            process.env.REFRESH_TOKEN_SECRET || "refresh_secret",
            { expiresIn: "7d" }
        )

        return {
            status: 201,
            message: course_id ? "Student registered and course purchased successfully" : "Student registered successfully",
            accessToken,
            refreshToken,
            role: "student",
            order: order || undefined
        }
    }

    async login(req, next) {
        const { phone, password } = req.body

        const existUser = await pool.query(`
            SELECT u.*, r.name as role_name 
            FROM users u 
            LEFT JOIN roles r ON u.roles_id = r.id 
            WHERE u.phone = $1
        `, [phone])

        if (!existUser.rows.length) {
            return next(new NotFoundError(404, "User not found with this phone number"))
        }

        const user = existUser.rows[0]

        const isMatch = await argon.verify(user.password, password)
        if (!isMatch) {
            return next(new BadRwquestError(400, "Invalid phone number or password"))
        }

        const accessToken = jwt.sign(
            { id: user.id, phone: user.phone, role_id: user.roles_id, role_name: user.role_name },
            process.env.ACCESS_TOKEN_SECRET || process.env.JWT_SECRET || "access_secret",
            { expiresIn: "1h" }
        )

        const refreshToken = jwt.sign(
            { id: user.id },
            process.env.REFRESH_TOKEN_SECRET || "refresh_secret",
            { expiresIn: "7d" }
        )

        return {
            status: 200,
            message: "Login successful",
            accessToken,
            refreshToken,
            user: {
                id: user.id,
                fullname: user.fullname,
                phone: user.phone,
                role: user.role_name,
                role_id: user.roles_id
            }
        }
    }

    async refreshToken(req, next) {
        const { refreshToken } = req.body

        if (!refreshToken) {
            return next(new BadRwquestError(400, "Refresh token is required"))
        }

        try {
            const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET || "refresh_secret")

            const newAccessToken = jwt.sign(
                { id: decoded.id },
                process.env.ACCESS_TOKEN_SECRET || process.env.JWT_SECRET || "access_secret",
                { expiresIn: "1h" }
            )

            return {
                status: 200,
                accessToken: newAccessToken
            }
        } catch (err) {
            return next(new BadRwquestError(400, "Refresh token is expired or invalid"))
        }
    }
}

const authService = new AuthService()
export default authService
