import express from "express"
import questionController from "../controllers/question.controller.js"
import { authGuard } from "../guards/auth.guard.js"
import { roleGuard } from "../guards/role.guard.js"

const questionRouter = express.Router()

questionRouter
    .get("/questions", questionController.getAllQuestions)
    .get("/questions/:id", questionController.getOneQuestion)
    .post("/questions", authGuard, roleGuard("admin", "teacher"), questionController.createQuestion)
    .put("/questions/:id", authGuard, roleGuard("admin", "teacher"), questionController.updateQuestion)
    .delete("/questions/:id", authGuard, roleGuard("admin", "teacher"), questionController.deleteQuestion)

export default questionRouter
