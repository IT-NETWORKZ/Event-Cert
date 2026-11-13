import Joi from "joi";

export const PROMO_TYPES = ["Single", "Multiple"];

const MIN_CODE_LENGTH = 3;
const MAX_CODE_LENGTH = 20;
const MIN_DISCOUNT = 1;
const MAX_DISCOUNT = 100;

const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/; // value of <input type="date">

// Required text field styled to match plansSchema error style
const text = (label, min, max, pattern = null, patternMessage = null) => {
  let schema = Joi.string().trim().min(min).max(max).required();

  if (pattern) {
    schema = schema.pattern(pattern);
  }

  return schema.messages({
    "string.base": `${label} is required.`,
    "string.empty": `${label} is required.`,
    "any.required": `${label} is required.`,
    "string.min": `${label} must be at least ${min} characters.`,
    "string.max": `${label} must be at most ${max} characters.`,
    "string.pattern.base": patternMessage || `${label} is invalid.`,
  });
};

// Required date field
const dateField = (label) =>
  Joi.string().trim().pattern(DATE_PATTERN).required().messages({
    "string.base": `${label} is required.`,
    "string.empty": `${label} is required.`,
    "string.pattern.base": `${label} must be a valid date.`,
    "any.required": `${label} is required.`,
  });

export const promoCodeSchema = Joi.object({
  promoCode: text(
    "Promo code",
    MIN_CODE_LENGTH,
    MAX_CODE_LENGTH,
    /^[A-Za-z0-9_-]+$/,
    "Promo code can only contain letters, numbers, hyphen (-) and underscore (_)."
  ),

  promoType: Joi.string()
    .valid(...PROMO_TYPES)
    .required()
    .messages({
      "any.only": "Please select a valid type.",
      "string.empty": "Type is required.",
      "any.required": "Type is required.",
    }),

  discount: Joi.number().min(MIN_DISCOUNT).max(MAX_DISCOUNT).required().messages({
    "number.base": "Discount is required.",
    "number.min": `Discount must be at least ${MIN_DISCOUNT}%.`,
    "number.max": `Discount cannot be more than ${MAX_DISCOUNT}%.`,
    "any.required": "Discount is required.",
  }),

  allPlans: Joi.boolean().required(),

  // "All Plans" -> planIds can stay empty, otherwise at least one plan is needed
  planIds: Joi.array()
    .items(Joi.any())
    .when("allPlans", {
      is: false,
      then: Joi.array().min(1).required().messages({
        "array.min": "Please select a plan.",
        "array.base": "Please select a plan.",
        "any.required": "Please select a plan.",
      }),
    }),

  validityStart: dateField("Start date"),

  expireDate: dateField("Expire date").custom((value, helpers) => {
    const start = helpers.state.ancestors[0].validityStart;
    if (start && value < start) {
      return helpers.message("Expire date cannot be before the start date.");
    }
    return value;
  }),
}).unknown(true);

/**
 * Validates the promo code form.
 * Returns { value, errors }
 *  - errors = {} when valid, otherwise { fieldName: "message" }
 *  - value  = cleaned data
 */
export const validatePromoCode = (data) => {
  const { value, error } = promoCodeSchema.validate(data, {
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