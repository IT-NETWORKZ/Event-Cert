import React, { useCallback, useEffect, useMemo, useState } from "react";
import { getHomePromoCodes } from "../../../api/homeService";
import { getAdminPromoCodes } from "../../../api/adminService";
import { getPromoCodes, DISCOUNT_TYPE } from "../../../api/superAdminService";
import "./PromoCode.css";

/* ---------- small teal icons ---------- */
const IconTicket = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M3 9a2 2 0 0 0 0 6v3a1 1 0 0 0 1 1h16a1 1 0 0 0 1-1v-3a2 2 0 0 1 0-6V6a1 1 0 0 0-1-1H4a1 1 0 0 0-1 1z" />
    <path d="M13 5v2M13 11v2M13 17v2" />
  </svg>
);
const IconCopy = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect x="9" y="9" width="11" height="11" rx="2" />
    <path d="M5 15V6a2 2 0 0 1 2-2h9" />
  </svg>
);
const IconCheck = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M5 12l5 5 9-10" />
  </svg>
);
const IconClock = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <circle cx="12" cy="12" r="9" />
    <path d="M12 7v5l3 2" />
  </svg>
);
const IconGift = () => (
  <svg width="38" height="38" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect x="3" y="8" width="18" height="4" rx="1" />
    <path d="M12 8v13M5 12v7a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-7" />
    <path d="M12 8c-2.5 0-4-1-4-2.5S9.5 3 11 4c.8.6 1 4 1 4zM12 8c2.5 0 4-1 4-2.5S14.5 3 13 4c-.8.6-1 4-1 4z" />
  </svg>
);

