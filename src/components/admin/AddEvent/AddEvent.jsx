import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AddEvent.css";
import DataTable from "../../common/Table/DataTable";

/* ==========================================================================
   STATIC DATA  (no API - everything on this page is dummy / local state)
   ========================================================================== */
const PLAN_REMAINING_EVENTS = 132;
const PLAN_EXPIRY_DATE = "24-Feb-2028";

const durationOptions = [
  "1 Weeks", "2 Weeks", "6 Weeks",
  "1 Month", "2 Month", "3 Months", "4 Months", "6 Months",
  "1 Year",
];

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
  bannerImage2: null,
  aboutEvent: "",
  instructions: "",
  entryFee: "",
  paymentMode: "",
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

/* ---------- small helpers ---------- */
const pad = (n) => String(n).padStart(2, "0");

const shiftDate = (str, days) => {
  const d = new Date(`${str}T00:00:00`);
  d.setDate(d.getDate() + days);
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
};

// 2026-08-10 -> 10/08/2026
const fmtDate = (str) => {
  if (!str || str === "-") return "";
  const [y, m, d] = str.split("-");
  return `${d}/${m}/${y}`;
};

// 14:30 -> 02:30 PM
const fmtTime = (str) => {
  if (!str) return "";
  const [h, m] = str.split(":").map(Number);
  return `${pad(h % 12 === 0 ? 12 : h % 12)}:${pad(m)} ${h >= 12 ? "PM" : "AM"}`;
};

// static banner thumbnail (letter on a teal tile)
const makeLogo = (title = "E") => {
  const svg =
    `<svg xmlns='http://www.w3.org/2000/svg' width='100' height='100'>` +
    `<defs><linearGradient id='g' x1='0' y1='0' x2='1' y2='1'>` +
    `<stop offset='0' stop-color='#5fb8ad'/><stop offset='1' stop-color='#009688'/></linearGradient></defs>` +
    `<rect width='100' height='100' rx='12' fill='url(#g)'/>` +
    `<text x='50' y='64' font-size='46' font-family='Arial' font-weight='700' fill='white' text-anchor='middle'>` +
    `${(title.trim()[0] || "E").toUpperCase()}</text></svg>`;
  // base64 data URI works in every browser (no escaping problems)
  return `data:image/svg+xml;base64,${btoa(unescape(encodeURIComponent(svg)))}`;
};

