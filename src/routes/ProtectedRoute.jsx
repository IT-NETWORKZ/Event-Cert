import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext"; // adjust path

// "Super Admin", "super_admin", "SuperAdmin" -> "superadmin"
const norm = (r) => String(r || "").toLowerCase().replace(/[\s_-]/g, "");

/**
 * roles: only these roles are allowed
 * deny:  these roles are blocked, everyone else logged-in is allowed
 */
function ProtectedRoute({ roles = [], deny = [] }) {
  const { user, isAuthenticated } = useAuth();
  const location = useLocation();
  const isCPanel = location.pathname.startsWith("/cpanel");

  if (!isAuthenticated || !user) {
    return (
      <Navigate
        to={isCPanel ? "/cpanel" : "/"}
        state={{ from: location }}
        replace
      />
    );
  }

  const userRole = norm(user.role);
  const isSuperAdmin = userRole === "superadmin";

  const notAllowed =
    (roles.length > 0 && !roles.some((r) => norm(r) === userRole)) ||
    (deny.length > 0 && deny.some((r) => norm(r) === userRole));

  if (notAllowed) {
    return <Navigate to={isSuperAdmin ? "/cpanel/dashboard" : "/admin"} replace />;
  }

  return <Outlet />;
}

export default ProtectedRoute;