import authService from "../services/auth.service.js"

class AuthController {
    async register(req, res, next) {
        let resData = await authService.register(req, next)
        if (resData) return res.status(resData.status).json(resData)
    }

    async login(req, res, next) {
        let resData = await authService.login(req, next)
        if (resData) return res.status(resData.status).json(resData)
    }

    async refreshToken(req, res, next) {
        let resData = await authService.refreshToken(req, next)
        if (resData) return res.status(resData.status).json(resData)
    }
}

const authController = new AuthController()
export default authController
