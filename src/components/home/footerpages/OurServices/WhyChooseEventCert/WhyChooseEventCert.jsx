import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./WhyChooseEventCert.css";

// Navbar & Footer imports
import Navbar from "../../../../common/navbar/Navbar";
import Footer from "../../../../common/footer/Footer";

import {
  ShieldCheck,
  Zap,
  Clock,
  CheckCircle2,
  XCircle,
  ArrowRight,
  ArrowUp,
  Award,
  Globe,
  Smile,
  Headphones,
} from "lucide-react";

const COMPARISON_POINTS = [
  {
    feature: "Certificate Generation Speed",
    traditional: "Hours of manual editing per recipient",
    eventcert: "Thousands generated in seconds",
  },
  {
    feature: "Distribution Channel",
    traditional: "Manual email attachments or physical mail",
    eventcert: "Instant WhatsApp & Email broadcast",
  },
  {
    feature: "Authenticity & Security",
    traditional: "Prone to forgery and tampering",
    eventcert: "Cryptographic QR code verification",
  },
  {
    feature: "Data Management",
    traditional: "Scattered spreadsheets and local files",
    eventcert: "Centralized cloud dashboard and archives",
  },
];

const ADVANTAGES = [
  {
    icon: <Zap size={24} />,
    title: "Lightning-Fast Automation",
    desc: "Eliminate repetitive manual data entry. Upload a spreadsheet and watch your entire batch process instantly.",
    badge: "10x Faster",
  },
  {
    icon: <Globe size={24} />,
    title: "Multi-Channel Broadcast",
    desc: "Reach your audience directly on WhatsApp and email where they are most active, ensuring high open and engagement rates.",
    badge: "WhatsApp + Email",
  },
  {
    icon: <ShieldCheck size={24} />,
    title: "Unmatched Document Security",
    desc: "Protect your institution's reputation with tamper-proof digital credentials backed by unique verification QR codes.",
    badge: "Fraud-Proof",
  },
  {
    icon: <Smile size={24} />,
    title: "Zero Learning Curve",
    desc: "An intuitive interface allows event organizers, HR leaders, and educators to deploy campaigns with zero technical training.",
    badge: "User Friendly",
  },
  {
    icon: <Clock size={24} />,
    title: "24/7 Cloud Reliability",
    desc: "Access your dashboard, recipient logs, and custom certificate templates anytime, anywhere from any device.",
    badge: "Always Online",
  },
  {
    icon: <Headphones size={24} />,
    title: "Dedicated Support Team",
    desc: "Our technical experts are available around the clock to assist you with high-volume events and custom campaigns.",
    badge: "24/7 Assistance",
  },
];

function WhyChooseEventCert() {
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

      <main className="why-page">
        <div className="container">
          {/* ---- Header (No Hero) ---- */}
          <div className="why-header">
            <span className="why-badge">
              <Award size={18} />
              The EventCert Advantage
            </span>
            <h1>
              Why Choose <span>EventCert</span>?
            </h1>
            <p>
              Discover why leading schools, corporations, and independent event organizers trust
              EventCert to automate their certificate and greeting card workflows.
            </p>
          </div>

          {/* ---- Animated Highlight Banner ---- */}
          <div className="why-highlight-banner">
            <div className="why-highlight-content">
              <h2>Redefining Event Recognition</h2>
              <p>
                Traditional certificate creation is tedious, slow, and error-prone. EventCert replaces
                outdated workflows with an intelligent cloud ecosystem built for speed, beauty, and security.
              </p>
            </div>
            <div className="why-floating-badge-box">
              <div className="why-float-card f1">
                <ShieldCheck size={20} />
                <span>100% Secure & Verified</span>
              </div>
              <div className="why-float-card f2">
                <Zap size={20} />
                <span>Instant WhatsApp Delivery</span>
              </div>
            </div>
          </div>

          {/* ---- Interactive Comparison Section ---- */}
          <div className="why-comparison-section">
            <div className="why-section-title">
              <span className="why-sub-badge">Head-to-Head</span>
              <h2>Traditional Method vs. EventCert</h2>
              <p>See the massive leap in efficiency when you switch to automated digital credentials.</p>
            </div>

            <div className="why-table-wrapper">
              <div className="why-table-header">
                <div className="why-th-col">Feature Comparison</div>
                <div className="why-th-col old">Traditional Workflow</div>
                <div className="why-th-col new">EventCert Platform</div>
              </div>
              <div className="why-table-body">
                {COMPARISON_POINTS.map((item, index) => (
                  <div className="why-tr-row" key={index}>
                    <div className="why-td-col feature-name">
                      <strong>{item.feature}</strong>
                    </div>
                    <div className="why-td-col old">
                      <XCircle size={18} className="text-red" />
                      <span>{item.traditional}</span>
                    </div>
                    <div className="why-td-col new">
                      <CheckCircle2 size={18} className="text-teal" />
                      <span>{item.eventcert}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ---- Animated Advantage Cards Grid ---- */}
          <div className="why-grid-section">
            <div className="why-section-title">
              <span className="why-sub-badge">Core Pillars</span>
              <h2>Built to Empower Every Organizer</h2>
            </div>

            <div className="why-cards-grid">
              {ADVANTAGES.map((adv, idx) => (
                <div className="why-card" key={idx}>
                  <div className="why-card-top">
                    <div className="why-card-icon">{adv.icon}</div>
                    <span className="why-card-pill">{adv.badge}</span>
                  </div>
                  <h3>{adv.title}</h3>
                  <p>{adv.desc}</p>
                  <div className="why-card-glow"></div>
                </div>
              ))}
            </div>
          </div>

          {/* ---- CTA Box ---- */}
          <div className="why-cta-box">
            <div className="why-cta-text">
              <h3>Ready to transform your event experience?</h3>
              <p>Join thousands of satisfied organizers using EventCert today.</p>
            </div>
            <div className="why-cta-actions">
              <Link to="/subscription" className="why-btn-primary">
                Explore Plans
              </Link>
              <Link to="/contact" className="why-btn-secondary">
                Get in Touch
              </Link>
            </div>
          </div>
        </div>

        {/* Back to top */}
        <button
          type="button"
          className={`why-top ${showTop ? "show" : ""}`}
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

export default WhyChooseEventCert;