import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Filter,
  History,
  RotateCcw,
  RefreshCw,
  Loader2,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import DataTable from "../../common/Table/DataTable";
import "../../../css/ACustomPastRecords.css";

const emptyFilters = {
  duplicateName: false,
  duplicateEmail: false,
  duplicateMobile: false,
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

const CustomPastRecords = () => {
  const navigate = useNavigate();

  const [rows, setRows] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const [filters, setFilters] = useState(emptyFilters);
  const [loading, setLoading] = useState(true);
  const [retrieving, setRetrieving] = useState(false);
  const [status, setStatus] = useState({ type: "", text: "" });

  // ---------- Load ----------
  const loadRecords = useCallback(async () => {
    setLoading(true);
    try {
      const list = await getRecipients({ page: 1, pageSize: 500 });
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

  // Past records = recipients that are currently Inactive
  const pastRows = useMemo(() => rows.filter((r) => r.isActive === false), [rows]);

  // ---------- Filters ----------
  const toggleFilter = (name) => setFilters((prev) => ({ ...prev, [name]: !prev[name] }));

  const filteredData = useMemo(() => {
    const isDupName = buildDuplicateChecker(pastRows, "name");
    const isDupEmail = buildDuplicateChecker(pastRows, "email");
    const isDupMobile = buildDuplicateChecker(pastRows, "mobile");

    return pastRows.filter((row) => {
      if (filters.duplicateName && !isDupName(row)) return false;
      if (filters.duplicateEmail && !isDupEmail(row)) return false;
      if (filters.duplicateMobile && !isDupMobile(row)) return false;
      return true;
    });
  }, [pastRows, filters]);

  // ---------- Selection ----------
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

  // ---------- Retrieve (make selected records Active again) ----------
  const handleRetrieve = async () => {
    if (!selectedIds.length) {
      setStatus({ type: "error", text: "Tick at least one record first." });
      return;
    }

    setRetrieving(true);
    setStatus({ type: "", text: "" });

    const results = await Promise.allSettled(
      selectedIds.map((id) => setRecipientStatus(id, true))
    );
    const okIds = selectedIds.filter((_, i) => results[i].status === "fulfilled");
    const failed = selectedIds.length - okIds.length;

    setRows((prev) => prev.map((r) => (okIds.includes(r.id) ? { ...r, isActive: true } : r)));
    setSelectedIds((prev) => prev.filter((id) => !okIds.includes(id)));

    setStatus({
      type: failed ? "error" : "ok",
      text: failed
        ? `${okIds.length} retrieved, ${failed} failed. Please try again.`
        : `${okIds.length} record${okIds.length > 1 ? "s" : ""} retrieved successfully.`,
    });
    setRetrieving(false);
  };

  // ---------- Columns ----------
  const columns = useMemo(
    () => [
      {
        id: "select",
        enableSorting: false,
        header: () => (
          <label className="pr-select-all">
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
      { accessorKey: "name", header: "Name", meta: { width: "180px", className: "text-center" } },
      { accessorKey: "email", header: "Email Id", meta: { width: "230px", className: "text-center" } },
      { accessorKey: "mobile", header: "WhatsApp No.", meta: { width: "150px", className: "text-center" } },
      { accessorKey: "groupName", header: "Group Name", meta: { width: "140px", className: "text-center" } },
      {
        id: "status",
        header: "Status",
        enableSorting: false,
        cell: () => <span className="pr-badge">Inactive</span>,
        meta: { width: "110px", className: "text-center" },
      },
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [selectedIds, filteredData]
  );

  return (
    <section className="pr-page">
      <div className="pr-card">
        {/* ---------- Heading ---------- */}
        <header className="pr-head">
          <span className="pr-head-spacer" aria-hidden="true" />
          <div className="pr-title-wrap">
            <h2 className="pr-title">
              <History size={24} />
              <span>Past Records</span>
            </h2>
            <span className="pr-underline" />
          </div>
          <button
            type="button"
            className="pr-back"
            onClick={() => navigate("/admin/customplus")}
            aria-label="Back to Custom Plus"
            title="Back"
          >
            <ArrowLeft size={20} />
          </button>
        </header>

        {/* ---------- Actions ---------- */}
        <div className="pr-actions">
          <button
            type="button"
            className="pr-pill"
            onClick={handleRetrieve}
            disabled={retrieving || loading}
          >
            {retrieving ? <Loader2 size={18} className="pr-spin" /> : <RotateCcw size={18} />}
            <span>Retrieve Records</span>
          </button>

          <button
            type="button"
            className="pr-pill pr-pill-ghost"
            onClick={loadRecords}
            disabled={loading}
            aria-label="Refresh records"
          >
            <RefreshCw size={18} className={loading ? "pr-spin" : ""} />
            <span>Refresh</span>
          </button>

          <span className="pr-selected">
            {selectedIds.length} selected
          </span>
        </div>

        {status.text && (
          <div className={`pr-status ${status.type}`} role="status">
            {status.type === "ok" ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
            <span>{status.text}</span>
          </div>
        )}

        {/* ---------- Filters ---------- */}
        <div className="pr-filters">
          <span className="pr-filters-label">
            <Filter size={16} />
            Filters:
          </span>

          <label className="pr-chip">
            <input
              type="checkbox"
              checked={filters.duplicateName}
              onChange={() => toggleFilter("duplicateName")}
            />
            <span>Duplicate Name</span>
          </label>

          <label className="pr-chip">
            <input
              type="checkbox"
              checked={filters.duplicateEmail}
              onChange={() => toggleFilter("duplicateEmail")}
            />
            <span>Duplicate Email</span>
          </label>

          <label className="pr-chip">
            <input
              type="checkbox"
              checked={filters.duplicateMobile}
              onChange={() => toggleFilter("duplicateMobile")}
            />
            <span>Duplicate Mobile</span>
          </label>

          <span className="pr-count">
            <History size={16} />
            Past Records ({pastRows.length})
          </span>
        </div>

        {/* ---------- Table ---------- */}
        <div className="pr-table">
          {loading ? (
            <div className="pr-loading">
              <Loader2 size={22} className="pr-spin" />
              <span>Loading records...</span>
            </div>
          ) : (
            <DataTable columns={columns} data={filteredData} centerToolbar />
          )}
        </div>
      </div>
    </section>
  );
};

export default CustomPastRecords;