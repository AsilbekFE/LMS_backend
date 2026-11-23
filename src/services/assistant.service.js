import pool from "../config/db.js"
import argon from "argon2"
import { NotFoundError, ConflictError } from "../utils/error.utils.js"

class AssistantService {
    async getAllAssistants() {
        const assistants = await pool.query(`
            SELECT u.id, u.fullname, u.phone, u.photo, r.name as role_name, u.roles_id, u.status, u.created_at,
                   u.course_id, c.name as course_name
            FROM users u 
            JOIN roles r ON u.roles_id = r.id 
            LEFT JOIN courses c ON u.course_id = c.id
            WHERE LOWER(r.name) = 'assistant'
            ORDER BY u.id ASC
        `)

        return {
            status: 200,
            data: assistants.rows
        }
    }

    async getOneAssistant(req, next) {
        const { id } = req.params

        const assistant = await pool.query(`
            SELECT u.id, u.fullname, u.phone, u.photo, r.name as role_name, u.roles_id, u.status, u.created_at,
                   u.course_id, c.name as course_name
            FROM users u 
            JOIN roles r ON u.roles_id = r.id 
            LEFT JOIN courses c ON u.course_id = c.id
            WHERE u.id = $1 AND LOWER(r.name) = 'assistant'
        `, [id])

        if (!assistant.rows.length) {
            return next(new NotFoundError(404, "Assistant not found"))
        }

        return {
            status: 200,
            data: assistant.rows[0]
        }
    }

    async createAssistant(req, next) {
        const { fullname, phone, password, course_id } = req.body

        const existUser = await pool.query("SELECT * FROM users WHERE phone=$1", [phone])
        if (existUser.rows.length) {
            return next(new ConflictError(409, "Assistant already exists with this phone"))
        }

        const roleRes = await pool.query("SELECT id FROM roles WHERE LOWER(name) = 'assistant'")
        if (!roleRes.rows.length) {
            return next(new NotFoundError(404, "Assistant role not found in database"))
        }
        const roleId = roleRes.rows[0].id

        if (course_id) {
            const existCourse = await pool.query("SELECT id FROM courses WHERE id=$1", [course_id])
            if (!existCourse.rows.length) {
                return next(new NotFoundError(404, "Course not found with this course_id"))
            }
        }

        const hashPassword = await argon.hash(password)

        await pool.query(
            "INSERT INTO users(fullname, phone, password, roles_id, course_id) VALUES($1, $2, $3, $4, $5)",
            [fullname, phone, hashPassword, roleId, course_id || null]
        )

        return {
            status: 201,
            message: "Assistant created successfully"
        }
    }

    async updateAssistant(req, next) {
        const { id } = req.params
        const { fullname, phone, course_id } = req.body

        const existAssistant = await pool.query(`
            SELECT u.id FROM users u 
            JOIN roles r ON u.roles_id = r.id 
            WHERE u.id = $1 AND LOWER(r.name) = 'assistant'
        `, [id])

        if (!existAssistant.rows.length) {
            return next(new NotFoundError(404, "Assistant not found"))
        }

        if (course_id) {
            const existCourse = await pool.query("SELECT id FROM courses WHERE id=$1", [course_id])
            if (!existCourse.rows.length) {
                return next(new NotFoundError(404, "Course not found with this course_id"))
            }
        }

        await pool.query(`
            UPDATE users SET 
                fullname = COALESCE($1, fullname),
                phone = COALESCE($2, phone),
                course_id = COALESCE($3, course_id)
            WHERE id = $4
        `, [fullname || null, phone || null, course_id || null, id])

        return {
            status: 200,
            message: "Assistant updated successfully"
        }
    }

    async deleteAssistant(req, next) {
        const { id } = req.params

        const existAssistant = await pool.query(`
            SELECT u.id FROM users u 
            JOIN roles r ON u.roles_id = r.id 
            WHERE u.id = $1 AND LOWER(r.name) = 'assistant'
        `, [id])

        if (!existAssistant.rows.length) {
            return next(new NotFoundError(404, "Assistant not found"))
        }

        await pool.query("DELETE FROM users WHERE id=$1", [id])

        return {
            status: 200,
            message: "Assistant deleted successfully"
        }
    }
}

const assistantService = new AssistantService()
export default assistantService
