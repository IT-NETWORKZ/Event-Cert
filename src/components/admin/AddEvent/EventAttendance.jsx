import React, { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { ArrowLeft, CalendarDays, Download, ClipboardList, UserCheck, UserX, Users } from "lucide-react";
import DataTable from "../../common/Table/DataTable";
import "./EventAttendance.css";

/* ==========================================================================
   STATIC DATA (no API yet)
   - events in the dropdown
   - participants of every event
   - present / absent is worked out for the chosen date
   ========================================================================== */
const STATIC_EVENTS = [
  { id: "S1", title: "Tech Summit 2026", count: 24 },
  { id: "S2", title: "AI & ML Workshop", count: 18 },
  { id: "S3", title: "UI/UX Design Forum", count: 15 },
  { id: "S4", title: "Cybersecurity Expo", count: 12 },
  { id: "S5", title: "Kubernetes Days", count: 8 },
  { id: "S6", title: "CI/CD Bootcamp", count: 0 }, // shows the "No registered participants" state
];

const NAMES = [
  "Rahul Patil", "Sneha Joshi", "Amit Shah", "Priya Deshmukh", "Karan Mehta",
  "Anjali Verma", "Rohan Kulkarni", "Neha Singh", "Vikram Rao", "Pooja Nair",
  "Sahil Khan", "Divya Iyer", "Manish Gupta", "Kavya Reddy", "Arjun Bhatt",
  "Ritu Sharma", "Harsh Jain", "Meera Pillai", "Yash Thakur", "Isha Kapoor",
  "Nikhil Bose", "Tanvi Gokhale", "Aditya Rane", "Swati Menon",
];

const pad = (n) => String(n).padStart(2, "0");

const localToday = () => {
  const d = new Date();
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
};

// "2026-11-13" -> "13-11-2026"
const dmy = (iso) => {
  const [y, m, d] = String(iso || "").split("-");
  return y && m && d ? `${d}-${m}-${y}` : "";
};

const makeParticipants = (event) => {
  const seed = [...String(event.id)].reduce((a, c) => a + c.charCodeAt(0), 0);
  return Array.from({ length: event.count }, (_, i) => {
    const name = NAMES[(i + seed) % NAMES.length];
    return {
      regId: 4000 + seed * 3 + i,
      name,
      email: `${name.split(" ")[0].toLowerCase()}${i + 1}@gmail.com`,
      mobile: `98${String(76543210 + (seed + i) * 1357).slice(0, 8)}`,
    };
  });
};

// same person + same date always gives the same result; future dates are all Absent
const markAttendance = (p, date) => {
  if (!date || date > localToday()) return { status: "Absent", time: "" };
  const day = Math.floor(Date.parse(date) / 86400000);
  if ((p.regId * 7 + day * 13) % 100 >= 60) return { status: "Absent", time: "" };
  const mins = 9 * 60 + ((p.regId * 11 + day) % 150); // between 09:00 and 11:29
  const hh = Math.floor(mins / 60);
  return {
    status: "Present",
    time: `${dmy(date)} ${pad(hh % 12 || 12)}:${pad(mins % 60)} ${hh >= 12 ? "PM" : "AM"}`,
  };
};

/* ==========================================================================
   COMPONENT
   ========================================================================== */
const EventAttendance = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [params, setParams] = useSearchParams();

  // event opened from "View Attendance" in the Event Details table
  const passedId = params.get("eventId") || params.get("nID");
  const passedTitle = location.state?.eventTitle;

  const events = useMemo(() => {
    if (passedId && !STATIC_EVENTS.some((e) => e.id === String(passedId))) {
      return [
        { id: String(passedId), title: passedTitle || `Event #${passedId}`, count: 10 + (Number(passedId) % 9 || 4) },
        ...STATIC_EVENTS,
      ];
    }
    return STATIC_EVENTS;
  }, [passedId, passedTitle]);

  const [eventId, setEventId] = useState(passedId ? String(passedId) : "");
  const [date, setDate] = useState(localToday());
  const [msg, setMsg] = useState({ type: "", text: "" });

  useEffect(() => {
    if (!msg.text) return undefined;
    const t = setTimeout(() => setMsg({ type: "", text: "" }), 3500);
    return () => clearTimeout(t);
  }, [msg]);

  const event = events.find((e) => e.id === eventId) || null;

  const rows = useMemo(
    () => (event ? makeParticipants(event).map((p) => ({ ...p, ...markAttendance(p, date) })) : []),
    [event, date]
  );

  const total = rows.length;
  const present = rows.filter((r) => r.status === "Present").length;
  const absent = total - present;

  const handleSelect = (e) => {
    const id = e.target.value;
    setEventId(id);
    setParams(id ? { eventId: id } : {}, { replace: true });
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
            <select value={eventId} onChange={handleSelect}>
              <option value="">Select Event</option>
              {events.map((e) => (
                <option key={e.id} value={e.id}>{e.title}</option>
              ))}
            </select>
          </label>

          <label className="ea-field ea-field-grow">
            <span><CalendarDays size={14} /> Attendance Date</span>
            <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
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
          </h4>

          {!event ? (
            <div className="ea-empty">Please select an event to view its attendance.</div>
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
