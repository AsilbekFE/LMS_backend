import Joi from "joi"

export const createRoleValidation = Joi.object({
    name: Joi.string().min(2).max(30).required().messages({
        "string.empty": "name bo'sh bo'lishi mumkin emas",
        "string.min": "name kamida 2 ta belgidan iborat bo'lishi kerak",
        "any.required": "name kiritilishi shart"
    })
})

export const updateRoleValidation = Joi.object({
    name: Joi.string().min(2).max(30).required().messages({
        "string.empty": "name bo'sh bo'lishi mumkin emas",
        "string.min": "name kamida 2 ta belgidan iborat bo'lishi kerak",
        "any.required": "name kiritilishi shart"
    })
})
