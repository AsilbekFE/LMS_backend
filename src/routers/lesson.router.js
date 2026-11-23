import express from "express"
import lessonController from "../controllers/lesson.controller.js"
import { authGuard } from "../guards/auth.guard.js"
import { roleGuard } from "../guards/role.guard.js"
import { uploadVideo } from "../middlewares/upload.middleware.js"

const lessonRouter = express.Router()

lessonRouter
    .get("/lessons", lessonController.getAllLessons)
    .get("/lessons/:id", lessonController.getOneLesson)
    .post("/lessons", authGuard, roleGuard("admin", "teacher"), uploadVideo.single("video"), lessonController.createLesson)
    .put("/lessons/:id", authGuard, roleGuard("admin", "teacher"), uploadVideo.single("video"), lessonController.updateLesson)
    .delete("/lessons/:id", authGuard, roleGuard("admin", "teacher"), lessonController.deleteLesson)

export default lessonRouter
