import React, { useMemo, useState } from "react";
import DataTable from "../../common/Table/DataTable"; // adjust the path if needed
import "./PromoCodeTable.css";

// 2026-07-21 -> 21/07/2026
const fmt = (iso) => {
  if (!iso) return "";
  const [y, m, d] = iso.split("-");
  return `${d}/${m}/${y}`;
};

// Sample data: replace with your API response
const sampleData = [
  { id: 1, date: "2026-07-21", promoCode: "Kapil100", discount: 100, assignType: "Single", planType: "Event + Certificate / Card Plan - 2 Month/s", validFrom: "2026-07-21", validTo: "2026-08-06", enabled: true, visible: true },
  { id: 2, date: "2026-07-21", promoCode: "Kapil", discount: 100, assignType: "Single", planType: "Download Plan - 1 Month/s", validFrom: "2026-07-21", validTo: "2026-08-06", enabled: true, visible: false },
  { id: 3, date: "2026-07-21", promoCode: "Manoj100", discount: 100, assignType: "Single", planType: "Event + Certificate / Card Plan - 2 Month/s", validFrom: "2026-07-21", validTo: "2026-08-06", enabled: true, visible: true },
  { id: 4, date: "2026-07-21", promoCode: "Manoj", discount: 100, assignType: "Single", planType: "Download Plan - 1 Month/s", validFrom: "2026-07-21", validTo: "2026-08-06", enabled: false, visible: false },
  { id: 5, date: "2026-07-21", promoCode: "Kavita100", discount: 100, assignType: "Single", planType: "Event + Certificate / Card Plan - 2 Month/s", validFrom: "2026-07-21", validTo: "2026-08-06", enabled: true, visible: true },
  { id: 6, date: "2026-07-21", promoCode: "Kavita", discount: 100, assignType: "Single", planType: "Download Plan - 1 Month/s", validFrom: "2026-07-21", validTo: "2026-08-06", enabled: true, visible: false },
];

const PromoCodeTable = ({ data = sampleData, onExportExcel }) => {
  const [rows, setRows] = useState(data);

  // flips "enabled" (Status) or "visible" (Visibile Status) for one row
  const toggle = (id, key) => {
    // TODO: call your enable / show API here
    setRows((prev) => prev.map((r) => (r.id === id ? { ...r, [key]: !r[key] } : r)));
  };

  const columns = useMemo(
    () => [
      {
        id: "srNo",
        header: "Sr.No",
        enableSorting: false,
        cell: (info) => info.row.index + 1,
        meta: { width: "90px", className: "text-center" },
      },
      {
        accessorKey: "date",
        header: "Date",
        cell: ({ getValue }) => fmt(getValue()),
        meta: { width: "130px", className: "text-center" },
      },
      {
        accessorKey: "promoCode",
        header: "Promo Code",
        cell: ({ getValue }) => <b className="pct-code">{getValue()}</b>,
        meta: { width: "150px", className: "text-center" },
      },
      {
        accessorKey: "discount",
        header: "Discount (%)",
        cell: ({ getValue }) => `${Number(getValue()).toFixed(4)}%`,
        meta: { width: "140px", className: "text-center" },
      },
      {
        accessorKey: "assignType",
        header: "Assign Type",
        meta: { width: "130px", className: "text-center" },
      },
      {
        accessorKey: "planType",
        header: "Plan Type",
        meta: { width: "300px", className: "text-start" },
      },
      {
        id: "validity",
        header: "Validity Period",
        accessorFn: (r) => `${fmt(r.validFrom)} to ${fmt(r.validTo)}`,
        meta: { width: "230px", className: "text-center" },
      },
      {
        id: "status",
        header: "Status",
        accessorFn: (r) => (r.enabled ? "Enabled" : "Disabled"),
        cell: ({ row }) => (
          <button
            type="button"
            className={`pct-pill ${row.original.enabled ? "on" : "off"}`}
            onClick={() => toggle(row.original.id, "enabled")}
            title="Click to change status"
          >
            <i></i>
            {row.original.enabled ? "Enabled" : "Disabled"}
          </button>
        ),
        meta: { width: "150px", className: "text-center" },
      },
      {
        id: "visible",
        header: "Visibile Status",
        accessorFn: (r) => (r.visible ? "Show" : "Hide"),
        cell: ({ row }) => (
          <button
            type="button"
            className={`pct-pill ${row.original.visible ? "on" : "hide"}`}
            onClick={() => toggle(row.original.id, "visible")}
            title="Click to show or hide this promo code"
          >
            <i></i>
            {row.original.visible ? "Show" : "Hide"}
          </button>
        ),
        meta: { width: "160px", className: "text-center" },
      },
    ],
    []
  );

  const handleExport = () => {
    if (onExportExcel) return onExportExcel(rows);
    // TODO: connect your export-to-Excel logic
    console.log("Export promo codes", rows);
  };

  return (
    <div className="pct-card">
      {/* Title */}
      <div className="pct-head">
        <h2 className="pct-title">
          Promo <span>Code</span> Details
        </h2>
        <div className="pct-underline"></div>
      </div>

      {/* Reusable DataTable */}
      <div className="pct-scroll">
        <DataTable columns={columns} data={rows} onExportExcel={handleExport} />
      </div>
    </div>
  );
};

export default PromoCodeTable;