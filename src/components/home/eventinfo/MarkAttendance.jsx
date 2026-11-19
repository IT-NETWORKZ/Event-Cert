import React, { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { AlertCircle, CalendarDays, CheckCircle2, Mail, ShieldCheck } from "lucide-react";
import {
  getAttendanceEvent,
  sendAttendanceOtp,
  verifyAttendanceOtp,
  parseAttendanceError,
} from "../../../api/eventService"; // adjust the path to match your folder
import "./MarkAttendance.css";

/* ==========================================================================
   MARK ATTENDANCE  (public page, opened by scanning the event's attendance QR)
   QR link:  https://eventcert.com/attendance?eventId=5
   Flow: enter registered email -> Send OTP -> enter OTP -> Verify -> attendance marked
   ========================================================================== */

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const pad = (n) => String(n).padStart(2, "0");
const RESEND_SECONDS = 30;

const fmtDate = (iso) => {
  const [y, m, d] = String(iso || "").slice(0, 10).split("-");
  return y && m && d ? `${pad(d)} ${MONTHS[Number(m) - 1]} ${y}` : "";
};

const MarkAttendance = () => {
  const [params] = useSearchParams();
  const eventId = params.get("eventId");

  const [eventInfo, setEventInfo] = useState(null);
  const [step, setStep] = useState("email"); // email | otp | done
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");
  const [notRegistered, setNotRegistered] = useState(false);
  const [busy, setBusy] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const [result, setResult] = useState(null); // { name, date, already }

  const validEventId = !!eventId && !Number.isNaN(Number(eventId)) && Number(eventId) > 0;

  // Title and dates are only for display (the server decides if attendance is open today).
  // Use the values from the QR link when present, otherwise try to load them.
  const qTitle = params.get("title") || "";
  const qStart = params.get("start") || "";
  const qEnd = params.get("end") || "";

  useEffect(() => {
    if (!validEventId || qTitle) return;
    let cancelled = false;
    getAttendanceEvent(eventId)
      .then((ev) => {
        if (!cancelled) setEventInfo(ev);
      })
      .catch(() => {}); // display only - ignore failures
    return () => {
      cancelled = true;
    };
  }, [eventId, validEventId, qTitle]);

  // resend timer
  useEffect(() => {
    if (cooldown <= 0) return;
    const t = setTimeout(() => setCooldown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [cooldown]);

  const title = qTitle || eventInfo?.eventTitle || "";
  const start = qStart || eventInfo?.eventStartDate || "";
  const end = qEnd || eventInfo?.eventEndDate || start;
  const dates = start
    ? fmtDate(end) && fmtDate(end) !== fmtDate(start)
      ? `${fmtDate(start)} - ${fmtDate(end)}`
      : fmtDate(start)
    : "";

  /* ---------- Step 1: send OTP ---------- */
  const requestOtp = async () => {
    const value = email.trim().toLowerCase();
    if (!value) return setError("Please enter your Email Id.");
    if (!EMAIL_RE.test(value)) return setError("Please enter a valid Email Id.");

    setBusy(true);
    setError("");
    setInfo("");
    setNotRegistered(false);
    try {
      const data = await sendAttendanceOtp({ eventId, email: value });
      setEmail(value);
      setOtp("");
      setStep("otp");
      setCooldown(RESEND_SECONDS);
      setInfo(data?.message || "OTP sent to your registered email.");
    } catch (err) {
      const { message, registered } = parseAttendanceError(err);
      setError(message);
      setNotRegistered(!registered);
    } finally {
      setBusy(false);
    }
  };

  const handleSend = (e) => {
    e.preventDefault();
    requestOtp();
  };

  /* ---------- Step 2: verify OTP and mark attendance ---------- */
  const handleVerify = async (e) => {
    e.preventDefault();
    if (!/^\d{6}$/.test(otp)) return setError("Please enter the 6-digit OTP.");

    setBusy(true);
    setError("");
    try {
      const data = await verifyAttendanceOtp({ eventId, email, otp });
      setResult({ name: data?.participantName, date: data?.attendanceDate, already: false });
      setStep("done");
    } catch (err) {
      const { message, status } = parseAttendanceError(err);
      if (status === 409) {
        // attendance was already marked today
        setResult({ name: "", date: "", already: true });
        setStep("done");
      } else {
        setError(message);
      }
    } finally {
      setBusy(false);
    }
  };

  const changeEmail = () => {
    setStep("email");
    setOtp("");
    setError("");
    setInfo("");
    setCooldown(0);
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

        {!validEventId ? (
          <div className="ma-alert ma-alert-error">
            <AlertCircle size={18} />
            <span>This QR code is not valid. Please scan the event's attendance QR code again.</span>
          </div>
        ) : step === "done" ? (
          <div className={`ma-alert ${result?.already ? "ma-alert-info" : "ma-alert-ok"}`}>
            <CheckCircle2 size={34} />
            {result?.already ? (
              <strong>Your attendance is already marked for today</strong>
            ) : (
              <>
                <strong>Attendance marked successfully</strong>
                {result?.name && <span>{result.name}</span>}
                {result?.date && <small>Date: {fmtDate(result.date)}</small>}
              </>
            )}
          </div>
        ) : step === "email" ? (
          <form className="ma-form" onSubmit={handleSend} noValidate>
            <label htmlFor="ma-email">
              Enter your registered Email Id <b>*</b>
            </label>
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
                onChange={(e) => {
                  setEmail(e.target.value);
                  setError("");
                  setNotRegistered(false);
                }}
              />
            </div>
            {error && (
              <small className="ma-err" role="alert">
                {error}
              </small>
            )}
            {notRegistered && (
              <Link className="ma-link" to={`/event?nID=${eventId}`}>
                Register for this event
              </Link>
            )}
            <button type="submit" className="ma-btn" disabled={busy}>
              {busy ? "Sending OTP..." : "Send OTP"}
            </button>
          </form>
        ) : (
          <form className="ma-form" onSubmit={handleVerify} noValidate>
            {info && <small className="ma-hint">{info}</small>}
            <small className="ma-hint">
              <b>{email}</b>
            </small>

            <label htmlFor="ma-otp">
              Enter 6-digit OTP <b>*</b>
            </label>
            <div className={`ma-input${error ? " invalid" : ""}`}>
              <ShieldCheck size={18} />
              <input
                id="ma-otp"
                className="ma-otp"
                type="text"
                inputMode="numeric"
                autoComplete="one-time-code"
                placeholder="------"
                value={otp}
                maxLength={6}
                autoFocus
                onChange={(e) => {
                  setOtp(e.target.value.replace(/\D/g, ""));
                  setError("");
                }}
              />
            </div>
            {error && (
              <small className="ma-err" role="alert">
                {error}
              </small>
            )}

            <button type="submit" className="ma-btn" disabled={busy}>
              {busy ? "Verifying..." : "Verify & Mark Attendance"}
            </button>

            <div className="ma-row">
              <button type="button" className="ma-text-btn" onClick={changeEmail} disabled={busy}>
                Change email
              </button>
              <button
                type="button"
                className="ma-text-btn"
                disabled={cooldown > 0 || busy}
                onClick={requestOtp}
              >
                {cooldown > 0 ? `Resend OTP in ${cooldown}s` : "Resend OTP"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default MarkAttendance;
