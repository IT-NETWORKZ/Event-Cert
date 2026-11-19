// Use the SAME import line that is at the top of adminService.js
import api from "./axiosClient";

const ACADEMIC = ["Student", "Fresher"];

/* ---------- error helpers ---------- */

// backend property name -> form field name
const FIELD_MAP = {
  fullname: "name",
  gender: "gender",
  dob: "dob",
  age: "age",
  email: "email",
  whatsappno: "mobile",
  address: "address",
  profileimage: "profileFile",
  registrationcategory: "category",
  collegename: "collegeName",
  stream: "stream",
  branch: "branch",
  academicyear: "academicYear",
  organizationname: "organizationName",
  designation: "designation",
  experience: "experience",
};

const TOP_MAP = {
  eventid: "eventId",
  registrationtype: "regType",
  groupname: "groupName",
  teamleadname: "teamLead",
};

// Converts an axios error into { message, fieldErrors }
// fieldErrors keys match the form: "groupName", "participants.0.email", ...
export const parseRegistrationError = (err, fallback = "Registration submission failed. Please try again.") => {
  if (!err?.response) {
    return { message: "Could not reach the server. Please try again.", fieldErrors: {} };
  }

  const d = err.response.data;
  const fieldErrors = {};
  let firstServerMsg = "";

  // ASP.NET Core validation: { errors: { "Participants[0].Email": ["..."] } }
  if (d && typeof d === "object" && d.errors && typeof d.errors === "object") {
    Object.entries(d.errors).forEach(([key, val]) => {
      const text = Array.isArray(val) ? val[0] : String(val);
      if (!text) return;
      if (!firstServerMsg) firstServerMsg = text;

      const m = key.match(/^Participants\[(\d+)\]\.(.+)$/i);
      if (m) {
        const field = FIELD_MAP[m[2].toLowerCase()];
        if (field) fieldErrors[`participants.${m[1]}.${field}`] = text;
        return;
      }
      const top = TOP_MAP[key.toLowerCase()];
      if (top) fieldErrors[top] = text;
    });
  }

  let message = "";
  if (typeof d === "string" && d.trim()) message = d;
  else message = d?.message || d?.title || "";

  // show the real validation text instead of a generic title
  if (firstServerMsg) message = firstServerMsg;
  else if (!message) message = fallback;

  return { message, fieldErrors };
};

/* ---------- request ---------- */

// Builds the multipart form-data exactly as the API expects
export const buildRegistrationForm = ({ eventId, regType, groupName, teamLead, participants }) => {
  const fd = new FormData();
  const isGroup = regType === "Group";

  fd.append("EventId", String(eventId ?? 0));
  fd.append("RegistrationType", regType);
  fd.append("GroupName", isGroup ? (groupName || "").trim() : "");
  fd.append("TeamLeadName", isGroup ? (teamLead || "").trim() : "");

  participants.forEach((p, i) => {
    const k = `Participants[${i}]`;

    fd.append(`${k}.FullName`, (p.name || "").trim());
    fd.append(`${k}.Gender`, p.gender || "");
    fd.append(`${k}.DOB`, p.dob || ""); // yyyy-MM-dd
    fd.append(`${k}.Email`, (p.email || "").trim());
    fd.append(`${k}.WhatsAppNo`, (p.mobile || "").trim());
    fd.append(`${k}.Address`, (p.address || "").trim());
    if (p.profileFile) fd.append(`${k}.ProfileImage`, p.profileFile);
    fd.append(`${k}.RegistrationCategory`, p.category || "");

    if (ACADEMIC.includes(p.category)) {
      fd.append(`${k}.CollegeName`, (p.collegeName || "").trim());
      fd.append(`${k}.Stream`, (p.stream || "").trim());
      fd.append(`${k}.Branch`, (p.branch || "").trim());
      fd.append(`${k}.AcademicYear`, (p.academicYear || "").trim());
    } else {
      fd.append(`${k}.OrganizationName`, (p.organizationName || "").trim());
      fd.append(`${k}.Designation`, (p.designation || "").trim());
      fd.append(`${k}.Experience`, (p.experience || "").trim());
    }
  });

  return fd;
};

