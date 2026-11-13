

import React, { useEffect, useState } from "react";

import "../../cpanel/Addplans/Addplans.css";

import { validatePlan } from "../../../validations/superadmin/planSchemas";

import {
  createPlans,
  updatePlan,
  getPlanById,
} from "../../../api/authService";

// Plan types
const PLAN_TYPES = [
  "Creatives",
  "Event",
  "Event + Creatives",
  "Download",
];

// Backend category mapping
const categoryMapping = {
  Event: 1,
  Creatives: 2,
  "Event + Creatives": 3,
  Download: 4,
};

const categoryReverseMapping = {
  1: "Event",
  2: "Creatives",
  3: "Event + Creatives",
  4: "Download",
};

// Empty form
const emptyPlanData = {
  planType: "Creatives",
  durationNum: "",
  durationUnit: "Month/s",
  certificateQuantity: "",
  eventQuantity: "0",
  downloadQuantity: "0",
  price: "",
  title: "",
  instructionsPerfectFor: "",
  heading2: "",
  instructionsIncludes: "",
};

// Plan type conditions
const usesCertificates = (type) =>
  type === "Creatives" || type === "Event + Creatives";

const usesEvents = (type) =>
  type === "Event" || type === "Event + Creatives";

const usesDownloads = (type) =>
  type === "Download";

// Calculate duration days
const calculateDurationDays = (num, unit) => {
  const n = Number(num) || 1;

  if (unit.startsWith("Week")) return n * 7;
  if (unit.startsWith("Month")) return n * 30;
  if (unit.startsWith("Year")) return n * 365;

  return n * 30;
};

// Convert HTML instructions into textarea lines
const htmlToLines = (html) => {
  if (!html) return "";

  const doc = new DOMParser().parseFromString(
    String(html),
    "text/html"
  );

  const items = [...doc.querySelectorAll("li")]
    .map((li) => li.textContent.trim())
    .filter(Boolean);

  if (items.length) {
    return items.join("\n");
  }

  return doc.body.textContent
    .replace(/\s+/g, " ")
    .trim();
};

// Escape HTML
const escapeHtml = (value) =>
  String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

// Convert textarea lines into HTML
const linesToHtml = (text) => {
  const lines = String(text || "")
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);

  return lines.length
    ? `<ul>${lines
        .map((line) => `<li>${escapeHtml(line)}</li>`)
        .join("")}</ul>`
    : "";
};

// Map backend data to form
const mapPlanToForm = (plan) => {
  const category = Number(plan.planCategory);

  return {
    planType:
      categoryReverseMapping[category] || "Creatives",

    durationNum: String(plan.durationValue ?? ""),

    durationUnit: plan.durationUnit
      ? `${String(plan.durationUnit).replace(/\/s$/i, "")}/s`
      : "Month/s",

    certificateQuantity: String(plan.quantity ?? 0),

    eventQuantity: String(plan.eventQuantity ?? 0),

    downloadQuantity: String(plan.downloadQuantity ?? 0),

    price: String(plan.price ?? ""),

    title: plan.heading1 || "",

    instructionsPerfectFor: htmlToLines(plan.content1),

    heading2: plan.heading2 || "",

    instructionsIncludes: htmlToLines(plan.content2),
  };
};

// Extract plan from API response
const extractPlan = (response) => {
  return (
    response?.data?.data ||
    response?.data ||
    response?.result ||
    response
  );
};

// Field error
const FieldError = ({ message }) =>
  message ? (
    <div className="text-danger small mt-1" role="alert">
      {message}
    </div>
  ) : null;

