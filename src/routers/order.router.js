import express from "express"
import orderController from "../controllers/order.controller.js"
import { validate } from "../middlewares/validate.middleware.js"
import { createOrderValidation } from "../validations/order.validation.js"

const orderRouter = express.Router()

orderRouter
    .get("/orders", orderController.getAllOrders)
    .get("/orders/:id", orderController.getOneOrder)
    .post("/orders", validate(createOrderValidation), orderController.createOrder)

export default orderRouter
