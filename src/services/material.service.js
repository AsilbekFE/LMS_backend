import pool from "../config/db.js"
import { NotFoundError } from "../utils/error.utils.js"

class MaterialService {
    async getAllMaterials(req) {
        const { lesson_id } = req.query

        if (lesson_id) {
            const materials = await pool.query(`
                SELECT m.id, m.lesson_id, m.title, m.file,
                       l.title as lesson_title
                FROM lesson_materials m
                JOIN lessons l ON m.lesson_id = l.id
                WHERE m.lesson_id = $1
                ORDER BY m.id ASC
            `, [lesson_id])

            return {
                status: 200,
                data: materials.rows
            }
        }

        const materials = await pool.query(`
            SELECT m.id, m.lesson_id, m.title, m.file,
                   l.title as lesson_title
            FROM lesson_materials m
            JOIN lessons l ON m.lesson_id = l.id
            ORDER BY m.id ASC
        `)

        return {
            status: 200,
            data: materials.rows
        }
    }

    async getOneMaterial(req, next) {
        const { id } = req.params

        const material = await pool.query(`
            SELECT m.id, m.lesson_id, m.title, m.file,
                   l.title as lesson_title
            FROM lesson_materials m
            JOIN lessons l ON m.lesson_id = l.id
            WHERE m.id = $1
        `, [id])

        if (!material.rows.length) {
            return next(new NotFoundError(404, "Material topilmadi"))
        }

        return {
            status: 200,
            data: material.rows[0]
        }
    }

    async createMaterial(req, next) {
        const { lesson_id, title } = req.body
        const file = req.file ? req.file.filename : null

        const lesson = await pool.query("SELECT id FROM lessons WHERE id = $1", [lesson_id])
        if (!lesson.rows.length) {
            return next(new NotFoundError(404, "Dars topilmadi"))
        }

        const newMaterial = await pool.query(
            "INSERT INTO lesson_materials(lesson_id, title, file) VALUES($1, $2, $3) RETURNING *",
            [lesson_id, title, file]
        )

        return {
            status: 201,
            message: "Material qo'shildi",
            data: newMaterial.rows[0]
        }
    }

    async updateMaterial(req, next) {
        const { id } = req.params
        const { title } = req.body

        const existMaterial = await pool.query("SELECT id, file FROM lesson_materials WHERE id = $1", [id])
        if (!existMaterial.rows.length) {
            return next(new NotFoundError(404, "Material topilmadi"))
        }

        const file = req.file ? req.file.filename : existMaterial.rows[0].file

        await pool.query(
            "UPDATE lesson_materials SET title = $1, file = $2 WHERE id = $3",
            [title, file, id]
        )

        return {
            status: 200,
            message: "Material yangilandi"
        }
    }

    async deleteMaterial(req, next) {
        const { id } = req.params

        const existMaterial = await pool.query("SELECT id FROM lesson_materials WHERE id = $1", [id])
        if (!existMaterial.rows.length) {
            return next(new NotFoundError(404, "Material topilmadi"))
        }

        await pool.query("DELETE FROM lesson_materials WHERE id = $1", [id])

        return {
            status: 200,
            message: "Material o'chirildi"
        }
    }
}

export default new MaterialService()
