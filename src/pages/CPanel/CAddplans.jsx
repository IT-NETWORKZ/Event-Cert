
import React, { useEffect, useMemo, useRef, useState } from "react";
import { AlertCircle, Plus, X } from "lucide-react";

import DataTable from "../../components/common/Table/DataTable";
import Addplans from "../../components/cpanel/Addplans/Addplans";

import { getApiError } from "../../api/adminService";

import {
  getSuperAdminPlans,
  togglePlanStatus,
} from "../../api/authService";

import "../../css/CAddplans.css";

const LIMIT = 40;

// Backend category mapping
const CATEGORY_LABEL = {
  1: "Event",
  2: "Creatives",
  3: "Event + Creatives",
  4: "Download",
};

// Cache HTML instructions
const itemsCache = new Map();

const htmlToItems = (html) => {
  const key = String(html || "");

  if (itemsCache.has(key)) {
    return itemsCache.get(key);
  }

  let items = [];

  const clean = key.replace(/<[^>]*$/, "");

  if (clean) {
    const doc = new DOMParser().parseFromString(
      clean,
      "text/html"
    );

    items = [...doc.querySelectorAll("li")]
      .map((li) =>
        li.textContent.replace(/\s+/g, " ").trim()
      )
      .filter(Boolean);

    if (!items.length) {
      const text = doc.body.textContent
        .replace(/\s+/g, " ")
        .trim();

      if (text) items = [text];
    }
  }

  itemsCache.set(key, items);

  return items;
};

