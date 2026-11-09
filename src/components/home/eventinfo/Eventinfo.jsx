import React, { useMemo, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./eventinfo.css";
import { Search, Calendar, MapPin, ArrowRight, QrCode } from "lucide-react";
import { getHomeEvents } from "../../../api/adminService"; 

const MONTHS = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
const MONTHS_LONG = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function Eventinfo() {
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [stateVal, setStateVal] = useState("");
  const [cityVal, setCityVal] = useState("");
  const [nameVal, setNameVal] = useState("");
  const [applied, setApplied] = useState({ state: "", city: "", name: "" });

  // Fetch events from backend API on mount
  useEffect(() => {
    let cancelled = false;
    getHomeEvents()
      .then((res) => {
        if (!cancelled && res && res.events) {
          setEvents(res.events);
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setError("Failed to load events.");
          console.error(err);
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  // Click on an event -> Event registration page (/event) passing mapped properties
  const openEvent = (ev) => {
    // Map backend field format back to a unified object structure expected by details page if needed
    const formattedEvent = {
      id: ev.eventId,
      title: ev.eventTitle,
      date: ev.eventStartDate,
      location: `${ev.venue}, ${ev.city}, ${ev.state}`,
      state: ev.state,
      city: ev.city,
      description: ev.aboutEvent,
      entry: ev.entryFee,
      image: ev.image1 ? `https://localhost:7151${ev.image1}` : "",
      qr: ev.qrCodeUrl ? `https://localhost:7151${ev.qrCodeUrl}` : "",
    };
    navigate(`/event?nID=${ev.eventId}`, { state: { event: formattedEvent } });
  };

  const states = useMemo(
    () => [...new Set(events.map((e) => e.state).filter(Boolean))],
    [events]
  );

  const cities = useMemo(
    () => [
      ...new Set(
        events
          .filter((e) => !stateVal || e.state === stateVal)
          .map((e) => e.city)
          .filter(Boolean)
      ),
    ],
    [events, stateVal]
  );

  const filtered = useMemo(() => {
    const q = applied.name.trim().toLowerCase();
    return events.filter(
      (e) =>
        (!applied.state || e.state === applied.state) &&
        (!applied.city || e.city === applied.city) &&
        (!q || e.eventTitle?.toLowerCase().includes(q))
    );
  }, [events, applied]);

  const handleSearch = () => setApplied({ state: stateVal, city: cityVal, name: nameVal });

  return (
    <section id="eventhub" className="eventinfo-section">
      <div className="container">

        {/* Heading */}
        <div className="text-center">
          <h2 className="about-title">
            Get your <span className="highlight">EVENT</span> info here
          </h2>
          <div className="title-line"></div>
        </div>

        {/* Search Area */}
        <div className="ev-search">
          <select
            className="ev-field"
            value={stateVal}
            onChange={(e) => {
              setStateVal(e.target.value);
              setCityVal("");
            }}
          >
            <option value="">State</option>
            {states.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>

          <select
            className="ev-field"
            value={cityVal}
            onChange={(e) => setCityVal(e.target.value)}
          >
            <option value="">City</option>
            {cities.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>

          <input
            type="text"
            placeholder="Event name"
            className="ev-field ev-field-grow"
            value={nameVal}
            onChange={(e) => setNameVal(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          />

          <button type="button" className="ev-search-btn" onClick={handleSearch} aria-label="Search events">
            <Search size={22} />
          </button>
        </div>

        {/* Loading / Content / Empty states */}
        {loading ? (
          <p className="text-center py-4">Loading events...</p>
        ) : error ? (
          <p className="text-center text-danger py-4">{error}</p>
        ) : filtered.length === 0 ? (
          <p className="empty-event">No events found.</p>
        ) : (
          <div className="ev-list">
            {filtered.map((ev) => {
              const d = new Date(ev.eventStartDate);
              const imageUrl = ev.image1 ? `https://localhost:7151${ev.image1}` : "";
              const qrUrl = ev.qrCodeUrl ? `https://localhost:7151${ev.qrCodeUrl}` : "";

              return (
                <article className="ev-item" key={ev.eventId}>

                  {/* Date badge */}
                  <div className="ev-date">
                    <span className="ev-date-month">{MONTHS[d.getMonth()] || "JAN"}</span>
                    <strong className="ev-date-day">{String(d.getDate()).padStart(2, "0")}</strong>
                    <span className="ev-date-year">{d.getFullYear()}</span>
                  </div>

                  {/* Timeline dot */}
                  <span className="ev-dot" aria-hidden="true"></span>

                  {/* Card */}
                  <div
                    className="ev-card ev-card-click"
                    role="button"
                    tabIndex={0}
                    onClick={() => openEvent(ev)}
                    onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && (e.preventDefault(), openEvent(ev))}
                  >
                    <div className="ev-img">
                      {imageUrl ? (
                        <img src={imageUrl} alt={ev.eventTitle} />
                      ) : (
                        <div className="ev-img-fallback">
                          <Calendar size={42} />
                        </div>
                      )}
                    </div>

                    <div className="ev-body">
                      <div className="ev-tag">
                        <span className="ev-tag-line"></span>
                        {ev.organizationName || "Upcoming Event"}
                      </div>

                      <h3 className="ev-title">{ev.eventTitle}</h3>

                      <div className="ev-meta">
                        <span>
                          <Calendar size={15} />
                          {`${String(d.getDate()).padStart(2, "0")} ${MONTHS_LONG[d.getMonth()]} ${d.getFullYear()}  ${ev.eventTime || ""}`}
                        </span>
                        <span className="ev-meta-light">
                          <MapPin size={15} />
                          {`${ev.venue}, ${ev.city}, ${ev.state}`}
                        </span>
                      </div>

                      <p className="ev-desc">{ev.aboutEvent}</p>

                      <div className="ev-foot">
                        <div className="ev-entry">
                          <span>ENTRY</span>
                          <strong>₹ {Number(ev.entryFee || 0).toFixed(2)}</strong>
                        </div>
                        <button
                          type="button"
                          className="ev-view"
                          onClick={(e) => {
                            e.stopPropagation();
                            openEvent(ev);
                          }}
                        >
                          VIEW EVENT <ArrowRight size={16} />
                        </button>
                      </div>
                    </div>

                    {/* QR panel */}
                    <div className="ev-qr">
                      <span className="ev-qr-label">
                        <QrCode size={13} /> REGISTER
                      </span>
                      <div className="ev-qr-box">
                        {qrUrl ? <img src={qrUrl} alt="QR code" /> : <QrCode size={70} />}
                      </div>
                      <span className="ev-qr-scan">SCAN TO JOIN</span>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}

      </div>
    </section>
  );
}

export default Eventinfo;

