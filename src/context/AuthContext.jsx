import { createContext, useContext, useState } from "react";
import * as authService from "../api/authService";
import { storage, tokenStore } from "../api/axiosClient";

const AuthContext = createContext(null);

const readUser = () => {
  try {
    // user is valid only if tokens exist too
    if (!tokenStore.access && !tokenStore.refresh) return null;
    return JSON.parse(storage.getItem("user"));
  } catch {
    return null;
  }
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(readUser);

  const login = async (email, password) => {
    const u = await authService.login(email, password);
    setUser(u);
    return u;
  };

  const superAdminLogin = async (email, password) => {
    const u = await authService.superAdminLogin(email, password);
    setUser(u);
    return u;
  };

  const register = (payload) => authService.register(payload);

  const googleLogin = async (idToken) => {
    const u = await authService.googleLogin(idToken);
    setUser(u);
    return u;
  };

  const logout = async () => {
    await authService.logout();
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        superAdminLogin,
        register,
        googleLogin,
        logout,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);