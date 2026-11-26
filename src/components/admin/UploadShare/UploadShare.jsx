import React, { useMemo, useRef, useState } from "react";
import * as XLSX from "xlsx"; // npm i xlsx
import {
  FaCloudUploadAlt,
  FaFileExcel,
  FaImage,
  FaPaperPlane,
  FaChartBar,
  FaHistory,
  FaRedoAlt,
  FaTimes,
  FaArrowLeft,
  FaInfoCircle,
  FaUsers,
  FaCheckCircle,
  FaExclamationCircle,
  FaUserCheck,
  FaClipboardList,
  FaListUl,
  FaLayerGroup,
  FaPlus,
} from "react-icons/fa";
import DataTable from "../../common/Table/DataTable";
import "./UploadShare.css";

/* ------------------------------------------------------------------
   Upload & Share  (separate page)
   view = "main"   -> Upload & Share form + recipients table
          "status" -> Sent Report   (Status button)
          "past"   -> Record List   (Past Records button)
          "resend" -> Details       (Resend Records button / Total Sent link)
   Everything here is static demo data - connect your API where marked.
------------------------------------------------------------------- */

const TEMPLATE_TYPES = ["Text", "Image", "Video", "PDF"];
const MEDIA_TYPES = ["Image", "Video"];

// demo data (replace with API data)
const INITIAL_USERS = [
  { id: 1, name: "Designer", email: "designer@it-networkz.com", mobile: "7020503471" },
  { id: 2, name: "Vidhan", email: "vidhan.ramteke2@gmail.com", mobile: "8432625202" },
];

const STATUS_ROWS = [
  { id: 24616, name: "Designer", delivered: 3, failed: 0 },
  { id: 8587, name: "Raj Sharma", delivered: 2, failed: 0 },
  { id: 8586, name: "Samruddhi Shrirang", delivered: 1, failed: 0 },
];

const DETAIL_ROWS = [
  { id: 1, name: "Samruddhi Shrirang", email: "developer@it-networkz.com", mobile: "9665999900" },
];

const PAST_ROWS = []; // empty like the screenshot

const exportExcel = (rows, fileName) => {
  const sheet = XLSX.utils.json_to_sheet(rows);
  const book = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(book, sheet, "Sheet1");
  XLSX.writeFile(book, fileName);
};

/* ---------- small shared pieces ---------- */
const PageTitle = ({ icon, subtitle, children, onBack }) => (
  <div className="us-title-row">
    <div className="us-title-left">
      <span className="us-title-icon">{icon}</span>
      <div>
        <h2 className="us-title">{children}</h2>
        {subtitle && <p className="us-sub">{subtitle}</p>}
      </div>
    </div>
    {onBack && (
      <button type="button" className="us-btn us-btn-outline" onClick={onBack}>
        <FaArrowLeft /> <span>Back</span>
      </button>
    )}
  </div>
);

// header checkbox + row checkboxes (selection kept in the parent)
const useSelectColumn = (rows, selected, setSelected) =>
  useMemo(
    () => ({
      id: "select",
      enableSorting: false,
      header: () => (
        <label className="us-check-head">
          <input
            type="checkbox"
            checked={rows.length > 0 && selected.size === rows.length}
            onChange={(e) => setSelected(e.target.checked ? new Set(rows.map((r) => r.id)) : new Set())}
          />
          Select All
        </label>
      ),
      cell: ({ row }) => (
        <input
          type="checkbox"
          checked={selected.has(row.original.id)}
          onChange={() =>
            setSelected((prev) => {
              const next = new Set(prev);
              next.has(row.original.id) ? next.delete(row.original.id) : next.add(row.original.id);
              return next;
            })
          }
        />
      ),
      meta: { width: "130px", className: "text-center" },
    }),
    [rows, selected, setSelected]
  );

