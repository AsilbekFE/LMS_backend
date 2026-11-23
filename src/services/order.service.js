import pool from "../config/db.js"
import { NotFoundError } from "../utils/error.utils.js"

class OrderService {
    async getAllOrders() {
        const orders = await pool.query(`
            SELECT o.id, o.direction, o.price, o.payment_type, o.status, o.created_at,
                   u.id as student_id, u.fullname as student_name, u.phone as student_phone,
                   c.id as course_id, c.name as course_name
            FROM orders o
            JOIN users u ON o.student_id = u.id
            JOIN courses c ON o.course_id = c.id
            ORDER BY o.id DESC
        `)

        return {
            status: 200,
            data: orders.rows
        }
    }

    async getOneOrder(req, next) {
        const { id } = req.params

        const order = await pool.query(`
            SELECT o.id, o.direction, o.price, o.payment_type, o.status, o.created_at,
                   u.id as student_id, u.fullname as student_name, u.phone as student_phone,
                   c.id as course_id, c.name as course_name
            FROM orders o
            JOIN users u ON o.student_id = u.id
            JOIN courses c ON o.course_id = c.id
            WHERE o.id = $1
        `, [id])

        if (!order.rows.length) {
            return next(new NotFoundError(404, "Order not found"))
        }

        return {
            status: 200,
            data: order.rows[0]
        }
    }

    async createOrder(req, next) {
        const { student_id, course_id, direction, price, payment_type, status } = req.body

        const existStudent = await pool.query("SELECT id FROM users WHERE id=$1", [student_id])
        if (!existStudent.rows.length) {
            return next(new NotFoundError(404, "Student not found with this student_id"))
        }

        const existCourse = await pool.query("SELECT id FROM courses WHERE id=$1", [course_id])
        if (!existCourse.rows.length) {
            return next(new NotFoundError(404, "Course not found with this course_id"))
        }

        const newOrder = await pool.query(`
            INSERT INTO orders(student_id, course_id, direction, price, payment_type, status)
            VALUES($1, $2, $3, $4, $5, $6)
            RETURNING *
        `, [student_id, course_id, direction || null, price, payment_type, status || 'pending'])

        return {
            status: 201,
            message: "Order created successfully",
            data: newOrder.rows[0]
        }
    }
}

const orderService = new OrderService()
export default orderService
