import React, { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { AlertCircle, CalendarDays, CheckCircle2, Mail } from "lucide-react";
import "./MarkAttendance.css";

/* ==========================================================================
   MARK ATTENDANCE  (public page, opened by scanning the event's attendance QR)
   QR link:  /attendance?eventId=12&title=Java Webinar&start=2026-11-26&end=2026-11-27
   Static (no backend): the attendance is kept in this browser's localStorage.
   ========================================================================== */
const LOG_KEY = "eventAttendanceLog";
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const pad = (n) => String(n).padStart(2, "0");

const todayIso = () => {
  const d = new Date();
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
};
const fmtDate = (iso) => {
  const [y, m, d] = String(iso || "").split("-");
  return y && m && d ? `${pad(d)} ${MONTHS[Number(m) - 1]} ${y}` : "";
};
const fmtTime = (d) => `${pad(d.getHours() % 12 || 12)}:${pad(d.getMinutes())} ${d.getHours() >= 12 ? "PM" : "AM"}`;

const readLog = () => {
  try { return JSON.parse(localStorage.getItem(LOG_KEY) || "[]"); } catch { return []; }
};

const MarkAttendance = () => {
  const [params] = useSearchParams();
  const eventId = params.get("eventId");
  const title = params.get("title") || "";
  const start = params.get("start") || "";
  const end = params.get("end") || start;

  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [done, setDone] = useState(null); // { email, time }

  // attendance is open only on the scheduled event dates (no dates in the link -> always open)
  const open = useMemo(() => {
    if (!start) return true;
    const t = todayIso();
    return t >= start && t <= end;
  }, [start, end]);

  const dates = start ? (end && end !== start ? `${fmtDate(start)} - ${fmtDate(end)}` : fmtDate(start)) : "";

  const handleSubmit = (e) => {
    e.preventDefault();
    const value = email.trim().toLowerCase();
    if (!value) return setError("Please enter your Email Id.");
    if (!EMAIL_RE.test(value)) return setError("Please enter a valid Email Id.");

    const date = todayIso();
    const log = readLog();
    if (log.some((r) => r.eventId === eventId && r.email === value && r.date === date)) {
      return setError("Attendance is already marked for this Email Id today.");
    }

    const now = new Date();
    try {
      localStorage.setItem(LOG_KEY, JSON.stringify([...log, { eventId, title, email: value, date, time: fmtTime(now) }]));
    } catch { /* storage blocked - still show success */ }
    setError("");
    setDone({ email: value, time: fmtTime(now) });
  };

  return (
    <div className="ma-page">
      <div className="ma-card">
        <h2 className="ma-title">Event Attendance</h2>
        {title && <p className="ma-event">{title}</p>}
        {dates && (
          <p className="ma-dates">
            <CalendarDays size={15} /> {dates}
          </p>
        )}

        {!eventId ? (
          <div className="ma-alert ma-alert-error">
            <AlertCircle size={18} />
            <span>This QR code is not valid. Please scan the event's attendance QR code again.</span>
          </div>
        ) : !open ? (
          <div className="ma-alert ma-alert-error">
            <span>Attendance is currently unavailable. Please scan the QR code during the scheduled event dates.</span>
          </div>
        ) : done ? (
          <div className="ma-alert ma-alert-ok">
            <CheckCircle2 size={34} />
            <strong>Attendance marked successfully</strong>
            <span>{done.email}</span>
            <small>{fmtDate(todayIso())} · {done.time}</small>
          </div>
        ) : (
          <form className="ma-form" onSubmit={handleSubmit} noValidate>
            <label htmlFor="ma-email">Enter your registered Email Id <b>*</b></label>
            <div className={`ma-input${error ? " invalid" : ""}`}>
              <Mail size={18} />
              <input
                id="ma-email"
                type="email"
                inputMode="email"
                autoComplete="email"
                placeholder="name@example.com"
                value={email}
                maxLength={120}
                onChange={(e) => { setEmail(e.target.value); setError(""); }}
              />
            </div>
            {error && <small className="ma-err" role="alert">{error}</small>}
            <button type="submit" className="ma-btn">Mark Attendance</button>
          </form>
        )}
      </div>
    </div>
  );
};

export default MarkAttendance;
