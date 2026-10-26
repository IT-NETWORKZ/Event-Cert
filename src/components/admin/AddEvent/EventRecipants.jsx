import React, { useMemo, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./EventRecipants.css";
import DataTable from "../../common/Table/DataTable";

/* ==========================================================================
   STATIC DATA (no API) - every registration of every event
   ========================================================================== */
const eventTitles = [
  "Tech Summit 2026",
  "AI & ML Workshop",
  "UI/UX Design Forum",
  "Cybersecurity Expo",
  "Kubernetes Days",
  "CI/CD Bootcamp",
];

const names = [
  "Rahul Patil", "Sneha Joshi", "Amit Shah", "Priya Deshmukh", "Karan Mehta",
  "Anjali Verma", "Rohan Kulkarni", "Neha Singh", "Vikram Rao", "Pooja Nair",
  "Sahil Khan", "Divya Iyer", "Manish Gupta", "Kavya Reddy", "Arjun Bhatt",
  "Ritu Sharma", "Harsh Jain", "Meera Pillai", "Yash Thakur", "Isha Kapoor",
  "Nikhil Bose", "Tanvi Gokhale", "Aditya Rane", "Swati Menon",
];

const initialRows = names.map((name, i) => ({
  id: 5001 + i,
  eventTitle: eventTitles[i % eventTitles.length],
  name,
  email: `${name.split(" ")[0].toLowerCase()}${i + 1}@gmail.com`,
  mobile: `98${String(76543210 + i * 1357).slice(0, 8)}`,
}));

/* ==========================================================================
   COMPONENT
   ========================================================================== */
const EventRecipants = () => {
  const navigate = useNavigate();
  const [rows] = useState(initialRows);
  const [selectedIds, setSelectedIds] = useState([]);
  const [sendId, setSendId] = useState("");
  const [msg, setMsg] = useState({ type: "", text: "" });

  // message disappears by itself
  useEffect(() => {
    if (!msg.text) return undefined;
    const t = setTimeout(() => setMsg({ type: "", text: "" }), 3500);
    return () => clearTimeout(t);
  }, [msg]);

  const toggleOne = (id) =>
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));

  /* ---------------- columns ---------------- */
  const columns = useMemo(() => {
    const center = "text-center";
    return [
      {
        id: "select",
        enableSorting: false,
        meta: { className: center, width: "140px" },
        header: ({ table }) => {
          const ids = table.getRowModel().rows.map((r) => r.original.id);
          const all = ids.length > 0 && ids.every((id) => selectedIds.includes(id));
          return (
            <label className="er-select-all" onClick={(e) => e.stopPropagation()}>
              <input
                type="checkbox"
                checked={all}
                onChange={(e) =>
                  setSelectedIds((prev) =>
                    e.target.checked ? Array.from(new Set([...prev, ...ids])) : prev.filter((id) => !ids.includes(id))
                  )
                }
              />
              Select All
            </label>
          );
        },
        cell: ({ row }) => (
          <input
            type="checkbox"
            className="er-check"
            checked={selectedIds.includes(row.original.id)}
            onChange={() => toggleOne(row.original.id)}
          />
        ),
      },
      { header: "Sr. No.", id: "srNo", enableSorting: false, meta: { className: center, width: "90px" }, cell: ({ row }) => row.index + 1 },
      { header: "Event Title", accessorKey: "eventTitle", meta: { className: center, width: "260px" } },
      { header: "Name", accessorKey: "name", meta: { className: center, width: "220px" } },
      { header: "Email Id", accessorKey: "email", meta: { className: center, width: "280px" } },
      { header: "Mobile No.", accessorKey: "mobile", meta: { className: center, width: "170px" } },
    ];
  }, [selectedIds]);

  /* ---------------- actions ---------------- */
  // downloads a CSV (opens in Excel): ticked rows, or every row if none are ticked
  const exportCsv = () => {
    const list = selectedIds.length ? rows.filter((r) => selectedIds.includes(r.id)) : rows;
    const esc = (v) => `"${String(v ?? "").replace(/"/g, '""')}"`;
    const head = ["Sr. No.", "Event Title", "Name", "Email Id", "Mobile No."];
    const lines = list.map((r, i) => [i + 1, r.eventTitle, r.name, r.email, r.mobile].map(esc).join(","));
    const blob = new Blob(["\ufeff" + [head.map(esc).join(","), ...lines].join("\r\n")], {
      type: "text/csv;charset=utf-8;",
    });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "event-recipants.csv";
    a.click();
    URL.revokeObjectURL(a.href);
  };

  const handleSend = () => {
    if (!sendId.trim()) {
      setMsg({ type: "error", text: "Please enter the Id." });
      return;
    }
    setMsg({
      type: "ok",
      text: selectedIds.length
        ? `Mail sent to ${selectedIds.length} selected participant(s) for Id: ${sendId.trim()}`
        : `Mail sent for Id: ${sendId.trim()}`,
    });
    setSendId("");
  };

  /* ---------------- UI ---------------- */
  return (
    <div className="er-page">
      <div className="er-card">
        <button type="button" className="er-back" onClick={() => navigate(-1)}>
          <i className="fa fa-arrow-left" /> Back
        </button>

        <h3 className="er-title">Events Reg. Details</h3>

        {msg.text && <div className={`er-msg ${msg.type}`}>{msg.text}</div>}

        <div className="er-action-bar">
          <div className="er-left">
            <button type="button" className="btn btn-success er-btn" onClick={exportCsv}>
              Export to Excel
            </button>
          </div>
          <div className="er-right">
            <input
              type="text"
              className="er-id-input"
              placeholder="Id *"
              maxLength={30}
              value={sendId}
              onChange={(e) => setSendId(e.target.value.replace(/[^0-9.\s-]/g, ""))}
            />
            <button type="button" className="btn btn-primary er-btn" onClick={handleSend}>
              Send
            </button>
          </div>
        </div>

        <div className="er-table">
          <DataTable columns={columns} data={rows} centerToolbar />
        </div>
      </div>
    </div>
  );
};

export default EventRecipants;
