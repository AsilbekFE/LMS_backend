import express from "express"
import materialController from "../controllers/material.controller.js"
import { authGuard } from "../guards/auth.guard.js"
import { roleGuard } from "../guards/role.guard.js"
import { uploadMaterial } from "../middlewares/upload.middleware.js"

const materialRouter = express.Router()

materialRouter
    .get("/materials", materialController.getAllMaterials)
    .get("/materials/:id", materialController.getOneMaterial)
    .post("/materials", authGuard, roleGuard("admin", "teacher"), uploadMaterial.single("file"), materialController.createMaterial)
    .put("/materials/:id", authGuard, roleGuard("admin", "teacher"), uploadMaterial.single("file"), materialController.updateMaterial)
    .delete("/materials/:id", authGuard, roleGuard("admin", "teacher"), materialController.deleteMaterial)

export default materialRouter
