import Joi from "joi"

export const createOrderValidation = Joi.object({
    student_id: Joi.number().integer().positive().required().messages({
        "number.base": "student_id raqam bo'lishi kerak",
        "any.required": "Sotib oluvchi (student_id) tanlanishi shart"
    }),
    course_id: Joi.number().integer().positive().required().messages({
        "number.base": "course_id raqam bo'lishi kerak",
        "any.required": "Kurs (course_id) tanlanishi shart"
    }),
    direction: Joi.string().max(255).optional().allow(""),
    price: Joi.number().min(0).required().messages({
        "number.base": "Kurs narxi son bo'lishi kerak",
        "any.required": "Kurs narxi kiritilishi shart"
    }),
    payment_type: Joi.string().max(50).required().messages({
        "string.empty": "To'lov turi bo'sh bo'lishi mumkin emas",
        "any.required": "To'lov turi tanlanishi shart"
    }),
    status: Joi.string().max(50).optional().default("pending")
})
