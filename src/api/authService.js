import api, { tokenStore, storage } from "./axiosClient";

const save = (data) => {
  tokenStore.set(data);
  const user = {
    userId: data.userId,
    fullName: data.fullName,
    email: data.email,
    role: data.role,
    profilePicUrl: data.profilePicUrl,
  };
  storage.setItem("user", JSON.stringify(user));
  return user;
};


// # ADMIN API //
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

export const forgotPassword = (email) =>
  api.post("/auth/forgot-password", { email });

export const resetPassword = (token, newPassword) =>
  api.post("/auth/reset-password", { token, newPassword });


export const logout = async () => {
  try {
   
    await api.post("/auth/logout", { refreshToken: tokenStore.refresh });
  } catch {
    // Ignore any network errors, always ensure local clearance happens
  } finally {
    tokenStore.clear(); // Clears accessToken, refreshToken, and user from localStorage
  }
};

// # SUPERADMIN API //
export const superAdminLogin = async (email, password) => {
  const { data } = await api.post("/auth/superadmin/login", { email, password });
  return save(data);
};

// SuperAdmin Forgot Password 
export const superAdminForgotPassword = async (email) => {
  const { data } = await api.post("/auth/superadmin/forgot-password", { 
    Email: email 
  });
  return data;
};

// SuperAdmin Reset Password
export const superAdminResetPassword = async (token, newPassword, confirmPassword) => {
  const { data } = await api.post("/auth/superadmin/reset-password", {
    Token: token,
    NewPassword: newPassword,
    ConfirmPassword: confirmPassword,
  });
  return data;
};

