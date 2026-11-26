import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AlertCircle, ArrowLeft, CalendarDays, CheckCircle2, Clock3, Eye, EyeOff, Mail, MessageSquareText, Phone, Search, Star } from "lucide-react";
import { getEvents } from "../../../api/adminService.js";
import "./AdminEventFeedback.css";

/* ==========================================================================
   ADMIN - EVENT FEEDBACK MANAGEMENT
   Route:  /admin/event-feedback      (opened from the feedback icon on Add Event)
   Review feedback submitted for events. Approve = shown publicly, Hide = removed from public.

   DATA LAYER (browser storage, same as the public feedback page).
   Replace loadAllFeedback() / saveStatus() with your API calls when the backend is ready.
   ========================================================================== */

const PREFIX = "eventcert_feedback_";
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const pad = (n) => String(n).padStart(2, "0");
const fmtDateTime = (iso) => {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  const h = d.getHours();
  return `${pad(d.getDate())} ${MONTHS[d.getMonth()]} ${d.getFullYear()} ${pad(h % 12 === 0 ? 12 : h % 12)}:${pad(d.getMinutes())} ${h >= 12 ? "PM" : "AM"}`;
};

// pending | approved | hidden
const statusOf = (f) => (f.approved ? "approved" : f.status === "hidden" ? "hidden" : "pending");
const STATUS_TEXT = { pending: "Pending", approved: "Approved", hidden: "Hidden" };

const loadAllFeedback = () => {
  const all = [];
  for (let i = 0; i < localStorage.length; i += 1) {
    const key = localStorage.key(i);
    if (!key || !key.startsWith(PREFIX)) continue;
    const eventId = key.slice(PREFIX.length);
    try {
      JSON.parse(localStorage.getItem(key) || "[]").forEach((f) => all.push({ ...f, eventId }));
    } catch {
      /* ignore broken entry */
    }
  }
  return all.sort((a, b) => new Date(b.date) - new Date(a.date));
};

const saveStatus = (eventId, id, status) => {
  const key = `${PREFIX}${eventId}`;
  let list = [];
  try {
    list = JSON.parse(localStorage.getItem(key) || "[]");
  } catch {
    list = [];
  }
  localStorage.setItem(
    key,
    JSON.stringify(list.map((f) => (f.id === id ? { ...f, approved: status === "approved", status } : f)))
  );
};

/* ========================================================================== */

