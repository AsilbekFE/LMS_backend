import Joi from "joi"

export const createTeacherValidation = Joi.object({
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

    experience: Joi.string().max(100).optional().allow(""),
    profession: Joi.string().max(150).optional().allow(""),
    website: Joi.string().max(255).optional().allow(""),
    bio: Joi.string().optional().allow(""),

    facebook: Joi.string().max(255).optional().allow(""),
    telegram: Joi.string().max(255).optional().allow(""),
    linkedin: Joi.string().max(255).optional().allow(""),
    instagram: Joi.string().max(255).optional().allow(""),
    github: Joi.string().max(255).optional().allow("")
})

export const updateTeacherValidation = Joi.object({
    fullname: Joi.string().min(3).max(50).optional(),
    phone: Joi.string().pattern(/^\+998[0-9]{9}$/).optional().messages({
        "string.pattern.base": "phone +998901234567 formatida bo'lishi kerak"
    }),
    experience: Joi.string().max(100).optional().allow(""),
    profession: Joi.string().max(150).optional().allow(""),
    website: Joi.string().max(255).optional().allow(""),
    bio: Joi.string().optional().allow(""),
    facebook: Joi.string().max(255).optional().allow(""),
    telegram: Joi.string().max(255).optional().allow(""),
    linkedin: Joi.string().max(255).optional().allow(""),
    instagram: Joi.string().max(255).optional().allow(""),
    github: Joi.string().max(255).optional().allow("")
})
