import pool from "../config/db.js"
import { NotFoundError } from "../utils/error.utils.js"

class SectionService {
    async getAllSections(req) {
        const { course_id } = req.query

        if (course_id) {
            const sections = await pool.query("SELECT * FROM sections WHERE course_id = $1 ORDER BY id ASC", [course_id])
            return {
                status: 200,
                data: sections.rows
            }
        }

        const sections = await pool.query("SELECT * FROM sections ORDER BY id ASC")
        return {
            status: 200,
            data: sections.rows
        }
    }

    async getOneSection(req, next) {
        const { id } = req.params
        const section = await pool.query("SELECT * FROM sections WHERE id = $1", [id])

        if (!section.rows.length) {
            return next(new NotFoundError(404, "Bo'lim topilmadi"))
        }

        return {
            status: 200,
            data: section.rows[0]
        }
    }

    async createSection(req, next) {
        const { course_id, name } = req.body

        const course = await pool.query("SELECT id FROM courses WHERE id = $1", [course_id])
        if (!course.rows.length) {
            return next(new NotFoundError(404, "Kurs topilmadi"))
        }

        const newSection = await pool.query(
            "INSERT INTO sections(course_id, name) VALUES($1, $2) RETURNING *",
            [course_id, name]
        )

        return {
            status: 201,
            message: "Bo'lim yaratildi",
            data: newSection.rows[0]
        }
    }

    async updateSection(req, next) {
        const { id } = req.params
        const { name } = req.body

        const existSection = await pool.query("SELECT id FROM sections WHERE id = $1", [id])
        if (!existSection.rows.length) {
            return next(new NotFoundError(404, "Bo'lim topilmadi"))
        }

        await pool.query("UPDATE sections SET name = $1 WHERE id = $2", [name, id])

        return {
            status: 200,
            message: "Bo'lim yangilandi"
        }
    }

    async deleteSection(req, next) {
        const { id } = req.params

        const existSection = await pool.query("SELECT id FROM sections WHERE id = $1", [id])
        if (!existSection.rows.length) {
            return next(new NotFoundError(404, "Bo'lim topilmadi"))
        }

        await pool.query("DELETE FROM sections WHERE id = $1", [id])

        return {
            status: 200,
            message: "Bo'lim o'chirildi"
        }
    }
}

export default new SectionService()
