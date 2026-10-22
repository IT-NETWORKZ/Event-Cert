import React, { useMemo } from "react";
import DataTable from "../../common/Table/DataTable";
import Button from "../../common/button/Button";
import "./AdminTransaction.css";

const STATIC_TRANSACTION_DATA = [
  {
    id: 1,
    orderDate: "16-10-2026",
    plans: "Creatives Plan",
    duration: "3 Month/s",
    orgName: "It Networkz",
    department: "sadfg",
    userName: "Shrirang",
    total: "INR ₹0.00",
    gstNo: "-",
    businessName: "-",
    orderId: "FREE-639277507600652058",
    paymentId: "-",
    paymentStatus: "Free-Paid",
    paymentMode: "-",
    invoice: "Invoice",
    receipt: "Receipt",
  },
  {
    id: 2,
    orderDate: "12-10-2026",
    plans: "Event + Creatives Plan",
    duration: "6 Week/s",
    orgName: "IT-Networkz.com",
    department: "CSE",
    userName: "Katepalli",
    total: "INR ₹0.00",
    gstNo: "-",
    businessName: "-",
    orderId: "FREE-639273960209799718",
    paymentId: "-",
    paymentStatus: "Free-Paid",
    paymentMode: "-",
    invoice: "Invoice",
    receipt: "Receipt",
  },
  {
    id: 3,
    orderDate: "12-10-2026",
    plans: "Download Plan",
    duration: "1 Month/s",
    orgName: "IT-Networkz.com",
    department: "CSE",
    userName: "Katepalli",
    total: "INR ₹0.00",
    gstNo: "-",
    businessName: "-",
    orderId: "FREE-639273959843688478",
    paymentId: "-",
    paymentStatus: "Free-Paid",
    paymentMode: "-",
    invoice: "Invoice",
    receipt: "Receipt",
  },
  {
    id: 4,
    orderDate: "10-10-2026",
    plans: "Download Plan",
    duration: "1 Month/s",
    orgName: "VEPL",
    department: "-",
    userName: "Arun",
    total: "INR ₹0.00",
    gstNo: "-",
    businessName: "-",
    orderId: "FREE-639272320765993493",
    paymentId: "-",
    paymentStatus: "Free-Paid",
    paymentMode: "-",
    invoice: "Invoice",
    receipt: "Receipt",
  },
  {
    id: 5,
    orderDate: "10-10-2026",
    plans: "Event + Creatives Plan",
    duration: "6 Week/s",
    orgName: "VEPL",
    department: "-",
    userName: "Arun",
    total: "INR ₹0.00",
    gstNo: "-",
    businessName: "-",
    orderId: "FREE-639272320308604520",
    paymentId: "-",
    paymentStatus: "Free-Paid",
    paymentMode: "-",
    invoice: "Invoice",
    receipt: "Receipt",
  },
  {
    id: 6,
    orderDate: "09-10-2026",
    plans: "Event + Creatives Plan",
    duration: "3 Month/s",
    orgName: "na",
    department: "computer science",
    userName: "Shilpa",
    total: "INR ₹0.00",
    gstNo: "-",
    businessName: "-",
    orderId: "FREE-639271459570670765",
    paymentId: "-",
    paymentStatus: "Free-Paid",
    paymentMode: "-",
    invoice: "Invoice",
    receipt: "Receipt",
  },
];

export default function AdminTransaction({ transactionList = [] }) {
  const tableData = transactionList.length > 0 ? transactionList : STATIC_TRANSACTION_DATA;

  const handleExportExcel = () => {
    // TODO: implement Excel export logic here
    alert("Exporting transactions to Excel...");
  };

  const columns = useMemo(
    () => [
      {
        header: "Sr.No",
        accessorKey: "srNo",
        enableSorting: false,
        meta: { width: "80px", className: "text-center" },
        cell: (info) => info.row.index + 1,
      },
      {
        header: "Order Date",
        accessorKey: "orderDate",
        meta: { width: "130px", className: "text-center" },
      },
      {
        header: "Plans",
        accessorKey: "plans",
        meta: { width: "180px", className: "text-start" },
      },
      {
        header: "Duration",
        accessorKey: "duration",
        meta: { width: "120px", className: "text-center" },
      },
      {
        header: "Org Name",
        accessorKey: "orgName",
        meta: { width: "160px", className: "text-start" },
      },
      {
        header: "Department",
        accessorKey: "department",
        meta: { width: "140px", className: "text-start" },
      },
      {
        header: "User Name",
        accessorKey: "userName",
        meta: { width: "140px", className: "text-start" },
      },
      {
        header: "Total",
        accessorKey: "total",
        meta: { width: "120px", className: "text-center" },
      },
      {
        header: "GST No",
        accessorKey: "gstNo",
        meta: { width: "120px", className: "text-center" },
      },
      {
        header: "Business Name",
        accessorKey: "businessName",
        meta: { width: "150px", className: "text-start" },
      },
      {
        header: "Order ID",
        accessorKey: "orderId",
        meta: { width: "240px", className: "text-start" },
      },
      {
        header: "Payment ID",
        accessorKey: "paymentId",
        meta: { width: "140px", className: "text-center" },
      },
      {
        header: "Payment Status",
        accessorKey: "paymentStatus",
        meta: { width: "140px", className: "text-center" },
      },
      {
        header: "Payment Mode",
        accessorKey: "paymentMode",
        meta: { width: "140px", className: "text-center" },
      },
      {
        header: "Invoice",
        accessorKey: "invoice",
        enableSorting: false,
        meta: { width: "110px", className: "text-center" },
        cell: (info) => (
          <button
            type="button"
            className="at-link-btn"
            onClick={() => alert(`Viewing Invoice for Order: ${info.row.original.orderId}`)}
          >
            {info.getValue()}
          </button>
        ),
      },
      {
        header: "Receipt",
        accessorKey: "receipt",
        enableSorting: false,
        meta: { width: "110px", className: "text-center" },
        cell: (info) => (
          <button
            type="button"
            className="at-link-btn"
            onClick={() => alert(`Viewing Receipt for Order: ${info.row.original.orderId}`)}
          >
            {info.getValue()}
          </button>
        ),
      },
    ],
    []
  );

  return (
    <div className="admin-transaction-page-container">
      <div className="at-table-wrap">
        <div className="at-card">
          <div className="at-head">
            <h2>Admin Transaction Details</h2>
            <div className="at-underline" />
          </div>

          <div className="at-action-bar">
            <Button type="button" className="at-export-btn" onClick={handleExportExcel}>
              Export to Excel
            </Button>
          </div>

          <div className="table-responsive">
            <DataTable columns={columns} data={tableData} />
          </div>
        </div>
      </div>
    </div>
  );
}