import { useState } from "react";
import { useNavigate } from "react-router-dom";
import LoginCard from "../../common/Login/LoginCard"; 
import { superAdminLogin } from "../../../api/authService";
import "./CLogin.css"; 

const CLogin = () => {
  const navigate = useNavigate();
  const [error, setError] = useState("");

  const handleCPanelLogin = async ({ email, password }) => {
    setError("");
    try {
      await superAdminLogin(email, password);
      navigate("/cpanel/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Invalid credentials. Please try again.");
    }
  };

  return (
    <div className="clogin-container">
      <LoginCard 
        hideRegister={true} 
        onFormSubmit={handleCPanelLogin}
        error={error}
      />
    </div>
  );
};

export default CLogin;


