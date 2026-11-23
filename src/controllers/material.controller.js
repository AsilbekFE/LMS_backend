import materialService from "../services/material.service.js"

class MaterialController {
    async getAllMaterials(req, res, next) {
        try {
            const result = await materialService.getAllMaterials(req, next)
            if (result) res.status(result.status).json(result)
        } catch (err) {
            next(err)
        }
    }

    async getOneMaterial(req, res, next) {
        try {
            const result = await materialService.getOneMaterial(req, next)
            if (result) res.status(result.status).json(result)
        } catch (err) {
            next(err)
        }
    }

    async createMaterial(req, res, next) {
        try {
            const result = await materialService.createMaterial(req, next)
            if (result) res.status(result.status).json(result)
        } catch (err) {
            next(err)
        }
    }

    async updateMaterial(req, res, next) {
        try {
            const result = await materialService.updateMaterial(req, next)
            if (result) res.status(result.status).json(result)
        } catch (err) {
            next(err)
        }
    }

    async deleteMaterial(req, res, next) {
        try {
            const result = await materialService.deleteMaterial(req, next)
            if (result) res.status(result.status).json(result)
        } catch (err) {
            next(err)
        }
    }
}

export default new MaterialController()