// Currency formatting
const money = (n) =>
  `₹${Number(n || 0).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

// Expand text
const ExpandText = ({ text }) => {
  const [open, setOpen] = useState(false);

  const value = text || "";
  const long = value.length > LIMIT;

  const shown =
    long && !open
      ? `${value.slice(0, LIMIT)}…`
      : value;

  return (
    <div className="cap-text">
      <span>{shown}</span>

      {long && (
        <button
          type="button"
          className="cap-more"
          onClick={() => setOpen((o) => !o)}
        >
          {open ? "Read less" : "Read more"}
        </button>
      )}
    </div>
  );
};

// Expand instructions
const ExpandList = ({ items }) => {
  const [open, setOpen] = useState(false);

  if (!items.length) return null;

  const first = items[0];

  const long =
    items.length > 1 ||
    first.length > LIMIT;

  return (
    <div className="cap-text">

      {open ? (
        <ul
          style={{
            margin: 0,
            paddingLeft: 18,
            textAlign: "left",
          }}
        >
          {items.map((text, index) => (
            <li key={index}>{text}</li>
          ))}
        </ul>
      ) : (
        <span className="cap-bullet">
          {first.length > LIMIT
            ? `${first.slice(0, LIMIT)}…`
            : first}
        </span>
      )}

      {long && (
        <button
          type="button"
          className="cap-more"
          onClick={() => setOpen((o) => !o)}
        >
          {open ? "Read less" : "Read more"}
        </button>
      )}

    </div>
  );
};

// Form container styles
const formWrapStyle = {
  position: "relative",
  maxWidth: 660,
  margin: "0 auto 24px",
};

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

  // Fetch plans on initial page load only
  useEffect(() => {
    let cancelled = false;

    const fetchPlans = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await getSuperAdminPlans();

        if (!cancelled) {
          setRows(Array.isArray(response) ? response : []);
        }
      } catch (err) {
        console.error("Fetch Plans Error:", err);

        if (!cancelled) {
          setError(
            getApiError(
              err,
              "Could not load plans. Please try again."
            )
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    fetchPlans();

    return () => {
      cancelled = true;
    };
  }, [reloadKey]);

  // Open empty form
  const openAdd = () => {
    setEditing(null);
    setFormOpen(true);
  };

  // Open edit form with original plan data
  const openEdit = (plan) => {
    console.log("Selected Plan for Edit:", plan);

    setEditing(plan);
    setFormOpen(true);
  };

  // Close form
  const closeForm = () => {
    setFormOpen(false);
    setEditing(null);
  };

  // Scroll to form when opened
  useEffect(() => {
    if (formOpen && formRef.current) {
      formRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  }, [formOpen, editing]);

  // Get actual saved plan from API response
  const getSavedPlan = (response) => {
    return (
      response?.data?.data ||
      response?.data ||
      response?.result ||
      response
    );
  };

  // Handle successful POST / PUT
  const handleSave = (response) => {
    console.log("Saved Plan API Response:", response);

    const savedPlan = getSavedPlan(response);

    if (!savedPlan?.planId) {
      console.error(
        "Saved plan ID missing in API response:",
        response
      );
      return;
    }

    if (editing) {
      // Update existing table row
      setRows((prev) =>
        prev.map((item) =>
          item.planId === savedPlan.planId
            ? savedPlan
            : item
        )
      );

    } else {
      // Add newly created plan to table
      setRows((prev) => [
        ...prev,
        savedPlan,
      ]);
    }

    // Close form without page reload
    setFormOpen(false);
    setEditing(null);
  };

  // Toggle plan status
  const toggleStatus = async (planId, currentStatus) => {
    try {
      setTogglingId(planId);

      const response = await togglePlanStatus(
        planId,
        currentStatus
      );

      if (response && response.success) {
        setRows((prev) =>
          prev.map((item) =>
            item.planId === planId
              ? {
                  ...item,
                  isActive: response.isActive,
                }
              : item
          )
        );
      }
    } catch (err) {
      console.error("Failed to toggle status:", err);

      alert(
        getApiError(
          err,
          "Failed to update plan status."
        )
      );
    } finally {
      setTogglingId(null);
    }
  };

  // Table columns
  const columns = useMemo(
    () => [
      {
        id: "srNo",
        header: "Sr. No.",
        enableSorting: false,
        cell: ({ row }) => row.index + 1,
        meta: {
          className: "text-center",
          width: "80px",
        },
      },

      {
        id: "category",
        header: "Category",
        accessorFn: (plan) =>
          CATEGORY_LABEL[plan.planCategory] || "",
        meta: {
          className: "text-center",
          width: "120px",
        },
      },

      {
        id: "duration",
        header: "Duration",
        accessorFn: (plan) =>
          `${plan.durationValue} ${plan.durationUnit}/s`,
        meta: {
          className: "text-center",
          width: "130px",
        },
      },

      {
        accessorKey: "quantity",
        header: "Certificate Quantity",
        meta: {
          className: "text-center",
          width: "150px",
        },
      },

      {
        accessorKey: "eventQuantity",
        header: "Event Quantity",
        meta: {
          className: "text-center",
          width: "130px",
        },
      },

      {
        accessorKey: "downloadQuantity",
        header: "Download Quantity",
        meta: {
          className: "text-center",
          width: "150px",
        },
      },

      {
        accessorKey: "price",
        header: "Price",
        cell: ({ getValue }) => money(getValue()),
        meta: {
          className: "text-center",
          width: "120px",
        },
      },

      {
        accessorKey: "heading1",
        header: "Title",
        cell: ({ getValue }) => (
          <ExpandText text={getValue()} />
        ),
        meta: {
          className: "text-start",
          width: "190px",
        },
      },

      {
        id: "instruction1",
        header: "Instruction 1",
        accessorFn: (plan) =>
          htmlToItems(plan.content1).join(" "),
        cell: ({ row }) => (
          <ExpandList
            items={htmlToItems(row.original.content1)}
          />
        ),
        meta: {
          className: "text-start",
          width: "250px",
        },
      },

      {
        accessorKey: "heading2",
        header: "Includes",
        cell: ({ getValue }) => (
          <ExpandText text={getValue()} />
        ),
        meta: {
          className: "text-start",
          width: "190px",
        },
      },

      {
        id: "instruction2",
        header: "Instruction 2",
        accessorFn: (plan) =>
          htmlToItems(plan.content2).join(" "),
        cell: ({ row }) => (
          <ExpandList
            items={htmlToItems(row.original.content2)}
          />
        ),
        meta: {
          className: "text-start",
          width: "250px",
        },
      },

      {
        id: "edit",
        header: "Edit",
        enableSorting: false,
        cell: ({ row }) => (
          <button
            type="button"
            className="cap-edit"
            onClick={() => openEdit(row.original)}
          >
            Edit
          </button>
        ),
        meta: {
          className: "text-center",
          width: "100px",
        },
      },

      {
        id: "status",
        header: "Status",
        accessorFn: (plan) =>
          plan.isActive ? "Enabled" : "Disabled",

        cell: ({ row }) => {
          const isToggling =
            togglingId === row.original.planId;

          return (
            <button
              type="button"
              className={`cap-status ${
                row.original.isActive ? "on" : "off"
              }`}
              onClick={() =>
                toggleStatus(
                  row.original.planId,
                  row.original.isActive
                )
              }
              disabled={isToggling}
              title="Click to change status"
            >
              {isToggling
                ? "Updating..."
                : row.original.isActive
                ? "Enabled"
                : "Disabled"}
            </button>
          );
        },

        meta: {
          className: "text-center",
          width: "130px",
        },
      },
    ],
    [togglingId]
  );

  // Export
  const handleExportExcel = () => {
    console.log("Export plans:", rows);
  };

  return (
    <div className="container-fluid py-4 c-addplans-wrapper">

      <div className="container-fluid px-md-4">

        {/* Add Plan Button */}
        <div className="d-flex justify-content-end mb-3">

          <button
            type="button"
            className="btn-creative-submit d-inline-flex align-items-center gap-2"
            onClick={openAdd}
          >
            <Plus size={18} />
            Add Plan
          </button>

        </div>

        {/* Add / Edit Form */}
        {formOpen && (
          <div
            ref={formRef}
            style={formWrapStyle}
          >

            <button
              type="button"
              style={closeStyle}
              onClick={closeForm}
              aria-label="Close form"
            >
              <X size={18} />
            </button>

            <Addplans
              key={editing ? editing.planId : "new"}
              plan={editing}
              onSave={handleSave}
            />

          </div>
        )}

        {/* Table Heading */}
        <div className="cap-head">
          <h4 className="header-title">
            Plans Details
          </h4>

          <div className="cap-line"></div>
        </div>

        {/* Error */}
        {error && (
          <div
            className="alert alert-danger d-flex align-items-center justify-content-between gap-2"
            role="alert"
          >
            <span className="d-inline-flex align-items-center gap-2">
              <AlertCircle size={18} />
              {error}
            </span>

            <button
              type="button"
              className="btn btn-sm btn-outline-danger"
              onClick={() => setReloadKey((key) => key + 1)}
            >
              Try again
            </button>
          </div>
        )}

        {/* Plans Table */}
        <div className="cap-card">

          {loading ? (
            <div className="text-center py-5">
              <span
                className="spinner-border spinner-border-sm me-2"
                role="status"
              />
              Loading plans...
            </div>
          ) : (
            <div className="table-responsive-scroll-wrapper">

              <DataTable
                columns={columns}
                data={rows}
                onExportExcel={handleExportExcel}
              />

            </div>
          )}

        </div>

      </div>
    </div>
  );
};

export default CAddplans;


