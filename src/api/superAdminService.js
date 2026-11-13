import api from "./axiosClient"; // keep this import ONLY ONCE at the top

/* ---------- MESSAGE TEMPLATES (api/superadmin/templates) ---------- */

// POST api/superadmin/templates
export const createTemplate = async (values) => {
  const payload = {
    templateType: Number(values.templateType),
    sendType: Number(values.sendType),
    templateName: values.templateName.trim(),
    message: values.message,
    withUserName: !!values.withUserName,
    noOfParameters: Number(values.noOfParameters || 0),
    templateAdminId: Number(values.templateAdminId),
  };

  const { data } = await api.post("/superadmin/templates", payload);
  return data;
};

// GET api/superadmin/templates
export const getTemplates = async () => {
  const { data } = await api.get("/superadmin/templates");
  return Array.isArray(data)
    ? data
    : data?.templates ?? data?.data ?? data?.items ?? [];
};

// PATCH api/superadmin/templates/{id}/status   (change the URL / body key if your API differs)
export const setTemplateStatus = async (id, enabled) => {
  const { data } = await api.patch(`/superadmin/templates/${id}/status`, { isEnabled: enabled });
  return data;
};

/* ---------- PLANS (api/superadmin/templates-admin) ---------- */
export const createPlan = async (values) => {
  const payload = {
    planType: values.planType,
    durationValue: Number(values.durationNum),
    durationUnit: values.durationUnit,
    certificateQuantity: Number(values.certificateQuantity || 0),
    eventQuantity: Number(values.eventQuantity || 0),
    price: Number(values.price || 0),
    title: values.title,
    heading2: values.heading2,
    instructionsPerfectFor: values.instructionsPerfectFor,
    instructionsIncludes: values.instructionsIncludes,
  };

  const { data } = await api.post("/superadmin/templates-admin", payload);
  planCache = { at: 0, map: null }; // a new plan exists: refresh plan names next time
  return data;
};

export const getPlans = async () => {
  const { data } = await api.get("/superadmin/templates-admin");
  return Array.isArray(data) ? data : data?.plans ?? data?.data ?? data?.items ?? [];
};

/* ---------- PROMO CODES (api/superadmin/promocodes) ---------- */
/*
  POST   /superadmin/promocodes              create
  GET    /superadmin/promocodes              list
  GET    /superadmin/promocodes/plans        plans for the promo code dropdown
  GET    /superadmin/promocodes/{id}         one
  PUT    /superadmin/promocodes/{id}         update
  PATCH  /superadmin/promocodes/{id}/status  enable / disable
*/

// Values used by the backend
const VISIBILITY = { PRIVATE: 1, PUBLIC: 2 }; // visibilityType: 1 = private (Hide), 2 = public (Show)
export const DISCOUNT_TYPE = { PERCENTAGE: 1, FIXED: 2 }; // discountType: 1 = percentage, 2 = fixed amount
const visFromVisible = (visible) => (visible ? VISIBILITY.PUBLIC : VISIBILITY.PRIVATE); // never 0

const toDateOnly = (v) => (v ? String(v).slice(0, 10) : ""); // "2026-10-16T00:00:00" -> "2026-10-16"
const startOfDay = (d) => (d ? `${toDateOnly(d)}T00:00:00` : undefined);
const endOfDay = (d) => (d ? `${toDateOnly(d)}T23:59:00` : undefined);

/* ----- browser-saved extras (used only when the API does not return them) -----
   - created date of a promo code
   - plan names chosen in the form
   Both are keyed by promo code (lower case). */
const CREATED_KEY = "promoCreatedDates";
const PLAN_NAMES_KEY = "promoPlanNames";

const codeKey = (code) => String(code ?? "").trim().toLowerCase();

const todayISO = () => {
  const n = new Date();
  const mm = String(n.getMonth() + 1).padStart(2, "0");
  const dd = String(n.getDate()).padStart(2, "0");
  return `${n.getFullYear()}-${mm}-${dd}`;
};

const readStore = (key) => {
  try {
    return JSON.parse(localStorage.getItem(key)) || {};
  } catch {
    return {};
  }
};

const writeStore = (key, code, value) => {
  try {
    const map = readStore(key);
    map[codeKey(code)] = value;
    localStorage.setItem(key, JSON.stringify(map));
  } catch {
    /* storage unavailable: ignore */
  }
};

