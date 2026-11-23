import express from "express"
import teacherController from "../controllers/teacher.controller.js"
import { validate } from "../middlewares/validate.middleware.js"
import { createTeacherValidation, updateTeacherValidation } from "../validations/teacher.validation.js"
import { authGuard } from "../guards/auth.guard.js"
import { allAdminGuard } from "../guards/allAdmin.guard.js"

const teacherRouter = express.Router()

teacherRouter
    .get("/teachers", teacherController.getAllTeachers)
    .get("/teachers/:id", teacherController.getOneTeacher)
    .post("/teachers", validate(createTeacherValidation), teacherController.createTeacher)
    .put("/teachers/:id", authGuard, allAdminGuard, validate(updateTeacherValidation), teacherController.updateTeacher)
    .delete("/teachers/:id", authGuard, allAdminGuard, teacherController.deleteTeacher)

export default teacherRouter
