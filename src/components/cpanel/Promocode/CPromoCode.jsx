import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ChevronDown, Check } from "lucide-react";

import "./PromoCode.css"; // if your file is still named PromoCode.css, change this line
import Button from "../../common/button/Button";
import DataTable from "../../common/Table/DataTable";
import {
  getPromoCodes,
  getPlanOptions,
  createPromoCode,
  setPromoVisibility,
  setPromoCodeStatus,
  apiErrorMessage,
} from "../../../api/superAdminService"; // adjust the path to where superadminservice.js is
import PromoCode from "../../common/promocode/PromoCode";
import { validatePromoCode } from "../../../validations/superadmin/promoCodeSchemas"; // adjust the path if needed

const emptyForm = {
  promoCode: "",
  promoType: "Single",
  discount: "",
  allPlans: false, // "All Plans" -> planIds = []
  planIds: [], // selected plan ids
  validityStart: "",
  expireDate: "",
};

// 2026-10-16 -> 16/10/2026
const fmt = (iso) => {
  if (!iso) return "";
  const [y, m, d] = iso.split("-");
  return `${d}/${m}/${y}`;
};

const sameId = (a, b) => String(a) === String(b);

// small helper to show a validation message under a field
const FieldError = ({ message }) =>
  message ? (
    <p className="pc-error" role="alert">
      {message}
    </p>
  ) : null;