/* ----- plans for the "Select for Event/Certificate" dropdown -----
   GET /superadmin/promocodes/plans */

// GET api/superadmin/promocodes/plans
export const getPromoPlans = async () => {
  const { data } = await api.get("/superadmin/promocodes/plans");
  return Array.isArray(data) ? data : data?.plans ?? data?.data ?? data?.items ?? data?.result ?? [];
};

// One plan from the API -> { id, label }
// Handles: "Plan name" (string), { id, name }, { planId, planName }, { value, label },
// { id, title, durationValue, durationUnit }
const toPlanOption = (p) => {
  if (typeof p === "string" || typeof p === "number") return { id: p, label: String(p) };

  const id = p.id ?? p.planId ?? p.planID ?? p.templateAdminId ?? p.value;

  // a ready-made name wins
  const direct = p.label ?? p.planName ?? p.name ?? p.displayName ?? p.text ?? p.planTitle;
  if (direct) return { id, label: String(direct) };

  // otherwise build it: "<title> - <duration value> <unit>"
  const duration = [p.durationValue ?? p.durationNum, p.durationUnit].filter(Boolean).join(" ");
  const base = p.title ?? p.planType ?? "";
  const label = [base, duration].filter(Boolean).join(" - ");
  return { id, label: label || `Plan ${id}` };
};

export const getPlanOptions = async () => {
  const list = await getPromoPlans();
  return list.map(toPlanOption).filter((p) => p.id !== undefined && p.id !== null);
};

// { "<planId>": "<label>" }, cached for 60 seconds so list reloads do not refetch the plans every time
let planCache = { at: 0, map: null };

const loadPlanMap = async () => {
  if (planCache.map && Date.now() - planCache.at < 60000) return planCache.map;
  try {
    const options = await getPlanOptions();
    const map = options.reduce((acc, o) => {
      acc[String(o.id)] = o.label;
      return acc;
    }, {});
    planCache = { at: Date.now(), map };
    return map;
  } catch {
    return planCache.map || {}; // plan names are optional; the table still loads
  }
};

/* ----- create / update body -----
   { promoCode, promoName, visibilityType, discountType, discountValue, startDate, expiryDate,
     maximumUsage, isActive, planIds } */
const toPlanId = (x) => (Number.isNaN(Number(x)) ? x : Number(x)); // numeric ids -> number, others unchanged

const toPromoPayload = (v) => {
  const code = String(v.promoCode ?? "").trim();
  const single = v.promoType !== "Multiple"; // Single = used once, Multiple = used up to maximumUsage times

  return {
    promoCode: code,
    promoName: code,
    visibilityType: visFromVisible(v.visible === true), // form has no visible value -> 1 (private)
    discountType: Number(v.discountType) === DISCOUNT_TYPE.FIXED ? DISCOUNT_TYPE.FIXED : DISCOUNT_TYPE.PERCENTAGE,
    discountValue: Number(v.discount),
    startDate: startOfDay(v.validityStart),
    expiryDate: endOfDay(v.expireDate),
    maximumUsage: single ? 1 : Number(v.maximumUsage) || null,
    isActive: v.enabled ?? true,
    planIds: Array.isArray(v.planIds) ? v.planIds.map(toPlanId) : [], // [] = all plans
  };
};

// backend item -> table row
// If an API sends no enabled / visibility fields at all, the row counts as Enabled + Show.
const has = (p, keys) => keys.some((k) => p[k] !== undefined && p[k] !== null);

