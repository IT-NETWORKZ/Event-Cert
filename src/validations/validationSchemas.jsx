import Joi from "joi";

// 1. Contact Form Schema
export const contactSchema = Joi.object({
  name: Joi.string().trim().required().messages({
    "string.empty": "Please fill in all the required fields.",
    "any.required": "Please fill in all the required fields.",
  }),
  email: Joi.string()
    .email({ tlds: { allow: false } })
    .required()
    .messages({
      "string.empty": "Please fill in all the required fields.",
      "string.email": "Please enter a valid email address.",
      "any.required": "Please fill in all the required fields.",
    }),
  phone: Joi.string()
    .pattern(/^[\d+\s-]*$/)
    .required()
    .messages({
      "string.empty": "Please fill in all the required fields.",
      "string.pattern.base": "Please enter a valid phone number.",
      "any.required": "Please fill in all the required fields.",
    }),
  subject: Joi.string().allow("").optional(),
  message: Joi.string().trim().max(200).required().messages({
    "string.empty": "Please fill in all the required fields.",
    "string.max": "Message cannot exceed 200 characters.",
    "any.required": "Please fill in all the required fields.",
  }),
});

// 2. Future Login Schema (Example for later)
export const loginSchema = Joi.object({
  email: Joi.string().email({ tlds: { allow: false } }).required(),
  password: Joi.string().min(6).required(),
});