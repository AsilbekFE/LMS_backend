import pool from "../config/db.js"
import { NotFoundError } from "../utils/error.utils.js"

class QuestionService {
    async getAllQuestions(req) {
        const { lesson_id } = req.query

        if (lesson_id) {
            const questions = await pool.query(`
                SELECT q.id, q.lesson_id, q.question, q.option_a, q.option_b, q.option_c, q.option_d, q.correct_option,
                       l.title as lesson_title
                FROM questions q
                LEFT JOIN lessons l ON q.lesson_id = l.id
                WHERE q.lesson_id = $1
                ORDER BY q.id ASC
            `, [lesson_id])

            return {
                status: 200,
                data: questions.rows
            }
        }

        const questions = await pool.query(`
            SELECT q.id, q.lesson_id, q.question, q.option_a, q.option_b, q.option_c, q.option_d, q.correct_option,
                   l.title as lesson_title
            FROM questions q
            LEFT JOIN lessons l ON q.lesson_id = l.id
            ORDER BY q.id ASC
        `)

        return {
            status: 200,
            data: questions.rows
        }
    }

    async getOneQuestion(req, next) {
        const { id } = req.params

        const question = await pool.query(`
            SELECT q.id, q.lesson_id, q.question, q.option_a, q.option_b, q.option_c, q.option_d, q.correct_option,
                   l.title as lesson_title
            FROM questions q
            LEFT JOIN lessons l ON q.lesson_id = l.id
            WHERE q.id = $1
        `, [id])

        if (!question.rows.length) {
            return next(new NotFoundError(404, "Savol topilmadi"))
        }

        return {
            status: 200,
            data: question.rows[0]
        }
    }

    async createQuestion(req, next) {
        const { lesson_id, question, option_a, option_b, option_c, option_d, correct_option } = req.body

        if (lesson_id) {
            const lesson = await pool.query("SELECT id FROM lessons WHERE id = $1", [lesson_id])
            if (!lesson.rows.length) {
                return next(new NotFoundError(404, "Dars topilmadi"))
            }
        }

        const newQuestion = await pool.query(`
            INSERT INTO questions(lesson_id, question, option_a, option_b, option_c, option_d, correct_option)
            VALUES($1, $2, $3, $4, $5, $6, $7)
            RETURNING *
        `, [lesson_id || null, question, option_a, option_b, option_c, option_d, correct_option.toUpperCase()])

        return {
            status: 201,
            message: "Savol qo'shildi",
            data: newQuestion.rows[0]
        }
    }

    async updateQuestion(req, next) {
        const { id } = req.params
        const { lesson_id, question, option_a, option_b, option_c, option_d, correct_option } = req.body

        const exist = await pool.query("SELECT id FROM questions WHERE id = $1", [id])
        if (!exist.rows.length) {
            return next(new NotFoundError(404, "Savol topilmadi"))
        }

        await pool.query(`
            UPDATE questions
            SET lesson_id = COALESCE($1, lesson_id),
                question = $2,
                option_a = $3,
                option_b = $4,
                option_c = $5,
                option_d = $6,
                correct_option = $7
            WHERE id = $8
        `, [lesson_id || null, question, option_a, option_b, option_c, option_d, correct_option.toUpperCase(), id])

        return {
            status: 200,
            message: "Savol yangilandi"
        }
    }

    async deleteQuestion(req, next) {
        const { id } = req.params

        const exist = await pool.query("SELECT id FROM questions WHERE id = $1", [id])
        if (!exist.rows.length) {
            return next(new NotFoundError(404, "Savol topilmadi"))
        }

        await pool.query("DELETE FROM questions WHERE id = $1", [id])

        return {
            status: 200,
            message: "Savol o'chirildi"
        }
    }
}

export default new QuestionService()