const srNo = {
  id: "srNo",
  header: "Sr. No.",
  enableSorting: false,
  cell: ({ row }) => row.index + 1,
  meta: { width: "90px", className: "text-center" },
};

/* ================= SENT REPORT (Status) ================= */
const SentReport = ({ onBack, onOpenDetails }) => {
  const columns = useMemo(
    () => [
      srNo,
      { accessorKey: "id", header: "Receiver ID", meta: { width: "160px" } },
      { accessorKey: "name", header: "Name", meta: { width: "220px" } },
      { accessorKey: "delivered", header: "Delivered", meta: { width: "120px" } },
      { accessorKey: "failed", header: "Failed", meta: { width: "120px" } },
      {
        id: "totalSent",
        header: "Total Sent",
        accessorFn: (r) => r.delivered + r.failed,
        cell: ({ getValue, row }) => (
          <button type="button" className="us-link" onClick={() => onOpenDetails(row.original)}>
            {getValue()}
          </button>
        ),
        meta: { width: "120px" },
      },
    ],
    [onOpenDetails]
  );

  const totalUsers = STATUS_ROWS.length;
  const delivered = STATUS_ROWS.reduce((a, r) => a + r.delivered, 0);
  const failed = STATUS_ROWS.reduce((a, r) => a + r.failed, 0);

  return (
    <div className="us-panel">
      <PageTitle icon={<FaChartBar />} subtitle="Delivery summary of your sent messages" onBack={onBack}>Sent Report</PageTitle>
      <div className="us-stats">
        <div className="us-stat us-stat-blue">
          <span className="us-stat-icon"><FaUsers /></span>
          <div><strong>{totalUsers}</strong><span>Total Users</span></div>
        </div>
        <div className="us-stat us-stat-green">
          <span className="us-stat-icon"><FaCheckCircle /></span>
          <div><strong>{delivered}</strong><span>Total Delivered</span></div>
        </div>
        <div className="us-stat us-stat-red">
          <span className="us-stat-icon"><FaExclamationCircle /></span>
          <div><strong>{failed}</strong><span>Total Failed</span></div>
        </div>
      </div>
      <DataTable columns={columns} data={STATUS_ROWS} />
    </div>
  );
};

/* ================= DETAILS (Resend Records) ================= */
const Details = ({ onBack }) => {
  const [selected, setSelected] = useState(new Set());
  const selectCol = useSelectColumn(DETAIL_ROWS, selected, setSelected);
  const columns = useMemo(
    () => [
      selectCol,
      srNo,
      { accessorKey: "name", header: "Name", meta: { width: "220px" } },
      { accessorKey: "email", header: "Email Id", meta: { width: "280px" } },
      { accessorKey: "mobile", header: "WhatsApp No.", meta: { width: "180px" } },
    ],
    [selectCol]
  );

  const handleEnable = () => {
    if (!selected.size) return alert("Please select at least one user.");
    // TODO: call your API here to enable / resend for the selected users
    alert(`${selected.size} user(s) enabled.`);
  };

  return (
    <div className="us-panel">
      <PageTitle icon={<FaClipboardList />} subtitle="Select users to resend or enable" onBack={onBack}>Details</PageTitle>
      <div className="us-actions">
        <button type="button" className="us-btn us-btn-green" onClick={handleEnable}>
          <FaUserCheck /> Enable Users
        </button>
        <button
          type="button"
          className="us-btn us-btn-outline"
          onClick={() => exportExcel(DETAIL_ROWS, "details.xlsx")}
        >
          <FaFileExcel /> Export to Excel
        </button>
      </div>
      <DataTable columns={columns} data={DETAIL_ROWS} />
    </div>
  );
};

