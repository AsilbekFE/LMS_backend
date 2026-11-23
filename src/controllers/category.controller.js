import categoryService from "../services/category.service.js"

class CategoryController {
    async getAllCategories(req, res, next) {
        let resData = await categoryService.getAllCategories(req, next)
        if (resData) return res.status(resData.status).json(resData)
    }

    async getOneCategory(req, res, next) {
        let resData = await categoryService.getOneCategory(req, next)
        if (resData) return res.status(resData.status).json(resData)
    }

    async createCategory(req, res, next) {
        let resData = await categoryService.createCategory(req, next)
        if (resData) return res.status(resData.status).json(resData)
    }

    async updateCategory(req, res, next) {
        let resData = await categoryService.updateCategory(req, next)
        if (resData) return res.status(resData.status).json(resData)
    }

    async deleteCategory(req, res, next) {
        let resData = await categoryService.deleteCategory(req, next)
        if (resData) return res.status(resData.status).json(resData)
    }
}

const categoryController = new CategoryController()
export default categoryController
