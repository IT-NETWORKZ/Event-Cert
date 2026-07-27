import React, { useMemo, useState } from "react";
import DataTable from "../../components/common/Table/DataTable"; // Adjust path as needed
import "../../css/CFeedbackDetails.css";

const CFeedbackDetails = () => {
  // Sample Data with DIRECT image URLs
  const [feedbackData, setFeedbackData] = useState([
    {
      id: 1,
      srNo: 1,
      date: "10/07/2026",
      name: "Neha Saxena",
      rating: 3,
      image: "https://images.rawpixel.com/image_800/cHJpdmF0ZS9sci9pbWFnZXMvd2Vic2l0ZS8yMDI1LTAxL3Jhd3BpeGVsX29mZmljZV8zM19waG90b19yZWFsX2luZGlhbl9idXNpbmVzc193b21hbl90aGVfaW1hZ2VfaV85Y2E0ZTUwYy02Yzg4LTQwNTYtODg5Mi1kYTk0MDY2YTc4NDRfMi5qcGc.jpg", 
      description: "wdf jsjkdgfljggdjvdfh kd fhk",
      status: "Disabled",
    },
    {
      id: 2,
      srNo: 2,
      date: "22/06/2026",
      name: "Fdgdf",
      rating: 3,
      image: null,
      description: "rtertret",
      status: "Disabled",
    },
    {
      id: 3,
      srNo: 3,
      date: "22/06/2026",
      name: "Gjkdfg",
      rating: 5,
      image: null,
      description: "fgdgdfg",
      status: "Disabled",
    },
    {
      id: 4,
      srNo: 4,
      date: "22/06/2026",
      name: "Lkijuhyg",
      rating: 5,
      image: null,
      description: "oiuytghgf",
      status: "Disabled",
    },
  ]);

  // Toggle Status between Enabled/Disabled
  const handleStatusToggle = (id) => {
    setFeedbackData((prevData) =>
      prevData.map((item) =>
        item.id === id
          ? {
              ...item,
              status: item.status === "Enabled" ? "Disabled" : "Enabled",
            }
          : item
      )
    );
  };

  // Export to Excel handler
  const handleExportExcel = () => {
    console.log("Exporting feedback to Excel...");
  };

  // Helper function to render star ratings
  const renderStars = (rating) => {
    const totalStars = 5;
    return (
      <span className="star-rating">
        {"★".repeat(rating)}
        {"☆".repeat(totalStars - rating)}
      </span>
    );
  };

  // Columns definition
  const columns = useMemo(
    () => [
      {
        accessorKey: "srNo",
        header: "Sr. No.",
        meta: { className: "text-center", width: "80px" },
      },
      {
        accessorKey: "date",
        header: "Date",
        meta: { className: "text-center", width: "120px" },
      },
      {
        accessorKey: "name",
        header: "Name",
        meta: { className: "text-start", width: "160px" },
      },
      {
        accessorKey: "rating",
        header: "Rating",
        meta: { className: "text-center", width: "130px" },
        cell: (info) => renderStars(info.getValue()),
      },
      {
        accessorKey: "image",
        header: "Image",
        meta: { className: "text-center", width: "120px" },
        cell: (info) => {
          const imgUrl = info.getValue();
          return imgUrl ? (
            <img
              src={imgUrl}
              alt="Feedback Thumbnail"
              className="feedback-thumb"
              /* Fallback if URL breaks */
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "https://via.placeholder.com/50?text=No+Img";
              }}
            />
          ) : (
            <span className="no-photo-text">Photo</span>
          );
        },
      },
      {
        accessorKey: "description",
        header: "Description",
        meta: { className: "text-start", width: "auto" },
      },
      {
        accessorKey: "status",
        header: "Status",
        meta: { className: "text-center", width: "130px" },
        cell: (info) => {
          const status = info.getValue();
          const rowId = info.row.original.id;
          const isDisabled = status === "Disabled";

          return (
            <button
              type="button"
              className={`btn status-pill-btn ${
                isDisabled ? "btn-disabled" : "btn-enabled"
              }`}
              onClick={() => handleStatusToggle(rowId)}
            >
              {status}
            </button>
          );
        },
      },
    ],
    []
  );

  return (
    <div className="feedback-page-wrapper">
      <div className="card feedback-card border-0 shadow-sm">
        <div className="card-body p-4">
          <div className="text-center mb-4">
            <h2 className="feedback-title d-inline-block position-relative fw-bold">
              Feedback Details (Adv.)
            </h2>
          </div>

          <DataTable
            columns={columns}
            data={feedbackData}
            onExportExcel={handleExportExcel}
          />
        </div>
      </div>
    </div>
  );
};

export default CFeedbackDetails;