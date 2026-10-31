import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ roles }) {
  const { user } = useAuth();
  const token = localStorage.getItem("accessToken");
  if (!user) return <Navigate to="/" replace />;
  if (roles && !roles.includes(user.role)) return <Navigate to="/" replace />;


  // Super admin  
  if (!user || !token) {
    return <Navigate to="/cpanel" replace />;
  }


  if (roles && !roles.includes(user.role)) {
    return <Navigate to="/cpanel" replace />;
  }




  return <Outlet />;
}
