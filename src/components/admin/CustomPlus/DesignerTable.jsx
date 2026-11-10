import React, { useEffect, useMemo, useRef, useState } from "react";
import * as XLSX from "xlsx"; // npm i xlsx
import { jsPDF } from "jspdf"; // npm i jspdf
import DataTable from "../../common/Table/DataTable";
import "../../../css/DesignerTable.css";
import { useNavigate } from "react-router-dom";
import { useCanvas } from "../../../context/CanvasContext"; // same context FabricCanvas uses (adjust path if needed)
import { getApiError, getRecipients, getWhatsappTemplates, importRecipients, saveCardDesign, setRecipientStatus, toImageUrl } from "../../../api/adminService"; // adjust path to your service file
import DraftModal from "../CustomPlus/DraftModal/DraftModal";

// Demo rows shown until the first Excel file is added
export const SAMPLE_ROWS = [
  { id: 1, isSample: true, name: "Rahul Patil", email: "rahul@gmail.com", mobile: "9876543210", text1: "VIP", text2: "Pune", text3: "A1", groupName: "Group A" },
  { id: 2, isSample: true, name: "Sneha Joshi", email: "sneha@gmail.com", mobile: "9123456780", text1: "Guest", text2: "Nashik", text3: "B2", groupName: "Group B" },
  { id: 3, isSample: true, name: "Rahul Patil", email: "rahul.p@gmail.com", mobile: "9988776655", text1: "Guest", text2: "Mumbai", text3: "C3", groupName: "" },
  { id: 4, isSample: true, name: "Amit Shah", email: "sneha@gmail.com", mobile: "9123456780", text1: "VIP", text2: "Pune", text3: "A4", groupName: "Group A" },
];

// value = number sent to api/admin/whatsapp-templates?templateType=..&sendType=..
const TEMPLATE_TYPES = [
  { value: "1", label: "Utility" },
  { value: "2", label: "Marketing" },
];
// same order / numbers as SEND_TYPES in the Add Template page – adjust if your numbers differ
const IMAGE_TYPES = [
  { value: "1", label: "Only Text" },
  { value: "2", label: "Text + Image" },
  { value: "3", label: "Text + Video" },
  { value: "4", label: "Text + Document" },
];

// WhatsApp template parameters: {{1}} .. {{4}}
const PARAM_MAX = 4;
const PARAM_REGEX = /\{\{\s*(\d+)\s*\}\}/g;

// which of {{1}}..{{4}} the message uses, e.g. [1, 2]
const getParamIndexes = (message) => {
  const found = new Set();
  String(message || "").replace(PARAM_REGEX, (match, n) => {
    found.add(Number(n));
    return match;
  });
  return [...found].filter((n) => n >= 1 && n <= PARAM_MAX).sort((a, b) => a - b);
};

// message with the typed values put in (empty ones stay as {{n}})
const fillMessage = (message, params) =>
  String(message || "").replace(PARAM_REGEX, (match, n) => {
    const v = params[Number(n) - 1];
    return v && v.trim() ? v : match;
  });

const previewBoxStyle = {
  whiteSpace: "pre-wrap",
  background: "#f0fdf4",
  border: "1px solid #bbf7d0",
  borderRadius: 10,
  padding: "10px 14px",
  fontSize: 14,
  lineHeight: 1.5,
};
const paramGridStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))",
  gap: 12,
  marginTop: 10,
};

// "png" or "jpg" – the canvas export in the parent must use the same format
const IMAGE_FORMAT = "png";
// 1 = real canvas size. Keep files small (WhatsApp images max 5 MB, API limit 10 MB)
const EXPORT_MULTIPLIER = 1;
// api/admin/cards needs a TemplateType: Invitation | Greeting | Certificate
const CARD_TEMPLATE_TYPE = "Certificate";

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

