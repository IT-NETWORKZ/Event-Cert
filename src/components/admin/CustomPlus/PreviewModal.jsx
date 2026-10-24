import React, { useEffect, useState } from "react";
import { FaTimes } from "react-icons/fa";
import { useCanvas } from "../../../context/CanvasContext";
import { buildLookup, renderPage } from "./templateRender";

const PreviewModal = ({ open, onClose, rows = [] }) => {
    const { pages, activePage, canvas } = useCanvas();

    const [rowIndex, setRowIndex] = useState(0);
    const [selectedPage, setSelectedPage] = useState(0);
    const [images, setImages] = useState([]);
    const [loading, setLoading] = useState(false);

    const hasRows = rows.length > 0;
    const safeRow = hasRows ? Math.min(rowIndex, rows.length - 1) : 0;
    const row = hasRows ? rows[safeRow] : null;

    useEffect(() => {
        if (open) {
            setRowIndex(0);
            setSelectedPage(0);
        }
    }, [open]);

    // close with Escape
    useEffect(() => {
        if (!open) return undefined;
        const onKey = (e) => e.key === "Escape" && onClose();
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [open, onClose]);

    // re-draw every page whenever the modal opens or the selected row changes
    useEffect(() => {
        if (!open) return undefined;

        let cancelled = false;
        setLoading(true);

        // the page being edited is read live from the canvas, other pages from saved data
        const sources = pages.map((p) =>
            p.id === activePage && canvas
                ? { json: canvas.toJSON(), width: canvas.getWidth(), height: canvas.getHeight() }
                : { json: p.json, width: p.width, height: p.height }
        );
        const lookup = buildLookup(row);

        Promise.all(sources.map((s) => renderPage(s, lookup)))
            .then((urls) => {
                if (cancelled) return;
                setImages(urls);
                setLoading(false);
            })
            .catch(() => {
                if (!cancelled) setLoading(false);
            });

        return () => {
            cancelled = true;
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [open, safeRow, rows, pages, activePage, canvas]);

    if (!open) return null;

    const current = images[selectedPage];

    return (
        <div className="cp-pv-overlay" onClick={onClose}>
            <div
                className="cp-pv-modal"
                role="dialog"
                aria-modal="true"
                aria-label="Project preview"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="cp-pv-header">
                    <div className="cp-pv-title">
                        <h3>Preview</h3>
                        <p>
                            {hasRows
                                ? "Placeholders are filled with the first ticked Excel row (or the first row)."
                                : "No Excel data yet. Upload an Excel file below to see {{NAME}} and {{TEXT1}} filled in."}
                        </p>
                    </div>

                    <button type="button" className="cp-pv-close" onClick={onClose} aria-label="Close preview">
                        <FaTimes />
                    </button>
                </div>

                <div className="cp-pv-body">
                    <div className="cp-pv-list">
                        {pages.map((page, index) => (
                            <button
                                type="button"
                                key={page.id}
                                className={`cp-pv-thumb ${selectedPage === index ? "active" : ""}`}
                                onClick={() => setSelectedPage(index)}
                            >
                                {images[index] ? (
                                    <img src={images[index]} alt={`Page ${index + 1}`} />
                                ) : (
                                    <span className="cp-pv-thumb-empty" />
                                )}
                                <small>Page {index + 1}</small>
                            </button>
                        ))}
                    </div>

                    <div className="cp-pv-view">
                        {loading && !current && <div className="cp-loader" aria-label="Loading preview" />}

                        {current && (
                            <img
                                src={current}
                                alt={`Preview of page ${selectedPage + 1}`}
                                className={`cp-pv-large ${loading ? "is-loading" : ""}`}
                            />
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PreviewModal;
