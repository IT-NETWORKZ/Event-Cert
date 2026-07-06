import React, { useEffect, useState, useRef } from "react";
import "../../../css/CustomPlus.css";

const SidebarGallery = ({
  isOpen,
  onClose,
  title = "Gallery",
  images = [],
  onSelect, // Receives the click handler from parent components
  showCategories, 
  categories = [], 
  onCategoryClick, 
  onBack, 
}) => {
  const [visibleImages, setVisibleImages] = useState(6);
  // NEW: Ref to target the scrollable container
  const scrollContainerRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      setVisibleImages(6);
    }
  }, [isOpen]);

  // NEW: Smooth scroll to bottom when visibleImages count changes
  useEffect(() => {
    if (scrollContainerRef.current && visibleImages > 6) {
      // Small timeout ensures the DOM has updated with the new images before calculating scroll height
      setTimeout(() => {
        scrollContainerRef.current.scrollTo({
          top: scrollContainerRef.current.scrollHeight,
          behavior: "smooth",
        });
      }, 50);
    }
  }, [visibleImages]);

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") onClose();
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEsc);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEsc);
      document.body.style.overflow = "auto";
    };
  }, [isOpen, onClose]);

  return (
    <>
      {/* Overlay */}
      <div
        onClick={onClose}
        style={{
          position: "fixed",
          inset: 0,
          background: "rgba(0,0,0,0.45)",
          opacity: isOpen ? 1 : 0,
          visibility: isOpen ? "visible" : "hidden",
          transition: "0.35s",
          zIndex: 999,
        }}
      />

      {/* Sidebar */}
      <div
        style={{
          position: "fixed",
          top: 0,
          right: 0,
          width: "430px",
          maxWidth: "100%",
          height: "100vh",
          background: "#fff",
          transform: isOpen ? "translateX(0)" : "translateX(100%)",
          transition: "0.35s ease",
          zIndex: 1000,
          display: "flex",
          flexDirection: "column",
          boxShadow: "-5px 0 30px rgba(0,0,0,.15)",
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: "18px 22px",
            borderBottom: "1px solid #eee",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            background: "#fff",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            {!showCategories && onBack && (
              <button
                onClick={onBack}
                style={{
                  border: "none",
                  background: "transparent",
                  fontSize: "18px",
                  cursor: "pointer",
                  color: "#009688",
                  padding: "4px 8px",
                  fontWeight: "bold",
                }}
              >
                ←
              </button>
            )}
            <h3
              style={{
                margin: 0,
                color: "#009688",
                fontWeight: 700,
              }}
            >
              {title}
            </h3>
          </div>

          <button
            onClick={onClose}
            style={{
              border: "none",
              background: "transparent",
              fontSize: "28px",
              cursor: "pointer",
            }}
          >
            &times;
          </button>
        </div>

        {/* Content Body */}
        <div
          ref={scrollContainerRef} // NEW: Attached the ref here to monitor the scroll window
          style={{
            flex: 1,
            overflowY: "auto",
            padding: 20,
          }}
        >
          {/* ==================== VIEW 1: CATEGORY BUTTONS GRID ==================== */}
          {showCategories ? (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(2, 1fr)",
                gap: 15,
              }}
            >
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => onCategoryClick && onCategoryClick(cat)}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "10px",
                    width: "100%",
                    aspectRatio: "1/1",
                    background: "#f9f9f9",
                    border: "1px solid #eee",
                    borderRadius: "12px",
                    cursor: "pointer",
                    textAlign: "center",
                    fontSize: "14px",
                    fontWeight: "600",
                    color: "#333",
                    transition: "0.2s ease-in-out",
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.background = "#eefaf8";
                    e.currentTarget.style.borderColor = "#009688";
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.background = "#f9f9f9";
                    e.currentTarget.style.borderColor = "#eee";
                  }}
                >
                  <span style={{ fontSize: "30px" }}>{cat.icon}</span>
                  <span>{cat.title}</span>
                </button>
              ))}
            </div>
          ) : (
            /* ==================== VIEW 2: IMAGES LIST GRID ==================== */
            <>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(2,1fr)",
                  gap: 15,
                }}
              >
                {images.slice(0, visibleImages).map((img, index) => (
                  <img
                    key={index}
                    src={img}
                    alt={`Gallery ${index}`}
                    onClick={() => onSelect && onSelect(img)}
                    style={{
                      width: "100%",
                      height: "170px",
                      objectFit: "cover",
                      borderRadius: "12px",
                      cursor: "pointer",
                      transition: "0.3s",
                    }}
                    onMouseOver={(e) =>
                      (e.currentTarget.style.transform = "scale(1.05)")
                    }
                    onMouseOut={(e) =>
                      (e.currentTarget.style.transform = "scale(1)")
                    }
                  />
                ))}
              </div>

              {visibleImages < images.length && (
                <div style={{ textAlign: "center", marginTop: 25 }}>
                  <button
                    onClick={() => setVisibleImages((prev) => prev + 6)}
                    style={{
                      padding: "12px 28px",
                      border: "none",
                      borderRadius: "30px",
                      background: "#009688",
                      color: "#fff",
                      fontWeight: 600,
                      cursor: "pointer",
                    }}
                  >
                    Load More
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default SidebarGallery;