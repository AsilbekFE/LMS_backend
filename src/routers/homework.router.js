import express from "express"
import homeworkController from "../controllers/homework.controller.js"
import { authGuard } from "../guards/auth.guard.js"
import { roleGuard } from "../guards/role.guard.js"
import { uploadHomework } from "../middlewares/upload.middleware.js"

const homeworkRouter = express.Router()

homeworkRouter
    .get("/homeworks", authGuard, homeworkController.getAllHomeworks)
    .get("/homeworks/submissions", authGuard, roleGuard("admin", "teacher"), homeworkController.getAllSubmissions)
    .get("/homeworks/submissions/:id", authGuard, roleGuard("admin", "teacher"), homeworkController.getOneSubmission)
    .put("/homeworks/submissions/:id/grade", authGuard, roleGuard("admin", "teacher"), homeworkController.gradeSubmission)
    .get("/homeworks/my-submissions", authGuard, homeworkController.getStudentSubmissions)
    .get("/homeworks/:id", authGuard, homeworkController.getOneHomework)
    .post("/homeworks", authGuard, roleGuard("admin", "teacher"), uploadHomework.single("file"), homeworkController.createHomework)
    .put("/homeworks/:id", authGuard, roleGuard("admin", "teacher"), uploadHomework.single("file"), homeworkController.updateHomework)
    .delete("/homeworks/:id", authGuard, roleGuard("admin", "teacher"), homeworkController.deleteHomework)

export default homeworkRouter
