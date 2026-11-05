import React, { useCallback, useEffect, useRef, useState } from 'react';
import { FileText, Check, Layers, Image as ImageIcon, Type, MessageSquare, Hash, Shield, RotateCcw, Send } from 'lucide-react';
import './AddTemplates.css';
import AddTemplateTable from './AddTemplateTable';
import { TEMPLATE_TYPES, SEND_TYPES } from './templateOptions';
import { createTemplate, getTemplates } from '../../../api/superAdminService.js'; // adjust path if needed

// Replace with a real admins API later; value is sent as templateAdminId
const ADMINS = [
  { value: 1, label: 'Admin 1' },
  { value: 2, label: 'Admin 2' },
  { value: 3, label: 'Admin 3' },
];

const MAX_PARAMS = 20;

const emptyForm = {
  templateType: '',
  mediaType: '',
  templateName: '',
  message: '',
  withUserName: false,
  noOfParameters: '',
  selectedAdmin: '',
};

// returns an error string, or "" when valid
const validateParams = (value) => {
  if (value === '' || value === null || value === undefined) return 'No. of parameters is required.';
  if (!/^\d+$/.test(value)) return 'Only whole numbers are allowed.';
  if (Number(value) > MAX_PARAMS) return `Maximum ${MAX_PARAMS} parameters allowed.`;
  return '';
};

const getErrorMessage = (err, fallback) => {
  const data = err.response?.data;
  if (data?.errors && typeof data.errors === 'object') {
    const first = Object.values(data.errors).flat()[0];
    if (first) return first;
  }
  return data?.message || data?.title || err.message || fallback;
};

