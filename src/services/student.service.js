import pool from "../config/db.js"
import argon from "argon2"
import jwt from "jsonwebtoken"
import { NotFoundError, ConflictError } from "../utils/error.utils.js"

class StudentService {
    async getAllStudents() {
        const students = await pool.query(`
            SELECT u.id, u.fullname, u.phone, u.photo, r.name as role_name, u.roles_id, u.status, u.created_at 
            FROM users u 
            JOIN roles r ON u.roles_id = r.id 
            WHERE LOWER(r.name) = 'student'
            ORDER BY u.id ASC
        `)

        return {
            status: 200,
            data: students.rows
        }
    }

    async getOneStudent(req, next) {
        const { id } = req.params

        const student = await pool.query(`
            SELECT u.id, u.fullname, u.phone, u.photo, r.name as role_name, u.roles_id, u.status, u.created_at,
                   COUNT(DISTINCT o.course_id)::int as total_courses,
                   COUNT(o.id)::int as total_payments
            FROM users u 
            JOIN roles r ON u.roles_id = r.id 
            LEFT JOIN orders o ON u.id = o.student_id
            WHERE u.id = $1 AND LOWER(r.name) = 'student'
            GROUP BY u.id, r.name
        `, [id])

        if (!student.rows.length) {
            return next(new NotFoundError(404, "Student not found"))
        }

        return {
            status: 200,
            data: student.rows[0]
        }
    }

    async createStudent(req, next) {
        const { fullname, phone, password, course_id, payment_type } = req.body

        const existUser = await pool.query("SELECT * FROM users WHERE phone=$1", [phone])
        if (existUser.rows.length) {
            return next(new ConflictError(409, "Student already exists with this phone"))
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
        if (!roleRes.rows.length) {
            return next(new NotFoundError(404, "Student role not found in database"))
        }
        const roleId = roleRes.rows[0].id

        const hashPassword = await argon.hash(password)

        const newStudent = await pool.query(
            "INSERT INTO users(fullname, phone, password, roles_id) VALUES($1, $2, $3, $4) RETURNING id, fullname, phone, roles_id, created_at",
            [fullname, phone, hashPassword, roleId]
        )

        const student = newStudent.rows[0]

        let order = null
        if (courseData) {
            const newOrder = await pool.query(
                "INSERT INTO orders(student_id, course_id, direction, price, payment_type, status) VALUES($1, $2, $3, $4, $5, $6) RETURNING *",
                [student.id, course_id, courseData.direction || null, courseData.price || 0, payment_type || "payme", "paid"]
            )
            order = newOrder.rows[0]
        }

        const accessToken = jwt.sign(
            { id: student.id, phone: student.phone, role_id: student.roles_id, role_name: "student" },
            process.env.ACCESS_TOKEN_SECRET || process.env.JWT_SECRET || "access_secret",
            { expiresIn: "1h" }
        )

        const refreshToken = jwt.sign(
            { id: student.id },
            process.env.REFRESH_TOKEN_SECRET || "refresh_secret",
            { expiresIn: "7d" }
        )

        return {
            status: 201,
            message: course_id ? "Student created and course purchased successfully" : "Student created successfully",
            accessToken,
            refreshToken,
            role: "student",
            order: order || undefined
        }
    }

    async updateStudent(req, next) {
        const { id } = req.params
        const { fullname, phone } = req.body

        const existStudent = await pool.query(`
            SELECT u.id FROM users u 
            JOIN roles r ON u.roles_id = r.id 
            WHERE u.id = $1 AND LOWER(r.name) = 'student'
        `, [id])

        if (!existStudent.rows.length) {
            return next(new NotFoundError(404, "Student not found"))
        }

        await pool.query("UPDATE users SET fullname=$1, phone=$2 WHERE id=$3", [fullname, phone, id])

        return {
            status: 200,
            message: "Student updated successfully"
        }
    }

    async deleteStudent(req, next) {
        const { id } = req.params

        const existStudent = await pool.query(`
            SELECT u.id FROM users u 
            JOIN roles r ON u.roles_id = r.id 
            WHERE u.id = $1 AND LOWER(r.name) = 'student'
        `, [id])

        if (!existStudent.rows.length) {
            return next(new NotFoundError(404, "Student not found"))
        }

        await pool.query("DELETE FROM users WHERE id=$1", [id])

        return {
            status: 200,
            message: "Student deleted successfully"
        }
    }
}

const studentService = new StudentService()
export default studentService
