import React, { useState } from 'react';
import { Ticket, Percent, Calendar, Layers, CheckCircle2, RotateCcw, ChevronDown, Check } from 'lucide-react';
import './PromoCode.css';
import PromoCodeTable from './PromoCodeTable';

const CPromoCode = () => {
  const [formData, setFormData] = useState({
    promoCode: '',
    promoType: 'Single',
    discount: '',
    plan: '',
    validityStart: '',
    expireDate: '',
  });

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const plans = [
    ' All Plans ',
    'Event Plan - 6 Week/s',
    'Event Plan - 2 Month/s',
    'Event Plan - 3 Month/s',
    'Event Plan - 4 Month/s',
    'Certificate / Card Plan - 1 Month/s',
    'Certificate / Card Plan - 3 Month/s',
    'Certificate / Card Plan - 1 Year/s',
    'Event + Certificate / Card Plan - 6 Week/s',
    'Event + Certificate / Card Plan - 2 Month/s',
    'Event + Certificate / Card Plan - 3 Month/s',
    'Event + Certificate / Card Plan - 4 Month/s',
    'Event + Certificate / Card Plan - 6 Month/s',
    'Certificate / Card Plan - 2 Month/s',
    'Event + Certificate / Card Plan - 1 Year/s',
    'Download Certificate / Card Plan - 1 Month/s',
    'Download Certificate / Card Plan - 1 Year/s',
    'Event Plan - 6 Month/s',
    'Event Plan - 1 Year/s',
    'Download Certificate / Card Plan - 1 Week/s',
    'Event + Certificate / Card Plan - 1 Week/s',
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectPlan = (plan) => {
    setFormData((prev) => ({ ...prev, plan }));
    setIsDropdownOpen(false);
  };

  const handleReset = () => {
    setFormData({
      promoCode: '',
      promoType: 'Single',
      discount: '',
      plan: '',
      validityStart: '',
      expireDate: '',
    });
    setIsDropdownOpen(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.plan) {
      alert('Please select a plan');
      return;
    }
    console.log('Submitted Data:', formData);
    alert('Promo code created successfully!');
  };

  return (
    <div className="promo-page-wrapper">
      {/* 1. Form Card Container */}
      <div className="promo-card-container">
        <div className="promo-card">
          {/* Header */}
          <div className="promo-header">
            <div className="icon-badge">
              <Ticket className="header-icon" />
            </div>
            <div>
              <h2 className="promo-title">Create Promo Code</h2>
              <p className="promo-subtitle">Configure discount settings and validity for your plans</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="promo-form">
            {/* Promo Code Input */}
            <div className="form-group full-width">
              <label htmlFor="promoCode" className="form-label">
                Promo Code <span className="required">*</span>
              </label>
              <div className="input-wrapper">
                <Ticket className="input-icon" />
                <input
                  type="text"
                  id="promoCode"
                  name="promoCode"
                  value={formData.promoCode}
                  onChange={handleChange}
                  placeholder="E.G. SUMMER2026"
                  className="form-input text-uppercase"
                  required
                />
              </div>
            </div>

            {/* Select Type */}
            <div className="form-group full-width">
              <label className="form-label">
                Select Type <span className="required">*</span>
              </label>
              <div className="custom-radio-group">
                <button
                  type="button"
                  className={`custom-radio-btn ${formData.promoType === 'Single' ? 'active' : ''}`}
                  onClick={() => setFormData({ ...formData, promoType: 'Single' })}
                >
                  <span className="radio-dot"></span>
                  <span>Single Use</span>
                </button>

                <button
                  type="button"
                  className={`custom-radio-btn ${formData.promoType === 'Multiple' ? 'active' : ''}`}
                  onClick={() => setFormData({ ...formData, promoType: 'Multiple' })}
                >
                  <span className="radio-dot"></span>
                  <span>Multiple Use</span>
                </button>
              </div>
            </div>

            {/* Discount Percentage */}
            <div className="form-group">
              <label htmlFor="discount" className="form-label">
                Discount (%) <span className="required">*</span>
              </label>
              <div className="input-wrapper">
                <Percent className="input-icon" />
                <input
                  type="number"
                  id="discount"
                  name="discount"
                  min="1"
                  max="100"
                  value={formData.discount}
                  onChange={handleChange}
                  placeholder="20"
                  className="form-input"
                  required
                />
              </div>
            </div>

            {/* Custom Dropdown */}
            <div className="form-group">
              <label className="form-label">
                Select for Event/Certificate <span className="required">*</span>
              </label>
              <div className="custom-dropdown-container">
                <button
                  type="button"
                  className="custom-dropdown-trigger"
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                >
                  <div className="trigger-text">
                    <Layers className="input-icon-static" />
                    <span className={formData.plan ? 'selected-text' : 'placeholder-text'}>
                      {formData.plan || '-- Select Plan --'}
                    </span>
                  </div>
                  <ChevronDown className={`chevron-icon ${isDropdownOpen ? 'open' : ''}`} />
                </button>

                {isDropdownOpen && (
                  <div className="custom-dropdown-menu">
                    {plans.map((item, idx) => (
                      <div
                        key={idx}
                        className={`dropdown-item ${formData.plan === item ? 'selected' : ''}`}
                        onClick={() => handleSelectPlan(item)}
                      >
                        <span>{item}</span>
                        {formData.plan === item && <Check size={16} className="text-teal" />}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Validity Start */}
            <div className="form-group">
              <label htmlFor="validityStart" className="form-label">
                Validity start from <span className="required">*</span>
              </label>
              <div className="input-wrapper">
                <Calendar className="input-icon" />
                <input
                  type="date"
                  id="validityStart"
                  name="validityStart"
                  value={formData.validityStart}
                  onChange={handleChange}
                  className="form-input date-input"
                  required
                />
              </div>
            </div>

            {/* Expire Date */}
            <div className="form-group">
              <label htmlFor="expireDate" className="form-label">
                Expire date <span className="required">*</span>
              </label>
              <div className="input-wrapper">
                <Calendar className="input-icon" />
                <input
                  type="date"
                  id="expireDate"
                  name="expireDate"
                  value={formData.expireDate}
                  onChange={handleChange}
                  className="form-input date-input"
                  required
                />
              </div>
            </div>

            {/* Form Actions */}
            <div className="form-actions full-width">
              <button type="button" className="btn-secondary" onClick={handleReset}>
                <RotateCcw size={16} />
                Reset
              </button>
              <button type="submit" className="btn-primary">
                <CheckCircle2 size={16} />
                Add Promo Code
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* 2. Promo Code Table rendered vertically underneath */}
      <PromoCodeTable />
    </div>
  );
};

export default CPromoCode;