// today as "YYYY-MM-DD" in the user's local time
const todayIso = () => {
  const d = new Date();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${d.getFullYear()}-${m}-${day}`;
};

// 2026-12-31 -> 31 Dec 2026
const fmtLong = (iso) => {
  if (!iso) return "";
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, m - 1, d).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

// Active = Enabled + today is inside the validity period (Show / Hide is ignored)
const isActiveNow = (p, today) =>
  p.enabled &&
  (!p.validityStart || p.validityStart <= today) &&
  (!p.expireDate || p.expireDate >= today);

// Status badge (superadmin list). active: true = works, false = inactive
const statusOf = (p, today) => {
  if (!p.enabled) return { key: "disabled", text: "Disabled", active: false };
  if (p.expireDate && p.expireDate < today) return { key: "expired", text: "Expired", active: false };
  if (p.validityStart && p.validityStart > today) return { key: "upcoming", text: "Upcoming", active: false };
  if (!p.visible) return { key: "hidden", text: "Hidden", active: false };
  return { key: "active", text: "Active", active: true };
};

// API row -> card used by the UI below
const toCard = (p, status) => ({
  id: p.id,
  code: p.promoCode,
  isFixed: p.discountType === DISCOUNT_TYPE.FIXED,
  amount: Number(p.discount),
  plans: p.planNames?.length ? p.planNames : p.plan ? [p.plan] : [],
  description: "",
  validTill: fmtLong(p.expireDate),
  status,
});

// admin: every active code, newest first
const toActiveCards = (list) => {
  const today = todayIso();
  return [...list]
    .filter((p) => isActiveNow(p, today))
    .sort((a, b) => (b.date || "").localeCompare(a.date || "") || b.id - a.id)
    .map((p) => toCard(p));
};

// superadmin: every promo code that was created, newest first, with a status badge
const toAllCards = (list) => {
  const today = todayIso();
  return [...list]
    .sort((a, b) => (b.date || "").localeCompare(a.date || "") || b.id - a.id)
    .map((p) => toCard(p, statusOf(p, today)));
};

// Where each role gets its offers from
const SOURCES = {
  home: { load: getHomePromoCodes }, // returns cards (discountText / plan)
  admin: { load: async () => toActiveCards(await getAdminPromoCodes()) },
  superadmin: { load: async () => toAllCards(await getPromoCodes()) }, // GET /superadmin/promocodes -> all
};

// works for cards from this file and for the ready-made cards of the home API
const discountParts = (promo) => {
  if (promo.discountText !== undefined && promo.amount === undefined) {
    const t = String(promo.discountText);
    return { value: t.replace(/[%₹]/g, ""), unit: t.includes("₹") ? "₹" : "%" };
  }
  return promo.isFixed ? { value: promo.amount, unit: "₹" } : { value: promo.amount, unit: "%" };
};

const FILTERS = [
  { id: "all", label: "All" },
  { id: "active", label: "Active" },
  { id: "inactive", label: "Inactive" },
];

/**
 * Props
 *  - role : "home" (default) | "admin" | "superadmin"  -> picks the API used
 *           (the All / Active / Inactive tabs and status badges exist only for "superadmin")
 */
const PromoCode = ({ role = "home" }) => {
  const source = SOURCES[role] ?? SOURCES.home;
  const isSuper = role === "superadmin";

  const [promos, setPromos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [copiedCode, setCopiedCode] = useState("");
  const [filter, setFilter] = useState("all");

  const loadPromos = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      setPromos(await source.load());
    } catch (err) {
      console.error("LOAD PROMO ERROR:", role, err?.response?.status, err?.response?.data);
      setError("Could not load offers. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [source, role]);

  useEffect(() => {
    loadPromos();

    // reload every time the Available Offers modal is opened, so newly created codes show up
    const modalEl = document.getElementById("promoModal");
    modalEl?.addEventListener("show.bs.modal", loadPromos);
    return () => modalEl?.removeEventListener("show.bs.modal", loadPromos);
  }, [loadPromos]);

  const counts = useMemo(() => {
    const active = promos.filter((p) => p.status?.active).length;
    return { all: promos.length, active, inactive: promos.length - active };
  }, [promos]);

  const visiblePromos = useMemo(() => {
    if (!isSuper || filter === "all") return promos;
    return promos.filter((p) => (filter === "active") === !!p.status?.active);
  }, [promos, isSuper, filter]);

  const copyPromo = async (code) => {
    try {
      await navigator.clipboard.writeText(code);
    } catch {
      // fallback for non-secure contexts
      const el = document.createElement("textarea");
      el.value = code;
      document.body.appendChild(el);
      el.select();
      document.execCommand("copy");
      document.body.removeChild(el);
    }
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(""), 1800);
  };

  return (
    <>
      {/* Floating side button */}
      <div className="promo-fab">
        <button
          type="button"
          className="vertical-btn"
          data-bs-toggle="modal"
          data-bs-target="#promoModal"
        >
          <span className="vb-icon">
            <IconTicket />
          </span>
          Promo Code
        </button>
      </div>

      {/* Promo modal */}
      <div className="modal fade" id="promoModal" tabIndex="-1" aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered promo-dialog">
          <div className="modal-content promo-toggle-container">
            {/* Header */}
            <div className="modal-header promo-header">
              <div className="promo-header-main">
                <span className="promo-header-badge">
                  <IconTicket />
                </span>
                <div>
                  <h5 className="modal-title">Available Offers</h5>
                  <p className="promo-subtitle">
                    {loading
                      ? "Fetching the latest codes…"
                      : isSuper
                      ? `${counts.all} total · ${counts.active} active · ${counts.inactive} inactive`
                      : `${counts.all} promo code${counts.all === 1 ? "" : "s"} available`}
                  </p>
                </div>
              </div>
              <button
                type="button"
                className="btn-close btn-close-white"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>

            {/* Filter tabs: superadmin only */}
            {isSuper && !loading && !error && (
              <div className="promo-tabs" role="tablist">
                {FILTERS.map((f) => (
                  <button
                    key={f.id}
                    type="button"
                    role="tab"
                    aria-selected={filter === f.id}
                    className={`promo-tab ${filter === f.id ? "active" : ""}`}
                    onClick={() => setFilter(f.id)}
                  >
                    {f.label} <b>{counts[f.id]}</b>
                  </button>
                ))}
              </div>
            )}

            {/* Scrollable card list */}
            <div className="promo-list">
              {loading && (
                <>
                  <div className="promo-skeleton" />
                  <div className="promo-skeleton" />
                  <div className="promo-skeleton" />
                </>
              )}

              {!loading && error && (
                <div className="promo-state">
                  <span className="promo-state-icon">
                    <IconGift />
                  </span>
                  <span>{error}</span>
                  <button type="button" className="promo-retry" onClick={loadPromos}>
                    Retry
                  </button>
                </div>
              )}

              {!loading && !error && visiblePromos.length === 0 && (
                <div className="promo-state">
                  <span className="promo-state-icon">
                    <IconGift />
                  </span>
                  <span>No offers available right now. Check back soon.</span>
                </div>
              )}

              {!loading &&
                !error &&
                visiblePromos.map((promo) => {
                  const { value, unit } = discountParts(promo);
                  const dim = isSuper && promo.status && !promo.status.active;
                  const copied = copiedCode === promo.code;
                  const plans = promo.plans?.length ? promo.plans : promo.plan ? [promo.plan] : [];

                  return (
                    <div className={`coupon-cardd ${dim ? "is-dim" : ""}`} key={promo.id}>
                      {/* discount stub */}
                      <div className="coupon-left">
                        <span className="coupon-kicker">Save</span>
                        <span className="coupon-off">
                          {unit === "₹" && <small>₹</small>}
                          {value}
                          {unit === "%" && <small>%</small>}
                        </span>
                        <span className="coupon-off-label">OFF</span>
                      </div>

                      {/* details */}
                      <div className="coupon-right">
                        <div className="coupon-top">
                          {isSuper && promo.status ? (
                            <span className={`coupon-status ${promo.status.active ? "is-active" : "is-inactive"}`}>
                              <i></i>
                              {promo.status.text}
                            </span>
                          ) : (
                            <span className="coupon-status is-active">
                              <i></i>
                              Active
                            </span>
                          )}

                          {promo.validTill && (
                            <span className="valid-until">
                              <IconClock />
                              Valid till {promo.validTill}
                            </span>
                          )}
                        </div>

                        {plans.length > 0 && (
                          <div className="coupon-plans">
                            {plans.map((pl, i) => (
                              <span className="coupon-plan" key={`${pl}-${i}`} title={pl}>
                                {pl}
                              </span>
                            ))}
                          </div>
                        )}

                        {promo.description && <span className="coupon-desc">{promo.description}</span>}

                        <div className="code-display">
                          <span className="promo-text">{promo.code}</span>
                          <button
                            type="button"
                            className={`copy-link ${copied ? "copied" : ""}`}
                            onClick={() => copyPromo(promo.code)}
                            aria-live="polite"
                          >
                            {copied ? <IconCheck /> : <IconCopy />}
                            <span>{copied ? "Copied" : "Copy"}</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PromoCode;