// Headings must match the backend importer (Name is required; Email or Mobile is required per row)
const downloadSampleExcel = () => {
  const sheet = XLSX.utils.aoa_to_sheet([["Name", "Email", "Mobile", "GroupName", "Text1", "Text2", "Text3", "Text4"]]);
  sheet["!cols"] = [{ wch: 20 }, { wch: 26 }, { wch: 14 }, { wch: 14 }, { wch: 12 }, { wch: 12 }, { wch: 12 }, { wch: 12 }];
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

// Replaces {{NAME}}, {{EMAIL}}, {{MOBILE}}, {{GROUPNAME}}, {{TEXT1}}..{{TEXT4}} in every text object
// of the canvas with the user's values. Returns a function that puts the original text back.
const fillPlaceholders = (canvas, row) => {
  const values = {
    NAME: row.name,
    EMAIL: row.email,
    MOBILE: row.mobile,
    GROUPNAME: row.groupName,
    TEXT1: row.text1,
    TEXT2: row.text2,
    TEXT3: row.text3,
    TEXT4: row.text4,
  };
  const originals = [];

  const walk = (objects) =>
    objects.forEach((obj) => {
      if (Array.isArray(obj._objects)) walk(obj._objects); // groups
      if (typeof obj.text !== "string") return;
      const next = obj.text.replace(/\{\{\s*(\w+)\s*\}\}/g, (match, key) => {
        const v = values[key.toUpperCase()];
        return v === undefined || v === null ? match : String(v);
      });
      if (next !== obj.text) {
        originals.push([obj, obj.text]);
        obj.set("text", next);
      }
    });

  walk(canvas.getObjects());
  canvas.renderAll();

  return () => {
    originals.forEach(([obj, text]) => obj.set("text", text));
    canvas.renderAll();
  };
};

// One-page PDF (page size = canvas size) from a PNG data URL
const makePdfBlob = (dataUrl, width, height) => {
  const pdf = new jsPDF({
    orientation: width >= height ? "landscape" : "portrait",
    unit: "px",
    format: [width, height],
    hotfixes: ["px_scaling"],
  });
  pdf.addImage(dataUrl, "PNG", 0, 0, width, height);
  return pdf.output("blob");
};

// "Rahul Patil" -> "Rahul Patil.png"; the same name again -> "Rahul Patil_2.png"
const uniqueFileName = (name, ext, used) => {
  const base =
    String(name || "user")
      .replace(/[\\/:*?"<>|]+/g, "_")
      .replace(/\s+/g, " ")
      .trim()
      .replace(/[. ]+$/, "") || "user";
  const key = base.toLowerCase();
  used[key] = (used[key] || 0) + 1;
  return used[key] === 1 ? `${base}.${ext}` : `${base}_${used[key]}.${ext}`;
};

/* The canvas comes from CanvasContext (set by FabricCanvas), so nothing needs to be passed in. */
const DesignerTable = ({
  rows = SAMPLE_ROWS,
  setRows = () => { },
  selectedIds = [],
  setSelectedIds = () => { },
}) => {
  const [form, setForm] = useState(emptyForm);
  const [filters, setFilters] = useState(emptyFilters);
  const [status, setStatus] = useState({ type: "", text: "" });
  const [draftOpen, setDraftOpen] = useState(false); // Draft popup

  const [saving, setSaving] = useState(null); // "image" | "pdf" | null
  const [savedFiles, setSavedFiles] = useState([]); // [{ name, url }] saved by the last Send
  const [templates, setTemplates] = useState([]); // WhatsApp templates for the chosen type + image type
  const [tplLoading, setTplLoading] = useState(false);
  const [params, setParams] = useState(["", "", "", ""]); // values for {{1}}..{{4}}
  const canvas = useCanvas()?.canvas; // Fabric canvas of the active page

  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  // Loads saved recipients from the API
  const loadRecipients = () => getRecipients({ page: 1, pageSize: 500 });

  useEffect(() => {
    loadRecipients()
      .then((list) => {
        if (list.length) setRows(list);
      })
      .catch((err) => console.error(err));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Loads the WhatsApp templates whenever Template Type and Image Type are both chosen
  useEffect(() => {
    const { templateType, imageType } = form;
    if (!templateType || !imageType) {
      setTemplates([]);
      return undefined;
    }

    let cancelled = false;
    setTplLoading(true);
    getWhatsappTemplates({ templateType, sendType: imageType })
      .then((list) => {
        if (!cancelled) setTemplates(list);
      })
      .catch((err) => {
        if (cancelled) return;
        console.error(err);
        setTemplates([]);
        setStatus({ type: "error", text: getApiError(err, "Could not load WhatsApp templates.") });
      })
      .finally(() => {
        if (!cancelled) setTplLoading(false);
      });

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form.templateType, form.imageType]);

  // selected template, the {{n}} it uses and the typed values (in order)
  const selectedTemplate = useMemo(
    () => templates.find((t) => t.name === form.whatsappTemplate) || null,
    [templates, form.whatsappTemplate]
  );
  const paramIndexes = useMemo(() => getParamIndexes(selectedTemplate?.message), [selectedTemplate]);
  const paramValues = paramIndexes.map((n) => (params[n - 1] || "").trim());

  // new template chosen -> clear the typed values
  useEffect(() => {
    setParams(["", "", "", ""]);
  }, [form.whatsappTemplate]);

  const setParam = (index, value) =>
    setParams((prev) => prev.map((v, i) => (i === index ? value : v)));

  // Activate / deactivate one recipient
  const toggleStatus = async (row) => {
    if (row.isSample) return;
    const next = !row.isActive;
    try {
      await setRecipientStatus(row.id, next);
      setRows(rows.map((r) => (r.id === row.id ? { ...r, isActive: next } : r)));
    } catch (err) {
      setStatus({ type: "error", text: getApiError(err, "Could not update status.") });
    }
  };

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
      { accessorKey: "groupName", header: "Group Name", meta: { width: "140px", className: "text-center" } },
      { accessorKey: "text1", header: "Text1", meta: { width: "110px", className: "text-center" } },
      { accessorKey: "text2", header: "Text2", meta: { width: "110px", className: "text-center" } },
      { accessorKey: "text3", header: "Text3", meta: { width: "110px", className: "text-center" } },
      { accessorKey: "text4", header: "Text4", meta: { width: "110px", className: "text-center" } },
      {
        id: "status",
        header: "Status",
        enableSorting: false,
        cell: ({ row }) =>
          row.original.isSample ? (
            "-"
          ) : (
            <button type="button" className="dsg-pill" onClick={() => toggleStatus(row.original)}>
              {row.original.isActive ? "Active" : "Inactive"}
            </button>
          ),
        meta: { width: "110px", className: "text-center" },
      },
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [selectedIds, filteredData]
  );

  // ---------- Button handlers ----------
  const handleDraft = () => setDraftOpen(true);
  const handleDraftClose = () => setDraftOpen(false);

  // Uploads the Excel file to the API, then reloads the saved recipients
  const handleAdd = async () => {
    if (!form.excelFile) {
      setStatus({ type: "error", text: "Choose an Excel file first." });
      return;
    }

    try {
      setStatus({ type: "", text: "" });
      const { inserted, duplicates, invalid, errors } = await importRecipients(form.excelFile);

      const list = await loadRecipients();
      setRows(list);
      setSelectedIds([]);
      setField("excelFile", null);

      let text = `${inserted} imported, ${duplicates} duplicate, ${invalid} invalid.`;
      if (errors.length) text += ` ${errors.slice(0, 3).join(" ")}${errors.length > 3 ? ` (+${errors.length - 3} more)` : ""}`;
      setStatus({ type: inserted > 0 ? "ok" : "error", text });
    } catch (err) {
      console.error(err);
      setStatus({ type: "error", text: getApiError(err, "Import failed.") });
    }
  };

  // Send buttons work on the ticked rows (plug your WhatsApp API call in here)
  const runSend = (kind) => {
    const targets = rows.filter((r) => selectedIds.includes(r.id));
    if (!targets.length) {
      setStatus({ type: "error", text: "Tick at least one row first." });
      return;
    }
    if (paramValues.some((v) => !v)) {
      setStatus({ type: "error", text: "Fill all the template parameters first." });
      return;
    }
    setStatus({ type: "", text: "" });
    console.log(kind, {
      template: form.whatsappTemplate,
      imageType: form.imageType,
      parameters: paramValues, // in order {{1}}, {{2}} ...
      rows: targets,
    });
  };
  const handleOnlyText = () => runSend("Only Text");

  // Send Image / Send PDF: for every ticked user -> fill the canvas with that user's data -> make the file
  // -> POST api/admin/cards. The file is sent named after the user ("Rahul Patil.png") and the API
  // saves it in its uploads folder.
  const exportForUsers = async (kind) => {
    if (saving) return;

    const targets = rows.filter((r) => selectedIds.includes(r.id));
    if (!targets.length) {
      setStatus({ type: "error", text: "Tick at least one user first." });
      return;
    }
    if (!canvas) {
      setStatus({ type: "error", text: "Canvas is not ready. Open the design canvas first." });
      return;
    }

    const isPdf = kind === "pdf";
    const format = isPdf ? "PDF" : IMAGE_FORMAT.toUpperCase(); // UploadFormat = OutputFormat = the file we send
    const ext = isPdf ? "pdf" : IMAGE_FORMAT;
    const label = isPdf ? "PDF" : "image";

    const used = {}; // file names already used in this send (same name twice -> Name_2)
    const saved = [];
    const failed = [];

    try {
      setSaving(kind);
      setSavedFiles([]);
      setStatus({ type: "", text: "" });
      canvas.discardActiveObject(); // no selection handles in the exported file

      for (let i = 0; i < targets.length; i++) {
        const row = targets[i];
        setStatus({ type: "", text: `Saving ${i + 1} of ${targets.length}: ${row.name}...` });

        const restore = fillPlaceholders(canvas, row);
        try {
          let blob;
          if (isPdf) {
            const dataUrl = canvas.toDataURL({ format: "png", multiplier: EXPORT_MULTIPLIER });
            blob = makePdfBlob(dataUrl, canvas.getWidth(), canvas.getHeight());
          } else {
            const dataUrl = canvas.toDataURL({
              format: IMAGE_FORMAT === "jpg" ? "jpeg" : "png",
              quality: 0.95,
              multiplier: EXPORT_MULTIPLIER,
            });
            blob = await (await fetch(dataUrl)).blob();
          }

          const res = await saveCardDesign({
            blob,
            designName: row.name || "user",
            fileName: uniqueFileName(row.name, ext, used), // "Rahul Patil.png"
            templateType: CARD_TEMPLATE_TYPE,
            uploadFormat: format,
            outputFormat: format,
            canvasWidth: canvas.getWidth(),
            canvasHeight: canvas.getHeight(),
            canvasJson: canvas.toJSON(), // with this user's values filled in
            format: ext,
          });
          saved.push({ name: row.name, url: res?.imageUrl || "" });
        } catch (err) {
          console.error(err);
          const msg = err?.response ? getApiError(err, "Request failed.") : err?.message || "Request failed.";
          failed.push(`${row.name}: ${msg}`);
        } finally {
          restore(); // put the template text back
        }
      }

      setSavedFiles(saved);
      if (failed.length) {
        setStatus({ type: "error", text: `${saved.length} saved, ${failed.length} failed. ${failed.slice(0, 2).join(" ")}` });
      } else {
        setStatus({ type: "ok", text: `${saved.length} ${label}(s) saved on the server by user name.` });
      }
    } finally {
      setSaving(null);
    }
  };
  const handleSendImage = () => exportForUsers("image");
  const handleSendPdf = () => exportForUsers("pdf");

  // Past Records page   -> /admin/custom-past-records
  // Retrieve Records    -> /admin/custom-retrieve-records
  const handlePastRecords = () => navigate("/admin/custom-past-records");
  const handleRetrieveRecords = () => navigate("/admin/custom-retrieve-records");
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
              accept=".xlsx"
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
          <button type="button" className="dsg-pill" onClick={handleSendImage} disabled={!!saving}>
            {saving === "image" ? "Saving..." : "Send Image"}
          </button>
          <button type="button" className="dsg-pill" onClick={handleSendPdf} disabled={!!saving}>
            {saving === "pdf" ? "Saving..." : "Send PDF"}
          </button>
          <button type="button" className="dsg-pill" onClick={handlePastRecords}>Past Records</button>
          <button type="button" className="dsg-pill" onClick={handleRetrieveRecords}>Retrieve Records</button>
          <button type="button" className="dsg-pill" onClick={handleSentStatus}>Sent status</button>
        </div>

        {status.text && (
          <div className={`dsg-status ${status.type}`} role="status">
            {status.text}
          </div>
        )}

        {savedFiles.length > 0 && (
          <div style={{ marginTop: 8, fontSize: 13 }}>
            Saved:{" "}
            {savedFiles.slice(0, 10).map((f, i) => (
              <span key={i}>
                {i > 0 && ", "}
                {f.url ? (
                  <a href={toImageUrl(f.url)} target="_blank" rel="noreferrer">{f.name}</a>
                ) : (
                  f.name
                )}
              </span>
            ))}
            {savedFiles.length > 10 && ` (+${savedFiles.length - 10} more)`}
          </div>
        )}

        {/* Row 2: selects */}
        <div className="dsg-row dsg-row-select">
          <div className="dsg-field">
            <label>Select Template Type</label>
            <select
              className="dsg-input"
              value={form.templateType}
              onChange={(e) => setForm((prev) => ({ ...prev, templateType: e.target.value, whatsappTemplate: "" }))}
            >
              <option value="">-- Select Type --</option>
              {TEMPLATE_TYPES.map((t) => (
                <option key={t.value} value={t.value}>{t.label}</option>
              ))}
            </select>
          </div>

          <div className="dsg-field">
            <label>Select Image Type</label>
            <select
              className="dsg-input"
              value={form.imageType}
              onChange={(e) => setForm((prev) => ({ ...prev, imageType: e.target.value, whatsappTemplate: "" }))}
            >
              <option value="">-- Select Type --</option>
              {IMAGE_TYPES.map((t) => (
                <option key={t.value} value={t.value}>{t.label}</option>
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
              disabled={!form.templateType || !form.imageType || tplLoading}
            >
              <option value="">
                {!form.templateType || !form.imageType
                  ? "-- Select type & image type first --"
                  : tplLoading
                    ? "Loading..."
                    : templates.length
                      ? "-- Select Template --"
                      : "-- No templates found --"}
              </option>
              {templates.map((t) => (
                <option key={t.id} value={t.name}>{t.name}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Selected template: message + parameter inputs */}
        {selectedTemplate && (
          <div style={{ marginTop: 14 }}>
            <label style={{ fontWeight: 600, display: "block", marginBottom: 6 }}>Message</label>
            <div style={previewBoxStyle}>
              {fillMessage(selectedTemplate.message, params) || "(no message text in this template)"}
            </div>

            {paramIndexes.length > 0 ? (
              <div style={paramGridStyle}>
                {paramIndexes.map((n) => (
                  <div className="dsg-field" key={n}>
                    <label>{`{{${n}}}`}</label>
                    <input
                      type="text"
                      className="dsg-input"
                      placeholder={`Value for {{${n}}}`}
                      value={params[n - 1]}
                      onChange={(e) => setParam(n - 1, e.target.value)}
                    />
                  </div>
                ))}
              </div>
            ) : (
              <small style={{ display: "block", marginTop: 8 }}>This template has no parameters.</small>
            )}
          </div>
        )}

        {/* Notes */}
        <div className="dsg-note">
          <strong>Note:</strong>
          <ul>
            <li>Image size should be a maximum of 1-2 MB.</li>
            <li>After selecting a template, kindly add parameters below for your WhatsApp messages.</li>
            <li>Preview fills {"{{NAME}}"}, {"{{TEXT1}}"}, {"{{TEXT2}}"}, {"{{TEXT3}}"} from the ticked rows (all rows if none are ticked).</li>
            <li>Send Image / Send PDF: tick at least one user. A personalised file named after each user (Name.png / Name.pdf) is sent to the server, which saves it in its uploads folder.</li>
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

      {/* ================= DRAFT POPUP ================= */}
      <DraftModal open={draftOpen} onClose={handleDraftClose} />

    </section>
  );
};

export default DesignerTable;