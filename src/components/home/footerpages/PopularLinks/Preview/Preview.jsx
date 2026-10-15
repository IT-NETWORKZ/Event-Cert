import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Preview.css";

import Navbar from "../../../../common/navbar/Navbar";
import Footer from "../../../../common/footer/Footer";

import {
  Search,
  Eye,
  Sparkles,
  Award,
  Cake,
  Gift,
  Mail,
  Heart,
  LayoutGrid,
  X,
  ChevronLeft,
  ChevronRight,
  Palette,
  Download,
  Share2,
  Zap,
  MousePointerClick,
  Send,
} from "lucide-react";

/* ---------- Categories ---------- */
const CATEGORIES = [
  { key: "All", icon: LayoutGrid },
  { key: "Certificates", icon: Award },
  { key: "Birthday", icon: Cake },
  { key: "Festival", icon: Sparkles },
  { key: "Invitation", icon: Mail },
  { key: "Greeting", icon: Heart },
  { key: "Appreciation", icon: Gift },
];

/* ---------- Sample designs (replace "image" with your real card URLs) ---------- */
const designs = [
  { title: "Certificate of Participation", cat: "Certificates", shape: "land" },
  { title: "Certificate of Recognition", cat: "Certificates", shape: "port" },
  { title: "Certificate of Completion", cat: "Certificates", shape: "land" },
  { title: "Certificate of Achievement", cat: "Certificates", shape: "land" },
  { title: "Outstanding Performance", cat: "Certificates", shape: "port" },
  { title: "Certificate of Excellence", cat: "Certificates", shape: "land" },
  { title: "Happy Birthday", cat: "Birthday", shape: "land" },
  { title: "Birthday Wishes", cat: "Birthday", shape: "square" },
  { title: "Sweet Sixteen", cat: "Birthday", shape: "port" },
  { title: "Kids Birthday Bash", cat: "Birthday", shape: "land" },
  { title: "Happy Dhanteras", cat: "Festival", shape: "square" },
  { title: "Happy Diwali", cat: "Festival", shape: "port" },
  { title: "Happy Holi", cat: "Festival", shape: "land" },
  { title: "Eid Mubarak", cat: "Festival", shape: "square" },
  { title: "Merry Christmas", cat: "Festival", shape: "land" },
  { title: "Happy New Year", cat: "Festival", shape: "port" },
  { title: "Annual Day Invitation", cat: "Invitation", shape: "port" },
  { title: "Seminar Invitation", cat: "Invitation", shape: "land" },
  { title: "Workshop Invitation", cat: "Invitation", shape: "square" },
  { title: "Wedding Invitation", cat: "Invitation", shape: "port" },
  { title: "Thank You Card", cat: "Greeting", shape: "land" },
  { title: "Good Luck", cat: "Greeting", shape: "square" },
  { title: "Congratulations", cat: "Greeting", shape: "land" },
  { title: "Best Wishes", cat: "Greeting", shape: "port" },
  { title: "Certificate of Appreciation", cat: "Appreciation", shape: "port" },
  { title: "Employee of the Month", cat: "Appreciation", shape: "land" },
  { title: "Best Volunteer", cat: "Appreciation", shape: "square" },
  { title: "Team Spirit Award", cat: "Appreciation", shape: "land" },
  { title: "Guest Speaker Thanks", cat: "Appreciation", shape: "port" },
  { title: "Sports Day Winner", cat: "Certificates", shape: "square" },
  { title: "Teacher's Day", cat: "Greeting", shape: "land" },
  { title: "Women's Day", cat: "Greeting", shape: "port" },
  { title: "Republic Day", cat: "Festival", shape: "land" },
  { title: "Graduation Day", cat: "Invitation", shape: "land" },
  { title: "Farewell Party", cat: "Invitation", shape: "square" },
  { title: "Welcome Freshers", cat: "Invitation", shape: "port" },
].map((d, i) => ({ ...d, id: i + 1, variant: (i % 5) + 1, image: "" }));

const PER_PAGE = 12;

const FEATURES = [
  { icon: Palette, title: "Fully Customizable", text: "Change text, colours, logos and photos to match your event." },
  { icon: Zap, title: "Ready in Minutes", text: "Pick a design, add names and generate hundreds of cards instantly." },
  { icon: Download, title: "Download Anywhere", text: "Save as image or PDF in print-ready quality." },
  { icon: Share2, title: "Share Instantly", text: "Send by email or WhatsApp straight to each recipient." },
];

