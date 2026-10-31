import api, { tokenStore } from "./axiosClient";

const save = (data) => {
  tokenStore.set(data);
  const user = {
    userId: data.userId,
    fullName: data.fullName,
    email: data.email,
    role: data.role,
    profilePicUrl: data.profilePicUrl,
  };
  localStorage.setItem("user", JSON.stringify(user));
  return user;
};

// LOGIN: saves the tokens
export const login = async (email, password) => {
  const { data } = await api.post("/auth/login", { email, password });
  return save(data);
};

// REGISTER: creates the account, does NOT save the tokens
export const register = async (payload) => {
  const { data } = await api.post("/auth/register", payload);
  return data;
};

export const googleLogin = async (idToken) => {
  const { data } = await api.post("/auth/google-login", { idToken });
  return save(data);
};

export const forgotPassword = (email) => api.post("/auth/forgot-password", { email });

export const resetPassword = (token, newPassword) =>
  api.post("/auth/reset-password", { token, newPassword });

export const logout = async () => {
  try {
    await api.post("/auth/logout", { refreshToken: tokenStore.refresh });
  } finally {
    tokenStore.clear();
  }
};


// SuperAdmin Api
export const superAdminLogin = async (email, password) => {
  const { data } = await api.post("/auth/superadmin/login", { email, password });
  return save(data);
};