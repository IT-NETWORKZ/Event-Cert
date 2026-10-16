import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./IndividualBenefits.css";

// Navbar & Footer imports
import Navbar from "../../../../common/navbar/Navbar";
import Footer from "../../../../common/footer/Footer";

import {
  UserCheck,
  Award,
  Zap,
  Share2,
  Briefcase,
  CheckCircle2,
  ArrowRight,
  ArrowUp,
  UserPlus,
  Sparkles,
  Send,
} from "lucide-react";

const INDIVIDUAL_STEPS = [
  {
    step: "01",
    title: "Create or Select Profile",
    desc: "Set up your personal organizer account or professional portfolio details in just a few clicks.",
    icon: <UserPlus size={22} />,
  },
  {
    step: "02",
    title: "Design Custom Certificates",
    desc: "Utilize our intuitive editor to craft stunning certificates or greeting cards for your workshop participants.",
    icon: <Sparkles size={22} />,
  },
  {
    step: "03",
    title: "Instant One-Click Dispatch",
    desc: "Send personalized achievement credentials directly to attendee WhatsApp chats and email inboxes instantly.",
    icon: <Send size={22} />,
  },
];

const INDIVIDUAL_BENEFITS_GRID = [
  {
    icon: <Award size={24} />,
    title: "Professional Credibility",
    desc: "Elevate your workshops, masterclasses, or freelance training sessions by issuing professional, verifiable digital certificates.",
  },
  {
    icon: <Zap size={24} />,
    title: "Time-Saving Automation",
    desc: "Say goodbye to manual name-editing in Photoshop or Word. Generate hundreds of personalized certificates in seconds.",
  },
  {
    icon: <Share2 size={24} />,
    title: "Multi-Channel Sharing",
    desc: "Deliver credentials seamlessly where your audience is most active—directly via WhatsApp and secure email links.",
  },
  {
    icon: <Briefcase size={24} />,
    title: "Portfolio & Brand Growth",
    desc: "Build your personal brand as an expert educator or event host with custom-branded recognition assets.",
  },
];

function IndividualBenefits() {
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

      <main className="ind-benefits-page">
        <div className="container">
          {/* ---- Header (No Hero) ---- */}
          <div className="ind-header">
            <span className="ind-badge">
              <UserCheck size={18} />
              For Creators, Freelancers & Educators
            </span>
            <h1>
              Individual <span>Benefits</span>
            </h1>
            <p>
              Empower your personal workshops, webinars, and coaching sessions with professional
              digital certificates and instant WhatsApp distribution.
            </p>
          </div>

          {/* ---- Value Proposition Intro ---- */}
          <div className="ind-intro-card">
            <div className="ind-intro-text">
              <h2>Elevate Your Independent Events & Workshops</h2>
              <p>
                Whether you are hosting online coding bootcamps, freelance design masterclasses, or fitness
                challenges, EventCert gives independent creators enterprise-grade tools to recognize
                participant milestones effortlessly.
              </p>
            </div>
            <div className="ind-intro-stats">
              <div className="ind-stat-item">
                <h3>100%</h3>
                <p>Cloud-Based</p>
              </div>
              <div className="ind-stat-item">
                <h3>5 Min</h3>
                <p>Setup Time</p>
              </div>
            </div>
          </div>

          {/* ---- Step-by-Step Flowchart Section ---- */}
          <div className="ind-flowchart-section">
            <div className="ind-section-title">
              <span className="ind-sub-badge">Simple Workflow</span>
              <h2>How EventCert Works for Individuals</h2>
              <p>A streamlined 3-step execution pipeline built for solo creators and independent hosts.</p>
            </div>

            <div className="ind-flow-grid">
              {INDIVIDUAL_STEPS.map((item, index) => (
                <div className="ind-flow-card" key={item.step}>
                  <div className="ind-flow-top">
                    <span className="ind-flow-num">{item.step}</span>
                    <div className="ind-flow-icon">{item.icon}</div>
                  </div>
                  <h3>{item.title}</h3>
                  <p>{item.desc}</p>
                  {index < INDIVIDUAL_STEPS.length - 1 && (
                    <div className="ind-flow-arrow">
                      <ArrowRight size={20} />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* ---- Detailed Benefits Grid ---- */}
          <div className="ind-benefits-grid-section">
            <div className="ind-section-title">
              <span className="ind-sub-badge">Core Advantages</span>
              <h2>Designed to Make Your Events Stand Out</h2>
            </div>

            <div className="ind-grid">
              {INDIVIDUAL_BENEFITS_GRID.map((b, i) => (
                <div className="ind-card" key={i}>
                  <div className="ind-card-icon">{b.icon}</div>
                  <h3>{b.title}</h3>
                  <p>{b.desc}</p>
                  <ul className="ind-card-list">
                    <li>
                      <CheckCircle2 size={16} />
                      <span>No technical design skills required</span>
                    </li>
                    <li>
                      <CheckCircle2 size={16} />
                      <span>Instant participant satisfaction</span>
                    </li>
                  </ul>
                </div>
              ))}
            </div>
          </div>

          {/* ---- CTA Box ---- */}
          <div className="ind-cta-box">
            <div className="ind-cta-text">
              <h3>Ready to issue your first professional certificate?</h3>
              <p>Start creating memorable digital experiences for your attendees today.</p>
            </div>
            <div className="ind-cta-actions">
              <Link to="/subscription" className="ind-btn-primary">
                Get Started Free
              </Link>
              <Link to="/contact" className="ind-btn-secondary">
                Contact Support
              </Link>
            </div>
          </div>
        </div>

        {/* Back to top */}
        <button
          type="button"
          className={`ind-top ${showTop ? "show" : ""}`}
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

export default IndividualBenefits;