import React, { useEffect, useState } from "react";
import { FaMinus, FaTimes, FaHistory } from "react-icons/fa";

// Same minimized "pill" look as the Sticker / Invitation / Greeting drawers.
// Slots used there: sticker 110, invitation 180, greeting 250.
// Used for both "Recent Work" (pill slot 390) and "Your Design" (pill slot 460).
// full -> minimized (floating pill) -> closed
const RecentLibrary = ({
    isOpen,
    onClose,
    onExpand,
    items,
    onSelect,
    onDelete,
    title = "Recent Work",
    pillLabel = "Recent",
    pillTop = 390,
    pillColor = "#2563eb",
    icon = <FaHistory />,
}) => {
    const PILL = { top: pillTop, background: pillColor, label: pillLabel };
    const [panelState, setPanelState] = useState(isOpen ? "full" : "closed");

    // parent opens it -> show full; parent closes it (e.g. after picking a design) -> hide,
    // but keep the pill if the user minimized it
    useEffect(() => {
        if (isOpen) setPanelState("full");
        else setPanelState((p) => (p === "full" ? "closed" : p));
    }, [isOpen]);

    const handleMinimize = () => {
        setPanelState("minimized");
        onClose(); // release the parent's open flag, the pill stays
    };

    const handleExpand = () => {
        setPanelState("full");
        if (onExpand) onExpand(); // lets the parent refresh the list
    };

    const handleFullClose = () => {
        setPanelState("closed");
        onClose();
    };

    // close with the Escape key
    useEffect(() => {
        if (panelState !== "full") return;
        const onKey = (e) => e.key === "Escape" && handleFullClose();
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [panelState]);

    if (panelState === "closed") return null;

    // ================= MINIMIZED PILL =================
    if (panelState === "minimized") {
        return (
            <button
                onClick={handleExpand}
                aria-label={`Expand ${title} panel`}
                title={PILL.label}
                style={{
                    position: "fixed",
                    right: 24,
                    top: PILL.top,
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    border: "none",
                    borderRadius: 30,
                    cursor: "pointer",
                    zIndex: 2,
                    background: PILL.background,
                    boxShadow: "0 4px 14px rgba(0,0,0,0.25)",
                    transition: "transform 0.2s ease",
                    padding: "6px 18px 6px 6px",
                }}
                onMouseOver={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
                onMouseOut={(e) => (e.currentTarget.style.transform = "scale(1)")}
            >
                <span
                    style={{
                        position: "relative",
                        width: 44,
                        height: 44,
                        borderRadius: "50%",
                        background: "rgba(255,255,255,0.18)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                    }}
                >
                    <span
                        style={{
                            position: "absolute",
                            inset: -4,
                            borderRadius: "50%",
                            border: "2px solid rgba(255,255,255,0.8)",
                            opacity: 0.6,
                            animation: "cp-fab-pulse-anim 1.8s infinite",
                            pointerEvents: "none",
                        }}
                    />
                    <span style={{ position: "relative", zIndex: 1, display: "flex", color: "#fff", fontSize: 20 }}>
                        {icon}
                    </span>
                </span>

                <span style={{ color: "#fff", fontSize: 14, fontWeight: 600, whiteSpace: "nowrap" }}>
                    {PILL.label}
                </span>
            </button>
        );
    }

    // ================= FULL DRAWER =================
    return (
        <>
            <div className="cp-sidebar-gallery-overlay" onClick={handleFullClose} />

            <aside className="cp-sidebar-gallery cp-recent-drawer" aria-label={title}>
                <div className="cp-sidebar-gallery-header">
                    <h3>{title}</h3>

                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                        <button
                            type="button"
                            className="cp-recent-close"
                            onClick={handleMinimize}
                            title="Minimize"
                            aria-label={`Minimize ${title}`}
                        >
                            <FaMinus />
                        </button>

                        <button
                            type="button"
                            className="cp-recent-close"
                            onClick={handleFullClose}
                            title="Close"
                            aria-label={`Close ${title}`}
                        >
                            <FaTimes />
                        </button>
                    </div>
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
