import questionService from "../services/question.service.js"

class QuestionController {
    async getAllQuestions(req, res, next) {
        try {
            const result = await questionService.getAllQuestions(req, next)
            if (result) res.status(result.status).json(result)
        } catch (err) {
            next(err)
        }
    }

    async getOneQuestion(req, res, next) {
        try {
            const result = await questionService.getOneQuestion(req, next)
            if (result) res.status(result.status).json(result)
        } catch (err) {
            next(err)
        }
    }

    async createQuestion(req, res, next) {
        try {
            const result = await questionService.createQuestion(req, next)
            if (result) res.status(result.status).json(result)
        } catch (err) {
            next(err)
        }
    }

    async updateQuestion(req, res, next) {
        try {
            const result = await questionService.updateQuestion(req, next)
            if (result) res.status(result.status).json(result)
        } catch (err) {
            next(err)
        }
    }

    async deleteQuestion(req, res, next) {
        try {
            const result = await questionService.deleteQuestion(req, next)
            if (result) res.status(result.status).json(result)
        } catch (err) {
            next(err)
        }
    }
}

export default new QuestionController()
