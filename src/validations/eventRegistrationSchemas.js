import Joi from "joi";

export const MIN_GROUP_SIZE = 2;
export const MAX_IMAGE_SIZE = 2 * 1024 * 1024; // 2 MB
export const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png"];
export const CATEGORIES = ["Student", "Fresher", "Working Professional"];

const ACADEMIC = ["Student", "Fresher"];
const PROFESSIONAL = ["Working Professional"];

// Required text field with a max length
const text = (label, max) =>
  Joi.string().trim().max(max).required().messages({
    "string.base": `${label} is required.`,
    "string.empty": `${label} is required.`,
    "any.required": `${label} is required.`,
    "string.max": `${label} must be at most ${max} characters.`,
  });

// Rule that only applies for some registration categories
const onlyFor = (categories, rule) =>
  Joi.when("category", {
    is: Joi.valid(...categories),
    then: rule,
    otherwise: Joi.any(),
  });

/* ---------------- one participant ---------------- */
const participantSchema = Joi.object({
  name: text("Full name", 30)
    .min(2)
    .pattern(/^[A-Za-z ]+$/)
    .messages({
      "string.min": "Full name must be at least 2 characters.",
      "string.pattern.base": "Full name can contain letters and spaces only.",
    }),

  gender: Joi.string().valid("Male", "Female").required().messages({
    "any.only": "Please select a gender.",
    "string.empty": "Please select a gender.",
    "any.required": "Please select a gender.",
  }),

  dob: Joi.date().iso().min("1900-01-01").max("now").required().messages({
    "date.base": "Please enter a valid date of birth.",
    "date.format": "Please enter a valid date of birth.",
    "date.min": "Please enter a valid date of birth.",
    "date.max": "Date of birth cannot be in the future.",
    "any.required": "Date of birth is required.",
  }),

  email: Joi.string()
    .trim()
    .max(100)
    .email({ tlds: { allow: false } })
    .required()
    .messages({
      "string.empty": "Email is required.",
      "any.required": "Email is required.",
      "string.email": "Please enter a valid email address.",
      "string.max": "Email must be at most 100 characters.",
    }),

  mobile: Joi.string()
    .trim()
    .pattern(/^[0-9]{6,20}$/)
    .required()
    .messages({
      "string.empty": "WhatsApp number is required.",
      "any.required": "WhatsApp number is required.",
      "string.pattern.base": "Enter a valid WhatsApp number (6 to 20 digits).",
    }),

  address: text("Address", 50),

  category: Joi.string()
    .valid(...CATEGORIES)
    .required()
    .messages({
      "any.only": "Please select a registration category.",
      "string.empty": "Please select a registration category.",
      "any.required": "Please select a registration category.",
    }),

  // Student / Fresher
  collegeName: onlyFor(ACADEMIC, text("College name", 150)),
  stream: onlyFor(ACADEMIC, text("Stream", 100)),
  branch: onlyFor(ACADEMIC, text("Branch", 100)),
  academicYear: onlyFor(ACADEMIC, text("This field", 50)),

  // Working Professional
  organizationName: onlyFor(PROFESSIONAL, text("Organization name", 150)),
  designation: onlyFor(PROFESSIONAL, text("Designation", 100)),
  experience: onlyFor(
    PROFESSIONAL,
    text("Experience", 50)
      .pattern(/^\d+(\.\d+)?$/)
      .messages({ "string.pattern.base": "Enter experience in years, e.g. 1.5" })
  ),
}).unknown(true);

/* ---------------- whole registration ---------------- */
export const eventRegistrationSchema = Joi.object({
  eventId: Joi.number().integer().positive().required().messages({
    "number.base": "Event not found. Please reopen this page from the event list.",
    "number.positive": "Event not found. Please reopen this page from the event list.",
    "any.required": "Event not found. Please reopen this page from the event list.",
  }),

  regType: Joi.string().valid("Individual", "Group").required().messages({
    "any.only": "Choose Individual or Group registration.",
    "string.empty": "Choose Individual or Group registration.",
    "any.required": "Choose Individual or Group registration.",
  }),

  groupName: Joi.when("regType", {
    is: "Group",
    then: text("Group name", 100),
    otherwise: Joi.any(),
  }),

  teamLead: Joi.string()
    .trim()
    .allow("")
    .max(100)
    .pattern(/^[A-Za-z ]*$/)
    .messages({
      "string.max": "Team lead name must be at most 100 characters.",
      "string.pattern.base": "Team lead name can contain letters and spaces only.",
    }),

  participants: Joi.array()
    .items(participantSchema)
    .required()
    .when("regType", {
      is: "Group",
      then: Joi.array()
        .min(MIN_GROUP_SIZE)
        .messages({
          "array.min": `A group needs at least ${MIN_GROUP_SIZE} participants. Use the + button to add more.`,
        }),
      otherwise: Joi.array()
        .length(1)
        .messages({ "array.length": "Individual registration allows only one participant." }),
    })
    .messages({
      "array.base": "Add at least one participant.",
      "any.required": "Add at least one participant.",
    }),
}).unknown(true);

/* ---------------- helpers ---------------- */

// Profile image check (File object, so done outside Joi)
export const validateProfileFile = (file) => {
  if (!file) return "";
  if (!ALLOWED_IMAGE_TYPES.includes(file.type)) return "Profile image must be a JPG or PNG file.";
  if (file.size > MAX_IMAGE_SIZE) return "Profile image must be 2 MB or smaller.";
  return "";
};

/**
 * Validates the whole form.
 * Returns { isValid, errors } where errors is a flat map:
 *   "groupName", "teamLead", "participants", "participants.0.email" ...
 */
export const validateRegistration = ({ eventId, regType, groupName, teamLead, participants }) => {
  const payload = {
    eventId,
    regType,
    groupName,
    teamLead,
    participants: participants.map((p) => ({
      name: p.name,
      gender: p.gender,
      dob: p.dob,
      email: p.email,
      mobile: p.mobile,
      address: p.address,
      category: p.category,
      collegeName: p.collegeName,
      stream: p.stream,
      branch: p.branch,
      academicYear: p.academicYear,
      organizationName: p.organizationName,
      designation: p.designation,
      experience: p.experience,
    })),
  };

  const { error } = eventRegistrationSchema.validate(payload, { abortEarly: false });

  const errors = {};
  (error ? error.details : []).forEach((d) => {
    const key = d.path.join(".");
    if (!errors[key]) errors[key] = d.message;
  });

  // Extra checks: duplicates inside the same registration + image file
  const seenEmail = {};
  const seenMobile = {};
  participants.forEach((p, i) => {
    const email = String(p.email || "").trim().toLowerCase();
    if (email) {
      if (email in seenEmail) {
        const k = `participants.${i}.email`;
        if (!errors[k]) errors[k] = "This email is already used by another participant.";
      } else seenEmail[email] = i;
    }

    const mobile = String(p.mobile || "").trim();
    if (mobile) {
      if (mobile in seenMobile) {
        const k = `participants.${i}.mobile`;
        if (!errors[k]) errors[k] = "This number is already used by another participant.";
      } else seenMobile[mobile] = i;
    }

    const imgError = validateProfileFile(p.profileFile);
    if (imgError) errors[`participants.${i}.profileFile`] = imgError;
  });

  return { isValid: Object.keys(errors).length === 0, errors };
};