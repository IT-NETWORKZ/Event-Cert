import React, { useRef } from "react";
import {
  FaExpandArrowsAlt,
  FaFileExcel,
  FaUpload,
  FaPlus,
  FaPaperPlane,
  FaFilePdf,
  FaHistory,
  FaChartBar,
  FaTimes,
} from "react-icons/fa";

const BottomToolbar = () => {
  const excelRef = useRef(null);

  const uploadExcel = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    console.log("Excel Uploaded :", file.name);
  };

  return (
    <div className="cp-bottom-toolbar">

      <button className="cp-bottom-btn">
        <FaExpandArrowsAlt />
        <span>Reset Image Size</span>
      </button>

      <button className="cp-bottom-btn">
        <FaFileExcel />
        <span>Sample Excel</span>
      </button>

      <button
        className="cp-bottom-btn"
        onClick={() => excelRef.current.click()}
      >
        <FaUpload />
        <span>Upload Excel</span>
      </button>

      <input
        hidden
        ref={excelRef}
        type="file"
        accept=".xlsx,.xls"
        onChange={uploadExcel}
      />

      <button className="cp-bottom-btn primary">
        <FaPlus />
        <span>Add</span>
      </button>


      <button className="cp-bottom-btn danger">
        <FaFilePdf />
        <span>Send PDF</span>
      </button>

      <button className="cp-bottom-btn">
        <FaHistory />
        <span>Past Records</span>
      </button>

      <button className="cp-bottom-btn">
        <FaChartBar />
        <span>Sent Status</span>
      </button>

      <button className="cp-bottom-btn close">
        <FaTimes />
      </button>

    </div>
  );
};

export default BottomToolbar;