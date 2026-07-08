import React, { useEffect } from "react";
import { FaTimes } from "react-icons/fa";
import { useCanvas } from "../../../context/CanvasContext";

const PreviewModal = ({ open, onClose }) => {
    const { pages, saveCurrentPageData } = useCanvas();

    useEffect(() => {
        if (open) saveCurrentPageData();
    }, [open, saveCurrentPageData]);

    if (!open) return null;

    return (
        <div style={styles.backdrop} onClick={onClose}>
            {/* Stops click propagation so clicking inside the modal doesn't close it */}
            <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
                
                {/* Header Section */}
                <div style={styles.header}>
                    <h3 style={{ margin: 0, fontSize: "18px", color: "#333" }}>Project Preview</h3>
                    <button onClick={onClose} style={styles.closeBtn}>
                        <FaTimes />
                    </button>
                </div>

                {/* Scrollable List of Pages */}
                <div style={styles.scrollBody}>
                    {pages.map((page, index) => (
                        <div key={page.id} style={styles.pageCard}>
                            <p style={styles.label}>Page {index + 1}</p>
                            {page.thumbnail ? (
                                <div style={styles.imageWrapper}>
                                    <img 
                                        src={page.thumbnail} 
                                        alt={`Page {index + 1}`} 
                                        style={styles.image} 
                                    />
                                </div>
                            ) : (
                                <div style={styles.empty}>Blank Page</div>
                            )}
                        </div>
                    ))}
                </div>

            </div>
        </div>
    );
};

const styles = {
    backdrop: {
        position: "fixed",
        top: 0, left: 0, right: 0, bottom: 0,
        backgroundColor: "rgba(0, 0, 0, 0.6)",
        zIndex: 2500,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
    },
    modal: {
        width: "90%",
        maxWidth: "650px",
        height: "80vh",
        backgroundColor: "#fff",
        borderRadius: "12px",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        boxShadow: "0px 10px 25px rgba(0,0,0,0.2)",
    },
    header: {
        padding: "16px 20px",
        borderBottom: "1px solid #eef2f6",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
    },
    closeBtn: {
        background: "none",
        border: "none",
        cursor: "pointer",
        fontSize: "18px",
        color: "#64748b",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "6px",
    },
    scrollBody: {
        flex: 1,
        overflowY: "auto",
        padding: "20px",
        backgroundColor: "#f8fafc",
        display: "flex",
        flexDirection: "column",
        gap: "24px",
    },
    pageCard: {
        backgroundColor: "#fff",
        padding: "16px",
        borderRadius: "8px",
        border: "1px solid #e2e8f0",
        boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
    },
    label: {
        margin: "0 0 12px 0",
        fontWeight: "600",
        fontSize: "14px",
        color: "#475569",
    },
    imageWrapper: {
        width: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "#f1f5f9",
        borderRadius: "6px",
        padding: "12px",
    },
    image: {
        maxWidth: "100%",
        maxHeight: "380px",
        height: "auto",
        width: "auto",
        objectFit: "contain", // Keeps structural aspect ratio 1:1 intact
        boxShadow: "0px 4px 12px rgba(0,0,0,0.1)",
        background: "#fff"
    },
    empty: {
        height: "200px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "#94a3b8",
        border: "2px dashed #cbd5e1",
        borderRadius: "6px",
        fontSize: "14px"
    }
};

export default PreviewModal;

// import React, { useEffect, useState } from "react";
// import { X } from "lucide-react";
// import { useCanvas } from "../../../context/CanvasContext";

// const PreviewModal = ({ open, onClose }) => {
//     const { canvas } = useCanvas();
//     const [preview, setPreview] = useState("");

//     useEffect(() => {
//         if (open && canvas) {
//             setPreview(
//                 canvas.toDataURL({
//                     format: "png",
//                     multiplier: 2,
//                 })
//             );
//         }
//     }, [open, canvas]);

//     if (!open) return null;

//     return (
//         <div className="cp-preview-overlay">
//             <div className="cp-preview-header">
//                 <h3>Preview</h3>

//                 <button
//                     className="cp-preview-close"
//                     onClick={onClose}
//                 >
//                     <X size={22} />
//                 </button>
//             </div>

//             <div className="cp-preview-body">
//                 {preview && (
//                     <img
//                         src={preview}
//                         alt="Preview"
//                         className="cp-preview-image"
//                     />
//                 )}
//             </div>
//         </div>
//     );
// };

// export default PreviewModal;