import React, { useCallback, useEffect, useMemo, useState } from "react";
import DataTable from "../../components/common/Table/DataTable";
import { getAllContacts, getContactById, markContactRead, apiErrorMessage } from "../../api/superAdminService";
import "../../css/CPContact.css";

const MSG_LIMIT = 70; // messages longer than this get a "Read More" link

const FILTERS = [
  { key: "all", label: "All", isRead: undefined },
  { key: "unread", label: "Unread", isRead: false },
  { key: "read", label: "Read", isRead: true },
];

const formatDate = (iso) => {
  if (!iso) return "";
  const [y, m, d] = String(iso).split("-");
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

const CPContact = () => {
  const [contacts, setContacts] = useState([]);
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [selected, setSelected] = useState(null); // contact shown in the details modal
  const [detailLoading, setDetailLoading] = useState(false);
  const [markingId, setMarkingId] = useState(null);

  const load = useCallback(async () => {
    const f = FILTERS.find((x) => x.key === filter);
    try {
      setLoading(true);
      setError("");
      setContacts(await getAllContacts({ isRead: f?.isRead }));
    } catch (err) {
      setError(apiErrorMessage(err, "Unable to load contact messages."));
      setContacts([]);
    } finally {
      setLoading(false);
    }
  }, [filter]);

  useEffect(() => {
    load();
  }, [load]);

  const setReadLocally = (id) => {
    setContacts((list) => list.map((c) => (c.id === id ? { ...c, isRead: true } : c)));
    setSelected((s) => (s && s.id === id ? { ...s, isRead: true } : s));
  };

  const markRead = useCallback(async (id) => {
    try {
      setMarkingId(id);
      await markContactRead(id);
      setReadLocally(id);
    } catch (err) {
      setError(apiErrorMessage(err, "Unable to mark the message as read."));
    } finally {
      setMarkingId(null);
    }
  }, []);

  // open details (GET /contacts/{id}) and mark as read if it is unread
  const openDetails = useCallback(
    async (row) => {
      setSelected(row);
      try {
        setDetailLoading(true);
        const detail = await getContactById(row.id);
        setSelected({ ...row, ...detail });
        if (!(detail.isRead || row.isRead)) await markRead(row.id);
      } catch (err) {
        setError(apiErrorMessage(err, "Unable to load message details."));
      } finally {
        setDetailLoading(false);
      }
    },
    [markRead]
  );

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
        cell: ({ row }) => (
          <span className={row.original.isRead ? "" : "cpc-unread"}>{row.original.name}</span>
        ),
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
      {
        accessorKey: "isRead",
        header: "Status",
        cell: ({ getValue }) => (
          <span className={`cpc-badge ${getValue() ? "read" : "unread"}`}>
            {getValue() ? "Read" : "Unread"}
          </span>
        ),
        meta: { className: "text-center", width: "110px" },
      },
      {
        id: "actions",
        header: "Action",
        enableSorting: false,
        cell: ({ row }) => {
          const c = row.original;
          return (
            <div className="cpc-actions">
              <button type="button" className="cpc-btn" onClick={() => openDetails(c)}>
                View
              </button>
              {!c.isRead && (
                <button
                  type="button"
                  className="cpc-btn cpc-btn-primary"
                  disabled={markingId === c.id}
                  onClick={() => markRead(c.id)}
                >
                  {markingId === c.id ? "..." : "Mark Read"}
                </button>
              )}
            </div>
          );
        },
        meta: { className: "text-center", width: "190px" },
      },
    ],
    [markingId, markRead, openDetails]
  );

  // CSV opens directly in Excel
  const handleExportExcel = () => {
    const esc = (v) => `"${String(v ?? "").replace(/"/g, '""')}"`;
    const head = ["Sr. No.", "Date", "Name", "Email Id", "Mobile No.", "Subject", "Message", "Status"];
    const rows = contacts.map((c, i) => [
      i + 1,
      formatDate(c.date),
      c.name,
      c.email,
      c.mobile,
      c.subject,
      c.message,
      c.isRead ? "Read" : "Unread",
    ]);
    const csv = [head, ...rows].map((r) => r.map(esc).join(",")).join("\r\n");
    const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "contact-details.csv";
    a.click();
    URL.revokeObjectURL(url);
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

        {/* Filter tabs */}
        <div className="cpc-tabs">
          {FILTERS.map((f) => (
            <button
              key={f.key}
              type="button"
              className={`cpc-tab ${filter === f.key ? "active" : ""}`}
              onClick={() => setFilter(f.key)}
              disabled={loading}
            >
              {f.label}
            </button>
          ))}
        </div>

        {error && (
          <p className="cpc-error" role="alert">
            {error}{" "}
            <button type="button" className="cpc-readmore" onClick={load}>
              Retry
            </button>
          </p>
        )}

        {/* Table card */}
        <div className="cpc-card">
          {loading ? (
            <p className="cpc-state">Loading messages...</p>
          ) : (
            <div className="table-responsive-scroll-wrapper">
              {/* key resets the table (page 1, page size) when the filter changes */}
              <DataTable
                key={filter}
                columns={columns}
                data={contacts}
                onExportExcel={handleExportExcel}
              />
            </div>
          )}
        </div>
      </div>

      {/* Details modal */}
      {selected && (
        <div className="cpc-modal-backdrop" onClick={() => setSelected(null)}>
          <div className="cpc-modal" role="dialog" aria-modal="true" onClick={(e) => e.stopPropagation()}>
            <div className="cpc-modal-head">
              <h5>Message Details</h5>
              <button type="button" className="cpc-modal-x" onClick={() => setSelected(null)} aria-label="Close">
                ×
              </button>
            </div>

            {detailLoading ? (
              <p className="cpc-state">Loading...</p>
            ) : (
              <div className="cpc-modal-body">
                <p><b>Date:</b> {formatDate(selected.date)}</p>
                <p><b>Name:</b> {selected.name}</p>
                <p><b>Email:</b> {selected.email}</p>
                <p><b>Mobile:</b> {selected.mobile}</p>
                {selected.subject && <p><b>Subject:</b> {selected.subject}</p>}
                <p>
                  <b>Status:</b>{" "}
                  <span className={`cpc-badge ${selected.isRead ? "read" : "unread"}`}>
                    {selected.isRead ? "Read" : "Unread"}
                  </span>
                </p>
                <p className="cpc-modal-msg">{selected.message}</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CPContact;