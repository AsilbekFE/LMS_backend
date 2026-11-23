import express from "express"
import studentDashboardController from "../controllers/student-dashboard.controller.js"
import { authGuard } from "../guards/auth.guard.js"
import { uploadMaterial } from "../middlewares/upload.middleware.js"

const studentDashboardRouter = express.Router()

studentDashboardRouter
    .get("/student/my-courses", authGuard, studentDashboardController.getMyCourses)
    .get("/student/courses/:id/curriculum", authGuard, studentDashboardController.getCourseCurriculum)
    .post("/student/lessons/:id/complete", authGuard, studentDashboardController.completeLesson)
    .get("/student/lessons/:id/qa", authGuard, studentDashboardController.getLessonQA)
    .post("/student/lessons/:id/qa", authGuard, studentDashboardController.askQuestion)
    .get("/student/lessons/:id/materials", authGuard, studentDashboardController.getLessonMaterials)
    .post("/student/lessons/:id/assignments", authGuard, uploadMaterial.single("file"), studentDashboardController.submitAssignment)
    .get("/student/sections/:id/exam", authGuard, studentDashboardController.getSectionExam)
    .post("/student/sections/:id/exam/submit", authGuard, studentDashboardController.submitExam)

export default studentDashboardRouter
