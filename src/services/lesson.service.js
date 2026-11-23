import pool from "../config/db.js"
import { NotFoundError } from "../utils/error.utils.js"

class LessonService {
    async getAllLessons(req) {
        const { section_id } = req.query

        if (section_id) {
            const lessons = await pool.query(`
                SELECT l.id, l.section_id, l.title, l.description, l.video,
                       s.name as section_name, c.name as course_name
                FROM lessons l
                JOIN sections s ON l.section_id = s.id
                JOIN courses c ON s.course_id = c.id
                WHERE l.section_id = $1
                ORDER BY l.id ASC
            `, [section_id])

            return {
                status: 200,
                data: lessons.rows
            }
        }

        const lessons = await pool.query(`
            SELECT l.id, l.section_id, l.title, l.description, l.video,
                   s.name as section_name, c.name as course_name
            FROM lessons l
            JOIN sections s ON l.section_id = s.id
            JOIN courses c ON s.course_id = c.id
            ORDER BY l.id ASC
        `)

        return {
            status: 200,
            data: lessons.rows
        }
    }

    async getOneLesson(req, next) {
        const { id } = req.params

        const lesson = await pool.query(`
            SELECT l.id, l.section_id, l.title, l.description, l.video,
                   s.name as section_name, c.name as course_name
            FROM lessons l
            JOIN sections s ON l.section_id = s.id
            JOIN courses c ON s.course_id = c.id
            WHERE l.id = $1
        `, [id])

        if (!lesson.rows.length) {
            return next(new NotFoundError(404, "Dars topilmadi"))
        }

        return {
            status: 200,
            data: lesson.rows[0]
        }
    }

    async createLesson(req, next) {
        const { section_id, title, description } = req.body
        const video = req.file ? req.file.filename : null

        const section = await pool.query("SELECT id FROM sections WHERE id = $1", [section_id])
        if (!section.rows.length) {
            return next(new NotFoundError(404, "Bo'lim topilmadi"))
        }

        const newLesson = await pool.query(
            "INSERT INTO lessons(section_id, title, description, video) VALUES($1, $2, $3, $4) RETURNING *",
            [section_id, title, description, video]
        )

        return {
            status: 201,
            message: "Dars yaratildi",
            data: newLesson.rows[0]
        }
    }

    async updateLesson(req, next) {
        const { id } = req.params
        const { title, description } = req.body

        const existLesson = await pool.query("SELECT id, video FROM lessons WHERE id = $1", [id])
        if (!existLesson.rows.length) {
            return next(new NotFoundError(404, "Dars topilmadi"))
        }

        const video = req.file ? req.file.filename : existLesson.rows[0].video

        await pool.query(
            "UPDATE lessons SET title = $1, description = $2, video = $3 WHERE id = $4",
            [title, description, video, id]
        )

        return {
            status: 200,
            message: "Dars yangilandi"
        }
    }

    async deleteLesson(req, next) {
        const { id } = req.params

        const existLesson = await pool.query("SELECT id FROM lessons WHERE id = $1", [id])
        if (!existLesson.rows.length) {
            return next(new NotFoundError(404, "Dars topilmadi"))
        }

        await pool.query("DELETE FROM lessons WHERE id = $1", [id])

        return {
            status: 200,
            message: "Dars o'chirildi"
        }
    }
}

export default new LessonService()