// 20 base records, then the extra fields are filled in so every column has data
const baseEvents = [
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

const initialDummyEvents = baseEvents.map((e, i) => ({
  ...e,
  advStartDate: shiftDate(e.eventStartDate, -30),
  advCompletionDate: shiftDate(e.eventStartDate, -2),
  aboutEvent: `${e.eventTitle} brings professionals and learners together for talks, demos and hands-on sessions.`,
  setTime: i % 2 === 0 ? "10:00" : "14:30",
  venue: `${e.city} Convention Centre`,
  country: "India",
  instructions: "Carry a valid photo ID. For queries call 9876543210.",
  bannerSrc: makeLogo(e.eventTitle),
  enabled: e.status === "Active",
}));

/* long text: 3 lines + green "Read More / Read Less" link (same as the reference page) */
const ReadMore = ({ text = "", limit = 80 }) => {
  const [open, setOpen] = useState(false);
  const long = text.length > limit;
  return (
    <div className="read-more-cell">
      <span style={{ display: "block", textAlign: "justify" }}>
        {open || !long ? text : `${text.slice(0, limit).trim()}...`}
      </span>
      {long && (
        <button type="button" className="read-more-link" onClick={() => setOpen((o) => !o)}>
          {open ? "Read Less" : "Read More"}
        </button>
      )}
    </div>
  );
};

const AddEvent = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState(emptyFormData);
  const [editingId, setEditingId] = useState(null); // null = creating, otherwise editing this row's id
  const [eventsList, setEventsList] = useState(initialDummyEvents);

  /* ==========================================================================
     DATATABLE COLUMNS  (same columns as the Event Details table)
     ========================================================================== */
  const eventColumns = [
    { header: "Sr. No.", id: "srNo", meta: { className: "text-center", width: "80px" }, cell: (info) => info.row.index + 1 },
    { header: "Adv. Start Date", accessorKey: "advStartDate", meta: { className: "text-center", width: "140px" }, cell: (i) => fmtDate(i.getValue()) },
    { header: "Adv. Completion Date", accessorKey: "advCompletionDate", meta: { className: "text-center", width: "170px" }, cell: (i) => fmtDate(i.getValue()) },
    { header: "Event Start Date", accessorKey: "eventStartDate", meta: { className: "text-center", width: "150px" }, cell: (i) => fmtDate(i.getValue()) },
    { header: "Event Completion Date", accessorKey: "eventCompletionDate", meta: { className: "text-center", width: "180px" }, cell: (i) => fmtDate(i.getValue()) },
    { header: "Org. Name", accessorKey: "organizationName", meta: { className: "text-center", width: "180px" } },
    {
      header: "Event Title",
      accessorKey: "eventTitle",
      meta: { className: "text-center", width: "200px" },
      // click the title -> Admin Participate page (participants of this event)
      cell: (i) => {
        const row = i.row.original;
        return (
          <a
            href={`/admin/admin-participate?nID=${row.id}`}
            className="event-title-link"
            onClick={(e) => {
              e.preventDefault();
              navigate(`/admin/admin-participate?nID=${row.id}`, { state: { eventTitle: row.eventTitle } });
            }}
          >
            {row.eventTitle}
          </a>
        );
      },
    },
    { header: "About Event", accessorKey: "aboutEvent", meta: { className: "text-center", width: "240px" }, cell: (i) => <ReadMore text={i.getValue()} /> },
    { header: "Start Time", accessorKey: "setTime", meta: { className: "text-center", width: "120px" }, cell: (i) => fmtTime(i.getValue()) },
    { header: "Venue", accessorKey: "venue", meta: { className: "text-center", width: "190px" } },
    {
      header: "Location",
      id: "location",
      accessorFn: (row) => `${row.city} ${row.state} ${row.country}`,
      meta: { className: "text-center", width: "170px" },
      cell: (i) => {
        const r = i.row.original;
        return (
          <div style={{ lineHeight: 1.35 }}>
            {r.city}<br />{r.state}<br />{r.country}
          </div>
        );
      },
    },
    {
      header: "Adv. Banner Logo",
      id: "bannerSrc",
      enableSorting: false,
      meta: { className: "text-center", width: "140px" },
      cell: (i) => (
        <img
          src={i.row.original.bannerSrc}
          alt="Banner"
          style={{ width: 70, height: 70, objectFit: "cover", borderRadius: 10, display: "inline-block" }}
        />
      ),
    },
    { header: "Inst. / Contact Details", accessorKey: "instructions", meta: { className: "text-center", width: "240px" }, cell: (i) => <ReadMore text={i.getValue()} /> },
    { header: "Mode", accessorKey: "mode", meta: { className: "text-center", width: "110px" }, cell: (i) => i.getValue() || "-" },
    {
      header: "Entry Fee",
      accessorKey: "entryFee",
      meta: { className: "text-center", width: "110px" },
      cell: (i) => {
        const v = i.getValue();
        return v && v !== "0" ? `₹${v}` : "Free";
      },
    },
    {
      header: "Edit",
      id: "edit",
      enableSorting: false,
      meta: { className: "text-center", width: "100px" },
      cell: (i) => (
        <button
          type="button"
          className="btn btn-sm btn-primary px-3 py-1"
          style={{ borderRadius: "15px", fontSize: "12px" }}
          onClick={() => handleEditRow(i.row.original)}
        >
          Edit
        </button>
      ),
    },
    {
      header: "Status",
      id: "status",
      enableSorting: false,
      meta: { className: "text-center", width: "120px" },
      cell: (i) => {
        const row = i.row.original;
        return (
          <button
            type="button"
            className={`btn btn-sm px-3 py-1 ${row.enabled ? "btn-success" : "btn-danger"}`}
            style={{ borderRadius: "15px", fontSize: "12px" }}
            onClick={() => toggleStatus(row.id)}
          >
            {row.enabled ? "Enabled" : "Disabled"}
          </button>
        );
      },
    },
  ];

  /* ==========================================================================
     FORM HANDLERS
     ========================================================================== */
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    if (files && files[0]) {
      setFormData((prev) => ({ ...prev, [name]: files[0] }));
    }
  };

  const selectPaymentMethod = (method) => {
    setFormData((prev) => ({ ...prev, paymentMethod: method }));
  };

  const toggleStatus = (id) => {
    setEventsList((prev) => prev.map((r) => (r.id === id ? { ...r, enabled: !r.enabled } : r)));
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
      country: formData.country,
      mode: formData.mode,
      entryFee: formData.entryFee || "0",
      instructions: formData.instructions,
    };
    if (formData.bannerImage) {
      eventRecord.bannerSrc = URL.createObjectURL(formData.bannerImage);
    }

    if (editingId !== null) {
      setEventsList((prev) => prev.map((row) => (row.id === editingId ? { ...row, ...eventRecord } : row)));
      setEditingId(null);
    } else {
      setEventsList((prev) => [
        {
          id: Date.now(),
          enabled: true,
          status: "Active",
          bannerSrc: makeLogo(formData.eventTitle),
          ...eventRecord,
        },
        ...prev,
      ]);
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
      country: row.country || "",
      mode: row.mode || "",
      entryFee: row.entryFee || "",
      instructions: row.instructions || "",
    }));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setFormData(emptyFormData);
  };

  /* ==========================================================================
     DATATABLE BUTTON HANDLERS
     ========================================================================== */
  const handleExportExcel = () => {
    console.log("Exporting events list to Excel...");
    alert("Exporting data to Excel format!");
  };

  // "All Event Reg. Details" -> EventRecipants page
  const handleViewAllDetails = () => {
    navigate("/admin/event-recipants");
  };

  return (
    <div>
      <div className="add-event-container">
        <h2 className="form-main-title">{editingId !== null ? "Edit Event" : "Add Event"}</h2>

        <form onSubmit={handleSubmit} className="event-form">
          {/* Instructions */}
          <div className="instructions-section">
            <h3>Instructions</h3>
            <ul>
              <li>Kindly use only <strong>PNG</strong> or <strong>JPG</strong> image for the banner.</li>
              <li>Image size should be maximum <strong>2MB</strong>.</li>
            </ul>
          </div>

          {/* Subscription plan */}
          <div className="section-label">Subscription Plan</div>
          <div className="duration-grid">
            {durationOptions.map((opt) => (
              <label key={opt} className={`duration-label ${formData.duration === opt ? "active" : ""}`}>
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

          {/* Remaining events + expiry  |  Mode */}
          <div className="plan-info-wrapper">
            <div className="remaining-event-card">
              <div className="remaining-event-title">Remaining Events</div>
              <div className="remaining-event-count">{PLAN_REMAINING_EVENTS}</div>
              <div className="remaining-event-title">Plan Expiry Date</div>
              <div className="plan-expiry-date">{PLAN_EXPIRY_DATE}</div>
            </div>

            <div className="mode-wrapper form-group">
              <label>Mode <span className="required">*</span></label>
              <select name="mode" value={formData.mode} onChange={handleChange} required>
                <option value="">Select Mode</option>
                <option value="Online">Online</option>
                <option value="Offline">Offline</option>
                <option value="Hybrid">Hybrid</option>
              </select>
            </div>
          </div>

          {/* Main fields */}
          <div className="form-fields-grid">
            <div className="form-group">
              <label>Organization Name <span className="required">*</span></label>
              <input type="text" name="organizationName" value={formData.organizationName} onChange={handleChange} required maxLength={50} placeholder="Organization Name" />
            </div>

            <div className="form-group">
              <label>Event Title <span className="required">*</span></label>
              <input type="text" name="eventTitle" value={formData.eventTitle} onChange={handleChange} required maxLength={50} placeholder="Event Title" />
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
              <input type="text" name="venue" value={formData.venue} onChange={handleChange} required maxLength={160} placeholder="Event Venue" />
            </div>

            <div className="form-group">
              <label>City <span className="required">*</span></label>
              <input type="text" name="city" value={formData.city} onChange={handleChange} required maxLength={50} placeholder="City" />
            </div>

            <div className="form-group">
              <label>State <span className="required">*</span></label>
              <input type="text" name="state" value={formData.state} onChange={handleChange} required maxLength={50} placeholder="State" />
            </div>

            <div className="form-group">
              <label>Country <span className="required">*</span></label>
              <input type="text" name="country" value={formData.country} onChange={handleChange} required maxLength={50} placeholder="Country" />
            </div>

            <div className="form-group">
              <label>Upload Image 1 <span className="required">*</span></label>
              <input type="file" name="bannerImage" accept="image/jpeg, image/png" onChange={handleFileChange} required={editingId === null} />
            </div>

            <div className="form-group">
              <label>Upload Image 2</label>
              <input type="file" name="bannerImage2" accept="image/jpeg, image/png" onChange={handleFileChange} />
            </div>
          </div>

          {/* Text areas */}
          <div className="textarea-group">
            <label>About Event <span className="required">*</span></label>
            <textarea
              name="aboutEvent"
              maxLength="500"
              value={formData.aboutEvent}
              onChange={handleChange}
              required
              placeholder="About Event"
            />
            <div className="char-counter">{formData.aboutEvent.length}/500 Characters</div>
          </div>

          <div className="textarea-group">
            <label>Instructions / Contact Details <span className="required">*</span></label>
            <textarea
              name="instructions"
              maxLength="500"
              value={formData.instructions}
              onChange={handleChange}
              required
              placeholder="Instructions / Contact Details"
            />
            <div className="char-counter">{formData.instructions.length}/500 Characters</div>
          </div>

          {/* Fee + payment mode */}
          <div className="form-fields-grid">
            <div className="form-group">
              <label>Entry Fee <span className="required">*</span></label>
              <input type="number" min="0" name="entryFee" value={formData.entryFee} onChange={handleChange} required placeholder="Fee" />
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

          {/* Add payment details toggle */}
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

          {formData.showPaymentDetails && (
            <div className="payment-details-section">
              <h4 className="payment-title">Select Payment Method</h4>

              <div className="payment-methods-row">
                <button type="button" className={`pay-method-btn ${formData.paymentMethod === "GPay" ? "selected" : ""}`} onClick={() => selectPaymentMethod("GPay")}>
                  <span className="pay-icon gpay-icon">G Pay</span>
                </button>
                <button type="button" className={`pay-method-btn ${formData.paymentMethod === "PhonePe" ? "selected" : ""}`} onClick={() => selectPaymentMethod("PhonePe")}>
                  <span className="pay-icon phonepe-icon">PhonePe</span>
                </button>
                <button type="button" className={`pay-method-btn ${formData.paymentMethod === "Paytm" ? "selected" : ""}`} onClick={() => selectPaymentMethod("Paytm")}>
                  <span className="pay-icon paytm-icon">Paytm</span>
                </button>
              </div>

              <div className="form-fields-grid">
                <div className="form-group">
                  <label>UPI ID</label>
                  <input type="text" name="upiId" value={formData.upiId} onChange={handleChange} maxLength={40} placeholder="UPI ID" />
                </div>
                <div className="form-group">
                  <label>Mobile No.</label>
                  <input type="text" name="mobileNo" value={formData.mobileNo} onChange={handleChange} maxLength={20} placeholder="Mobile No." />
                </div>
                <div className="form-group full-width">
                  <label>Upload QR Code</label>
                  <input type="file" name="qrCode" accept="image/*" onChange={handleFileChange} />
                </div>
              </div>

              <h4 className="payment-title sub-title">Bank Details</h4>
              <div className="form-fields-grid">
                <div className="form-group">
                  <input type="text" name="bankHolderName" value={formData.bankHolderName} onChange={handleChange} maxLength={50} placeholder="Bank Holder Name" />
                </div>
                <div className="form-group">
                  <input type="text" name="bankName" value={formData.bankName} onChange={handleChange} maxLength={50} placeholder="Bank Name" />
                </div>
                <div className="form-group">
                  <input type="text" name="accountNo" value={formData.accountNo} onChange={handleChange} maxLength={50} placeholder="Account No." />
                </div>
                <div className="form-group">
                  <input type="text" name="ifscCode" value={formData.ifscCode} onChange={handleChange} maxLength={20} placeholder="IFSC Code" />
                </div>
              </div>
            </div>
          )}

          {/* Submit / Update */}
          <div className="form-actions">
            <button type="submit" className="btn-submit-event">
              {editingId !== null ? "Update" : "Submit"}
            </button>
            {editingId !== null && (
              <button
                type="button"
                className="btn-submit-event"
                style={{ background: "#999", marginLeft: "10px", boxShadow: "none" }}
                onClick={handleCancelEdit}
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Event Details table (Export to Excel + All Event Reg. Details buttons come from DataTable) */}
      <div className="events-table">
        <h3 className="event-details-title">Event Details</h3>
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
