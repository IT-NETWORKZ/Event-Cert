import React, { useState, useEffect, useRef, useCallback } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { RefreshCw, Star, CheckCircle2, ArrowLeft, Loader2, User, Phone, Mail, ShieldCheck } from "lucide-react";
import "./EventSurvey.css";

/* ====== CONFIG: change to your API ====== */
const API_BASE = import.meta.env?.VITE_API_BASE || "/api";
const QUESTIONS_URL = (nID) => `${API_BASE}/EventFeedback/GetQuestions?nID=${encodeURIComponent(nID)}`;
const SUBMIT_URL = `${API_BASE}/EventFeedback/SubmitFeedback`;

/* Fallback questions if API is not ready.
   type: rating | choice | yesno | text */
const FALLBACK_QUESTIONS = [
  { id: 1, type: "rating", text: "How would you rate the event overall?", required: true },
  { id: 2, type: "choice", text: "How did you hear about this event?", options: ["Social media", "Friend / colleague", "Email", "WhatsApp", "Other"], required: true },
  { id: 3, type: "yesno", text: "Was the event content useful to you?", required: true },
  { id: 4, type: "rating", text: "How was the venue and organisation?", required: false },
  { id: 5, type: "text", text: "Any suggestions to improve our next event?", required: false },
];

/* ---------- Captcha ---------- */
const CHARS = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789";
const makeCode = (n = 5) => Array.from({ length: n }, () => CHARS[Math.floor(Math.random() * CHARS.length)]).join("");

function Captcha({ code, onRefresh }) {
  const ref = useRef(null);

  useEffect(() => {
    const c = ref.current;
    if (!c) return;
    const ctx = c.getContext("2d");
    const w = c.width, h = c.height;
    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = "#eef2f7";
    ctx.fillRect(0, 0, w, h);

    for (let i = 0; i < 6; i++) {
      ctx.strokeStyle = `rgba(${Math.random() * 120 + 40},${Math.random() * 120 + 40},${Math.random() * 120 + 80},.55)`;
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.moveTo(Math.random() * w, Math.random() * h);
      ctx.bezierCurveTo(Math.random() * w, Math.random() * h, Math.random() * w, Math.random() * h, Math.random() * w, Math.random() * h);
      ctx.stroke();
    }
    for (let i = 0; i < 40; i++) {
      ctx.fillStyle = `rgba(30,41,59,${Math.random() * 0.25})`;
      ctx.fillRect(Math.random() * w, Math.random() * h, 2, 2);
    }

    const step = w / (code.length + 1);
    [...code].forEach((ch, i) => {
      ctx.save();
      ctx.translate(step * (i + 1), h / 2 + (Math.random() * 8 - 4));
      ctx.rotate((Math.random() - 0.5) * 0.55);
      ctx.font = `700 ${26 + Math.random() * 6}px Georgia, serif`;
      ctx.fillStyle = ["#0f766e", "#1e3a8a", "#9a3412", "#4c1d95"][i % 4];
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(ch, 0, 0);
      ctx.restore();
    });
  }, [code]);

  return (
    <div className="evs-captcha">
      <canvas ref={ref} width={190} height={56} aria-label="Captcha image" />
      <button type="button" className="evs-icon-btn" onClick={onRefresh} title="Get a new code" aria-label="Refresh captcha">
        <RefreshCw size={18} />
      </button>
    </div>
  );
}

/* ---------- Question renderers ---------- */
function RatingInput({ value, onChange }) {
  const [hover, setHover] = useState(0);
  return (
    <div className="evs-rating" role="radiogroup">
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          role="radio"
          aria-checked={value === n}
          aria-label={`${n} star${n > 1 ? "s" : ""}`}
          className={`evs-star ${(hover || value) >= n ? "on" : ""}`}
          onMouseEnter={() => setHover(n)}
          onMouseLeave={() => setHover(0)}
          onClick={() => onChange(n)}
        >
          <Star size={32} fill={(hover || value) >= n ? "currentColor" : "none"} />
        </button>
      ))}
    </div>
  );
}

function ChoiceInput({ options, value, onChange }) {
  return (
    <div className="evs-options">
      {options.map((o) => (
        <label key={o} className={`evs-option ${value === o ? "sel" : ""}`}>
          <input type="radio" checked={value === o} onChange={() => onChange(o)} />
          <span className="evs-radio-dot" />
          <span>{o}</span>
        </label>
      ))}
    </div>
  );
}

