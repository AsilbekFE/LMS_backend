import pool from "../config/db.js"
import { NotFoundError, BadRwquestError } from "../utils/error.utils.js"

class HomeworkService {
    async getAllHomeworks(req) {
        const { lesson_id } = req.query

        if (lesson_id) {
            const homeworks = await pool.query(`
                SELECT h.id, h.lesson_id, h.title, h.description, h.file, h.deadline, h.created_at,
                       l.title as lesson_title
                FROM homeworks h
                JOIN lessons l ON h.lesson_id = l.id
                WHERE h.lesson_id = $1
                ORDER BY h.id ASC
            `, [lesson_id])

            return {
                status: 200,
                data: homeworks.rows
            }
        }

        const homeworks = await pool.query(`
            SELECT h.id, h.lesson_id, h.title, h.description, h.file, h.deadline, h.created_at,
                   l.title as lesson_title
            FROM homeworks h
            JOIN lessons l ON h.lesson_id = l.id
            ORDER BY h.id ASC
        `)

        return {
            status: 200,
            data: homeworks.rows
        }
    }

    async getOneHomework(req, next) {
        const { id } = req.params

        const homework = await pool.query(`
            SELECT h.id, h.lesson_id, h.title, h.description, h.file, h.deadline, h.created_at,
                   l.title as lesson_title
            FROM homeworks h
            JOIN lessons l ON h.lesson_id = l.id
            WHERE h.id = $1
        `, [id])

        if (!homework.rows.length) {
            return next(new NotFoundError(404, "Vazifa topilmadi"))
        }

        return {
            status: 200,
            data: homework.rows[0]
        }
    }

    async createHomework(req, next) {
        const { lesson_id, title, description, deadline } = req.body
        const file = req.file ? req.file.filename : null

        if (!lesson_id || !title) {
            return next(new BadRwquestError(400, "lesson_id va title kiritilishi shart"))
        }

        const lesson = await pool.query("SELECT id FROM lessons WHERE id = $1", [lesson_id])
        if (!lesson.rows.length) {
            return next(new NotFoundError(404, "Dars topilmadi"))
        }

        const newHomework = await pool.query(`
            INSERT INTO homeworks(lesson_id, title, description, file, deadline)
            VALUES($1, $2, $3, $4, $5)
            RETURNING *
        `, [lesson_id, title, description || null, file, deadline || null])

        return {
            status: 201,
            message: "Uy vazifasi yaratildi",
            data: newHomework.rows[0]
        }
    }

    async updateHomework(req, next) {
        const { id } = req.params
        const { title, description, deadline } = req.body

        const exist = await pool.query("SELECT id, file FROM homeworks WHERE id = $1", [id])
        if (!exist.rows.length) {
            return next(new NotFoundError(404, "Vazifa topilmadi"))
        }

        const file = req.file ? req.file.filename : exist.rows[0].file

        await pool.query(`
            UPDATE homeworks
            SET title = COALESCE($1, title),
                description = COALESCE($2, description),
                file = $3,
                deadline = COALESCE($4, deadline)
            WHERE id = $5
        `, [title, description, file, deadline, id])

        return {
            status: 200,
            message: "Uy vazifasi yangilandi"
        }
    }

    async deleteHomework(req, next) {
        const { id } = req.params

        const exist = await pool.query("SELECT id FROM homeworks WHERE id = $1", [id])
        if (!exist.rows.length) {
            return next(new NotFoundError(404, "Vazifa topilmadi"))
        }

        await pool.query("DELETE FROM homeworks WHERE id = $1", [id])

        return {
            status: 200,
            message: "Uy vazifasi o'chirildi"
        }
    }

    async getAllSubmissions(req) {
        const { lesson_id, status } = req.query

        let query = `
            SELECT sa.id, sa.student_id, u.fullname as student_name, u.phone as student_phone,
                   sa.lesson_id, l.title as lesson_title, sa.file, sa.status, sa.feedback, sa.score,
                   sa.created_at, sa.updated_at
            FROM student_assignments sa
            JOIN users u ON sa.student_id = u.id
            JOIN lessons l ON sa.lesson_id = l.id
            WHERE 1=1
        `
        const params = []

        if (lesson_id) {
            params.push(lesson_id)
            query += ` AND sa.lesson_id = $${params.length}`
        }

        if (status) {
            params.push(status)
            query += ` AND sa.status = $${params.length}`
        }

        query += " ORDER BY sa.id DESC"

        const res = await pool.query(query, params)

        return {
            status: 200,
            data: res.rows
        }
    }

    async getOneSubmission(req, next) {
        const { id } = req.params

        const res = await pool.query(`
            SELECT sa.id, sa.student_id, u.fullname as student_name, u.phone as student_phone,
                   sa.lesson_id, l.title as lesson_title, sa.file, sa.status, sa.feedback, sa.score,
                   sa.created_at, sa.updated_at
            FROM student_assignments sa
            JOIN users u ON sa.student_id = u.id
            JOIN lessons l ON sa.lesson_id = l.id
            WHERE sa.id = $1
        `, [id])

        if (!res.rows.length) {
            return next(new NotFoundError(404, "Topshiriq topilmadi"))
        }

        return {
            status: 200,
            data: res.rows[0]
        }
    }

    async gradeSubmission(req, next) {
        const { id } = req.params
        const { status, feedback, score } = req.body

        if (!status) {
            return next(new BadRwquestError(400, "status ('accepted' yoki 'rejected') kiritilishi shart"))
        }

        const exist = await pool.query("SELECT id FROM student_assignments WHERE id = $1", [id])
        if (!exist.rows.length) {
            return next(new NotFoundError(404, "Topshiriq topilmadi"))
        }

        const res = await pool.query(`
            UPDATE student_assignments
            SET status = $1,
                feedback = $2,
                score = $3,
                updated_at = CURRENT_TIMESTAMP
            WHERE id = $4
            RETURNING *
        `, [status, feedback || null, score !== undefined ? score : null, id])

        return {
            status: 200,
            message: "Topshiriq baholandi",
            data: res.rows[0]
        }
    }

    async getStudentSubmissions(req) {
        const studentId = req.user.id

        const res = await pool.query(`
            SELECT sa.id, sa.lesson_id, l.title as lesson_title, sa.file, sa.status, sa.feedback, sa.score,
                   sa.created_at, sa.updated_at
            FROM student_assignments sa
            JOIN lessons l ON sa.lesson_id = l.id
            WHERE sa.student_id = $1
            ORDER BY sa.id DESC
        `, [studentId])

        return {
            status: 200,
            data: res.rows
        }
    }
}

const homeworkService = new HomeworkService()
export default homeworkService
