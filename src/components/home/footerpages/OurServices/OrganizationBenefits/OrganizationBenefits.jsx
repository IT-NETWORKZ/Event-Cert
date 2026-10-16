import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./OrganizationBenefits.css";

// Navbar & Footer imports
import Navbar from "../../../../common/navbar/Navbar";
import Footer from "../../../../common/footer/Footer";

import {
  Building2,
  Award,
  Zap,
  ShieldCheck,
  TrendingUp,
  Users,
  CheckCircle2,
  ArrowRight,
  ArrowUp,
  FileSpreadsheet,
  Palette,
  Send,
} from "lucide-react";

const WORKFLOW_STEPS = [
  {
    step: "01",
    title: "Upload Template & Assets",
    desc: "Design or upload your custom branded institutional/corporate template, including official logos, digital signatures, and background layouts.",
    icon: <Palette size={22} />,
  },
  {
    step: "02",
    title: "Import Recipient Data",
    desc: "Seamlessly upload your participant spreadsheet via CSV or Excel containing names, emails, phone numbers, and unique designations.",
    icon: <FileSpreadsheet size={22} />,
  },
  {
    step: "03",
    title: "Automated Bulk Distribution",
    desc: "Broadcast verified certificates and custom greeting cards directly to recipients' email inboxes and WhatsApp numbers instantly.",
    icon: <Send size={22} />,
  },
];

const BENEFITS_GRID = [
  {
    icon: <Zap size={24} />,
    title: "Operational Efficiency & Automation",
    desc: "Eliminate manual certificate generation, formatting errors, and physical dispatch overhead. Automate your entire recognition pipeline in minutes.",
  },
  {
    icon: <ShieldCheck size={24} />,
    title: "Tamper-Proof & Secure Validation",
    desc: "Protect institutional reputation with secure digital verification credentials that prevent forgery and validate authentic achievement.",
  },
  {
    icon: <TrendingUp size={24} />,
    title: "Enhanced Brand Engagement",
    desc: "Deliver memorable milestone experiences directly to participants' WhatsApp and email channels, driving higher engagement and institutional loyalty.",
  },
  {
    icon: <Users size={24} />,
    title: "Scalable for High-Volume Events",
    desc: "Whether hosting an internal corporate seminar, university convocation, or global webinar with thousands of attendees, scale delivery effortlessly.",
  },
];

function OrganizationBenefits() {
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

      <main className="org-benefits-page">
        <div className="container">
          {/* ---- Header (No Hero) ---- */}
          <div className="org-header">
            <span className="org-badge">
              <Building2 size={18} />
              Enterprise & Institutional Solutions
            </span>
            <h1>
              Organization <span>Benefits</span>
            </h1>
            <p>
              Empower your institution, corporation, or training academy with automated certificate
              generation and professional digital credentialing.
            </p>
          </div>

          {/* ---- Value Proposition Intro ---- */}
          <div className="org-intro-card">
            <div className="org-intro-text">
              <h2>Transforming Achievement Recognition at Scale</h2>
              <p>
                Modern organizations demand streamlined digital workflows. EventCert enables academic
                institutions, HR departments, and enterprise event organizers to replace manual paperwork
                with high-speed, secure, multi-channel certificate distribution.
              </p>
            </div>
            <div className="org-intro-stats">
              <div className="org-stat-item">
                <h3>99.9%</h3>
                <p>Delivery Accuracy</p>
              </div>
              <div className="org-stat-item">
                <h3>10x</h3>
                <p>Faster Distribution</p>
              </div>
            </div>
          </div>

          {/* ---- Workflow / Flowchart Section ---- */}
          <div className="org-flowchart-section">
            <div className="org-section-title">
              <span className="org-sub-badge">Workflow Architecture</span>
              <h2>How EventCert Streamlines Your Operations</h2>
              <p>A structured 3-step pipeline designed to take your event from conclusion to recognition instantly.</p>
            </div>

            <div className="org-flow-grid">
              {WORKFLOW_STEPS.map((item, index) => (
                <div className="org-flow-card" key={item.step}>
                  <div className="org-flow-top">
                    <span className="org-flow-num">{item.step}</span>
                    <div className="org-flow-icon">{item.icon}</div>
                  </div>
                  <h3>{item.title}</h3>
                  <p>{item.desc}</p>
                  {index < WORKFLOW_STEPS.length - 1 && (
                    <div className="org-flow-arrow">
                      <ArrowRight size={20} />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* ---- Detailed Benefits Grid ---- */}
          <div className="org-benefits-grid-section">
            <div className="org-section-title">
              <span className="org-sub-badge">Core Advantages</span>
              <h2>Why Leading Institutions Choose EventCert</h2>
            </div>

            <div className="org-grid">
              {BENEFITS_GRID.map((b, i) => (
                <div className="org-card" key={i}>
                  <div className="org-card-icon">{b.icon}</div>
                  <h3>{b.title}</h3>
                  <p>{b.desc}</p>
                  <ul className="org-card-list">
                    <li>
                      <CheckCircle2 size={16} />
                      <span>Optimized for workflow integration</span>
                    </li>
                    <li>
                      <CheckCircle2 size={16} />
                      <span>Zero paper waste & eco-friendly</span>
                    </li>
                  </ul>
                </div>
              ))}
            </div>
          </div>

          {/* ---- CTA Box ---- */}
          <div className="org-cta-box">
            <div className="org-cta-text">
              <h3>Ready to modernize your organization's credentialing?</h3>
              <p>Join top schools and corporations utilizing EventCert for instant certificate automation.</p>
            </div>
            <div className="org-cta-actions">
              <Link to="/subscription" className="org-btn-primary">
                View Plans & Pricing
              </Link>
              <Link to="/contact" className="org-btn-secondary">
                Contact Enterprise Sales
              </Link>
            </div>
          </div>
        </div>

        {/* Back to top */}
        <button
          type="button"
          className={`org-top ${showTop ? "show" : ""}`}
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

export default OrganizationBenefits;