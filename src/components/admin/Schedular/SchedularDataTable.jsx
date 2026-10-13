import React, { useMemo, useState } from "react";
import DataTable from "../../common/Table/DataTable"; // adjust path if needed
import "../../../css/SchedularDataTable.css";
import { useNavigate } from "react-router-dom";

// Sample data: replace with your API / state
const sampleData = [
  { id: 1, name: "Rahul Patil", email: "rahul@gmail.com", mobile: "9876543210", text1: "VIP", text2: "Pune", text3: "A1", groupName: "Group A" },
  { id: 2, name: "Sneha Joshi", email: "sneha@gmail.com", mobile: "9123456780", text1: "Guest", text2: "Nashik", text3: "B2", groupName: "Group B" },
  { id: 3, name: "Rahul Patil", email: "rahul.p@gmail.com", mobile: "9988776655", text1: "Guest", text2: "Mumbai", text3: "C3", groupName: "" },
  { id: 4, name: "Amit Shah", email: "sneha@gmail.com", mobile: "9123456780", text1: "VIP", text2: "Pune", text3: "A4", groupName: "Group A" },
];

const TEMPLATE_TYPES = ["Invitation", "Greeting", "Certificate"];
const IMAGE_TYPES = ["PNG", "JPG", "PDF"];
const WHATSAPP_TEMPLATES = ["event_invite_v1", "greeting_text", "certificate_send"];

const emptyForm = {
  scheduleDate: "",
  scheduleTime: "",
  excelFile: null,
  templateType: "",
  imageType: "",
  whatsappTemplate: "",
};

const emptyFilters = {
  duplicateName: false,
  duplicateEmail: false,
  duplicateMobile: false,
  groupName: false,
};

// Returns true for rows whose value appears more than once
const buildDuplicateChecker = (rows, key) => {
  const counts = {};
  rows.forEach((r) => {
    const v = String(r[key] || "").trim().toLowerCase();
    if (v) counts[v] = (counts[v] || 0) + 1;
  });
  return (row) => counts[String(row[key] || "").trim().toLowerCase()] > 1;
};

