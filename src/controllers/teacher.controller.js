import teacherService from "../services/teacher.service.js"

class TeacherController {
    async getAllTeachers(req, res, next) {
        let resData = await teacherService.getAllTeachers(req, next)
        if (resData) return res.status(resData.status).json(resData)
    }

    async getOneTeacher(req, res, next) {
        let resData = await teacherService.getOneTeacher(req, next)
        if (resData) return res.status(resData.status).json(resData)
    }

    async createTeacher(req, res, next) {
        let resData = await teacherService.createTeacher(req, next)
        if (resData) return res.status(resData.status).json(resData)
    }

    async updateTeacher(req, res, next) {
        let resData = await teacherService.updateTeacher(req, next)
        if (resData) return res.status(resData.status).json(resData)
    }

    async deleteTeacher(req, res, next) {
        let resData = await teacherService.deleteTeacher(req, next)
        if (resData) return res.status(resData.status).json(resData)
    }
}

const teacherController = new TeacherController()
export default teacherController
