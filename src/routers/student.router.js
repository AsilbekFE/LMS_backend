import express from "express"
import studentController from "../controllers/student.controller.js"
import { validate } from "../middlewares/validate.middleware.js"
import { createStudentValidation, updateStudentValidation } from "../validations/student.validation.js"
import { authGuard } from "../guards/auth.guard.js"
import { allAdminGuard } from "../guards/allAdmin.guard.js"

const studentRouter = express.Router()

studentRouter
    .get("/students", studentController.getAllStudents)
    .get("/students/:id", studentController.getOneStudent)
    .post("/students", validate(createStudentValidation), studentController.createStudent)
    .put("/students/:id", authGuard, allAdminGuard, validate(updateStudentValidation), studentController.updateStudent)
    .delete("/students/:id", authGuard, allAdminGuard, studentController.deleteStudent)

export default studentRouter
