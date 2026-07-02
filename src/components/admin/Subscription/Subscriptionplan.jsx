import { useState } from "react";
import "./Subscriptionplan.css";

import {
  FaCheckCircle,
  FaCrown,
  FaCertificate,
  FaCalendarAlt,
  FaDownload,
} from "react-icons/fa";

import subscriptionPlans from "./subscriptionData";

function Subscriptionplan() {
  const [activeTab, setActiveTab] = useState("Certificate");

  // Filter plans based on the active tab selection
  const filteredPlans = subscriptionPlans.filter(
    (plan) => plan.type?.toLowerCase() === activeTab.toLowerCase() || plan.category?.toLowerCase() === activeTab.toLowerCase() || true
  );

  return (
    <div className="subscription-page">
      {/* Tightened Hero Section */}
      <section className="subscription-hero">
        <div className="subscription-overlay">
          <h1>Pricing & Subscription Plans</h1>
          <p>
            Choose the perfect plan for your organization. Create professional certificates, manage events, and grow with EventCert.
          </p>
        </div>
      </section>

      {/* Navigation Tabs */}
      <div className="subscription-tabs">
        <button
          className={activeTab === "Certificate" ? "active" : ""}
          onClick={() => setActiveTab("Certificate")}
        >
          <FaCertificate />
          Certificate
        </button>

        <button
          className={activeTab === "Event" ? "active" : ""}
          onClick={() => setActiveTab("Event")}
        >
          <FaCalendarAlt />
          Event
        </button>

        <button
          className={activeTab === "Combo" ? "active" : ""}
          onClick={() => setActiveTab("Combo")}
        >
          <FaCrown />
          Combo
        </button>

        <button
          className={activeTab === "Download" ? "active" : ""}
          onClick={() => setActiveTab("Download")}
        >
          <FaDownload />
          Download
        </button>
      </div>

      {/* Unified Cards Wrapper */}
      <div className="plans-wrapper">
        {filteredPlans.map((plan, index) => (
          <div className="plan-card" key={plan.id || index}>
            {/* Left Side Duration Banner */}
            <div className="plan-duration">
              <span>{plan.duration || "1 Month"}</span>
            </div>

            {/* Middle Structural Layout */}
            <div className="plan-content-inner">
              {/* Pricing Information */}
              <div className="price-box">
                <span className="old-price">₹ {plan.oldPrice}</span>
                <h2>₹ {plan.price}</h2>
                <span className="discount">{plan.discount || "Save Big"}</span>
              </div>

              {/* Dynamic Feature List */}
              <div className="plan-features">
                <h3>Why choose this plan?</h3>
                <ul>
                  {plan.features.map((feature, i) => (
                    <li key={i}>
                      <FaCheckCircle />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Right Action Section */}
            <div className="buy-section">
              <button className="buy-now-btn">Buy Now</button>
            </div>
          </div>
        ))}
      </div>
      {/* New Bottom Info Section */}
      <div className="plans-footer-info">
        <h2>All plans include</h2>
        <p className="footer-tagline">Pay Less. Deliver More.</p>
        <p className="footer-description">
          Whether you are promoting an event, generating certificates, sending digital invitations or delivering printed greetings, 
          eventcert.com ensures premium outcomes with controlled costs—helping you do days of work in minutes.
        </p>
        <p className="footer-subtext-title">Subscription Models</p>
        <p className="footer-subtext-body">Designed for Events, Institutions & Individuals</p>
      </div>
      
    </div>
  );
}

export default Subscriptionplan;