export const normalizePromo = (p, planMap = {}, createdMap = {}, savedPlans = {}) => {
  const vis = Number(p.visibilityType);
  const hasEnabled = has(p, ["isActive", "isEnabled", "enabled"]);
  const hasVisible = has(p, ["visibilityType", "isVisible"]);
  const maximumUsage = p.maximumUsage ?? null;
  const code = p.promoCode ?? p.promoName ?? p.code ?? "";
  const planIds = Array.isArray(p.planIds) ? p.planIds : [];
  const saved = Array.isArray(savedPlans[codeKey(code)]) ? savedPlans[codeKey(code)] : [];

  // Plan Type column, in this order:
  //  1. names the server sends
  //  2. planIds matched to the plan list (saved name used if a plan is missing from the list)
  //  3. plan names saved in this browser when the code was created
  //  4. a plain text plan field, else "All Plans"
  let planNames = [];
  if (Array.isArray(p.plans) && p.plans.length) {
    planNames = p.plans.map((x) => toPlanOption(x).label);
  } else if (Array.isArray(p.planNames) && p.planNames.length) {
    planNames = p.planNames;
  } else if (planIds.length) {
    planNames = planIds.map((id, i) => {
      const fromList = planMap[String(id)];
      if (fromList) return fromList;
      if (saved.length === planIds.length && saved[i]) return saved[i];
      return `Plan #${id}`;
    });
  } else if (saved.length) {
    planNames = saved;
  } else {
    const text = String(p.planType ?? p.plan ?? p.planName ?? "").trim();
    planNames = [text || "All Plans"];
  }

  const serverCreated = toDateOnly(
    p.createdAt ?? p.createdDate ?? p.createdOn ?? p.createdDateTime ?? p.creationDate ?? p.dateCreated ?? p.addedOn
  );

  return {
    id: p.promoCodeId ?? p.id ?? p.promoId,
    date:
      serverCreated ||
      createdMap[codeKey(code)] ||
      toDateOnly(p.startDate ?? p.validityStart ?? p.validFrom),
    promoCode: code,
    discountType: Number(p.discountType) === DISCOUNT_TYPE.FIXED ? DISCOUNT_TYPE.FIXED : DISCOUNT_TYPE.PERCENTAGE,
    discount: Number(p.discountValue ?? p.discount ?? 0),
    maximumUsage,
    promoType: maximumUsage === 1 ? "Single" : "Multiple", // Assign Type
    planIds,
    planNames, // array of plan names (table shows one per line)
    plan: planNames.join(", "), // joined text (sorting / search / export)
    validityStart: toDateOnly(p.startDate ?? p.validityStart ?? p.validFrom),
    expireDate: toDateOnly(p.expiryDate ?? p.expireDate ?? p.validTo ?? p.endDate),
    enabled: hasEnabled ? !!(p.isActive ?? p.isEnabled ?? p.enabled) : true, // Status: Enabled / Disabled
    visible: hasVisible ? vis === VISIBILITY.PUBLIC || p.isVisible === true : true, // Show (2) / Hide (1)
  };
};

// POST api/superadmin/promocodes
// values.planLabels (optional): plan names shown in the form, saved so the table can show them.
export const createPromoCode = async (values) => {
  const payload = toPromoPayload(values);
  const { data } = await api.post("/superadmin/promocodes", payload);
  writeStore(CREATED_KEY, payload.promoCode, todayISO());
  const labels = Array.isArray(values.planLabels) && values.planLabels.length ? values.planLabels : ["All Plans"];
  writeStore(PLAN_NAMES_KEY, payload.promoCode, labels);
  return data;
};

// GET api/superadmin/promocodes
export const getPromoCodes = async () => {
  const [{ data }, planMap] = await Promise.all([api.get("/superadmin/promocodes"), loadPlanMap()]);
  const list = Array.isArray(data) ? data : data?.promoCodes ?? data?.data ?? data?.items ?? [];
  const createdMap = readStore(CREATED_KEY);
  const savedPlans = readStore(PLAN_NAMES_KEY);
  return list.map((p) => normalizePromo(p, planMap, createdMap, savedPlans));
};

// GET api/superadmin/promocodes/{id}
export const getPromoCodeById = async (id) => {
  const [{ data }, planMap] = await Promise.all([api.get(`/superadmin/promocodes/${id}`), loadPlanMap()]);
  return normalizePromo(data?.data ?? data, planMap, readStore(CREATED_KEY), readStore(PLAN_NAMES_KEY));
};

// PUT api/superadmin/promocodes/{id}
// values.planLabels (optional): plan names, saved the same way as on create.
export const updatePromoCode = async (id, values) => {
  const payload = toPromoPayload(values);
  const { data } = await api.put(`/superadmin/promocodes/${id}`, payload);
  if (Array.isArray(values.planLabels) && values.planLabels.length) {
    writeStore(PLAN_NAMES_KEY, payload.promoCode, values.planLabels);
  }
  return data;
};

