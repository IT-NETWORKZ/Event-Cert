import Joi from "joi";

const MAX_PARAMS = 20;

// Required text field helper matching your style
const text = (label, max) =>
  Joi.string().trim().max(max).required().messages({
    "string.base": `${label} is required.`,
    "string.empty": `${label} is required.`,
    "any.required": `${label} is required.`,
    "string.max": `${label} must be at most ${max} characters.`,
  });

export const templateSchema = Joi.object({
  templateType: Joi.string().trim().required().messages({
    "string.base": "Template type is required.",
    "string.empty": "Template type is required.",
    "any.required": "Template type is required.",
  }),

  mediaType: Joi.string().trim().required().messages({
    "string.base": "Image/Video type is required.",
    "string.empty": "Image/Video type is required.",
    "any.required": "Image/Video type is required.",
  }),

  templateName: text("Template name", 100),

  message: text("Message", 1000),

  withUserName: Joi.boolean().required(),

  noOfParameters: Joi.number()
    .integer()
    .min(0)
    .max(MAX_PARAMS)
    .required()
    .messages({
      "number.base": "No. of parameters is required.",
      "number.integer": "Only whole numbers are allowed.",
      "number.min": "Parameters cannot be negative.",
      "number.max": `Maximum ${MAX_PARAMS} parameters allowed.`,
      "any.required": "No. of parameters is required.",
    }),

  selectedAdmin: Joi.string().trim().required().messages({
    "string.base": "Admin selection is required.",
    "string.empty": "Admin selection is required.",
    "any.required": "Admin selection is required.",
  }),
}).unknown(true);

/**
 * Validates the template form.
 * Returns { value, errors }
 *  - errors = {} when valid, otherwise { fieldName: "message" }
 *  - value  = cleaned data
 */
export const validateTemplate = (data) => {
  const { value, error } = templateSchema.validate(data, {
    abortEarly: false,
    convert: true,
  });

  if (!error) return { value, errors: {} };

  const errors = {};
  error.details.forEach((detail) => {
    const key = detail.path[0];
    if (!errors[key]) errors[key] = detail.message;
  });

  return { value: null, errors };
};