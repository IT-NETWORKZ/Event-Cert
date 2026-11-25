import React, { useState, useEffect, useRef, useCallback } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  CheckCircle2,
  ClipboardCheck,
  Clock,
  Loader2,
  Mail,
  Phone,
  RefreshCw,
  Send,
  ShieldCheck,
  Sparkles,
  Star,
  User,
} from "lucide-react";
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

const RATE_TEXT = ["Tap a star to rate", "Poor", "Fair", "Good", "Very good", "Excellent"];
const MAX_TEXT = 500;

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
    ctx.fillStyle = "#e8f3f1";
    ctx.fillRect(0, 0, w, h);

    for (let i = 0; i < 6; i++) {
      ctx.strokeStyle = `rgba(${Math.random() * 60 + 20},${Math.random() * 80 + 60},${Math.random() * 80 + 60},.5)`;
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.moveTo(Math.random() * w, Math.random() * h);
      ctx.bezierCurveTo(Math.random() * w, Math.random() * h, Math.random() * w, Math.random() * h, Math.random() * w, Math.random() * h);
      ctx.stroke();
    }
    for (let i = 0; i < 40; i++) {
      ctx.fillStyle = `rgba(13,78,67,${Math.random() * 0.25})`;
      ctx.fillRect(Math.random() * w, Math.random() * h, 2, 2);
    }

    const step = w / (code.length + 1);
    [...code].forEach((ch, i) => {
      ctx.save();
      ctx.translate(step * (i + 1), h / 2 + (Math.random() * 8 - 4));
      ctx.rotate((Math.random() - 0.5) * 0.55);
      ctx.font = `700 ${24 + Math.random() * 6}px Georgia, serif`;
      ctx.fillStyle = ["#0d4e43", "#1e3a8a", "#9a3412", "#4c1d95"][i % 4];
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(ch, 0, 0);
      ctx.restore();
    });
  }, [code]);

  return (
    <div className="evs-captcha">
      <canvas ref={ref} width={180} height={52} aria-label="Captcha image" />
      <button type="button" className="evs-icon-btn" onClick={onRefresh} title="Get a new code" aria-label="Refresh captcha">
        <RefreshCw size={17} />
      </button>
    </div>
  );
}

