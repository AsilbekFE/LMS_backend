import express from "express"
import authController from "../controllers/auth.controller.js"
import { validate } from "../middlewares/validate.middleware.js"
import { loginValidation, refreshTokenValidation, registerValidation } from "../validations/auth.validation.js"

const authRouter = express.Router()

authRouter
    .post("/auth/register", validate(registerValidation), authController.register)
    .post("/auth/login", validate(loginValidation), authController.login)
    .post("/auth/refresh-token", validate(refreshTokenValidation), authController.refreshToken)

export default authRouter
