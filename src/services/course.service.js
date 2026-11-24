import pool from "../config/db.js"
import { NotFoundError, BadRwquestError } from "../utils/error.utils.js"

class CourseService {
    async getAllCourses() {
        const courses = await pool.query("SELECT * FROM courses ORDER BY id ASC")
        return {
            status: 200,
            data: courses.rows
        }
    }

    async getOneCourse(req, next) {
        const { id } = req.params

        if (isNaN(id)) {
            return next(new BadRwquestError(400, "Kurs ID raqam bo'lishi kerak"))
        }

        const course = await pool.query("SELECT * FROM courses WHERE id=$1", [id])

        if (!course.rows.length) {
            return next(new NotFoundError(404, "Course not found"))
        }

        return {
            status: 200,
            data: course.rows[0]
        }
    }

    async createCourse(req) {
        const { name, direction, price, status } = req.body

        const newCourse = await pool.query(`
            INSERT INTO courses(name, direction, price, status)
            VALUES($1, $2, $3, $4)
            RETURNING *
        `, [name, direction || null, price, status || 'active'])

        return {
            status: 201,
            message: "Course created successfully",
            data: newCourse.rows[0]
        }
    }

    async updateCourse(req, next) {
        const { id } = req.params
        const { name, direction, price, status } = req.body

        if (isNaN(id)) {
            return next(new BadRwquestError(400, "Kurs ID raqam bo'lishi kerak"))
        }

        const existCourse = await pool.query("SELECT id FROM courses WHERE id=$1", [id])
        if (!existCourse.rows.length) {
            return next(new NotFoundError(404, "Course not found"))
        }

        await pool.query(`
            UPDATE courses SET 
                name = COALESCE($1, name),
                direction = COALESCE($2, direction),
                price = COALESCE($3, price),
                status = COALESCE($4, status)
            WHERE id = $5
        `, [name || null, direction || null, price || null, status || null, id])

        return {
            status: 200,
            message: "Course updated successfully"
        }
    }

    async deleteCourse(req, next) {
        const { id } = req.params

        if (isNaN(id)) {
            return next(new BadRwquestError(400, "Kurs ID raqam bo'lishi kerak"))
        }

        const existCourse = await pool.query("SELECT id FROM courses WHERE id=$1", [id])
        if (!existCourse.rows.length) {
            return next(new NotFoundError(404, "Course not found"))
        }

        await pool.query("DELETE FROM courses WHERE id=$1", [id])

        return {
            status: 200,
            message: "Course deleted successfully"
        }
    }
}

const courseService = new CourseService()
export default courseService
