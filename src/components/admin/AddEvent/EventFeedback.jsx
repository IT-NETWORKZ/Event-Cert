import React, { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import {
  AlertCircle,
  ArrowLeft,
  CalendarCheck,
  Check,
  Eye,
  Info,
  Loader2,
  Mail,
  MessageCircle,
  MessageSquareText,
  Phone,
  Send,
  ShieldCheck,
  Star,
  User,
} from "lucide-react";
import "./EventFeedback.css";

/* ==========================================================================
   EVENT FEEDBACK  (opened from the floating feedback icon on the Event page)
   Route:  /eventfeedback?nID=5      (state: { eventTitle })
   Uses the dark teal + white design of EventFeedback.css
   Give Feedback -> organizer approves -> shown in View Feedback
   ========================================================================== */

const MAX_LEN = 1000;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const pad = (n) => String(n).padStart(2, "0");
const fmtDate = (iso) => {
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? "" : `${pad(d.getDate())} ${MONTHS[d.getMonth()]} ${d.getFullYear()}`;
};

const RATE_TEXT = ["Tap a star to rate", "Poor", "Fair", "Good", "Very good", "Excellent"];

const emptyForm = { name: "", email: "", mobile: "", suggestions: "" };

/* --------------------------------------------------------------------------
   DATA LAYER (browser storage, same as the rest of the Event page)
   Replace the two functions below with your API calls when the backend is ready:
     fetchApprovedFeedback(eventId) -> [{ id, name, rating, feedback, date }]
     submitFeedback(eventId, data)  -> saved as "pending" for organizer approval
   -------------------------------------------------------------------------- */
const demoApproved = [
  { id: "d1", name: "Sneha Joshi", rating: 5, feedback: "Very well organised event. The sessions were practical and the trainers were helpful throughout.", date: "2026-09-02T10:00:00", approved: true },
  { id: "d2", name: "Rahul Patil", rating: 4, feedback: "Loved the hands-on approach. Certificates were delivered quickly after the event.", date: "2026-09-03T10:00:00", approved: true },
];
const storeKey = (eventId) => `eventcert_feedback_${eventId}`;
const readStore = (eventId) => {
  try {
    return JSON.parse(localStorage.getItem(storeKey(eventId)) || "[]");
  } catch {
    return [];
  }
};
const fetchApprovedFeedback = async (eventId) =>
  [...demoApproved, ...readStore(eventId)]
    .filter((f) => f.approved)
    .sort((a, b) => new Date(b.date) - new Date(a.date));

const submitFeedback = async (eventId, data) => {
  const list = readStore(eventId);
  list.push({ id: `f${Date.now()}`, ...data, date: new Date().toISOString(), approved: false });
  localStorage.setItem(storeKey(eventId), JSON.stringify(list));
  return { ok: true };
};

/* ========================================================================== */

const EventFeedback = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [params] = useSearchParams();

  const eventId = params.get("nID");
  const eventTitle = location.state?.eventTitle || "";
  const validEvent = !!eventId && !Number.isNaN(Number(eventId)) && Number(eventId) > 0;

  const [tab, setTab] = useState(location.hash === "#view" ? "view" : "give");
  const [overall, setOverall] = useState(0);
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState({});
  const [busy, setBusy] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [approved, setApproved] = useState([]);
  const [loadingList, setLoadingList] = useState(true);

  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, []);

  useEffect(() => {
    if (!validEvent) return undefined;
    let cancelled = false;
    setLoadingList(true);
    fetchApprovedFeedback(eventId)
      .then((list) => !cancelled && setApproved(list))
      .catch(() => !cancelled && setApproved([]))
      .finally(() => !cancelled && setLoadingList(false));
    return () => {
      cancelled = true;
    };
  }, [eventId, validEvent]);

  const count = approved.length;
  const avg = useMemo(() => {
    const rated = approved.filter((f) => f.rating > 0);
    return rated.length ? rated.reduce((a, f) => a + f.rating, 0) / rated.length : 0;
  }, [approved]);

  const clearErr = (key) => errors[key] && setErrors((p) => ({ ...p, [key]: "" }));

  const onChange = (e) => {
    const { name, value } = e.target;
    let v = value;
    if (name === "name") v = value.replace(/[^A-Za-z .]/g, "");
    if (name === "mobile") v = value.replace(/\D/g, "").slice(0, 15);
    setForm((f) => ({ ...f, [name]: v }));
    clearErr(name);
  };

  const validate = () => {
    const er = {};
    if (!overall) er.overall = "Please provide your overall event rating.";
    if (!form.name.trim()) er.name = "Please enter your name.";
    if (!form.email.trim()) er.email = "Please enter your Email Id.";
    else if (!EMAIL_RE.test(form.email.trim())) er.email = "Please enter a valid Email Id.";
    if (form.mobile && form.mobile.length < 10) er.mobile = "Mobile number must be at least 10 digits.";
    if (!form.suggestions.trim()) er.suggestions = "Please write your feedback.";
    return er;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const er = validate();
    setErrors(er);
    if (Object.keys(er).length) {
      setTimeout(() => document.querySelector(".fbx-invalid, .fbx-error-q")?.scrollIntoView({ behavior: "smooth", block: "center" }), 50);
      return;
    }
    setBusy(true);
    try {
      await submitFeedback(eventId, {
        eventTitle,
        name: form.name.trim(),
        email: form.email.trim().toLowerCase(),
        mobile: form.mobile,
        rating: overall,
        feedback: form.suggestions.trim(),
      });
      setSubmitted(true);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch {
      setErrors({ submit: "Could not submit your feedback. Please try again." });
    } finally {
      setBusy(false);
    }
  };

  const resetAll = () => {
    setSubmitted(false);
    setOverall(0);
    setForm(emptyForm);
    setErrors({});
  };

  const renderStars = (rating, onRate, size = "", px = 17) => (
    <div className={`rating-stars ${size}`}>
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          type="button"
          key={star}
          className={`rating-star ${star <= rating ? "active" : ""}`}
          onClick={() => onRate(star)}
          aria-label={`Rate ${star} out of 5`}
        >
          <Star size={px} />
        </button>
      ))}
    </div>
  );

  const readStars = (value, px = 16) => (
    <div className="fbx-stars">
      {[1, 2, 3, 4, 5].map((n) => (
        <Star key={n} size={px} className={n <= Math.round(value) ? "fbx-star on" : "fbx-star"} />
      ))}
    </div>
  );

  /* ---------- success screen ---------- */
  if (submitted) {
    return (
      <section className="feedback-section">
        <div className="container">
          <div className="feedback-success">
            <div className="success-icon">
              <Check size={34} />
            </div>
            <h2>Thank You!</h2>
            <h4>Your Feedback Has Been Submitted</h4>
            <p>
              We appreciate your time and valuable feedback. It will appear under "View Feedback" once the
              organizer approves it.
            </p>
            <button type="button" className="feedback-submit-btn" onClick={resetAll}>
              <ArrowLeft size={16} /> Submit Another Feedback
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="feedback-section">
      <div className="container">
        <button type="button" className="feedback-back" onClick={() => navigate(-1)}>
          <ArrowLeft size={16} /> Back to Event
        </button>

        {/* Heading */}
        <div className="feedback-heading">
          <span className="feedback-eyebrow">
            <MessageCircle size={15} />
            YOUR EXPERIENCE MATTERS
          </span>
          <h2 className="about-title">
            Share Your <span className="highlight">FEEDBACK</span>
          </h2>
          <div className="title-line"></div>
          <p className="feedback-subtitle">Share your experience or read feedback from other participants.</p>
        </div>

        {!validEvent ? (
          <div className="feedback-card">
            <div className="fbx-alert fbx-alert-err">
              <AlertCircle size={18} />
              <span>This event link is invalid or the event is unavailable.</span>
            </div>
          </div>
        ) : (
          <>
            {/* Event box */}
            <div className="feedback-event-select">
              <div className="feedback-select-icon">
                <CalendarCheck size={22} />
              </div>
              <div className="feedback-select-content">
                <label>Event</label>
                <div className="feedback-event-name">{eventTitle || `Event #${eventId}`}</div>
              </div>
            </div>

            {/* Tabs */}
            <div className="fbx-tabs" role="tablist">
              <button type="button" role="tab" aria-selected={tab === "give"} className={`fbx-tab${tab === "give" ? " active" : ""}`} onClick={() => setTab("give")}>
                <MessageSquareText size={17} /> Give Feedback
              </button>
              <button type="button" role="tab" aria-selected={tab === "view"} className={`fbx-tab${tab === "view" ? " active" : ""}`} onClick={() => setTab("view")}>
                <Eye size={17} /> View Feedback <span className="fbx-count">{count > 99 ? "99+" : count}</span>
              </button>
            </div>

            {/* ===== GIVE FEEDBACK ===== */}
            {tab === "give" && (
              <form className="feedback-card" onSubmit={handleSubmit} noValidate>
                <div className="feedback-card-header">
                  <div>
                    <span className="feedback-tag">EVENT FEEDBACK</span>
                    <h3>Rate Your Experience</h3>
                    <p>Your response helps us make future events better.</p>
                  </div>
                  <div className="feedback-header-icon">
                    <MessageSquareText size={26} />
                  </div>
                </div>

                {/* overall */}
                <div className={`feedback-question overall-question${errors.overall ? " fbx-error-q" : ""}`}>
                  <div className="question-heading">
                    <div>
                      <h4>Overall Event Rating</h4>
                      <p>How would you rate the event overall?</p>
                    </div>
                    <span className="required-label">REQUIRED</span>
                  </div>
                  {renderStars(overall, (v) => { setOverall(v); clearErr("overall"); }, "large", 32)}
                  <span className="rating-caption">{RATE_TEXT[overall]}</span>
                  {errors.overall && <small className="fbx-err" role="alert">{errors.overall}</small>}
                </div>

                <div className="feedback-divider"></div>

                {/* personal details */}
                <div className="feedback-question">
                  <div className="question-heading">
                    <div>
                      <h4>Your Details</h4>
                      <p>
                        <ShieldCheck size={13} style={{ verticalAlign: "-2px", marginRight: 5, color: "#0d4e43" }} />
                        Your email and mobile number will never be displayed.
                      </p>
                    </div>
                    <span className="required-label">REQUIRED</span>
                  </div>

                  <div className="fbx-grid">
                    <div className={`fbx-field${errors.name ? " fbx-invalid" : ""}`}>
                      <label htmlFor="fbx-name">Name <span>*</span></label>
                      <div className="fbx-input">
                        <User size={18} />
                        <input id="fbx-name" name="name" type="text" maxLength={100} placeholder="Your name" autoComplete="name" value={form.name} onChange={onChange} />
                      </div>
                      {errors.name && <small className="fbx-err" role="alert">{errors.name}</small>}
                    </div>

                    <div className={`fbx-field${errors.email ? " fbx-invalid" : ""}`}>
                      <label htmlFor="fbx-email">Email ID <span>*</span></label>
                      <div className="fbx-input">
                        <Mail size={18} />
                        <input id="fbx-email" name="email" type="email" inputMode="email" maxLength={150} placeholder="you@example.com" autoComplete="email" value={form.email} onChange={onChange} />
                      </div>
                      {errors.email && <small className="fbx-err" role="alert">{errors.email}</small>}
                    </div>
                  </div>

                  <div className={`fbx-field${errors.mobile ? " fbx-invalid" : ""}`}>
                    <label htmlFor="fbx-mobile">Mobile Number <small>(Optional)</small></label>
                    <div className="fbx-input">
                      <Phone size={18} />
                      <input id="fbx-mobile" name="mobile" type="tel" inputMode="numeric" maxLength={15} placeholder="Mobile number" autoComplete="tel" value={form.mobile} onChange={onChange} />
                    </div>
                    {errors.mobile && <small className="fbx-err" role="alert">{errors.mobile}</small>}
                  </div>
                </div>

                <div className="feedback-divider"></div>

                {/* written feedback */}
                <div className="feedback-question">
                  <div className="question-heading">
                    <div>
                      <h4>Your Feedback</h4>
                      <p>Tell us about your experience, what you liked and what we can improve.</p>
                    </div>
                    <span className="required-label">REQUIRED</span>
                  </div>
                  <textarea
                    name="suggestions"
                    className={`feedback-textarea${errors.suggestions ? " fbx-invalid" : ""}`}
                    maxLength={MAX_LEN}
                    placeholder="Tell us about your experience..."
                    value={form.suggestions}
                    onChange={onChange}
                  />
                  <div className="textarea-footer">
                    <span><Info size={14} /> Reviewed by the organizer before it is published.</span>
                    <span>{form.suggestions.length}/{MAX_LEN}</span>
                  </div>
                  {errors.suggestions && <small className="fbx-err" role="alert">{errors.suggestions}</small>}
                </div>


                {errors.submit && (
                  <div className="fbx-alert fbx-alert-err" style={{ marginTop: 18 }}>
                    <AlertCircle size={18} />
                    <span>{errors.submit}</span>
                  </div>
                )}

                {/* submit */}
                <div className="feedback-submit-area">
                  <p>
                    <ShieldCheck /> Your email and mobile number are kept private and are never shown publicly.
                  </p>
                  <button type="submit" className="feedback-submit-btn" disabled={busy}>
                    {busy ? (
                      <>
                        <Loader2 size={17} className="fbx-spin" /> Submitting...
                      </>
                    ) : (
                      <>
                        <Send size={16} /> Submit Feedback
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}

            {/* ===== VIEW FEEDBACK ===== */}
            {tab === "view" && (
              <div className="feedback-card">
                <div className="feedback-card-header">
                  <div>
                    <span className="feedback-tag">PARTICIPANT REVIEWS</span>
                    <h3>What Participants Say</h3>
                    <p>Only feedback approved by the organizer is displayed here.</p>
                  </div>
                  <div className="feedback-header-icon">
                    <Eye size={26} />
                  </div>
                </div>

                {count > 0 && (
                  <div className="fbx-summary">
                    <div className="fbx-avg">{avg ? avg.toFixed(1) : "-"}</div>
                    <div>
                      {readStars(avg, 20)}
                      <small>{count} {count === 1 ? "review" : "reviews"}</small>
                    </div>
                  </div>
                )}

                {loadingList ? (
                  <p className="fbx-empty"><Loader2 size={18} className="fbx-spin" /> Loading feedback...</p>
                ) : count === 0 ? (
                  <div className="fbx-empty">
                    <MessageCircle size={34} />
                    <p>No feedback has been published for this event yet.</p>
                  </div>
                ) : (
                  <div className="fbx-list">
                    {approved.map((f) => (
                      <div className="fbx-item" key={f.id}>
                        <div className="fbx-avatar">{(f.name || "?").trim().charAt(0).toUpperCase()}</div>
                        <div className="fbx-item-body">
                          <div className="fbx-item-top">
                            <div>
                              <div className="fbx-item-name">{f.name}</div>
                              <div className="fbx-item-date">{fmtDate(f.date)}</div>
                            </div>
                            {f.rating > 0 && readStars(f.rating, 15)}
                          </div>
                          <p className="fbx-item-msg">{f.feedback}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            <p className="feedback-bottom-note">
              <ShieldCheck /> Thank you for helping us improve our events.
            </p>
          </>
        )}
      </div>
    </section>
  );
};

export default EventFeedback;