/* ---------- Question renderers ---------- */
function RatingInput({ value, onChange }) {
  const [hover, setHover] = useState(0);
  const shown = hover || value;
  return (
    <div className="evs-rating-wrap">
      <div className="evs-rating" role="radiogroup" onMouseLeave={() => setHover(0)}>
        {[1, 2, 3, 4, 5].map((n) => (
          <button
            key={n}
            type="button"
            role="radio"
            aria-checked={value === n}
            aria-label={`${n} star${n > 1 ? "s" : ""}`}
            className={`evs-star ${shown >= n ? "on" : ""}`}
            onMouseEnter={() => setHover(n)}
            onClick={() => onChange(n)}
          >
            <Star size={28} fill={shown >= n ? "currentColor" : "none"} />
          </button>
        ))}
      </div>
      <span className="evs-rating-text">{RATE_TEXT[shown]}</span>
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
  const eventTitle = location.state?.eventTitle || "";

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

  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, []);

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

  const stepItems = [
    { n: 1, label: "Your details" },
    { n: 2, label: "Survey questions" },
  ];

  return (
    <section className="evs-page">
      <div className="evs-wrap">
        <button type="button" className="evs-back" onClick={() => navigate(-1)}>
          <ArrowLeft size={16} /> Back to event
        </button>

        <div className="evs-layout">
          {/* ===== LEFT: INTRO PANEL ===== */}
          <aside className="evs-aside">
            <span className="evs-aside-icon"><ClipboardCheck size={26} /></span>
            <h1>Event Survey</h1>
            <p className="evs-aside-event">
              {eventTitle ? <>Tell us how <b>{eventTitle}</b> went.</> : "Tell us how the event went."}
            </p>

            <ul className="evs-points">
              <li><Clock size={17} /><span>Takes about two minutes to complete.</span></li>
              <li><ShieldCheck size={17} /><span>Your email and mobile number stay private.</span></li>
              <li><Sparkles size={17} /><span>Your answers help us plan better events.</span></li>
            </ul>
          </aside>

          {/* ===== RIGHT: FORM PANEL ===== */}
          <main className="evs-panel">
            {step !== 3 && (
              <ol className="evs-steps" aria-label="Progress">
                {stepItems.map((s, i) => (
                  <li key={s.n} className={`${step === s.n ? "current" : ""} ${step > s.n ? "done" : ""}`}>
                    <span className="evs-step-dot">{step > s.n ? <Check size={15} /> : s.n}</span>
                    <span className="evs-step-label">{s.label}</span>
                    {i < stepItems.length - 1 && <span className="evs-step-bar" aria-hidden="true" />}
                  </li>
                ))}
              </ol>
            )}

            {/* ===== STEP 1 ===== */}
            {step === 1 && (
              <form onSubmit={handleContinue} noValidate>
                <div className="evs-form-head">
                  <h2>Your details</h2>
                  <p>Tell us who is giving this feedback.</p>
                </div>

                <div className="evs-grid">
                  <div className={`evs-field ${errors.name ? "err" : ""}`}>
                    <label htmlFor="evs-name">Full name <em>*</em></label>
                    <div className="evs-input">
                      <User size={17} />
                      <input id="evs-name" type="text" value={form.name} autoComplete="name" placeholder="Your name" maxLength={100}
                        onChange={(e) => setField("name", e.target.value)} />
                    </div>
                    {errors.name && <small>{errors.name}</small>}
                  </div>

                  <div className={`evs-field ${errors.phone ? "err" : ""}`}>
                    <label htmlFor="evs-phone">Mobile number <em>*</em></label>
                    <div className="evs-input">
                      <Phone size={17} />
                      <span className="evs-prefix">+91</span>
                      <input id="evs-phone" type="tel" inputMode="numeric" maxLength={10} value={form.phone} autoComplete="tel-national"
                        placeholder="10-digit number" onChange={(e) => setField("phone", e.target.value.replace(/\D/g, ""))} />
                    </div>
                    {errors.phone && <small>{errors.phone}</small>}
                  </div>

                  <div className={`evs-field evs-span2 ${errors.email ? "err" : ""}`}>
                    <label htmlFor="evs-email">Email <em>*</em></label>
                    <div className="evs-input">
                      <Mail size={17} />
                      <input id="evs-email" type="email" value={form.email} autoComplete="email" placeholder="you@example.com" maxLength={150}
                        onChange={(e) => setField("email", e.target.value)} />
                    </div>
                    {errors.email && <small>{errors.email}</small>}
                  </div>

                  <div className={`evs-field evs-span2 ${errors.captcha ? "err" : ""}`}>
                    <label htmlFor="evs-captcha">Type the code shown <em>*</em></label>
                    <div className="evs-captcha-row">
                      <Captcha code={code} onRefresh={refreshCaptcha} />
                      <div className="evs-input evs-captcha-input">
                        <ShieldCheck size={17} />
                        <input id="evs-captcha" type="text" value={form.captcha} autoComplete="off" placeholder="Enter code"
                          onChange={(e) => setField("captcha", e.target.value)} />
                      </div>
                    </div>
                    {errors.captcha && <small>{errors.captcha}</small>}
                  </div>
                </div>

                <div className="evs-actions end">
                  <button type="submit" className="evs-btn">
                    Continue <ArrowRight size={17} />
                  </button>
                </div>
              </form>
            )}

            {/* ===== STEP 2 ===== */}
            {step === 2 && (
              <form onSubmit={handleSubmit} noValidate>
                <div className="evs-form-head">
                  <h2>Survey questions</h2>
                  <p>Questions marked with <em>*</em> are required.</p>
                </div>

                {loadingQ ? (
                  <div className="evs-loading"><Loader2 size={26} className="spin" /> Loading questions…</div>
                ) : (
                  <>
                    <div className="evs-progress-row">
                      <div className="evs-progress" role="progressbar" aria-valuenow={progress} aria-valuemin={0} aria-valuemax={100}>
                        <span style={{ width: `${progress}%` }} />
                      </div>
                      <span className="evs-progress-text">{answered} of {questions.length} answered</span>
                    </div>

                    <div className="evs-questions">
                      {questions.map((q, i) => (
                        <div key={q.id} className={`evs-q ${qErrors[q.id] ? "err" : ""}`}>
                          <div className="evs-q-head">
                            <span className="evs-q-num">{i + 1}</span>
                            <div className="evs-q-text">
                              {q.text}
                              {q.required && <em title="Required"> *</em>}
                            </div>
                          </div>

                          <div className="evs-q-body">
                            {q.type === "rating" && <RatingInput value={answers[q.id] || 0} onChange={(v) => setAnswer(q.id, v)} />}
                            {q.type === "choice" && <ChoiceInput options={q.options || []} value={answers[q.id]} onChange={(v) => setAnswer(q.id, v)} />}
                            {q.type === "yesno" && <ChoiceInput options={["Yes", "No"]} value={answers[q.id]} onChange={(v) => setAnswer(q.id, v)} />}
                            {q.type === "text" && (
                              <>
                                <textarea rows={4} maxLength={MAX_TEXT} value={answers[q.id] || ""} placeholder="Type your answer"
                                  onChange={(e) => setAnswer(q.id, e.target.value)} />
                                <span className="evs-count">{(answers[q.id] || "").length}/{MAX_TEXT}</span>
                              </>
                            )}
                          </div>

                          {qErrors[q.id] && <small className="evs-q-err">Please answer this question.</small>}
                        </div>
                      ))}
                    </div>

                    {submitError && <div className="evs-alert" role="alert">{submitError}</div>}

                    <div className="evs-actions">
                      <button type="button" className="evs-btn ghost" onClick={() => setStep(1)}>
                        <ArrowLeft size={17} /> Back
                      </button>
                      <button type="submit" className="evs-btn" disabled={submitting}>
                        {submitting ? (<><Loader2 size={17} className="spin" /> Sending…</>) : (<><Send size={16} /> Submit survey</>)}
                      </button>
                    </div>
                  </>
                )}
              </form>
            )}

            {/* ===== STEP 3 ===== */}
            {step === 3 && (
              <div className="evs-done">
                <span className="evs-done-icon"><CheckCircle2 size={44} /></span>
                <h2>Thank you, {form.name.trim().split(" ")[0]}!</h2>
                <p>Your survey has been recorded. We appreciate the time you took to share your experience.</p>
                <div className="evs-actions center">
                  <button type="button" className="evs-btn" onClick={() => navigate(-1)}>
                    <ArrowLeft size={17} /> Back to event
                  </button>
                </div>
              </div>
            )}
          </main>
        </div>
      </div>
    </section>
  );
}