const Addplans = ({ plan, onSave }) => {
  const [formData, setFormData] = useState({
    ...emptyPlanData,
  });

  const [errors, setErrors] = useState({});

  const [loadingPlan, setLoadingPlan] = useState(false);

  const [submitting, setSubmitting] = useState(false);

  const [serverError, setServerError] = useState("");

  const [successMessage, setSuccessMessage] = useState("");

  const [selectedPlanData, setSelectedPlanData] = useState(null);

  // Selected plan ID
  const planId = plan?.planId ?? plan?.id ?? null;

  const isEditMode =
    planId !== null &&
    planId !== undefined &&
    planId !== "";

  // Fetch plan by ID when editing
  useEffect(() => {
    let active = true;

    const fetchSelectedPlan = async () => {
      setErrors({});
      setServerError("");
      setSuccessMessage("");
      setSelectedPlanData(null);

      if (!isEditMode) {
        setFormData({ ...emptyPlanData });
        return;
      }

      try {
        setLoadingPlan(true);

        console.log("Fetching Plan ID:", planId);

        const response = await getPlanById(planId);

        console.log("GET Plan Response:", response);

        const planData = extractPlan(response);

        if (!planData?.planId) {
          throw new Error("Plan details not found.");
        }

        if (active) {
          setSelectedPlanData(planData);
          setFormData(mapPlanToForm(planData));
        }
      } catch (error) {
        console.error("Fetch Plan Error:", error);

        if (active) {
          setServerError(
            error?.response?.data?.message ||
              error?.message ||
              "Unable to fetch plan details."
          );
        }
      } finally {
        if (active) {
          setLoadingPlan(false);
        }
      }
    };

    fetchSelectedPlan();

    return () => {
      active = false;
    };
  }, [planId, isEditMode]);

  // Handle form changes
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => {
      const next = {
        ...prev,
        [name]: value,
      };

      if (name === "planType") {
        if (!usesCertificates(value)) {
          next.certificateQuantity = "0";
        } else if (!usesCertificates(prev.planType)) {
          next.certificateQuantity = "";
        }

        if (!usesEvents(value)) {
          next.eventQuantity = "0";
        } else if (!usesEvents(prev.planType)) {
          next.eventQuantity = "";
        }

        if (!usesDownloads(value)) {
          next.downloadQuantity = "0";
        } else if (!usesDownloads(prev.planType)) {
          next.downloadQuantity = "";
        }
      }

      return next;
    });

    setErrors((prev) => {
      const next = { ...prev };

      delete next[name];

      if (name === "planType") {
        delete next.certificateQuantity;
        delete next.eventQuantity;
        delete next.downloadQuantity;
      }

      return next;
    });

    setServerError("");
    setSuccessMessage("");
  };

  // Submit form: POST or PUT
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (submitting || loadingPlan) return;

    setServerError("");
    setSuccessMessage("");

    // 1. Joi validation
    const validation = validatePlan(formData);

    console.log("Form Data:", formData);
    console.log("Joi Validation:", validation);

    if (Object.keys(validation.errors).length > 0) {
      setErrors(validation.errors);
      return;
    }

    // Use Joi-converted values
    const value = validation.value;

    setErrors({});

    // 2. Prepare API payload
    const durationUnit = value.durationUnit.replace(
      /\/s$/i,
      ""
    );

    const payload = {
      planName:
        selectedPlanData?.planName || value.title,

      planCategory: categoryMapping[value.planType],

      durationValue: Number(value.durationNum),

      durationUnit,

      durationDays: calculateDurationDays(
        value.durationNum,
        value.durationUnit
      ),

      price: Number(value.price),

      currency: selectedPlanData?.currency || "INR",

      taxPercentage:
        selectedPlanData?.taxPercentage ?? 18,

      quantity: Number(value.certificateQuantity || 0),

      eventQuantity: Number(value.eventQuantity || 0),

      downloadQuantity: Number(value.downloadQuantity || 0),

      heading1: value.title.trim(),

      content1: linesToHtml(
        value.instructionsPerfectFor
      ),

      heading2: value.heading2.trim(),

      content2: linesToHtml(
        value.instructionsIncludes
      ),

      isPopular: selectedPlanData?.isPopular ?? false,

      displayOrder:
        selectedPlanData?.displayOrder ?? 1,

      isActive: selectedPlanData?.isActive ?? true,
    };

    console.log("Final API Payload:", payload);

    try {
      setSubmitting(true);

      let response;

      if (isEditMode) {
        // PUT: Update existing plan
        console.log("Updating Plan ID:", planId);

        response = await updatePlan(planId, payload);
      } else {
        // POST: Create new plan
        console.log("Creating New Plan");

        response = await createPlans(payload);
      }

      console.log("Plan API Response:", response);

      if (response?.success === false) {
        throw new Error(
          response.message || "Unable to save plan."
        );
      }

      const savedPlan = extractPlan(response);

      if (!savedPlan?.planId) {
        throw new Error(
          "Plan ID is missing in the API response."
        );
      }

      setSelectedPlanData(savedPlan);

      setSuccessMessage(
        response?.message ||
          (isEditMode
            ? "Subscription plan updated successfully."
            : "Subscription plan created successfully.")
      );

      // Send actual API response to parent
      if (typeof onSave === "function") {
        onSave(response);
      }

    } catch (error) {
      console.error("Plan Submit Error:", error);

      console.error(
        "Backend Error Response:",
        error?.response?.data
      );

      const backendError = error?.response?.data;

      setServerError(
        backendError?.message ||
          backendError?.title ||
          error?.message ||
          "Something went wrong. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  // Plan type conditions
  const certOn = usesCertificates(formData.planType);

  const eventOn = usesEvents(formData.planType);

  const downloadOn = usesDownloads(formData.planType);

  const inputClass = (name) =>
    `form-control form-control-sm custom-input-sm ${
      errors[name] ? "is-invalid" : ""
    }`;

  const textareaClass = (name) =>
    `form-control form-control-sm custom-input-sm text-area-compact ${
      errors[name] ? "is-invalid" : ""
    }`;

  return (
    <div className="plan-form-card-compact">

      {/* Heading */}
      <div className="text-center mb-4">
        <h4 className="form-main-title position-relative d-inline-block pb-1">
          {isEditMode ? "Edit Plan" : "Add Plans"}
        </h4>
      </div>

      {/* Server Error */}
      {serverError && (
        <div
          className="alert alert-danger py-2 small"
          role="alert"
        >
          {serverError}
        </div>
      )}

      {/* Success */}
      {successMessage && (
        <div
          className="alert alert-success py-2 small"
          role="alert"
        >
          {successMessage}
        </div>
      )}

      {/* Loading */}
      {loadingPlan ? (
        <div className="text-center py-5">
          <div
            className="spinner-border text-primary"
            role="status"
          />
          <p className="mt-2">Loading plan details...</p>
        </div>
      ) : (
        <form
          onSubmit={handleSubmit}
          className="event-form-compact"
          noValidate
        >

          {/* Plan Type */}
          <div className="form-group-compact mb-3">
            <label className="compact-label">
              Plan Type <span className="required">*</span>
            </label>

            <div className="segmented-pill-control">
              {PLAN_TYPES.map((type) => (
                <label
                  key={type}
                  className={`pill-item ${
                    formData.planType === type ? "active" : ""
                  }`}
                >
                  <input
                    type="radio"
                    name="planType"
                    value={type}
                    checked={formData.planType === type}
                    onChange={handleChange}
                  />

                  <span>{type}</span>
                </label>
              ))}
            </div>

            <FieldError message={errors.planType} />
          </div>

          {/* Duration */}
          <div className="row g-3 mb-3">

            <div className="col-md-6">
              <label className="compact-label">
                Duration (Value) <span className="required">*</span>
              </label>

              <input
                type="number"
                min="1"
                name="durationNum"
                className={inputClass("durationNum")}
                placeholder="e.g. 12"
                value={formData.durationNum}
                onChange={handleChange}
              />

              <FieldError message={errors.durationNum} />
            </div>

            <div className="col-md-6">
              <label className="compact-label">
                Duration Unit <span className="required">*</span>
              </label>

              <div className="segmented-pill-control p-1">
                {["Week/s", "Month/s", "Year/s"].map((unit) => (
                  <label
                    key={unit}
                    className={`pill-item py-1 ${
                      formData.durationUnit === unit ? "active" : ""
                    }`}
                  >
                    <input
                      type="radio"
                      name="durationUnit"
                      value={unit}
                      checked={formData.durationUnit === unit}
                      onChange={handleChange}
                    />

                    <span>{unit}</span>
                  </label>
                ))}
              </div>

              <FieldError message={errors.durationUnit} />
            </div>

          </div>

          {/* Quantities */}
          <div className="row g-3 mb-3">

            <div className="col-md-4">
              <label className="compact-label">
                Certificate Quantity <span className="required">*</span>
              </label>

              <input
                type="number"
                min="0"
                name="certificateQuantity"
                className={inputClass("certificateQuantity")}
                placeholder="Limit qty"
                value={formData.certificateQuantity}
                onChange={handleChange}
                disabled={!certOn}
                style={!certOn ? { opacity: 0.55 } : undefined}
              />

              <FieldError message={errors.certificateQuantity} />
            </div>

            <div className="col-md-4">
              <label className="compact-label">
                Event Quantity <span className="required">*</span>
              </label>

              <input
                type="number"
                min="0"
                name="eventQuantity"
                className={inputClass("eventQuantity")}
                placeholder="Limit qty"
                value={formData.eventQuantity}
                onChange={handleChange}
                disabled={!eventOn}
                style={!eventOn ? { opacity: 0.55 } : undefined}
              />

              <FieldError message={errors.eventQuantity} />
            </div>

            <div className="col-md-4">
              <label className="compact-label">
                Download Quantity <span className="required">*</span>
              </label>

              <input
                type="number"
                min="0"
                name="downloadQuantity"
                className={inputClass("downloadQuantity")}
                placeholder="Limit qty"
                value={formData.downloadQuantity}
                onChange={handleChange}
                disabled={!downloadOn}
                style={!downloadOn ? { opacity: 0.55 } : undefined}
              />

              <FieldError message={errors.downloadQuantity} />
            </div>

          </div>

          {/* Price and Title */}
          <div className="row g-3 mb-3">

            <div className="col-md-6">
              <label className="compact-label">
                Price (₹) <span className="required">*</span>
              </label>

              <input
                type="number"
                min="0"
                name="price"
                className={inputClass("price")}
                placeholder="₹ Amount"
                value={formData.price}
                onChange={handleChange}
              />

              <FieldError message={errors.price} />
            </div>

            <div className="col-md-6">
              <label className="compact-label">
                Title (Perfect for) <span className="required">*</span>
              </label>

              <input
                type="text"
                name="title"
                className={inputClass("title")}
                placeholder="e.g. Who should choose this?"
                value={formData.title}
                onChange={handleChange}
              />

              <FieldError message={errors.title} />
            </div>

          </div>

          {/* Heading 2 */}
          <div className="form-group-compact mb-3">
            <label className="compact-label">
              Heading 2 (Includes) <span className="required">*</span>
            </label>

            <input
              type="text"
              name="heading2"
              className={inputClass("heading2")}
              placeholder="e.g. What you can achieve"
              value={formData.heading2}
              onChange={handleChange}
            />

            <FieldError message={errors.heading2} />
          </div>

          {/* Instructions */}
          <div className="row g-3 mb-4">

            <div className="col-md-6">
              <label className="compact-label">
                Instructions (Perfect for) <span className="required">*</span>
              </label>

              <textarea
                name="instructionsPerfectFor"
                className={textareaClass("instructionsPerfectFor")}
                rows="4"
                placeholder="One point per line..."
                value={formData.instructionsPerfectFor}
                onChange={handleChange}
              />

              <FieldError message={errors.instructionsPerfectFor} />
            </div>

            <div className="col-md-6">
              <label className="compact-label">
                Instructions (Includes) <span className="required">*</span>
              </label>

              <textarea
                name="instructionsIncludes"
                className={textareaClass("instructionsIncludes")}
                rows="4"
                placeholder="One point per line..."
                value={formData.instructionsIncludes}
                onChange={handleChange}
              />

              <FieldError message={errors.instructionsIncludes} />
            </div>

          </div>

          {/* Submit */}
          <div className="d-flex justify-content-center">
            <button
              type="submit"
              className="btn btn-creative-submit px-5 py-2 fw-semibold"
              disabled={submitting || loadingPlan}
            >
              {submitting
                ? "Processing..."
                : isEditMode
                ? "Update Plan"
                : "Submit Plan"}
            </button>
          </div>

        </form>
      )}

    </div>
  );
};

export default Addplans;




