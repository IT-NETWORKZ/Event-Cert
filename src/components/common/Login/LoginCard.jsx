import { useState } from "react";
import { Link } from "react-router-dom";
import "./LoginCard.css";
import Button from "../../common/button/Button";


function LoginCard({ hideRegister = false, onFormSubmit, error }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onFormSubmit) {
      // matches LoginDto { Email, Password } on /api/auth/login
      onFormSubmit({ email, password });
    }
  };

  return (
    <div className="login-card">
      <h1>LOGIN</h1>
      <p>Login to continue your journey</p>

      <form onSubmit={handleSubmit}>
        {/* Email */}
        <div className="lc-field">
          <svg
            className="lc-icon"
            viewBox="0 0 24 24"
            width="18"
            height="18"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect x="3" y="5" width="18" height="14" rx="2" />
            <path d="M3 7l9 6 9-6" />
          </svg>
          <input
            type="email"
            className="lc-input"
            placeholder="Email Id"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            required
          />
        </div>

        {/* Password */}
        <div className="lc-field">
          <svg
            className="lc-icon"
            viewBox="0 0 24 24"
            width="18"
            height="18"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect x="4" y="11" width="16" height="9" rx="2" />
            <path d="M8 11V8a4 4 0 018 0v3" />
          </svg>
          <input
            type={showPassword ? "text" : "password"}
            className="lc-input"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            required
          />
          <button
            type="button"
            className="lc-toggle"
            onClick={() => setShowPassword((s) => !s)}
          >
            {showPassword ? "Hide" : "Show"}
          </button>
        </div>

        <div className="lc-forgot">
          <Link to="/forgot-password">Forgot password?</Link>
        </div>

        <div className="submit-btn-wrapper">
          <Button type="submit" className="submit-btn">
            Login
          </Button>
        </div>
      </form>

      <div className="divider">
        <span>OR</span>
      </div>

      <Button type="button" className="google-btn">
        <img
          src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
          alt="Google"
        />
        Continue with Google
      </Button>

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