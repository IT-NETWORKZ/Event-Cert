import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./GetStarted.css";

// Navbar & Footer imports
import Navbar from "../../../../common/navbar/Navbar";
import Footer from "../../../../common/footer/Footer";

import {
  Rocket,
  UserPlus,
  Palette,
  FileSpreadsheet,
  Send,
  ArrowRight,
  ArrowUp,
  CheckCircle2,
} from "lucide-react";

const QUICK_STEPS = [
  {
    step: "01",
    title: "Create Your Account",
    desc: "Sign up on EventCert in seconds using your email or Google account to access your personal dashboard.",
    icon: <UserPlus size={22} />,
  },
  {
    step: "02",
    title: "Upload Template & Branding",
    desc: "Design your custom certificate or greeting card layout, or upload your own branded background, logos, and signatures.",
    icon: <Palette size={22} />,
  },
  {
    step: "03",
    title: "Import Recipient List",
    desc: "Upload a simple Excel or CSV spreadsheet containing your participants' names, email addresses, and phone numbers.",
    icon: <FileSpreadsheet size={22} />,
  },
  {
    step: "04",
    title: "Instant Multi-Channel Broadcast",
    desc: "Hit send and watch EventCert deliver personalized certificates directly via WhatsApp and secure email links instantly.",
    icon: <Send size={22} />,
  },
];

function GetStarted() {
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

      <main className="started-page">
        <div className="container">
          {/* ---- Header (No Hero) ---- */}
          <div className="started-header">
            <span className="started-badge">
              <Rocket size={18} />
              Quick Onboarding Guide
            </span>
            <h1>
              Get Started In <span>Minutes</span>
            </h1>
            <p>
              Launch your first automated certificate and greeting card campaign effortlessly
              by following our simple 4-step quickstart process.
            </p>
          </div>

          {/* ---- Quick Overview Banner ---- */}
          <div className="started-intro-banner">
            <div className="started-intro-text">
              <h2>No Technical Skills Required</h2>
              <p>
                EventCert is built for speed and simplicity. Whether you are hosting a small workshop
                or a massive corporate summit, you can deploy professional digital credentials in under 5 minutes.
              </p>
            </div>
            <div className="started-intro-chips">
              <span><CheckCircle2 size={16} /> Free Setup</span>
              <span><CheckCircle2 size={16} /> No Credit Card Required</span>
              <span><CheckCircle2 size={16} /> Instant WhatsApp & Email</span>
            </div>
          </div>

          {/* ---- Steps Grid / Flow ---- */}
          <div className="started-steps-section">
            <div className="started-section-title">
              <span className="started-sub-badge">Step-by-Step Walkthrough</span>
              <h2>Your Path to Automated Recognition</h2>
            </div>

            <div className="started-steps-grid">
              {QUICK_STEPS.map((item, index) => (
                <div className="started-step-card" key={item.step}>
                  <div className="started-step-top">
                    <span className="started-step-num">{item.step}</span>
                    <div className="started-step-icon">{item.icon}</div>
                  </div>
                  <h3>{item.title}</h3>
                  <p>{item.desc}</p>
                  {index < QUICK_STEPS.length - 1 && (
                    <div className="started-step-arrow">
                      <ArrowRight size={18} />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* ---- CTA Box ---- */}
          <div className="started-cta-box">
            <div className="started-cta-text">
              <h3>Ready to create your first certificate?</h3>
              <p>Join EventCert today and automate your event communication pipeline.</p>
            </div>
            <div className="started-cta-actions">
              <Link to="/subscription" className="started-btn-primary">
                Get Started Free
              </Link>
              <Link to="/contact" className="started-btn-secondary">
                Contact Support
              </Link>
            </div>
          </div>
        </div>

        {/* Back to top */}
        <button
          type="button"
          className={`started-top ${showTop ? "show" : ""}`}
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

export default GetStarted;