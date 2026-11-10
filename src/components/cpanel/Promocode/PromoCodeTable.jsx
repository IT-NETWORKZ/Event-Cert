import React, { useCallback, useEffect, useMemo, useState } from "react";
import DataTable from "../../common/Table/DataTable"; // adjust the path if needed
import "./PromoCodeTable.css";
import {
  getPromoCodes,
  setPromoVisibility,
  setPromoCodeStatus,
  apiErrorMessage,
} from "../../../api/superAdminService"; // adjust the path to where superadminservice.js is

// 2026-07-21 -> 21/07/2026
const fmt = (iso) => {
  if (!iso) return "";
  const [y, m, d] = iso.split("-");
  return `${d}/${m}/${y}`;
};

/**
 * Props
 *  - onExportExcel(rows): optional export handler
 *  - refreshKey: optional. Change it (e.g. increment after the Add form succeeds) to reload the table.
 */
const PromoCodeTable = ({ onExportExcel, refreshKey = 0 }) => {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [pending, setPending] = useState({}); // { "<id>:<key>": true } while a request is running

  /* ---------- GET /superadmin/promocodes (plan names are resolved inside getPromoCodes) ---------- */
  const loadRows = useCallback(async () => {
    setError("");
    try {
      const list = await getPromoCodes();
      setRows(list.sort((a, b) => (b.date || "").localeCompare(a.date || "") || b.id - a.id));
    } catch (err) {
      setError(apiErrorMessage(err, "Could not load promo codes."));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadRows();
  }, [loadRows, refreshKey]);

  /* ---------- toggle Status (enabled) or Visibile Status (visible) ---------- */
  // Status  -> PATCH /{id}/status  (isEnabled; current visibilityType sent along)
  // Visible -> PUT   /{id}         (visibilityType: Show = 2, Hide = 1)
  const toggle = useCallback(
    async (row, key) => {
      const lock = `${row.id}:${key}`;
      if (pending[lock]) return;

      const next = !row[key];
      const patchRow = (value) =>
        setRows((prev) => prev.map((r) => (r.id === row.id ? { ...r, [key]: value } : r)));

      setPending((p) => ({ ...p, [lock]: true }));
      setError("");
      patchRow(next);

      try {
        if (key === "enabled") {
          await setPromoCodeStatus(row.id, next, row.visible);
        } else {
          await setPromoVisibility(row.id, next);
        }
        await loadRows(); // show exactly what the server stored
      } catch (err) {
        patchRow(row[key]); // rollback
        setError(apiErrorMessage(err, "Could not update the promo code."));
      } finally {
        setPending((p) => {
          const { [lock]: _done, ...rest } = p;
          return rest;
        });
      }
    },
    [pending, loadRows]
  );

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
        cell: ({ getValue }) => `${Number(getValue()).toFixed(2)}%`,
        meta: { width: "140px", className: "text-center" },
      },
      {
        accessorKey: "promoType",
        header: "Assign Type",
        meta: { width: "130px", className: "text-center" },
      },
      {
        accessorKey: "plan",
        header: "Plan Type",
        cell: ({ row }) => {
          const names = row.original.planNames?.length ? row.original.planNames : [row.original.plan];
          return (
            <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
              {names.map((n, i) => (
                <span key={`${n}-${i}`}>{n}</span>
              ))}
            </div>
          );
        },
        meta: { width: "300px", className: "text-start" },
      },
      {
        id: "validity",
        header: "Validity Period",
        accessorFn: (r) => `${fmt(r.validityStart)} to ${fmt(r.expireDate)}`,
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
            onClick={() => toggle(row.original, "enabled")}
            disabled={!!pending[`${row.original.id}:enabled`]}
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
            onClick={() => toggle(row.original, "visible")}
            disabled={!!pending[`${row.original.id}:visible`]}
            title="Click to show or hide this promo code"
          >
            <i></i>
            {row.original.visible ? "Show" : "Hide"}
          </button>
        ),
        meta: { width: "160px", className: "text-center" },
      },
    ],
    [toggle, pending]
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

      {error && (
        <p role="alert" style={{ color: "#c0392b", margin: "8px 16px" }}>
          {error}{" "}
          <button
            type="button"
            onClick={loadRows}
            style={{ textDecoration: "underline", background: "none", border: 0, cursor: "pointer", color: "inherit" }}
          >
            Retry
          </button>
        </p>
      )}

      {/* Reusable DataTable */}
      <div className="pct-scroll">
        {loading ? (
          <p style={{ padding: "16px", textAlign: "center" }}>Loading promo codes...</p>
        ) : (
          <DataTable columns={columns} data={rows} onExportExcel={handleExport} />
        )}
      </div>
    </div>
  );
};

export default PromoCodeTable;