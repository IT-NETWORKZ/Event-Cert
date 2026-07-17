import React, { useState } from "react";
import "./AddEvent.css";
import DataTable from "../../common/Table/DataTable";

const emptyFormData = {
  duration: "1 Weeks",
  mode: "",
  organizationName: "",
  eventTitle: "",
  advStartDate: "",
  advCompletionDate: "",
  eventStartDate: "",
  eventCompletionDate: "",
  setTime: "",
  venue: "",
  city: "",
  state: "",
  country: "",
  bannerImage: null,
  aboutEvent: "",
  instructions: "",
  entryFee: "",
  paymentMode: "",
  eventType: "Individual", // Individual or Group
  minTeamSize: "1",
  maxTeamSize: "1",
  showPaymentDetails: false,
  paymentMethod: "GPay",
  upiId: "",
  mobileNo: "",
  qrCode: null,
  bankHolderName: "",
  bankName: "",
  accountNo: "",
  ifscCode: "",
};

const AddEvent = () => {
  const [formData, setFormData] = useState(emptyFormData);
  const [editingId, setEditingId] = useState(null); // null = creating, otherwise editing this row's id
  const [eventsList, setEventsList] = useState([]); // rows shown in the DataTable below the form

  const durationOptions = [
    "1 Weeks", "6 Weeks", "2 Month", "3 Months", "4 Months", "6 Months", "1 Year"
  ];

  /* ==========================================================================
     DATATABLE COLUMN DEFINITIONS
     DataTable renders raw HTML via jQuery, so cell() must return a
     string/number, never JSX.
     ========================================================================== */
  const eventColumns = [
    {
      header: "Organization",
      accessorKey: "organizationName",
    },
    {
      header: "Event Title",
      accessorKey: "eventTitle",
    },
    {
      header: "Mode",
      accessorKey: "mode",
      cell: (info) => info.getValue() || "-",
    },
    {
      header: "City",
      accessorKey: "city",
    },
    {
      header: "State",
      accessorKey: "state",
    },
    {
      header: "Event Start",
      accessorKey: "eventStartDate",
    },
    {
      header: "Event End",
      accessorKey: "eventCompletionDate",
    },
    {
      header: "Entry Fee",
      accessorKey: "entryFee",
      cell: (info) => {
        const val = info.getValue();
        return `<span class="cell-align-right">₹${val && val !== "0" ? val : "Free"}</span>`;
      },
    },
    {
      header: "Status",
      accessorKey: "status",
      cell: (info) => {
        const val = info.getValue() || "Active";
        return `<span class="status-badge status-${val.toLowerCase()}">${val}</span>`;
      },
    },
    {
      header: "Action",
      id: "edit",
    },
  ];

  /* ==========================================================================
     FORM HANDLERS
     ========================================================================== */
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => {
      const updatedData = {
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      };

      if (name === "eventType" && value === "Individual") {
        updatedData.minTeamSize = "1";
        updatedData.maxTeamSize = "1";
      }

      return updatedData;
    });
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    if (files && files[0]) {
      setFormData((prev) => ({
        ...prev,
        [name]: files[0],
      }));
    }
  };

  const selectPaymentMethod = (method) => {
    setFormData((prev) => ({ ...prev, paymentMethod: method }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const eventRecord = {
      advStartDate: formData.advStartDate || "-",
      advCompletionDate: formData.advCompletionDate || "-",
      eventStartDate: formData.eventStartDate || "-",
      eventCompletionDate: formData.eventCompletionDate || "-",
      organizationName: formData.organizationName,
      eventTitle: formData.eventTitle,
      aboutEvent: formData.aboutEvent,
      setTime: formData.setTime,
      venue: formData.venue,
      city: formData.city,
      state: formData.state,
      mode: formData.mode,
      entryFee: formData.entryFee || "0",
      instructions: formData.instructions,
      status: "Active",
    };

    if (editingId !== null) {
      // Update existing row
      setEventsList((prev) =>
        prev.map((row) => (row.id === editingId ? { ...row, ...eventRecord } : row))
      );
      setEditingId(null);
    } else {
      // Create new row
      setEventsList((prev) => [{ id: Date.now(), ...eventRecord }, ...prev]);
    }

    setFormData(emptyFormData);
  };

  // Called by DataTable when the pencil icon is clicked — loads that row
  // back into the form for editing.
  const handleEditRow = (row) => {
    if (!row) return;
    setEditingId(row.id);
    setFormData((prev) => ({
      ...prev,
      advStartDate: row.advStartDate === "-" ? "" : row.advStartDate,
      advCompletionDate: row.advCompletionDate === "-" ? "" : row.advCompletionDate,
      eventStartDate: row.eventStartDate === "-" ? "" : row.eventStartDate,
      eventCompletionDate: row.eventCompletionDate === "-" ? "" : row.eventCompletionDate,
      organizationName: row.organizationName || "",
      eventTitle: row.eventTitle || "",
      aboutEvent: row.aboutEvent || "",
      setTime: row.setTime || "",
      venue: row.venue || "",
      city: row.city || "",
      state: row.state || "",
      mode: row.mode || "",
      entryFee: row.entryFee || "",
      instructions: row.instructions || "",
    }));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div>
      <div className="add-event-container">
        <h2 className="form-main-title">
          {editingId !== null ? "Edit Event" : "Add Event"}
        </h2>

        <form onSubmit={handleSubmit} className="event-form">

          {/* Instructions Block */}
          <div className="instructions-section">
            <h3>Instructions</h3>
            <ul>
              <li>Kindly use only <strong>PNG</strong> or <strong>JPG</strong> image for the banner.</li>
              <li>Image size should be maximum <strong>2MB</strong>.</li>
            </ul>
          </div>

          {/* Duration Radio Options Grid */}
          <div className="duration-grid">
            {durationOptions.map((opt) => (
              <label key={opt} className={`duration-label ${formData.duration === opt ? 'active' : ''}`}>
                <input
                  type="radio"
                  name="duration"
                  value={opt}
                  checked={formData.duration === opt}
                  onChange={handleChange}
                />
                <span>{opt}</span>
              </label>
            ))}
          </div>

          {/* 2-Column Standard Responsive Fields Grid */}
          <div className="form-fields-grid">

            <div className="form-group full-width-mobile">
              <label>Mode <span className="required">*</span></label>
              <select name="mode" value={formData.mode} onChange={handleChange} required>
                <option value="">Select Mode</option>
                <option value="Online">Online</option>
                <option value="Offline">Offline</option>
                <option value="Hybrid">Hybrid</option>
              </select>
            </div>

            <div className="form-group">
              <label>Organization Name <span className="required">*</span></label>
              <input type="text" name="organizationName" value={formData.organizationName} onChange={handleChange} required placeholder="Organization Name" />
            </div>

            <div className="form-group">
              <label>Event Title <span className="required">*</span></label>
              <input type="text" name="eventTitle" value={formData.eventTitle} onChange={handleChange} required placeholder="Event Title" />
            </div>

            <div className="form-group">
              <label>Adv. Start Date <span className="required">*</span></label>
              <input type="date" name="advStartDate" value={formData.advStartDate} onChange={handleChange} required />
            </div>

            <div className="form-group">
              <label>Adv. Completion Date <span className="required">*</span></label>
              <input type="date" name="advCompletionDate" value={formData.advCompletionDate} onChange={handleChange} required />
            </div>

            <div className="form-group">
              <label>Event Start Date <span className="required">*</span></label>
              <input type="date" name="eventStartDate" value={formData.eventStartDate} onChange={handleChange} required />
            </div>

            <div className="form-group">
              <label>Event Completion Date <span className="required">*</span></label>
              <input type="date" name="eventCompletionDate" value={formData.eventCompletionDate} onChange={handleChange} required />
            </div>

            <div className="form-group">
              <label>Set Time <span className="required">*</span></label>
              <input type="time" name="setTime" value={formData.setTime} onChange={handleChange} required />
            </div>

            <div className="form-group">
              <label>Venue <span className="required">*</span></label>
              <input type="text" name="venue" value={formData.venue} onChange={handleChange} required placeholder="Event Venue" />
            </div>

            <div className="form-group">
              <label>City <span className="required">*</span></label>
              <input type="text" name="city" value={formData.city} onChange={handleChange} required placeholder="City" />
            </div>

            <div className="form-group">
              <label>State <span className="required">*</span></label>
              <input type="text" name="state" value={formData.state} onChange={handleChange} required placeholder="State" />
            </div>

            <div className="form-group">
              <label>Country <span className="required">*</span></label>
              <input type="text" name="country" value={formData.country} onChange={handleChange} required placeholder="Country" />
            </div>

            <div className="form-group">
              <label>Upload Image <span className="required">*</span></label>
              <input type="file" name="bannerImage" accept="image/jpeg, image/png" onChange={handleFileChange} />
            </div>

            <div className="form-group">
              <label>Event Type <span className="required">*</span></label>
              <select name="eventType" value={formData.eventType} onChange={handleChange} required>
                <option value="Individual">Individual</option>
                <option value="Group">Group / Team</option>
              </select>
            </div>
          </div>

          {/* Conditional Team Sizes Setup */}
          {formData.eventType === "Group" && (
            <div className="form-fields-grid conditional-team-section">
              <div className="form-group">
                <label>Min Team Size <span className="required">*</span></label>
                <input
                  type="number"
                  name="minTeamSize"
                  min="1"
                  value={formData.minTeamSize}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Max Team Size <span className="required">*</span></label>
                <input
                  type="number"
                  name="maxTeamSize"
                  min={formData.minTeamSize || "1"}
                  value={formData.maxTeamSize}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
          )}

          {/* Text Areas Section */}
          <div className="textarea-group">
            <label>About Event <span className="required">*</span></label>
            <textarea
              name="aboutEvent"
              maxLength="300"
              value={formData.aboutEvent}
              onChange={handleChange}
              required
              placeholder="About Event"
            />
            <div className="char-counter">{formData.aboutEvent.length}/300 Characters</div>
          </div>

          <div className="textarea-group">
            <label>Instructions / Contact Details <span className="required">*</span></label>
            <textarea
              name="instructions"
              maxLength="300"
              value={formData.instructions}
              onChange={handleChange}
              required
              placeholder="Instructions / Contact Details"
            />
            <div className="char-counter">{formData.instructions.length}/300 Characters</div>
          </div>

          {/* Fees and Base Payment Mode */}
          <div className="form-fields-grid">
            <div className="form-group">
              <label>Entry Fee <span className="required">*</span></label>
              <input type="number" name="entryFee" value={formData.entryFee} onChange={handleChange} required placeholder="Fee" />
            </div>

            <div className="form-group">
              <label>Payment Mode <span className="required">*</span></label>
              <select name="paymentMode" value={formData.paymentMode} onChange={handleChange} required>
                <option value="">Payment Mode</option>
                <option value="Cash">Cash</option>
                <option value="Online">Online</option>
              </select>
            </div>
          </div>

          {/* Dynamic Add Payment Details Checkbox toggle */}
          <div className="checkbox-container">
            <label className="checkbox-label">
              <input
                type="checkbox"
                name="showPaymentDetails"
                checked={formData.showPaymentDetails}
                onChange={handleChange}
              />
              <span className="checkbox-custom-box"></span>
              Add Payment Details
            </label>
          </div>

          {/* Conditional Payment Methods block */}
          {formData.showPaymentDetails && (
            <div className="payment-details-section">
              <h4 className="payment-title">Select Payment Method</h4>

              <div className="payment-methods-row">
                <button
                  type="button"
                  className={`pay-method-btn ${formData.paymentMethod === "GPay" ? "selected" : ""}`}
                  onClick={() => selectPaymentMethod("GPay")}
                >
                  <span className="pay-icon gpay-icon">G Pay</span>
                </button>
                <button
                  type="button"
                  className={`pay-method-btn ${formData.paymentMethod === "PhonePe" ? "selected" : ""}`}
                  onClick={() => selectPaymentMethod("PhonePe")}
                >
                  <span className="pay-icon phonepe-icon">PhonePe</span>
                </button>
                <button
                  type="button"
                  className={`pay-method-btn ${formData.paymentMethod === "Paytm" ? "selected" : ""}`}
                  onClick={() => selectPaymentMethod("Paytm")}
                >
                  <span className="pay-icon paytm-icon">Paytm</span>
                </button>
              </div>

              <div className="form-fields-grid">
                <div className="form-group">
                  <label>UPI ID</label>
                  <input type="text" name="upiId" value={formData.upiId} onChange={handleChange} placeholder="UPI ID" />
                </div>
                <div className="form-group">
                  <label>Mobile No.</label>
                  <input type="text" name="mobileNo" value={formData.mobileNo} onChange={handleChange} placeholder="Mobile No." />
                </div>
                <div className="form-group full-width">
                  <label>Upload QR Code</label>
                  <input type="file" name="qrCode" accept="image/*" onChange={handleFileChange} />
                </div>
              </div>

              <h4 className="payment-title sub-title">Bank Details</h4>
              <div className="form-fields-grid">
                <div className="form-group">
                  <label>Bank Holder Name</label>
                  <input type="text" name="bankHolderName" value={formData.bankHolderName} onChange={handleChange} placeholder="Bank Holder Name" />
                </div>
                <div className="form-group">
                  <label>Bank Name</label>
                  <input type="text" name="bankName" value={formData.bankName} onChange={handleChange} placeholder="Bank Name" />
                </div>
                <div className="form-group">
                  <label>Account No.</label>
                  <input type="text" name="accountNo" value={formData.accountNo} onChange={handleChange} placeholder="Account No." />
                </div>
                <div className="form-group">
                  <label>IFSC Code</label>
                  <input type="text" name="ifscCode" value={formData.ifscCode} onChange={handleChange} placeholder="IFSC Code" />
                </div>
              </div>
            </div>
          )}

          {/* Submit Actions Button */}
          <div className="form-actions">
            <button type="submit" className="btn-submit-event">
              {editingId !== null ? "Update Event" : "Create Event"}
            </button>
            {editingId !== null && (
              <button
                type="button"
                className="btn-submit-event"
                style={{ background: "#999", marginLeft: "10px" }}
                onClick={() => {
                  setEditingId(null);
                  setFormData(emptyFormData);
                }}
              >
                Cancel
              </button>
            )}
          </div>

        </form>
      </div>

      {/* jQuery DataTable — edit button pre-fills the form above */}
      <div style={{ marginTop: "30px" }}>
        <DataTable columns={eventColumns} data={eventsList} onEdit={handleEditRow} />
      </div>
    </div>
  );
};

export default AddEvent;