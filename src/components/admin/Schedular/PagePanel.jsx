import React from "react";
import { FaArrowLeft, FaPlus, FaTimes, FaCopy } from "react-icons/fa";
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
        canvas,
        canvasSize
    } = useCanvas();

    // Helper to pull fresh state directly from the active Fabric canvas instance
    const getLiveCanvasData = () => {
        let currentCanvasJson = null;
        let currentThumbnail = "";

        if (canvas) {
            currentCanvasJson = canvas.toJSON();
            currentThumbnail = canvas.toDataURL({ format: 'jpeg', quality: 0.1 });
        }

        return { currentCanvasJson, currentThumbnail };
    };

    const addPage = () => {
        if (pages.length >= MAX_PAGES) {
            alert(`Maximum ${MAX_PAGES} pages allowed.`);
            return;
        }

        const { currentCanvasJson, currentThumbnail } = getLiveCanvasData();
        const newPageId = Date.now();

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
                    json: null, 
                    width: canvasSize.width,
                    height: canvasSize.height,
                    thumbnail: ""
                }
            ];
        });

        setActivePage(newPageId);
    };

    const duplicatePage = (targetPage) => {
        if (pages.length >= MAX_PAGES) {
            alert(`Maximum ${MAX_PAGES} pages allowed.`);
            return;
        }

        const { currentCanvasJson, currentThumbnail } = getLiveCanvasData();
        const newPageId = Date.now();

        setPages((prevPages) => {
            const updatedPages = [];

            for (let p of prevPages) {
                if (p.id === activePage) {
                    p = {
                        ...p,
                        json: currentCanvasJson,
                        width: canvas ? canvas.getWidth() : p.width,
                        height: canvas ? canvas.getHeight() : p.height,
                        thumbnail: currentThumbnail
                    };
                }

                updatedPages.push(p);

                if (p.id === targetPage.id) {
                    const duplicatedJson = p.id === activePage 
                        ? currentCanvasJson 
                        : p.json ? JSON.parse(JSON.stringify(p.json)) : null;

                    updatedPages.push({
                        ...p,
                        id: newPageId,
                        json: duplicatedJson,
                        thumbnail: p.id === activePage ? currentThumbnail : p.thumbnail
                    });
                }
            }

            return updatedPages;
        });

        setActivePage(newPageId);
    };

    const handlePageSwitch = (targetPageId) => {
        if (targetPageId === activePage) return;

        const { currentCanvasJson, currentThumbnail } = getLiveCanvasData();

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
                        {/* Duplicate Button (Left Badge) */}
                        <button
                            className="cp-duplicate-page"
                            onClick={(e) => {
                                e.stopPropagation();
                                duplicatePage(page);
                            }}
                            title="Duplicate Page"
                        >
                            <FaCopy />
                        </button>

                        {/* Delete Button (Right Badge) */}
                        <button
                            className="cp-delete-page"
                            onClick={(e) => {
                                e.stopPropagation();
                                deletePage(page.id);
                            }}
                            title="Delete Page"
                        >
                            <FaTimes />
                        </button>

                        {/* Preview Thumbnail Container */}
                        <div className="cp-page-preview" style={{ background: '#f5f5f5', display: 'flex', alignItems: 'center', justifyContent: 'center', height: '80px', overflow: 'hidden', border: '1px solid #ddd', borderRadius: '4px' }}>
                            {page.thumbnail ? (
                                <img src={page.thumbnail} alt={`Page ${index + 1}`} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                            ) : (
                                <div style={{ fontSize: '11px', color: '#aaa' }}>Blank Slate</div>
                            )}
                        </div>

                        {/* Page Title */}
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