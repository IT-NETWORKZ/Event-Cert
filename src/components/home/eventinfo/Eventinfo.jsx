import React, { useMemo, useState } from "react";
import "./eventinfo.css";
import { Search, Calendar, MapPin, ArrowRight, QrCode } from "lucide-react";

// Sample data: replace with your API / state
const sampleEvents = [
  {
    id: 1,
    title: "IT Internship - Network Communication & Security",
    date: "2026-09-01T18:00",
    location: "ITNetworkZ Infosystems Pvt Ltd, Plot 5, RPTS Rd, Laxmi Nagar, Nagpur - 440022.",
    state: "Maharashtra",
    city: "Nagpur",
    description: "Build practical skills in Network Communication & Security with our 6-Week Technical Internship.",
    entry: 3800,
    image: "",
    qr: "",
  },
  {
    id: 2,
    title: "Art Workshop",
    date: "2026-10-16T10:00",
    location: "Jawaharlal Darda Art Gallery, Lokmat Square",
    state: "Maharashtra",
    city: "Nagpur",
    description: "Join a hands-on practical art workshop led by a professional artist, focusing on illustration, composition and visual storytelling.",
    entry: 100,
    image: "",
    qr: "",
  },
  {
    id: 3,
    title: "Semaphore",
    date: "2026-11-03T10:00",
    location: "IICC",
    state: "Maharashtra",
    city: "Pune",
    description: "An annual college event for juniors and seniors with indoor and outdoor games, including a traditional day.",
    entry: 1500,
    image: "",
    qr: "",
  },
  {
    id: 4,
    title: "Freshers Party",
    date: "2026-11-15T12:23",
    location: "Auditorium, Main Campus",
    state: "Maharashtra",
    city: "Pune",
    description: "A welcome ceremony with cultural performances, interactive games, and a Mr. and Ms. Fresher contest.",
    entry: 0,
    image: "",
    qr: "",
  },
  {
    id: 5,
    title: "Introduction to Java",
    date: "2026-11-22T11:00",
    location: "Computer Lab 2, Tech Park, Hinjewadi",
    state: "Maharashtra",
    city: "Pune",
    description: "A beginner-friendly workshop covering Java basics, OOP concepts and a small hands-on project.",
    entry: 500,
    image: "",
    qr: "",
  },
  {
    id: 6,
    title: "Cyber Security Awareness Seminar",
    date: "2026-12-05T15:00",
    location: "Seminar Hall, Civil Lines, Nagpur",
    state: "Maharashtra",
    city: "Nagpur",
    description: "Learn how to stay safe online with live demos on phishing, password hygiene and safe browsing.",
    entry: 250,
    image: "",
    qr: "",
  },
  {
    id: 7,
    title: "Startup Pitch Day",
    date: "2026-12-18T10:30",
    location: "Innovation Hub, Navrangpura, Ahmedabad",
    state: "Gujarat",
    city: "Ahmedabad",
    description: "Early-stage founders pitch their ideas to investors and mentors. Networking session included.",
    entry: 800,
    image: "",
    qr: "",
  },
  {
    id: 8,
    title: "Annual Tech Fest 2027",
    date: "2027-01-10T09:00",
    location: "Convention Centre, Andheri East, Mumbai",
    state: "Maharashtra",
    city: "Mumbai",
    description: "Two days of coding contests, robotics, hackathons and keynote talks from industry leaders.",
    entry: 1200,
    image: "",
    qr: "",
  },
];

const MONTHS = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
const MONTHS_LONG = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const formatTime = (d) => {
  let h = d.getHours();
  const m = String(d.getMinutes()).padStart(2, "0");
  const ap = h >= 12 ? "PM" : "AM";
  h = h % 12 || 12;
  return `${String(h).padStart(2, "0")}:${m} ${ap}`;
};

function Eventinfo({ events = sampleEvents }) {
  const [stateVal, setStateVal] = useState("");
  const [cityVal, setCityVal] = useState("");
  const [nameVal, setNameVal] = useState("");
  const [applied, setApplied] = useState({ state: "", city: "", name: "" });

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
        (!q || e.title.toLowerCase().includes(q))
    );
  }, [events, applied]);

  const handleSearch = () => setApplied({ state: stateVal, city: cityVal, name: nameVal });

  return (
    <section 
     id="eventhub"
     className="eventinfo-section">
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

        {/* Events timeline */}
        {filtered.length === 0 ? (
          <p className="empty-event">No events found.</p>
        ) : (
          <div className="ev-list">
            {filtered.map((ev) => {
              const d = new Date(ev.date);
              return (
                <article className="ev-item" key={ev.id}>

                  {/* Date badge */}
                  <div className="ev-date">
                    <span className="ev-date-month">{MONTHS[d.getMonth()]}</span>
                    <strong className="ev-date-day">{String(d.getDate()).padStart(2, "0")}</strong>
                    <span className="ev-date-year">{d.getFullYear()}</span>
                  </div>

                  {/* Timeline dot */}
                  <span className="ev-dot" aria-hidden="true"></span>

                  {/* Card */}
                  <div className="ev-card">
                    <div className="ev-img">
                      {ev.image ? (
                        <img src={ev.image} alt={ev.title} />
                      ) : (
                        <div className="ev-img-fallback">
                          <Calendar size={42} />
                        </div>
                      )}
                    </div>

                    <div className="ev-body">
                      <div className="ev-tag">
                        <span className="ev-tag-line"></span>
                        Upcoming Event
                      </div>

                      <h3 className="ev-title">{ev.title}</h3>

                      <div className="ev-meta">
                        <span>
                          <Calendar size={15} />
                          {`${String(d.getDate()).padStart(2, "0")} ${MONTHS_LONG[d.getMonth()]} ${d.getFullYear()}  ${formatTime(d)}`}
                        </span>
                        <span className="ev-meta-light">
                          <MapPin size={15} />
                          {ev.location}
                        </span>
                      </div>

                      <p className="ev-desc">{ev.description}</p>

                      <div className="ev-foot">
                        <div className="ev-entry">
                          <span>ENTRY</span>
                          <strong>₹ {Number(ev.entry).toFixed(2)}</strong>
                        </div>
                        <button type="button" className="ev-view">
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
                        {ev.qr ? <img src={ev.qr} alt="QR code" /> : <QrCode size={70} />}
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