/* ================= RECORD LIST (Past Records) ================= */
const RecordList = ({ onBack }) => {
  const [selected, setSelected] = useState(new Set());
  const selectCol = useSelectColumn(PAST_ROWS, selected, setSelected);
  const columns = useMemo(
    () => [
      selectCol,
      srNo,
      { accessorKey: "name", header: "Name", meta: { width: "170px" } },
      { accessorKey: "email", header: "Email Id", meta: { width: "230px" } },
      { accessorKey: "mobile", header: "WhatsApp No.", meta: { width: "160px" } },
      { accessorKey: "responseMsg", header: "Response Msg", meta: { width: "200px" } },
      { accessorKey: "sendDate", header: "Send Date", meta: { width: "160px" } },
      {
        accessorKey: "image",
        header: "Image",
        enableSorting: false,
        cell: ({ getValue }) => (getValue() ? <img src={getValue()} alt="" className="us-thumb" /> : "-"),
        meta: { width: "110px" },
      },
    ],
    [selectCol]
  );

  return (
    <div className="us-panel">
      <PageTitle icon={<FaHistory />} subtitle="All previously sent records" onBack={onBack}>Record List</PageTitle>
      <div className="us-actions">
        <button
          type="button"
          className="us-btn us-btn-green"
          onClick={() => exportExcel(PAST_ROWS, "record-list.xlsx")}
        >
          <FaFileExcel /> Export to Excel
        </button>
      </div>
      <DataTable columns={columns} data={PAST_ROWS} />
    </div>
  );
};

