import pool from "../config/db.js"
import argon from "argon2"
import { NotFoundError, ConflictError } from "../utils/error.utils.js"

class AdminService {
    async getAllAdmins() {
        const admins = await pool.query(`
            SELECT u.id, u.fullname, u.phone, u.photo, r.name as role_name, u.roles_id, u.status, u.created_at 
            FROM users u 
            JOIN roles r ON u.roles_id = r.id 
            WHERE LOWER(r.name) = 'admin'
            ORDER BY u.id ASC
        `)

        return {
            status: 200,
            data: admins.rows
        }
    }

    async getOneAdmin(req, next) {
        const { id } = req.params

        const admin = await pool.query(`
            SELECT u.id, u.fullname, u.phone, u.photo, r.name as role_name, u.roles_id, u.status, u.created_at 
            FROM users u 
            JOIN roles r ON u.roles_id = r.id 
            WHERE u.id = $1 AND LOWER(r.name) = 'admin'
        `, [id])

        if (!admin.rows.length) {
            return next(new NotFoundError(404, "Admin not found"))
        }

        return {
            status: 200,
            data: admin.rows[0]
        }
    }

    async createAdmin(req, next) {
        const { fullname, phone, password } = req.body

        const existUser = await pool.query("SELECT * FROM users WHERE phone=$1", [phone])
        if (existUser.rows.length) {
            return next(new ConflictError(409, "Admin already exists with this phone"))
        }

        const roleRes = await pool.query("SELECT id FROM roles WHERE LOWER(name) = 'admin'")
        if (!roleRes.rows.length) {
            return next(new NotFoundError(404, "Admin role not found in database"))
        }
        const roleId = roleRes.rows[0].id

        const hashPassword = await argon.hash(password)

        await pool.query(
            "INSERT INTO users(fullname, phone, password, roles_id) VALUES($1, $2, $3, $4)",
            [fullname, phone, hashPassword, roleId]
        )

        return {
            status: 201,
            message: "Admin created successfully"
        }
    }

    async updateAdmin(req, next) {
        const { id } = req.params
        const { fullname, phone } = req.body

        const existAdmin = await pool.query(`
            SELECT u.id FROM users u 
            JOIN roles r ON u.roles_id = r.id 
            WHERE u.id = $1 AND LOWER(r.name) = 'admin'
        `, [id])

        if (!existAdmin.rows.length) {
            return next(new NotFoundError(404, "Admin not found"))
        }

        await pool.query("UPDATE users SET fullname=$1, phone=$2 WHERE id=$3", [fullname, phone, id])

        return {
            status: 200,
            message: "Admin updated successfully"
        }
    }

    async deleteAdmin(req, next) {
        const { id } = req.params

        const existAdmin = await pool.query(`
            SELECT u.id FROM users u 
            JOIN roles r ON u.roles_id = r.id 
            WHERE u.id = $1 AND LOWER(r.name) = 'admin'
        `, [id])

        if (!existAdmin.rows.length) {
            return next(new NotFoundError(404, "Admin not found"))
        }

        await pool.query("DELETE FROM users WHERE id=$1", [id])

        return {
            status: 200,
            message: "Admin deleted successfully"
        }
    }
}

const adminService = new AdminService()
export default adminService