// Show / Hide: GET /{id} -> change only visibilityType -> PUT /{id}
// The PUT body is the record exactly as the server returned it, so no other field can be lost or renamed.
export const setPromoVisibility = async (id, visible) => {
  const { data: res } = await api.get(`/superadmin/promocodes/${id}`);
  const current = res?.data ?? res;
  const body = { ...current, visibilityType: visFromVisible(visible) }; // Show = 2, Hide = 1
  const { data } = await api.put(`/superadmin/promocodes/${id}`, body);
  return data;
};

// PATCH api/superadmin/promocodes/{id}/status
// enabled = Enabled/Disabled. visible = the row's current Show/Hide, sent along so visibilityType is never 0.
export const setPromoCodeStatus = async (id, enabled, visible = false) => {
  const body = {
    isActive: !!enabled,
    isEnabled: !!enabled,
    visibilityType: visFromVisible(visible),
  };
  const { data } = await api.patch(`/superadmin/promocodes/${id}/status`, body);
  return data;
};

// readable message from an axios error (also lists validation errors)
export const apiErrorMessage = (err, fallback = "Something went wrong. Please try again.") => {
  const d = err?.response?.data;
  if (d?.errors && typeof d.errors === "object") {
    const msgs = Object.values(d.errors).flat();
    if (msgs.length) return msgs.join(" ");
  }
  return d?.message ?? d?.title ?? (typeof d === "string" ? d : null) ?? err?.message ?? fallback;
};

/* ---------- CONTACT MESSAGES (api/superadmin/contacts) ---------- */
/*
  GET    /superadmin/contacts                          all
  GET    /superadmin/contacts?page=1&pageSize=10       paginated
  GET    /superadmin/contacts?isRead=false|true        unread / read
  GET    /superadmin/contacts/{id}                     details
  PATCH  /superadmin/contacts/{id}/read                mark as read
*/

// backend item -> table row
export const normalizeContact = (c = {}) => ({
  id: c.contactId ?? c.id,
  date: toDateOnly(c.createdAt ?? c.createdDate ?? c.submittedAt ?? c.createdOn ?? c.date),
  name: c.fullName ?? c.name ?? "",
  email: c.email ?? "",
  mobile: c.phoneNumber ?? c.phone ?? c.mobile ?? "",
  subject: c.subject ?? "",
  message: c.message ?? "",
  isRead: !!(c.isRead ?? c.read),
});

// GET api/superadmin/contacts  -> { items, totalCount, page, pageSize }
// All options are optional: { page, pageSize, isRead: true | false | undefined }
export const getContacts = async ({ page, pageSize, isRead } = {}) => {
  const params = {};
  if (page != null) params.page = page;
  if (pageSize != null) params.pageSize = pageSize;
  if (isRead === true || isRead === false) params.isRead = isRead;

  const { data } = await api.get("/superadmin/contacts", { params });
  const root = data?.data ?? data;
  const list = Array.isArray(root)
    ? root
    : root?.items ?? root?.contacts ?? root?.results ?? root?.data ?? [];
  const items = list.map(normalizeContact);

  return {
    items,
    totalCount: Number(root?.totalCount ?? root?.total ?? root?.totalRecords ?? data?.totalCount ?? items.length),
    page: Number(root?.page ?? root?.pageNumber ?? page ?? 1),
    pageSize: Number(root?.pageSize ?? pageSize ?? items.length),
  };
};

// Every contact (walks the pages), optionally filtered by read status
export const getAllContacts = async ({ isRead } = {}) => {
  const pageSize = 100;
  const all = [];
  for (let page = 1; page <= 50; page += 1) {
    const res = await getContacts({ page, pageSize, isRead });
    all.push(...res.items);
    if (!res.items.length || all.length >= res.totalCount) break;
  }
  return all;
};

// GET api/superadmin/contacts/{id}
export const getContactById = async (id) => {
  const { data } = await api.get(`/superadmin/contacts/${id}`);
  return normalizeContact(data?.data ?? data);
};

// PATCH api/superadmin/contacts/{id}/read
export const markContactRead = async (id) => {
  const { data } = await api.patch(`/superadmin/contacts/${id}/read`);
  return data;
};

