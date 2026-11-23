import userServices from "../services/user.service.js"

class UserController {
    async getAllUsers(req, res, next) {
        let resData = await userServices.getAllUsers(req, next)
        if (resData) return res.status(resData.status).json(resData)
    }

    async getOneUser(req, res, next) {
        let resData = await userServices.getOneUser(req, next)
        if (resData) return res.status(resData.status).json(resData)
    }

    async createUsers(req, res, next) {
        let resData = await userServices.createUser(req, next)
        if (resData) return res.status(resData.status).json(resData)
    }

    async updateUser(req, res, next) {
        let resData = await userServices.updateUser(req, next)
        if (resData) return res.status(resData.status).json(resData)
    }

    async deleteUser(req, res, next) {
        let resData = await userServices.deleteUser(req, next)
        if (resData) return res.status(resData.status).json(resData)
    }
}

const userController = new UserController()
export default userController
