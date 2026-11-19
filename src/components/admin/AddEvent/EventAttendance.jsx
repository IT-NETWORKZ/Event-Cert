import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ArrowLeft, CalendarDays, Download, ClipboardList, UserCheck, UserX, Users } from "lucide-react";
import DataTable from "../../common/Table/DataTable";
import {
  getAdminAttendanceEvents,
  getAdminAttendanceReport,
  parseAttendanceError,
} from "../../../api/eventService";
import "./EventAttendance.css";

/* ==========================================================================
   EVENT ATTENDANCE DASHBOARD  (admin)
   GET /api/admin/attendance/events   -> dropdown
   GET /api/admin/attendance/report   -> participants + present / absent for the chosen date
   ========================================================================== */
const pad = (n) => String(n).padStart(2, "0");

const localToday = () => {
  const d = new Date();
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
};

// "2026-11-13" -> "13-11-2026"
const dmy = (iso) => {
  const [y, m, d] = String(iso || "").slice(0, 10).split("-");
  return y && m && d ? `${d}-${m}-${y}` : "";
};

// first defined value among several possible API property names
const pick = (o, ...keys) => {
  for (const k of keys) if (o?.[k] !== undefined && o?.[k] !== null) return o[k];
  return "";
};

// attendance time -> "13-11-2026 09:42 AM" (IST). Values with Z / offset are converted to IST.
const fmtTime = (v) => {
  if (!v) return "";
  const s = String(v);
  const d = new Date(s);
  if (Number.isNaN(d.getTime())) return s;
  const hasZone = /(Z|[+-]\d{2}:?\d{2})$/.test(s);
  const parts = hasZone
    ? new Intl.DateTimeFormat("en-GB", {
        timeZone: "Asia/Kolkata", day: "2-digit", month: "2-digit", year: "numeric",
        hour: "2-digit", minute: "2-digit", hour12: true,
      }).formatToParts(d).reduce((a, p) => ({ ...a, [p.type]: p.value }), {})
    : {
        day: pad(d.getDate()), month: pad(d.getMonth() + 1), year: d.getFullYear(),
        hour: pad(d.getHours() % 12 || 12), minute: pad(d.getMinutes()),
        dayPeriod: d.getHours() >= 12 ? "pm" : "am",
      };
  return `${parts.day}-${parts.month}-${parts.year} ${parts.hour}:${parts.minute} ${String(parts.dayPeriod).toUpperCase()}`;
};

const mapEvent = (e) => ({
  id: String(pick(e, "eventId", "id")),
  title: pick(e, "eventTitle", "title", "name") || "Untitled event",
  start: String(pick(e, "eventStartDate", "startDate")).slice(0, 10),
  end: String(pick(e, "eventCompletionDate", "eventEndDate", "endDate")).slice(0, 10),
});

const mapRow = (p, i) => {
  const raw = String(pick(p, "attendanceStatus", "status")).toLowerCase();
  const present = p?.isPresent === true || p?.present === true || raw === "present" || raw === "p";
  return {
    regId: pick(p, "registrationId", "participantId", "id") || i + 1,
    name: pick(p, "participantName", "fullName", "name"),
    email: pick(p, "email", "emailId"),
    mobile: pick(p, "whatsAppNo", "whatsappNo", "mobile", "mobileNo"),
    status: present ? "Present" : "Absent",
    time: present ? fmtTime(pick(p, "attendanceTime", "markedAt", "attendanceDateTime", "attendanceDate")) : "",
  };
};

// keep today's date inside the event's date range (the API rejects other dates)
const clampDate = (ev) => {
  const t = localToday();
  if (!ev) return t;
  if (ev.start && t < ev.start) return ev.start;
  if (ev.end && t > ev.end) return ev.end;
  return t;
};

/* ==========================================================================
   COMPONENT
   ========================================================================== */
