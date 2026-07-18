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

// 20 Mock records to populate the table initially
const initialDummyEvents = [
  { id: 1, organizationName: "TechCorp India", eventTitle: "Tech Summit 2026", mode: "Online", city: "Bangalore", state: "Karnataka", eventStartDate: "2026-08-10", eventCompletionDate: "2026-08-12", entryFee: "1500", status: "Active" },
  { id: 2, organizationName: "AI Research Lab", eventTitle: "AI & ML Workshop", mode: "Offline", city: "Hyderabad", state: "Telangana", eventStartDate: "2026-08-15", eventCompletionDate: "2026-08-16", entryFee: "500", status: "Active" },
  { id: 3, organizationName: "Design Guild", eventTitle: "UI/UX Design Forum", mode: "Hybrid", city: "Mumbai", state: "Maharashtra", eventStartDate: "2026-08-20", eventCompletionDate: "2026-08-22", entryFee: "0", status: "Active" },
  { id: 4, organizationName: "CyberSec India", eventTitle: "Cybersecurity Expo", mode: "Offline", city: "New Delhi", state: "Delhi", eventStartDate: "2026-09-01", eventCompletionDate: "2026-09-03", entryFee: "2000", status: "Active" },
  { id: 5, organizationName: "Cloud Native Group", eventTitle: "Kubernetes Days", mode: "Online", city: "Pune", state: "Maharashtra", eventStartDate: "2026-09-05", eventCompletionDate: "2026-09-05", entryFee: "300", status: "Cancelled" },
  { id: 6, organizationName: "DevOps Central", eventTitle: "CI/CD Bootcamp", mode: "Online", city: "Chennai", state: "Tamil Nadu", eventStartDate: "2026-09-10", eventCompletionDate: "2026-09-11", entryFee: "0", status: "Active" },
  { id: 7, organizationName: "Data Science Hub", eventTitle: "Big Data Conference", mode: "Offline", city: "Bangalore", state: "Karnataka", eventStartDate: "2026-09-15", eventCompletionDate: "2026-09-17", entryFee: "2500", status: "Active" },
  { id: 8, organizationName: "Web3 Society", eventTitle: "Blockchain Summit", mode: "Hybrid", city: "Gurgaon", state: "Haryana", eventStartDate: "2026-09-20", eventCompletionDate: "2026-09-21", entryFee: "1000", status: "Active" },
  { id: 9, organizationName: "FinTech Alliance", eventTitle: "Future of Payments", mode: "Offline", city: "Mumbai", state: "Maharashtra", eventStartDate: "2026-09-25", eventCompletionDate: "2026-09-26", entryFee: "1200", status: "Active" },
  { id: 10, organizationName: "Green Energy Council", eventTitle: "CleanTech Forum", mode: "Online", city: "Ahmedabad", state: "Gujarat", eventStartDate: "2026-10-01", eventCompletionDate: "2026-10-02", entryFee: "0", status: "Active" },
  { id: 11, organizationName: "EdTech Creators", eventTitle: "Digital Learning Expo", mode: "Hybrid", city: "Kolkata", state: "West Bengal", eventStartDate: "2026-10-05", eventCompletionDate: "2026-10-07", entryFee: "400", status: "Active" },
  { id: 12, organizationName: "Startup Network", eventTitle: "Founders Pitch Day", mode: "Offline", city: "Bangalore", state: "Karnataka", eventStartDate: "2026-10-10", eventCompletionDate: "2026-10-10", entryFee: "0", status: "Active" },
  { id: 13, organizationName: "QA Professionals", eventTitle: "Automation Testing Con", mode: "Online", city: "Pune", state: "Maharashtra", eventStartDate: "2026-10-15", eventCompletionDate: "2026-10-16", entryFee: "600", status: "Active" },
  { id: 14, organizationName: "Game Dev Studio", eventTitle: "Indie Game Jam", mode: "Offline", city: "Hyderabad", state: "Telangana", eventStartDate: "2026-10-20", eventCompletionDate: "2026-10-22", entryFee: "200", status: "Active" },
  { id: 15, organizationName: "HealthTech India", eventTitle: "MedTech Innovation", mode: "Hybrid", city: "New Delhi", state: "Delhi", eventStartDate: "2026-10-25", eventCompletionDate: "2026-10-26", entryFee: "1800", status: "Cancelled" },
  { id: 16, organizationName: "Robotics Society", eventTitle: "Autonomous Systems", mode: "Offline", city: "Chennai", state: "Tamil Nadu", eventStartDate: "2026-11-01", eventCompletionDate: "2026-11-03", entryFee: "1500", status: "Active" },
  { id: 17, organizationName: "Mobile Dev Group", eventTitle: "Flutter & React Native Con", mode: "Online", city: "Bangalore", state: "Karnataka", eventStartDate: "2026-11-05", eventCompletionDate: "2026-11-06", entryFee: "500", status: "Active" },
  { id: 18, organizationName: "AgriTech Forum", eventTitle: "Smart Farming Expo", mode: "Offline", city: "Indore", state: "Madhya Pradesh", eventStartDate: "2026-11-10", eventCompletionDate: "2026-11-12", entryFee: "0", status: "Active" },
  { id: 19, organizationName: "IoT Makers", eventTitle: "Connected Devices Workshop", mode: "Hybrid", city: "Pune", state: "Maharashtra", eventStartDate: "2026-11-15", eventCompletionDate: "2026-11-16", entryFee: "800", status: "Active" },
  { id: 20, organizationName: "Open Source Guild", eventTitle: "FOSS Meetup 2026", mode: "Offline", city: "Mumbai", state: "Maharashtra", eventStartDate: "2026-11-20", eventCompletionDate: "2026-11-21", entryFee: "0", status: "Active" },
];