// POST /api/event-registration  (https://localhost:7151/api/event-registration)
// Response: { success, message, registrationId, eventId, registrationType, totalParticipants, totalAmount }
// Errors are thrown - use parseRegistrationError(err) in the caller.
export const submitEventRegistration = async (values) => {
  const { data } = await api.post("/event-registration", buildRegistrationForm(values), {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data;
};

/* ==========================================================================
   ATTENDANCE (public, used after scanning the event's attendance QR)
   Flow: send-otp -> verify-otp -> attendance marked as present
   ========================================================================== */

// Reads the real message from the backend response.
// Returns { message, status, registered }
//   status     : HTTP status (0 when the server could not be reached)
//   registered : false only when the backend says "not registered"
export const parseAttendanceError = (err) => {
  if (!err?.response) {
    return { message: "Could not reach the server. Please try again.", status: 0, registered: true };
  }

  const d = err.response.data;
  let message = "";

  // ASP.NET Core validation: { errors: { "Email": ["..."] } }
  if (d?.errors && typeof d.errors === "object") {
    const first = Object.values(d.errors)[0];
    message = Array.isArray(first) ? first[0] : String(first || "");
  }

  if (!message && typeof d === "string" && d.trim()) message = d;
  message = message || d?.message || d?.title || "Something went wrong. Please try again.";

  return { message, status: err.response.status, registered: d?.registered !== false };
};

// GET /api/home/events/{id}  -> only used to show the title and dates (optional)
export const getAttendanceEvent = async (eventId) => {
  const { data } = await api.get(`/home/events/${eventId}`);
  return data?.eventDetails || null;
};

// POST /api/home/attendance/send-otp
// Response: { success, registered, message, email }
export const sendAttendanceOtp = async ({ eventId, email }) => {
  const { data } = await api.post("/home/attendance/send-otp", {
    eventId: Number(eventId),
    email,
  });
  return data;
};

// POST /api/home/attendance/verify-otp
// Response: { success, attendanceMarked, message, eventId, participantId, participantName, attendanceDate }
export const verifyAttendanceOtp = async ({ eventId, email, otp }) => {
  const { data } = await api.post("/home/attendance/verify-otp", {
    eventId: Number(eventId),
    email,
    otp,
  });
  return data;
};

/* ==========================================================================
   PUBLIC EVENTS LIST (home page)
   GET /api/home/events  ->  { success, totalRecords, events: [...] }
   ========================================================================== */
export const getHomeEvents = async () => {
  const { data } = await api.get("/home/events");
  return data;
};

/* ==========================================================================
   EVENT PARTICIPANTS (table on the event registration page)
   GET /api/home/events/{id}/participants
   ->  [ { participantId, fullName, gender, registrationCategory, groupName,
           status, collegeName, organizationName, profileImage } ]
       (or { success, participants: [...] })
   ========================================================================== */
export const getEventParticipants = async (eventId) => {
  const { data } = await api.get(`/home/events/${eventId}/participants`);
  return Array.isArray(data) ? data : data?.participants ?? data?.data ?? [];
};

/* ==========================================================================
   ADMIN ATTENDANCE DASHBOARD (needs the admin JWT - axiosClient adds it)
   GET /api/admin/attendance/events          -> { success, count, data: [events] }
   GET /api/admin/attendance/report?eventId=&date=yyyy-MM-dd
                                             -> { success, message, data: report }
   Errors (400/404) carry { message } - use parseAttendanceError(err).
   ========================================================================== */
export const getAdminAttendanceEvents = async () => {
  const { data } = await api.get("/admin/attendance/events");
  return Array.isArray(data) ? data : data?.data ?? [];
};

export const getAdminAttendanceReport = async ({ eventId, date }) => {
  const { data } = await api.get("/admin/attendance/report", { params: { eventId, date } });
  return data?.data ?? data;
};
