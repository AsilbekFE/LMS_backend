import pool from "../config/db.js"
import { NotFoundError, ConflictError } from "../utils/error.utils.js"

class CategoryService {
    async getAllCategories() {
        const categories = await pool.query("SELECT * FROM categories")
        return {
            status: 200,
            data: categories.rows
        }
    }

    async getOneCategory(req, next) {
        const { id } = req.params
        const category = await pool.query("SELECT * FROM categories WHERE id=$1", [id])

        if (!category.rows.length) {
            return next(new NotFoundError(404, "Kategoriya topilmadi"))
        }

        return {
            status: 200,
            data: category.rows[0]
        }
    }

    async createCategory(req, next) {
        const { name } = req.body

        const existCategory = await pool.query("SELECT * FROM categories WHERE name=$1", [name])
        if (existCategory.rows.length) {
            return next(new ConflictError(409, "Bunday kategoriya allaqachon bor"))
        }

        await pool.query("INSERT INTO categories(name) VALUES($1)", [name])

        return {
            status: 201,
            message: "Kategoriya yaratildi"
        }
    }

    async updateCategory(req, next) {
        const { id } = req.params
        const { name } = req.body

        const existCategory = await pool.query("SELECT * FROM categories WHERE id=$1", [id])
        if (!existCategory.rows.length) {
            return next(new NotFoundError(404, "Kategoriya topilmadi"))
        }

        await pool.query("UPDATE categories SET name=$1 WHERE id=$2", [name, id])

        return {
            status: 200,
            message: "Kategoriya yangilandi"
        }
    }

    async deleteCategory(req, next) {
        const { id } = req.params

        const existCategory = await pool.query("SELECT * FROM categories WHERE id=$1", [id])
        if (!existCategory.rows.length) {
            return next(new NotFoundError(404, "Kategoriya topilmadi"))
        }

        await pool.query("DELETE FROM categories WHERE id=$1", [id])

        return {
            status: 200,
            message: "Kategoriya ochirildi"
        }
    }
}

const categoryService = new CategoryService()
export default categoryService
