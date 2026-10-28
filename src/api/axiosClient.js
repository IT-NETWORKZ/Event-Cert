import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "https://localhost:7151/api",
  withCredentials: true,
});

export const tokenStore = {
  get access() {
    return localStorage.getItem("accessToken");
  },
  get refresh() {
    return localStorage.getItem("refreshToken");
  },
  set({ accessToken, refreshToken }) {
    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("refreshToken", refreshToken);
  },
  clear() {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");
  },
};

// Attach the access token to every request
api.interceptors.request.use((config) => {
  if (tokenStore.access) {
    config.headers.Authorization = `Bearer ${tokenStore.access}`;
  }
  return config;
});

// One refresh at a time. The backend rotates refresh tokens, so parallel
// refreshes would trigger its token-reuse protection and log the user out.
let refreshing = null;

api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config;
    const url = original?.url || "";
    const isAuthCall =
      url.includes("/auth/login") ||
      url.includes("/auth/google-login") ||
      url.includes("/auth/refresh-token");

    if (
      error.response?.status === 401 &&
      !original._retry &&
      !isAuthCall &&
      tokenStore.refresh
    ) {
      original._retry = true;
      try {
        refreshing ??= api
          .post("/auth/refresh-token", {
            accessToken: tokenStore.access,
            refreshToken: tokenStore.refresh,
          })
          .finally(() => {
            refreshing = null;
          });

        const { data } = await refreshing;
        tokenStore.set(data);
        original.headers.Authorization = `Bearer ${data.accessToken}`;
        return api(original);
      } catch {
        tokenStore.clear();
        window.location.href = "/";
      }
    }
    return Promise.reject(error);
  }
);

export default api;