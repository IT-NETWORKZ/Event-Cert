import React, { useMemo, useRef, useState } from "react";
import * as XLSX from "xlsx"; // npm i xlsx
import DataTable from "../../common/Table/DataTable";
import "../../../css/DesignerTable.css";
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

const DesignerTable = ({ rows = SAMPLE_ROWS, setRows = () => {}, selectedIds = [], setSelectedIds = () => {} }) => {
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
          <label className="dsg-select-all">
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

  // Reads the chosen Excel file and puts its rows in the table (used by Preview)
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

  // Send buttons work on the ticked rows (plug your WhatsApp API call in here)
  const runSend = (kind) => {
    const targets = rows.filter((r) => selectedIds.includes(r.id));
    if (!targets.length) {
      setStatus({ type: "error", text: "Tick at least one row first." });
      return;
    }
    setStatus({ type: "", text: "" });
    console.log(kind, { template: form.whatsappTemplate, imageType: form.imageType, rows: targets });
  };
  const handleOnlyText = () => runSend("Only Text");
  const handleSendImage = () => runSend("Send Image");
  const handleSendPdf = () => runSend("Send PDF");

  const handlePastRecords = () => console.log("Past records");
  const handleRetrieveRecords = () => console.log("Retrieve records");
  const handleSentStatus = () => navigate("/admin/custom-status");
  const handleViewAll = () => setFilters(emptyFilters);

  return (
    <section className="dsg-section">
      {/* ================= FORM ================= */}
      <div className="dsg-form">
        {/* Row 1: action buttons */}
        <div className="dsg-row dsg-row-actions">
          <button type="button" className="dsg-pill" onClick={handleDraft}>
            Draft
          </button>

          <button type="button" className="dsg-pill dsg-pill-green" onClick={downloadSampleExcel}>
            Sample Excel
          </button>

          <div className="dsg-upload">
            <span>Upload Excel</span>
            <button
              type="button"
              className="dsg-pill dsg-choose"
              onClick={() => fileInputRef.current && fileInputRef.current.click()}
            >
              Choose File
            </button>
            <span className="dsg-file-name" title={form.excelFile ? form.excelFile.name : ""}>
              {form.excelFile ? form.excelFile.name : "No file chosen"}
            </span>
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

          <button type="button" className="dsg-pill" onClick={handleAdd}>Add</button>
          <button type="button" className="dsg-pill" onClick={handleOnlyText}>Only Text</button>
          <button type="button" className="dsg-pill" onClick={handleSendImage}>Send Image</button>
          <button type="button" className="dsg-pill" onClick={handleSendPdf}>Send PDF</button>
          <button type="button" className="dsg-pill" onClick={handlePastRecords}>Past Records</button>
          <button type="button" className="dsg-pill" onClick={handleRetrieveRecords}>Retrieve Records</button>
          <button type="button" className="dsg-pill" onClick={handleSentStatus}>Sent status</button>
        </div>

        {status.text && (
          <div className={`dsg-status ${status.type}`} role="status">
            {status.text}
          </div>
        )}

        {/* Row 2: selects */}
        <div className="dsg-row dsg-row-select">
          <div className="dsg-field">
            <label>Select Template Type</label>
            <select
              className="dsg-input"
              value={form.templateType}
              onChange={(e) => setField("templateType", e.target.value)}
            >
              <option value="">-- Select Type --</option>
              {TEMPLATE_TYPES.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>

          <div className="dsg-field">
            <label>Select Image Type</label>
            <select
              className="dsg-input"
              value={form.imageType}
              onChange={(e) => setField("imageType", e.target.value)}
            >
              <option value="">-- Select Type --</option>
              {IMAGE_TYPES.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>

          <button type="button" className="dsg-pill dsg-pill-round" onClick={handleViewAll}>
            View<br />All
          </button>

          <div className="dsg-field">
            <label>Select Whatsapp Template</label>
            <select
              className="dsg-input"
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
        <div className="dsg-note">
          <strong>Note:</strong>
          <ul>
            <li>Image size should be a maximum of 1-2 MB.</li>
            <li>After selecting a template, kindly add parameters below for your WhatsApp messages.</li>
            <li>Preview fills {"{{NAME}}"}, {"{{TEXT1}}"}, {"{{TEXT2}}"}, {"{{TEXT3}}"} from the ticked rows (all rows if none are ticked).</li>
          </ul>
        </div>
      </div>

      {/* ================= FILTERS ================= */}
      <div className="dsg-filters">
        <span className="dsg-filters-label">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M3 4h18l-7 8v6l-4 2v-8L3 4z" />
          </svg>
          Filters:
        </span>

        <label className="dsg-chip">
          <input type="checkbox" checked={filters.duplicateName} onChange={() => toggleFilter("duplicateName")} />
          <span>Duplicate Name</span>
        </label>

        <label className="dsg-chip">
          <input type="checkbox" checked={filters.duplicateEmail} onChange={() => toggleFilter("duplicateEmail")} />
          <span>Duplicate Email</span>
        </label>

        <label className="dsg-chip">
          <input type="checkbox" checked={filters.duplicateMobile} onChange={() => toggleFilter("duplicateMobile")} />
          <span>Duplicate Mobile</span>
        </label>

        <label className="dsg-chip">
          <input type="checkbox" checked={filters.groupName} onChange={() => toggleFilter("groupName")} />
          <span>Group Name</span>
        </label>

        <button
          type="button"
          className="dsg-clear"
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

export default DesignerTable;
