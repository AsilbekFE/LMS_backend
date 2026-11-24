import homeworkService from "../services/homework.service.js"

class HomeworkController {
    async getAllHomeworks(req, res, next) {
        try {
            const result = await homeworkService.getAllHomeworks(req, next)
            if (result) res.status(result.status).json(result)
        } catch (err) {
            next(err)
        }
    }

    async getOneHomework(req, res, next) {
        try {
            const result = await homeworkService.getOneHomework(req, next)
            if (result) res.status(result.status).json(result)
        } catch (err) {
            next(err)
        }
    }

    async createHomework(req, res, next) {
        try {
            const result = await homeworkService.createHomework(req, next)
            if (result) res.status(result.status).json(result)
        } catch (err) {
            next(err)
        }
    }

    async updateHomework(req, res, next) {
        try {
            const result = await homeworkService.updateHomework(req, next)
            if (result) res.status(result.status).json(result)
        } catch (err) {
            next(err)
        }
    }

    async deleteHomework(req, res, next) {
        try {
            const result = await homeworkService.deleteHomework(req, next)
            if (result) res.status(result.status).json(result)
        } catch (err) {
            next(err)
        }
    }

    async getAllSubmissions(req, res, next) {
        try {
            const result = await homeworkService.getAllSubmissions(req, next)
            if (result) res.status(result.status).json(result)
        } catch (err) {
            next(err)
        }
    }

    async getOneSubmission(req, res, next) {
        try {
            const result = await homeworkService.getOneSubmission(req, next)
            if (result) res.status(result.status).json(result)
        } catch (err) {
            next(err)
        }
    }

    async gradeSubmission(req, res, next) {
        try {
            const result = await homeworkService.gradeSubmission(req, next)
            if (result) res.status(result.status).json(result)
        } catch (err) {
            next(err)
        }
    }

    async getStudentSubmissions(req, res, next) {
        try {
            const result = await homeworkService.getStudentSubmissions(req, next)
            if (result) res.status(result.status).json(result)
        } catch (err) {
            next(err)
        }
    }
}

export default new HomeworkController()
