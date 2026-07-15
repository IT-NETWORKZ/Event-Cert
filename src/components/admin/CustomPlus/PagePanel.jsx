import React from "react";
import { FaArrowLeft, FaPlus, FaTimes } from "react-icons/fa";
import { useCanvas } from "../../../context/CanvasContext";
import { useNavigate } from "react-router-dom";

const MAX_PAGES = 6;

const PagePanel = () => {
    const navigate = useNavigate();
    const {
        pages,
        setPages,
        activePage,
        setActivePage,
        saveCurrentPageData,
        canvas,
        canvasSize
    } = useCanvas();

    const addPage = () => {
        if (pages.length >= MAX_PAGES) {
            alert(`Maximum ${MAX_PAGES} pages allowed.`);
            return;
        }

        // 1. Extract live data from the current active canvas instance directly
        let currentCanvasJson = null;
        let currentThumbnail = "";

        if (canvas) {
            currentCanvasJson = canvas.toJSON();
            currentThumbnail = canvas.toDataURL({ format: 'jpeg', quality: 0.1 });
        }

        const newPageId = Date.now();

        // 2. Update the array manually so the data is saved before switching
        setPages((prevPages) => {
            const updatedPages = prevPages.map((p) => {
                if (p.id === activePage) {
                    return {
                        ...p,
                        json: currentCanvasJson,
                        width: canvas ? canvas.getWidth() : p.width,
                        height: canvas ? canvas.getHeight() : p.height,
                        thumbnail: currentThumbnail
                    };
                }
                return p;
            });

            return [
                ...updatedPages,
                {
                    id: newPageId,
                    json: null, // Fresh blank canvas
                    width: canvasSize.width,
                    height: canvasSize.height,
                    thumbnail: ""
                }
            ];
        });

        // 3. Set the new active page
        setActivePage(newPageId);
    };

    const handlePageSwitch = (targetPageId) => {
        if (targetPageId === activePage) return;

        // 1. Extract raw canvas data directly to bypass React's async state batching
        let currentCanvasJson = null;
        let currentThumbnail = "";

        if (canvas) {
            currentCanvasJson = canvas.toJSON();
            currentThumbnail = canvas.toDataURL({ format: 'jpeg', quality: 0.1 });
        }

        // 2. Commit the data to the old page first, then safely trigger the page switch
        setPages((prevPages) =>
            prevPages.map((p) => {
                if (p.id === activePage) {
                    return {
                        ...p,
                        json: currentCanvasJson,
                        width: canvas ? canvas.getWidth() : p.width,
                        height: canvas ? canvas.getHeight() : p.height,
                        thumbnail: currentThumbnail
                    };
                }
                return p;
            })
        );

        // 3. Now switch the page frame safely
        setActivePage(targetPageId);
    };

    const deletePage = (id) => {
        if (pages.length === 1) {
            alert("At least one page is required.");
            return;
        }

        const updated = pages.filter(page => page.id !== id);
        setPages(updated);

        if (activePage === id) {
            setActivePage(updated[0].id);
        }
    };

    return (
        <div className="cp-page-panel">
            <button className="cp-back-btn" onClick={() => navigate("/admin/dashboard")}>
                <FaArrowLeft />
                <span>Back</span>
            </button>

            <button
                className="cp-add-page-btn"
                onClick={addPage}
                disabled={pages.length >= MAX_PAGES}
            >
                <FaPlus />
                <span>
                    {pages.length >= MAX_PAGES ? "Limit Reached" : "Add Page"}
                </span>
            </button>

            <div className="cp-page-list">
                {pages.map((page, index) => (
                    <div
                        key={page.id}
                        className={`cp-page-card ${activePage === page.id ? "active" : ""}`}
                        onClick={() => handlePageSwitch(page.id)}
                    >
                        <button
                            className="cp-delete-page"
                            onClick={(e) => {
                                e.stopPropagation();
                                deletePage(page.id);
                            }}
                        >
                            <FaTimes />
                        </button>

                        <div className="cp-page-preview" style={{ background: '#f5f5f5', display: 'flex', alignItems: 'center', justifyContent: 'center', height: '80px', overflow: 'hidden', border: '1px solid #ddd', borderRadius: '4px' }}>
                            {page.thumbnail ? (
                                <img src={page.thumbnail} alt={`Page ${index + 1}`} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                            ) : (
                                <div style={{ fontSize: '11px', color: '#aaa' }}>Blank Slate</div>
                            )}
                        </div>

                        <div className="cp-page-name">
                            Page {index + 1}
                        </div>

                    </div>
                ))}
            </div>
        </div>
    );
};

export default PagePanel;

