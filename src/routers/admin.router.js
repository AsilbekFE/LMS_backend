import express from "express"
import adminController from "../controllers/admin.controller.js"
import { validate } from "../middlewares/validate.middleware.js"
import { createAdminValidation, updateAdminValidation } from "../validations/admin.validation.js"
import { authGuard } from "../guards/auth.guard.js"
import { roleGuard } from "../guards/role.guard.js"

const adminRouter = express.Router()

adminRouter
    .get("/admins", authGuard, roleGuard("admin"), adminController.getAllAdmins)
    .get("/admins/:id", authGuard, roleGuard("admin"), adminController.getOneAdmin)
    .post("/admins", authGuard, roleGuard("admin"), validate(createAdminValidation), adminController.createAdmin)
    .put("/admins/:id", authGuard, roleGuard("admin"), validate(updateAdminValidation), adminController.updateAdmin)
    .delete("/admins/:id", authGuard, roleGuard("admin"), adminController.deleteAdmin)

export default adminRouter
