import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./KeyFeatures.css";

// Navbar & Footer imports
import Navbar from "../../../../common/navbar/Navbar";
import Footer from "../../../../common/footer/Footer";

import {
  Sparkles,
  FileSpreadsheet,
  Send,
  ShieldCheck,
  LayoutTemplate,
  QrCode,
  CheckCircle2,
  ArrowRight,
  ArrowUp,
  Cpu,
} from "lucide-react";

const CORE_FEATURES = [
  {
    icon: <LayoutTemplate size={24} />,
    title: "Custom Template Builder",
    desc: "Design or upload your unique certificate and greeting card templates. Easily customize layouts, fonts, logos, and digital signatures to match your institution's brand.",
  },
  {
    icon: <FileSpreadsheet size={24} />,
    title: "Bulk Data Import",
    desc: "Upload participant spreadsheets via CSV or Excel format. EventCert automatically maps recipient names, emails, phone numbers, and custom variables.",
  },
  {
    icon: <Send size={24} />,
    title: "Multi-Channel Broadcast",
    desc: "Distribute certificates and greeting cards instantly across multiple channels including direct WhatsApp messages and secure email inboxes.",
  },
  {
    icon: <QrCode size={24} />,
    title: "Secure QR Code Verification",
    desc: "Every generated certificate includes a unique cryptographic QR code enabling instant authenticity checks and preventing document fraud.",
  },
  {
    icon: <Cpu size={24} />,
    title: "Automated Generation Engine",
    desc: "Generate thousands of personalized certificates in mere seconds without formatting errors, manual name adjustments, or technical bottlenecks.",
  },
  {
    icon: <ShieldCheck size={24} />,
    title: "Cloud Storage & Dashboard",
    desc: "Access your complete event history, download archives, monitor delivery status reports, and manage recipient data securely from your centralized dashboard.",
  },
];

function KeyFeatures() {
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

      <main className="features-page">
        <div className="container">
          {/* ---- Header (No Hero) ---- */}
          <div className="features-header">
            <span className="features-badge">
              <Sparkles size={18} />
              Platform Capabilities
            </span>
            <h1>
              Key <span>Features</span>
            </h1>
            <p>
              Discover the powerful tools and automated workflows designed to make certificate
              creation and multi-channel event communication seamless.
            </p>
          </div>

          {/* ---- Value Proposition Intro ---- */}
          <div className="features-intro-card">
            <div className="features-intro-text">
              <h2>Engineered for Speed, Precision, and Scale</h2>
              <p>
                EventCert combines advanced document generation with direct messaging integrations.
                Whether you are managing a small workshop or a massive global convention, our feature set
                guarantees professional delivery every single time.
              </p>
            </div>
            <div className="features-intro-stats">
              <div className="features-stat-item">
                <h3>100%</h3>
                <p>Automated Flow</p>
              </div>
              <div className="features-stat-item">
                <h3>24/7</h3>
                <p>Cloud Access</p>
              </div>
            </div>
          </div>

          {/* ---- Features Grid Section ---- */}
          <div className="features-grid-section">
            <div className="features-section-title">
              <span className="features-sub-badge">Core Functionality</span>
              <h2>Everything You Need to Recognize Achievement</h2>
            </div>

            <div className="features-grid">
              {CORE_FEATURES.map((feat, i) => (
                <div className="features-card" key={i}>
                  <div className="features-card-icon">{feat.icon}</div>
                  <h3>{feat.title}</h3>
                  <p>{feat.desc}</p>
                  <ul className="features-card-list">
                    <li>
                      <CheckCircle2 size={16} />
                      <span>Instant deployment</span>
                    </li>
                    <li>
                      <CheckCircle2 size={16} />
                      <span>Enterprise-grade reliability</span>
                    </li>
                  </ul>
                </div>
              ))}
            </div>
          </div>

          {/* ---- CTA Box ---- */}
          <div className="features-cta-box">
            <div className="features-cta-text">
              <h3>Experience the power of automated certification today.</h3>
              <p>Streamline your next event with EventCert's robust platform features.</p>
            </div>
            <div className="features-cta-actions">
              <Link to="/subscription" className="features-btn-primary">
                View Pricing Plans
              </Link>
              <Link to="/contact" className="features-btn-secondary">
                Request a Demo
              </Link>
            </div>
          </div>
        </div>

        {/* Back to top */}
        <button
          type="button"
          className={`features-top ${showTop ? "show" : ""}`}
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

export default KeyFeatures;