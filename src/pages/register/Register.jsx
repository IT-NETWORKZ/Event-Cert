import React, { useState } from 'react';
import './Register.css';

// Importing assets
import logo from '../../assets/img/logo_EventCert.png'; 

const Register = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    mobileNo: '',
    emailId: '',
    otp: ['', '', '', '', '', '']
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleOtpChange = (element, index) => {
    if (isNaN(element.value)) return false;

    let newOtp = [...formData.otp];
    newOtp[index] = element.value;
    setFormData({ ...formData, otp: newOtp });

    if (element.nextSibling && element.value) {
      element.nextSibling.focus();
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Registration Submit:", formData);
  };

  return (
    <div className="register-screen-bg">
      {/* Background Overlay to ensure readability over the certificate image */}
      <div className="bg-dark-overlay"></div>
      
      {/* Centered, Smaller Form Card */}
      <div className="register-form-card">
        <div className="magenta-top-bar"></div>
        
        <div className="register-logo-wrap">
          <img src={logo} alt="EventCert Logo" className="register-main-logo" />
        </div>

        <h2 className="register-card-title">Registration</h2>
        <p className="register-card-subtitle">Register to continue your journey</p>

        <form onSubmit={handleSubmit} className="register-actual-form">
          <div className="register-field-group">
            <input 
              type="text" 
              name="fullName" 
              placeholder="Full Name" 
              value={formData.fullName}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="register-field-group">
            <input 
              type="tel" 
              name="mobileNo" 
              placeholder="Mobile No." 
              value={formData.mobileNo}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="register-radio-wrap">
            <label className="register-radio-label">
              <input type="radio" name="otpType" defaultChecked />
              <span className="register-custom-radio"></span>
              Email OTP
            </label>
          </div>

          <div className="register-inline-group">
            <input 
              type="email" 
              name="emailId" 
              placeholder="Email Id" 
              value={formData.emailId}
              onChange={handleInputChange}
              required
            />
            <button type="button" className="register-btn-send-otp">Send OTP</button>
          </div>

          <div className="register-otp-block">
            <label className="register-otp-label">Enter OTP</label>
            <div className="register-otp-grid">
              {formData.otp.map((data, index) => (
                <input
                  key={index}
                  type="text"
                  maxLength="1"
                  value={data}
                  onChange={(e) => handleOtpChange(e.target, index)}
                  onFocus={(e) => e.target.select()}
                />
              ))}
            </div>
          </div>

          <button type="submit" className="register-btn-submit">Register</button>
        </form>

        <p className="register-bottom-redirect">
          Already have an account? <a href="/login" className="register-login-link">Login</a>
        </p>
      </div>
    </div>
  );
};

export default Register;