/* ---------- Main component ---------- */
export default function EventSurvey() {
  const navigate = useNavigate();
  const location = useLocation();
  const [params] = useSearchParams();
  const eventKey = params.get("nID") || "";
  const eventTitle = location.state?.eventTitle || "this event";

  const [step, setStep] = useState(1); // 1 = details, 2 = questions, 3 = done
  const [form, setForm] = useState({ name: "", phone: "", email: "", captcha: "" });
  const [errors, setErrors] = useState({});
  const [code, setCode] = useState(makeCode());

  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [qErrors, setQErrors] = useState({});
  const [loadingQ, setLoadingQ] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const refreshCaptcha = useCallback(() => {
    setCode(makeCode());
    setForm((f) => ({ ...f, captcha: "" }));
  }, []);

  const setField = (k, v) => {
    setForm((f) => ({ ...f, [k]: v }));
    setErrors((e) => ({ ...e, [k]: "" }));
  };

  /* ----- Step 1 validation ----- */
  const validateDetails = () => {
    const e = {};
    if (!form.name.trim() || form.name.trim().length < 2) e.name = "Enter your full name.";
    if (!/^[6-9]\d{9}$/.test(form.phone)) e.phone = "Enter a valid 10-digit mobile number.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(form.email)) e.email = "Enter a valid email address.";
    if (form.captcha !== code) e.captcha = "Code does not match. Try again.";
    setErrors(e);
    if (e.captcha) refreshCaptcha();
    return Object.keys(e).length === 0;
  };

  const loadQuestions = async () => {
    setLoadingQ(true);
    try {
      const res = await fetch(QUESTIONS_URL(eventKey));
      if (!res.ok) throw new Error("bad response");
      const data = await res.json();
      setQuestions(Array.isArray(data) && data.length ? data : FALLBACK_QUESTIONS);
    } catch {
      setQuestions(FALLBACK_QUESTIONS);
    } finally {
      setLoadingQ(false);
    }
  };

  const handleContinue = async (ev) => {
    ev.preventDefault();
    if (!validateDetails()) return;
    setStep(2);
    window.scrollTo({ top: 0, behavior: "smooth" });
    await loadQuestions();
  };

  /* ----- Step 2 submit ----- */
  const setAnswer = (id, v) => {
    setAnswers((a) => ({ ...a, [id]: v }));
    setQErrors((e) => ({ ...e, [id]: false }));
  };

  const handleSubmit = async (ev) => {
    ev.preventDefault();
    const e = {};
    questions.forEach((q) => {
      const v = answers[q.id];
      if (q.required && (v === undefined || v === "" || v === null)) e[q.id] = true;
    });
    setQErrors(e);
    if (Object.keys(e).length) {
      const first = document.querySelector(".evs-q.err");
      first?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }

    setSubmitting(true);
    setSubmitError("");
    try {
      const payload = {
        eventKey,
        name: form.name.trim(),
        phone: form.phone,
        email: form.email.trim(),
        answers: questions.map((q) => ({ questionId: q.id, answer: answers[q.id] ?? "" })),
      };
      const res = await fetch(SUBMIT_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("submit failed");
      setStep(3);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch {
      setSubmitError("We could not save your feedback. Check your connection and try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const answered = questions.filter((q) => answers[q.id] !== undefined && answers[q.id] !== "").length;
  const progress = questions.length ? Math.round((answered / questions.length) * 100) : 0;

  return (
    <div className="evs-page">
      <div className="evs-shell">
        <header className="evs-head">
          {step !== 3 && (
            <button type="button" className="evs-back" onClick={() => (step === 2 ? setStep(1) : navigate(-1))}>
              <ArrowLeft size={18} /> Back
            </button>
          )}
          <h1>Event feedback</h1>
          <p>Tell us how {eventTitle} went. It takes about two minutes.</p>

          {step !== 3 && (
            <ol className="evs-steps" aria-label="Progress">
              <li className={step >= 1 ? "on" : ""}>Your details</li>
              <li className={step >= 2 ? "on" : ""}>Questions</li>
            </ol>
          )}
        </header>

        {/* ===== STEP 1 ===== */}
        {step === 1 && (
          <form className="evs-card" onSubmit={handleContinue} noValidate>
            <div className={`evs-field ${errors.name ? "err" : ""}`}>
              <label htmlFor="evs-name">Full name</label>
              <div className="evs-input">
                <User size={18} />
                <input id="evs-name" type="text" value={form.name} autoComplete="name" placeholder="Your name"
                  onChange={(e) => setField("name", e.target.value)} />
              </div>
              {errors.name && <small>{errors.name}</small>}
            </div>

            <div className={`evs-field ${errors.phone ? "err" : ""}`}>
              <label htmlFor="evs-phone">Mobile number</label>
              <div className="evs-input">
                <Phone size={18} />
                <span className="evs-prefix">+91</span>
                <input id="evs-phone" type="tel" inputMode="numeric" maxLength={10} value={form.phone} autoComplete="tel-national"
                  placeholder="10-digit number" onChange={(e) => setField("phone", e.target.value.replace(/\D/g, ""))} />
              </div>
              {errors.phone && <small>{errors.phone}</small>}
            </div>

            <div className={`evs-field ${errors.email ? "err" : ""}`}>
              <label htmlFor="evs-email">Email</label>
              <div className="evs-input">
                <Mail size={18} />
                <input id="evs-email" type="email" value={form.email} autoComplete="email" placeholder="you@example.com"
                  onChange={(e) => setField("email", e.target.value)} />
              </div>
              {errors.email && <small>{errors.email}</small>}
            </div>

            <div className={`evs-field ${errors.captcha ? "err" : ""}`}>
              <label htmlFor="evs-captcha">Type the code shown</label>
              <Captcha code={code} onRefresh={refreshCaptcha} />
              <div className="evs-input">
                <ShieldCheck size={18} />
                <input id="evs-captcha" type="text" value={form.captcha} autoComplete="off" placeholder="Enter code"
                  onChange={(e) => setField("captcha", e.target.value)} />
              </div>
              {errors.captcha && <small>{errors.captcha}</small>}
            </div>

            <button type="submit" className="evs-btn">Continue to questions</button>
          </form>
        )}

        {/* ===== STEP 2 ===== */}
        {step === 2 && (
          <form className="evs-card" onSubmit={handleSubmit} noValidate>
            {loadingQ ? (
              <div className="evs-loading"><Loader2 size={28} className="spin" /> Loading questions…</div>
            ) : (
              <>
                <div className="evs-progress" aria-label={`${progress}% answered`}>
                  <span style={{ width: `${progress}%` }} />
                </div>

                {questions.map((q, i) => (
                  <div key={q.id} className={`evs-q ${qErrors[q.id] ? "err" : ""}`}>
                    <div className="evs-q-text">
                      <b>{i + 1}.</b> {q.text}
                      {q.required && <em title="Required"> *</em>}
                    </div>

                    {q.type === "rating" && <RatingInput value={answers[q.id] || 0} onChange={(v) => setAnswer(q.id, v)} />}
                    {q.type === "choice" && <ChoiceInput options={q.options || []} value={answers[q.id]} onChange={(v) => setAnswer(q.id, v)} />}
                    {q.type === "yesno" && <ChoiceInput options={["Yes", "No"]} value={answers[q.id]} onChange={(v) => setAnswer(q.id, v)} />}
                    {q.type === "text" && (
                      <textarea rows={4} value={answers[q.id] || ""} placeholder="Type your answer"
                        onChange={(e) => setAnswer(q.id, e.target.value)} />
                    )}

                    {qErrors[q.id] && <small className="evs-q-err">Please answer this question.</small>}
                  </div>
                ))}

                {submitError && <div className="evs-alert">{submitError}</div>}

                <button type="submit" className="evs-btn" disabled={submitting}>
                  {submitting ? (<><Loader2 size={18} className="spin" /> Sending…</>) : "Submit feedback"}
                </button>
              </>
            )}
          </form>
        )}

        {/* ===== STEP 3 ===== */}
        {step === 3 && (
          <div className="evs-card evs-done">
            <CheckCircle2 size={64} />
            <h2>Thank you, {form.name.trim().split(" ")[0]}</h2>
            <p>Your feedback has been recorded.</p>
            <button type="button" className="evs-btn" onClick={() => navigate(-1)}>Back to event</button>
          </div>
        )}
      </div>
    </div>
  );
}
