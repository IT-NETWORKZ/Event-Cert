import React, { useMemo, useState } from "react";
import DataTable from "../../common/Table/DataTable"; // Adjust path to match your reusable DataTable component
import "./AddCategory.css";
import Button from "../../common/button/Button";

const INITIAL_CATEGORY_DATA = [
  { id: 1, date: "20/07/2026", category: "Certificate", name: "Academic & Training" },
  { id: 2, date: "20/07/2026", category: "Certificate", name: "Corporate & Achievement" },
  { id: 3, date: "20/07/2026", category: "Greeting", name: "Festivals" },
  { id: 4, date: "20/07/2026", category: "Invitation", name: "Events & Conferences" },
];

const TYPES = ["Certificate", "Greeting", "Invitation"];
const emptyForm = { type: "Certificate", subCategory: "" };

export default function CAddCategory() {
  const [formData, setFormData] = useState(emptyForm);
  const [categoryList, setCategoryList] = useState(INITIAL_CATEGORY_DATA);
  const [editingId, setEditingId] = useState(null);
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleTypeChange = (e) => {
    setFormData((p) => ({ ...p, type: e.target.value }));
    setErrors((p) => ({ ...p, type: null }));
  };

  const handleInputChange = (e) => {
    setFormData((p) => ({ ...p, subCategory: e.target.value }));
    setErrors((p) => ({ ...p, subCategory: null }));
    setMessage("");
  };

  const handleEdit = (row) => {
    setFormData({ type: row.category, subCategory: row.name });
    setEditingId(row.id);
    setErrors({});
    setMessage("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleCancel = () => {
    setFormData(emptyForm);
    setEditingId(null);
    setErrors({});
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};
    if (!formData.type) newErrors.type = "Please select a type.";
    if (!formData.subCategory.trim()) newErrors.subCategory = "Please enter a Sub Category.";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsSubmitting(true);
    // TODO: call your add / update category API here
    setTimeout(() => {
      if (editingId) {
        setCategoryList((prev) =>
          prev.map((r) =>
            r.id === editingId
              ? { ...r, category: formData.type, name: formData.subCategory.trim() }
              : r
          )
        );
        setMessage("Category updated successfully.");
      } else {
        setCategoryList((prev) => [
          {
            id: Date.now(),
            date: new Date().toLocaleDateString("en-GB"),
            category: formData.type,
            name: formData.subCategory.trim(),
          },
          ...prev,
        ]);
        setMessage("Category added successfully.");
      }
      setIsSubmitting(false);
      setFormData(emptyForm);
      setEditingId(null);
    }, 400);
  };

  const columns = useMemo(
    () => [
      {
        header: "Sr.No",
        id: "srNo",
        enableSorting: false,
        cell: (info) => info.row.index + 1,
        meta: { width: "90px", className: "text-center" },
      },
      {
        header: "Date",
        accessorKey: "date",
        meta: { width: "160px", className: "text-center" },
      },
      {
        header: "Category",
        accessorKey: "category",
        meta: { width: "200px", className: "text-center" },
      },
      {
        header: "Name",
        accessorKey: "name",
        meta: { width: "320px", className: "text-start" },
      },
      {
        header: "Edit",
        id: "editAction",
        enableSorting: false,
        meta: { width: "120px", className: "text-center" },
        cell: (info) => (
          <button
            type="button"
            className="ac-edit"
            onClick={() => handleEdit(info.row.original)}
          >
            Edit
          </button>
        ),
      },
    ],
    []
  );

  return (
    <div className="add-category-page-container">
      {/* ================= FORM ================= */}
      <div className="ac-form-wrap">
        <div className="ac-card">
          <div className="ac-head">
            <h2>{editingId ? "Edit Category" : "Add Category"}</h2>
            <div className="ac-underline" />
          </div>

          <form onSubmit={handleSubmit} className="ac-form" noValidate>
            <div className="ac-group">
              <label className="ac-label">
                Select Type <span className="ac-req">*</span>
              </label>
              <div className="ac-radios">
                {TYPES.map((item) => (
                  <label key={item} className="ac-radio">
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
              {errors.type && <span className="ac-error-text">{errors.type}</span>}
            </div>

            <div className="ac-group">
              <label htmlFor="subCategoryInput" className="ac-label">
                Sub Category <span className="ac-req">*</span>
              </label>
              <input
                id="subCategoryInput"
                type="text"
                className={`ac-input ${errors.subCategory ? "has-error" : ""}`}
                value={formData.subCategory}
                onChange={handleInputChange}
              />
              {errors.subCategory && <span className="ac-error-text">{errors.subCategory}</span>}
            </div>

            {message && <p className="ac-success" role="status">{message}</p>}

            <div className="ac-actions">
              {editingId && (
                <Button type="button" className="ac-btn-cancel" onClick={handleCancel}>
                  Cancel
                </Button>
              )}
              <Button type="submit" className="ac-btn-submit" disabled={isSubmitting}>
                {isSubmitting ? "Saving..." : editingId ? "Update" : "Submit"}
              </Button>
            </div>
          </form>
        </div>
      </div>

      {/* ================= TABLE ================= */}
      <div className="ac-table-wrap">
        <div className="ac-card ac-table-card">
          <div className="ac-head">
            <h2>Details</h2>
            <div className="ac-underline" />
          </div>

          <div className="ac-scroll">
            <DataTable columns={columns} data={categoryList} />
          </div>
        </div>
      </div>
    </div>
  );
}