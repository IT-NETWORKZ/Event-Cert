import React, { useEffect, useMemo, useRef, useState } from "react";
import { AlertCircle, Plus, X } from "lucide-react";
import DataTable from "../../components/common/Table/DataTable";
import Addplans from "../../components/cpanel/Addplans/Addplans";
import { getApiError } from "../../api/adminService";
import { getSuperAdminPlans, togglePlanStatus } from "../../api/authService";
import "../../css/CAddplans.css";

const LIMIT = 40;

const CATEGORY_LABEL = { 1: "Event", 2: "Creatives", 3: "Event + Creatives", 4: "Download" };
const CATEGORY_NAME = { 1: "Events", 2: "Creatives", 3: "Events + Creatives", 4: "Download" };
const TYPE_TO_CATEGORY = { Event: 1, Creatives: 2, "Event + Creatives": 3, Download: 4 };
const DAYS_PER_UNIT = { Week: 7, Month: 30, Year: 365 };

const itemsCache = new Map();
const htmlToItems = (html) => {
  const key = String(html || "");
  if (itemsCache.has(key)) return itemsCache.get(key);

  let items = [];
  const clean = key.replace(/<[^>]*$/, "");
  if (clean) {
    const doc = new DOMParser().parseFromString(clean, "text/html");
    items = [...doc.querySelectorAll("li")]
      .map((li) => li.textContent.replace(/\s+/g, " ").trim())
      .filter(Boolean);
    if (!items.length) {
      const text = doc.body.textContent.replace(/\s+/g, " ").trim();
      if (text) items = [text];
    }
  }
  itemsCache.set(key, items);
  return items;
};

const escapeHtml = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

const linesToHtml = (text) => {
  const lines = String(text || "")
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean);
  return lines.length ? `<ul>${lines.map((l) => `<li>${escapeHtml(l)}</li>`).join("")}</ul>` : "";
};

const planToForm = (p) => ({
  planType: CATEGORY_LABEL[p.planCategory] || "Creatives",
  durationNum: String(p.durationValue ?? ""),
  durationUnit: `${p.durationUnit}/s`,
  certificateQuantity: String(p.quantity ?? 0),
  eventQuantity: String(p.eventQuantity ?? 0),
  downloadQuantity: String(p.downloadQuantity ?? 0),
  price: String(p.price ?? ""),
  title: p.heading1 || "",
  instructionsPerfectFor: htmlToItems(p.content1).join("\n"),
  heading2: p.heading2 || "",
  instructionsIncludes: htmlToItems(p.content2).join("\n"),
});

const formToPlan = (f, old, nextOrder) => {
  const unit = f.durationUnit.replace("/s", "");
  const value = Number(f.durationNum) || 0;
  const category = TYPE_TO_CATEGORY[f.planType];
  const sameDuration = old && old.durationValue === value && old.durationUnit === unit;

  return {
    planId: old ? old.planId : Date.now(),
    planName: `${CATEGORY_NAME[category]} ${value} ${unit}/s`,
    planCategory: category,
    durationValue: value,
    durationUnit: unit,
    durationDays: sameDuration ? old.durationDays : value * (DAYS_PER_UNIT[unit] || 30),
    price: Number(f.price) || 0,
    currency: old?.currency ?? "INR",
    taxPercentage: old?.taxPercentage ?? 18,
    quantity: Number(f.certificateQuantity) || 0,
    eventQuantity: Number(f.eventQuantity) || 0,
    downloadQuantity: Number(f.downloadQuantity) || 0,
    heading1: f.title.trim(),
    content1: linesToHtml(f.instructionsPerfectFor),
    heading2: f.heading2.trim(),
    content2: linesToHtml(f.instructionsIncludes),
    isPopular: old?.isPopular ?? false,
    displayOrder: old?.displayOrder ?? nextOrder,
    isActive: old?.isActive ?? true,
  };
};