/* ================= MAIN: Upload & Share ================= */
const UploadShare = () => {
  const [view, setView] = useState("main");
  const [templateType, setTemplateType] = useState("");
  const [mediaType, setMediaType] = useState("");
  const [typeText, setTypeText] = useState("");
  const [users, setUsers] = useState(INITIAL_USERS);
  const [selected, setSelected] = useState(new Set());
  const [excelFile, setExcelFile] = useState(null);
  const [mediaFile, setMediaFile] = useState(null);
  const excelRef = useRef(null);
  const mediaRef = useRef(null);

  const selectCol = useSelectColumn(users, selected, setSelected);
  const columns = useMemo(
    () => [
      selectCol,
      srNo,
      { accessorKey: "name", header: "Name", meta: { width: "220px" } },
      { accessorKey: "email", header: "Email Id", meta: { width: "300px" } },
      { accessorKey: "mobile", header: "WhatsApp No.", meta: { width: "200px" } },
    ],
    [selectCol]
  );

  // Add = read the chosen Excel file (Name, Email, Mobile) into the table
  const handleAdd = async () => {
    if (!excelFile) return alert("Please choose an Excel file first.");
    try {
      const buf = await excelFile.arrayBuffer();
      const book = XLSX.read(buf);
      const rows = XLSX.utils.sheet_to_json(book.Sheets[book.SheetNames[0]]);
      const start = users.reduce((m, u) => Math.max(m, u.id), 0);
      const added = rows.map((r, i) => ({
        id: start + i + 1,
        name: r.Name || r.name || "",
        email: r.Email || r.email || "",
        mobile: String(r.Mobile || r.mobile || r.WhatsApp || ""),
      }));
      setUsers((prev) => [...prev, ...added]);
      setExcelFile(null);
      if (excelRef.current) excelRef.current.value = "";
    } catch (err) {
      console.error(err);
      alert("Could not read this Excel file.");
    }
  };

  const handleSend = () => {
    if (!templateType || !mediaType) return alert("Please select the template type and image / video type.");
    if (!mediaFile) return alert("Please choose an image / video file.");
    if (!selected.size) return alert("Please tick at least one user.");
    // TODO: call your API here (upload the file + send to the ticked users)
    alert(`Sending to ${selected.size} user(s)...`);
  };

  // X = clear the ticked users and the chosen files
  const handleClear = () => {
    setSelected(new Set());
    setExcelFile(null);
    setMediaFile(null);
    if (excelRef.current) excelRef.current.value = "";
    if (mediaRef.current) mediaRef.current.value = "";
  };

  const handleExport = () => exportExcel(users, "upload-share.xlsx");

  if (view === "status")
    return (
      <div className="us-wrap">
        <SentReport onBack={() => setView("main")} onOpenDetails={() => setView("resend")} />
      </div>
    );
  if (view === "resend")
    return (
      <div className="us-wrap">
        <Details onBack={() => setView("main")} />
      </div>
    );
  if (view === "past")
    return (
      <div className="us-wrap">
        <RecordList onBack={() => setView("main")} />
      </div>
    );

  return (
    <div className="us-wrap">
      <div className="us-panel">
        <PageTitle icon={<FaCloudUploadAlt />} subtitle="Upload an Excel list and share images / videos on WhatsApp">Upload &amp; Share</PageTitle>

        <div className="us-form">
          <div className="us-grid-3">
            <div className="us-field">
              <label>
                <FaLayerGroup /> Select Template Type <i>*</i>
              </label>
              <select value={templateType} onChange={(e) => setTemplateType(e.target.value)}>
                <option value="">-- Select Type --</option>
                {TEMPLATE_TYPES.map((t) => (
                  <option key={t}>{t}</option>
                ))}
              </select>
            </div>
            <div className="us-field">
              <label>
                <FaImage /> Select Image / Video Type <i>*</i>
              </label>
              <select value={mediaType} onChange={(e) => setMediaType(e.target.value)}>
                <option value="">-- Select Type --</option>
                {MEDIA_TYPES.map((t) => (
                  <option key={t}>{t}</option>
                ))}
              </select>
            </div>
            <div className="us-field">
              <label>
                <FaListUl /> Select Type <i>*</i>
              </label>
              <input type="text" value={typeText} onChange={(e) => setTypeText(e.target.value)} />
            </div>
          </div>

          <div className="us-upload-row">
            <div className="us-field">
              <label>
                <FaFileExcel /> Upload Excel
              </label>
              <div className="us-inline">
                <input
                  ref={excelRef}
                  type="file"
                  accept=".xlsx,.xls"
                  onChange={(e) => setExcelFile(e.target.files?.[0] || null)}
                />
                <button type="button" className="us-btn us-btn-primary" onClick={handleAdd}>
                  <FaPlus /> Add
                </button>
              </div>
            </div>
            <div className="us-field">
              <label>
                <FaImage /> Upload Image / Video
              </label>
              <div className="us-inline">
                <input
                  ref={mediaRef}
                  type="file"
                  accept="image/*,video/*"
                  onChange={(e) => setMediaFile(e.target.files?.[0] || null)}
                />
                <button type="button" className="us-btn us-btn-primary" onClick={handleSend}>
                  <FaPaperPlane /> Send
                </button>
              </div>
            </div>
          </div>

          <div className="us-note">
            <div className="us-note-title">
              <FaInfoCircle /> Note
            </div>
            <ul>
              <li>After selecting a template, kindly add parameters below for your WhatsApp messages.</li>
              <li>Video size should be a maximum of 5 MB.</li>
            </ul>
          </div>

          <div className="us-actions">
            <button type="button" className="us-btn us-btn-success" onClick={() => setView("status")}>
              <FaChartBar /> Status
            </button>
            <button type="button" className="us-btn us-btn-outline" onClick={() => setView("past")}>
              <FaHistory /> Past Records
            </button>
            <button type="button" className="us-btn us-btn-outline" onClick={() => setView("resend")}>
              <FaRedoAlt /> Resend Records
            </button>
            <button type="button" className="us-btn us-btn-outline" onClick={handleExport}>
              <FaFileExcel /> Export to Excel
            </button>
            <button type="button" className="us-btn us-btn-danger us-btn-icon" onClick={handleClear} aria-label="Clear" title="Clear">
              <FaTimes />
            </button>
          </div>
        </div>

        <DataTable columns={columns} data={users} />
      </div>
    </div>
  );
};

export default UploadShare;
