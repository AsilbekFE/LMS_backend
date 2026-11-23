import assistantService from "../services/assistant.service.js"

class AssistantController {
    async getAllAssistants(req, res, next) {
        let resData = await assistantService.getAllAssistants(req, next)
        if (resData) return res.status(resData.status).json(resData)
    }

    async getOneAssistant(req, res, next) {
        let resData = await assistantService.getOneAssistant(req, next)
        if (resData) return res.status(resData.status).json(resData)
    }

    async createAssistant(req, res, next) {
        let resData = await assistantService.createAssistant(req, next)
        if (resData) return res.status(resData.status).json(resData)
    }

    async updateAssistant(req, res, next) {
        let resData = await assistantService.updateAssistant(req, next)
        if (resData) return res.status(resData.status).json(resData)
    }

    async deleteAssistant(req, res, next) {
        let resData = await assistantService.deleteAssistant(req, next)
        if (resData) return res.status(resData.status).json(resData)
    }
}

const assistantController = new AssistantController()
export default assistantController