const money = (n) =>
  `₹${Number(n || 0).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

const ExpandText = ({ text }) => {
  const [open, setOpen] = useState(false);
  const value = text || "";
  const long = value.length > LIMIT;
  const shown = long && !open ? `${value.slice(0, LIMIT)}…` : value;

  return (
    <div className="cap-text">
      <span>{shown}</span>
      {long && (
        <button type="button" className="cap-more" onClick={() => setOpen((o) => !o)}>
          {open ? "Read less" : "Read more"}
        </button>
      )}
    </div>
  );
};

const ExpandList = ({ items }) => {
  const [open, setOpen] = useState(false);
  if (!items.length) return null;

  const first = items[0];
  const long = items.length > 1 || first.length > LIMIT;

  return (
    <div className="cap-text">
      {open ? (
        <ul style={{ margin: 0, paddingLeft: 18, textAlign: "left" }}>
          {items.map((t, i) => (
            <li key={i}>{t}</li>
          ))}
        </ul>
      ) : (
        <span className="cap-bullet">{first.length > LIMIT ? `${first.slice(0, LIMIT)}…` : first}</span>
      )}
      {long && (
        <button type="button" className="cap-more" onClick={() => setOpen((o) => !o)}>
          {open ? "Read less" : "Read more"}
        </button>
      )}
    </div>
  );
};

const formWrapStyle = { position: "relative", maxWidth: 660, margin: "0 auto 24px" };
const closeStyle = {
  position: "absolute",
  top: 16,
  right: 16,
  zIndex: 1,
  width: 34,
  height: 34,
  display: "grid",
  placeItems: "center",
  border: 0,
  borderRadius: "50%",
  background: "#eef7f6",
  color: "#173c39",
  cursor: "pointer",
};

const CAddplans = () => {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [reloadKey, setReloadKey] = useState(0);
  const [togglingId, setTogglingId] = useState(null);

  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const formRef = useRef(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError("");

    getSuperAdminPlans()
      .then((list) => {
        if (!cancelled) setRows(list);
      })
      .catch((err) => {
        console.error(err);
        if (!cancelled) setError(getApiError(err, "Could not load plans. Please try again."));
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [reloadKey]);

  const openAdd = () => {
    setEditing(null);
    setFormOpen(true);
  };
  const openEdit = (plan) => {
    setEditing(plan);
    setFormOpen(true);
  };
  const closeForm = () => setFormOpen(false);

  useEffect(() => {
    if (formOpen && formRef.current) {
      formRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [formOpen, editing]);

  const handleSave = (formData) => {
    if (editing) {
      setRows((prev) => prev.map((r) => (r.planId === editing.planId ? formToPlan(formData, r) : r)));
    } else {
      const nextOrder = rows.reduce((max, r) => Math.max(max, r.displayOrder || 0), 0) + 1;
      setRows((prev) => [...prev, formToPlan(formData, null, nextOrder)]);
    }
    closeForm();
  };

  const toggleStatus = async (planId, currentStatus) => {
    try {
      setTogglingId(planId);
      const res = await togglePlanStatus(planId, currentStatus);
      if (res && res.success) {
        setRows((prev) =>
          prev.map((r) => (r.planId === planId ? { ...r, isActive: res.isActive } : r))
        );
      }
    } catch (err) {
      console.error("Failed to toggle status:", err);
      alert(getApiError(err, "Failed to update plan status."));
    } finally {
      setTogglingId(null);
    }
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
      {
        id: "category",
        header: "Category",
        accessorFn: (p) => CATEGORY_LABEL[p.planCategory] || "",
        meta: { className: "text-center", width: "120px" },
      },
      {
        id: "duration",
        header: "Duration",
        accessorFn: (p) => `${p.durationValue} ${p.durationUnit}/s`,
        meta: { className: "text-center", width: "130px" },
      },
      { accessorKey: "quantity", header: "Certificate Quantity", meta: { className: "text-center", width: "150px" } },
      { accessorKey: "eventQuantity", header: "Event Quantity", meta: { className: "text-center", width: "130px" } },
      { accessorKey: "downloadQuantity", header: "Download Quantity", meta: { className: "text-center", width: "150px" } },
      {
        accessorKey: "price",
        header: "Price",
        cell: ({ getValue }) => money(getValue()),
        meta: { className: "text-center", width: "120px" },
      },
      {
        accessorKey: "heading1",
        header: "Title",
        cell: ({ getValue }) => <ExpandText text={getValue()} />,
        meta: { className: "text-start", width: "190px" },
      },
      {
        id: "instruction1",
        header: "Instruction 1",
        accessorFn: (p) => htmlToItems(p.content1).join(" "),
        cell: ({ row }) => <ExpandList items={htmlToItems(row.original.content1)} />,
        meta: { className: "text-start", width: "250px" },
      },
      {
        accessorKey: "heading2",
        header: "Includes",
        cell: ({ getValue }) => <ExpandText text={getValue()} />,
        meta: { className: "text-start", width: "190px" },
      },
      {
        id: "instruction2",
        header: "Instruction 2",
        accessorFn: (p) => htmlToItems(p.content2).join(" "),
        cell: ({ row }) => <ExpandList items={htmlToItems(row.original.content2)} />,
        meta: { className: "text-start", width: "250px" },
      },
      {
        id: "edit",
        header: "Edit",
        enableSorting: false,
        cell: ({ row }) => (
          <button type="button" className="cap-edit" onClick={() => openEdit(row.original)}>
            Edit
          </button>
        ),
        meta: { className: "text-center", width: "100px" },
      },
      {
        id: "status",
        header: "Status",
        accessorFn: (p) => (p.isActive ? "Enabled" : "Disabled"),
        cell: ({ row }) => {
          const isToggling = togglingId === row.original.planId;
          return (
            <button
              type="button"
              className={`cap-status ${row.original.isActive ? "on" : "off"}`}
              onClick={() => toggleStatus(row.original.planId, row.original.isActive)}
              disabled={isToggling}
              title="Click to change status"
            >
              {isToggling ? "Updating..." : row.original.isActive ? "Enabled" : "Disabled"}
            </button>
          );
        },
        meta: { className: "text-center", width: "130px" },
      },
    ],
    [togglingId]
  );

  const handleExportExcel = () => {
    console.log("Export plans", rows);
  };

  return (
    <div className="container-fluid py-4 c-addplans-wrapper">
      <div className="container-fluid px-md-4">
        <div className="d-flex justify-content-end mb-3">
          <button
            type="button"
            className="btn-creative-submit d-inline-flex align-items-center gap-2"
            onClick={openAdd}
          >
            <Plus size={18} /> Add Plan
          </button>
        </div>

        {formOpen && (
          <div ref={formRef} style={formWrapStyle}>
            <button type="button" style={closeStyle} onClick={closeForm} aria-label="Close form">
              <X size={18} />
            </button>
            <Addplans
              key={editing ? editing.planId : "new"}
              plan={editing ? planToForm(editing) : null}
              onSave={handleSave}
            />
          </div>
        )}

        <div className="cap-head">
          <h4 className="header-title">Plans Details</h4>
          <div className="cap-line"></div>
        </div>

        {error && (
          <div className="alert alert-danger d-flex align-items-center justify-content-between gap-2" role="alert">
            <span className="d-inline-flex align-items-center gap-2">
              <AlertCircle size={18} /> {error}
            </span>
            <button type="button" className="btn btn-sm btn-outline-danger" onClick={() => setReloadKey((k) => k + 1)}>
              Try again
            </button>
          </div>
        )}

        <div className="cap-card">
          {loading ? (
            <div className="text-center py-5">
              <span className="spinner-border spinner-border-sm me-2" role="status" />
              Loading plans...
            </div>
          ) : (
            <div className="table-responsive-scroll-wrapper">
              <DataTable columns={columns} data={rows} onExportExcel={handleExportExcel} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CAddplans;