const STEPS = [
  { icon: MousePointerClick, title: "Choose a Design", text: "Browse the gallery and pick the card that fits your occasion." },
  { icon: Palette, title: "Personalize It", text: "Add recipient names, event details, logos and signatures." },
  { icon: Send, title: "Send or Download", text: "Share it with everyone or download it in one click." },
];

function Preview() {
  const navigate = useNavigate();
  const [cat, setCat] = useState("All");
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [active, setActive] = useState(null); // design shown in the popup

  // Always open the page from the top
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const counts = useMemo(() => {
    const c = { All: designs.length };
    designs.forEach((d) => (c[d.cat] = (c[d.cat] || 0) + 1));
    return c;
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return designs.filter(
      (d) => (cat === "All" || d.cat === cat) && (!q || d.title.toLowerCase().includes(q))
    );
  }, [cat, query]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const current = Math.min(page, totalPages);
  const visible = filtered.slice((current - 1) * PER_PAGE, current * PER_PAGE);

  const goPage = (p) => {
    setPage(p);
    const grid = document.getElementById("pv-gallery");
    if (grid) grid.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const pickCat = (key) => {
    setCat(key);
    setPage(1);
  };

  // Esc closes popup + lock page scroll while it is open
  useEffect(() => {
    if (!active) return;
    const onKey = (e) => e.key === "Escape" && setActive(null);
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [active]);

  const useDesign = () => navigate("/subscription"); // change to your "create card" route

  const Pagination = () => (
    <div className="pv-pager">
      <button type="button" disabled={current === 1} onClick={() => goPage(current - 1)} aria-label="Previous page">
        <ChevronLeft size={18} />
      </button>
      {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
        <button
          key={p}
          type="button"
          className={p === current ? "active" : ""}
          onClick={() => goPage(p)}
        >
          {p}
        </button>
      ))}
      <button type="button" disabled={current === totalPages} onClick={() => goPage(current + 1)}>
        Next <ChevronRight size={16} />
      </button>
    </div>
  );

  const Art = ({ d, large }) =>
    d.image ? (
      <img src={d.image} alt={d.title} className="pv-img" />
    ) : (
      <div className={`pv-art pv-${d.shape} pv-v${d.variant} ${large ? "pv-art-lg" : ""}`}>
        <span className="pv-art-circle c1"></span>
        <span className="pv-art-circle c2"></span>
        <div className="pv-art-frame">
          <small>{d.cat === "Certificates" || d.cat === "Appreciation" ? "CERTIFICATE" : d.cat.toUpperCase()}</small>
          <strong>{d.title}</strong>
          <i></i>
          <em>Your Name Here</em>
        </div>
      </div>
    );

  return (
    <>
      {/* ================= NAVBAR ================= */}
      <Navbar />

      <main className="pv-page">

        {/* ================= HERO ================= */}
        <section className="pv-hero">
          <span className="pv-blob b1"></span>
          <span className="pv-blob b2"></span>
          <div className="container">
            <h1>
              Card <span>Preview</span> Gallery
            </h1>
            <p className="pv-hero-sub">
              Explore certificates, greeting cards, invitations and festival wishes. Pick a design,
              personalize it and share it in minutes.
            </p>
            <div className="pv-stats">
              <div><strong>{designs.length}+</strong><span>Designs</span></div>
              <div><strong>{CATEGORIES.length - 1}</strong><span>Categories</span></div>
              <div><strong>100%</strong><span>Customizable</span></div>
            </div>
          </div>
        </section>

        {/* ================= GALLERY ================= */}
        <section className="pv-gallery" id="pv-gallery">
          <div className="container">

            {/* Toolbar */}
            <div className="pv-toolbar">
              <div className="pv-search">
                <Search size={18} />
                <input
                  type="text"
                  placeholder="Search cards, e.g. Birthday"
                  value={query}
                  onChange={(e) => {
                    setQuery(e.target.value);
                    setPage(1);
                  }}
                />
                {query && (
                  <button type="button" onClick={() => setQuery("")} aria-label="Clear search">
                    <X size={16} />
                  </button>
                )}
              </div>
              <Pagination />
            </div>

            {/* Category chips */}
            <div className="pv-chips">
              {CATEGORIES.map(({ key, icon: Icon }) => (
                <button
                  key={key}
                  type="button"
                  className={`pv-chip ${cat === key ? "active" : ""}`}
                  onClick={() => pickCat(key)}
                >
                  <Icon size={15} /> {key}
                  <b>{counts[key] || 0}</b>
                </button>
              ))}
            </div>

            <p className="pv-result">
              Showing <b>{visible.length}</b> of <b>{filtered.length}</b> designs
            </p>

            {/* Masonry grid */}
            {visible.length === 0 ? (
              <div className="pv-empty">
                <Search size={38} />
                <h4>No designs found</h4>
                <p>Try another keyword or choose a different category.</p>
              </div>
            ) : (
              <div className="pv-grid" key={`${cat}-${current}-${query}`}>
                {visible.map((d, i) => (
                  <article className="pv-card" key={d.id} style={{ "--i": i }}>
                    <div className="pv-thumb">
                      <Art d={d} />
                      {/* hover overlay: desktop only */}
                      <div className="pv-overlay">
                        <button type="button" className="pv-btn-light" onClick={() => setActive(d)}>
                          <Eye size={16} /> Preview
                        </button>
                        <button type="button" className="pv-btn-solid" onClick={useDesign}>
                          Use Design
                        </button>
                      </div>
                    </div>
                    <div className="pv-info">
                      <h4>{d.title}</h4>
                      <span>{d.cat}</span>
                    </div>
                    {/* action row: tablet + mobile only (no hover on touch screens) */}
                    <div className="pv-actions">
                      <button type="button" className="pv-act-light" onClick={() => setActive(d)}>
                        <Eye size={14} /> Preview
                      </button>
                      <button type="button" className="pv-act-solid" onClick={useDesign}>
                        Use Design
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            )}

            <div className="pv-pager-bottom">
              <Pagination />
            </div>
          </div>
        </section>

        {/* ================= WHY ================= */}
        <section className="pv-why">
          <div className="container">
            <div className="text-center">
              <h2 className="pv-h2">Why Choose Our <span>Templates</span></h2>
              <div className="pv-line"></div>
            </div>
            <div className="pv-features">
              {FEATURES.map(({ icon: Icon, title, text }) => (
                <div className="pv-feature" key={title}>
                  <span className="pv-feature-icon"><Icon size={26} /></span>
                  <h5>{title}</h5>
                  <p>{text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ================= STEPS ================= */}
        <section className="pv-steps-wrap">
          <div className="container">
            <div className="text-center">
              <h2 className="pv-h2">How It <span>Works</span></h2>
              <div className="pv-line"></div>
            </div>
            <div className="pv-steps">
              {STEPS.map(({ icon: Icon, title, text }, i) => (
                <div className="pv-step" key={title}>
                  <span className="pv-step-no">{i + 1}</span>
                  <Icon size={30} />
                  <h5>{title}</h5>
                  <p>{text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ================= CTA ================= */}
        <section className="pv-cta">
          <div className="container">
            <div className="pv-cta-box">
              <div>
                <h3>Ready to create your first card?</h3>
                <p>Choose a design, add your details and share it with everyone in minutes.</p>
              </div>
              <button type="button" onClick={useDesign}>Get Started</button>
            </div>
          </div>
        </section>

        {/* ================= POPUP ================= */}
        {active && (
          <div className="pv-modal" onClick={() => setActive(null)}>
            <div className="pv-modal-box" onClick={(e) => e.stopPropagation()}>
              <button type="button" className="pv-modal-close" onClick={() => setActive(null)} aria-label="Close">
                <X size={20} />
              </button>
              <div className="pv-modal-art">
                <Art d={active} large />
              </div>
              <div className="pv-modal-info">
                <span className="pv-modal-cat">{active.cat}</span>
                <h3>{active.title}</h3>
                <p>
                  A clean, editable design. Add your own text, logo and colours, then download it
                  or send it directly to your recipients.
                </p>
                <ul>
                  <li>High-quality print-ready output</li>
                  <li>Bulk generation from an Excel sheet</li>
                  <li>Share by email or WhatsApp</li>
                </ul>
                <button type="button" className="pv-btn-solid pv-btn-big" onClick={useDesign}>
                  Use This Design
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* ================= FOOTER ================= */}
      <Footer />
    </>
  );
}

export default Preview;