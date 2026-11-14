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