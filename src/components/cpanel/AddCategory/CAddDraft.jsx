import React, { useState, useRef, useEffect } from 'react';
import './AddDraft.css';
import DraftDetailsTable from './DraftDetailsTable';
import Button from "../../common/button/Button";

const CATEGORY_OPTIONS = {
  Certificate: [
    { label: 'Academic & Training', options: ['Workshop Certificate', 'Course Completion', 'Webinar Attendance'] },
    { label: 'Corporate & Achievement', options: ['Employee of the Month', 'Excellence Award', 'Appreciation'] },
    { label: 'Events & Sports', options: ['Participation Certificate', 'Winner / Runner-Up'] }
  ],
  Greeting: [
    { label: 'Festivals', options: ['Diwali', 'New Year', 'Christmas', 'Eid'] },
    { label: 'Personal Milestones', options: ['Birthday', 'Anniversary', 'Congratulations'] },
    { label: 'Corporate Greetings', options: ['Welcome Onboard', 'Thank You'] }
  ],
  Invitation: [
    { label: 'Events & Conferences', options: ['Tech Summit', 'Product Launch', 'Seminar'] },
    { label: 'Celebrations', options: ['Annual Party', 'Gala Dinner', 'Award Night'] }
  ]
};

const emptyForm = { type: 'Certificate', categoryName: '', draftContent: '' };

