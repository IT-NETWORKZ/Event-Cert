import React, { useState } from "react";
import {
  LockKeyhole,
  Eye,
  EyeOff,
  ArrowRight,
  ArrowLeft,
  Check,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import "./ResetPassword.css";

const ResetPassword = () => {
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const requirements = [
    { label: "At least 8 characters", valid: password.length >= 8 },
    { label: "One uppercase letter", valid: /[A-Z]/.test(password) },
    { label: "One number", valid: /[0-9]/.test(password) },
    { label: "One special character", valid: /[^A-Za-z0-9]/.test(password) },
  ];

  const strength = requirements.filter((item) => item.valid).length;

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    if (strength !== 4) {
      setError("Please meet all password requirements.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    // Connect your password reset API here.
    setSuccess(true);
  };

  return (
    <main className="reset-page">
      <section className="reset-card">
        {!success ? (
          <>
            <div className="reset-heading">
              <div className="reset-icon">
                <LockKeyhole size={23} />
              </div>

              <h1>Reset Password</h1>
              <p>Create a new password for your account.</p>
            </div>

            <form className="reset-form" onSubmit={handleSubmit}>
              <div className="reset-field">
                <label htmlFor="new-password">New Password</label>

                <div className="reset-input">
                  <LockKeyhole size={17} />

                  <input
                    id="new-password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter new password"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      setError("");
                    }}
                    autoComplete="new-password"
                    required
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                  </button>
                </div>
              </div>

              <div className="reset-strength">
                <div className="reset-strength-label">
                  <span>Password strength</span>
                  <span className={`reset-strength-text level-${strength}`}>
                    {password
                      ? ["Weak", "Weak", "Fair", "Good", "Strong"][strength]
                      : "Not entered"}
                  </span>
                </div>

                <div className="reset-strength-bars">
                  {[1, 2, 3, 4].map((bar) => (
                    <span
                      key={bar}
                      className={
                        password && bar <= strength
                          ? `active level-${strength}`
                          : ""
                      }
                    />
                  ))}
                </div>
              </div>

              <div className="reset-requirements">
                {requirements.map((item) => (
                  <div
                    key={item.label}
                    className={item.valid ? "valid" : ""}
                  >
                    <Check size={13} />
                    <span>{item.label}</span>
                  </div>
                ))}
              </div>

              <div className="reset-field">
                <label htmlFor="confirm-password">Confirm Password</label>

                <div
                  className={`reset-input ${
                    confirmPassword && password !== confirmPassword
                      ? "invalid"
                      : ""
                  }`}
                >
                  <LockKeyhole size={17} />

                  <input
                    id="confirm-password"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm new password"
                    value={confirmPassword}
                    onChange={(e) => {
                      setConfirmPassword(e.target.value);
                      setError("");
                    }}
                    autoComplete="new-password"
                    required
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowConfirmPassword(!showConfirmPassword)
                    }
                    aria-label={
                      showConfirmPassword
                        ? "Hide confirm password"
                        : "Show confirm password"
                    }
                  >
                    {showConfirmPassword ? (
                      <EyeOff size={17} />
                    ) : (
                      <Eye size={17} />
                    )}
                  </button>
                </div>

                {confirmPassword && password !== confirmPassword && (
                  <span className="reset-field-error">
                    Passwords do not match.
                  </span>
                )}
              </div>

              {error && (
                <p className="reset-error" role="alert">
                  {error}
                </p>
              )}

              <button type="submit" className="reset-submit">
                Update Password
                <ArrowRight size={16} />
              </button>
            </form>

            <button
              type="button"
              className="reset-back"
              onClick={() => navigate("/admin")}
            >
              <ArrowLeft size={15} />
              Back to Dashboard
            </button>
          </>
        ) : (
          <div className="reset-success">
            <div className="reset-success-icon">
              <Check size={30} />
            </div>

            <h1>Password Validated</h1>
            <p>
              Your password meets all requirements. Connect your API to save
              the new password.
            </p>

            <button
              type="button"
              className="reset-submit"
              onClick={() => navigate("/admin")}
            >
              Back to Dashboard
              <ArrowRight size={16} />
            </button>
          </div>
        )}
      </section>
    </main>
  );
};

export default ResetPassword;
