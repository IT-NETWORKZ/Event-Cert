import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import * as XLSX from "xlsx";
import {
  ArrowLeft,
  Users,
  UserCheck,
  Trash2,
  FileSpreadsheet,
  RefreshCw,
  Loader2,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import DataTable from "../../common/Table/DataTable";
import { enableRecipients, getApiError, getInactiveRecipients, removeRecipients } from "../../../api/adminService"; // adjust path to your service file
import "../../../css/ACustomRetrieveRecords.css";

const CustomRetrieveRecords = () => {
  const navigate = useNavigate();

  const [rows, setRows] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [enabling, setEnabling] = useState(false);
  const [removing, setRemoving] = useState(false);
  const [status, setStatus] = useState({ type: "", text: "" });

  // ---------- Load ----------
  const loadRecords = useCallback(async () => {
    setLoading(true);
    try {
      const list = await getInactiveRecipients(); // GET api/admin/recipients/inactive
      setRows(list);
      setSelectedIds([]);
    } catch (err) {
      console.error(err);
      setStatus({ type: "error", text: getApiError(err, "Could not load records.") });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadRecords();
  }, [loadRecords]);

  // The API already returns only the Inactive recipients
  const pastRows = rows;

  // ---------- Selection ----------
  const allSelected =
    pastRows.length > 0 && pastRows.every((r) => selectedIds.includes(r.id));

  const toggleAll = () => {
    const ids = pastRows.map((r) => r.id);
    setSelectedIds(allSelected ? [] : ids);
  };

  const toggleRow = (id) =>
    setSelectedIds(
      selectedIds.includes(id) ? selectedIds.filter((x) => x !== id) : [...selectedIds, id]
    );

  // ---------- Enable Users (make ticked records Active again) ----------
  const handleEnable = async () => {
    if (!selectedIds.length) {
      setStatus({ type: "error", text: "Tick at least one record first." });
      return;
    }

    try {
      setEnabling(true);
      setStatus({ type: "", text: "" });

      // PATCH api/admin/recipients/bulk/enable  { recipientIds: [..] }
      const { enabled } = await enableRecipients(selectedIds);
      await loadRecords(); // enabled users leave this list (they are Active again in Custom+)

      setStatus({
        type: "ok",
        text: `${enabled} user${enabled === 1 ? "" : "s"} enabled successfully.`,
      });
    } catch (err) {
      console.error(err);
      setStatus({ type: "error", text: getApiError(err, "Could not enable users. Please try again.") });
    } finally {
      setEnabling(false);
    }
  };

  // ---------- Remove Users (delete the ticked records) ----------
  // POST api/admin/recipients/bulk/remove  { recipientIds: [..] }
  const handleRemove = async () => {
    if (!selectedIds.length) {
      setStatus({ type: "error", text: "Tick at least one record first." });
      return;
    }
    if (
      !window.confirm(
        `Remove ${selectedIds.length} selected user${selectedIds.length === 1 ? "" : "s"}? This cannot be undone.`
      )
    ) {
      return;
    }

    try {
      setRemoving(true);
      setStatus({ type: "", text: "" });

      const { deleted, inUse, warning } = await removeRecipients(selectedIds);
      await loadRecords(); // removed users leave this list

      setStatus({
        type: inUse > 0 ? "error" : "ok",
        text:
          `${deleted} user${deleted === 1 ? "" : "s"} removed.` +
          (inUse > 0 ? ` ${warning || `${inUse} could not be removed (used in a pending job).`}` : ""),
      });
    } catch (err) {
      console.error(err);
      setStatus({ type: "error", text: getApiError(err, "Could not remove users. Please try again.") });
    } finally {
      setRemoving(false);
    }
  };

  // ---------- Export to Excel (ticked rows, or all listed rows if none ticked) ----------
  const handleExport = () => {
    const source = selectedIds.length
      ? pastRows.filter((r) => selectedIds.includes(r.id))
      : pastRows;

    if (!source.length) {
      setStatus({ type: "error", text: "No records to export." });
      return;
    }

    const data = source.map((r, i) => ({
      "Sr. No.": i + 1,
      Name: r.name || "",
      "Email Id": r.email || "",
      "WhatsApp No.": r.mobile || "",
    }));

    const sheet = XLSX.utils.json_to_sheet(data);
    sheet["!cols"] = [{ wch: 8 }, { wch: 24 }, { wch: 30 }, { wch: 16 }];
    const book = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(book, sheet, "Details");
    XLSX.writeFile(book, "retrieve-records.xlsx");

    setStatus({
      type: "ok",
      text: `${source.length} record${source.length > 1 ? "s" : ""} exported.`,
    });
  };

  // ---------- Columns ----------
  const columns = useMemo(
    () => [
      {
        id: "select",
        enableSorting: false,
        header: () => (
          <label className="rr-select-all">
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
      { accessorKey: "name", header: "Name", meta: { width: "200px", className: "text-center" } },
      { accessorKey: "email", header: "Email Id", meta: { width: "250px", className: "text-center" } },
      { accessorKey: "mobile", header: "WhatsApp No.", meta: { width: "160px", className: "text-center" } },
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [selectedIds, pastRows]
  );

  return (
    <section className="rr-page">
      <div className="rr-card">
        {/* ---------- Heading ---------- */}
        <header className="rr-head">
          <span className="rr-head-spacer" aria-hidden="true" />
          <div className="rr-title-wrap">
            <h2 className="rr-title">
              <Users size={24} />
              <span>Details</span>
            </h2>
            <span className="rr-underline" />
          </div>
          <button
            type="button"
            className="rr-back"
            onClick={() => navigate("/admin/customplus")}
            aria-label="Back to Custom Plus"
            title="Back"
          >
            <ArrowLeft size={20} />
          </button>
        </header>

        {/* ---------- Actions ---------- */}
        <div className="rr-actions">
          <button
            type="button"
            className="rr-pill rr-pill-green"
            onClick={handleEnable}
            disabled={enabling || removing || loading}
          >
            {enabling ? <Loader2 size={18} className="rr-spin" /> : <UserCheck size={18} />}
            <span>Enable Users</span>
          </button>

          <button
            type="button"
            className="rr-pill"
            style={{ background: "#dc2626", borderColor: "#dc2626", color: "#fff" }}
            onClick={handleRemove}
            disabled={enabling || removing || loading}
          >
            {removing ? <Loader2 size={18} className="rr-spin" /> : <Trash2 size={18} />}
            <span>Remove Users</span>
          </button>

          <button
            type="button"
            className="rr-pill"
            onClick={handleExport}
            disabled={loading}
          >
            <FileSpreadsheet size={18} />
            <span>Export to Excel</span>
          </button>

          <button
            type="button"
            className="rr-pill rr-pill-ghost"
            onClick={loadRecords}
            disabled={loading}
            aria-label="Refresh records"
          >
            <RefreshCw size={18} className={loading ? "rr-spin" : ""} />
            <span>Refresh</span>
          </button>

          <span className="rr-selected">
            {selectedIds.length} selected / {pastRows.length} total
          </span>
        </div>

        {status.text && (
          <div className={`rr-status ${status.type}`} role="status">
            {status.type === "ok" ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
            <span>{status.text}</span>
          </div>
        )}

        {/* ---------- Table ---------- */}
        <div className="rr-table">
          {loading ? (
            <div className="rr-loading">
              <Loader2 size={22} className="rr-spin" />
              <span>Loading records...</span>
            </div>
          ) : (
            <DataTable columns={columns} data={pastRows} centerToolbar />
          )}
        </div>
      </div>
    </section>
  );
};

export default CustomRetrieveRecords;