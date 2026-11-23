import adminService from "../services/admin.service.js"

class AdminController {
    async getAllAdmins(req, res, next) {
        let resData = await adminService.getAllAdmins(req, next)
        if (resData) return res.status(resData.status).json(resData)
    }

    async getOneAdmin(req, res, next) {
        let resData = await adminService.getOneAdmin(req, next)
        if (resData) return res.status(resData.status).json(resData)
    }

    async createAdmin(req, res, next) {
        let resData = await adminService.createAdmin(req, next)
        if (resData) return res.status(resData.status).json(resData)
    }

    async updateAdmin(req, res, next) {
        let resData = await adminService.updateAdmin(req, next)
        if (resData) return res.status(resData.status).json(resData)
    }

    async deleteAdmin(req, res, next) {
        let resData = await adminService.deleteAdmin(req, next)
        if (resData) return res.status(resData.status).json(resData)
    }
}

const adminController = new AdminController()
export default adminController