const AdminEventFeedback = () => {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [events, setEvents] = useState([]);
  const [eventFilter, setEventFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [query, setQuery] = useState("");
  const [message, setMessage] = useState({ type: "", text: "" });

  const refresh = useCallback(() => setItems(loadAllFeedback()), []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  // event list for the filter + event names
  useEffect(() => {
    let cancelled = false;
    getEvents()
      .then((res) => {
        if (cancelled) return;
        const list = (res?.list || []).map((e) => ({
          id: String(e.id ?? e.eventId ?? ""),
          title: e.eventTitle ?? e.title ?? `Event #${e.id ?? e.eventId}`,
        }));
        setEvents(list.filter((e) => e.id));
      })
      .catch(() => {}); // filter still works from the feedback list
    return () => {
      cancelled = true;
    };
  }, []);

  const eventName = useCallback(
    (f) => events.find((e) => e.id === String(f.eventId))?.title || f.eventTitle || `Event #${f.eventId}`,
    [events]
  );

  // dropdown = events from the API + any event that already has feedback
  const eventOptions = useMemo(() => {
    const map = new Map(events.map((e) => [e.id, e.title]));
    items.forEach((f) => {
      if (!map.has(String(f.eventId))) map.set(String(f.eventId), f.eventTitle || `Event #${f.eventId}`);
    });
    return [...map.entries()].map(([id, title]) => ({ id, title }));
  }, [events, items]);

  const scoped = useMemo(
    () => items.filter((f) => eventFilter === "all" || String(f.eventId) === eventFilter),
    [items, eventFilter]
  );

  const counts = useMemo(() => {
    const c = { total: scoped.length, pending: 0, approved: 0, hidden: 0 };
    scoped.forEach((f) => { c[statusOf(f)] += 1; });
    return c;
  }, [scoped]);

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase();
    return scoped.filter(
      (f) =>
        (statusFilter === "all" || statusOf(f) === statusFilter) &&
        (!q || [f.name, f.email, f.mobile, f.feedback].some((v) => String(v || "").toLowerCase().includes(q)))
    );
  }, [scoped, statusFilter, query]);

  const changeStatus = (f, status) => {
    try {
      saveStatus(f.eventId, f.id, status);
      refresh();
      setMessage({
        type: "ok",
        text: status === "approved" ? "Feedback approved and now shown publicly." : "Feedback hidden from the public.",
      });
    } catch {
      setMessage({ type: "err", text: "Could not update the feedback. Please try again." });
    }
    setTimeout(() => setMessage({ type: "", text: "" }), 3500);
  };

  const tabs = [
    ["all", "All", counts.total],
    ["pending", "Pending", counts.pending],
    ["approved", "Approved", counts.approved],
    ["hidden", "Hidden", counts.hidden],
  ];

  return (
    <div>
      <div className="afb-container">
        <h2 className="afb-title">Event Feedback Management</h2>

        <button type="button" className="afb-back" onClick={() => navigate(-1)}>
          <ArrowLeft size={16} /> Back
        </button>

        <p className="afb-sub">
          Review feedback submitted for events. Approve feedback to display it publicly or hide it from the public.
        </p>

        {message.text && (
          <div className={`afb-alert ${message.type === "ok" ? "afb-alert-ok" : "afb-alert-err"}`} role="status">
            {message.type === "ok" ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
            <span>{message.text}</span>
          </div>
        )}

        {/* statistics */}
        <div className="afb-stats">
          <div className="afb-stat">
            <span className="afb-stat-icon"><MessageSquareText size={20} /></span>
            <div><strong>{counts.total}</strong><small>Total</small></div>
          </div>
          <div className="afb-stat pending">
            <span className="afb-stat-icon"><Clock3 size={20} /></span>
            <div><strong>{counts.pending}</strong><small>Pending</small></div>
          </div>
          <div className="afb-stat approved">
            <span className="afb-stat-icon"><Eye size={20} /></span>
            <div><strong>{counts.approved}</strong><small>Public</small></div>
          </div>
          <div className="afb-stat hidden">
            <span className="afb-stat-icon"><EyeOff size={20} /></span>
            <div><strong>{counts.hidden}</strong><small>Hidden</small></div>
          </div>
        </div>

        {/* filters */}
        <div className="afb-filters">
          <div className="afb-filter">
            <label htmlFor="afb-event">Filter by Event</label>
            <select id="afb-event" className="afb-select" value={eventFilter} onChange={(e) => setEventFilter(e.target.value)}>
              <option value="all">All Events</option>
              {eventOptions.map((e) => (
                <option key={e.id} value={e.id}>{e.title}</option>
              ))}
            </select>
          </div>

          <div className="afb-tabs" role="tablist">
            {tabs.map(([key, label, n]) => (
              <button
                key={key}
                type="button"
                role="tab"
                aria-selected={statusFilter === key}
                className={`afb-tab${statusFilter === key ? " active" : ""}`}
                onClick={() => setStatusFilter(key)}
              >
                {label} <span>{n}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="afb-table">
        <div className="afb-list-head">
          <h3 className="afb-table-title">Feedback Details</h3>
          <div className="afb-search">
            <Search size={17} />
            <input type="text" placeholder="Search name, email or feedback" value={query} onChange={(e) => setQuery(e.target.value)} />
          </div>
        </div>

        {rows.length ? (
          <div className="afb-cards">
            {rows.map((f) => {
              const st = statusOf(f);
              const r = Number(f.rating) || 0;
              return (
                <article className={`afb-card afb-card-${st}`} key={`${f.eventId}-${f.id}`}>
                  <div className="afb-card-top">
                    <div className="afb-avatar">{(f.name || "?").trim().charAt(0).toUpperCase()}</div>
                    <div className="afb-who">
                      <strong>{f.name}</strong>
                      <span className="afb-event-pill">{eventName(f)}</span>
                    </div>
                    <span className={`afb-status afb-${st}`}>{STATUS_TEXT[st]}</span>
                  </div>

                  <div className="afb-meta">
                    {r > 0 && (
                      <span className="afb-stars" title={`${r} / 5`}>
                        {[1, 2, 3, 4, 5].map((n) => (
                          <Star key={n} size={15} className={n <= r ? "afb-star on" : "afb-star"} />
                        ))}
                      </span>
                    )}
                    <span><CalendarDays size={14} /> {fmtDateTime(f.date)}</span>
                  </div>

                  <p className="afb-text">{f.feedback}</p>

                  <div className="afb-contact">
                    <span><Mail size={14} /> {f.email}</span>
                    <span><Phone size={14} /> {f.mobile || "-"}</span>
                  </div>

                  <div className="afb-actions">
                    <button type="button" className="afb-btn afb-approve" disabled={st === "approved"} onClick={() => changeStatus(f, "approved")}>
                      <Eye size={15} /> Approve / Show Publicly
                    </button>
                    <button type="button" className="afb-btn afb-hide" disabled={st === "hidden"} onClick={() => changeStatus(f, "hidden")}>
                      <EyeOff size={15} /> Hide
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        ) : (
          <p className="afb-empty">No feedback found.</p>
        )}
      </div>
    </div>
  );
};

export default AdminEventFeedback;