const CPromoCode = () => {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [formData, setFormData] = useState(emptyForm);
  const [planOptions, setPlanOptions] = useState([]); // [{ id, label }] from GET /superadmin/promocodes/plans
  const [plansLoading, setPlansLoading] = useState(true);
  const [plansError, setPlansError] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [error, setError] = useState(""); // server / general error
  const [fieldErrors, setFieldErrors] = useState({}); // Joi validation errors per field
  const [submitting, setSubmitting] = useState(false);
  const [pending, setPending] = useState({}); // { "<id>:<key>": true } while a toggle request is running
  const dropRef = useRef(null);

  // red border for an invalid input
  const invalidStyle = (name) =>
    fieldErrors[name] ? { borderColor: "#c0392b" } : undefined;

  const clearFieldError = (...names) =>
    setFieldErrors((prev) => {
      if (!names.some((n) => prev[n])) return prev;
      const next = { ...prev };
      names.forEach((n) => delete next[n]);
      return next;
    });

  /* ---------- load list ---------- */
  const loadRows = useCallback(async () => {
    setLoadError("");
    try {
      const list = await getPromoCodes();
      // newest first
      setRows(list.sort((a, b) => (b.date || "").localeCompare(a.date || "") || b.id - a.id));
    } catch (err) {
      setLoadError(apiErrorMessage(err, "Could not load promo codes."));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadRows();
  }, [loadRows]);

  /* ---------- load plans for the dropdown: GET /superadmin/promocodes/plans ---------- */
  const loadPlans = useCallback(async () => {
    setPlansLoading(true);
    setPlansError("");
    try {
      setPlanOptions(await getPlanOptions());
    } catch (err) {
      setPlansError(apiErrorMessage(err, "Could not load plans."));
    } finally {
      setPlansLoading(false);
    }
  }, []);

  useEffect(() => {
    loadPlans();
  }, [loadPlans]);

  /* ---------- close the plan list when clicking outside it ---------- */
  useEffect(() => {
    const close = (e) => {
      if (dropRef.current && !dropRef.current.contains(e.target)) setIsDropdownOpen(false);
    };
    document.addEventListener("mousedown", close);
    document.addEventListener("touchstart", close);
    return () => {
      document.removeEventListener("mousedown", close);
      document.removeEventListener("touchstart", close);
    };
  }, []);

  /* ---------- toggle Status (isEnabled) / Visible (visibilityType 1 or 2) ---------- */
  const toggle = useCallback(
    async (row, key) => {
      const lock = `${row.id}:${key}`;
      if (pending[lock]) return;

      const next = !row[key];
      const patchRow = (value) =>
        setRows((prev) => prev.map((r) => (r.id === row.id ? { ...r, [key]: value } : r)));

      setPending((p) => ({ ...p, [lock]: true }));
      patchRow(next);
      setLoadError("");

      try {
        if (key === "enabled") {
          await setPromoCodeStatus(row.id, next, row.visible); // PATCH /{id}/status
        } else {
          await setPromoVisibility(row.id, next); // PUT /{id}: Show -> 2, Hide -> 1
        }
        await loadRows(); // reload so the table shows what the server stored
      } catch (err) {
        patchRow(row[key]); // rollback
        setLoadError(apiErrorMessage(err, "Could not update the promo code."));
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
        cell: ({ row }) => row.index + 1,
        meta: { className: "text-center", width: "90px" },
      },
      {
        accessorKey: "date",
        header: "Date",
        cell: ({ getValue }) => fmt(getValue()),
        meta: { className: "text-center", width: "130px" },
      },
      {
        accessorKey: "promoCode",
        header: "Promo Code",
        cell: ({ getValue }) => <b className="pc-code">{getValue()}</b>,
        meta: { className: "text-center", width: "150px" },
      },
      {
        accessorKey: "discount",
        header: "Discount (%)",
        cell: ({ getValue }) => `${Number(getValue()).toFixed(4)}%`,
        meta: { className: "text-center", width: "140px" },
      },
      {
        accessorKey: "promoType",
        header: "Assign Type",
        meta: { className: "text-center", width: "130px" },
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
        meta: { className: "text-start", width: "300px" },
      },
      {
        id: "validity",
        header: "Validity Period",
        accessorFn: (r) => `${fmt(r.validityStart)} to ${fmt(r.expireDate)}`,
        meta: { className: "text-center", width: "230px" },
      },
      {
        id: "status",
        header: "Status",
        accessorFn: (r) => (r.enabled ? "Enabled" : "Disabled"),
        cell: ({ row }) => (
          <button
            type="button"
            className={`pc-pill ${row.original.enabled ? "on" : "off"}`}
            onClick={() => toggle(row.original, "enabled")}
            disabled={!!pending[`${row.original.id}:enabled`]}
            title="Click to change status"
          >
            <i></i>
            {row.original.enabled ? "Enabled" : "Disabled"}
          </button>
        ),
        meta: { className: "text-center", width: "150px" },
      },
      {
        id: "visible",
        header: "Visibile Status",
        accessorFn: (r) => (r.visible ? "Show" : "Hide"),
        cell: ({ row }) => (
          <button
            type="button"
            className={`pc-pill ${row.original.visible ? "on" : "hide"}`}
            onClick={() => toggle(row.original, "visible")}
            disabled={!!pending[`${row.original.id}:visible`]}
            title="Click to show or hide this promo code"
          >
            <i></i>
            {row.original.visible ? "Show" : "Hide"}
          </button>
        ),
        meta: { className: "text-center", width: "160px" },
      },
    ],
    [toggle, pending]
  );

  /* ---------- plan dropdown ---------- */
  // names of the selected plans, in the same order as planIds
  const selectedLabels = useMemo(
    () =>
      formData.planIds
        .map((id) => planOptions.find((o) => sameId(o.id, id))?.label)
        .filter(Boolean),
    [formData.planIds, planOptions]
  );

  const planLabel = formData.allPlans ? "All Plans" : selectedLabels.join(", ");

  const toggleAllPlans = () => {
    setFormData((prev) => ({ ...prev, allPlans: !prev.allPlans, planIds: [] }));
    setError("");
    clearFieldError("planIds");
  };

  const togglePlan = (id) => {
    setFormData((prev) => ({
      ...prev,
      allPlans: false,
      planIds: prev.planIds.some((x) => sameId(x, id))
        ? prev.planIds.filter((x) => !sameId(x, id))
        : [...prev.planIds, id],
    }));
    setError("");
    clearFieldError("planIds");
  };

  /* ---------- form handlers ---------- */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError("");

    // clear this field's error; the expire date check depends on the start date
    if (name === "validityStart") clearFieldError("validityStart", "expireDate");
    else clearFieldError(name);
  };

  const handleReset = () => {
    setFormData(emptyForm);
    setIsDropdownOpen(false);
    setError("");
    setFieldErrors({});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (submitting) return;

    // Joi validation (src/validations/superadmin/promoCodeSchemas.js)
    const { value, errors } = validatePromoCode(formData);
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      setError("");
      return;
    }
    setFieldErrors({});

    setSubmitting(true);
    setError("");
    try {
      // POST /superadmin/promocodes  (new promo codes: Enabled, visibilityType 1 = Hide)
      // planIds = [] means All Plans. planLabels = plan names, saved so the table shows them.
      await createPromoCode({
        ...value,
        planIds: value.allPlans ? [] : value.planIds,
        planLabels: value.allPlans ? ["All Plans"] : selectedLabels,
        enabled: true,
        visible: false,
      });
      handleReset();
      await loadRows(); // reload so the new row has its real id, date and plan names
    } catch (err) {
      console.error("CREATE PROMO ERROR:", err?.response?.status, err?.response?.data);
      setError(apiErrorMessage(err, "Could not add the promo code."));
    } finally {
      setSubmitting(false);
    }
  };

  const handleExportExcel = () => {
    // TODO: connect your export-to-Excel logic (rows holds the current table data)
    console.log("Export promo codes", rows);
  };

  return (

    <div className="promo-page-wrapper">
      {/* Shared component: renders its own side button + #promoModal.
          role="superadmin" -> lists ALL promo codes from GET /superadmin/promocodes */}
      <PromoCode role="superadmin" />
      {/* ================= FORM ================= */}
      <div className="pc-form-wrap">
        <div className="pc-card">
          <div className="pc-head">
            <h2 className="pc-title">Promo code</h2>
            <div className="pc-underline"></div>
          </div>

          {/* noValidate -> Joi shows the messages instead of the browser popups */}
          <form onSubmit={handleSubmit} className="pc-form" noValidate>
            <div className="pc-group">
              <label htmlFor="promoCode" className="pc-label">
                Promo-code <span className="pc-req">*</span>
              </label>
              <input
                type="text"
                id="promoCode"
                name="promoCode"
                value={formData.promoCode}
                onChange={handleChange}
                className="pc-input"
                style={invalidStyle("promoCode")}
              />
              <FieldError message={fieldErrors.promoCode} />
            </div>

            <div className="pc-group">
              <label className="pc-label">
                Select Type <span className="pc-req">*</span>
              </label>
              <div className="pc-radios">
                <label className="pc-radio">
                  <input type="radio" name="promoType" value="Single" checked={formData.promoType === "Single"} onChange={handleChange} />
                  <span>Single</span>
                </label>
                <label className="pc-radio">
                  <input type="radio" name="promoType" value="Multiple" checked={formData.promoType === "Multiple"} onChange={handleChange} />
                  <span>Multiple</span>
                </label>
              </div>
              <FieldError message={fieldErrors.promoType} />
            </div>

            <div className="pc-group">
              <label htmlFor="discount" className="pc-label">
                Discount (%) <span className="pc-req">*</span>
              </label>
              <input
                type="number"
                id="discount"
                name="discount"
                min="1"
                max="100"
                value={formData.discount}
                onChange={handleChange}
                className="pc-input"
                style={invalidStyle("discount")}
              />
              <FieldError message={fieldErrors.discount} />
            </div>

            <div className="pc-group" ref={dropRef}>
              <label className="pc-label">
                Select for Event/Certificate <span className="pc-req">*</span>
              </label>
              <div className="pc-drop">
                <button
                  type="button"
                  className="pc-drop-btn"
                  style={invalidStyle("planIds")}
                  onClick={() => setIsDropdownOpen((o) => !o)}
                  aria-haspopup="listbox"
                  aria-expanded={isDropdownOpen}
                >
                  <span className={planLabel ? "pc-selected" : "pc-placeholder"}>
                    {planLabel || (plansLoading ? "Loading plans..." : "-- Select Plan --")}
                  </span>
                  <ChevronDown size={16} className={`pc-chevron ${isDropdownOpen ? "open" : ""}`} />
                </button>

                {isDropdownOpen && (
                  <div
                    className="pc-drop-menu"
                    role="listbox"
                    aria-multiselectable="true"
                    style={{ maxHeight: "260px", overflowY: "auto" }}
                  >
                    <div
                      role="option"
                      aria-selected={formData.allPlans}
                      className={`pc-drop-item ${formData.allPlans ? "selected" : ""}`}
                      onClick={toggleAllPlans}
                    >
                      <span>All Plans</span>
                      {formData.allPlans && <Check size={16} />}
                    </div>

                    {plansLoading && <div className="pc-drop-item">Loading plans...</div>}

                    {!plansLoading && plansError && (
                      <div className="pc-drop-item">
                        <span>{plansError}</span>
                        <button
                          type="button"
                          onClick={loadPlans}
                          style={{ textDecoration: "underline", background: "none", border: 0, cursor: "pointer", color: "inherit" }}
                        >
                          Retry
                        </button>
                      </div>
                    )}

                    {!plansLoading && !plansError && planOptions.length === 0 && (
                      <div className="pc-drop-item">No plans found.</div>
                    )}

                    {planOptions.map((item) => {
                      const selected = formData.planIds.some((x) => sameId(x, item.id));
                      return (
                        <div
                          key={item.id}
                          role="option"
                          aria-selected={selected}
                          className={`pc-drop-item ${selected ? "selected" : ""}`}
                          onClick={() => togglePlan(item.id)}
                        >
                          <span>{item.label}</span>
                          {selected && <Check size={16} />}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
              <FieldError message={fieldErrors.planIds} />
            </div>

            <div className="pc-row-2">
              <div className="pc-group">
                <label htmlFor="validityStart" className="pc-label">
                  Validity start from <span className="pc-req">*</span>
                </label>
                <input
                  type="date"
                  id="validityStart"
                  name="validityStart"
                  value={formData.validityStart}
                  onChange={handleChange}
                  className="pc-input"
                  style={invalidStyle("validityStart")}
                />
                <FieldError message={fieldErrors.validityStart} />
              </div>

              <div className="pc-group">
                <label htmlFor="expireDate" className="pc-label">
                  Expire date <span className="pc-req">*</span>
                </label>
                <input
                  type="date"
                  id="expireDate"
                  name="expireDate"
                  min={formData.validityStart || undefined}
                  value={formData.expireDate}
                  onChange={handleChange}
                  className="pc-input"
                  style={invalidStyle("expireDate")}
                />
                <FieldError message={fieldErrors.expireDate} />
              </div>
            </div>

            {error && <p className="pc-error" role="alert">{error}</p>}

            <div className="pc-actions">
              <Button type="button" className="pc-btn-reset" onClick={handleReset} disabled={submitting}>
                Reset
              </Button>
              <Button type="submit" className="pc-btn-add" disabled={submitting}>
                {submitting ? "Adding..." : "Add Promo Code"}
              </Button>
            </div>
          </form>
        </div>
      </div>

      {/* ================= TABLE ================= */}
      <div className="pc-table-card">
        <div className="pc-head">
          <h2 className="pc-title">Promo Code Details</h2>
          <div className="pc-underline"></div>
        </div>

        {loadError && (
          <p className="pc-error" role="alert">
            {loadError}{" "}
            <button type="button" onClick={loadRows} style={{ textDecoration: "underline", background: "none", border: 0, cursor: "pointer", color: "inherit" }}>
              Retry
            </button>
          </p>
        )}

        <div className="pc-scroll">
          {loading ? (
            <p style={{ padding: "16px", textAlign: "center" }}>Loading promo codes...</p>
          ) : (
            <DataTable columns={columns} data={rows} onExportExcel={handleExportExcel} />
          )}
        </div>
      </div>
    </div>
  );
};

export default CPromoCode;