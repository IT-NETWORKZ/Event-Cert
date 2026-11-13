
import Joi from "joi";

export const PLAN_TYPES = [
  "Creatives",
  "Event",
  "Event + Creatives",
  "Download",
];

export const DURATION_UNITS = [
  "Week/s",
  "Month/s",
  "Year/s",
];

// Simple required text validation
const requiredText = (label) =>
  Joi.string().trim().required().messages({
    "string.empty": `${label} is required.`,
    "any.required": `${label} is required.`,
    "string.base": `${label} is required.`,
  });

// Simple required number validation
const requiredNumber = (label) =>
  Joi.number().required().messages({
    "number.base": `${label} is required.`,
    "any.required": `${label} is required.`,
  });

export const planSchema = Joi.object({
  planType: Joi.string()
    .valid(...PLAN_TYPES)
    .required()
    .messages({
      "any.only": "Please select a valid plan type.",
      "any.required": "Plan type is required.",
    }),

  durationNum: requiredNumber("Duration"),

  durationUnit: Joi.string()
    .valid(...DURATION_UNITS)
    .required()
    .messages({
      "any.only": "Please select a valid duration unit.",
      "any.required": "Duration unit is required.",
    }),

  certificateQuantity: requiredNumber("Certificate quantity"),

  eventQuantity: requiredNumber("Event quantity"),

  downloadQuantity: requiredNumber("Download quantity"),

  price: requiredNumber("Price"),

  title: requiredText("Title"),

  heading2: requiredText("Heading 2"),

  instructionsPerfectFor: requiredText(
    "Instructions (Perfect for)"
  ),

  instructionsIncludes: requiredText(
    "Instructions (Includes)"
  ),

}).unknown(true);

// Validate form
export const validatePlan = (data) => {
  const { value, error } = planSchema.validate(data, {
    abortEarly: false,
    convert: true,
  });

  if (!error) {
    return {
      value,
      errors: {},
    };
  }

  const errors = {};

  error.details.forEach((detail) => {
    const key = detail.path[0];

    if (!errors[key]) {
      errors[key] = detail.message;
    }
  });

  return {
    value: null,
    errors,
  };
};
