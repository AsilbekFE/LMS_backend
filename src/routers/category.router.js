import express from "express"
import categoryController from "../controllers/category.controller.js"
import { authGuard } from "../guards/auth.guard.js"
import { roleGuard } from "../guards/role.guard.js"

const categoryRouter = express.Router()

categoryRouter
    .get("/categories", categoryController.getAllCategories)
    .get("/categories/:id", categoryController.getOneCategory)
    .post("/categories", authGuard, roleGuard("admin"), categoryController.createCategory)
    .put("/categories/:id", authGuard, roleGuard("admin"), categoryController.updateCategory)
    .delete("/categories/:id", authGuard, roleGuard("admin"), categoryController.deleteCategory)

export default categoryRouter
