import React, { useMemo, useRef, useState } from "react";
import * as XLSX from "xlsx"; // npm i xlsx
import DataTable from "../../common/Table/DataTable";
import "../../../css/SchedularDataTable.css";
import { useNavigate } from "react-router-dom";

// Demo rows shown until the first Excel file is added
export const SAMPLE_ROWS = [
  { id: 1, isSample: true, name: "Rahul Patil", email: "rahul@gmail.com", mobile: "9876543210", text1: "VIP", text2: "Pune", text3: "A1", groupName: "Group A" },
  { id: 2, isSample: true, name: "Sneha Joshi", email: "sneha@gmail.com", mobile: "9123456780", text1: "Guest", text2: "Nashik", text3: "B2", groupName: "Group B" },
  { id: 3, isSample: true, name: "Rahul Patil", email: "rahul.p@gmail.com", mobile: "9988776655", text1: "Guest", text2: "Mumbai", text3: "C3", groupName: "" },
  { id: 4, isSample: true, name: "Amit Shah", email: "sneha@gmail.com", mobile: "9123456780", text1: "VIP", text2: "Pune", text3: "A4", groupName: "Group A" },
];

const TEMPLATE_TYPES = ["Invitation", "Greeting", "Certificate"];
const IMAGE_TYPES = ["PNG", "JPG", "PDF"];
const WHATSAPP_TEMPLATES = ["event_invite_v1", "greeting_text", "certificate_send"];

