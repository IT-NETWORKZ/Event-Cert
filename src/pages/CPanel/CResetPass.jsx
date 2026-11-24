import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  LockKeyhole,
  Eye,
  EyeOff,
  ArrowRight,
  ArrowLeft,
  Check,
} from "lucide-react";
import {
  superAdminResetPassword,
  adminResetPassword,
} from "../../api/authService";
import "../../css/CResetPass.css";

// Pull the most useful message out of whatever shape the backend returns
const extractMessage = (err) => {
  if (err?.code === "ECONNABORTED") {
    return "The request timed out. Please try again.";
  }
  if (!err?.response) {
    return "Cannot reach the server. Check your connection and that the backend is running.";
  }
  const data = err.response.data;
  if (typeof data === "string" && data.trim()) return data;
  if (data?.Message) return data.Message;
  if (data?.message) return data.message;
  if (data?.errors) {
    const first = Object.values(data.errors).flat()[0];
    if (first) return first;
  }
  if (data?.title) return data.title;
  return `Request failed (${err.response.status}).`;
};

const CResetPass = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const roleParam = (searchParams.get("role") || "").toLowerCase();

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [resolvedRole, setResolvedRole] = useState(
    roleParam === "admin" ? "admin" : "superadmin"
  );

  const loginPath = resolvedRole === "admin" ? "/" : "/cpanel";

  const requirements = [
    { label: "At least 8 characters", valid: newPassword.length >= 8 },
    { label: "One uppercase letter", valid: /[A-Z]/.test(newPassword) },
    { label: "One number", valid: /[0-9]/.test(newPassword) },
    { label: "One special character", valid: /[^A-Za-z0-9]/.test(newPassword) },
  ];

  const strength = requirements.filter((item) => item.valid).length;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!token) {
      setError("Missing or invalid reset token in URL.");
      return;
    }

    if (!newPassword || !confirmPassword) {
      setError("Please fill in all fields.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    // Which endpoints to try, in order
    let attempts;
    if (roleParam === "admin") {
      attempts = [{ role: "admin", fn: adminResetPassword }];
    } else if (roleParam === "superadmin") {
      attempts = [{ role: "superadmin", fn: superAdminResetPassword }];
    } else {
      // No role in the link: try admin first, then superadmin
      attempts = [
        { role: "admin", fn: adminResetPassword },
        { role: "superadmin", fn: superAdminResetPassword },
      ];
    }

    setLoading(true);
    const errors = [];

    try {
      for (const attempt of attempts) {
        try {
          const response = await attempt.fn(token, newPassword, confirmPassword);
          setResolvedRole(attempt.role);
          setSuccess(
            response?.message ||
              "Password reset successfully. Please log in with your new password."
          );
          return;
        } catch (err) {
          console.error(
            `Reset password (${attempt.role}) failed:`,
            err?.response?.status,
            err?.response?.data || err?.message
          );
          errors.push(err);

          // Only fall through to the next endpoint on "this token isn't valid here" responses.
          // Network errors, timeouts and 5xx will not be fixed by trying another endpoint.
          const status = err?.response?.status;
          const tokenRejected = [400, 401, 403, 404].includes(status);
          if (!tokenRejected) break;
        }
      }

      // All attempts failed. Prefer a message about the password (validation) if one exists,
      // otherwise show the first error.
      const messages = errors.map(extractMessage);
      const passwordMsg = messages.find((m) => /password/i.test(m));
      setError(
        passwordMsg ||
          messages[0] ||
          "Unable to reset password. The link may have expired."
      );
    } finally {
      setLoading(false);
    }
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
              <p>
                Enter your new password below to complete the recovery process.
              </p>
            </div>

            <form className="reset-form" onSubmit={handleSubmit} noValidate>
              <div className="reset-field">
                <label htmlFor="new-password">New Password</label>

                <div className="reset-input">
                  <LockKeyhole size={17} />

                  <input
                    id="new-password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter new password"
                    value={newPassword}
                    onChange={(e) => {
                      setNewPassword(e.target.value);
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
                    {newPassword
                      ? ["Weak", "Weak", "Fair", "Good", "Strong"][strength]
                      : "Not entered"}
                  </span>
                </div>

                <div className="reset-strength-bars">
                  {[1, 2, 3, 4].map((bar) => (
                    <span
                      key={bar}
                      className={
                        newPassword && bar <= strength
                          ? `active level-${strength}`
                          : ""
                      }
                    />
                  ))}
                </div>
              </div>

              <div className="reset-requirements">
                {requirements.map((item) => (
                  <div key={item.label} className={item.valid ? "valid" : ""}>
                    <Check size={13} />
                    <span>{item.label}</span>
                  </div>
                ))}
              </div>

              <div className="reset-field">
                <label htmlFor="confirm-password">Confirm Password</label>

                <div
                  className={`reset-input ${
                    confirmPassword && newPassword !== confirmPassword
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

                {confirmPassword && newPassword !== confirmPassword && (
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

              <button
                type="submit"
                className="reset-submit"
                disabled={loading}
              >
                {loading ? "Updating..." : "Update Password"}
                {!loading && <ArrowRight size={16} />}
              </button>
            </form>

            <button
              type="button"
              className="reset-back"
              onClick={() => navigate(loginPath)}
            >
              <ArrowLeft size={15} />
              Back to Login
            </button>
          </>
        ) : (
          <div className="reset-success">
            <div className="reset-success-icon">
              <Check size={30} />
            </div>

            <h1>Password Updated</h1>
            <p>{success}</p>

            <button
              type="button"
              className="reset-submit"
              onClick={() => navigate(loginPath)}
            >
              Back to Login
              <ArrowRight size={16} />
            </button>
          </div>
        )}
      </section>
    </main>
  );
};

export default CResetPass;


// import { useState } from "react";
// import { useNavigate, useSearchParams } from "react-router-dom";
// import {
//   LockKeyhole,
//   Eye,
//   EyeOff,
//   ArrowRight,
//   ArrowLeft,
//   Check,
// } from "lucide-react";
// import { superAdminResetPassword } from "../../api/authService";
// import "../../css/CResetPass.css"; // copy ResetPassword.css into src/css (or fix this path)

// const CResetPass = () => {
//   const navigate = useNavigate();
//   const [searchParams] = useSearchParams();
//   const token = searchParams.get("token");

//   const [newPassword, setNewPassword] = useState("");
//   const [confirmPassword, setConfirmPassword] = useState("");
//   const [showPassword, setShowPassword] = useState(false);
//   const [showConfirmPassword, setShowConfirmPassword] = useState(false);
//   const [error, setError] = useState("");
//   const [success, setSuccess] = useState("");
//   const [loading, setLoading] = useState(false);

//   // Visual guidance only - does not block submission (original logic kept)
//   const requirements = [
//     { label: "At least 8 characters", valid: newPassword.length >= 8 },
//     { label: "One uppercase letter", valid: /[A-Z]/.test(newPassword) },
//     { label: "One number", valid: /[0-9]/.test(newPassword) },
//     { label: "One special character", valid: /[^A-Za-z0-9]/.test(newPassword) },
//   ];

//   const strength = requirements.filter((item) => item.valid).length;

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError("");
//     setSuccess("");

//     if (!token) {
//       setError("Missing or invalid reset token in URL.");
//       return;
//     }

//     if (!newPassword || !confirmPassword) {
//       setError("Please fill in all fields.");
//       return;
//     }

//     if (newPassword !== confirmPassword) {
//       setError("Passwords do not match.");
//       return;
//     }

//     setLoading(true);
//     try {
//       const response = await superAdminResetPassword(
//         token,
//         newPassword,
//         confirmPassword
//       );
//       setSuccess(
//         response.message || "Password reset successfully. Please log in."
//       );
//     } catch (err) {
//       setError(
//         err.response?.data?.Message ||
//           err.response?.data?.message ||
//           "Unable to reset password. The link may have expired."
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <main className="reset-page">
//       <section className="reset-card">
//         {!success ? (
//           <>
//             <div className="reset-heading">
//               <div className="reset-icon">
//                 <LockKeyhole size={23} />
//               </div>

//               <h1>Reset Password</h1>
//               <p>
//                 Enter your new password below to complete the recovery process.
//               </p>
//             </div>

//             <form className="reset-form" onSubmit={handleSubmit} noValidate>
//               <div className="reset-field">
//                 <label htmlFor="new-password">New Password</label>

//                 <div className="reset-input">
//                   <LockKeyhole size={17} />

//                   <input
//                     id="new-password"
//                     type={showPassword ? "text" : "password"}
//                     placeholder="Enter new password"
//                     value={newPassword}
//                     onChange={(e) => {
//                       setNewPassword(e.target.value);
//                       setError("");
//                     }}
//                     autoComplete="new-password"
//                     required
//                   />

//                   <button
//                     type="button"
//                     onClick={() => setShowPassword(!showPassword)}
//                     aria-label={showPassword ? "Hide password" : "Show password"}
//                   >
//                     {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
//                   </button>
//                 </div>
//               </div>

//               <div className="reset-strength">
//                 <div className="reset-strength-label">
//                   <span>Password strength</span>
//                   <span className={`reset-strength-text level-${strength}`}>
//                     {newPassword
//                       ? ["Weak", "Weak", "Fair", "Good", "Strong"][strength]
//                       : "Not entered"}
//                   </span>
//                 </div>

//                 <div className="reset-strength-bars">
//                   {[1, 2, 3, 4].map((bar) => (
//                     <span
//                       key={bar}
//                       className={
//                         newPassword && bar <= strength
//                           ? `active level-${strength}`
//                           : ""
//                       }
//                     />
//                   ))}
//                 </div>
//               </div>

//               <div className="reset-requirements">
//                 {requirements.map((item) => (
//                   <div key={item.label} className={item.valid ? "valid" : ""}>
//                     <Check size={13} />
//                     <span>{item.label}</span>
//                   </div>
//                 ))}
//               </div>

//               <div className="reset-field">
//                 <label htmlFor="confirm-password">Confirm Password</label>

//                 <div
//                   className={`reset-input ${
//                     confirmPassword && newPassword !== confirmPassword
//                       ? "invalid"
//                       : ""
//                   }`}
//                 >
//                   <LockKeyhole size={17} />

//                   <input
//                     id="confirm-password"
//                     type={showConfirmPassword ? "text" : "password"}
//                     placeholder="Confirm new password"
//                     value={confirmPassword}
//                     onChange={(e) => {
//                       setConfirmPassword(e.target.value);
//                       setError("");
//                     }}
//                     autoComplete="new-password"
//                     required
//                   />

//                   <button
//                     type="button"
//                     onClick={() =>
//                       setShowConfirmPassword(!showConfirmPassword)
//                     }
//                     aria-label={
//                       showConfirmPassword
//                         ? "Hide confirm password"
//                         : "Show confirm password"
//                     }
//                   >
//                     {showConfirmPassword ? (
//                       <EyeOff size={17} />
//                     ) : (
//                       <Eye size={17} />
//                     )}
//                   </button>
//                 </div>

//                 {confirmPassword && newPassword !== confirmPassword && (
//                   <span className="reset-field-error">
//                     Passwords do not match.
//                   </span>
//                 )}
//               </div>

//               {error && (
//                 <p className="reset-error" role="alert">
//                   {error}
//                 </p>
//               )}

//               <button
//                 type="submit"
//                 className="reset-submit"
//                 disabled={loading}
//               >
//                 {loading ? "Updating..." : "Update Password"}
//                 {!loading && <ArrowRight size={16} />}
//               </button>
//             </form>

//             <button
//               type="button"
//               className="reset-back"
//               onClick={() => navigate("/cpanel")}
//             >
//               <ArrowLeft size={15} />
//               Back to Login
//             </button>
//           </>
//         ) : (
//           <div className="reset-success">
//             <div className="reset-success-icon">
//               <Check size={30} />
//             </div>

//             <h1>Password Updated</h1>
//             <p>{success}</p>

//             <button
//               type="button"
//               className="reset-submit"
//               onClick={() => navigate("/cpanel")}
//             >
//               Back to Login
//               <ArrowRight size={16} />
//             </button>
//           </div>
//         )}
//       </section>
//     </main>
//   );
// };

// export default CResetPass;


// // import { useState } from "react";
// // import { useNavigate, useSearchParams } from "react-router-dom";
// // import { superAdminResetPassword } from "../../api/authService";
// // import "../../css/CForgotPassword.css"; // Reuse same styling as forgot password

// // const CResetPass = () => {
// //   const navigate = useNavigate();
// //   const [searchParams] = useSearchParams();
// //   const token = searchParams.get("token");

// //   const [newPassword, setNewPassword] = useState("");
// //   const [confirmPassword, setConfirmPassword] = useState("");
// //   const [error, setError] = useState("");
// //   const [success, setSuccess] = useState("");
// //   const [loading, setLoading] = useState(false);

// //   const handleSubmit = async (e) => {
// //     e.preventDefault();
// //     setError("");
// //     setSuccess("");

// //     if (!token) {
// //       setError("Missing or invalid reset token in URL.");
// //       return;
// //     }

// //     if (!newPassword || !confirmPassword) {
// //       setError("Please fill in all fields.");
// //       return;
// //     }

// //     if (newPassword !== confirmPassword) {
// //       setError("Passwords do not match.");
// //       return;
// //     }

// //     setLoading(true);
// //     try {
// //       const response = await superAdminResetPassword(token, newPassword, confirmPassword);
// //       setSuccess(response.message || "Password reset successfully. Please log in.");
// //     } catch (err) {
// //       setError(
// //         err.response?.data?.Message ||
// //         err.response?.data?.message ||
// //         "Unable to reset password. The link may have expired."
// //       );
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   return (
// //     <div className="cfp-container">
// //       <form className="login-card cfp-card" onSubmit={handleSubmit} noValidate>
// //         <h1>Reset Password</h1>
// //         <p>Enter your new password below to complete the recovery process.</p>

// //         <div className="lc-field mb-3">
// //           <input
// //             type="password"
// //             className="lc-input form-control"
// //             placeholder="New Password"
// //             value={newPassword}
// //             onChange={(e) => setNewPassword(e.target.value)}
// //             required
// //           />
// //         </div>

// //         <div className="lc-field mb-3">
// //           <input
// //             type="password"
// //             className="lc-input form-control"
// //             placeholder="Confirm New Password"
// //             value={confirmPassword}
// //             onChange={(e) => setConfirmPassword(e.target.value)}
// //             required
// //           />
// //         </div>

// //         {error && <div className="cfp-alert cfp-alert-error mb-3">{error}</div>}
// //         {success && <div className="cfp-alert cfp-alert-success mb-3">{success}</div>}

// //         <div className="submit-btn-wrapper">
// //           <button type="submit" className="submit-btn cfp-submit w-100" disabled={loading}>
// //             {loading ? "Updating..." : "Update Password"}
// //           </button>
// //         </div>

// //         <div className="cfp-back-wrap text-center mt-3">
// //           <button
// //             type="button"
// //             className="cfp-back btn btn-link text-decoration-none"
// //             onClick={() => navigate("/cpanel")}
// //           >
// //             &larr; Back to Login
// //           </button>
// //         </div>
// //       </form>
// //     </div>
// //   );
// // };

// // export default CResetPass;