const AddEvent = () => {
  const [formData, setFormData] = useState(emptyFormData);
  const [editingId, setEditingId] = useState(null); // null = creating, otherwise editing this row's id
  const [eventsList, setEventsList] = useState(initialDummyEvents); // rows shown in the DataTable below the form

  const durationOptions = [
    "1 Weeks", "6 Weeks", "2 Month", "3 Months", "4 Months", "6 Months", "1 Year"
  ];

  /* ==========================================================================
     DATATABLE COLUMN DEFINITIONS W/ CLEAN ALIGNMENT MAPPINGS
     ========================================================================== */
  const eventColumns = [
    {
      header: "Sr No",
      id: "srNo",
      meta: { className: "text-center" },
      cell: (info) => info.row.index + 1,
    },
    {
      header: "Organization",
      accessorKey: "organizationName",
      meta: { className: "text-start" },
    },
    {
      header: "Event Title",
      accessorKey: "eventTitle",
      meta: { className: "text-start" },
    },
    {
      header: "Mode",
      accessorKey: "mode",
      meta: { className: "text-center" },
      cell: (info) => info.getValue() || "-",
    },
    {
      header: "City",
      accessorKey: "city",
      meta: { className: "text-start" },
    },
    {
      header: "State",
      accessorKey: "state",
      meta: { className: "text-start" },
    },
    {
      header: "Event Start",
      accessorKey: "eventStartDate",
      meta: { className: "text-center" },
    },
    {
      header: "Event End",
      accessorKey: "eventCompletionDate",
      meta: { className: "text-center" },
    },
    {
      header: "Entry Fee",
      accessorKey: "entryFee",
      meta: { className: "text-end" },
      cell: (info) => {
        const val = info.getValue();
        return val && val !== "0" ? `₹${val}` : "Free";
      },
    },
    {
      header: "Status",
      accessorKey: "status",
      meta: { className: "text-center" },
      cell: (info) => {
        const val = info.getValue() || "Active";
        return <span className={`status-badge status-${val.toLowerCase()}`}>{val}</span>;
      },
    },
    {
      header: "Action",
      id: "actions",
      meta: { className: "text-center" },
      cell: (info) => (
        <button
          type="button"
          className="btn btn-sm btn-outline-success px-3 py-1"
          style={{ borderRadius: "15px", fontSize: "12px" }}
          onClick={() => handleEditRow(info.row.original)}
        >
          Edit
        </button>
      ),
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
      setEventsList((prev) =>
        prev.map((row) => (row.id === editingId ? { ...row, ...eventRecord } : row))
      );
      setEditingId(null);
    } else {
      setEventsList((prev) => [{ id: Date.now(), ...eventRecord }, ...prev]);
    }

    setFormData(emptyFormData);
  };

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

  /* ==========================================================================
     DATATABLE BUTTON HANDLERS
     ========================================================================== */
  const handleExportExcel = () => {
    console.log("Exporting events list to Excel...");
    alert("Exporting data to Excel format!");
  };

  const handleViewAllDetails = () => {
    console.log("Viewing all registration details...");
    alert("Displaying all Event Registration details!");
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

      {/* Renders BOTH "Export to Excel" and "All Event Reg. Details" buttons in the table */}
      <div style={{ marginTop: "30px" }}>
        <DataTable
          columns={eventColumns}
          data={eventsList}
          onExportExcel={handleExportExcel}
          onViewAllDetails={handleViewAllDetails}
        />
      </div>
    </div>
  );
};

export default AddEvent;