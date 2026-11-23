import express from "express"
import courseController from "../controllers/course.controller.js"
import { validate } from "../middlewares/validate.middleware.js"
import { createCourseValidation, updateCourseValidation } from "../validations/course.validation.js"
import { authGuard } from "../guards/auth.guard.js"
import { roleGuard } from "../guards/role.guard.js"

const courseRouter = express.Router()

courseRouter
    .get("/courses", courseController.getAllCourses)
    .get("/courses/:id", courseController.getOneCourse)
    .post("/courses", authGuard, roleGuard("admin", "teacher", "assistant"), validate(createCourseValidation), courseController.createCourse)
    .put("/courses/:id", authGuard, roleGuard("admin", "teacher", "assistant"), validate(updateCourseValidation), courseController.updateCourse)
    .delete("/courses/:id", authGuard, roleGuard("admin"), courseController.deleteCourse)

export default courseRouter
