import api from "../api/axiosClient";

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