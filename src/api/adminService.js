import api from "../api/axiosClient";
import { normalizePromo } from "./superAdminService";
import { toPromoValidation } from "./homeService";

/* ---------- PROFILE ---------- */
// GET api/admin/profile
export const getAdminProfile = async () => {
  const { data } = await api.get("/admin/profile");
  return data; // { isProfileCreated, message, profile }
};

// POST api/admin/profile (multipart/form-data)
export const AdminProfile = async ({ values, imageFile }) => {
  const form = new FormData();
  form.append("PhoneNumber", values.phoneNumber);
  form.append("OrganizationName", values.organizationName);
  form.append("Designation", values.designation);
  form.append("Department", values.department);
  form.append("City", values.city);
  if (imageFile) form.append("ProfileImage", imageFile);

  const { data } = await api.post("/admin/profile", form, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data; // { message, isProfileCreated, profile }
};

// Backend returns relative paths like /uploads/admins/xxx.jpg
export const toImageUrl = (path) => {
  if (!path) return null;
  if (/^https?:\/\//i.test(path)) return path;
  const origin = (api.defaults.baseURL || "").replace(/\/api\/?$/i, "");
  return `${origin}${path}`;
};

/* ---------- EVENTS ---------- */

// "14:30" -> "02:30 PM" (leaves values that already contain AM/PM untouched)
const toEventTime = (value) => {
  if (!value) return "";
  if (/am|pm/i.test(value)) return value;
  const [h, m] = value.split(":").map(Number);
  const hr = h % 12 === 0 ? 12 : h % 12;
  return `${String(hr).padStart(2, "0")}:${String(m).padStart(2, "0")} ${h >= 12 ? "PM" : "AM"}`;
};

const buildEventForm = (values) => {
  const form = new FormData();

  const fields = {
    Duration: values.duration,
    Mode: values.mode,
    OrganizationName: values.organizationName,
    EventTitle: values.eventTitle,
    AdvStartDate: values.advStartDate,
    AdvCompletionDate: values.advCompletionDate,
    EventStartDate: values.eventStartDate,
    EventCompletionDate: values.eventCompletionDate,
    EventTime: toEventTime(values.EventTime),
    Venue: values.venue,
    City: values.city,
    State: values.state,
    Country: values.country,
    AboutEvent: values.aboutEvent,
    Instructions: values.instructions,
    EntryFee: values.entryFee,
    PaymentMode: values.paymentMode,
    GPay: values.showPaymentDetails && values.paymentMethod === "GPay",
    PhonePe: values.showPaymentDetails && values.paymentMethod === "PhonePe",
    Paytm: values.showPaymentDetails && values.paymentMethod === "Paytm",
    Upiid: values.upiId,
    PaymentMobileNo: values.mobileNo,
    AccountHolderName: values.bankHolderName,
    BankName: values.bankName,
    AccountNumber: values.accountNo,
    IfscCode: values.ifscCode,
  };

  Object.entries(fields).forEach(([key, val]) => {
    if (val !== undefined && val !== null && val !== "") form.append(key, val);
  });

  if (values.bannerImage) form.append("Image1", values.bannerImage);
  if (values.bannerImage2) form.append("Image2", values.bannerImage2);
  if (values.qrCode) form.append("QrCode", values.qrCode);

  return form;
};

// GET api/admin/events
export const getEvents = async () => {
  const { data } = await api.get("/admin/events");
  const list = Array.isArray(data)
    ? data
    : data?.events ?? data?.data ?? data?.items ?? [];
  return {
    list,
    remainingEvents: data?.remainingEvents ?? null,
    planExpiryDate: data?.planExpiryDate ?? null,
  };
};

export const getSubscriptionPlans = async () => {
  const { data } = await api.get("/home/plans");
  // Returns the full response object: { success, message, data }
  return data;
};

// get all Admin - Home events for the event info section Fetch all events for the event info section
export const getHomeEvents = async () => {
  const { data } = await api.get("/home/events");
  
  return data;
};

// POST api/admin/events (multipart/form-data)
export const createEvent = async (values) => {
  const { data } = await api.post("/admin/events", buildEventForm(values), {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data;
};

// PUT api/admin/events/{id} (multipart/form-data)
export const updateEvent = async (id, values) => {
  const { data } = await api.put(`/admin/events/${id}`, buildEventForm(values), {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data;
};

// PATCH api/admin/events/{id}/status
export const setEventStatus = async (id, enabled) => {
  const { data } = await api.patch(`/admin/events/${id}/status`, { isEnabled: enabled });
  return data;
};


/* ---------- RECIPIENTS (Custom+) ---------- */

// Readable message from an axios error (backend sends plain text, a JSON string, or { message / title })
export const getApiError = (err, fallback = "Something went wrong.") => {
  const d = err?.response?.data;
  if (typeof d === "string" && d.trim()) return d;
  return d?.message || d?.title || (err?.response ? fallback : "Could not reach the server. Try again.");
};

// Maps one API row to the table row (camelCase or PascalCase keys both work)
const toRecipientRow = (raw) => {
  const lower = {};
  Object.keys(raw).forEach((k) => (lower[k.toLowerCase()] = raw[k]));
  const get = (...names) => {
    for (const n of names) if (lower[n] != null) return lower[n];
    return "";
  };
  const active = get("isactive", "active");
  return {
    id: get("recipientid", "id"),
    name: String(get("fullname", "name")),
    email: String(get("email")),
    mobile: String(get("mobile")),
    groupName: String(get("groupname", "group")),
    text1: String(get("text1")),
    text2: String(get("text2")),
    text3: String(get("text3")),
    text4: String(get("text4")),
    isActive: active === "" ? true : Boolean(active),
  };
};

// POST api/admin/recipients/import (multipart/form-data, .xlsx only)
export const importRecipients = async (file) => {
  const form = new FormData();
  form.append("file", file);
  const { data } = await api.post("/admin/recipients/import", form, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return {
    inserted: data?.inserted ?? data?.Inserted ?? 0,
    duplicates: data?.duplicates ?? data?.Duplicates ?? 0,
    invalid: data?.invalid ?? data?.Invalid ?? 0,
    errors: data?.errors ?? data?.Errors ?? [],
  };
};

// GET api/admin/recipients?search=&page=&pageSize=
export const getRecipients = async ({ search = "", page = 1, pageSize = 500 } = {}) => {
  const { data } = await api.get("/admin/recipients", { params: { search, page, pageSize } });
  const list = Array.isArray(data)
    ? data
    : data?.rows ?? data?.items ?? data?.data ?? data?.recipients ?? [];
  return list.map(toRecipientRow);
};

// PATCH api/admin/recipients/{id}/status
export const setRecipientStatus = async (id, isActive) => {
  const { data } = await api.patch(`/admin/recipients/${id}/status`, { isActive });
  return data;
};

// The API returns max 200 rows per page, so these helpers read every page.
const fetchAllRecipients = async (path, search = "") => {
  const pageSize = 200;
  const all = [];
  for (let page = 1; page <= 100; page++) {
    const { data } = await api.get(path, { params: { search, page, pageSize } });
    const list = Array.isArray(data) ? data : data?.data ?? data?.recipients ?? data?.rows ?? data?.items ?? [];
    if (page === 1 && list[0] && import.meta.env?.DEV) console.debug(`[${path}] first raw row:`, list[0]);
    all.push(...list);
    const totalPages = Array.isArray(data) ? 1 : data?.totalPages ?? 1;
    if (page >= totalPages || list.length === 0) break;
  }
  return all.map(toRecipientRow);
};

// GET api/admin/recipients/active  -> users shown in Custom+
export const getActiveRecipients = ({ search = "" } = {}) =>
  fetchAllRecipients("/admin/recipients/active", search);

// GET api/admin/recipients/inactive  -> users shown in Retrieve Records
export const getInactiveRecipients = ({ search = "" } = {}) =>
  fetchAllRecipients("/admin/recipients/inactive", search);

// the bulk endpoints accept 1..500 ids per call, so bigger selections are sent in parts
const idParts = (ids, size = 500) => {
  const unique = [...new Set((ids || []).map(Number))].filter((n) => n > 0);
  const parts = [];
  for (let i = 0; i < unique.length; i += size) parts.push(unique.slice(i, i + size));
  return parts;
};

// PATCH api/admin/recipients/bulk/enable  { recipientIds: [..] }  -> { enabled }
export const enableRecipients = async (ids) => {
  let enabled = 0;
  for (const part of idParts(ids)) {
    const { data } = await api.patch("/admin/recipients/bulk/enable", { recipientIds: part });
    enabled += data?.enabled ?? 0;
  }
  return { enabled };
};

// PATCH api/admin/recipients/bulk/disable  { recipientIds: [..] }  -> { disabled }
export const disableRecipients = async (ids) => {
  let disabled = 0;
  for (const part of idParts(ids)) {
    const { data } = await api.patch("/admin/recipients/bulk/disable", { recipientIds: part });
    disabled += data?.disabled ?? 0;
  }
  return { disabled };
};

// POST api/admin/recipients/bulk/remove  { recipientIds: [..] }  -> { deleted, notFound, inUse, warning }
export const removeRecipients = async (ids) => {
  const total = { deleted: 0, notFound: 0, inUse: 0, warning: null };
  for (const part of idParts(ids)) {
    const { data } = await api.post("/admin/recipients/bulk/remove", { recipientIds: part });
    total.deleted += data?.deleted ?? 0;
    total.notFound += data?.notFound ?? 0;
    total.inUse += data?.inUse ?? 0;
    total.warning = data?.warning || total.warning;
  }
  return total;
};

/* ---------- CARDS + BULK JOBS (Custom+) ---------- */

// POST api/admin/cards (multipart/form-data) – saves the design (source image + canvas JSON)
// templateType: Invitation | Greeting | Certificate
// uploadFormat: PNG | JPG | PDF  (must match the uploaded file)
// outputFormat: PNG | JPG | PDF  (format of the files the job will produce)
export const saveCardDesign = async ({
  blob,
  designName,
  fileName,
  templateType,
  uploadFormat,
  outputFormat,
  canvasWidth,
  canvasHeight,
  canvasJson,
  format = "png",
}) => {
  const form = new FormData();
  // the file is sent with the exact name given by DesignerTable (e.g. "Rahul Patil.png")
  form.append("Image", blob, fileName || `${designName || "user"}.${format}`);
  form.append("DesignName", designName);
  form.append("TemplateType", templateType);
  form.append("UploadFormat", uploadFormat);
  form.append("OutputFormat", outputFormat);
  if (canvasWidth != null) form.append("CanvasWidth", String(canvasWidth));
  if (canvasHeight != null) form.append("CanvasHeight", String(canvasHeight));
  if (canvasJson != null) {
    form.append("CanvasJson", typeof canvasJson === "string" ? canvasJson : JSON.stringify(canvasJson));
  }

  const { data } = await api.post("/admin/cards", form, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data; // { success, cardDesignId, designName, templateType, uploadFormat, outputFormat, imageUrl }
};

// POST api/admin/bulk-jobs (JSON) - matches BulkJobCreateDto
// outputType: Image | PDF, outputFormat: PNG | JPG | PDF, channels: Email | WhatsApp | Both
// scheduledAt: UTC ISO string (e.g. "2026-11-11T13:30:00.000Z"); leave out to run now
export const createBulkJob = async ({
  cardDesignId,
  templateId,
  outputType,
  outputFormat,
  channels,
  recipientIds,
  parameterValues,
  scheduledAt,
}) => {
  const payload = {
    cardDesignId,
    templateId: templateId ?? null,
    outputType,
    outputFormat,
    channels,
    recipientIds,
    parameterValues: parameterValues || {},
  };
  if (scheduledAt) payload.scheduledAt = scheduledAt;

  const { data } = await api.post("/admin/bulk-jobs", payload);
  return data; // { jobId, status: "Scheduled" | "Queued", statusUrl }
};

/* ---------- BULK JOB HISTORY + SENT STATUS (Past Records / Sent status pages) ---------- */

// reads one value from an API row, camelCase or PascalCase
const readKey = (raw, ...names) => {
  const lower = {};
  Object.keys(raw || {}).forEach((k) => (lower[k.toLowerCase()] = raw[k]));
  for (const n of names) if (lower[n] != null) return lower[n];
  return null;
};

// fallback: first text value whose key contains one of the words (ignores ids / GUIDs / numbers)
const GUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-/i;
const fuzzyText = (raw, words, skip = []) => {
  for (const k of Object.keys(raw || {})) {
    const key = k.toLowerCase();
    const v = raw[k];
    if (typeof v !== "string" || !v || GUID_RE.test(v)) continue;
    if (skip.some((x) => key.includes(x))) continue;
    if (words.some((w) => key.includes(w))) return v;
  }
  return "";
};

// one row of GET api/admin/bulk-jobs  (also used for GET api/admin/bulk-jobs/{id})
// sent / failed / pending are read from the API when present, otherwise worked out from total
const toJobRow = (raw) => {
  const num = (...names) => {
    const v = readKey(raw, ...names);
    return v == null || v === "" ? null : Number(v);
  };
  const total = num("total", "totalcount", "totalrecipients", "totalrecords", "recipientcount", "recipientscount", "totalusers") ?? 0;
  const sent = num("sent", "sentcount", "success", "successcount", "successful", "successfulcount", "delivered", "deliveredcount") ?? 0;
  const failed = num("failed", "failedcount", "failure", "failurecount") ?? 0;
  const processed = num("processed", "processedcount");
  const pendingRaw = num("pending", "pendingcount", "remaining", "remainingcount");
  const done = processed ?? sent + failed;
  return {
    id: String(readKey(raw, "jobid", "id", "bulkjobid") ?? ""),
    status: String(readKey(raw, "status", "jobstatus") ?? ""),
    outputType: String(readKey(raw, "outputtype") ?? "") || fuzzyText(raw, ["outputtype", "output"], ["format", "path", "url"]),
    outputFormat: String(readKey(raw, "outputformat") ?? "") || fuzzyText(raw, ["outputformat", "uploadformat", "format"]),
    channels: String(readKey(raw, "channels", "channel") ?? "") || fuzzyText(raw, ["channel", "sendtype", "sendvia", "medium"]),
    templateName: String(readKey(raw, "templatename", "template") ?? "") || fuzzyText(raw, ["template"], ["path", "url", "id"]),
    designName: String(readKey(raw, "designname", "design") ?? "") || fuzzyText(raw, ["design", "title", "jobname", "campaign"], ["path", "url", "json", "id"]),
    total,
    sent,
    failed,
    pending: pendingRaw != null ? pendingRaw : Math.max(0, total - done),
    scheduledAtUtc: readKey(raw, "scheduledatutc", "scheduledat"),
    createdAt: readKey(raw, "createdat", "createdatutc"),
    startedAt: readKey(raw, "startedat", "startedatutc"),
    completedAt: readKey(raw, "completedat", "completedatutc"),
  };
};

// one row of GET api/admin/bulk-jobs/{id}/recipients
const toJobRecipientRow = (raw) => ({
  id: readKey(raw, "recipientid", "id", "jobrecipientid"),
  name: String(readKey(raw, "fullname", "name", "recipientname") ?? ""),
  email: String(readKey(raw, "email", "emailaddress") ?? ""),
  mobile: String(readKey(raw, "mobile", "mobileno", "phone", "whatsapp") ?? ""),
  status: String(readKey(raw, "status", "recipientstatus", "sendstatus") ?? ""),
  emailStatus: String(readKey(raw, "emailstatus", "emailsendstatus") ?? ""),
  whatsappStatus: String(readKey(raw, "whatsappstatus", "whatsappsendstatus", "wastatus") ?? ""),
  filePath: String(readKey(raw, "generatedimagepath", "generatedfilepath", "filepath", "imageurl") ?? ""),
  error: String(readKey(raw, "errormessage", "error", "failurereason") ?? ""),
  processedAt: readKey(raw, "processedatutc", "processedat", "sentat", "completedat"),
});

// reads every page of a list endpoint ({ data, totalPages })
const fetchAllPages = async (path, params, mapRow, pageSize) => {
  const all = [];
  for (let page = 1; page <= 500; page++) {
    const { data } = await api.get(path, { params: { ...params, page, pageSize } });
    const list = Array.isArray(data) ? data : data?.data ?? data?.items ?? [];
    if (page === 1 && list[0] && import.meta.env?.DEV) console.debug(`[${path}] first raw row:`, list[0]);
    all.push(...list);
    const totalPages = Array.isArray(data) ? 1 : data?.totalPages ?? 1;
    if (page >= totalPages || list.length === 0) break;
  }
  return all.map(mapRow);
};

// GET api/admin/bulk-jobs/{id}  -> details + progress of one job
export const getBulkJob = async (id) => {
  const { data } = await api.get(`/admin/bulk-jobs/${id}`);
  return toJobRow(data?.job ?? data?.data ?? data);
};

// GET api/admin/bulk-jobs?status=  -> every job of the admin, newest first
export const getBulkJobs = ({ status = "" } = {}) =>
  fetchAllPages("/admin/bulk-jobs", { status: status || undefined }, toJobRow, 100);

// GET api/admin/bulk-jobs/{jobId}/recipients  -> sent status of every user in that job
export const getBulkJobRecipients = (jobId, { status = "" } = {}) =>
  fetchAllPages(`/admin/bulk-jobs/${jobId}/recipients`, { status: status || undefined }, toJobRecipientRow, 100);

/* ---------- WHATSAPP TEMPLATES (dropdown in Custom+) ---------- */

// Maps one API template to { id, name, message, params } (camelCase or PascalCase keys both work)
const toWhatsappTemplate = (raw) => {
  if (typeof raw === "string") return { id: raw, name: raw, message: "", params: 0, raw };
  const lower = {};
  Object.keys(raw || {}).forEach((k) => (lower[k.toLowerCase()] = raw[k]));
  const get = (...names) => {
    for (const n of names) if (lower[n] != null) return lower[n];
    return "";
  };
  const name = String(get("templatename", "name", "template"));
  return {
    id: get("templateid", "id") || name,
    name,
    message: String(get("message", "templatemessage")),
    params: Number(get("noofparameters", "parametercount")) || 0,
    raw,
  };
};

// GET api/admin/whatsapp-templates?templateType=1&sendType=2
export const getWhatsappTemplates = async ({ templateType, sendType } = {}) => {
  const { data } = await api.get("/admin/whatsapp-templates", { params: { templateType, sendType } });
  const list = Array.isArray(data)
    ? data
    : data?.templates ?? data?.items ?? data?.data ?? data?.rows ?? [];
  return list.map(toWhatsappTemplate).filter((t) => t.name);
};

/* ---------- SUBSCRIPTION (Admin) ---------- */

// GET api/admin/plans – active plans
export const getAdminPlans = async () => {
  const { data } = await api.get("/admin/plans");
  return Array.isArray(data) ? data : data?.plans ?? data?.items ?? data?.data ?? data?.rows ?? [];
};

// GET api/admin/plans/{id} – plan details
export const getAdminPlanById = async (id) => {
  const { data } = await api.get(`/admin/plans/${id}`);
  return data;
};

// POST api/admin/promocodes/validate (body names assumed, same as the home one)
export const validateAdminPromoCode = async ({ code, planId, amount } = {}) => {
  const payload = { promoCode: String(code || "").trim() };
  if (planId != null) payload.planId = planId;
  if (amount != null) payload.amount = amount;

  try {
    const { data } = await api.post("/admin/promocodes/validate", payload);
    return toPromoValidation(data);
  } catch (err) {
    if (err?.response && err.response.status < 500) {
      return { isValid: false, message: getApiError(err, "Invalid promo code."), discountAmount: 0, finalAmount: null, raw: null };
    }
    throw err;
  }
};

// GET api/admin/promocodes – promo codes shown to admins in the Available Offers popup
// (path assumed: same base as POST /admin/promocodes/validate. Change it if your API differs)
export const getAdminPromoCodes = async () => {
  const { data } = await api.get("/admin/promocodes");
  const list = Array.isArray(data)
    ? data
    : data?.promoCodes ?? data?.items ?? data?.data ?? data?.rows ?? [];
  return list.map(normalizePromo);
};
