import Joi from "joi"

export const registerValidation = Joi.object({
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
    })
})

export const loginValidation = Joi.object({
    phone: Joi.string().pattern(/^\+998[0-9]{9}$/).required().messages({
        "string.pattern.base": "phone +998901234567 formatida bo'lishi kerak",
        "any.required": "phone kiritilishi shart"
    }),
    password: Joi.string().min(6).max(30).required().messages({
        "string.min": "password kamida 6 ta belgidan iborat bo'lishi kerak",
        "any.required": "password kiritilishi shart"
    })
})

export const refreshTokenValidation = Joi.object({
    refreshToken: Joi.string().required().messages({
        "any.required": "refreshToken kiritilishi shart"
    })
})
