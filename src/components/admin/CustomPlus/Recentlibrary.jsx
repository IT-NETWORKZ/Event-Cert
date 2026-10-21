import React, { useEffect } from "react";
import { FaMinus, FaTimes, FaHistory } from "react-icons/fa";

// Right-side "Recent Work" drawer (same look as the sticker / invitation drawers)
const RecentLibrary = ({ isOpen, onClose, items, onSelect, onDelete }) => {
    // close with the Escape key
    useEffect(() => {
        if (!isOpen) return;
        const onKey = (e) => e.key === "Escape" && onClose();
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return (
        <>
            <div className="cp-sidebar-gallery-overlay" onClick={onClose} />

            <aside className="cp-sidebar-gallery cp-recent-drawer" aria-label="Recent work">
                <div className="cp-sidebar-gallery-header">
                    <h3>Recent Work</h3>
                    <button
                        type="button"
                        className="cp-recent-close"
                        onClick={onClose}
                        aria-label="Close recent work"
                    >
                        <FaMinus />
                    </button>
                </div>

                <div className="cp-sidebar-gallery-body">
                    {items.length === 0 ? (
                        <div className="cp-empty">
                            <FaHistory size={42} color="#2563eb" />
                            <h4>No recent work yet</h4>
                            <p>Designs you upload will show up here.</p>
                        </div>
                    ) : (
                        <div className="cp-recent-grid">
                            {items.map((item) => (
                                <div
                                    key={item.id}
                                    className="cp-recent-card"
                                    onClick={() => onSelect(item)}
                                    title={item.name || "Recent design"}
                                >
                                    <img src={item.src} alt={item.name || "Recent design"} />

                                    <button
                                        type="button"
                                        className="cp-recent-delete"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            onDelete(item.id);
                                        }}
                                        aria-label="Remove from recent"
                                    >
                                        <FaTimes />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </aside>
        </>
    );
};

export default RecentLibrary;