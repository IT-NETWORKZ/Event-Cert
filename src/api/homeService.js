import api, { IMAGE_BASE_URL } from "../api/axiosClient"; // same import as adminService.js

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

/* ---------- CERTIFICATE / CARD IMAGES (live folder /home/rimg) ---------- */

// Public URL of one image in the live folder: https://eventcert.com/rimg/{id}.png  (ids 1 - 18)
export const getCertificateImageUrl = (id) => `${IMAGE_BASE_URL}/${id}.png`;

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

// Maps one API row to { planId, planName, price, heading1, content1, heading2, content2, category, isActive }
// category: 'event' | 'creative' | 'combo' | 'download'
export const toPlan = (raw, index) => {
  const get = makeGetter(raw);

  const cat = String(get("plancategory", "categoryid", "category", "plantype")).toLowerCase();
  let category = "event";
  if (cat === "2" || cat.includes("creative")) category = "creative";
  else if (cat === "3" || cat.includes("combo") || cat.includes("+")) category = "combo";
  else if (cat === "4" || cat.includes("download")) category = "download";

  const activeRaw = get("isactive", "active", "isenabled");
  const isActive =
    activeRaw === ""
      ? true
      : typeof activeRaw === "string"
      ? /^(true|active|enabled|1)$/i.test(activeRaw)
      : Boolean(activeRaw);

  return {
    planId: get("planid", "id") || index,
    planName: String(get("planname", "name", "title")),
    price: Number(get("price", "amount", "planprice")) || 0,
    heading1: String(get("heading1")),
    content1: String(get("content1")),
    heading2: String(get("heading2")),
    content2: String(get("content2")),
    category,
    isActive,
  };
};

// Subscription page: fetch + normalise active plans, grouped by tab
// Returns { event: [], creative: [], combo: [], download: [] }
export const getHomeSubscriptionPlans = async () => {
  const list = await getHomePlans();
  const plans = list.map(toPlan).filter((p) => p.isActive);

  return {
    event: plans.filter((p) => p.category === "event"),
    creative: plans.filter((p) => p.category === "creative"),
    combo: plans.filter((p) => p.category === "combo"),
    download: plans.filter((p) => p.category === "download"),
  };
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

/* ---------- CONTACT ---------- */

// POST api/home/contact – submit Contact Us form
export const createContact = async (values) => {
  const payload = {
    fullName: (values.name || "").trim(),
    email: (values.email || "").trim(),
    phoneNumber: (values.phone || "").trim(),
    subject: (values.subject || "").trim(),
    message: (values.message || "").trim(),
  };

  const { data } = await api.post("/home/contact", payload);
  return data;
};