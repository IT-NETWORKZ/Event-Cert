import React, { useMemo, useState, useEffect } from "react";
import DataTable from "../../components/common/Table/DataTable";
import { getAllFeedback, updateFeedbackStatus } from "../../api/feedbackService";
import "../../css/CFeedbackDetails.css";

const CFeedbackDetails = () => {
  const [feedbackData, setFeedbackData] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch feedback data on component mount
  useEffect(() => {
    fetchFeedback();
  }, []);

  const fetchFeedback = async () => {
    try {
      setLoading(true);
      const response = await getAllFeedback();
      
      // Map backend response fields to table structure
      const formattedData = (response.feedback || []).map((item, index) => ({
        id: item.feedbackId,
        srNo: index + 1,
        date: item.date || "N/A", 
        name: item.userName,
        rating: item.rating,
        image: item.image || null, 
        description: item.description,
        status: item.nBit ? "Enabled" : "Disabled",
        nBit: item.nBit,
      }));

      setFeedbackData(formattedData);
    } catch (err) {
      console.error("Failed to fetch feedback details:", err);
    } finally {
      setLoading(false);
    }
  };

  // Toggle Status via API call and update state
  const handleStatusToggle = async (id, currentStatus, currentNBit) => {
    const newNBit = !currentNBit; // Flip the boolean value

    try {
      await updateFeedbackStatus(id, newNBit);

      // Update state locally on success
      setFeedbackData((prevData) =>
        prevData.map((item) =>
          item.id === id
            ? {
                ...item,
                status: newNBit ? "Enabled" : "Disabled",
                nBit: newNBit,
              }
            : item
        )
      );
    } catch (err) {
      console.error("Failed to update status:", err);
      alert(err.response?.data?.message || "Failed to update feedback status.");
    }
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
          const currentNBit = info.row.original.nBit;
          const isDisabled = status === "Disabled";

          return (
            <button
              type="button"
              className={`btn status-pill-btn ${
                isDisabled ? "btn-disabled" : "btn-enabled"
              }`}
              onClick={() => handleStatusToggle(rowId, status, currentNBit)}
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

          {loading ? (
            <div className="text-center py-5">
              <p>Loading feedback...</p>
            </div>
          ) : (
            <DataTable
              columns={columns}
              data={feedbackData}
              onExportExcel={handleExportExcel}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default CFeedbackDetails;

