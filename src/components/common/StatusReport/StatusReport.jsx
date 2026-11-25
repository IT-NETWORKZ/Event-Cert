import React, { useEffect, useState, useCallback, useMemo, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import {
    FaListAlt,
    FaEnvelope,
    FaWhatsapp,
    FaExclamationTriangle,
    FaSyncAlt,
    FaCalendarAlt,
} from "react-icons/fa";
import DataTable from "../Table/DataTable";
import {
    getBulkJobs,
    getBulkJobRecipients,
    getApiError,
} from "../../../api/adminService"; // src/api/adminService.js
import { formatDateTime, parseUtc, statusKind } from "../../admin/CustomPlus/bulkJobUtils";
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

// date helpers for the date dropdown (local time)
const jobDate = (job) => parseUtc(job.scheduledAtUtc || job.createdAt);
const dateKey = (d) => (d ? d.toLocaleDateString("en-CA") : ""); // yyyy-mm-dd
const dateLabel = (d) => d.toLocaleDateString([], { dateStyle: "medium" });

// a job whose numbers are still changing (a Scheduled job is waiting, so it is not "running")
const isRunning = (job) => ["pending", "processing"].includes(statusKind(job?.status));

// runs fn over items, at most `limit` at a time
const mapLimit = async (items, limit, fn) => {
    let next = 0;
    const worker = async () => {
        while (next < items.length) await fn(items[next++]);
    };
    await Promise.all(Array.from({ length: Math.min(limit, items.length) }, worker));
};

const StatusReport = ({ type }) => {
    // type = "custom" | "schedule"
    const isCustom = type === "custom";
    const [params, setParams] = useSearchParams();
    const jobIdParam = params.get("jobId");

    const [records, setRecords] = useState([]);
    const [jobs, setJobs] = useState([]);
    const [dateFilter, setDateFilter] = useState(""); // "" = all dates
    const [active, setActive] = useState(false); // some shown job is still running
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const alive = useRef(true);
    const cacheRef = useRef({}); // jobId -> { status, rows }, so a job is read once

    useEffect(() => {
        alive.current = true;
        return () => { alive.current = false; };
    }, []);

    const fetchReport = useCallback(
        async (silent = false, fresh = false) => {
            if (!silent) setLoading(true);
            try {
                if (isCustom) {
                    if (fresh) cacheRef.current = {};

                    // GET api/admin/bulk-jobs  -> every job (also gives the dates for the dropdown)
                    const list = await getBulkJobs();
                    if (!alive.current) return;
                    setJobs(list);

                    const selected = jobIdParam
                        ? list.filter((j) => j.id === jobIdParam)
                        : dateFilter
                        ? list.filter((j) => dateKey(jobDate(j)) === dateFilter)
                        : list;

                    // GET api/admin/bulk-jobs/{id}/recipients  -> only jobs not loaded yet or still changing
                    const toLoad = selected.filter((j) => {
                        const c = cacheRef.current[j.id];
                        return !c || c.status !== j.status || isRunning(j);
                    });
                    await mapLimit(toLoad, 5, async (j) => {
                        try {
                            cacheRef.current[j.id] = { status: j.status, rows: await getBulkJobRecipients(j.id) };
                        } catch (err) {
                            console.error(err);
                        }
                    });
                    if (!alive.current) return;

                    // one table row per user per job, newest first
                    const rows = selected
                        .flatMap((j) => {
                            const ch = channelsOf(j);
                            const when = j.scheduledAtUtc || j.createdAt || "";
                            return (cacheRef.current[j.id]?.rows || []).map((r) => ({
                                ...r,
                                key: `${j.id}-${r.id}`,
                                when: r.processedAt || when,
                                phone: r.mobile,
                                emailStatus: ch.email ? r.emailStatus || r.status : "N/A",
                                whatsappStatus: ch.whatsapp ? r.whatsappStatus || r.status : "N/A",
                            }));
                        })
                        .sort((a, b) => String(b.when).localeCompare(String(a.when)));

                    setRecords(rows);
                    setActive(selected.some(isRunning));
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
        [isCustom, jobIdParam, dateFilter]
    );

    useEffect(() => {
        fetchReport();
    }, [fetchReport]);

    // keep refreshing while the job is still running / waiting
    useEffect(() => {
        if (!isCustom || !active) return undefined;
        const t = setInterval(() => fetchReport(true), POLL_MS);
        return () => clearInterval(t);
    }, [isCustom, active, fetchReport]);

    // dropdown options = the dates that really have jobs, newest first
    const dateOptions = useMemo(() => {
        const map = new Map();
        jobs.forEach((j) => {
            const d = jobDate(j);
            if (d) map.set(dateKey(d), dateLabel(d));
        });
        return [...map.entries()].sort((a, b) => b[0].localeCompare(a[0]));
    }, [jobs]);

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
            ...(isCustom
                ? [
                      {
                          accessorKey: "when",
                          header: "Date",
                          cell: ({ getValue }) => formatDateTime(getValue()),
                          meta: { width: "170px", className: "text-center" },
                      },
                  ]
                : []),
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
                            {isCustom
                                ? ` - ${jobIdParam ? "single job" : dateFilter ? dateOptions.find(([k]) => k === dateFilter)?.[1] || "" : "all dates"}${active ? " (updating live)" : ""}`
                                : ""}
                        </p>
                    </div>

                    <div className="dr-actions">
                        {isCustom && (
                            <label className="dr-date">
                                <FaCalendarAlt />
                                <select
                                    className="dr-select"
                                    value={dateFilter}
                                    onChange={(e) => {
                                        setDateFilter(e.target.value);
                                        if (jobIdParam) setParams({}, { replace: true });
                                    }}
                                    aria-label="Filter by date"
                                >
                                    <option value="">All dates</option>
                                    {dateOptions.map(([key, text]) => (
                                        <option key={key} value={key}>{text}</option>
                                    ))}
                                </select>
                            </label>
                        )}
                        <button className="dr-refresh" onClick={() => fetchReport(false, true)} disabled={loading}>
                            <FaSyncAlt className={loading ? "dr-spin" : ""} />
                            <span>{loading ? "Loading..." : "Refresh"}</span>
                        </button>
                    </div>
                </div>

                {isCustom && jobIdParam && (
                    <div className="dr-note">
                        Showing one job only.{" "}
                        <button type="button" className="dr-link" onClick={() => setParams({}, { replace: true })}>
                            Show all records
                        </button>
                    </div>
                )}

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
