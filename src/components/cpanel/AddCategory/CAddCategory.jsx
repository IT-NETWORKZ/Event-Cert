import React, { useState, useMemo } from 'react';
import DataTable from '../../common/Table/DataTable'; // Adjust path to match your reusable DataTable component
import './AddCategory.css';
import Button from "../../common/button/Button"

const INITIAL_CATEGORY_DATA = [
  { id: 1, date: '20/07/2026', category: 'Certificate', name: 'Academic & Training' },
  { id: 2, date: '20/07/2026', category: 'Certificate', name: 'Corporate & Achievement' },
  { id: 3, date: '20/07/2026', category: 'Greeting', name: 'Festivals' },
  { id: 4, date: '20/07/2026', category: 'Invitation', name: 'Events & Conferences' },
];

export default function AddCategory() {
  const [formData, setFormData] = useState({
    type: 'Certificate',
    subCategory: '',
  });

  const [categoryList, setCategoryList] = useState(INITIAL_CATEGORY_DATA);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleTypeChange = (e) => {
    setFormData({ ...formData, type: e.target.value });
    if (errors.type) setErrors({ ...errors, type: null });
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, subCategory: e.target.value });
    if (errors.subCategory) setErrors({ ...errors, subCategory: null });
  };

  const handleEdit = (row) => {
    setFormData({
      type: row.category,
      subCategory: row.name,
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!formData.type) newErrors.type = 'Please select a type.';
    if (!formData.subCategory.trim()) newErrors.subCategory = 'Please enter a Sub Category.';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      const newEntry = {
        id: categoryList.length + 1,
        date: new Date().toLocaleDateString('en-GB'),
        category: formData.type,
        name: formData.subCategory.trim(),
      };

      setCategoryList([newEntry, ...categoryList]);
      alert('Category added successfully!');
      setIsSubmitting(false);
      setFormData({ type: 'Certificate', subCategory: '' });
    }, 400);
  };

  // Columns configuration matching the screenshot layout
  const columns = useMemo(
    () => [
      {
        header: 'Sr.No',
        accessorKey: 'srNo',
        meta: { width: '80px', className: 'text-center' },
        cell: (info) => info.row.index + 1,
      },
      {
        header: 'Date',
        accessorKey: 'date',
        meta: { width: '160px', className: 'text-center' },
      },
      {
        header: 'Category',
        accessorKey: 'category',
        meta: { width: '220px', className: 'text-center' },
      },
      {
        header: 'Name',
        accessorKey: 'name',
        meta: { width: '320px', className: 'text-start' },
      },
      {
        header: 'Edit',
        id: 'editAction',
        meta: { width: '100px', className: 'text-center' },
        cell: (info) => (
          <Button
            type="button"
            className="category-edit-btn"
            onClick={() => handleEdit(info.row.original)}
          >
            Edit
          </Button>
        ),
      },
    ],
    []
  );

  return (
    <div className="add-category-page-container">
      {/* Top Section: Form Card */}
      <div className="add-category-form-wrapper">
        <div className="add-category-card">
          <div className="category-header">
            <h2>Add Category</h2>
            <div className="yellow-underline" />
          </div>

          <form onSubmit={handleSubmit} className="category-form">
            {/* 1. Select Type */}
            <div className="category-form-group">
              <label className="category-label">
                Select Type <span className="required-star">*</span>
              </label>
              <div className="category-radio-group">
                {['Certificate', 'Greeting', 'Invitation'].map((item) => (
                  <label key={item} className="category-radio-option">
                    <input
                      type="radio"
                      name="categoryType"
                      value={item}
                      checked={formData.type === item}
                      onChange={handleTypeChange}
                    />
                    <span>{item}</span>
                  </label>
                ))}
              </div>
              {errors.type && <span className="error-text">{errors.type}</span>}
            </div>

            {/* 2. Sub Category Text Field */}
            <div className="category-form-group">
              <label htmlFor="subCategoryInput" className="category-label">
                Sub Category <span className="required-star">*</span>
              </label>
              <input
                id="subCategoryInput"
                type="text"
                className={`category-input ${errors.subCategory ? 'has-error' : ''}`}
                value={formData.subCategory}
                onChange={handleInputChange}
                placeholder=""
              />
              {errors.subCategory && (
                <span className="error-text">{errors.subCategory}</span>
              )}
            </div>

            {/* Submit Action */}
            <div className="category-form-actions">
              <Button
                type="submit"
                className="submit-btn"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Submitting...' : 'Submit'}
              </Button>
            </div>
          </form>
        </div>
      </div>

      {/* Bottom Section: Details Table Card */}
      <div className="category-table-wrapper">
        <div className="category-details-card">
          <div className="category-header">
            <h2>Details</h2>
            <div className="yellow-underline" />
          </div>

          <DataTable columns={columns} data={categoryList} />
        </div>
      </div>
    </div>
  );
}