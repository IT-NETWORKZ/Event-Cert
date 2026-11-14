import { useState, useEffect, useCallback } from "react";
import "./EventHighlights.css";
import { getCertificateImageUrl } from "../../../api/homeService"; // adjust path if your services folder is elsewhere

// Live folder images (/home/rimg -> G1.png ... G13.png) through homeService.
const names = [
  "Christmas Wishes",   // G1
  "Hanuman Jayanti",    // G2
  "Raksha Bandhan",     // G3
  "Good Friday",        // G4
  "Merry Christmas",    // G5
  "Happy Diwali",       // G6
  "Thank You",          // G7
  "Happy New Year",     // G8
  "Happy Birthday",     // G9
  "Gudi Padwa",         // G10
  "Happy Onam",         // G11
  "Janmashtami",        // G12
  "Dussehra",           // G13
];

const items = names.map((name, i) => ({
  id: i + 1,
  name,
  img: getCertificateImageUrl(`G${i + 1}`),
}));

const rowA = items.slice(0, 7);
const rowB = items.slice(7);

const pillars = ["Promote events", "Send wishes", "Recognize achievements"];

function Banner({ item, failed, onFail, onOpen, hidden }) {
  return (
    <div className="eh-slot">
      <button
        type="button"
        className="eh-card"
        onClick={() => onOpen(item.id)}
        tabIndex={hidden ? -1 : 0}
        aria-label={`View ${item.name} banner`}
      >
        <span className="eh-frame">
          {failed[item.id] ? (
            <span className="eh-missing">Image not available</span>
          ) : (
            <>
              <span
                className="eh-bg"
                style={{ backgroundImage: `url(${item.img})` }}
              />
              <img
                src={item.img}
                alt={hidden ? "" : item.name}
                loading="lazy"
                onError={() => onFail(item.id)}
              />
            </>
          )}
        </span>
        <span className="eh-caption">{item.name}</span>
      </button>
    </div>
  );
}

function Row({ list, reverse, failed, onFail, onOpen }) {
  return (
    <div className={`eh-row ${reverse ? "eh-row-rev" : ""}`}>
      <div className="eh-track">
        {[0, 1].map((copy) => (
          <div className="eh-set" key={copy} aria-hidden={copy === 1}>
            {list.map((item) => (
              <Banner
                key={`${item.id}-${copy}`}
                item={item}
                failed={failed}
                onFail={onFail}
                onOpen={onOpen}
                hidden={copy === 1}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

function EventHighlights() {
  const [failed, setFailed] = useState({});
  const [activeId, setActiveId] = useState(null);

  const markFailed = useCallback(
    (id) => setFailed((p) => ({ ...p, [id]: true })),
    []
  );

  const step = useCallback((dir) => {
    setActiveId((id) =>
      id === null ? id : ((id - 1 + dir + items.length) % items.length) + 1
    );
  }, []);

  // keyboard + scroll lock while the viewer is open
  useEffect(() => {
    if (activeId === null) return;
    const onKey = (e) => {
      if (e.key === "Escape") setActiveId(null);
      if (e.key === "ArrowRight") step(1);
      if (e.key === "ArrowLeft") step(-1);
    };
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [activeId, step]);

  const active = activeId ? items[activeId - 1] : null;

  return (
    <section id="eventhub" className="eh-section">
      <div className="eh-glow eh-glow-1" />
      <div className="eh-glow eh-glow-2" />

      <div className="eh-container">
        <header className="eh-head">
          <h2 className="eh-title">
            <span className="eh-title-top">EventCert</span>
            <span className="eh-title-pill">Highlights</span>
          </h2>

          <div className="eh-intro">
            <p>
              One platform for every occasion. Pick a banner, add your details
              and send it out.
            </p>
            <ul className="eh-pillars">
              {pillars.map((p) => (
                <li key={p}>{p}</li>
              ))}
            </ul>
          </div>
        </header>
      </div>

      {/* two walls of banners drifting in opposite directions */}
      <div className="eh-wall">
        <Row list={rowA} failed={failed} onFail={markFailed} onOpen={setActiveId} />
        <Row list={rowB} reverse failed={failed} onFail={markFailed} onOpen={setActiveId} />
      </div>


      {/* viewer */}
      {active && (
        <div
          className="eh-viewer"
          role="dialog"
          aria-modal="true"
          aria-label={active.name}
          onClick={() => setActiveId(null)}
        >
          <div className="eh-viewer-body" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              className="eh-nav eh-prev"
              onClick={() => step(-1)}
              aria-label="Previous banner"
            >
              ‹
            </button>

            <figure className="eh-viewer-card">
              {failed[active.id] ? (
                <div className="eh-missing eh-missing-lg">Image not available</div>
              ) : (
                <img src={active.img} alt={active.name} />
              )}
              <figcaption>
                {active.name}
                <small>
                  {active.id} of {items.length}
                </small>
              </figcaption>
            </figure>

            <button
              type="button"
              className="eh-nav eh-next"
              onClick={() => step(1)}
              aria-label="Next banner"
            >
              ›
            </button>

            <button
              type="button"
              className="eh-close"
              onClick={() => setActiveId(null)}
              aria-label="Close"
            >
              ×
            </button>
          </div>
        </div>
      )}
    </section>
  );
}

export default EventHighlights;