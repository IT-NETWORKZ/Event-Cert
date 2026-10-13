import React, { useEffect, useState, useCallback, useMemo } from "react";
import {
    FaListAlt,
    FaEnvelope,
    FaWhatsapp,
    FaExclamationTriangle,
    FaSyncAlt,
} from "react-icons/fa";
import DataTable from "../Table/DataTable";
import "./DeliveryReport.css";

// status pill (defined outside so it is not re-created on every render)
const StatusBadge = ({ value }) => (
    <span className={`dr-badge dr-${String(value || "pending").toLowerCase()}`}>
        {value || "Pending"}
    </span>
);

const DeliveryReport = ({ type }) => {
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

export default DeliveryReport;


// import React, { useEffect, useState, useCallback } from "react";

// const DeliveryReport = ({ type }) => {
//     // type = "custom" | "schedule"
//     const [records, setRecords] = useState([]);
//     const [loading, setLoading] = useState(false);
//     const [pageSize, setPageSize] = useState(50);
//     const [search, setSearch] = useState("");

//     const fetchReport = useCallback(async () => {
//         setLoading(true);
//         try {
//             // change to your real API endpoints
//             const url =
//                 type === "custom"
//                     ? "/api/custom/delivery-status"
//                     : "/api/schedule/delivery-status";
//             const res = await fetch(url);
//             const data = await res.json();
//             setRecords(Array.isArray(data) ? data : []);
//         } catch (err) {
//             console.error(err);
//             setRecords([]);
//         } finally {
//             setLoading(false);
//         }
//     }, [type]);

//     useEffect(() => {
//         fetchReport();
//     }, [fetchReport]);

//     const total = records.length;
//     const emailSent = records.filter(r => r.emailStatus === "Sent").length;
//     const whatsappSent = records.filter(r => r.whatsappStatus === "Sent").length;
//     const failed = records.filter(
//         r => r.emailStatus === "Failed" || r.whatsappStatus === "Failed"
//     ).length;

//     const filtered = records
//         .filter(r => JSON.stringify(r).toLowerCase().includes(search.toLowerCase()))
//         .slice(0, pageSize);

//     return (
//         <div className="container-fluid p-4">
//             <div className="card shadow-sm p-4">
//                 <div className="d-flex justify-content-between align-items-start">
//                     <div>
//                         <h2>Delivery Report</h2>
//                         <p className="text-muted">Email &amp; WhatsApp Delivery Report</p>
//                     </div>
//                     <button className="btn btn-primary rounded-pill px-4" onClick={fetchReport}>
//                         {loading ? "Loading..." : "Refresh"}
//                     </button>
//                 </div>

//                 <div className="row g-3 my-2">
//                     <div className="col-md-3"><div className="p-3 rounded text-white bg-primary"><h6>Total Records</h6><h3>{total}</h3></div></div>
//                     <div className="col-md-3"><div className="p-3 rounded text-white bg-success"><h6>Email Sent</h6><h3>{emailSent}</h3></div></div>
//                     <div className="col-md-3"><div className="p-3 rounded text-white bg-success"><h6>WhatsApp Sent</h6><h3>{whatsappSent}</h3></div></div>
//                     <div className="col-md-3"><div className="p-3 rounded text-white bg-danger"><h6>Failed Records</h6><h3>{failed}</h3></div></div>
//                 </div>

//                 <div className="d-flex justify-content-between my-3">
//                     <div>
//                         <select value={pageSize} onChange={e => setPageSize(Number(e.target.value))}>
//                             {[10, 25, 50, 100].map(n => <option key={n}>{n}</option>)}
//                         </select>{" "}
//                         Entries per page
//                     </div>
//                     <input
//                         placeholder="Search..."
//                         value={search}
//                         onChange={e => setSearch(e.target.value)}
//                     />
//                 </div>

//                 <div className="table-responsive">
//                     <table className="table">
//                         <thead>
//                             <tr>
//                                 <th>Name</th><th>Email</th><th>Phone</th>
//                                 <th>Email Status</th><th>WhatsApp Status</th>
//                             </tr>
//                         </thead>
//                         <tbody>
//                             {filtered.length === 0 ? (
//                                 <tr><td colSpan={5} className="text-center">No Records Found</td></tr>
//                             ) : (
//                                 filtered.map((r, i) => (
//                                     <tr key={r.id ?? i}>
//                                         <td>{r.name}</td>
//                                         <td>{r.email}</td>
//                                         <td>{r.phone}</td>
//                                         <td>{r.emailStatus}</td>
//                                         <td>{r.whatsappStatus}</td>
//                                     </tr>
//                                 ))
//                             )}
//                         </tbody>
//                     </table>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default DeliveryReport;