const emptyForm = {
  excelFile: null,
  scheduleDate: "",
  scheduleTime: "",
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

// Today's date as yyyy-mm-dd (local time) so past dates can't be picked
const todayISO = () => {
  const d = new Date();
  const pad = (n) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
};

// ---------- Excel helpers ----------
// Header names are matched loosely: "Group Name", "group_name", "GROUPNAME" all work
const normKey = (k) => String(k).toLowerCase().replace(/[\s_-]+/g, "");

const HEADER_ALIASES = {
  name: "name",
  fullname: "name",
  email: "email",
  emailid: "email",
  mobile: "mobile",
  mobileno: "mobile",
  mobilenumber: "mobile",
  phone: "mobile",
  contact: "mobile",
  text1: "text1",
  text2: "text2",
  text3: "text3",
  groupname: "groupName",
  group: "groupName",
};

const rowFromExcel = (raw, index) => {
  const row = { id: `xl-${Date.now()}-${index}`, name: "", email: "", mobile: "", text1: "", text2: "", text3: "", groupName: "" };

  Object.entries(raw).forEach(([header, value]) => {
    const key = HEADER_ALIASES[normKey(header)];
    const text = value == null ? "" : String(value).trim();
    if (key) row[key] = text;
    else row[normKey(header)] = text; // extra columns still work as {{COLUMN}} in Preview
  });

  return row;
};

const readExcelFile = async (file) => {
  const buffer = await file.arrayBuffer();
  const workbook = XLSX.read(buffer, { type: "array" });
  const sheet = workbook.Sheets[workbook.SheetNames[0]];
  const raw = XLSX.utils.sheet_to_json(sheet, { defval: "" });
  return raw
    .map(rowFromExcel)
    .filter((r) => r.name || r.email || r.mobile || r.text1 || r.text2 || r.text3);
};

const downloadSampleExcel = () => {
  const sheet = XLSX.utils.json_to_sheet([
    { Name: "Rahul Patil", Email: "rahul@gmail.com", Mobile: "9876543210", Text1: "VIP", Text2: "Pune", Text3: "A1", "Group Name": "Group A" },
    { Name: "Sneha Joshi", Email: "sneha@gmail.com", Mobile: "9123456780", Text1: "Guest", Text2: "Nashik", Text3: "B2", "Group Name": "Group B" },
  ]);
  sheet["!cols"] = [{ wch: 20 }, { wch: 26 }, { wch: 14 }, { wch: 12 }, { wch: 12 }, { wch: 12 }, { wch: 14 }];
  const book = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(book, sheet, "Sample");
  XLSX.writeFile(book, "sample-data.xlsx");
};

// Returns a function that is true for rows whose value appears more than once
const buildDuplicateChecker = (rows, key) => {
  const counts = {};
  rows.forEach((r) => {
    const v = String(r[key] || "").trim().toLowerCase();
    if (v) counts[v] = (counts[v] || 0) + 1;
  });
  return (row) => counts[String(row[key] || "").trim().toLowerCase()] > 1;
};

const SchedularDataTable = ({ rows = SAMPLE_ROWS, setRows = () => {}, selectedIds = [], setSelectedIds = () => {} }) => {
  const [form, setForm] = useState(emptyForm);
  const [filters, setFilters] = useState(emptyFilters);
  const [status, setStatus] = useState({ type: "", text: "" });
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const setField = (name, value) => setForm((prev) => ({ ...prev, [name]: value }));
  const toggleFilter = (name) => setFilters((prev) => ({ ...prev, [name]: !prev[name] }));

  // ---------- Apply filters (all ticked filters must match) ----------
  const filteredData = useMemo(() => {
    const isDupName = buildDuplicateChecker(rows, "name");
    const isDupEmail = buildDuplicateChecker(rows, "email");
    const isDupMobile = buildDuplicateChecker(rows, "mobile");

    return rows.filter((row) => {
      if (filters.duplicateName && !isDupName(row)) return false;
      if (filters.duplicateEmail && !isDupEmail(row)) return false;
      if (filters.duplicateMobile && !isDupMobile(row)) return false;
      if (filters.groupName && !row.groupName) return false;
      return true;
    });
  }, [rows, filters]);

  // ---------- Row selection ----------
  const allSelected =
    filteredData.length > 0 && filteredData.every((r) => selectedIds.includes(r.id));

  const toggleAll = () => {
    const ids = filteredData.map((r) => r.id);
    setSelectedIds(
      allSelected
        ? selectedIds.filter((id) => !ids.includes(id))
        : [...new Set([...selectedIds, ...ids])]
    );
  };

  const toggleRow = (id) =>
    setSelectedIds(
      selectedIds.includes(id) ? selectedIds.filter((x) => x !== id) : [...selectedIds, id]
    );

  // ---------- Table columns ----------
  const columns = useMemo(
    () => [
      {
        id: "select",
        enableSorting: false,
        header: () => (
          <label className="sdt-select-all">
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
        meta: { width: "130px", className: "text-center" },
      },
      {
        id: "srNo",
        header: "Sr. No.",
        enableSorting: false,
        cell: ({ row }) => row.index + 1,
        meta: { width: "90px", className: "text-center" },
      },
      { accessorKey: "name", header: "Name", meta: { width: "170px", className: "text-center" } },
      { accessorKey: "email", header: "Email", meta: { width: "210px", className: "text-center" } },
      { accessorKey: "mobile", header: "Mobile", meta: { width: "140px", className: "text-center" } },
      { accessorKey: "text1", header: "Text1", meta: { width: "110px", className: "text-center" } },
      { accessorKey: "text2", header: "Text2", meta: { width: "110px", className: "text-center" } },
      { accessorKey: "text3", header: "Text3", meta: { width: "110px", className: "text-center" } },
      { accessorKey: "groupName", header: "Group Name", meta: { width: "140px", className: "text-center" } },
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [selectedIds, filteredData]
  );

  // ---------- Button handlers ----------
  const handleDraft = () => console.log("Draft", form, selectedIds);

  // Reads the chosen Excel file and puts its rows in the table
  const handleAdd = async () => {
    if (!form.excelFile) {
      setStatus({ type: "error", text: "Choose an Excel file first." });
      return;
    }

    try {
      const parsed = await readExcelFile(form.excelFile);

      if (!parsed.length) {
        setStatus({ type: "error", text: "No data rows found. Use the Sample Excel as a guide." });
        return;
      }

      // the first real upload replaces the demo rows
      setRows([...rows.filter((r) => !r.isSample), ...parsed]);
      setSelectedIds([]);
      setField("excelFile", null);
      setStatus({ type: "ok", text: `${parsed.length} row${parsed.length > 1 ? "s" : ""} added from ${form.excelFile.name}.` });
    } catch (err) {
      console.error(err);
      setStatus({ type: "error", text: "Could not read this file. Use .xlsx, .xls or .csv." });
    }
  };

  // Schedule: needs a date, a time and at least one ticked row
  const handleOnlyText = () => {
    if (!form.scheduleDate || !form.scheduleTime) {
      setStatus({ type: "error", text: "Select the Schedule Date and Schedule Time first." });
      return;
    }

    const targets = rows.filter((r) => selectedIds.includes(r.id));
    if (!targets.length) {
      setStatus({ type: "error", text: "Tick at least one row first." });
      return;
    }

    const when = new Date(`${form.scheduleDate}T${form.scheduleTime}`);
    if (when.getTime() < Date.now()) {
      setStatus({ type: "error", text: "Schedule date and time must be in the future." });
      return;
    }

    setStatus({ type: "", text: "" });
    // plug your WhatsApp scheduling API call in here
    console.log("Only Text", {
      scheduleDate: form.scheduleDate,
      scheduleTime: form.scheduleTime,
      template: form.whatsappTemplate,
      imageType: form.imageType,
      rows: targets,
    });
  };

  const handlePastRecords = () => console.log("Past records");
  const handleSentStatus = () => navigate("/admin/custom-status");

  // Exports the ticked rows (or all visible rows if none are ticked)
  const handleExport = () => {
    const source = selectedIds.length
      ? rows.filter((r) => selectedIds.includes(r.id))
      : filteredData;

    if (!source.length) {
      setStatus({ type: "error", text: "No rows to export." });
      return;
    }

    const sheet = XLSX.utils.json_to_sheet(
      source.map((r) => ({
        Name: r.name,
        Email: r.email,
        Mobile: r.mobile,
        Text1: r.text1,
        Text2: r.text2,
        Text3: r.text3,
        "Group Name": r.groupName,
      }))
    );
    sheet["!cols"] = [{ wch: 20 }, { wch: 26 }, { wch: 14 }, { wch: 12 }, { wch: 12 }, { wch: 12 }, { wch: 14 }];
    const book = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(book, sheet, "Records");
    XLSX.writeFile(book, "schedule-records.xlsx");
  };

  // Red X next to Export: resets the whole form
  const handleResetForm = () => {
    setForm(emptyForm);
    setStatus({ type: "", text: "" });
  };

  const handleViewAll = () => setFilters(emptyFilters);

  return (
    <section className="sdt-section">
      {/* ================= FORM ================= */}
      <div className="sdt-form">
        {/* Row 1: Draft | Schedule Date | Schedule Time | Sample Excel */}
        <div className="sdt-row sdt-row-schedule">
          <button type="button" className="sdt-pill" onClick={handleDraft}>
            Draft
          </button>

          <div className="sdt-field sdt-field-date">
            <label htmlFor="sdt-date">Schedule Date</label>
            <input
              id="sdt-date"
              type="date"
              className="sdt-input"
              value={form.scheduleDate}
              min={todayISO()}
              onChange={(e) => setField("scheduleDate", e.target.value)}
            />
          </div>

          <div className="sdt-field sdt-field-time">
            <label htmlFor="sdt-time">Schedule Time</label>
            <input
              id="sdt-time"
              type="time"
              className="sdt-input"
              value={form.scheduleTime}
              onChange={(e) => setField("scheduleTime", e.target.value)}
            />
          </div>

          <button type="button" className="sdt-pill sdt-pill-green" onClick={downloadSampleExcel}>
            Sample Excel
          </button>
        </div>

        {/* Row 2: upload + action buttons */}
        <div className="sdt-row sdt-row-actions">
          <div className="sdt-upload">
            <span className="sdt-upload-label">Upload Excel</span>
            <div className="sdt-file-box">
              <button
                type="button"
                className="sdt-choose"
                onClick={() => fileInputRef.current && fileInputRef.current.click()}
              >
                Choose file
              </button>
              <span className="sdt-file-name" title={form.excelFile ? form.excelFile.name : ""}>
                {form.excelFile ? form.excelFile.name : "No file chosen"}
              </span>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept=".xlsx,.xls,.csv"
              style={{ display: "none" }}
              onChange={(e) => {
                setField("excelFile", e.target.files[0] || null);
                setStatus({ type: "", text: "" });
                e.target.value = ""; // same file can be chosen again
              }}
            />
          </div>

          <button type="button" className="sdt-pill" onClick={handleAdd}>Add</button>
          <button type="button" className="sdt-pill" onClick={handleOnlyText}>Only Text</button>
          <button type="button" className="sdt-pill" onClick={handlePastRecords}>Past Records</button>
          <button type="button" className="sdt-pill" onClick={handleSentStatus}>Sent status</button>
          <button type="button" className="sdt-pill" onClick={handleExport}>Export to Excel</button>
          <button
            type="button"
            className="sdt-reset"
            onClick={handleResetForm}
            aria-label="Reset form"
            title="Reset form"
          >
            X
          </button>
        </div>

        {status.text && (
          <div className={`sdt-status ${status.type}`} role="status">
            {status.text}
          </div>
        )}

        {/* Row 3: selects */}
        <div className="sdt-row sdt-row-select">
          <div className="sdt-field">
            <label>Select Template Type</label>
            <select
              className="sdt-input"
              value={form.templateType}
              onChange={(e) => setField("templateType", e.target.value)}
            >
              <option value="">-- Select Type --</option>
              {TEMPLATE_TYPES.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>

          <div className="sdt-field">
            <label>Select Image Type</label>
            <select
              className="sdt-input"
              value={form.imageType}
              onChange={(e) => setField("imageType", e.target.value)}
            >
              <option value="">-- Select Type --</option>
              {IMAGE_TYPES.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>

          <button type="button" className="sdt-pill sdt-pill-round" onClick={handleViewAll}>
            View<br />All
          </button>

          <div className="sdt-field">
            <label>Select Whatsapp Template</label>
            <select
              className="sdt-input"
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
        <div className="sdt-note">
          <strong>Note:</strong>
          <ul>
            <li>Image size should be a maximum of 1-2 MB.</li>
            <li>After selecting a template, kindly add parameters below for your WhatsApp messages.</li>
          </ul>
        </div>
      </div>

      {/* ================= FILTERS ================= */}
      <div className="sdt-filters">
        <span className="sdt-filters-label">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M3 4h18l-7 8v6l-4 2v-8L3 4z" />
          </svg>
          Filters:
        </span>

        <label className="sdt-chip">
          <input type="checkbox" checked={filters.duplicateName} onChange={() => toggleFilter("duplicateName")} />
          <span>Duplicate Name</span>
        </label>

        <label className="sdt-chip">
          <input type="checkbox" checked={filters.duplicateEmail} onChange={() => toggleFilter("duplicateEmail")} />
          <span>Duplicate Email</span>
        </label>

        <label className="sdt-chip">
          <input type="checkbox" checked={filters.duplicateMobile} onChange={() => toggleFilter("duplicateMobile")} />
          <span>Duplicate Mobile</span>
        </label>

        <label className="sdt-chip">
          <input type="checkbox" checked={filters.groupName} onChange={() => toggleFilter("groupName")} />
          <span>Group Name</span>
        </label>

        <button
          type="button"
          className="sdt-clear"
          onClick={() => setFilters(emptyFilters)}
          aria-label="Clear filters"
        >
          X
        </button>
      </div>

      {/* ================= TABLE ================= */}
      <DataTable columns={columns} data={filteredData} centerToolbar />
    </section>
  );
};

export default SchedularDataTable;