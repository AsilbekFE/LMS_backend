import express from "express"
import sectionController from "../controllers/section.controller.js"
import { authGuard } from "../guards/auth.guard.js"
import { roleGuard } from "../guards/role.guard.js"

const sectionRouter = express.Router()

sectionRouter
    .get("/sections", sectionController.getAllSections)
    .get("/sections/:id", sectionController.getOneSection)
    .post("/sections", authGuard, roleGuard("admin", "teacher"), sectionController.createSection)
    .put("/sections/:id", authGuard, roleGuard("admin", "teacher"), sectionController.updateSection)
    .delete("/sections/:id", authGuard, roleGuard("admin", "teacher"), sectionController.deleteSection)

export default sectionRouter
