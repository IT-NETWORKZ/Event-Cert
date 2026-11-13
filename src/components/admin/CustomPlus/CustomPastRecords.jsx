import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Filter, History, RefreshCw, Loader2, AlertCircle, BarChart3 } from "lucide-react";
import DataTable from "../../common/Table/DataTable";
import { getApiError, getBulkJobs } from "../../../api/adminService"; // adjust path to your service file
import { formatDateTime, statusKind } from "./bulkJobUtils";
import "../../../css/ACustomPastRecords.css";
  import "../../../css/ACustomStatus.css";

// Past Records = every bulk job the admin has created (GET api/admin/bulk-jobs)
const CustomPastRecords = () => {
  const navigate = useNavigate();

  const [jobs, setJobs] = useState([]);
  const [statusFilter, setStatusFilter] = useState("");
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState({ type: "", text: "" });

  const loadJobs = useCallback(async () => {
    setLoading(true);
    setStatus({ type: "", text: "" });
    try {
      setJobs(await getBulkJobs());
    } catch (err) {
      console.error(err);
      setStatus({ type: "error", text: getApiError(err, "Could not load past records.") });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadJobs();
  }, [loadJobs]);

  // filter options come from the statuses that really exist in the data
  const statusOptions = useMemo(() => [...new Set(jobs.map((j) => j.status).filter(Boolean))], [jobs]);
  const filtered = useMemo(
    () => (statusFilter ? jobs.filter((j) => j.status === statusFilter) : jobs),
    [jobs, statusFilter]
  );

  const openStatus = (id) => navigate(`/admin/custom-status?jobId=${encodeURIComponent(id)}`);

  const columns = useMemo(
    () => [
      { id: "srNo", header: "Sr. No.", enableSorting: false, cell: ({ row }) => row.index + 1, meta: { width: "80px", className: "text-center" } },
      {
        id: "design",
        header: "Design / Template",
        accessorFn: (r) => r.designName || r.templateName || "-",
        meta: { width: "200px", className: "text-center" },
      },
      { accessorKey: "channels", header: "Channel", meta: { width: "110px", className: "text-center" } },
      {
        id: "output",
        header: "Output",
        accessorFn: (r) => [r.outputType, r.outputFormat].filter(Boolean).join(" / ") || "-",
        meta: { width: "120px", className: "text-center" },
      },
      {
        id: "date",
        header: "Created / Scheduled",
        accessorFn: (r) => r.scheduledAtUtc || r.createdAt || "",
        cell: ({ row }) => formatDateTime(row.original.scheduledAtUtc || row.original.createdAt),
        meta: { width: "170px", className: "text-center" },
      },
      { accessorKey: "total", header: "Total", meta: { width: "80px", className: "text-center" } },
      { accessorKey: "sent", header: "Sent", meta: { width: "80px", className: "text-center" } },
      { accessorKey: "failed", header: "Failed", meta: { width: "80px", className: "text-center" } },
      { accessorKey: "pending", header: "Pending", meta: { width: "80px", className: "text-center" } },
      {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => (
          <span className={`cs-badge cs-${statusKind(row.original.status)}`}>{row.original.status || "-"}</span>
        ),
        meta: { width: "120px", className: "text-center" },
      },
      {
        id: "view",
        header: "Sent Status",
        enableSorting: false,
        cell: ({ row }) => (
          <button type="button" className="cs-link-btn" onClick={() => openStatus(row.original.id)}>
            <BarChart3 size={15} /> View
          </button>
        ),
        meta: { width: "110px", className: "text-center" },
      },
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  return (
    <section className="pr-page">
      <div className="pr-card">
        <header className="pr-head">
          <span className="pr-head-spacer" aria-hidden="true" />
          <div className="pr-title-wrap">
            <h2 className="pr-title">
              <History size={24} />
              <span>Past Records</span>
            </h2>
            <span className="pr-underline" />
          </div>
          <button type="button" className="pr-back" onClick={() => navigate("/admin/customplus")} aria-label="Back to Custom Plus" title="Back">
            <ArrowLeft size={20} />
          </button>
        </header>

        <div className="pr-actions">
          <button type="button" className="pr-pill" onClick={() => navigate("/admin/custom-status")}>
            <BarChart3 size={18} />
            <span>Sent Status</span>
          </button>
          <button type="button" className="pr-pill pr-pill-ghost" onClick={loadJobs} disabled={loading} aria-label="Refresh records">
            <RefreshCw size={18} className={loading ? "pr-spin" : ""} />
            <span>Refresh</span>
          </button>
        </div>

        {status.text && (
          <div className={`pr-status ${status.type}`} role="status">
            <AlertCircle size={18} />
            <span>{status.text}</span>
          </div>
        )}

        <div className="pr-filters">
          <span className="pr-filters-label">
            <Filter size={16} />
            Filter:
          </span>
          <select className="cs-select" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} aria-label="Filter by status">
            <option value="">All statuses</option>
            {statusOptions.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
          <span className="pr-count">
            <History size={16} />
            Past Records ({filtered.length})
          </span>
        </div>

        <div className="pr-table">
          {loading ? (
            <div className="pr-loading">
              <Loader2 size={22} className="pr-spin" />
              <span>Loading records...</span>
            </div>
          ) : (
            <DataTable columns={columns} data={filtered} centerToolbar />
          )}
        </div>
      </div>
    </section>
  );
};

export default CustomPastRecords;
