import React, { useState, useRef, useEffect } from 'react';
import './AddDraft.css';
import DraftDetailsTable from './DraftDetailsTable';

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

export default function CAddDraft() {
  const [formData, setFormData] = useState({
    type: 'Certificate',
    categoryName: '',
    draftContent: ''
  });

  const [errors, setErrors] = useState({});
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

    if (editorRef.current) {
      editorRef.current.innerHTML = draftRow.details || '';
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
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
    setFormData({
      ...formData,
      type: e.target.value,
      categoryName: ''
    });
    setIsOpen(false);
    if (errors.type) setErrors({ ...errors, type: null });
  };

  const handleSelectCategory = (value) => {
    setFormData({ ...formData, categoryName: value });
    setIsOpen(false);
    if (errors.categoryName) setErrors({ ...errors, categoryName: null });
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

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      alert(`Draft submitted successfully!`);
      setIsSubmitting(false);
      setFormData({ type: 'Certificate', categoryName: '', draftContent: '' });
      if (editorRef.current) editorRef.current.innerHTML = '';
    }, 500);
  };

  const getCharCount = () => {
    if (!editorRef.current) return 0;
    return (editorRef.current.innerText || '').replace(/\r?\n|\r/g, '').length;
  };

  return (
    <div className="page-layout-container">
      {/* 1. COMPACT FORM CONTAINER */}
      <div className="add-draft-form-wrapper">
        <div className="add-draft-card">
          <div className="add-draft-header">
            <h2>Add Draft</h2>
          </div>

          <form onSubmit={handleSubmit} className="draft-form">
            {/* 1. Select Type */}
            <div className="form-section">
              <label className="section-label">
                1. Select Type <span className="required-star">*</span>
              </label>
              <div className="radio-options-grid">
                {['Certificate', 'Greeting', 'Invitation'].map((item) => (
                  <label key={item} className="radio-option">
                    <input
                      type="radio"
                      name="type"
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

            {/* 2. Custom Category Dropdown */}
            <div className="form-section">
              <label className="section-label">
                2. Select Category <span className="required-star">*</span>
              </label>

              <div className="custom-select-container" ref={dropdownRef}>
                <div 
                  className={`custom-select-header ${errors.categoryName ? 'has-error' : ''}`}
                  onClick={() => setIsOpen(!isOpen)}
                >
                  <span>{formData.categoryName || '-- Select Category --'}</span>
                  <span className={`chevron ${isOpen ? 'open' : ''}`}>▼</span>
                </div>

                {isOpen && (
                  <div className="custom-select-menu">
                    {CATEGORY_OPTIONS[formData.type]?.map((group, groupIdx) => (
                      <div key={groupIdx} className="select-group">
                        <div className="select-group-header">{group.label}</div>
                        {group.options.map((option, optIdx) => (
                          <div
                            key={optIdx}
                            className={`select-option ${formData.categoryName === option ? 'selected' : ''}`}
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

              {errors.categoryName && (
                <span className="error-text">{errors.categoryName}</span>
              )}
            </div>

            {/* 3. Category Draft Content */}
            <div className="form-section">
              <label htmlFor="draftContent" className="section-label">
                3. Category Draft Content <span className="required-star">*</span>
              </label>

              <div className="editor-shell">
                <div className="editor-toolbar">
                  <div className="toolbar-btn-group">
                    <button type="button" className="toolbar-btn" onClick={() => formatText('bold')}><b>B</b></button>
                    <button type="button" className="toolbar-btn" onClick={() => formatText('italic')}><i>I</i></button>
                    <button type="button" className="toolbar-btn" onClick={() => formatText('underline')}><u>U</u></button>
                  </div>

                  <span className="toolbar-divider" />

                  <div className="toolbar-btn-group">
                    <button type="button" className="toolbar-btn" onClick={() => formatText('justifyLeft')}>≡</button>
                    <button type="button" className="toolbar-btn" onClick={() => formatText('justifyCenter')}>≡</button>
                    <button type="button" className="toolbar-btn" onClick={() => formatText('justifyRight')}>≡</button>
                  </div>

                  <span className="toolbar-divider" />

                  <div className="toolbar-btn-group">
                    <button type="button" className="toolbar-btn" onClick={() => formatText('undo')}>↶</button>
                    <button type="button" className="toolbar-btn" onClick={() => formatText('redo')}>↷</button>
                  </div>

                  <span className="toolbar-divider" />

                  <select 
                    className="toolbar-select" 
                    aria-label="Font family"
                    onChange={(e) => formatText('fontName', e.target.value)}
                  >
                    <option value="Arial">Arial</option>
                    <option value="Times New Roman">Times New Roman</option>
                    <option value="Courier New">Monospace</option>
                  </select>

                  <select 
                    className="toolbar-select" 
                    aria-label="Font size"
                    onChange={(e) => formatText('fontSize', e.target.value)}
                  >
                    <option value="3">Normal</option>
                    <option value="5">Heading 1</option>
                    <option value="4">Heading 2</option>
                  </select>
                </div>

                <div className="editor-subtoolbar">
                  <label className="color-btn-wrapper">
                    <span className="underline-color">A</span>
                    <input 
                      type="color" 
                      className="color-input" 
                      onChange={(e) => formatText('foreColor', e.target.value)} 
                    />
                    <span className="small-arrow">▼</span>
                  </label>
                </div>

                <div
                  ref={editorRef}
                  className="editor-editable-area"
                  contentEditable
                  onInput={handleContentInput}
                  data-placeholder="Type rich text content for this category..."
                />
              </div>

              <div className="char-counter">
                {getCharCount()} / {MAX_CHARS} characters
              </div>
            </div>

            <div className="form-actions">
              <button type="submit" className="submit-btn" disabled={isSubmitting}>
                {isSubmitting ? 'Submitting...' : 'Submit'}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* 2. EXPANDED TABLE CONTAINER */}
      <div className="draft-table-wrapper">
        <DraftDetailsTable onEditDraft={handleEditDraft} />
      </div>
    </div>
  );
}