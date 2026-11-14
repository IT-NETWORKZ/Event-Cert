import { useRef, useState } from "react";
import "./Services.css";
import { useNavigate } from "react-router-dom";
import {
  ArrowRight,
  Megaphone,
  MailOpen,
  Gift,
  Award,
  Check,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

// Local images from src/assets/home/rimg (adjust the path if this file moves).
const localImages = import.meta.glob(
  "../../../assets/home/rimg/*.{png,jpg,jpeg,webp,avif,svg}",
  { eager: true, import: "default" }
);

// "OS-1.png", "os1.JPG", "OS_1.webp" all become the key "os1"
const imageMap = {};
Object.entries(localImages).forEach(([path, url]) => {
  const file = path.split("/").pop().replace(/\.[^.]+$/, "");
  imageMap[file.toLowerCase().replace(/[^a-z0-9]/g, "")] = url;
});

const osImg = (n) => imageMap[`os${n}`]; // undefined when the file is not in the folder

// Which OS images belong to which service. Re-arrange the numbers freely.
const services = [
  {
    id: "promo",
    icon: Megaphone,
    title: "Event Promotion",
    short: "Boost your event's reach with smart digital promotions.",
    detail:
      "Announce seminars, workshops and competitions with eye-catching banners and posters that are ready to share online.",
    points: [
      "Banners and posters sized for sharing",
      "Easy to customize for each event",
      "Consistent look across every promotion",
    ],
    images: [1, 2, 3],
  },
  {
    id: "invite",
    icon: MailOpen,
    title: "Invitation Cards",
    short: "Personalized, stylish invites that make every event feel special.",
    detail:
      "Choose a ready-made template or create your own design, then add the event details and send it to your guests.",
    points: [
      "Ready-made and custom designs",
      "Personalized for each guest",
      "Suited to formal and festive events",
    ],
    images: [4, 5, 6],
  },
  {
    id: "greeting",
    icon: Gift,
    title: "Greeting Cards / Events",
    short: "Share heartfelt wishes with beautifully designed greetings.",
    detail:
      "From festivals to birthdays and special days, send greetings that look polished and feel personal.",
    points: [
      "Festival, birthday and occasion themes",
      "Add your own name or message",
      "Share in a few clicks",
    ],
    images: [7, 8],
  },
  {
    id: "cert",
    icon: Award,
    title: "Certificates",
    short: "Recognize achievements instantly with professional certificates.",
    detail:
      "Create certificates for participants, winners and volunteers, with the same professional design every time.",
    points: [
      "Professional layouts for every occasion",
      "Quick to create, quick to deliver",
      "Ideal for schools, colleges and corporates",
    ],
    images: [9, 10],
  },
];

const qualities = ["Smart.", "Scalable.", "Seamless."];

function Services() {
  const navigate = useNavigate();
  const stageRef = useRef(null);
  const tabRefs = useRef([]);

  const [active, setActive] = useState(0);
  const [imgIdx, setImgIdx] = useState(0);
  const [failed, setFailed] = useState({});

  const service = services[active];
  const list = service.images;
  const current = list[imgIdx];
  const Icon = service.icon;

  const openService = (i) => {
    setActive(i);
    setImgIdx(0);
  };

  // arrow keys move between the service tabs
  const onTabKey = (e, i) => {
    let next = null;
    if (e.key === "ArrowRight") next = (i + 1) % services.length;
    if (e.key === "ArrowLeft") next = (i - 1 + services.length) % services.length;
    if (next !== null) {
      e.preventDefault();
      openService(next);
      tabRefs.current[next]?.focus();
    }
  };

  const step = (dir) => setImgIdx((i) => (i + dir + list.length) % list.length);
  const markFailed = (n) => setFailed((p) => ({ ...p, [n]: true }));
  const isMissing = (n) => failed[n] || !osImg(n);

  return (
    <section id="services" className="svc-section">
      <span className="svc-blob svc-blob-1" />
      <span className="svc-blob svc-blob-2" />

      <div className="svc-container">
        {/* ---------- HEADER ---------- */}
        <header className="svc-head">
          <h2 className="svc-title">
            <span className="svc-title-top">Our Creative</span>
            <span className="svc-title-pill">Services</span>
          </h2>

          <p>
            eventcert.com is a digital platform that simplifies how
            organizations and individuals create, manage and deliver event
            certificates, invitations and greeting cards.
          </p>
          <p>
            Whether it is a seminar, workshop, competition or celebration, you
            can design and share personalized, professional-looking
            certificates and cards in just a few clicks.
          </p>

          <p className="svc-tagline">
            Empower your events with EventCert.
            <span>
              {qualities.map((q) => (
                <b key={q}>{q}</b>
              ))}
            </span>
          </p>
        </header>

        {/* ---------- SERVICE TABS ---------- */}
        <div className="svc-tabs" role="tablist" aria-label="Our services">
          {services.map((s, i) => {
            const TabIcon = s.icon;
            const on = i === active;
            return (
              <button
                key={s.id}
                ref={(el) => (tabRefs.current[i] = el)}
                type="button"
                role="tab"
                id={`svc-tab-${s.id}`}
                aria-selected={on}
                aria-controls="svc-panel"
                tabIndex={on ? 0 : -1}
                className={`svc-tab ${on ? "is-on" : ""}`}
                onClick={() => openService(i)}
                onKeyDown={(e) => onTabKey(e, i)}
              >
                <span className="svc-tab-icon">
                  <TabIcon size={26} strokeWidth={1.7} />
                </span>
                <span className="svc-tab-title">{s.title}</span>
                <span className="svc-tab-short">{s.short}</span>
              </button>
            );
          })}
        </div>

        {/* ---------- SHOWCASE PANEL ---------- */}
        <div
          className="svc-panel"
          id="svc-panel"
          role="tabpanel"
          aria-labelledby={`svc-tab-${service.id}`}
        >
          {/* details */}
          <div className="svc-details" key={service.id}>
            <span className="svc-badge">
              <Icon size={16} strokeWidth={2} />
              {list.length} {list.length === 1 ? "design" : "designs"} to explore
            </span>
            <h3>{service.title}</h3>
            <p>{service.detail}</p>

            <ul>
              {service.points.map((p) => (
                <li key={p}>
                  <span>
                    <Check size={14} strokeWidth={3} />
                  </span>
                  {p}
                </li>
              ))}
            </ul>

            <button
              type="button"
              className="svc-link-btn"
              onClick={() => navigate("/contact")}
            >
              Get this design <ArrowRight size={16} />
            </button>
          </div>

          {/* stage */}
          <div className="svc-stage" ref={stageRef}>
            <div className="svc-view">
              {isMissing(current) ? (
                <div className="svc-missing">Image not available</div>
              ) : (
                <div className="svc-slide" key={`${service.id}-${current}`}>
                  <span
                    className="svc-bg"
                    style={{ backgroundImage: `url(${osImg(current)})` }}
                  />
                  <img
                    src={osImg(current)}
                    alt={`${service.title} sample ${imgIdx + 1}`}
                    onError={() => markFailed(current)}
                  />
                </div>
              )}

              <div className="svc-label">
                <strong>{service.title}</strong>
                <span>
                  {imgIdx + 1} / {list.length}
                </span>
              </div>

              {list.length > 1 && (
                <>
                  <button
                    type="button"
                    className="svc-arrow svc-arrow-prev"
                    onClick={() => step(-1)}
                    aria-label="Previous sample"
                  >
                    <ChevronLeft size={22} />
                  </button>
                  <button
                    type="button"
                    className="svc-arrow svc-arrow-next"
                    onClick={() => step(1)}
                    aria-label="Next sample"
                  >
                    <ChevronRight size={22} />
                  </button>
                </>
              )}
            </div>
          </div>
        </div>

        {/* ---------- CTA ---------- */}
        <div className="svc-cta">
          <div>
            <h3>Need something custom?</h3>
            <p>Have a question or need a custom design? We're happy to help.</p>
          </div>
          <button
            type="button"
            className="svc-cta-btn"
            onClick={() => navigate("/contact")}
          >
            Contact Us <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </section>
  );
}

export default Services;