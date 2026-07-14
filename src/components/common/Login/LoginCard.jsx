import { useRef } from "react";
import { Link } from "react-router-dom";
import "./LoginCard.css";

function LoginCard({ hideRegister = false, onFormSubmit,  }) {
  const otpRefs = useRef([]);

  const handleOTPChange = (e, index) => {
    const value = e.target.value;
    if (!/^\d?$/.test(value)) {
      e.target.value = "";
      return;
    }
    if (value && index < 5) {
      otpRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !e.target.value && index > 0) {
      otpRefs.current[index - 1].focus();
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onFormSubmit) {
      onFormSubmit();
    }
  };

  return (
    <div className="login-card">
      <h1>LOGIN</h1>
      <p>Login to continue your journey</p>

      <div className="otp-options">
        <label>
          <input type="radio" name="otp" defaultChecked />
          Email OTP
        </label>
        <label>
          <input type="radio" name="otp" />
          Mobile OTP
        </label>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="input-row-group">
          <input
            type="text"
            className="form-control"
            placeholder="Email Id / Mobile No."
            // defaultValue={initialValue}
          />
          <button type="button" className="otp-btn">
            Send OTP
          </button>
        </div>

        <h6>Enter OTP</h6>
        <div className="otp-boxes">
          {[...Array(6)].map((_, index) => (
            <input
              key={index}
              type="text"
              maxLength={1}
              inputMode="numeric"
              pattern="\d*"
              ref={(el) => (otpRefs.current[index] = el)}
              onChange={(e) => handleOTPChange(e, index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
            />
          ))}
        </div>

        <div className="submit-btn-wrapper">
          <button type="submit" className="submit-btn">
            Submit
          </button>
        </div>
      </form>

      <div className="divider">
        <span>OR</span>
      </div>

      <button type="button" className="google-btn">
        <img
          src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
          alt="Google"
        />
        Continue with Google
      </button>

      {/* Conditionally hide register link */}
      {!hideRegister && (
        <p className="register">
          Don't have an account?
          <Link to="/register" className="text-blue">
            Register
          </Link>
        </p>
      )}
    </div>
  );
}

export default LoginCard;

