import React, { useMemo, useState } from "react";
import DataTable from "../../components/common/Table/DataTable";
import "../../css/CPContact.css";

const MSG_LIMIT = 70; // messages longer than this get a "Read More" link

const formatDate = (iso) => {
  if (!iso) return "";
  const [y, m, d] = iso.split("-");
  return `${d}/${m}/${y}`;
};

// Message cell: expands and collapses inside the row
const MessageCell = ({ message }) => {
  const [open, setOpen] = useState(false);
  const msg = message || "";
  const long = msg.length > MSG_LIMIT;

  return (
    <div className="cpc-msg">
      <span className="cpc-msg-text">
        {long && !open ? `${msg.slice(0, MSG_LIMIT)}…` : msg}
        {long && (
          <button type="button" className="cpc-readmore" onClick={() => setOpen((o) => !o)}>
            {open ? "Read Less" : "Read More"}
          </button>
        )}
      </span>
    </div>
  );
};

// Sample data: replace with your API response
const sampleData = [
  { id: 1, date: "2026-10-15", name: "Robertnum", email: "ninadvhegmannjfc33@gmail.com", mobile: "86191213934", message: "Hello, I would like to know how to send certificates to all participants." },
  { id: 2, date: "2026-10-15", name: "Robertnum", email: "ninadvhegmannjfc33@gmail.com", mobile: "88219929267", message: "Please share the subscription plan details." },
  { id: 3, date: "2026-10-14", name: "Charlesfap", email: "michael.hallenberg@afry.com", mobile: "84347982825", message: "READ THE NEWS AND EARN $50,000,000 PER MONTH SENSIBLY https://telegra.ph/Read-the-latest-news-and-earn-50000000-in-a-month-Message-ID-652731-10-05" },
  { id: 4, date: "2026-10-13", name: "Robertnum", email: "ninadvhegmannjfc33@gmail.com", mobile: "82526557352", message: "My OTP is not arriving on email." },
  { id: 5, date: "2026-10-11", name: "Charlesfap", email: "JASON23MAIL@GMAIL.COM", mobile: "84422576651", message: "READ THE NEWS AND TURN KNOWLEDGE INTO $50,000,000 PER MONTH. Visit the link and start earning today with our simple guide." },
  { id: 6, date: "2026-10-10", name: "Robertnum", email: "joshuaguerrero2v7t40d@gmail.com", mobile: "81435948422", message: "Hallo, ek wou jou prys ken." },
  { id: 7, date: "2026-10-08", name: "Charlesfap", email: "adampukki571@gmail.com", mobile: "82157255466", message: "READ THE NEWS AND EARN $50,000,000 PER MONTH LOYALLY. Click the link below to read more about this offer and join now." },
];

const CPContact = ({ data = sampleData }) => {
  const columns = useMemo(
    () => [
      {
        id: "srNo",
        header: "Sr. No.",
        enableSorting: false,
        cell: ({ row }) => row.index + 1,
        meta: { className: "text-center", width: "80px" },
      },
      {
        accessorKey: "date",
        header: "Date",
        cell: ({ getValue }) => formatDate(getValue()),
        meta: { className: "text-center", width: "120px" },
      },
      {
        accessorKey: "name",
        header: "Name",
        meta: { className: "text-center", width: "160px" },
      },
      {
        accessorKey: "email",
        header: "Email Id",
        meta: { className: "text-center", width: "270px" },
      },
      {
        accessorKey: "mobile",
        header: "Mobile No.",
        meta: { className: "text-center", width: "150px" },
      },
      {
        accessorKey: "message",
        header: "Message",
        meta: { className: "text-start", width: "420px" },
        cell: ({ row }) => <MessageCell message={row.original.message} />,
      },
    ],
    []
  );

  const handleExportExcel = () => {
    // TODO: connect your export-to-Excel logic
    console.log("Export contact details", data);
  };

  return (
    <div className="container-fluid py-4 cp-page-wrapper">
      <div className="container-fluid px-md-4">

        {/* Heading */}
        <div className="cpc-head">
          <h4 className="header-title">Contact Details</h4>
          <div className="cpc-line"></div>
          <p className="header-subtitle">Messages received from the Contact Us form</p>
        </div>

        {/* Table card */}
        <div className="cpc-card">
          <div className="table-responsive-scroll-wrapper">
            <DataTable columns={columns} data={data} onExportExcel={handleExportExcel} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CPContact;

