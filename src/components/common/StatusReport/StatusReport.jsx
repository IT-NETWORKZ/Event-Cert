import React, { useEffect, useState, useCallback, useMemo } from "react";
import {
    FaListAlt,
    FaEnvelope,
    FaWhatsapp,
    FaExclamationTriangle,
    FaSyncAlt,
} from "react-icons/fa";
import DataTable from "../Table/DataTable";
import "./StatusReport.css";

// status pill (defined outside so it is not re-created on every render)
const StatusBadge = ({ value }) => (
    <span className={`dr-badge dr-${String(value || "pending").toLowerCase()}`}>
        {value || "Pending"}
    </span>
);

const StatusReport = ({ type }) => {
    // type = "custom" | "schedule"
    const [records, setRecords] = useState([]);
    const [loading, setLoading] = useState(false);

    const fetchReport = useCallback(async () => {
        setLoading(true);
        try {
            // change to your real API endpoints
            const url =
                type === "custom"
                    ? "/api/custom/delivery-status"
                    : "/api/schedule/delivery-status";
            const res = await fetch(url);
            const data = await res.json();
            setRecords(Array.isArray(data) ? data : []);
        } catch (err) {
            console.error(err);
            setRecords([]);
        } finally {
            setLoading(false);
        }
    }, [type]);

    useEffect(() => {
        fetchReport();
    }, [fetchReport]);

    const total = records.length;
    const emailSent = records.filter((r) => r.emailStatus === "Sent").length;
    const whatsappSent = records.filter((r) => r.whatsappStatus === "Sent").length;
    const failed = records.filter(
        (r) => r.emailStatus === "Failed" || r.whatsappStatus === "Failed"
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
        ],
        []
    );

    return (
        <div className="dr-wrap container-fluid">
            <div className="dr-panel">
                {/* Header */}
                <div className="dr-head">
                    <div>
                        <h2 className="dr-title">Delivery Report</h2>
                        <p className="dr-sub">Email &amp; WhatsApp Delivery Report</p>
                    </div>
                    <button className="dr-refresh" onClick={fetchReport} disabled={loading}>
                        <FaSyncAlt className={loading ? "dr-spin" : ""} />
                        <span>{loading ? "Loading..." : "Refresh"}</span>
                    </button>
                </div>

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


