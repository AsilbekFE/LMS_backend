import pool from "../config/db.js"
import { NotFoundError, BadRwquestError } from "../utils/error.utils.js"

class StudentDashboardService {
    async getMyCourses(req) {
        const studentId = req.user.id

        const courses = await pool.query(`
            SELECT c.id, c.name, c.direction, u.fullname as mentor_name, u.photo as mentor_photo
            FROM orders o
            JOIN courses c ON o.course_id = c.id
            LEFT JOIN users u ON u.course_id = c.id AND u.roles_id = (SELECT id FROM roles WHERE name = 'teacher' LIMIT 1)
            WHERE o.student_id = $1
            ORDER BY o.id DESC
        `, [studentId])

        for (let course of courses.rows) {
            const total = await pool.query(`
                SELECT COUNT(l.id) FROM lessons l
                JOIN sections s ON l.section_id = s.id
                WHERE s.course_id = $1
            `, [course.id])

            const completed = await pool.query(`
                SELECT COUNT(lp.id) FROM lesson_progress lp
                JOIN lessons l ON lp.lesson_id = l.id
                JOIN sections s ON l.section_id = s.id
                WHERE s.course_id = $1 AND lp.student_id = $2
            `, [course.id, studentId])

            const totalLessons = parseInt(total.rows[0].count) || 0
            const doneLessons = parseInt(completed.rows[0].count) || 0
            course.progress = totalLessons > 0 ? Math.round((doneLessons / totalLessons) * 100) : 0
        }

        return {
            status: 200,
            data: courses.rows
        }
    }

    async getCourseCurriculum(req) {
        const studentId = req.user.id
        const { id: courseId } = req.params

        const sections = await pool.query(`SELECT * FROM sections WHERE course_id = $1 ORDER BY id ASC`, [courseId])

        for (let sec of sections.rows) {
            const lessons = await pool.query(`
                SELECT l.id, l.title, l.description, l.video,
                       CASE WHEN lp.id IS NOT NULL THEN true ELSE false END as is_completed
                FROM lessons l
                LEFT JOIN lesson_progress lp ON l.id = lp.lesson_id AND lp.student_id = $2
                WHERE l.section_id = $1
                ORDER BY l.id ASC
            `, [sec.id, studentId])
            sec.lessons = lessons.rows
        }

        return {
            status: 200,
            data: sections.rows
        }
    }

    async completeLesson(req) {
        const studentId = req.user.id
        const { id: lessonId } = req.params

        await pool.query(`
            INSERT INTO lesson_progress(student_id, lesson_id)
            VALUES($1, $2)
            ON CONFLICT (student_id, lesson_id) DO NOTHING
        `, [studentId, lessonId])

        return {
            status: 200,
            message: "Dars yakunlandi"
        }
    }

    async getLessonQA(req) {
        const { id: lessonId } = req.params

        const qa = await pool.query(`
            SELECT q.id, q.question, q.created_at, u.fullname as student_name, u.photo as student_photo
            FROM lesson_qa q
            JOIN users u ON q.student_id = u.id
            WHERE q.lesson_id = $1
            ORDER BY q.id DESC
        `, [lessonId])

        return {
            status: 200,
            data: qa.rows
        }
    }

    async askQuestion(req) {
        const studentId = req.user.id
        const { id: lessonId } = req.params
        const { question } = req.body

        const res = await pool.query(`
            INSERT INTO lesson_qa(student_id, lesson_id, question)
            VALUES($1, $2, $3)
            RETURNING *
        `, [studentId, lessonId, question])

        return {
            status: 201,
            message: "Savol yuborildi",
            data: res.rows[0]
        }
    }

    async getLessonMaterials(req) {
        const { id: lessonId } = req.params

        const materials = await pool.query(`
            SELECT id, title, file FROM lesson_materials WHERE lesson_id = $1 ORDER BY id ASC
        `, [lessonId])

        return {
            status: 200,
            data: materials.rows
        }
    }

    async submitAssignment(req, next) {
        const studentId = req.user.id
        const { id: lessonId } = req.params
        const file = req.file ? req.file.filename : null

        if (!file) {
            return next(new BadRwquestError(400, "Vazifa fayli yuklanishi shart"))
        }

        const lesson = await pool.query("SELECT id FROM lessons WHERE id = $1", [lessonId])
        if (!lesson.rows.length) {
            return next(new NotFoundError(404, "Dars topilmadi"))
        }

        const res = await pool.query(`
            INSERT INTO student_assignments(student_id, lesson_id, file, status)
            VALUES($1, $2, $3, 'pending')
            RETURNING *
        `, [studentId, lessonId, file])

        return {
            status: 201,
            message: "Vazifa topshirildi",
            data: res.rows[0]
        }
    }

    async getSectionExam(req) {
        const studentId = req.user.id
        const { id: sectionId } = req.params

        const total = await pool.query(`SELECT COUNT(id) FROM lessons WHERE section_id = $1`, [sectionId])
        const completed = await pool.query(`
            SELECT COUNT(lp.id) FROM lesson_progress lp
            JOIN lessons l ON lp.lesson_id = l.id
            WHERE l.section_id = $1 AND lp.student_id = $2
        `, [sectionId, studentId])

        const totalLessons = parseInt(total.rows[0].count) || 0
        const doneLessons = parseInt(completed.rows[0].count) || 0

        if (doneLessons < totalLessons) {
            return {
                status: 200,
                can_take_exam: false,
                message: "Siz moduldagi darslarni tugatmadingiz. Iltimos, to'liq yakunlang va imtihon savollarini topshiring"
            }
        }

        const questions = await pool.query(`
            SELECT q.id, q.question, q.option_a, q.option_b, q.option_c, q.option_d
            FROM questions q
            JOIN lessons l ON q.lesson_id = l.id
            WHERE l.section_id = $1
            ORDER BY q.id ASC
        `, [sectionId])

        return {
            status: 200,
            can_take_exam: true,
            total_questions: questions.rows.length,
            questions: questions.rows
        }
    }

    async submitExam(req) {
        const studentId = req.user.id
        const { id: sectionId } = req.params
        const { answers } = req.body

        let correct = 0
        if (Array.isArray(answers)) {
            for (let item of answers) {
                const q = await pool.query("SELECT correct_option FROM questions WHERE id = $1", [item.question_id])
                if (q.rows.length && q.rows[0].correct_option === item.answer.toUpperCase()) {
                    correct++
                }
            }
        }

        const total = Array.isArray(answers) ? answers.length : 0
        const score = total > 0 ? Math.round((correct / total) * 100) : 0

        await pool.query(`
            INSERT INTO exam_results(student_id, section_id, total_questions, correct_answers, score)
            VALUES($1, $2, $3, $4, $5)
        `, [studentId, sectionId, total, correct, score])

        return {
            status: 200,
            message: "Imtihon yakunlandi",
            data: {
                total_questions: total,
                correct_answers: correct,
                score
            }
        }
    }
}

export default new StudentDashboardService()
