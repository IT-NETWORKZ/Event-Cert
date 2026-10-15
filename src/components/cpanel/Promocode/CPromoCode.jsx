import React, { useState, useMemo } from 'react';
import {
  Ticket,
  Percent,
  Calendar,
  Layers,
  CheckCircle2,
  RotateCcw,
  ChevronDown,
  Check,
} from 'lucide-react';

import './PromoCode.css';
import Button from '../../common/button/Button';
import DataTable from '../../common/Table/DataTable';

const CPromoCode = () => {
  // 1. DataTable Columns
  const columns = useMemo(
    () => [
      {
        id: 'srNo',
        header: 'Sr No',
        accessorFn: (_, index) => index + 1,
        enableSorting: true,
        meta: {
          className: 'text-center',
          width: '80px',
        },
        cell: ({ row }) => row.index + 1,
      },
      {
        accessorKey: 'promoCode',
        header: 'Promo Code',
        enableSorting: true,
        meta: {
          className: 'text-start',
          width: '160px',
        },
      },
      {
        accessorKey: 'promoType',
        header: 'Promo Type',
        meta: {
          className: 'text-center',
          width: '140px',
        },
      },
      {
        accessorKey: 'discount',
        header: 'Discount',
        meta: {
          className: 'text-center',
          width: '120px',
        },
        cell: (info) => `${info.getValue()}%`,
      },
      {
        accessorKey: 'plan',
        header: 'Event / Certificate Plan',
        meta: {
          className: 'text-start',
          width: '260px',
        },
      },
      {
        accessorKey: 'validityStart',
        header: 'Valid From',
        meta: {
          className: 'text-center',
          width: '140px',
        },
      },
      {
        accessorKey: 'expireDate',
        header: 'Expire Date',
        meta: {
          className: 'text-center',
          width: '140px',
        },
      },
      {
        accessorKey: 'status',
        header: 'Status',
        meta: {
          className: 'text-center',
          width: '120px',
        },
        cell: ({ row }) => {
          const status = row.original.status || 'Active';

          return (
            <span className={`status-badge status-${status.toLowerCase()}`}>
              {status}
            </span>
          );
        },
      },
      {
        id: 'actions',
        header: 'Actions',
        meta: {
          className: 'text-center',
          width: '110px',
        },
        cell: ({ row }) => (
          <button
            type="button"
            className="btn btn-sm btn-outline-success px-3 py-1"
            style={{ borderRadius: '15px', fontSize: '12px' }}
            onClick={() =>
              alert(`Viewing promo code: ${row.original.promoCode}`)
            }
          >
            View
          </button>
        ),
      },
    ],
    []
  );

  // 2. Existing Mock Data Structure Preserved
  const data = useMemo(
    () => [
      {
        id: 1,
        promoCode: 'SUMMER2026',
        promoType: 'Single',
        discount: 20,
        plan: 'Event Plan - 6 Week/s',
        validityStart: '2026-07-01',
        expireDate: '2026-12-31',
        status: 'Active',
      },
      {
        id: 2,
        promoCode: 'WELCOME15',
        promoType: 'Multiple',
        discount: 15,
        plan: 'Event Plan - 2 Month/s',
        validityStart: '2026-07-05',
        expireDate: '2026-12-31',
        status: 'Active',
      },
      {
        id: 3,
        promoCode: 'CERT25',
        promoType: 'Multiple',
        discount: 25,
        plan: 'Certificate / Card Plan - 3 Month/s',
        validityStart: '2026-07-10',
        expireDate: '2026-11-30',
        status: 'Active',
      },
      {
        id: 4,
        promoCode: 'EVENT10',
        promoType: 'Single',
        discount: 10,
        plan: 'Event + Certificate / Card Plan - 6 Week/s',
        validityStart: '2026-07-12',
        expireDate: '2026-08-12',
        status: 'Expired',
      },
      {
        id: 5,
        promoCode: 'FESTIVE30',
        promoType: 'Multiple',
        discount: 30,
        plan: 'Event + Certificate / Card Plan - 1 Year/s',
        validityStart: '2026-07-15',
        expireDate: '2026-12-31',
        status: 'Active',
      },
    ],
    []
  );

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

  // 3. Export Handler
  const handleExportExcel = () => {
    console.log('Exporting promo code list to Excel...');
    alert('Exporting promo code data to Excel format!');
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
      {/* 1. Promo Code Form */}
      <div className="promo-card-container">
        <div className="promo-card">
          <div className="promo-header">
            <div className="icon-badge">
              <Ticket className="header-icon" />
            </div>

            <div>
              <h2 className="promo-title">Create Promo Code</h2>
              <p className="promo-subtitle">
                Configure discount settings and validity for your plans
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="promo-form">
            {/* Promo Code */}
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

            {/* Promo Type */}
            <div className="form-group full-width">
              <label className="form-label">
                Select Type <span className="required">*</span>
              </label>

              <div className="custom-radio-group">
                <Button
                  type="button"
                  className={`custom-radio-btn ${
                    formData.promoType === 'Single' ? 'active' : ''
                  }`}
                  onClick={() =>
                    setFormData({ ...formData, promoType: 'Single' })
                  }
                >
                  <span className="radio-dot" />
                  <span>Single Use</span>
                </Button>

                <Button
                  type="button"
                  className={`custom-radio-btn ${
                    formData.promoType === 'Multiple' ? 'active' : ''
                  }`}
                  onClick={() =>
                    setFormData({ ...formData, promoType: 'Multiple' })
                  }
                >
                  <span className="radio-dot" />
                  <span>Multiple Use</span>
                </Button>
              </div>
            </div>

            {/* Discount */}
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

            {/* Plan Dropdown */}
            <div className="form-group">
              <label className="form-label">
                Select for Event/Certificate{' '}
                <span className="required">*</span>
              </label>

              <div className="custom-dropdown-container">
                <Button
                  type="button"
                  className="custom-dropdown-trigger"
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                >
                  <div className="trigger-text">
                    <Layers className="input-icon-static" />

                    <span
                      className={
                        formData.plan ? 'selected-text' : 'placeholder-text'
                      }
                    >
                      {formData.plan || '-- Select Plan --'}
                    </span>
                  </div>

                  <ChevronDown
                    className={`chevron-icon ${
                      isDropdownOpen ? 'open' : ''
                    }`}
                  />
                </Button>

                {isDropdownOpen && (
                  <div className="custom-dropdown-menu">
                    {plans.map((item, idx) => (
                      <div
                        key={idx}
                        className={`dropdown-item ${
                          formData.plan === item ? 'selected' : ''
                        }`}
                        onClick={() => handleSelectPlan(item)}
                      >
                        <span>{item}</span>

                        {formData.plan === item && (
                          <Check size={16} className="text-teal" />
                        )}
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

            {/* Expiry Date */}
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
              <Button
                type="button"
                className="btn-secondary"
                onClick={handleReset}
              >
                <RotateCcw size={16} />
                Reset
              </Button>

              <Button type="submit" className="submit-btn">
                <CheckCircle2 size={16} />
                Add Promo Code
              </Button>
            </div>
          </form>
        </div>
      </div>

      {/* 2. Promo Code DataTable */}
      <div className="table-responsive-scroll-wrapper">
        <DataTable
          columns={columns}
          data={data}
          onExportExcel={handleExportExcel}
        />
      </div>
    </div>
  );
};

export default CPromoCode;