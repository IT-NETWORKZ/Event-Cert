import React, { useEffect, useState } from "react";
import { FaTimes } from "react-icons/fa";
import { useCanvas } from "../../../context/CanvasContext";
import "../../../css/PreviewModal.css";

const PreviewModal = ({ open, onClose }) => {
    const { pages, saveCurrentPageData } = useCanvas();

    const [selectedPage, setSelectedPage] = useState(0);

    useEffect(() => {
        if (open) {
            saveCurrentPageData();
            setSelectedPage(0);
        }
    }, [open, saveCurrentPageData]);

    if (!open) return null;

    return (
        <div className="cp-preview-overlay" onClick={onClose}>
            <div
                className="cp-preview-modal"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="cp-preview-header">
                    <h3>Project Preview</h3>

                    <button
                        className="cp-preview-close"
                        onClick={onClose}
                    >
                        <FaTimes />
                    </button>
                </div>

                <div className="cp-preview-body">

                    <div className="cp-preview-list">
                        {pages.map((page, index) => (
                            <div
                                key={page.id}
                                className={`cp-preview-card ${
                                    selectedPage === index ? "active" : ""
                                }`}
                                onClick={() => setSelectedPage(index)}
                            >
                                <p>Page {index + 1}</p>

                                {page.thumbnail ? (
                                    <img
                                        src={page.thumbnail}
                                        alt={`Page ${index + 1}`}
                                    />
                                ) : (
                                    <div className="cp-preview-empty">
                                        Blank Page
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>

                    <div className="cp-preview-view">
                        {pages[selectedPage]?.thumbnail ? (
                            <img
                                src={pages[selectedPage].thumbnail}
                                alt="Preview"
                                className="cp-preview-large"
                            />
                        ) : (
                            <div className="cp-preview-empty-large">
                                Blank Page
                            </div>
                        )}
                    </div>

                </div>
            </div>
        </div>
    );
};

export default PreviewModal;
