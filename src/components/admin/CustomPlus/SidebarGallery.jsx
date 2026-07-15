import React, { useEffect, useState, useRef } from "react";
import "../../../css/CustomPlus.css";

if (typeof document !== "undefined") {
  const styleTag = document.createElement("style");
  styleTag.innerHTML = `
    @keyframes skeleton-shimmer {
      0% { background-position: -200% 0; }
      100% { background-position: 200% 0; }
    }
    .skeleton-placeholder {
      background: linear-gradient(90deg, #f2f2f2 25%, #e6e6e6 50%, #f2f2f2 75%);
      background-size: 200% 100%;
      animation: skeleton-shimmer 1.5s infinite linear;
    }
    @keyframes cp-fab-pulse-anim {
      0% { transform: scale(0.9); opacity: 0.6; }
      70% { transform: scale(1.4); opacity: 0; }
      100% { transform: scale(1.4); opacity: 0; }
    }
  `;
  document.head.appendChild(styleTag);
}

// Each variant owns a fixed slot, color, and label. Since this config lives
// INSIDE SidebarGallery, every mounted instance (Sticker / Invitation /
// Greeting) resolves its own position + label independently — no shared
// class, no collisions. Positions now stack DOWN from the top.
const VARIANT_CONFIG = {
  sticker: {
    top: 110,
    width: 180,
    background: "#ff7043",
    label: "Stickers",
  },
  invitation: {
    top: 180,
    width: 180,
    background: "#009688",
    label: "Invitation",
  },
  greeting: {
    top: 250,
    width: 180,
    background: "#7e57c2",
    label: "Greeting",
  },
};
const LazyImage = ({ src, alt, onClick, style, onMouseOver, onMouseOut }) => {
  const [isIntersected, setIsIntersected] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const imgRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsIntersected(true);
          observer.disconnect();
        }
      },
      { root: null, rootMargin: "120px" }
    );

    if (imgRef.current) observer.observe(imgRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={imgRef}
      className={!isLoaded ? "skeleton-placeholder" : ""}
      style={{ ...style, position: "relative", overflow: "hidden", backgroundColor: "#f2f2f2" }}
    >
      {isIntersected && (
        <img
          src={src}
          alt={alt}
          onClick={onClick}
          onMouseOver={onMouseOver}
          onMouseOut={onMouseOut}
          onLoad={() => setIsLoaded(true)}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            opacity: isLoaded ? 1 : 0,
            transition: "opacity 0.4s ease-in-out, transform 0.3s ease",
          }}
        />
      )}
    </div>
  );
};

const SidebarGallery = ({
  isOpen,
  onClose,
  onMinimizeRelease,
  title = "Gallery",
  images = [],
  onSelect,
  showCategories,
  categories = [],
  onCategoryClick,
  onBack,
  icon,
  variant = "invitation",
}) => {
  const [visibleImages, setVisibleImages] = useState(6);
  const [panelState, setPanelState] = useState(isOpen ? "full" : "closed");
  const selfTriggeredCloseRef = useRef(false);
  const scrollContainerRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      setPanelState("full");
      setVisibleImages(6);
    } else if (selfTriggeredCloseRef.current) {
      selfTriggeredCloseRef.current = false;
    }
  }, [isOpen]);

  useEffect(() => {
    if (scrollContainerRef.current && visibleImages > 6) {
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
      if (e.key === "Escape") handleFullClose();
    };

    if (panelState === "full") {
      document.addEventListener("keydown", handleEsc);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.removeEventListener("keydown", handleEsc);
      document.body.style.overflow = "auto";
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [panelState]);

  const handleMinimize = () => {
    selfTriggeredCloseRef.current = true;
    setPanelState("minimized");
    (onMinimizeRelease || onClose)();
  };

  const handleExpand = () => {
    setPanelState("full");
  };

  const handleFullClose = () => {
    setPanelState("closed");
    onClose();
  };

  if (panelState === "closed") return null;

  if (panelState === "minimized") {
    const cfg = VARIANT_CONFIG[variant] || { top: 24, background: "#555", label: title };

    return (
      <button
        onClick={handleExpand}
        aria-label={`Expand ${cfg.label} panel`}
        title={cfg.label}
        style={{
          position: "fixed",
          right: 24,
          top: cfg.top,
          display: "flex",
          alignItems: "center",
          gap: 10,
          border: "none",
          borderRadius: 30,
          cursor: "pointer",
          zIndex: 2,
          background: cfg.background,
          boxShadow: "0 4px 14px rgba(0,0,0,0.25)",
          transition: "transform 0.2s ease",
          padding: "6px 18px 6px 6px", // tighter around icon, roomier around label
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
          <span style={{ position: "relative", zIndex: 1, display: "flex" }}>
            {icon ? (
              <span style={{ fontSize: 20 }}>{icon}</span>
            ) : (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <rect x="3" y="3" width="7.5" height="7.5" rx="2" fill="white" />
                <rect x="13.5" y="3" width="7.5" height="7.5" rx="2" fill="white" opacity="0.8" />
                <rect x="3" y="13.5" width="7.5" height="7.5" rx="2" fill="white" opacity="0.8" />
                <rect x="13.5" y="13.5" width="7.5" height="7.5" rx="2" fill="white" opacity="0.55" />
              </svg>
            )}
          </span>
        </span>

        <span
          style={{
            color: "#fff",
            fontSize: 14,
            fontWeight: 600,
            whiteSpace: "nowrap",
          }}
        >
          {cfg.label}
        </span>
      </button>
    );
  }

  return (
    <>
      <div
        onClick={handleFullClose}
        style={{
          position: "fixed",
          inset: 0,
          background: "rgba(0,0,0,0.45)",
          opacity: 1,
          visibility: "visible",
          transition: "0.35s",
          zIndex: 999,
        }}
      />

      <div
        style={{
          position: "fixed",
          top: 0,
          right: 0,
          width: "430px",
          maxWidth: "100%",
          height: "100vh",
          background: "#fff",
          transform: "translateX(0)",
          transition: "0.35s ease",
          zIndex: 1000,
          display: "flex",
          flexDirection: "column",
          boxShadow: "-5px 0 30px rgba(0,0,0,.15)",
        }}
      >
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
            <h3 style={{ margin: 0, color: "#009688", fontWeight: 700 }}>
              {title}
            </h3>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <button
              onClick={handleMinimize}
              title="Minimize"
              style={{
                border: "none",
                background: "#f2f2f2",
                width: "34px",
                height: "34px",
                borderRadius: "9px",
                fontSize: "16px",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#555",
                transition: "0.2s",
              }}
              onMouseOver={(e) => (e.currentTarget.style.background = "#e4e4e4")}
              onMouseOut={(e) => (e.currentTarget.style.background = "#f2f2f2")}
            >
              &#8211;
            </button>

            <button
              onClick={handleFullClose}
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
        </div>

        <div
          ref={scrollContainerRef}
          style={{ flex: 1, overflowY: "auto", padding: 20 }}
        >
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
            <>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(2,1fr)",
                  gap: 15,
                }}
              >
                {images.slice(0, visibleImages).map((img, index) => (
                  <LazyImage
                    key={index}
                    src={img}
                    alt={`Gallery ${index}`}
                    onClick={() => onSelect && onSelect(img)}
                    style={{
                      width: "100%",
                      height: "170px",
                      borderRadius: "12px",
                      cursor: "pointer",
                    }}
                    onMouseOver={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
                    onMouseOut={(e) => (e.currentTarget.style.transform = "scale(1)")}
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