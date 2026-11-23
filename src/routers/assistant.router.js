import express from "express"
import assistantController from "../controllers/assistant.controller.js"
import { validate } from "../middlewares/validate.middleware.js"
import { createAssistantValidation, updateAssistantValidation } from "../validations/assistant.validation.js"
import { authGuard } from "../guards/auth.guard.js"
import { allAdminGuard } from "../guards/allAdmin.guard.js"

const assistantRouter = express.Router()

assistantRouter
    .get("/assistants", assistantController.getAllAssistants)
    .get("/assistants/:id", assistantController.getOneAssistant)
    .post("/assistants", validate(createAssistantValidation), assistantController.createAssistant)
    .put("/assistants/:id", authGuard, allAdminGuard, validate(updateAssistantValidation), assistantController.updateAssistant)
    .delete("/assistants/:id", authGuard, allAdminGuard, assistantController.deleteAssistant)

export default assistantRouter
