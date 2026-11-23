import pool from "../config/db.js"
import argon from "argon2"
import { NotFoundError, ConflictError } from "../utils/error.utils.js"

class TeacherService {
    async getAllTeachers() {
        const teachers = await pool.query(`
            SELECT u.id, u.fullname, u.phone, u.photo, r.name as role_name, u.roles_id, u.status, u.created_at,
                    u.experience, u.profession, u.website, u.bio,
                    u.facebook, u.telegram, u.linkedin, u.instagram, u.github
            FROM users u 
            JOIN roles r ON u.roles_id = r.id 
            WHERE LOWER(r.name) IN ('teacher', 'techer')
            ORDER BY u.id ASC
        `)

        return {
            status: 200,
            data: teachers.rows
        }
    }

    async getOneTeacher(req, next) {
        const { id } = req.params

        const teacher = await pool.query(`
            SELECT u.id, u.fullname, u.phone, u.photo, r.name as role_name, u.roles_id, u.status, u.created_at,
                    u.experience, u.profession, u.website, u.bio,
                    u.facebook, u.telegram, u.linkedin, u.instagram, u.github
            FROM users u 
            JOIN roles r ON u.roles_id = r.id 
            WHERE u.id = $1 AND LOWER(r.name) IN ('teacher', 'techer')
        `, [id])

        if (!teacher.rows.length) {
            return next(new NotFoundError(404, "Teacher not found"))
        }

        return {
            status: 200,
            data: teacher.rows[0]
        }
    }

    async createTeacher(req, next) {
        const {
            fullname, phone, password,
            experience, profession, website, bio,
            facebook, telegram, linkedin, instagram, github
        } = req.body

        const existUser = await pool.query("SELECT * FROM users WHERE phone=$1", [phone])
        if (existUser.rows.length) {
            return next(new ConflictError(409, "Teacher already exists with this phone"))
        }

        const roleRes = await pool.query("SELECT id FROM roles WHERE LOWER(name) IN ('teacher', 'techer')")
        if (!roleRes.rows.length) {
            return next(new NotFoundError(404, "Teacher role not found in database"))
        }
        const roleId = roleRes.rows[0].id

        const hashPassword = await argon.hash(password)

        await pool.query(`
            INSERT INTO users(
                fullname, phone, password, roles_id,
                experience, profession, website, bio,
                facebook, telegram, linkedin, instagram, github
            ) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
        `, [
            fullname, phone, hashPassword, roleId,
            experience || null, profession || null, website || null, bio || null,
            facebook || null, telegram || null, linkedin || null, instagram || null, github || null
        ])

        return {
            status: 201,
            message: "Teacher created successfully"
        }
    }

    async updateTeacher(req, next) {
        const { id } = req.params
        const {
            fullname, phone,
            experience, profession, website, bio,
            facebook, telegram, linkedin, instagram, github
        } = req.body

        const existTeacher = await pool.query(`
            SELECT u.id FROM users u 
            JOIN roles r ON u.roles_id = r.id 
            WHERE u.id = $1 AND LOWER(r.name) IN ('teacher', 'techer')
        `, [id])

        if (!existTeacher.rows.length) {
            return next(new NotFoundError(404, "Teacher not found"))
        }

        await pool.query(`
            UPDATE users SET 
                fullname = COALESCE($1, fullname),
                phone = COALESCE($2, phone),
                experience = COALESCE($3, experience),
                profession = COALESCE($4, profession),
                website = COALESCE($5, website),
                bio = COALESCE($6, bio),
                facebook = COALESCE($7, facebook),
                telegram = COALESCE($8, telegram),
                linkedin = COALESCE($9, linkedin),
                instagram = COALESCE($10, instagram),
                github = COALESCE($11, github)
            WHERE id = $12
        `, [
            fullname || null, phone || null,
            experience || null, profession || null, website || null, bio || null,
            facebook || null, telegram || null, linkedin || null, instagram || null, github || null,
            id
        ])

        return {
            status: 200,
            message: "Teacher updated successfully"
        }
    }

    async deleteTeacher(req, next) {
        const { id } = req.params

        const existTeacher = await pool.query(`
            SELECT u.id FROM users u 
            JOIN roles r ON u.roles_id = r.id 
            WHERE u.id = $1 AND LOWER(r.name) IN ('teacher', 'techer')
        `, [id])

        if (!existTeacher.rows.length) {
            return next(new NotFoundError(404, "Teacher not found"))
        }

        await pool.query("DELETE FROM users WHERE id=$1", [id])

        return {
            status: 200,
            message: "Teacher deleted successfully"
        }
    }
}

const teacherService = new TeacherService()
export default teacherService
