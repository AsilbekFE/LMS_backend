import Joi from "joi"

export const createUserValidation = Joi.object({
    fullname: Joi.string().min(3).max(50).required().messages({
        "string.empty": "fullname bo'sh bo'lishi mumkin emas",
        "string.min": "fullname kamida 3 ta belgidan iborat bo'lishi kerak",
        "any.required": "fullname kiritilishi shart"
    }),
    phone: Joi.string().pattern(/^\+998[0-9]{9}$/).required().messages({
        "string.pattern.base": "phone +998901234567 formatida bo'lishi kerak",
        "any.required": "phone kiritilishi shart"
    }),
    password: Joi.string().min(6).max(30).required().messages({
        "string.min": "password kamida 6 ta belgidan iborat bo'lishi kerak",
        "any.required": "password kiritilishi shart"
    }),
    role_id: Joi.number().integer().positive().required().messages({
        "number.base": "role_id raqam bo'lishi kerak",
        "any.required": "role_id kiritilishi shart"
    })
})

export const updateUserValidation = Joi.object({
    fullname: Joi.string().min(3).max(50).optional(),
    phone: Joi.string().pattern(/^\+998[0-9]{9}$/).optional().messages({
        "string.pattern.base": "phone +998901234567 formatida bo'lishi kerak"
    })
})
