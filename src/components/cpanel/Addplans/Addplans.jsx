import React, { useState } from "react";
import "../../cpanel/Addplans/Addplans.css";

const emptyPlanData = {
  planType: "Certificate", // Certificate, Event, Event + Certificate
  durationNum: "",
  durationUnit: "Month/s", // Week/s, Month/s, Year/s
  certificateQuantity: "",
  eventQuantity: "",
  price: "",
  title: "",
  instructionsPerfectFor: "",
  heading2: "",
  instructionsIncludes: ""
};

const Addplans = ({ onAddPlan }) => {
  const [formData, setFormData] = useState(emptyPlanData);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Construct the structured plan object
    const newPlan = {
      id: Date.now(),
      planType: formData.planType,
      durationNum: formData.durationNum,
      durationUnit: formData.durationUnit,
      certificateQuantity: formData.certificateQuantity || "0",
      eventQuantity: formData.eventQuantity || "0",
      price: formData.price || "0",
      title: formData.title,
      status: "Active"
    };

    // Pass the new plan up to CAddplans parent container
    if (onAddPlan) {
      onAddPlan(newPlan);
    }

    alert("Plan Added Successfully!");
    setFormData(emptyPlanData); // Reset form card
  };

  return (
    <div className="plan-form-card-compact">
      <div className="text-center mb-4">
        <h4 className="form-main-title position-relative d-inline-block pb-1">
          Add Plans
        </h4>
      </div>

      <form onSubmit={handleSubmit} className="event-form-compact">
        
        {/* Plan Type - Segmented Pill Selector */}
        <div className="form-group-compact mb-3">
          <label className="compact-label">Plan Type <span className="required">*</span></label>
          <div className="segmented-pill-control">
            <label className={`pill-item ${formData.planType === "Certificate" ? "active" : ""}`}>
              <input
                type="radio"
                name="planType"
                value="Certificate"
                checked={formData.planType === "Certificate"}
                onChange={handleChange}
              />
              <span>Certificate</span>
            </label>
            <label className={`pill-item ${formData.planType === "Event" ? "active" : ""}`}>
              <input
                type="radio"
                name="planType"
                value="Event"
                checked={formData.planType === "Event"}
                onChange={handleChange}
              />
              <span>Event</span>
            </label>
            <label className={`pill-item ${formData.planType === "Event + Certificate" ? "active" : ""}`}>
              <input
                type="radio"
                name="planType"
                value="Event + Certificate"
                checked={formData.planType === "Event + Certificate"}
                onChange={handleChange}
              />
              <span>Event + Cert</span>
            </label>
          </div>
        </div>

        {/* Grid Row 1: Duration value & Duration Unit Side-by-Side */}
        <div className="row g-3 mb-3">
          <div className="col-md-6">
            <label className="compact-label">Duration (Value) <span className="required">*</span></label>
            <input
              type="number"
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
              <label className={`pill-item py-1 ${formData.durationUnit === "Week/s" ? "active" : ""}`}>
                <input
                  type="radio"
                  name="durationUnit"
                  value="Week/s"
                  checked={formData.durationUnit === "Week/s"}
                  onChange={handleChange}
                />
                <span>Week/s</span>
              </label>
              <label className={`pill-item py-1 ${formData.durationUnit === "Month/s" ? "active" : ""}`}>
                <input
                  type="radio"
                  name="durationUnit"
                  value="Month/s"
                  checked={formData.durationUnit === "Month/s"}
                  onChange={handleChange}
                />
                <span>Month/s</span>
              </label>
              <label className={`pill-item py-1 ${formData.durationUnit === "Year/s" ? "active" : ""}`}>
                <input
                  type="radio"
                  name="durationUnit"
                  value="Year/s"
                  checked={formData.durationUnit === "Year/s"}
                  onChange={handleChange}
                />
                <span>Year/s</span>
              </label>
            </div>
          </div>
        </div>

        {/* Grid Row 2: Quantities Side-by-Side */}
        <div className="row g-3 mb-3">
          <div className="col-md-6">
            <label className="compact-label">Certificate Quantity <span className="required">*</span></label>
            <input
              type="number"
              name="certificateQuantity"
              className="form-control form-control-sm custom-input-sm"
              placeholder="Limit qty"
              value={formData.certificateQuantity}
              onChange={handleChange}
              required
            />
          </div>
          <div className="col-md-6">
            <label className="compact-label">Event Quantity <span className="required">*</span></label>
            <input
              type="number"
              name="eventQuantity"
              className="form-control form-control-sm custom-input-sm"
              placeholder="Limit qty"
              value={formData.eventQuantity}
              onChange={handleChange}
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
              placeholder="e.g. Starter Pack"
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
            placeholder="e.g. Perks & features"
            value={formData.heading2}
            onChange={handleChange}
            required
          />
        </div>

        {/* Grid Row 5: Textareas Side-by-Side */}
        <div className="row g-3 mb-4">
          <div className="col-md-6">
            <label className="compact-label">Instructions (Perfect for) <span className="required">*</span></label>
            <textarea
              name="instructionsPerfectFor"
              className="form-control form-control-sm custom-input-sm text-area-compact"
              rows="2"
              placeholder="What user segment is this for..."
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
              rows="2"
              placeholder="What exactly does it offer..."
              value={formData.instructionsIncludes}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        {/* Centered Submit Button */}
        <div className="d-flex justify-content-center">
          <button type="submit" className="btn btn-creative-submit px-5 py-2 fw-semibold">
            Submit Plan
          </button>
        </div>
      </form>
    </div>
  );
};

export default Addplans;