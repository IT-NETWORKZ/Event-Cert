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
  return data.feedback ?? [];
};

// CPanel: enable / disable
export const setFeedbackStatus = async (feedbackId, isEnabled) => {
  const { data } = await api.put(`/feedback/${feedbackId}/status`, { isEnabled });
  return data;
};

// Home page: enabled only
export const getPublicFeedback = async () => {
  const { data } = await api.get("/feedback/public");
  return data;
};