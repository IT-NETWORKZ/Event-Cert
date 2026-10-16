import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./AboutUs.css";

// Navbar & Footer imports
import Navbar from "../common/navbar/Navbar";
import Footer from "../common/footer/Footer";

import {
  ShieldCheck,
  Award,
  Users,
  Target,
  Sparkles,
  ArrowRight,
  ArrowUp,
  CheckCircle2,
  Megaphone,
  Mail,
  FileText,
} from "lucide-react";

const ABOUT_HIGHLIGHTS = [
  {
    icon: <Megaphone size={22} />,
    title: "Event Promotion",
    desc: "Promote seminars, conferences, competitions, and sports activities effortlessly to a wider audience.",
  },
  {
    icon: <Mail size={22} />,
    title: "Invitation Cards",
    desc: "Create and share heartfelt, custom-designed digital invitation cards instantly via email and WhatsApp.",
  },
  {
    icon: <FileText size={22} />,
    title: "Instant Certificates",
    desc: "Generate and broadcast professional achievement certificates with unique verification QR codes in seconds.",
  },
];

function AboutUs() {
  const [showTop, setShowTop] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 600);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <Navbar />

      <main className="about-page">
        <div className="container">
          {/* ---- Header Section ---- */}
          <div className="about-header">
            <span className="about-badge">
              <Sparkles size={18} />
              About Our Platform
            </span>
            <h1>
              ABOUT US <span>EventCert</span>
            </h1>
            <p className="about-subtitle">
              Transforming how schools, corporates, and event organizers manage recognition,
              invitations, and digital communications.
            </p>
          </div>

          {/* ---- Main Content Grid ---- */}
          <div className="about-grid-layout">
            {/* Left Column: Visual Showcase Cards */}
            <div className="about-visual-column">
              <div className="about-floating-card c1">
                <div className="about-card-icon">
                  <Megaphone size={24} />
                </div>
                <div>
                  <h4>Event Promotion</h4>
                  <p>Reach attendees instantly</p>
                </div>
              </div>

              <div className="about-floating-card c2">
                <div className="about-card-icon">
                  <FileText size={24} />
                </div>
                <div>
                  <h4>Digital Credentials</h4>
                  <p>Secure QR verification</p>
                </div>
              </div>

              <div className="about-glow-shape"></div>
            </div>

            {/* Right Column: Detailed Animated Content */}
            <div className="about-text-column">
              <div className="about-card-block">
                <ul className="about-check-list">
                  <li>
                    <CheckCircle2 size={18} />
                    <span>
                      EventCert is a next-generation platform designed to digitize and transform event
                      management and participant recognition.
                    </span>
                  </li>
                  <li>
                    <CheckCircle2 size={18} />
                    <span>
                      Our mission is simple — to make event organization effortless, modern, and paperless.
                    </span>
                  </li>
                  <li>
                    <CheckCircle2 size={18} />
                    <span>
                      We understand that managing events, whether seminars, competitions, workshops, or sports
                      meets, involves countless intricate details.
                    </span>
                  </li>
                  <li>
                    <CheckCircle2 size={18} />
                    <span>
                      Our goal is to simplify this journey, allowing organizers to focus entirely on
                      participants and celebration of achievements.
                    </span>
                  </li>
                </ul>
              </div>

              {/* Sub-Brand Section */}
              <div className="about-sub-section">
                <h2>
                  <Award size={26} />
                  EventCert Ecosystem
                </h2>
                <div className="about-features-row">
                  {ABOUT_HIGHLIGHTS.map((item, idx) => (
                    <div className="about-mini-card" key={idx}>
                      <div className="about-mini-icon">{item.icon}</div>
                      <h3>{item.title}</h3>
                      <p>{item.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* ---- Call To Action Banner ---- */}
          <div className="about-cta-box">
            <div className="about-cta-text">
              <h3>Ready to experience seamless event management?</h3>
              <p>Join top institutions and creators automating their certificates with EventCert.</p>
            </div>
            <div className="about-cta-actions">
              <Link to="/subscription" className="about-btn-primary">
                Explore Plans
              </Link>
              <Link to="/contact" className="about-btn-secondary">
                Contact Us
              </Link>
            </div>
          </div>
        </div>

        {/* Back to top button */}
        <button
          type="button"
          className={`about-top ${showTop ? "show" : ""}`}
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          aria-label="Back to top"
        >
          <ArrowUp size={20} />
        </button>
      </main>

      <Footer />
    </>
  );
}

export default AboutUs;