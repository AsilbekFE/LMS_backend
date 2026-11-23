import lessonService from "../services/lesson.service.js"

class LessonController {
    async getAllLessons(req, res, next) {
        try {
            const result = await lessonService.getAllLessons(req, next)
            if (result) res.status(result.status).json(result)
        } catch (err) {
            next(err)
        }
    }

    async getOneLesson(req, res, next) {
        try {
            const result = await lessonService.getOneLesson(req, next)
            if (result) res.status(result.status).json(result)
        } catch (err) {
            next(err)
        }
    }

    async createLesson(req, res, next) {
        try {
            const result = await lessonService.createLesson(req, next)
            if (result) res.status(result.status).json(result)
        } catch (err) {
            next(err)
        }
    }

    async updateLesson(req, res, next) {
        try {
            const result = await lessonService.updateLesson(req, next)
            if (result) res.status(result.status).json(result)
        } catch (err) {
            next(err)
        }
    }

    async deleteLesson(req, res, next) {
        try {
            const result = await lessonService.deleteLesson(req, next)
            if (result) res.status(result.status).json(result)
        } catch (err) {
            next(err)
        }
    }
}

export default new LessonController()