const SchedularDataTable = ({ data = sampleData }) => {
  const [form, setForm] = useState(emptyForm);
  const [filters, setFilters] = useState(emptyFilters);
  const [selectedIds, setSelectedIds] = useState([]);
  const navigate = useNavigate();

  const setField = (name, value) => setForm((prev) => ({ ...prev, [name]: value }));
  const toggleFilter = (name) => setFilters((prev) => ({ ...prev, [name]: !prev[name] }));

  // ---------- Apply filters (all checked filters must match) ----------
  const filteredData = useMemo(() => {
    const isDupName = buildDuplicateChecker(data, "name");
    const isDupEmail = buildDuplicateChecker(data, "email");
    const isDupMobile = buildDuplicateChecker(data, "mobile");

    return data.filter((row) => {
      if (filters.duplicateName && !isDupName(row)) return false;
      if (filters.duplicateEmail && !isDupEmail(row)) return false;
      if (filters.duplicateMobile && !isDupMobile(row)) return false;
      if (filters.groupName && !row.groupName) return false;
      return true;
    });
  }, [data, filters]);

  // ---------- Row selection ----------
  const allSelected =
    filteredData.length > 0 && filteredData.every((r) => selectedIds.includes(r.id));

  const toggleAll = () => {
    const ids = filteredData.map((r) => r.id);
    setSelectedIds((prev) =>
      allSelected ? prev.filter((id) => !ids.includes(id)) : [...new Set([...prev, ...ids])]
    );
  };

  const toggleRow = (id) =>
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );

  // ---------- Table columns ----------
  const columns = useMemo(
    () => [
      {
        id: "select",
        enableSorting: false,
        header: () => (
          <label className="sch-select-all">
            <input type="checkbox" checked={allSelected} onChange={toggleAll} />
            <span>Select All</span>
          </label>
        ),
        cell: ({ row }) => (
          <input
            type="checkbox"
            checked={selectedIds.includes(row.original.id)}
            onChange={() => toggleRow(row.original.id)}
          />
        ),
        meta: { width: "130px", className: "text-start" },
      },
      {
        id: "srNo",
        header: "Sr. No.",
        enableSorting: false,
        cell: ({ row }) => row.index + 1,
        meta: { width: "90px", className: "text-center" },
      },
      { accessorKey: "name", header: "Name", meta: { width: "170px" } },
      { accessorKey: "email", header: "Email", meta: { width: "210px" } },
      { accessorKey: "mobile", header: "Mobile", meta: { width: "140px" } },
      { accessorKey: "text1", header: "Text1", meta: { width: "110px" } },
      { accessorKey: "text2", header: "Text2", meta: { width: "110px" } },
      { accessorKey: "text3", header: "Text3", meta: { width: "110px" } },
      { accessorKey: "groupName", header: "Group Name", meta: { width: "140px" } },
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [selectedIds, filteredData]
  );

  // ---------- Button handlers (connect to your API) ----------
  const handleDraft = () => console.log("Draft", form, selectedIds);
  const handleSampleExcel = () => console.log("Download sample excel");
  const handleAdd = () => console.log("Add excel", form.excelFile);
  const handleOnlyText = () => console.log("Only text");
  const handlePastRecords = () => console.log("Past records");
 const handleSentStatus = () => navigate("/admin/schedule-status");
  const handleExport = () => console.log("Export to Excel", filteredData);
  const handleViewAll = () => console.log("View all");
  const handleResetForm = () => setForm(emptyForm);

  return (
    <section className="sch-table-section">
      {/* ================= FORM ================= */}
      <div className="sch-form">
        {/* Row 1 */}
        <div className="sch-form-row sch-row-top">
          <button type="button" className="sch-pill" onClick={handleDraft}>
            Draft
          </button>

          <div className="sch-field">
            <label>Schedule Date</label>
            <input
              type="date"
              className="sch-input"
              value={form.scheduleDate}
              onChange={(e) => setField("scheduleDate", e.target.value)}
            />
          </div>

          <div className="sch-field">
            <label>Schedule Time</label>
            <input
              type="time"
              className="sch-input"
              value={form.scheduleTime}
              onChange={(e) => setField("scheduleTime", e.target.value)}
            />
          </div>

          <button type="button" className="sch-pill sch-pill-green" onClick={handleSampleExcel}>
            Sample Excel
          </button>
        </div>

        {/* Row 2 */}
        <div className="sch-form-row sch-row-actions">
          <div className="sch-upload">
            <span>Upload Excel</span>
            <input
              type="file"
              accept=".xlsx,.xls,.csv"
              onChange={(e) => setField("excelFile", e.target.files[0] || null)}
            />
          </div>

          <button type="button" className="sch-pill" onClick={handleAdd}>Add</button>
          <button type="button" className="sch-pill" onClick={handleOnlyText}>Only Text</button>
          <button type="button" className="sch-pill" onClick={handlePastRecords}>Past Records</button>
          <button type="button" className="sch-pill" onClick={handleSentStatus}>Sent status</button>
          <button type="button" className="sch-pill" onClick={handleExport}>Export to Excel</button>
          <button type="button" className="sch-pill-x" onClick={handleResetForm}>X</button>
        </div>

        {/* Row 3 */}
        <div className="sch-form-row sch-row-select">
          <div className="sch-field sch-field-grow">
            <label>Select Template Type</label>
            <select
              className="sch-input"
              value={form.templateType}
              onChange={(e) => setField("templateType", e.target.value)}
            >
              <option value="">-- Select Type --</option>
              {TEMPLATE_TYPES.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>

          <div className="sch-field sch-field-grow">
            <label>Select Image Type</label>
            <select
              className="sch-input"
              value={form.imageType}
              onChange={(e) => setField("imageType", e.target.value)}
            >
              <option value="">-- Select Type --</option>
              {IMAGE_TYPES.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>

          <button type="button" className="sch-pill sch-pill-round" onClick={handleViewAll}>
            View<br />All
          </button>

          <div className="sch-field sch-field-grow">
            <label>Select Whatsapp Template</label>
            <select
              className="sch-input"
              value={form.whatsappTemplate}
              onChange={(e) => setField("whatsappTemplate", e.target.value)}
            >
              <option value="">-- Select Template --</option>
              {WHATSAPP_TEMPLATES.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Notes */}
        <div className="sch-note">
          <strong>Note:</strong>
          <ul>
            <li>Image size should be a maximum of 1-2 MB.</li>
            <li>After selecting a template, kindly add parameters below for your WhatsApp messages.</li>
          </ul>
        </div>
      </div>

      {/* ================= FILTERS ================= */}
      <div className="sch-filters">
        <span className="sch-filters-label">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M3 4h18l-7 8v6l-4 2v-8L3 4z" />
          </svg>
          Filters:
        </span>

        <label className="sch-filter-chip">
          <input
            type="checkbox"
            checked={filters.duplicateName}
            onChange={() => toggleFilter("duplicateName")}
          />
          <span>Duplicate Name</span>
        </label>

        <label className="sch-filter-chip">
          <input
            type="checkbox"
            checked={filters.duplicateEmail}
            onChange={() => toggleFilter("duplicateEmail")}
          />
          <span>Duplicate Email</span>
        </label>

        <label className="sch-filter-chip">
          <input
            type="checkbox"
            checked={filters.duplicateMobile}
            onChange={() => toggleFilter("duplicateMobile")}
          />
          <span>Duplicate Mobile</span>
        </label>

        <label className="sch-filter-chip">
          <input
            type="checkbox"
            checked={filters.groupName}
            onChange={() => toggleFilter("groupName")}
          />
          <span>Group Name</span>
        </label>

        <button
          type="button"
          className="sch-filter-clear"
          onClick={() => setFilters(emptyFilters)}
          aria-label="Clear filters"
        >
          X
        </button>
      </div>

      {/* ================= TABLE ================= */}
      <DataTable columns={columns} data={filteredData} />
    </section>
  );
};

export default SchedularDataTable;

// import React from "react";
// import DataTable from "../../common/Table/DataTable";
// import "../../../css/SchedularDataTable.css";

// const statusClass = {
//   Draft: "sch-badge sch-badge-draft",
//   Scheduled: "sch-badge sch-badge-scheduled",
//   Sent: "sch-badge sch-badge-sent",
//   Failed: "sch-badge sch-badge-failed",
// };

// // Defined outside the component so the array is stable between renders
// const columns = [
//   {
//     id: "srNo",
//     header: "Sr. No.",
//     enableSorting: false,
//     cell: ({ row }) => row.index + 1,
//     meta: { width: "80px", className: "text-center" },
//   },
//   { accessorKey: "scheduleDate", header: "Schedule Date", meta: { width: "130px" } },
//   { accessorKey: "scheduleTime", header: "Schedule Time", meta: { width: "120px" } },
//   { accessorKey: "messageType", header: "Message Type", meta: { width: "130px" } },
//   { accessorKey: "templateType", header: "Template Type", meta: { width: "140px" } },
//   { accessorKey: "imageType", header: "Image Type", meta: { width: "110px" } },
//   { accessorKey: "whatsappTemplate", header: "WhatsApp Template", meta: { width: "160px" } },
//   {
//     accessorKey: "recipients",
//     header: "Recipients",
//     meta: { width: "110px", className: "text-center" },
//   },
//   {
//     accessorKey: "status",
//     header: "Status",
//     meta: { width: "120px", className: "text-center" },
//     cell: ({ getValue }) => (
//       <span className={statusClass[getValue()] || "sch-badge"}>{getValue()}</span>
//     ),
//   },
//   {
//     id: "actions",
//     header: "Action",
//     enableSorting: false,
//     meta: { width: "130px", className: "text-center" },
//     cell: ({ row }) => (
//       <div className="sch-actions">
//         <button
//           type="button"
//           className="sch-action-btn sch-view"
//           onClick={() => console.log("View", row.original)}
//         >
//           View
//         </button>
//         <button
//           type="button"
//           className="sch-action-btn sch-delete"
//           onClick={() => console.log("Delete", row.original)}
//         >
//           X
//         </button>
//       </div>
//     ),
//   },
// ];

// // Sample data: replace with your API / state
// const sampleData = [
//   { id: 1, scheduleDate: "15-10-2026", scheduleTime: "10:30 AM", messageType: "Image", templateType: "Invitation", imageType: "PNG", whatsappTemplate: "event_invite_v1", recipients: 120, status: "Scheduled" },
//   { id: 2, scheduleDate: "12-10-2026", scheduleTime: "09:00 AM", messageType: "Only Text", templateType: "Greeting", imageType: "-", whatsappTemplate: "greeting_text", recipients: 85, status: "Sent" },
//   { id: 3, scheduleDate: "20-10-2026", scheduleTime: "05:15 PM", messageType: "Image", templateType: "Certificate", imageType: "PDF", whatsappTemplate: "certificate_send", recipients: 40, status: "Draft" },
// ];

// const SchedularDataTable = ({ data = sampleData }) => {
//   const handleExportExcel = () => {
//     console.log("Export schedule records to Excel");
//   };

//   return (
//     <section className="sch-table-section">
//       <h3 className="sch-table-title">Scheduled Messages</h3>
//       <DataTable
//         columns={columns}
//         data={data}
//         onExportExcel={handleExportExcel}
//       />
//     </section>
//   );
// };

// export default SchedularDataTable;