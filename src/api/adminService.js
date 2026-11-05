import api from "../api/axiosClient";

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

