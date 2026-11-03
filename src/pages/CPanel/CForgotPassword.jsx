import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { superAdminForgotPassword } from "../../api/authService"; 
import "../../css/CForgotPassword.css";

const CForgotPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!email.trim()) {
      setError("Please enter your email address.");
      return;
    }

    setLoading(true);
    try {
      const response = await superAdminForgotPassword(email.trim());
      
      // Matches your backend response: { success: true, message: "..." }
      setSuccess(
        response.message || 
        "If the account is eligible, a password reset link has been sent."
      );
      setEmail("");
    } catch (err) {
      setError(
        err.response?.data?.message ||
        "Unable to process your request. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="cfp-container">
      <form className="login-card cfp-card" onSubmit={handleSubmit} noValidate>
        <h1>Forgot Password</h1>
        <p>
          Forgot your password ? Don't worry we are just here to solve your
          problem ! Just enter your e-mail address to proceed.
        </p>

        <div className="lc-field">
          <svg
            className="lc-icon"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <rect x="3" y="5" width="18" height="14" rx="2" />
            <path d="m3 7 9 6 9-6" />
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

        {error && <div className="cfp-alert cfp-alert-error">{error}</div>}
        {success && <div className="cfp-alert cfp-alert-success">{success}</div>}

        <div className="submit-btn-wrapper">
          <button type="submit" className="submit-btn cfp-submit" disabled={loading}>
            {loading ? "Please wait..." : "Recover Password"}
          </button>
        </div>

        <div className="cfp-back-wrap">
          <button
            type="button"
            className="cfp-back"
            onClick={() => navigate("/cpanel")}
          >
            &larr; Back to Login
          </button>
        </div>
      </form>
    </div>
  );
};

export default CForgotPassword;