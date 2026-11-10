import React, { useState } from "react";
import "../../cpanel/Addplans/Addplans.css";
import Button from "../../common/button/Button";

const PLAN_TYPES = ["Creatives", "Event", "Event + Creatives", "Download"];

// which quantity fields a plan type uses
const usesCertificates = (type) => type === "Creatives" || type === "Event + Creatives";
const usesEvents = (type) => type === "Event" || type === "Event + Creatives";
const usesDownloads = (type) => type === "Download";

const emptyPlanData = {
  planType: "Creatives",
  durationNum: "",
  durationUnit: "Month/s", // Week/s, Month/s, Year/s
  certificateQuantity: "",
  eventQuantity: "0",
  downloadQuantity: "0",
  price: "",
  title: "",
  instructionsPerfectFor: "",
  heading2: "",
  instructionsIncludes: ""
};

const disabledStyle = { opacity: 0.55, cursor: "not-allowed" };

// plan  = existing plan (edit mode), nothing = add mode
// onSave = called with the form data when Submit is clicked
const Addplans = ({ plan, onSave }) => {
  const [formData, setFormData] = useState(plan || emptyPlanData);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      const next = { ...prev, [name]: value };

      // plan type changed -> quantities that do not apply become 0
      if (name === "planType") {
        if (!usesCertificates(value)) next.certificateQuantity = "0";
        if (!usesEvents(value)) next.eventQuantity = "0";
        if (!usesDownloads(value)) next.downloadQuantity = "0";
      }
      return next;
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSave) onSave(formData);
  };

  const certOn = usesCertificates(formData.planType);
  const eventOn = usesEvents(formData.planType);
  const downloadOn = usesDownloads(formData.planType);

  return (
    <div className="plan-form-card-compact">
      <div className="text-center mb-4">
        <h4 className="form-main-title position-relative d-inline-block pb-1">
          {plan ? "Edit Plan" : "Add Plans"}
        </h4>
      </div>

      <form onSubmit={handleSubmit} className="event-form-compact">

        {/* Plan Type - Segmented Pill Selector */}
        <div className="form-group-compact mb-3">
          <label className="compact-label">Plan Type <span className="required">*</span></label>
          <div className="segmented-pill-control">
            {PLAN_TYPES.map((type) => (
              <label key={type} className={`pill-item ${formData.planType === type ? "active" : ""}`}>
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
        </div>

        {/* Grid Row 1: Duration value & Duration Unit Side-by-Side */}
        <div className="row g-3 mb-3">
          <div className="col-md-6">
            <label className="compact-label">Duration (Value) <span className="required">*</span></label>
            <input
              type="number"
              min="1"
              name="durationNum"
              className="form-control form-control-sm custom-input-sm"
              placeholder="e.g. 12"
              value={formData.durationNum}
              onChange={handleChange}
              required
            />
          </div>
          <div className="col-md-6">
            <label className="compact-label">Duration Unit <span className="required">*</span></label>
            <div className="segmented-pill-control p-1">
              {["Week/s", "Month/s", "Year/s"].map((unit) => (
                <label key={unit} className={`pill-item py-1 ${formData.durationUnit === unit ? "active" : ""}`}>
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
          </div>
        </div>

        {/* Grid Row 2: Quantities */}
        <div className="row g-3 mb-3">
          <div className="col-md-4">
            <label className="compact-label">Certificate Quantity <span className="required">*</span></label>
            <input
              type="number"
              min="0"
              name="certificateQuantity"
              className="form-control form-control-sm custom-input-sm"
              placeholder="Limit qty"
              value={formData.certificateQuantity}
              onChange={handleChange}
              disabled={!certOn}
              style={!certOn ? disabledStyle : undefined}
              required
            />
          </div>
          <div className="col-md-4">
            <label className="compact-label">Event Quantity <span className="required">*</span></label>
            <input
              type="number"
              min="0"
              name="eventQuantity"
              className="form-control form-control-sm custom-input-sm"
              placeholder="Limit qty"
              value={formData.eventQuantity}
              onChange={handleChange}
              disabled={!eventOn}
              style={!eventOn ? disabledStyle : undefined}
              required
            />
          </div>
          <div className="col-md-4">
            <label className="compact-label">Download Quantity <span className="required">*</span></label>
            <input
              type="number"
              min="0"
              name="downloadQuantity"
              className="form-control form-control-sm custom-input-sm"
              placeholder="Limit qty"
              value={formData.downloadQuantity}
              onChange={handleChange}
              disabled={!downloadOn}
              style={!downloadOn ? disabledStyle : undefined}
              required
            />
          </div>
        </div>

        {/* Grid Row 3: Price & Title Side-by-Side */}
        <div className="row g-3 mb-3">
          <div className="col-md-6">
            <label className="compact-label">Price (₹) <span className="required">*</span></label>
            <input
              type="number"
              min="0"
              name="price"
              className="form-control form-control-sm custom-input-sm"
              placeholder="₹ Amount"
              value={formData.price}
              onChange={handleChange}
              required
            />
          </div>
          <div className="col-md-6">
            <label className="compact-label">Title (Perfect for) <span className="required">*</span></label>
            <input
              type="text"
              name="title"
              className="form-control form-control-sm custom-input-sm"
              placeholder="e.g. Who should choose this?"
              value={formData.title}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        {/* Row 4: Heading 2 (Includes) */}
        <div className="form-group-compact mb-3">
          <label className="compact-label">Heading 2 (Includes) <span className="required">*</span></label>
          <input
            type="text"
            name="heading2"
            className="form-control form-control-sm custom-input-sm"
            placeholder="e.g. What you can achieve"
            value={formData.heading2}
            onChange={handleChange}
            required
          />
        </div>

        {/* Grid Row 5: Textareas Side-by-Side (one point per line) */}
        <div className="row g-3 mb-4">
          <div className="col-md-6">
            <label className="compact-label">Instructions (Perfect for) <span className="required">*</span></label>
            <textarea
              name="instructionsPerfectFor"
              className="form-control form-control-sm custom-input-sm text-area-compact"
              rows="4"
              placeholder="One point per line..."
              value={formData.instructionsPerfectFor}
              onChange={handleChange}
              required
            />
          </div>
          <div className="col-md-6">
            <label className="compact-label">Instructions (Includes) <span className="required">*</span></label>
            <textarea
              name="instructionsIncludes"
              className="form-control form-control-sm custom-input-sm text-area-compact"
              rows="4"
              placeholder="One point per line..."
              value={formData.instructionsIncludes}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        {/* Centered Submit Button */}
        <div className="d-flex justify-content-center">
          <Button type="submit" className="btn btn-creative-submit px-5 py-2 fw-semibold">
            {plan ? "Update Plan" : "Submit Plan"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default Addplans;