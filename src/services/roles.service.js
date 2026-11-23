import pool from "../config/db.js"
import { NotFoundError, ConflictError } from "../utils/error.utils.js"

class RoleService {
    async getAllRoles() {
        let roles = await pool.query("select * from roles")

        return {
            status: 200,
            data: roles.rows
        }
    }

    async createRole(req, next) {
        const { name } = req.body

        const existRole = await pool.query("SELECT * from roles WHERE name=$1", [name])
        if (existRole.rows.length) {
            return next(new ConflictError(409, "role already exist"))
        }

        await pool.query(`insert into roles(name) values($1)`, [name])

        return {
            status: 201,
            message: "Role created"
        }
    }

    async updateRole(req, next) {
        const { id } = req.params
        const { name } = req.body

        const existRole = await pool.query("SELECT * FROM roles WHERE id=$1", [id])
        if (!existRole.rows.length) {
            return next(new NotFoundError(404, "Role not found"))
        }

        await pool.query("UPDATE roles SET name=$1 WHERE id=$2", [name, id])

        return {
            status: 200,
            message: "Role updated"
        }
    }

    async deleteRole(req, next) {
        const { id } = req.params

        const existRole = await pool.query("SELECT * FROM roles WHERE id=$1", [id])
        if (!existRole.rows.length) {
            return next(new NotFoundError(404, "Role not found"))
        }

        await pool.query("DELETE FROM roles WHERE id=$1", [id])

        return {
            status: 200,
            message: "Role deleted"
        }
    }
}

const roleService = new RoleService()
export default roleService
