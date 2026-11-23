import sectionService from "../services/section.service.js"

class SectionController {
    async getAllSections(req, res, next) {
        try {
            const result = await sectionService.getAllSections(req, next)
            if (result) res.status(result.status).json(result)
        } catch (err) {
            next(err)
        }
    }

    async getOneSection(req, res, next) {
        try {
            const result = await sectionService.getOneSection(req, next)
            if (result) res.status(result.status).json(result)
        } catch (err) {
            next(err)
        }
    }

    async createSection(req, res, next) {
        try {
            const result = await sectionService.createSection(req, next)
            if (result) res.status(result.status).json(result)
        } catch (err) {
            next(err)
        }
    }

    async updateSection(req, res, next) {
        try {
            const result = await sectionService.updateSection(req, next)
            if (result) res.status(result.status).json(result)
        } catch (err) {
            next(err)
        }
    }

    async deleteSection(req, res, next) {
        try {
            const result = await sectionService.deleteSection(req, next)
            if (result) res.status(result.status).json(result)
        } catch (err) {
            next(err)
        }
    }
}

export default new SectionController()
