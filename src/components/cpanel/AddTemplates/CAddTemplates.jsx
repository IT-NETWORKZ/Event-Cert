import React, { useState } from 'react';
import './AddTemplates.css';
import AddTemplateTable from './AddTemplateTable';

// Simple SVG Icons
const FileTextIcon = () => (
  <svg className="header-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
  </svg>
);

const CheckIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12"></polyline>
  </svg>
);

const AddTemplates = () => {
  const [formData, setFormData] = useState({
    templateType: '',
    mediaType: '',
    templateName: '',
    message: '',
    withUserName: false,
    noOfParameters: '',
    selectedAdmin: '',
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form Submitted:', formData);
  };

  const handleReset = () => {
    setFormData({
      templateType: '',
      mediaType: '',
      templateName: '',
      message: '',
      withUserName: false,
      noOfParameters: '',
      selectedAdmin: '',
    });
  };

  return (
    <div className="add-template-page-wrapper">
      <div className="at-card-container">
        <div className="at-card">
          
          {/* Header Section */}
          <div className="at-header">
            <div className="at-icon-badge">
              <FileTextIcon />
            </div>
            <div>
              <h2 className="at-title">Add New Template</h2>
              <p className="at-subtitle">Configure message template parameters and attributes</p>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="at-form">
            
            {/* Select Template Type */}
            <div className="at-form-group">
              <label htmlFor="templateType" className="at-form-label">
                Select Template Type <span className="at-required">*</span>
              </label>
              <select
                id="templateType"
                name="templateType"
                className="at-form-input"
                value={formData.templateType}
                onChange={handleChange}
                required
              >
                <option value="">-- Select Type --</option>
                <option value="Utility">Utility</option>
                <option value="Marketing">Marketing</option>
              </select>
            </div>

            {/* Select Image/Video Type */}
            <div className="at-form-group">
              <label htmlFor="mediaType" className="at-form-label">
                Select Image/Video Type <span className="at-required">*</span>
              </label>
              <select
                id="mediaType"
                name="mediaType"
                className="at-form-input"
                value={formData.mediaType}
                onChange={handleChange}
                required
              >
                <option value="">-- Select Type --</option>
                <option value="Only Text">Only Text</option>
                <option value="Text + Image">Text + Image</option>
                <option value="Text + Video">Text + Video</option>
                <option value="Text + Document">Text + Document</option>
                <option value="Text + Button + Image">Text + Button + Image</option>
                <option value="Text + Button + Video">Text + Button + Video</option>
              </select>
            </div>

            {/* Template Name */}
            <div className="at-form-group">
              <label htmlFor="templateName" className="at-form-label">
                Template Name <span className="at-required">*</span>
              </label>
              <input
                type="text"
                id="templateName"
                name="templateName"
                className="at-form-input"
                placeholder="Enter Template Name"
                value={formData.templateName}
                onChange={handleChange}
                required
              />
            </div>

            {/* Message Textarea */}
            <div className="at-form-group">
              <label htmlFor="message" className="at-form-label">
                Message <span className="at-required">*</span>
              </label>
              <textarea
                id="message"
                name="message"
                rows="4"
                className="at-form-input at-form-textarea"
                placeholder="Enter Template Message"
                value={formData.message}
                onChange={handleChange}
                required
              ></textarea>
            </div>

            {/* Checkbox: With UserName */}
            <div className="at-form-group">
              <label className="at-checkbox-label">
                <input
                  type="checkbox"
                  id="withUserName"
                  name="withUserName"
                  checked={formData.withUserName}
                  onChange={handleChange}
                  className="at-custom-checkbox-input"
                />
                <span className="at-checkbox-custom-box">
                  <CheckIcon />
                </span>
                <span className="at-checkbox-text">With UserName</span>
              </label>
            </div>

            {/* No of parameters */}
            <div className="at-form-group">
              <label htmlFor="noOfParameters" className="at-form-label">
                No. of Parameters <span className="at-required">*</span>
              </label>
              <input
                type="number"
                id="noOfParameters"
                name="noOfParameters"
                className="at-form-input"
                placeholder="e.g. 2"
                value={formData.noOfParameters}
                onChange={handleChange}
                required
              />
            </div>

            {/* Select Admin Dropdown */}
            <div className="at-form-group">
              <label htmlFor="selectedAdmin" className="at-form-label">
                Select Admin <span className="at-required">*</span>
              </label>
              <select
                id="selectedAdmin"
                name="selectedAdmin"
                className="at-form-input"
                value={formData.selectedAdmin}
                onChange={handleChange}
                required
              >
                <option value="">-- Select Admin --</option>
                <option value="admin1">Admin 1</option>
                <option value="admin2">Admin 2</option>
                <option value="admin3">Admin 3</option>
              </select>
            </div>

            {/* Action Buttons */}
            <div className="at-form-actions">
              <button type="button" onClick={handleReset} className="at-btn-secondary">
                Reset
              </button>
              <button type="submit" className="at-btn-primary">
                Submit
              </button>
            </div>

          </form>
        </div>
      </div>
      <AddTemplateTable />
    </div>
  );
};

export default AddTemplates;