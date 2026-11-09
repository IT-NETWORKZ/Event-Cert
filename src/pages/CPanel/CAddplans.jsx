import React, { useEffect, useMemo, useRef, useState } from "react";
import { Plus, X } from "lucide-react";
import DataTable from "../../components/common/Table/DataTable";
import Addplans from "../../components/cpanel/Addplans/Addplans"; // adjust path if needed
import "../../css/CAddplans.css";

const LIMIT = 40; // text longer than this gets Read more / Read less

// Long text cell: expands and collapses inside the row
const ExpandText = ({ text, bullets = false }) => {
  const [open, setOpen] = useState(false);
  const value = text || "";
  const long = value.length > LIMIT;
  const shown = long && !open ? `${value.slice(0, LIMIT)}…` : value;

  return (
    <div className="cap-text">
      <span className={bullets ? "cap-bullet" : ""}>{shown}</span>
      {long && (
        <button type="button" className="cap-more" onClick={() => setOpen((o) => !o)}>
          {open ? "Read less" : "Read more"}
        </button>
      )}
    </div>
  );
};

const money = (n) =>
  `₹${Number(n || 0).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

/* ---------- table row  <->  form data ---------- */

// table row -> form data (used when Edit is clicked)
const rowToForm = (r) => {
  const [num, ...unit] = String(r.duration || "").split(" ");
  return {
    planType: r.category,
    durationNum: num || "",
    durationUnit: unit.join(" ") || "Month/s",
    certificateQuantity: String(r.certQty ?? ""),
    eventQuantity: String(r.eventQty ?? ""),
    price: String(r.price ?? ""),
    title: r.title || "",
    instructionsPerfectFor: r.instruction1 || "",
    heading2: r.includes || "",
    instructionsIncludes: r.instruction2 || "",
  };
};

// form data -> table row (used when the form is submitted)
const formToRow = (f, old = {}) => ({
  id: old.id ?? Date.now(),
  category: f.planType,
  duration: `${f.durationNum} ${f.durationUnit}`,
  certQty: Number(f.certificateQuantity) || 0,
  eventQty: Number(f.eventQuantity) || 0,
  downloadQty: old.downloadQty ?? 0,
  price: Number(f.price) || 0,
  title: f.title,
  instruction1: f.instructionsPerfectFor,
  includes: f.heading2,
  instruction2: f.instructionsIncludes,
  enabled: old.enabled ?? true,
});

// Sample data: replace with your API response
const sampleData = [
  { id: 1, category: "Event", duration: "6 Week/s", certQty: 0, eventQty: 5, downloadQty: 0, price: 1499, title: "Who should choose this?", instruction1: "Duration: Up to 45 Days of event promotion and registrations.", includes: "What you can achieve", instruction2: "Promote events by sharing registration links and QR codes.", enabled: true },
  { id: 2, category: "Event", duration: "2 Month/s", certQty: 0, eventQty: 15, downloadQty: 0, price: 4499, title: "Who should choose this?", instruction1: "Duration: Up to 60 Days of event promotion and registrations.", includes: "What you can achieve", instruction2: "Run longer, structured events with complete participant tracking.", enabled: true },
  { id: 3, category: "Event", duration: "3 Month/s", certQty: 0, eventQty: 30, downloadQty: 0, price: 7999, title: "Who should choose this?", instruction1: "Duration: Up to 90 Days of event promotion and registrations.", includes: "What you can achieve", instruction2: "Manage extended, multi-event programs from one dashboard.", enabled: true },
  { id: 4, category: "Event", duration: "4 Month/s", certQty: 0, eventQty: 40, downloadQty: 0, price: 10999, title: "Who should choose this?", instruction1: "Duration: Up to 120 Days of event promotion and registrations.", includes: "What you can achieve", instruction2: "Maximize reach with long-running campaigns and reports.", enabled: false },
];

/* form wrapper + close button (inline styles, so no CSS file needs to change) */
const formWrapStyle = { position: "relative", maxWidth: 660, margin: "0 auto 24px" };
const closeStyle = {
  position: "absolute",
  top: 16,
  right: 16,
  zIndex: 1,
  width: 34,
  height: 34,
  display: "grid",
  placeItems: "center",
  border: 0,
  borderRadius: "50%",
  background: "#eef7f6",
  color: "#173c39",
  cursor: "pointer",
};

const CAddplans = ({ data = sampleData }) => {
  // keeps the table working until you connect your API
  const [rows, setRows] = useState(data);

  // form above the table: closed / add (editing = null) / edit (editing = row)
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const formRef = useRef(null);

  const openAdd = () => {
    setEditing(null);
    setFormOpen(true);
  };
  const openEdit = (row) => {
    setEditing(row);
    setFormOpen(true);
  };
  const closeForm = () => setFormOpen(false);

  // scroll up to the form whenever it opens (or switches between plans)
  useEffect(() => {
    if (formOpen && formRef.current) {
      formRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [formOpen, editing]);

  // Submit clicked in the form
  const handleSave = (formData) => {
    if (editing) {
      // TODO: call your UPDATE plan API here
      setRows((prev) => prev.map((r) => (r.id === editing.id ? formToRow(formData, r) : r)));
    } else {
      // TODO: call your ADD plan API here
      setRows((prev) => [...prev, formToRow(formData)]);
    }
    closeForm();
  };

  const toggleStatus = (id) => {
    // TODO: call your enable / disable API here
    setRows((prev) => prev.map((r) => (r.id === id ? { ...r, enabled: !r.enabled } : r)));
  };

  const columns = useMemo(
    () => [
      {
        id: "srNo",
        header: "Sr. No.",
        enableSorting: false,
        cell: ({ row }) => row.index + 1,
        meta: { className: "text-center", width: "80px" },
      },
      { accessorKey: "category", header: "Category", meta: { className: "text-center", width: "120px" } },
      { accessorKey: "duration", header: "Duration", meta: { className: "text-center", width: "130px" } },
      { accessorKey: "certQty", header: "Certificate Quantity", meta: { className: "text-center", width: "150px" } },
      { accessorKey: "eventQty", header: "Event Quantity", meta: { className: "text-center", width: "130px" } },
      { accessorKey: "downloadQty", header: "Download Quantity", meta: { className: "text-center", width: "150px" } },
      {
        accessorKey: "price",
        header: "Price",
        cell: ({ getValue }) => money(getValue()),
        meta: { className: "text-center", width: "120px" },
      },
      {
        accessorKey: "title",
        header: "Title",
        cell: ({ getValue }) => <ExpandText text={getValue()} />,
        meta: { className: "text-start", width: "190px" },
      },
      {
        accessorKey: "instruction1",
        header: "Instruction 1",
        cell: ({ getValue }) => <ExpandText text={getValue()} bullets />,
        meta: { className: "text-start", width: "250px" },
      },
      {
        accessorKey: "includes",
        header: "Includes",
        cell: ({ getValue }) => <ExpandText text={getValue()} />,
        meta: { className: "text-start", width: "190px" },
      },
      {
        accessorKey: "instruction2",
        header: "Instruction 2",
        cell: ({ getValue }) => <ExpandText text={getValue()} bullets />,
        meta: { className: "text-start", width: "250px" },
      },
      {
        id: "edit",
        header: "Edit",
        enableSorting: false,
        cell: ({ row }) => (
          <button type="button" className="cap-edit" onClick={() => openEdit(row.original)}>
            Edit
          </button>
        ),
        meta: { className: "text-center", width: "100px" },
      },
      {
        id: "status",
        header: "Status",
        accessorFn: (r) => (r.enabled ? "Enabled" : "Disabled"),
        cell: ({ row }) => (
          <button
            type="button"
            className={`cap-status ${row.original.enabled ? "on" : "off"}`}
            onClick={() => toggleStatus(row.original.id)}
            title="Click to change status"
          >
            {row.original.enabled ? "Enabled" : "Disabled"}
          </button>
        ),
        meta: { className: "text-center", width: "130px" },
      },
    ],
    []
  );

  const handleExportExcel = () => {
    // TODO: connect your export-to-Excel logic
    console.log("Export plans", rows);
  };

  return (
    <div className="container-fluid py-4 c-addplans-wrapper">
      <div className="container-fluid px-md-4">

        {/* Add Plan button */}
        <div className="d-flex justify-content-end mb-3">
          <button
            type="button"
            className="btn-creative-submit d-inline-flex align-items-center gap-2"
            onClick={openAdd}
          >
            <Plus size={18} /> Add Plan
          </button>
        </div>

        {/* Add / Edit form (shown above the table) */}
        {formOpen && (
          <div ref={formRef} style={formWrapStyle}>
            <button type="button" style={closeStyle} onClick={closeForm} aria-label="Close form">
              <X size={18} />
            </button>
            <Addplans
              key={editing ? editing.id : "new"}
              plan={editing ? rowToForm(editing) : null}
              onSave={handleSave}
            />
          </div>
        )}

        {/* Heading */}
        <div className="cap-head">
          <h4 className="header-title">Plans Details</h4>
          <div className="cap-line"></div>
        </div>

        {/* Table card */}
        <div className="cap-card">
          <div className="table-responsive-scroll-wrapper">
            <DataTable columns={columns} data={rows} onExportExcel={handleExportExcel} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CAddplans;