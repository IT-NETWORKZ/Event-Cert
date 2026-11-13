import Joi from "joi";

const REQUIRED = "Please fill in all the required fields.";

// Must match the <option> values in Contact.jsx
export const CONTACT_SUBJECTS = [
  "Event setup help",
  "Certificates & templates",
  "Subscription & payment",
  "Technical issue",
  "Other",
];

// 1. Contact Form Schema
export const contactSchema = Joi.object({
  name: Joi.string().trim().min(2).max(100).required().messages({
    "string.empty": REQUIRED,
    "any.required": REQUIRED,
    "string.min": "Name must be at least 2 characters.",
    "string.max": "Name cannot exceed 100 characters.",
  }),

  email: Joi.string()
    .trim()
    .max(150)
    .email({ tlds: { allow: false } })
    .required()
    .messages({
      "string.empty": REQUIRED,
      "any.required": REQUIRED,
      "string.email": "Please enter a valid email address.",
      "string.max": "Email cannot exceed 150 characters.",
    }),

  phone: Joi.string()
    .trim()
    .pattern(/^\+?[\d\s-]+$/)
    .custom((value, helpers) => {
      const digits = value.replace(/\D/g, "");
      return digits.length >= 10 && digits.length <= 15
        ? value
        : helpers.error("string.pattern.base");
    })
    .required()
    .messages({
      "string.empty": REQUIRED,
      "any.required": REQUIRED,
      "string.pattern.base": "Please enter a valid phone number.",
    }),

  subject: Joi.string()
    .valid("", ...CONTACT_SUBJECTS)
    .optional()
    .messages({
      "any.only": "Please select a valid topic.",
    }),

  message: Joi.string().trim().max(200).required().messages({
    "string.empty": REQUIRED,
    "any.required": REQUIRED,
    "string.max": "Message cannot exceed 200 characters.",
  }),
});

// 2. Future Login Schema (Example for later)
export const loginSchema = Joi.object({
  email: Joi.string().email({ tlds: { allow: false } }).required(),
  password: Joi.string().min(6).required(),
});