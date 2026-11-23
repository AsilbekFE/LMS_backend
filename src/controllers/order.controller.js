import orderService from "../services/order.service.js"

class OrderController {
    async getAllOrders(req, res, next) {
        let resData = await orderService.getAllOrders(req, next)
        if (resData) return res.status(resData.status).json(resData)
    }

    async getOneOrder(req, res, next) {
        let resData = await orderService.getOneOrder(req, next)
        if (resData) return res.status(resData.status).json(resData)
    }

    async createOrder(req, res, next) {
        let resData = await orderService.createOrder(req, next)
        if (resData) return res.status(resData.status).json(resData)
    }
}

const orderController = new OrderController()
export default orderController
