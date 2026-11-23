import express from "express"
import roleController from "../controllers/roles.controllers.js"
import { validate } from "../middlewares/validate.middleware.js"
import { createRoleValidation, updateRoleValidation } from "../validations/roles.validation.js"

const router = express.Router()

router
    .get("/roles/all", roleController.getAllRoles)
    .post("/roles", validate(createRoleValidation), roleController.createRole)
    .put("/roles/:id", validate(updateRoleValidation), roleController.updateRole)
    .delete("/roles/:id", roleController.deleteRole)

export default router
