import React, { useEffect } from "react";
import { FaUser } from "react-icons/fa";

// EventCert top header bar, shown when "Menu" is clicked in the Custom Plus sidebar.
// Closes on: outside click or Escape
// (clicking "Menu" in the sidebar again is handled by the parent).
const MainHeaderBar = ({ isOpen, onClose, userName = "User" }) => {
    useEffect(() => {
        if (!isOpen) return;
        const onKey = (e) => e.key === "Escape" && onClose();
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [isOpen, onClose]);

    return (
        <>
            <div
                className={`cp-header-overlay ${isOpen ? "open" : ""}`}
                onClick={onClose}
            />

            <header
                className={`cp-header-bar ${isOpen ? "open" : ""}`}
                aria-hidden={!isOpen}
            >
                <div className="cp-header-user">
                    <span>Welcome {userName}</span>
                    <div className="cp-header-avatar">
                        <FaUser />
                    </div>
                </div>
            </header>
        </>
    );
};

export default MainHeaderBar;
