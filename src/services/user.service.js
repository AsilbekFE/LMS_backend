import pool from "../config/db.js"
import argon from "argon2"
import { NotFoundError, ConflictError } from "../utils/error.utils.js"

class UserServices {
    async getAllUsers() {
        const users = await pool.query(`
            SELECT u.id, u.fullname, u.phone, u.photo, r.name as role_name, u.roles_id, u.status, u.created_at 
            FROM users u 
            LEFT JOIN roles r ON u.roles_id = r.id
            ORDER BY u.id ASC
        `)

        return {
            status: 200,
            data: users.rows
        }
    }

    async getOneUser(req, next) {
        const { id } = req.params

        const user = await pool.query(`
            SELECT u.id, u.fullname, u.phone, u.photo, r.name as role_name, u.roles_id, u.status, u.created_at 
            FROM users u 
            LEFT JOIN roles r ON u.roles_id = r.id
            WHERE u.id = $1
        `, [id])

        if (!user.rows.length) {
            return next(new NotFoundError(404, "user not found"))
        }

        return {
            status: 200,
            data: user.rows[0]
        }
    }

    async createUser(req, next) {
        const { fullname, phone, password, role_id } = req.body

        const exsistUser = await pool.query("select * from users where phone=$1", [phone])

        if (exsistUser.rows.length) {
            return next(new ConflictError(409, "user already exsist"))
        }

        const existRole = await pool.query("select * from roles where id=$1", [role_id])

        if (!existRole.rows.length) {
            return next(new NotFoundError(404, "rol not found with this id"))
        }

        const hashPassword = await argon.hash(password)

        await pool.query(
            `insert into users(fullname,phone,password,roles_id) values($1,$2,$3,$4)`,
            [fullname, phone, hashPassword, role_id]
        )

        return {
            status: 201,
            message: "user created"
        }
    }

    async updateUser(req, next) {
        const { id } = req.params
        const { fullname, phone } = req.body

        const existUser = await pool.query("select * from users where id=$1", [id])

        if (!existUser.rows.length) {
            return next(new NotFoundError(404, "user not found"))
        }

        await pool.query("update users set fullname=$1, phone=$2 where id=$3", [fullname, phone, id])

        return {
            status: 200,
            message: "user updated"
        }
    }

    async deleteUser(req, next) {
        const { id } = req.params

        const existUser = await pool.query("select * from users where id=$1", [id])
        if (!existUser.rows.length) {
            return next(new NotFoundError(404, "user not found"))
        }

        await pool.query("delete from users where id=$1", [id])
        return {
            status: 200,
            message: "user deleted"
        }
    }
}

const userServices = new UserServices()
export default userServices
