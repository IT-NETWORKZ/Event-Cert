import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./Register.css";

import logo from "../../../assets/img/logo_EventCert.png";
import { Award, Mail, Heart, Eye, EyeOff, Send } from "lucide-react";

const initial = {
  prefix: "",
  firstName: "",
  lastName: "",
  email: "",
  otp: "",
  mobile: "",
  dob: "",
  designation: "",
  organization: "",
  department: "",
  city: "",
  password: "",
  confirm: "",
};

const Register = () => {
  const [form, setForm] = useState(initial);
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [timer, setTimer] = useState(0);
  const [error, setError] = useState("");

  // resend countdown
  useEffect(() => {
    if (timer <= 0) return;
    const id = setTimeout(() => setTimer((t) => t - 1), 1000);
    return () => clearTimeout(id);
  }, [timer]);

  const onChange = (e) => {
    const { name, value } = e.target;
    if ((name === "otp" || name === "mobile") && value && !/^\d+$/.test(value)) return;
    setForm((p) => ({ ...p, [name]: value }));
    setError("");
  };

  const sendOtp = () => {
    if (!form.email) return setError("Please enter your email first.");
    // TODO: call your send-OTP API here
    setOtpSent(true);
    setTimer(30);
    setError("");
  };

  const onSubmit = (e) => {
    e.preventDefault();
    if (!otpSent) return setError("Please verify your email with the OTP.");
    if (form.password.length < 6) return setError("Password must be at least 6 characters long.");
    if (!/[0-9]/.test(form.password) || !/[a-z]/.test(form.password) || !/[A-Z]/.test(form.password))
      return setError("Password needs numbers, uppercase and lowercase letters.");
    if (form.password !== form.confirm) return setError("Password and Confirm Password do not match.");
    // TODO: call your register API here
    console.log("Registration Submit:", form);
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

            {/* Row 1: prefix, first, last */}
            <div className="rg-field rg-s3 rg-m4">
              <select name="prefix" value={form.prefix} onChange={onChange} aria-label="Prefix">
                <option value="">Prefix</option>
                <option>Mr.</option>
                <option>Mrs.</option>
                <option>Ms.</option>
                <option>Dr.</option>
                <option>Prof.</option>
              </select>
            </div>
            <div className="rg-field rg-s5 rg-m4">
              <input name="firstName" value={form.firstName} onChange={onChange} placeholder="First Name *" aria-label="First name" />
            </div>
            <div className="rg-field rg-s4 rg-m4">
              <input name="lastName" value={form.lastName} onChange={onChange} placeholder="Last Name *" aria-label="Last name" />
            </div>

            {/* Row 2: email, send otp, otp */}
            <div className="rg-field rg-s5 rg-m12">
              <input type="email" name="email" value={form.email} onChange={onChange} placeholder="Email Id *" aria-label="Email" />
            </div>
            <div className="rg-field rg-s3 rg-m5">
              <button type="button" className="rg-otp-btn" onClick={sendOtp} disabled={timer > 0}>
                <Send size={14} />
                {timer > 0 ? `${timer}s` : otpSent ? "Resend" : "Send OTP"}
              </button>
            </div>
            <div className="rg-field rg-s4 rg-m7">
              <input name="otp" value={form.otp} onChange={onChange} placeholder="OTP *" maxLength={6} inputMode="numeric" aria-label="OTP" />
            </div>

            {/* Row 3: mobile, dob, designation */}
            <div className="rg-field rg-s4 rg-m6">
              <input type="tel" name="mobile" value={form.mobile} onChange={onChange} placeholder="Mobile No. *" maxLength={10} inputMode="numeric" aria-label="Mobile number" />
            </div>
            <div className="rg-field rg-s4 rg-m6">
              <input type="date" name="dob" value={form.dob} onChange={onChange} aria-label="Date of birth" className={form.dob ? "has-value" : ""} />
            </div>
            <div className="rg-field rg-s4 rg-m12">
              <input name="designation" value={form.designation} onChange={onChange} placeholder="Designation" aria-label="Designation" />
            </div>

            {/* Row 4 */}
            <div className="rg-field rg-s12 rg-m12">
              <input name="organization" value={form.organization} onChange={onChange} placeholder="Organization Name" aria-label="Organization name" />
            </div>

            {/* Row 5 */}
            <div className="rg-field rg-s6 rg-m6">
              <input name="department" value={form.department} onChange={onChange} placeholder="Department" aria-label="Department" />
            </div>
            <div className="rg-field rg-s6 rg-m6">
              <input name="city" value={form.city} onChange={onChange} placeholder="City *" aria-label="City" />
            </div>

            {/* Row 6: passwords */}
            <div className="rg-field rg-s6 rg-m12 rg-pass">
              <input type={showPass ? "text" : "password"} name="password" value={form.password} onChange={onChange} placeholder="Password *" aria-label="Password" />
              <button type="button" onClick={() => setShowPass((s) => !s)} aria-label="Show or hide password">
                {showPass ? <EyeOff size={17} /> : <Eye size={17} />}
              </button>
            </div>
            <div className="rg-field rg-s6 rg-m12 rg-pass">
              <input type={showConfirm ? "text" : "password"} name="confirm" value={form.confirm} onChange={onChange} placeholder="Confirm Password *" aria-label="Confirm password" />
              <button type="button" onClick={() => setShowConfirm((s) => !s)} aria-label="Show or hide confirm password">
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

            {error && <p className="rg-error rg-s12 rg-m12" role="alert">{error}</p>}

            <div className="rg-actions rg-s12 rg-m12">
              <button type="submit" className="rg-submit">Register</button>
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


// import React, { useState } from 'react';
// import './Register.css';

// // Importing assets
// import logo from '../../../assets/img/logo_EventCert.png'; 

// const Register = () => {
//   const [formData, setFormData] = useState({
//     fullName: '',
//     mobileNo: '',
//     emailId: '',
//     otp: ['', '', '', '', '', '']
//   });

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData({ ...formData, [name]: value });
//   };

//   const handleOtpChange = (element, index) => {
//     if (isNaN(element.value)) return false;

//     let newOtp = [...formData.otp];
//     newOtp[index] = element.value;
//     setFormData({ ...formData, otp: newOtp });

//     if (element.nextSibling && element.value) {
//       element.nextSibling.focus();
//     }
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     console.log("Registration Submit:", formData);
//   };

//   return (
//     <div className="register-screen-bg">
//       {/* Background Overlay to ensure readability over the certificate image */}
//       <div className="bg-dark-overlay"></div>
      
//       {/* Centered, Smaller Form Card */}
//       <div className="register-form-card">
//         <div className="magenta-top-bar"></div>
        
//         <div className="register-logo-wrap">
//           <img src={logo} alt="EventCert Logo" className="register-main-logo" />
//         </div>

//         <h2 className="register-card-title">Registration</h2>
//         <p className="register-card-subtitle">Register to continue your journey</p>

//         <form onSubmit={handleSubmit} className="register-actual-form">
//           <div className="register-field-group">
//             <input 
//               type="text" 
//               name="fullName" 
//               placeholder="Full Name" 
//               value={formData.fullName}
//               onChange={handleInputChange}
//               required
//             />
//           </div>

//           <div className="register-field-group">
//             <input 
//               type="tel" 
//               name="mobileNo" 
//               placeholder="Mobile No." 
//               value={formData.mobileNo}
//               onChange={handleInputChange}
//               required
//             />
//           </div>

//           <div className="register-radio-wrap">
//             <label className="register-radio-label">
//               <input type="radio" name="otpType" defaultChecked />
//               <span className="register-custom-radio"></span>
//               Email OTP
//             </label>

//              <label className="register-radio-label">
//               <input type="radio" name="otpType"/>
//               <span className="register-custom-radio"></span>
//               Mobile OTP
//             </label>
//           </div>

          

//           <div className="register-inline-group">
//             <input 
//               type="email" 
//               name="emailId" 
//               placeholder="Email Id" 
//               value={formData.emailId}
//               onChange={handleInputChange}
//               required
//             />
//             <button type="button" className="register-btn-send-otp">Send OTP</button>
//           </div>

//           <div className="register-otp-block">
//             <label className="register-otp-label">Enter OTP</label>
//             <div className="register-otp-grid">
//               {formData.otp.map((data, index) => (
//                 <input
//                   key={index}
//                   type="text"
//                   maxLength="1"
//                   value={data}
//                   onChange={(e) => handleOtpChange(e.target, index)}
//                   onFocus={(e) => e.target.select()}
//                 />
//               ))}
//             </div>
//           </div>

//           <button type="submit" className="register-btn-submit">Register</button>
//         </form>

//         <p className="register-bottom-redirect">
//           Already have an account? <a href="/" className="register-login-link">Login</a>
//         </p>
//       </div>
//     </div>
//   );
// };

// export default Register;