const CAddTemplates = () => {
  const [formData, setFormData] = useState(emptyForm);
  const [paramError, setParamError] = useState('');
  const [templates, setTemplates] = useState([]);
  const [listLoading, setListLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const cardRef = useRef(null);

  /* ---------- GET ---------- */
  const loadTemplates = useCallback(async () => {
    try {
      const list = await getTemplates();
      setTemplates(list);
    } catch (err) {
      console.error('Load Templates Error:', err, err.response?.data);
      setError(getErrorMessage(err, 'Failed to load templates.'));
    } finally {
      setListLoading(false);
    }
  }, []);

  useEffect(() => {
    loadTemplates();
  }, [loadTemplates]);

  // bring the form top (and its message) into view whenever a message appears
  useEffect(() => {
    if (!message && !error) return;
    cardRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, [message, error]);

  // hide the success message after 6 seconds
  useEffect(() => {
    if (!message) return;
    const t = setTimeout(() => setMessage(''), 6000);
    return () => clearTimeout(t);
  }, [message]);

  /* ---------- form ---------- */
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  // digits only, max 2 characters
  const handleParamsChange = (e) => {
    const digits = e.target.value.replace(/\D/g, '').slice(0, 2);
    setFormData((prev) => ({ ...prev, noOfParameters: digits }));
    setParamError(digits === '' ? '' : validateParams(digits));
  };

  // block characters like e, +, -, . that some browsers allow
  const blockNonDigitKeys = (e) => {
    const allowed = ['Backspace', 'Delete', 'Tab', 'Enter', 'ArrowLeft', 'ArrowRight', 'Home', 'End'];
    if (allowed.includes(e.key) || e.ctrlKey || e.metaKey) return;
    if (!/^\d$/.test(e.key)) e.preventDefault();
  };

  const handleReset = () => {
    setFormData(emptyForm);
    setParamError('');
    setMessage('');
    setError('');
  };

  /* ---------- POST ---------- */
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (submitting) return;

    setMessage('');
    setError('');

    const pErr = validateParams(formData.noOfParameters);
    if (pErr) {
      setParamError(pErr);
      document.getElementById('noOfParameters')?.focus();
      return;
    }

    setSubmitting(true);

    try {
      await createTemplate({
        templateType: formData.templateType,
        sendType: formData.mediaType,
        templateName: formData.templateName,
        message: formData.message,
        withUserName: formData.withUserName,
        noOfParameters: formData.noOfParameters,
        templateAdminId: formData.selectedAdmin,
      });

      setFormData(emptyForm);
      setParamError('');
      setMessage('Template submitted successfully!');

      await loadTemplates();
    } catch (err) {
      console.error('Add Template Error:', err, err.response?.data);
      setError(getErrorMessage(err, 'Failed to submit template.'));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="add-template-page-wrapper">
      <div className="at-card-container">
        <div className="at-card" ref={cardRef}>

          {/* Success / error message on top of the form */}
          {message && (
            <div className="alert alert-success d-flex align-items-center gap-2" role="alert">
              <Check size={18} strokeWidth={3} />
              <span>{message}</span>
            </div>
          )}
          {error && (
            <div className="alert alert-danger" role="alert">
              {error}
            </div>
          )}

          {/* Header Section */}
          <div className="at-header">
            <div className="at-icon-badge">
              <FileText className="header-icon" />
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
              <div className="at-input-wrapper">
                <Layers className="at-field-icon" size={18} />
                <select
                  id="templateType"
                  name="templateType"
                  className="at-form-input"
                  value={formData.templateType}
                  onChange={handleChange}
                  required
                >
                  <option value="">-- Select Type --</option>
                  {TEMPLATE_TYPES.map((t) => (
                    <option key={t.value} value={t.value}>{t.label}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Select Image/Video Type */}
            <div className="at-form-group">
              <label htmlFor="mediaType" className="at-form-label">
                Select Image/Video Type <span className="at-required">*</span>
              </label>
              <div className="at-input-wrapper">
                <ImageIcon className="at-field-icon" size={18} />
                <select
                  id="mediaType"
                  name="mediaType"
                  className="at-form-input"
                  value={formData.mediaType}
                  onChange={handleChange}
                  required
                >
                  <option value="">-- Select Type --</option>
                  {SEND_TYPES.map((t) => (
                    <option key={t.value} value={t.value}>{t.label}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Template Name */}
            <div className="at-form-group">
              <label htmlFor="templateName" className="at-form-label">
                Template Name <span className="at-required">*</span>
              </label>
              <div className="at-input-wrapper">
                <Type className="at-field-icon" size={18} />
                <input
                  type="text"
                  id="templateName"
                  name="templateName"
                  className="at-form-input"
                  placeholder="Enter Template Name"
                  value={formData.templateName}
                  onChange={handleChange}
                  maxLength={100}
                  required
                />
              </div>
            </div>

            {/* Message Textarea */}
            <div className="at-form-group">
              <label htmlFor="message" className="at-form-label">
                Message <span className="at-required">*</span>
              </label>
              <div className="at-input-wrapper textarea-wrapper">
                <MessageSquare className="at-field-icon textarea-icon" size={18} />
                <textarea
                  id="message"
                  name="message"
                  rows="4"
                  className="at-form-input at-form-textarea"
                  placeholder="Hello {{1}}, welcome to IT NetworkZ."
                  value={formData.message}
                  onChange={handleChange}
                  required
                ></textarea>
              </div>
            </div>

            {/* Checkbox: With UserName */}
            <div className="at-form-group at-checkbox-group">
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
                  <Check size={12} strokeWidth={3} />
                </span>
                <span className="at-checkbox-text">With UserName</span>
              </label>
            </div>

            {/* No of parameters: digits only, no arrows */}
            <div className="at-form-group">
              <label htmlFor="noOfParameters" className="at-form-label">
                No. of Parameters <span className="at-required">*</span>
              </label>
              <div className="at-input-wrapper">
                <Hash className="at-field-icon" size={18} />
                <input
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  id="noOfParameters"
                  name="noOfParameters"
                  className="at-form-input"
                  placeholder="e.g. 2"
                  value={formData.noOfParameters}
                  onChange={handleParamsChange}
                  onKeyDown={blockNonDigitKeys}
                  onBlur={() => setParamError(validateParams(formData.noOfParameters))}
                  maxLength={2}
                  autoComplete="off"
                  style={paramError ? { borderColor: '#dc3545' } : undefined}
                  required
                />
              </div>
              {paramError && (
                <small style={{ color: '#dc3545', display: 'block', marginTop: 4 }}>
                  {paramError}
                </small>
              )}
            </div>

            {/* Select Admin Dropdown */}
            <div className="at-form-group">
              <label htmlFor="selectedAdmin" className="at-form-label">
                Select Admin <span className="at-required">*</span>
              </label>
              <div className="at-input-wrapper">
                <Shield className="at-field-icon" size={18} />
                <select
                  id="selectedAdmin"
                  name="selectedAdmin"
                  className="at-form-input"
                  value={formData.selectedAdmin}
                  onChange={handleChange}
                  required
                >
                  <option value="">-- Select Admin --</option>
                  {ADMINS.map((a) => (
                    <option key={a.value} value={a.value}>{a.label}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="at-form-actions">
              <button
                type="button"
                onClick={handleReset}
                className="at-btn-secondary"
                disabled={submitting}
              >
                <RotateCcw size={16} style={{ marginRight: '6px', verticalAlign: 'middle' }} />
                Reset
              </button>
              <button type="submit" className="submit-btn" disabled={submitting}>
                <Send size={16} style={{ marginRight: '6px', verticalAlign: 'middle' }} />
                {submitting ? 'Saving...' : 'Submit'}
              </button>
            </div>

          </form>
        </div>
      </div>

      <AddTemplateTable templates={templates} loading={listLoading} />
    </div>
  );
};

export default CAddTemplates;