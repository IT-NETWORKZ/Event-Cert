import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./Register.css";

import logo from "../../../assets/img/logo_EventCert.png";
import { Award, Mail, Heart, Eye, EyeOff } from "lucide-react";
import { useAuth } from "../../../context/AuthContext";

const initial = {
  firstName: "",
  lastName: "",
  email: "",
  mobile: "",
  password: "",
  confirm: "",
};

// Pull a readable message out of the different error shapes the API can return
const getApiError = (err) => {
  if (!err.response) {
    return "Cannot reach the server. Check that the API is running.";
  }
  const data = err.response.data;

  if (data?.message) return data.message;

  // ASP.NET automatic validation: { errors: { Field: ["msg"] } }
  if (data?.errors) {
    const first = Object.values(data.errors).flat()[0];
    if (first) return first;
  }

  return data?.title || `Registration failed (status ${err.response.status}).`;
};

const Register = () => {
  const { register } = useAuth();

  const [form, setForm] = useState(initial);
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const onChange = (e) => {
    const { name, value } = e.target;
    if (name === "mobile" && value && !/^\d+$/.test(value)) return;
    setForm((p) => ({ ...p, [name]: value }));
    setError("");
    setSuccess("");
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setSuccess("");

    if (!form.firstName.trim() || !form.lastName.trim())
      return setError("Please enter your first and last name.");
    if (!form.email.trim()) return setError("Please enter your email.");
    if (!/^\d{10}$/.test(form.mobile))
      return setError("Please enter a valid 10-digit mobile number.");
    if (form.password.length < 6)
      return setError("Password must be at least 6 characters long.");
    if (
      !/[0-9]/.test(form.password) ||
      !/[a-z]/.test(form.password) ||
      !/[A-Z]/.test(form.password)
    )
      return setError("Password needs numbers, uppercase and lowercase letters.");
    if (form.password !== form.confirm)
      return setError("Password and Confirm Password do not match.");

    setLoading(true);
    setError("");

    try {
      await register({
        fullName: `${form.firstName.trim()} ${form.lastName.trim()}`,
        email: form.email.trim(),
        phoneNumber: form.mobile,
        password: form.password,
        confirmPassword: form.confirm,
      });

      // Account created. Clear the form and show the message, no redirect.
      setForm(initial);
      setShowPass(false);
      setShowConfirm(false);
      setSuccess("Registered successfully! Please login to continue.");
    } catch (err) {
      setError(getApiError(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rg-screen">
      <div className="rg-card">
        {/* ================= LEFT PANEL ================= */}
        <aside className="rg-side">
          <span className="rg-circle c1"></span>
          <span className="rg-circle c2"></span>

          <img src={logo} alt="EventCert" className="rg-logo" />

          <div className="rg-tiles">
            <div className="rg-tile">
              <Award size={22} />
              <strong>Send E-Certificates</strong>
              <span>to many with name</span>
            </div>
            <div className="rg-tile">
              <Mail size={22} />
              <strong>Send E-Invitations</strong>
              <span>to many with name</span>
            </div>
            <div className="rg-tile">
              <Heart size={22} />
              <strong>Send E-Greetings</strong>
              <span>to many with name</span>
            </div>
          </div>

          <h2 className="rg-side-title">Admin Registration</h2>
        </aside>

        {/* ================= FORM ================= */}
        <section className="rg-main">
          <form onSubmit={onSubmit} className="rg-form" noValidate>
            {/* Heading */}
            <div className="rg-heading rg-s12 rg-m12">
              <h2>Create Your Account</h2>
              <p>Register to start sending certificates, invitations and greetings</p>
              <span className="rg-heading-line"></span>
            </div>

            {/* Row 1: first name, last name */}
            <div className="rg-field rg-s6 rg-m12">
              <input
                name="firstName"
                value={form.firstName}
                onChange={onChange}
                placeholder="First Name *"
                aria-label="First name"
                autoComplete="given-name"
              />
            </div>
            <div className="rg-field rg-s6 rg-m12">
              <input
                name="lastName"
                value={form.lastName}
                onChange={onChange}
                placeholder="Last Name *"
                aria-label="Last name"
                autoComplete="family-name"
              />
            </div>

            {/* Row 2: email, mobile */}
            <div className="rg-field rg-s6 rg-m12">
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={onChange}
                placeholder="Email Id *"
                aria-label="Email"
                autoComplete="email"
              />
            </div>
            <div className="rg-field rg-s6 rg-m12">
              <input
                type="tel"
                name="mobile"
                value={form.mobile}
                onChange={onChange}
                placeholder="Mobile No. *"
                maxLength={10}
                inputMode="numeric"
                aria-label="Mobile number"
                autoComplete="tel"
              />
            </div>

            {/* Row 3: passwords */}
            <div className="rg-field rg-s6 rg-m12 rg-pass">
              <input
                type={showPass ? "text" : "password"}
                name="password"
                value={form.password}
                onChange={onChange}
                placeholder="Password *"
                aria-label="Password"
                autoComplete="new-password"
              />
              <button
                type="button"
                onClick={() => setShowPass((s) => !s)}
                aria-label="Show or hide password"
              >
                {showPass ? <EyeOff size={17} /> : <Eye size={17} />}
              </button>
            </div>
            <div className="rg-field rg-s6 rg-m12 rg-pass">
              <input
                type={showConfirm ? "text" : "password"}
                name="confirm"
                value={form.confirm}
                onChange={onChange}
                placeholder="Confirm Password *"
                aria-label="Confirm password"
                autoComplete="new-password"
              />
              <button
                type="button"
                onClick={() => setShowConfirm((s) => !s)}
                aria-label="Show or hide confirm password"
              >
                {showConfirm ? <EyeOff size={17} /> : <Eye size={17} />}
              </button>
            </div>

            {/* Instructions */}
            <div className="rg-note rg-s12 rg-m12">
              <b>Password Instruction:</b>
              <ul>
                <li>At least 6 characters long.</li>
                <li>A mix of numbers, uppercase and lowercase letters.</li>
              </ul>
            </div>

            {error && (
              <p className="rg-error rg-s12 rg-m12" role="alert">
                {error}
              </p>
            )}

            {success && (
              <p className="rg-success rg-s12 rg-m12" role="status">
                {success}
              </p>
            )}

            <div className="rg-actions rg-s12 rg-m12">
              <button type="submit" className="rg-submit" disabled={loading}>
                {loading ? "Registering..." : "Register"}
              </button>
              <p className="rg-login">
                Already have an Account? <Link to="/">Login Now</Link>
              </p>
            </div>
          </form>
        </section>
      </div>
    </div>
  );
};

export default Register;