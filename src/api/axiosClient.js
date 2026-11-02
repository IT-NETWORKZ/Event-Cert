import axios from "axios";

const KEYS = ["accessToken", "refreshToken", "user"];

// In-memory storage: lives only as long as the page is loaded.
// Typing a URL, F5, or opening a new tab starts with an empty session.
const mem = new Map();
export const storage = {
  getItem: (k) => (mem.has(k) ? mem.get(k) : null),
  setItem: (k, v) => mem.set(k, String(v)),
  removeItem: (k) => mem.delete(k),
};

// Remove any old persisted sessions from earlier versions
KEYS.forEach((k) => {
  localStorage.removeItem(k);
  sessionStorage.removeItem(k);
});

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "https://localhost:7151/api",
  withCredentials: true,
});

export const tokenStore = {
  get access() {
    return storage.getItem("accessToken");
  },
  get refresh() {
    return storage.getItem("refreshToken");
  },
  set({ accessToken, refreshToken }) {
    storage.setItem("accessToken", accessToken);
    storage.setItem("refreshToken", refreshToken);
  },
  clear() {
    KEYS.forEach((k) => storage.removeItem(k));
  },
};

// Attach the access token to every request
api.interceptors.request.use((config) => {
  if (tokenStore.access) {
    config.headers.Authorization = `Bearer ${tokenStore.access}`;
  }
  return config;
});

// One refresh at a time (backend rotates refresh tokens)
let refreshing = null;

api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config;
    const url = original?.url || "";
    const isAuthCall =
      url.includes("/auth/login") ||
      url.includes("/auth/superadmin/login") ||
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
        const wasCPanel = window.location.pathname.startsWith("/cpanel");
        tokenStore.clear();
        window.location.href = wasCPanel ? "/cpanel" : "/";
      }
    }
    return Promise.reject(error);
  }
);

export default api;