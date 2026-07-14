import { useNavigate } from "react-router-dom";
import LoginCard from "../../common/Login/LoginCard"; 
import "./CLogin.css"; 

const CLogin = () => {
  const navigate = useNavigate();

  const handleCPanelLogin = () => {
    navigate("/cpanel/dashboard");
  };

  return (
    <div className="clogin-container">
      <LoginCard 
        hideRegister={true} 
        // initialValue="admin@cpanel.com" 
        // initialOtp={["1", "2", "3", "4", "5", "6"]} // Pre-fills the 6 OTP input boxes
        onFormSubmit={handleCPanelLogin}
      />
    </div>
  );
};

export default CLogin;