import React, { useMemo, useState } from "react";
import DataTable from "../../components/common/Table/DataTable";
import "../../css/CAddplans.css";

const LIMIT = 40; // text longer than this gets Read more / Read less

// Long text cell: expands and collapses inside the row
const ExpandText = ({ text, bullets = false }) => {
  const [open, setOpen] = useState(false);
  const value = text || "";
  const long = value.length > LIMIT;
  const shown = long && !open ? `${value.slice(0, LIMIT)}…` : value;

  return (
    <div className="cap-text">
      <span className={bullets ? "cap-bullet" : ""}>{shown}</span>
      {long && (
        <button type="button" className="cap-more" onClick={() => setOpen((o) => !o)}>
          {open ? "Read less" : "Read more"}
        </button>
      )}
    </div>
  );
};

const money = (n) =>
  `₹${Number(n || 0).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

// Sample data: replace with your API response
const sampleData = [
  { id: 1, category: "Event", duration: "6 Week/s", certQty: 0, eventQty: 5, downloadQty: 0, price: 1499, title: "Who should choose this?", instruction1: "Duration: Up to 45 Days of event promotion and registrations.", includes: "What you can achieve", instruction2: "Promote events by sharing registration links and QR codes.", enabled: true },
  { id: 2, category: "Event", duration: "2 Month/s", certQty: 0, eventQty: 15, downloadQty: 0, price: 4499, title: "Who should choose this?", instruction1: "Duration: Up to 60 Days of event promotion and registrations.", includes: "What you can achieve", instruction2: "Run longer, structured events with complete participant tracking.", enabled: true },
  { id: 3, category: "Event", duration: "3 Month/s", certQty: 0, eventQty: 30, downloadQty: 0, price: 7999, title: "Who should choose this?", instruction1: "Duration: Up to 90 Days of event promotion and registrations.", includes: "What you can achieve", instruction2: "Manage extended, multi-event programs from one dashboard.", enabled: true },
  { id: 4, category: "Event", duration: "4 Month/s", certQty: 0, eventQty: 40, downloadQty: 0, price: 10999, title: "Who should choose this?", instruction1: "Duration: Up to 120 Days of event promotion and registrations.", includes: "What you can achieve", instruction2: "Maximize reach with long-running campaigns and reports.", enabled: false },
];

const CAddplans = ({ data = sampleData }) => {
  // keeps the Enabled / Disabled switch working until you connect your API
  const [rows, setRows] = useState(data);

  const toggleStatus = (id) => {
    // TODO: call your enable / disable API here
    setRows((prev) => prev.map((r) => (r.id === id ? { ...r, enabled: !r.enabled } : r)));
  };

  const columns = useMemo(
    () => [
      {
        id: "srNo",
        header: "Sr. No.",
        enableSorting: false,
        cell: ({ row }) => row.index + 1,
        meta: { className: "text-center", width: "80px" },
      },
      { accessorKey: "category", header: "Category", meta: { className: "text-center", width: "120px" } },
      { accessorKey: "duration", header: "Duration", meta: { className: "text-center", width: "130px" } },
      { accessorKey: "certQty", header: "Certificate Quantity", meta: { className: "text-center", width: "150px" } },
      { accessorKey: "eventQty", header: "Event Quantity", meta: { className: "text-center", width: "130px" } },
      { accessorKey: "downloadQty", header: "Download Quantity", meta: { className: "text-center", width: "150px" } },
      {
        accessorKey: "price",
        header: "Price",
        cell: ({ getValue }) => money(getValue()),
        meta: { className: "text-center", width: "120px" },
      },
      {
        accessorKey: "title",
        header: "Title",
        cell: ({ getValue }) => <ExpandText text={getValue()} />,
        meta: { className: "text-start", width: "190px" },
      },
      {
        accessorKey: "instruction1",
        header: "Instruction 1",
        cell: ({ getValue }) => <ExpandText text={getValue()} bullets />,
        meta: { className: "text-start", width: "250px" },
      },
      {
        accessorKey: "includes",
        header: "Includes",
        cell: ({ getValue }) => <ExpandText text={getValue()} />,
        meta: { className: "text-start", width: "190px" },
      },
      {
        accessorKey: "instruction2",
        header: "Instruction 2",
        cell: ({ getValue }) => <ExpandText text={getValue()} bullets />,
        meta: { className: "text-start", width: "250px" },
      },
      {
        id: "edit",
        header: "Edit",
        enableSorting: false,
        cell: ({ row }) => (
          <button type="button" className="cap-edit" onClick={() => console.log("Edit plan", row.original)}>
            Edit
          </button>
        ),
        meta: { className: "text-center", width: "100px" },
      },
      {
        id: "status",
        header: "Status",
        accessorFn: (r) => (r.enabled ? "Enabled" : "Disabled"),
        cell: ({ row }) => (
          <button
            type="button"
            className={`cap-status ${row.original.enabled ? "on" : "off"}`}
            onClick={() => toggleStatus(row.original.id)}
            title="Click to change status"
          >
            {row.original.enabled ? "Enabled" : "Disabled"}
          </button>
        ),
        meta: { className: "text-center", width: "130px" },
      },
    ],
    []
  );

  const handleExportExcel = () => {
    // TODO: connect your export-to-Excel logic
    console.log("Export plans", rows);
  };

  return (
    <div className="container-fluid py-4 c-addplans-wrapper">
      <div className="container-fluid px-md-4">

        {/* Heading */}
        <div className="cap-head">
          <h4 className="header-title">Plans Details</h4>
          <div className="cap-line"></div>
        </div>

        {/* Table card */}
        <div className="cap-card">
          <div className="table-responsive-scroll-wrapper">
            <DataTable columns={columns} data={rows} onExportExcel={handleExportExcel} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CAddplans;