export default function CAddDraft() {
  const [formData, setFormData] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const editorRef = useRef(null);
  const MAX_CHARS = 1000;
  
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const handleEditDraft = (draftRow) => {
    setFormData({
      type: draftRow.type,
      categoryName: draftRow.category,
      draftContent: draftRow.details,
    });
    setEditingId(draftRow.id || true);
    setErrors({});
    setMessage('');

    if (editorRef.current) {
      editorRef.current.innerHTML = draftRow.details || '';
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancel = () => {
    setFormData(emptyForm);
    setEditingId(null);
    setErrors({});
    setMessage('');
    if (editorRef.current) editorRef.current.innerHTML = '';
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleTypeChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      type: e.target.value,
      categoryName: ''
    }));
    setIsOpen(false);
    if (errors.type) setErrors((prev) => ({ ...prev, type: null }));
  };

  const handleSelectCategory = (value) => {
    setFormData((prev) => ({ ...prev, categoryName: value }));
    setIsOpen(false);
    if (errors.categoryName) setErrors((prev) => ({ ...prev, categoryName: null }));
  };

  const formatText = (command, value = null) => {
    document.execCommand(command, false, value);
    if (editorRef.current) {
      handleContentInput();
    }
  };

  const handleContentInput = () => {
    if (editorRef.current) {
      const text = editorRef.current.innerText || '';
      if (text.length <= MAX_CHARS) {
        setFormData((prev) => ({ ...prev, draftContent: editorRef.current.innerHTML }));
      } else {
        editorRef.current.innerText = text.substring(0, MAX_CHARS);
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!formData.type) newErrors.type = 'Please select a type.';
    if (!formData.categoryName.trim()) newErrors.categoryName = 'Please select a Category / Sub Category.';
    if (!formData.draftContent.trim() || formData.draftContent === '<br>') {
      newErrors.draftContent = 'Please enter draft content.';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setMessage(editingId ? 'Draft updated successfully.' : 'Draft added successfully.');
      setIsSubmitting(false);
      setFormData(emptyForm);
      setEditingId(null);
      if (editorRef.current) editorRef.current.innerHTML = '';
    }, 400);
  };

  const getCharCount = () => {
    if (!editorRef.current) return 0;
    return (editorRef.current.innerText || '').replace(/\r?\n|\r/g, '').length;
  };

  return (
    <div className="add-draft-page-container">
      {/* ================= FORM ================= */}
      <div className="ad-form-wrap">
        <div className="ad-card">
          <div className="ad-head">
            <h2>{editingId ? "Edit Draft" : "Add Draft"}</h2>
            <div className="ad-underline" />
          </div>

          <form onSubmit={handleSubmit} className="ad-form" noValidate>
            {/* 1. Select Type */}
            <div className="ad-group">
              <label className="ad-label">
                1. Select Type <span className="ad-req">*</span>
              </label>
              <div className="ad-radios">
                {['Certificate', 'Greeting', 'Invitation'].map((item) => (
                  <label key={item} className="ad-radio">
                    <input
                      type="radio"
                      name="draftType"
                      value={item}
                      checked={formData.type === item}
                      onChange={handleTypeChange}
                    />
                    <span>{item}</span>
                  </label>
                ))}
              </div>
              {errors.type && <span className="ad-error-text">{errors.type}</span>}
            </div>

            {/* 2. Custom Category Dropdown */}
            <div className="ad-group">
              <label className="ad-label">
                2. Select Category <span className="ad-req">*</span>
              </label>

              <div className="ad-custom-select-container" ref={dropdownRef}>
                <div 
                  className={`ad-custom-select-header ${errors.categoryName ? 'has-error' : ''}`}
                  onClick={() => setIsOpen(!isOpen)}
                >
                  <span>{formData.categoryName || '-- Select Category --'}</span>
                  <span className={`ad-chevron ${isOpen ? 'open' : ''}`}>▼</span>
                </div>

                {isOpen && (
                  <div className="ad-custom-select-menu">
                    {CATEGORY_OPTIONS[formData.type]?.map((group, groupIdx) => (
                      <div key={groupIdx} className="ad-select-group">
                        <div className="ad-select-group-header">{group.label}</div>
                        {group.options.map((option, optIdx) => (
                          <div
                            key={optIdx}
                            className={`ad-select-option ${formData.categoryName === option ? 'selected' : ''}`}
                            onClick={() => handleSelectCategory(option)}
                          >
                            {option}
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>
                )}
              </div>
              {errors.categoryName && <span className="ad-error-text">{errors.categoryName}</span>}
            </div>

            {/* 3. Category Draft Content */}
            <div className="ad-group">
              <label htmlFor="draftContent" className="ad-label">
                3. Category Draft Content <span className="ad-req">*</span>
              </label>

              <div className="ad-editor-shell">
                <div className="ad-editor-toolbar">
                  <div className="ad-toolbar-btn-group">
                    <button type="button" className="ad-toolbar-btn" onClick={() => formatText('bold')}><b>B</b></button>
                    <button type="button" className="ad-toolbar-btn" onClick={() => formatText('italic')}><i>I</i></button>
                    <button type="button" className="ad-toolbar-btn" onClick={() => formatText('underline')}><u>U</u></button>
                  </div>

                  <span className="ad-toolbar-divider" />

                  <div className="ad-toolbar-btn-group">
                    <button type="button" className="ad-toolbar-btn" onClick={() => formatText('justifyLeft')}>≡</button>
                    <button type="button" className="ad-toolbar-btn" onClick={() => formatText('justifyCenter')}>≡</button>
                    <button type="button" className="ad-toolbar-btn" onClick={() => formatText('justifyRight')}>≡</button>
                  </div>

                  <span className="ad-toolbar-divider" />

                  <div className="ad-toolbar-btn-group">
                    <button type="button" className="ad-toolbar-btn" onClick={() => formatText('undo')}>↶</button>
                    <button type="button" className="ad-toolbar-btn" onClick={() => formatText('redo')}>↷</button>
                  </div>

                  <span className="ad-toolbar-divider" />

                  <select 
                    className="ad-toolbar-select" 
                    aria-label="Font family"
                    onChange={(e) => formatText('fontName', e.target.value)}
                  >
                    <option value="Arial">Arial</option>
                    <option value="Times New Roman">Times New Roman</option>
                    <option value="Courier New">Monospace</option>
                  </select>

                  <select 
                    className="ad-toolbar-select" 
                    aria-label="Font size"
                    onChange={(e) => formatText('fontSize', e.target.value)}
                  >
                    <option value="3">Normal</option>
                    <option value="5">Heading 1</option>
                    <option value="4">Heading 2</option>
                  </select>
                </div>

                <div className="ad-editor-subtoolbar">
                  <label className="ad-color-btn-wrapper">
                    <span className="ad-underline-color">A</span>
                    <input 
                      type="color" 
                      className="ad-color-input" 
                      onChange={(e) => formatText('foreColor', e.target.value)} 
                    />
                    <span className="ad-small-arrow">▼</span>
                  </label>
                </div>

                <div
                  ref={editorRef}
                  className="ad-editor-editable-area"
                  contentEditable
                  onInput={handleContentInput}
                  data-placeholder="Type rich text content for this category..."
                />
              </div>

              <div className="ad-char-counter">
                {getCharCount()} / {MAX_CHARS} characters
              </div>
              {errors.draftContent && <span className="ad-error-text">{errors.draftContent}</span>}
            </div>

            {message && <p className="ad-success" role="status">{message}</p>}

            <div className="ad-actions">
              {editingId && (
                <Button type="button" className="ad-btn-cancel" onClick={handleCancel}>
                  Cancel
                </Button>
              )}
              <Button type="submit" className="ad-btn-submit" disabled={isSubmitting}>
                {isSubmitting ? 'Saving...' : editingId ? 'Update' : 'Submit'}
              </Button>
            </div>
          </form>
        </div>
      </div>

      {/* ================= TABLE ================= */}
      <div className="ad-table-wrap">
        <div className="ad-card ad-table-card">
          <div className="ad-head">
            <h2>Draft Details</h2>
            <div className="ad-underline" />
          </div>

          <div className="ad-scroll">
            <DraftDetailsTable onEditDraft={handleEditDraft} />
          </div>
        </div>
      </div>
    </div>
  );
}