const EventAttendance = () => {
  const navigate = useNavigate();
  const [params, setParams] = useSearchParams();

  // event opened from "View Attendance" in the Event Details table
  const passedId = params.get("eventId") || params.get("nID") || "";

  const [events, setEvents] = useState([]);
  const [eventsLoading, setEventsLoading] = useState(true);
  const [eventId, setEventId] = useState(passedId ? String(passedId) : "");
  const [date, setDate] = useState(localToday());
  const [rows, setRows] = useState([]);
  const [reportLoading, setReportLoading] = useState(false);
  const [reportError, setReportError] = useState("");
  const [msg, setMsg] = useState({ type: "", text: "" });

  useEffect(() => {
    if (!msg.text) return undefined;
    const t = setTimeout(() => setMsg({ type: "", text: "" }), 3500);
    return () => clearTimeout(t);
  }, [msg]);

  /* ---------- events for the dropdown ---------- */
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const list = (await getAdminAttendanceEvents()).map(mapEvent);
        if (cancelled) return;
        setEvents(list);
        const first = list.find((e) => e.id === String(passedId));
        if (first) setDate(clampDate(first));
      } catch (err) {
        if (!cancelled) setMsg({ type: "error", text: parseAttendanceError(err).message });
      } finally {
        if (!cancelled) setEventsLoading(false);
      }
    })();
    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const event = useMemo(() => events.find((e) => e.id === eventId) || null, [events, eventId]);

  /* ---------- report for the chosen event + date ---------- */
  const loadReport = useCallback(async () => {
    if (!eventId || !date) {
      setRows([]);
      setReportError("");
      return;
    }
    setReportLoading(true);
    setReportError("");
    try {
      const report = await getAdminAttendanceReport({ eventId: Number(eventId), date });
      const list = Array.isArray(report) ? report : pick(report, "participants", "attendance", "records", "rows") || [];
      setRows(list.map(mapRow));
    } catch (err) {
      setRows([]);
      setReportError(parseAttendanceError(err).message);
    } finally {
      setReportLoading(false);
    }
  }, [eventId, date]);

  useEffect(() => {
    loadReport();
  }, [loadReport]);

  const total = rows.length;
  const present = rows.filter((r) => r.status === "Present").length;
  const absent = total - present;

  const handleSelect = (e) => {
    const id = e.target.value;
    setEventId(id);
    setParams(id ? { eventId: id } : {}, { replace: true });
    const ev = events.find((x) => x.id === id);
    if (ev) setDate(clampDate(ev));
  };

  /* ---------------- table ---------------- */
  const columns = useMemo(
    () => [
      { header: "Registration ID", accessorKey: "regId", meta: { className: "text-center", width: "150px" } },
      { header: "Participant Name", accessorKey: "name", meta: { className: "text-center", width: "210px" } },
      { header: "Email", accessorKey: "email", meta: { className: "text-center", width: "260px" } },
      { header: "Mobile", accessorKey: "mobile", meta: { className: "text-center", width: "160px" } },
      {
        header: "Attendance Status",
        accessorKey: "status",
        meta: { className: "text-center", width: "170px" },
        cell: ({ getValue }) => (
          <span className={`ea-badge ea-${String(getValue()).toLowerCase()}`}>{getValue()}</span>
        ),
      },
      {
        header: "Attendance Time (IST)",
        accessorKey: "time",
        meta: { className: "text-center", width: "210px" },
        cell: ({ getValue }) => getValue() || "-",
      },
    ],
    []
  );

  /* ---------------- export: every row of the table, opens in Excel ---------------- */
  const exportCsv = () => {
    if (!event) {
      setMsg({ type: "error", text: "Please select an event first." });
      return;
    }
    if (!rows.length) {
      setMsg({ type: "error", text: "No records to export." });
      return;
    }
    const esc = (v) => `"${String(v ?? "").replace(/"/g, '""')}"`;
    const head = ["Registration ID", "Participant Name", "Email", "Mobile", "Attendance Status", "Attendance Time (IST)"];
    const lines = rows.map((r) => [r.regId, r.name, r.email, r.mobile, r.status, r.time || "-"].map(esc).join(","));
    const blob = new Blob(["\ufeff" + [head.map(esc).join(","), ...lines].join("\r\n")], {
      type: "text/csv;charset=utf-8;",
    });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `attendance-${event.title.replace(/[^a-z0-9]+/gi, "-")}-${date}.csv`;
    a.click();
    URL.revokeObjectURL(a.href);
    setMsg({ type: "ok", text: `Exported ${rows.length} record(s).` });
  };

  const stats = [
    { label: "Total Registered Participants", value: total, icon: <Users size={26} />, theme: "total" },
    { label: "Present", value: present, icon: <UserCheck size={26} />, theme: "present" },
    { label: "Absent", value: absent, icon: <UserX size={26} />, theme: "absent" },
  ];

  /* ---------------- UI ---------------- */
  return (
    <div className="ea-page">
      <div className="ea-card">
        <div className="ea-head">
          <h3 className="ea-title">Event Attendance Dashboard</h3>
          <button type="button" className="ea-back" onClick={() => navigate(-1)}>
            <ArrowLeft size={16} /> Back
          </button>
        </div>

        {msg.text && <div className={`ea-msg ${msg.type}`}>{msg.text}</div>}

        {/* filters */}
        <div className="ea-filters">
          <label className="ea-field ea-field-grow">
            <span>Select Event</span>
            <select value={eventId} onChange={handleSelect} disabled={eventsLoading}>
              <option value="">{eventsLoading ? "Loading events..." : "Select Event"}</option>
              {events.map((e) => (
                <option key={e.id} value={e.id}>{e.title}</option>
              ))}
            </select>
          </label>

          <label className="ea-field ea-field-grow">
            <span><CalendarDays size={14} /> Attendance Date</span>
            <input
              type="date"
              value={date}
              min={event?.start || undefined}
              max={event?.end || undefined}
              onChange={(e) => setDate(e.target.value)}
            />
          </label>

          <button type="button" className="ea-export" onClick={exportCsv}>
            <Download size={18} />
            <span>Export Excel CSV</span>
          </button>
        </div>

        {/* counts */}
        <div className="ea-stats">
          {stats.map((s) => (
            <div className={`ea-stat ea-stat-${s.theme}`} key={s.label}>
              <div className="ea-stat-icon">{s.icon}</div>
              <div className="ea-stat-text">
                <span>{s.label}</span>
                <strong>{s.value.toLocaleString("en-IN")}</strong>
              </div>
            </div>
          ))}
        </div>

        {/* table */}
        <div className="ea-details">
          <h4 className="ea-details-title">
            <ClipboardList size={20} />
            Participant Attendance Details
            {event && date ? <small style={{ fontWeight: 500, fontSize: 14 }}>({dmy(date)})</small> : null}
          </h4>

          {!event ? (
            <div className="ea-empty">Please select an event to view its attendance.</div>
          ) : reportLoading ? (
            <div className="ea-empty">Loading attendance...</div>
          ) : reportError ? (
            <div className="ea-empty">{reportError}</div>
          ) : rows.length === 0 ? (
            <div className="ea-empty">No registered participants found.</div>
          ) : (
            <div className="ea-table">
              <DataTable columns={columns} data={rows} centerToolbar />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EventAttendance;
