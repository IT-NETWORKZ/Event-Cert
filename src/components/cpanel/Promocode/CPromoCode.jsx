import React, { useEffect, useMemo, useRef, useState } from "react";
import { ChevronDown, Check } from "lucide-react";

import "./PromoCode.css"; // if your file is still named PromoCode.css, change this line
import Button from "../../common/button/Button";
import DataTable from "../../common/Table/DataTable";

const PLANS = [
  "All Plans",
  "Event Plan - 6 Week/s",
  "Event Plan - 2 Month/s",
  "Event Plan - 3 Month/s",
  "Event Plan - 4 Month/s",
  "Event Plan - 6 Month/s",
  "Event Plan - 1 Year/s",
  "Certificate / Card Plan - 1 Month/s",
  "Certificate / Card Plan - 2 Month/s",
  "Certificate / Card Plan - 3 Month/s",
  "Certificate / Card Plan - 1 Year/s",
  "Event + Certificate / Card Plan - 1 Week/s",
  "Event + Certificate / Card Plan - 6 Week/s",
  "Event + Certificate / Card Plan - 2 Month/s",
  "Event + Certificate / Card Plan - 3 Month/s",
  "Event + Certificate / Card Plan - 4 Month/s",
  "Event + Certificate / Card Plan - 6 Month/s",
  "Event + Certificate / Card Plan - 1 Year/s",
  "Download Certificate / Card Plan - 1 Week/s",
  "Download Certificate / Card Plan - 1 Month/s",
  "Download Certificate / Card Plan - 1 Year/s",
];

const emptyForm = {
  promoCode: "",
  promoType: "Single",
  discount: "",
  plan: "",
  validityStart: "",
  expireDate: "",
};

// 2026-10-16 -> 16/10/2026
const fmt = (iso) => {
  if (!iso) return "";
  const [y, m, d] = iso.split("-");
  return `${d}/${m}/${y}`;
};

const todayIso = () => new Date().toISOString().slice(0, 10);

// Sample data: replace with your API response
const initialRows = [
  { id: 1, date: "2026-10-16", promoCode: "shri100", promoType: "Single", discount: 100, plan: "Creatives Plan - 3 Month/s", validityStart: "2026-10-16", expireDate: "2026-10-17", enabled: true, visible: false },
  { id: 2, date: "2026-10-09", promoCode: "100Aish", promoType: "Single", discount: 100, plan: "Download Plan - 1 Month/s", validityStart: "2026-10-09", expireDate: "2026-11-23", enabled: true, visible: false },
  { id: 3, date: "2026-10-09", promoCode: "Aish100", promoType: "Single", discount: 100, plan: "Event + Creatives Plan - 6 Week/s", validityStart: "2026-10-09", expireDate: "2026-11-23", enabled: true, visible: false },
  { id: 4, date: "2026-10-09", promoCode: "invitation", promoType: "Single", discount: 100, plan: "Event + Creatives Plan - 3 Month/s", validityStart: "2026-10-09", expireDate: "2026-10-10", enabled: true, visible: true },
  { id: 5, date: "2026-07-12", promoCode: "EVENT10", promoType: "Multiple", discount: 10, plan: "Event + Certificate / Card Plan - 6 Week/s", validityStart: "2026-07-12", expireDate: "2026-08-12", enabled: false, visible: false },
];

const CPromoCode = () => {
  const [rows, setRows] = useState(initialRows);
  const [formData, setFormData] = useState(emptyForm);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [error, setError] = useState("");
  const dropRef = useRef(null);

  // close the plan list when clicking outside it
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
            onClick={() => toggle(row.original.id, "enabled")}
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
            onClick={() => toggle(row.original.id, "visible")}
            title="Click to show or hide this promo code"
          >
            <i></i>
            {row.original.visible ? "Show" : "Hide"}
          </button>
        ),
        meta: { className: "text-center", width: "160px" },
      },
    ],
    []
  );

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError("");
  };

  const handleSelectPlan = (plan) => {
    setFormData((prev) => ({ ...prev, plan }));
    setIsDropdownOpen(false);
    setError("");
  };

  const handleReset = () => {
    setFormData(emptyForm);
    setIsDropdownOpen(false);
    setError("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.plan) return setError("Please select a plan.");
    if (formData.expireDate < formData.validityStart)
      return setError("Expire date cannot be before the start date.");

    // TODO: call your add-promo-code API here
    setRows((prev) => [
      {
        id: Date.now(),
        date: todayIso(),
        ...formData,
        promoCode: formData.promoCode.trim(),
        discount: Number(formData.discount),
        enabled: true,
        visible: false,
      },
      ...prev,
    ]);
    handleReset();
  };

  const handleExportExcel = () => {
    // TODO: connect your export-to-Excel logic
    console.log("Export promo codes", rows);
  };

  return (
    <div className="promo-page-wrapper">

      {/* ================= FORM ================= */}
      <div className="pc-form-wrap">
        <div className="pc-card">
          <div className="pc-head">
            <h2 className="pc-title">Promo code</h2>
            <div className="pc-underline"></div>
          </div>

          <form onSubmit={handleSubmit} className="pc-form">
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
                required
              />
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
                required
              />
            </div>

            <div className="pc-group" ref={dropRef}>
              <label className="pc-label">
                Select for Event/Certificate <span className="pc-req">*</span>
              </label>
              <div className="pc-drop">
                <button
                  type="button"
                  className="pc-drop-btn"
                  onClick={() => setIsDropdownOpen((o) => !o)}
                  aria-haspopup="listbox"
                  aria-expanded={isDropdownOpen}
                >
                  <span className={formData.plan ? "pc-selected" : "pc-placeholder"}>
                    {formData.plan || "-- Select Plan --"}
                  </span>
                  <ChevronDown size={16} className={`pc-chevron ${isDropdownOpen ? "open" : ""}`} />
                </button>

                {isDropdownOpen && (
                  <div className="pc-drop-menu" role="listbox">
                    {PLANS.map((item) => (
                      <div
                        key={item}
                        role="option"
                        aria-selected={formData.plan === item}
                        className={`pc-drop-item ${formData.plan === item ? "selected" : ""}`}
                        onClick={() => handleSelectPlan(item)}
                      >
                        <span>{item}</span>
                        {formData.plan === item && <Check size={16} />}
                      </div>
                    ))}
                  </div>
                )}
              </div>
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
                  required
                />
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
                  required
                />
              </div>
            </div>

            {error && <p className="pc-error" role="alert">{error}</p>}

            <div className="pc-actions">
              <Button type="button" className="pc-btn-reset" onClick={handleReset}>
                Reset
              </Button>
              <Button type="submit" className="pc-btn-add">
                Add Promo Code
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

        <div className="pc-scroll">
          <DataTable columns={columns} data={rows} onExportExcel={handleExportExcel} />
        </div>
      </div>

    </div>
  );
};

export default CPromoCode;