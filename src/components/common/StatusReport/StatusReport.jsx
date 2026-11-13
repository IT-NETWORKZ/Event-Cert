import React, { useEffect, useState, useCallback, useMemo, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import {
    FaListAlt,
    FaEnvelope,
    FaWhatsapp,
    FaExclamationTriangle,
    FaSyncAlt,
} from "react-icons/fa";
import DataTable from "../Table/DataTable";
import {
    getBulkJob,
    getBulkJobs,
    getBulkJobRecipients,
    getApiError,
} from "../../../api/adminService"; // src/api/adminService.js
import { formatDateTime, isJobActive, statusKind } from "../../admin/CustomPlus/bulkJobUtils";
import "./StatusReport.css";

const POLL_MS = 5000;

// status pill (defined outside so it is not re-created on every render)
// Success / Sent -> Sent, Failed -> Failed, Pending / Processing / Queued -> Pending, "" -> N/A
const StatusBadge = ({ value }) => {
    if (value === "N/A") return <span className="dr-badge dr-na">N/A</span>;
    const kind = statusKind(value);
    const cls = kind === "sent" ? "sent" : kind === "failed" ? "failed" : "pending";
    const text = kind === "sent" ? "Sent" : kind === "failed" ? "Failed" : "Pending";
    return <span className={`dr-badge dr-${cls}`}>{text}</span>;
};

// which channels did the job use?  -> { email, whatsapp }
const channelsOf = (job) => {
    const c = String(job?.channels || "").toLowerCase();
    if (!c) return { email: true, whatsapp: true }; // unknown -> show the status on both
    const both = c.includes("both");
    return { email: both || c.includes("email"), whatsapp: both || c.includes("whatsapp") };
};

const StatusReport = ({ type }) => {
    // type = "custom" | "schedule"
    const isCustom = type === "custom";
    const [params, setParams] = useSearchParams();
    const jobIdParam = params.get("jobId");

    const [records, setRecords] = useState([]);
    const [jobs, setJobs] = useState([]);
    const [job, setJob] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const alive = useRef(true);

    useEffect(() => {
        alive.current = true;
        return () => { alive.current = false; };
    }, []);

    // ---------- custom: job list (picker) -> opens the newest job when none is chosen ----------
    useEffect(() => {
        if (!isCustom) return;
        (async () => {
            try {
                const list = await getBulkJobs();
                if (!alive.current) return;
                setJobs(list);
                if (!jobIdParam && list[0]) setParams({ jobId: list[0].id }, { replace: true });
            } catch (err) {
                console.error(err);
                if (alive.current) setError(getApiError(err, "Could not load jobs."));
            }
        })();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isCustom]);

    const fetchReport = useCallback(
        async (silent = false) => {
            if (!silent) setLoading(true);
            try {
                if (isCustom) {
                    if (!jobIdParam) {
                        setRecords([]);
                        setJob(null);
                        return;
                    }
                    // GET api/admin/bulk-jobs/{id}  +  /recipients
                    const [j, list] = await Promise.all([getBulkJob(jobIdParam), getBulkJobRecipients(jobIdParam)]);
                    if (!alive.current) return;
                    const ch = channelsOf(j);
                    setJob(j);
                    setRecords(
                        list.map((r) => ({
                            ...r,
                            phone: r.mobile,
                            emailStatus: ch.email ? r.emailStatus || r.status : "N/A",
                            whatsappStatus: ch.whatsapp ? r.whatsappStatus || r.status : "N/A",
                        }))
                    );
                    setError("");
                } else {
                    // schedule report (unchanged) - change to your real API endpoint
                    const res = await fetch("/api/schedule/delivery-status");
                    const data = await res.json();
                    setRecords(Array.isArray(data) ? data : []);
                }
            } catch (err) {
                console.error(err);
                if (alive.current) {
                    setRecords([]);
                    setError(getApiError(err, "Could not load the delivery report."));
                }
            } finally {
                if (alive.current && !silent) setLoading(false);
            }
        },
        [isCustom, jobIdParam]
    );

    useEffect(() => {
        fetchReport();
    }, [fetchReport]);

    // keep refreshing while the job is still running / waiting
    const active = isCustom && job ? isJobActive(job.status) : false;
    useEffect(() => {
        if (!active) return undefined;
        const t = setInterval(() => fetchReport(true), POLL_MS);
        return () => clearInterval(t);
    }, [active, fetchReport]);

    const total = records.length;
    const emailSent = records.filter((r) => statusKind(r.emailStatus) === "sent").length;
    const whatsappSent = records.filter((r) => statusKind(r.whatsappStatus) === "sent").length;
    const failed = records.filter(
        (r) => statusKind(r.emailStatus) === "failed" || statusKind(r.whatsappStatus) === "failed"
    ).length;

    const stats = [
        { label: "Total Records", value: total, icon: <FaListAlt />, theme: "total" },
        { label: "Email Sent", value: emailSent, icon: <FaEnvelope />, theme: "email" },
        { label: "WhatsApp Sent", value: whatsappSent, icon: <FaWhatsapp />, theme: "whatsapp" },
        { label: "Failed Records", value: failed, icon: <FaExclamationTriangle />, theme: "failed" },
    ];

    // ---------- Common DataTable columns ----------
    const columns = useMemo(
        () => [
            {
                id: "srNo",
                header: "Sr. No.",
                enableSorting: false,
                cell: ({ row }) => row.index + 1,
                meta: { width: "80px", className: "text-center" },
            },
            { accessorKey: "name", header: "Name", meta: { width: "170px" } },
            { accessorKey: "email", header: "Email", meta: { width: "220px" } },
            { accessorKey: "phone", header: "Phone", meta: { width: "130px" } },
            {
                accessorKey: "emailStatus",
                header: "Email Status",
                cell: ({ getValue }) => <StatusBadge value={getValue()} />,
                meta: { width: "130px", className: "text-center" },
            },
            {
                accessorKey: "whatsappStatus",
                header: "WhatsApp Status",
                cell: ({ getValue }) => <StatusBadge value={getValue()} />,
                meta: { width: "150px", className: "text-center" },
            },
            ...(isCustom
                ? [
                      {
                          accessorKey: "error",
                          header: "Error",
                          cell: ({ getValue }) => getValue() || "-",
                          meta: { width: "220px" },
                      },
                  ]
                : []),
        ],
        [isCustom]
    );

    return (
        <div className="dr-wrap container-fluid">
            <div className="dr-panel">
                {/* Header */}
                <div className="dr-head">
                    <div>
                        <h2 className="dr-title">Delivery Report</h2>
                        <p className="dr-sub">
                            Email &amp; WhatsApp Delivery Report
                            {isCustom && job ? ` - ${job.status}${active ? " (updating live)" : ""}` : ""}
                        </p>
                    </div>

                    <div className="dr-actions">
                        {isCustom && (
                            <select
                                className="dr-select"
                                value={jobIdParam || ""}
                                onChange={(e) => setParams({ jobId: e.target.value })}
                                disabled={!jobs.length}
                                aria-label="Choose a job"
                            >
                                {!jobs.length && <option value="">No jobs yet</option>}
                                {jobs.map((j) => (
                                    <option key={j.id} value={j.id}>
                                        {j.designName || j.templateName || "Job"} - {formatDateTime(j.scheduledAtUtc || j.createdAt)} ({j.status})
                                    </option>
                                ))}
                            </select>
                        )}
                        <button className="dr-refresh" onClick={() => fetchReport()} disabled={loading}>
                            <FaSyncAlt className={loading ? "dr-spin" : ""} />
                            <span>{loading ? "Loading..." : "Refresh"}</span>
                        </button>
                    </div>
                </div>

                {error && <div className="dr-error" role="status">{error}</div>}

                {/* Stat cards */}
                <div className="dr-stats">
                    {stats.map((s) => (
                        <div className={`dr-stat dr-stat-${s.theme}`} key={s.label}>
                            <div className="dr-stat-icon">{s.icon}</div>
                            <div className="dr-stat-text">
                                <strong>{s.value.toLocaleString("en-IN")}</strong>
                                <span>{s.label}</span>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Common reusable table (has its own search, entries per page, pagination) */}
                <DataTable columns={columns} data={records} />
            </div>
        </div>
    );
};

export default StatusReport;
