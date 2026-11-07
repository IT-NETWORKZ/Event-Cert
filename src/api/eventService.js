// Use the SAME import line that is at the top of adminService.js
import api, { tokenStore, storage } from "./axiosClient";

const ACADEMIC = ["Student", "Fresher"];

// Builds the multipart form-data exactly as the API expects
export const buildRegistrationForm = ({ eventId, regType, groupName, teamLead, participants }) => {
  const fd = new FormData();
  const isGroup = regType === "Group";

  fd.append("EventId", String(eventId));
  fd.append("RegistrationType", regType);
  fd.append("GroupName", isGroup ? groupName.trim() : "");
  fd.append("TeamLeadName", isGroup ? teamLead.trim() : "");

  participants.forEach((p, i) => {
    const k = `Participants[${i}]`;

    fd.append(`${k}.FullName`, p.name.trim());
    fd.append(`${k}.Gender`, p.gender);
    fd.append(`${k}.DOB`, p.dob); // yyyy-MM-dd
    fd.append(`${k}.Email`, p.email.trim());
    fd.append(`${k}.WhatsAppNo`, p.mobile.trim());
    fd.append(`${k}.Address`, p.address.trim());
    if (p.profileFile) fd.append(`${k}.ProfileImage`, p.profileFile);
    fd.append(`${k}.RegistrationCategory`, p.category);

    if (ACADEMIC.includes(p.category)) {
      fd.append(`${k}.CollegeName`, p.collegeName.trim());
      fd.append(`${k}.Stream`, p.stream.trim());
      fd.append(`${k}.Branch`, p.branch.trim());
      fd.append(`${k}.AcademicYear`, p.academicYear.trim());
    } else {
      fd.append(`${k}.OrganizationName`, p.organizationName.trim());
      fd.append(`${k}.Designation`, p.designation.trim());
      fd.append(`${k}.Experience`, p.experience.trim());
    }
  });

  return fd;
};

// POST /api/event-registration
// Response: { success, message, registrationId, eventId, registrationType, totalParticipants, totalAmount }
export const submitEventRegistration = async (values) => {
  const { data } = await api.post("/event-registration", buildRegistrationForm(values), {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data;
};