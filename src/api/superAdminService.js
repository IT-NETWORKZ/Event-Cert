import api from "./axiosClient";

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
  return data;
};

export const getPlans = async () => {
  const { data } = await api.get("/superadmin/templates-admin");
  return Array.isArray(data) ? data : data?.plans ?? data?.data ?? data?.items ?? [];
};