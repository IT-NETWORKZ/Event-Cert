import api from "./axiosClient";

// GET /api/feedback/me -> { userId, userName }
export const getFeedbackUser = async () => {
  const { data } = await api.get("/feedback/me");
  return data;
};

// POST /api/feedback
export const submitFeedback = async ({ rating, description }) => {
  const { data } = await api.post("/feedback", { rating, description });
  return data;
};

// CPanel: all records
export const getAllFeedback = async () => {
  const { data } = await api.get("/feedback/all");
  return data;
};

// CPanel: enable / disable
export const updateFeedbackStatus = async (feedbackId, nBit) => {
  const { data } = await api.patch(`/superadmin/feedback/${feedbackId}/status`, { nBit });
  return data;
};

// Home page: enabled feedback only
export const getPublicFeedback = async () => {
  const { data } = await api.get("/home/feedback");
  const adminList = data.adminFeedback ? [data.adminFeedback] : [];
  const otherList = data.otherFeedback || [];

  return [...adminList, ...otherList];
};