import studentDashboardService from "../services/student-dashboard.service.js"

class StudentDashboardController {
    async getMyCourses(req, res, next) {
        try {
            const result = await studentDashboardService.getMyCourses(req, next)
            if (result) res.status(result.status).json(result)
        } catch (err) {
            next(err)
        }
    }

    async getCourseCurriculum(req, res, next) {
        try {
            const result = await studentDashboardService.getCourseCurriculum(req, next)
            if (result) res.status(result.status).json(result)
        } catch (err) {
            next(err)
        }
    }

    async completeLesson(req, res, next) {
        try {
            const result = await studentDashboardService.completeLesson(req, next)
            if (result) res.status(result.status).json(result)
        } catch (err) {
            next(err)
        }
    }

    async getLessonQA(req, res, next) {
        try {
            const result = await studentDashboardService.getLessonQA(req, next)
            if (result) res.status(result.status).json(result)
        } catch (err) {
            next(err)
        }
    }

    async askQuestion(req, res, next) {
        try {
            const result = await studentDashboardService.askQuestion(req, next)
            if (result) res.status(result.status).json(result)
        } catch (err) {
            next(err)
        }
    }

    async getLessonMaterials(req, res, next) {
        try {
            const result = await studentDashboardService.getLessonMaterials(req, next)
            if (result) res.status(result.status).json(result)
        } catch (err) {
            next(err)
        }
    }

    async submitAssignment(req, res, next) {
        try {
            const result = await studentDashboardService.submitAssignment(req, next)
            if (result) res.status(result.status).json(result)
        } catch (err) {
            next(err)
        }
    }

    async getSectionExam(req, res, next) {
        try {
            const result = await studentDashboardService.getSectionExam(req, next)
            if (result) res.status(result.status).json(result)
        } catch (err) {
            next(err)
        }
    }

    async submitExam(req, res, next) {
        try {
            const result = await studentDashboardService.submitExam(req, next)
            if (result) res.status(result.status).json(result)
        } catch (err) {
            next(err)
        }
    }
}

export default new StudentDashboardController()
