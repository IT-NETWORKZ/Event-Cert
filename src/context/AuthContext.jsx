import { createContext, useContext, useState } from "react";
import * as authService from "../api/authService";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem("user")); } catch { return null; }
  });

  const login = async (email, password) => {
    const u = await authService.login(email, password);
    setUser(u);
    return u;
  };

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
    <AuthContext.Provider value={{ user, login, googleLogin, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);