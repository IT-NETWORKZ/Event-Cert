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
import { useCanvas } from "../../../context/CanvasContext";


const BottomToolbar = () => {
  const excelRef = useRef(null);

  const { canvas, setCanvasSize } = useCanvas();

  const uploadExcel = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    console.log("Excel Uploaded :", file.name);
  };

  // Reset image size function that works with both designs and invitations
  const resetImageSize = () => {
    if (!canvas) return;

    // Search canvas for either the custom design layer flag or invitation template layer flag
    const image = canvas
      .getObjects()
      .find((obj) => obj.isDesignImage || obj.isInvitationImage);

    if (!image) return;

    const MAX_SIZE = 450;

    const ratio = image.originalWidth / image.originalHeight;

    let width;
    let height;

    if (ratio >= 1) {
      width = MAX_SIZE;
      height = MAX_SIZE / ratio;
    } else {
      height = MAX_SIZE;
      width = MAX_SIZE * ratio;
    }

    // Resize the Fabric canvas dimensions via context state
    setCanvasSize({
      width,
      height,
    });

    // Short timeout to let the canvas context resize complete before repositioning elements
    setTimeout(() => {
      image.set({
        left: 0,
        top: 0,
        scaleX: width / image.originalWidth,
        scaleY: height / image.originalHeight,
      });

      canvas.renderAll();
    }, 50);
  };

  return (
    <div className="cp-bottom-toolbar">
      <button className="cp-bottom-btn" onClick={resetImageSize}>
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