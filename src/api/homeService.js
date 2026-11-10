import api from "../api/axiosClient"; // same import as adminService.js

/* ---------- helpers ---------- */

// Readable message from an axios error (backend sends plain text, a JSON string, or { message / title })
export const getApiError = (err, fallback = "Something went wrong.") => {
  const d = err?.response?.data;
  if (typeof d === "string" && d.trim()) return d;
  return d?.message || d?.title || (err?.response ? fallback : "Could not reach the server. Try again.");
};

// lower-cases keys so camelCase and PascalCase responses both work
const makeGetter = (raw) => {
  const lower = {};
  Object.keys(raw || {}).forEach((k) => (lower[k.toLowerCase()] = raw[k]));
  return (...names) => {
    for (const n of names) if (lower[n] != null && lower[n] !== "") return lower[n];
    return "";
  };
};

const pickList = (data, keys) => {
  if (Array.isArray(data)) return data;
  for (const k of keys) if (Array.isArray(data?.[k])) return data[k];
  return [];
};

const formatDate = (value) => {
  if (!value) return "";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return String(value);
  return d.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
};

/* ---------- PLANS ---------- */

// GET api/home/plans – active plans
export const getHomePlans = async () => {
  const { data } = await api.get("/home/plans");
  return pickList(data, ["plans", "items", "data", "rows"]);
};

// GET api/home/plans/{id} – plan details
export const getHomePlanById = async (id) => {
  const { data } = await api.get(`/home/plans/${id}`);
  return data;
};

/* ---------- PROMO CODES ---------- */

// Maps one API row to { id, code, discountText, plan, description, validTill, isActive, expired }
export const toPromoCode = (raw, index) => {
  const get = makeGetter(raw);

  const code = String(get("promocode", "code", "couponcode", "coupon", "name"));
  const rawDiscount = get(
    "discountpercentage", "discountpercent", "discountvalue", "discount", "percentage", "percent", "amount"
  );
  const type = String(get("discounttype", "type")).toLowerCase();

  let discountText = "";
  if (rawDiscount !== "") {
    const s = String(rawDiscount);
    if (/[%₹]/.test(s)) discountText = s;
    else if (/flat|fixed|amount|rupee|inr/.test(type)) discountText = `₹${s}`;
    else discountText = `${s}%`;
  }

  const expiryRaw = get("validtill", "validuntil", "validto", "expirydate", "expiry", "enddate", "expiresat");
  const expired = expiryRaw ? new Date(expiryRaw).getTime() < Date.now() : false;

  const statusRaw = get("isactive", "active", "isenabled", "status");
  const isActive =
    statusRaw === ""
      ? true
      : typeof statusRaw === "string"
      ? /^(true|active|enabled|1)$/i.test(statusRaw)
      : Boolean(statusRaw);

  return {
    id: get("promocodeid", "promoid", "id") || `${code}-${index}`,
    code,
    discountText,
    plan: String(get("planname", "plan", "applicableplan", "validfor")),
    description: String(get("description", "title", "details")),
    validTill: formatDate(expiryRaw),
    isActive,
    expired,
  };
};

// GET api/home/promocodes – public promo offers
export const getHomePromoCodes = async () => {
  const { data } = await api.get("/home/promocodes");
  const list = pickList(data, ["promoCodes", "promocodes", "items", "data", "coupons"]);
  return list.map(toPromoCode).filter((p) => p.code && p.isActive && !p.expired);
};

// Maps a validate response to { isValid, message, discountAmount, finalAmount, raw }
export const toPromoValidation = (data) => {
  const get = makeGetter(data);
  const valid = get("isvalid", "valid", "success");
  return {
    isValid: valid === "" ? true : Boolean(valid),
    message: String(get("message", "title")),
    discountAmount: Number(get("discountamount", "discount", "discountvalue")) || 0,
    finalAmount: get("finalamount", "payableamount", "totalamount", "amountafterdiscount") === ""
      ? null
      : Number(get("finalamount", "payableamount", "totalamount", "amountafterdiscount")),
    raw: data,
  };
};

// POST api/home/promocodes/validate
// The body field names (promoCode, planId) are assumed – match them to your validate DTO.
// An invalid code usually comes back as HTTP 400, so it is returned as { isValid: false, message }, not thrown.
export const validateHomePromoCode = async ({ code, planId, amount } = {}) => {
  const payload = { promoCode: String(code || "").trim() };
  if (planId != null) payload.planId = planId;
  if (amount != null) payload.amount = amount;

  try {
    const { data } = await api.post("/home/promocodes/validate", payload);
    return toPromoValidation(data);
  } catch (err) {
    if (err?.response && err.response.status < 500) {
      return { isValid: false, message: getApiError(err, "Invalid promo code."), discountAmount: 0, finalAmount: null, raw: null };
    }
    throw err; // network / server errors are handled by the caller
  }
};