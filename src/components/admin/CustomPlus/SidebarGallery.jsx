import React, { useEffect, useState } from "react";
import "../../../css/CustomPlus.css";

const SidebarGallery = ({
  isOpen,
  onClose,
  title = "Gallery",
  images = [],
  onSelect, // Receives the click handler from parent components
}) => {
  const [visibleImages, setVisibleImages] = useState(8);

  useEffect(() => {
    if (isOpen) {
      setVisibleImages(8);
    }
  }, [isOpen]);

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
          <h3
            style={{
              margin: 0,
              color: "#009688",
              fontWeight: 700,
            }}
          >
            {title}
          </h3>

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

        {/* Images */}
        <div
          style={{
            flex: 1,
            overflowY: "auto",
            padding: 20,
          }}
        >
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
                onClick={() => onSelect && onSelect(img)} // Fires selection event
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
                onClick={() => setVisibleImages((prev) => prev + 8)}
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
        </div>
      </div>
    </>
  );
};

export default SidebarGallery;