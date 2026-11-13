import React, { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AddEvent.css";
import DataTable from "../../common/Table/DataTable";
import { makeAttendanceQrPng } from "../../../api/eventImagesStore";
import {
  getEvents,
  createEvent,
  updateEvent,
  setEventStatus,
  toImageUrl,
} from "../../../api/adminService.js";

const durationOptions = [
  "1 Weeks", "2 Weeks", "6 Weeks",
  "1 Month", "2 Month", "3 Months", "4 Months", "6 Months",
  "1 Year", "2 Years",
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
  EventTime: "",
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

/* ---------- helpers ---------- */
const pad = (n) => String(n).padStart(2, "0");

// "2026-08-10T00:00:00" -> "2026-08-10"
const toDateInput = (v) => (v ? String(v).slice(0, 10) : "");

// 2026-08-10 -> 10/08/2026
const fmtDate = (str) => {
  if (!str) return "";
  const [y, m, d] = str.split("-");
  return `${d}/${m}/${y}`;
};

// "10:00 AM - 5:00 PM" -> "10:00" (first time, for <input type="time">)
const eventTimeToInput = (v) => {
  const match = String(v || "").match(/(\d{1,2}):(\d{2})\s*(AM|PM)/i);
  if (!match) return "";
  let h = Number(match[1]) % 12;
  if (match[3].toUpperCase() === "PM") h += 12;
  return `${pad(h)}:${match[2]}`;
};

// API row -> table / form row
const normalizeEvent = (e) => ({
  id: e.eventId ?? e.id,
  duration: e.duration || "1 Weeks",
  mode: e.mode || "",
  organizationName: e.organizationName || "",
  eventTitle: e.eventTitle || "",
  advStartDate: toDateInput(e.advStartDate),
  advCompletionDate: toDateInput(e.advCompletionDate),
  eventStartDate: toDateInput(e.eventStartDate),
  eventCompletionDate: toDateInput(e.eventCompletionDate),
  eventTimeText: e.eventTime || "",
  EventTime: eventTimeToInput(e.eventTime),
  venue: e.venue || "",
  city: e.city || "",
  state: e.state || "",
  country: e.country || "",
  aboutEvent: e.aboutEvent || "",
  instructions: e.instructions || "",
  entryFee: String(e.entryFee ?? "0"),
  paymentMode: e.paymentMode || "",
  paymentMethod: e.gPay ? "GPay" : e.phonePe ? "PhonePe" : e.paytm ? "Paytm" : "GPay",
  upiId: e.upiid || "",
  mobileNo: e.paymentMobileNo || "",
  bankHolderName: e.accountHolderName || "",
  bankName: e.bankName || "",
  accountNo: e.accountNumber || "",
  ifscCode: e.ifscCode || "",
  bannerSrc: toImageUrl(e.image1),
  enabled: e.nBit ?? true,
});

const getErrorMessage = (err, fallback) => {
  const data = err.response?.data;
  if (data?.errors && typeof data.errors === "object") {
    const first = Object.values(data.errors).flat()[0];
    if (first) return first;
  }
  return data?.message || data?.title || err.message || fallback;
};

/* ---------- static attendance QR (made in the browser, kept in localStorage) ---------- */
const QR_STORE = "eventAttendanceQr2";
const readQrStore = () => {
  try { return JSON.parse(localStorage.getItem(QR_STORE) || "{}"); } catch { return {}; }
};
const writeQrStore = (obj) => {
  try { localStorage.setItem(QR_STORE, JSON.stringify(obj)); } catch { /* storage full / blocked */ }
};
// the QR link carries the event title + dates, so the attendance page works on any phone
const makeAttendanceQr = (r) =>
  makeAttendanceQrPng({ id: r.id, title: r.eventTitle, start: r.eventStartDate, end: r.eventCompletionDate });

/* long text: 3 lines + green "Read More / Read Less" link */
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
  const [editingId, setEditingId] = useState(null);

  const [eventsList, setEventsList] = useState([]);
  const [remainingEvents, setRemainingEvents] = useState(null);
  const [planExpiry, setPlanExpiry] = useState(null);
  const [qrMap, setQrMap] = useState(readQrStore); // { [eventId]: png data url }

  const [tableLoading, setTableLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  /* ---------- load events ---------- */
  const loadEvents = useCallback(async () => {
    try {
      const res = await getEvents();
      const list = res.list.map(normalizeEvent);
      setEventsList(list);
      setRemainingEvents(res.remainingEvents);
      setPlanExpiry(res.planExpiryDate ? fmtDate(toDateInput(res.planExpiryDate)) : null);
      return list;
    } catch (err) {
      console.error("Load Events Error:", err);
      setError(getErrorMessage(err, "Failed to load events."));
      return [];
    } finally {
      setTableLoading(false);
    }
  }, []);

  useEffect(() => {
    loadEvents();
  }, [loadEvents]);

  // events that already had a QR (old link without event info) -> make it again with the new link
  useEffect(() => {
    let oldMap = {};
    try { oldMap = JSON.parse(localStorage.getItem("eventAttendanceQr") || "{}"); } catch { /* ignore */ }
    const todo = eventsList.filter((r) => oldMap[r.id] && !qrMap[r.id]);
    if (!todo.length) return;
    (async () => {
      const next = { ...readQrStore() };
      for (const r of todo) next[r.id] = await makeAttendanceQr(r);
      writeQrStore(next);
      setQrMap(next);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [eventsList]);

  /* ---------- table columns ---------- */
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
    { header: "Event Time", accessorKey: "eventTimeText", meta: { className: "text-center", width: "170px" }, cell: (i) => i.getValue() || "-" },
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
      cell: (i) =>
        i.row.original.bannerSrc ? (
          <img
            src={i.row.original.bannerSrc}
            alt="Banner"
            style={{ width: 70, height: 70, objectFit: "cover", borderRadius: 10, display: "inline-block" }}
          />
        ) : (
          "-"
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
      header: "Attendance QR / Attendance",
      id: "attendance",
      enableSorting: false,
      meta: { className: "text-center", width: "200px" },
      cell: (i) => {
        const row = i.row.original;
        const qr = qrMap[row.id];
        return (
          <div className="attendance-cell">
            {qr ? (
              <a href={qr} download={`attendance-qr-${row.id}.png`} title="Click to download the QR">
                <img src={qr} alt="Attendance QR" className="attendance-qr-img" />
              </a>
            ) : (
              <span className="attendance-qr-none">QR Not Generated</span>
            )}
            <button
              type="button"
              className="btn btn-sm btn-primary attendance-btn"
              onClick={() =>
                navigate(`/admin/event-attendance?eventId=${row.id}`, {
                  state: { eventId: row.id, eventTitle: row.eventTitle },
                })
              }
            >
              View Attendance
            </button>
          </div>
        );
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
            onClick={() => toggleStatus(row)}
          >
            {row.enabled ? "Enabled" : "Disabled"}
          </button>
        );
      },
    },
  ];

  /* ---------- form handlers ---------- */
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    if (!files || !files[0]) return;

    const file = files[0];

    if (name !== "qrCode") {
      if (!["image/jpeg", "image/png"].includes(file.type)) {
        setError("Only PNG or JPG images are allowed for the banner.");
        e.target.value = "";
        return;
      }
      if (file.size > 2 * 1024 * 1024) {
        setError("Banner image must not exceed 2MB.");
        e.target.value = "";
        return;
      }
    }

    setError("");
    setFormData((prev) => ({ ...prev, [name]: file }));
  };

  const selectPaymentMethod = (method) => {
    setFormData((prev) => ({ ...prev, paymentMethod: method }));
  };

  const toggleStatus = async (row) => {
    const next = !row.enabled;
    setError("");

    // optimistic update, rolled back on failure
    setEventsList((prev) => prev.map((r) => (r.id === row.id ? { ...r, enabled: next } : r)));
    try {
      await setEventStatus(row.id, next);
    } catch (err) {
      console.error("Status Error:", err);
      setEventsList((prev) => prev.map((r) => (r.id === row.id ? { ...r, enabled: row.enabled } : r)));
      setError(getErrorMessage(err, "Failed to update status."));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage("");
    setError("");
    setSubmitting(true);

    const isNew = editingId === null;
    const knownIds = new Set(eventsList.map((r) => r.id));

    try {
      const res =
        editingId !== null
          ? await updateEvent(editingId, formData)
          : await createEvent(formData);

      setMessage(
        res?.message ||
          (editingId !== null ? "Event updated successfully." : "Event created successfully.")
      );
      setEditingId(null);
      setFormData(emptyFormData);
      const list = await loadEvents();

      // new event -> make its attendance QR right here (static, no backend)
      if (isNew) {
        const createdId = res?.eventId ?? res?.id ?? res?.data?.eventId;
        const fresh = list.filter((r) => r.id === createdId || !knownIds.has(r.id));
        if (fresh.length) {
          const next = { ...readQrStore() };
          for (const r of fresh) next[r.id] = await makeAttendanceQr(r);
          writeQrStore(next);
          setQrMap(next);
        }
      }
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      console.error("Save Event Error:", err);
      setError(getErrorMessage(err, "Failed to save event."));
      window.scrollTo({ top: 0, behavior: "smooth" });
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditRow = (row) => {
    if (!row) return;
    setMessage("");
    setError("");
    setEditingId(row.id);
    setFormData({
      ...emptyFormData,
      duration: row.duration,
      mode: row.mode,
      organizationName: row.organizationName,
      eventTitle: row.eventTitle,
      advStartDate: row.advStartDate,
      advCompletionDate: row.advCompletionDate,
      eventStartDate: row.eventStartDate,
      eventCompletionDate: row.eventCompletionDate,
      EventTime: row.EventTime,
      venue: row.venue,
      city: row.city,
      state: row.state,
      country: row.country,
      aboutEvent: row.aboutEvent,
      instructions: row.instructions,
      entryFee: row.entryFee,
      paymentMode: row.paymentMode,
      paymentMethod: row.paymentMethod,
      upiId: row.upiId,
      mobileNo: row.mobileNo,
      bankHolderName: row.bankHolderName,
      bankName: row.bankName,
      accountNo: row.accountNo,
      ifscCode: row.ifscCode,
      showPaymentDetails: !!(row.upiId || row.accountNo),
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setFormData(emptyFormData);
  };

  /* ---------- table buttons ---------- */
  const handleExportExcel = () => {
    console.log("Exporting events list to Excel...");
    alert("Exporting data to Excel format!");
  };

  const handleViewAllDetails = () => {
    navigate("/admin/event-recipants");
  };

  return (
    <div>
      <div className="add-event-container">
        <h2 className="form-main-title">{editingId !== null ? "Edit Event" : "Add Event"}</h2>

        {message && <div className="alert alert-success">{message}</div>}
        {error && <div className="alert alert-danger">{error}</div>}

        <form onSubmit={handleSubmit} className="event-form">
          <div className="instructions-section">
            <h3>Instructions</h3>
            <ul>
              <li>Kindly use only <strong>PNG</strong> or <strong>JPG</strong> image for the banner.</li>
              <li>Image size should be maximum <strong>2MB</strong>.</li>
            </ul>
          </div>

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

          <div className="plan-info-wrapper">
            <div className="remaining-event-card">
              <div className="remaining-event-title">Remaining Events</div>
              <div className="remaining-event-count">{remainingEvents ?? "-"}</div>
              <div className="remaining-event-title">Plan Expiry Date</div>
              <div className="plan-expiry-date">{planExpiry || "-"}</div>
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
              <input type="time" name="EventTime" value={formData.EventTime} onChange={handleChange} required />
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

          <div className="form-actions">
            <button type="submit" className="btn-submit-event" disabled={submitting}>
              {submitting ? "Saving..." : editingId !== null ? "Update" : "Submit"}
            </button>
            {editingId !== null && (
              <button
                type="button"
                className="btn-submit-event"
                style={{ background: "#999", marginLeft: "10px", boxShadow: "none" }}
                onClick={handleCancelEdit}
                disabled={submitting}
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      <div className="events-table">
        <h3 className="event-details-title">Event Details</h3>
        {tableLoading ? (
          <p style={{ textAlign: "center", padding: "20px" }}>Loading events...</p>
        ) : (
          <DataTable
            columns={eventColumns}
            data={eventsList}
            onExportExcel={handleExportExcel}
            onViewAllDetails={handleViewAllDetails}
          />
        )}
      </div>
    </div>
  );
};

export default AddEvent;