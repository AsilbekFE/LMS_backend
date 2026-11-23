import Joi from "joi"

export const createCourseValidation = Joi.object({
    name: Joi.string().min(2).max(255).required().messages({
        "string.empty": "Kurs nomi bo'sh bo'lishi mumkin emas",
        "any.required": "Kurs nomi kiritilishi shart"
    }),
    direction: Joi.string().max(255).optional().allow(""),
    price: Joi.number().min(0).required().messages({
        "number.base": "Kurs narxi son bo'lishi kerak",
        "any.required": "Kurs narxi kiritilishi shart"
    }),
    status: Joi.string().valid("active", "inactive").optional()
})

export const updateCourseValidation = Joi.object({
    name: Joi.string().min(2).max(255).optional(),
    direction: Joi.string().max(255).optional().allow(""),
    price: Joi.number().min(0).optional(),
    status: Joi.string().valid("active", "inactive").optional()
})
