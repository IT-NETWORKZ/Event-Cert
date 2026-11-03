import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import LoginCard from "../../common/Login/LoginCard";
import { useAuth } from "../../../context/AuthContext"; // adjust path
import "./CLogin.css";

const norm = (r) => String(r || "").toLowerCase().replace(/[\s_-]/g, "");

const CLogin = () => {
  const navigate = useNavigate();
  const { isAuthenticated, superAdminLogin, logout } = useAuth();
  const [error, setError] = useState("");

  // Opening the login page always starts a fresh session
  useEffect(() => {
    if (isAuthenticated) logout();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleCPanelLogin = async ({ email, password }) => {
    setError("");
    try {
      const u = await superAdminLogin(email, password);

      if (norm(u.role) !== "superadmin") {
        await logout();
        setError("You are not authorized to access the control panel.");
        return;
      }

      navigate("/cpanel/dashboard", { replace: true });
    } catch (err) {
      setError(
        err.response?.data?.message || "Invalid credentials. Please try again."
      );
    }
  };

  return (
    <div className="clogin-container">
      <LoginCard
        hideRegister={true}
        onFormSubmit={handleCPanelLogin}
        error={error}
        forgotPasswordPath="/cpanel/forgot-password"
      />
    </div>
  );
};

export default CLogin;