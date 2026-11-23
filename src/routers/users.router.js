import express from "express"
import userController from "../controllers/users.controller.js"
import { validate } from "../middlewares/validate.middleware.js"
import { createUserValidation, updateUserValidation } from "../validations/users.validation.js"
import { authGuard } from "../guards/auth.guard.js"
import { allAdminGuard } from "../guards/allAdmin.guard.js"

const router = express.Router()

router
    .get("/users", userController.getAllUsers)
    .get("/users/:id", userController.getOneUser)
    .post("/users", validate(createUserValidation), userController.createUsers)
    .put("/users/:id", authGuard, allAdminGuard, validate(updateUserValidation), userController.updateUser)
    .delete("/users/:id", authGuard, allAdminGuard, userController.deleteUser)

export default router
