import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Subscriptionplan.css";
import PromoCode from "../../common/promocode/PromoCode";

import {
  FaCheckCircle,
  FaCrown,
  FaCertificate,
  FaCalendarAlt,
  FaDownload,
} from "react-icons/fa";

import Button from "../../common/button/Button";
import {  adminGetSubscriptionPlans } from "../../../api/authService";

// category = planCategory sent by the API
const TABS = [
  { label: "Creatives", category: 2, icon: <FaCertificate /> },
  { label: "Event", category: 1, icon: <FaCalendarAlt /> },
  { label: "Event + Creatives", category: 3, icon: <FaCrown /> },
  { label: "Download", category: 4, icon: <FaDownload /> },
];

const FEATURE_LIMIT = 6; // points shown on each card

// "<ul><li>A</li><li>B</li></ul>" -> ["A", "B"]
const htmlToItems = (html) => {
  const clean = String(html || "").replace(/<[^>]*$/, "");
  if (!clean) return [];
  const doc = new DOMParser().parseFromString(clean, "text/html");
  return [...doc.querySelectorAll("li")]
    .map((li) => li.textContent.replace(/\s+/g, " ").trim())
    .filter(Boolean);
};

// 6 + "Week" -> "6 Weeks", 1 + "Month" -> "1 Month"
const durationLabel = (p) =>
  `${p.durationValue} ${p.durationUnit}${p.durationValue > 1 ? "s" : ""}`;

function Subscriptionplan() {
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState(TABS[0].label);
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Load plans from admin API endpoint
  useEffect(() => {
    let cancelled = false;

    adminGetSubscriptionPlans()
      .then((response) => {
        const list = Array.isArray(response)
          ? response
          : Array.isArray(response?.data)
          ? response.data
          : [];
        if (!cancelled) setPlans(list);
      })
      .catch((err) => {
        console.error(err);
        if (!cancelled) setError(getApiError(err, "Unable to load plans. Please try again."));
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  // Filter plans based on active tab category and isActive flag
  const filteredPlans = useMemo(() => {
    const category = TABS.find((t) => t.label === activeTab)?.category;
    return plans
      .filter((p) => p.planCategory === category && p.isActive !== false)
      .sort((a, b) => (a.displayOrder ?? 0) - (b.displayOrder ?? 0));
  }, [plans, activeTab]);

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

      {/* Promo code button + modal */}
      <PromoCode />

      {/* Navigation Tabs */}
      <div className="subscription-tabs" style={{ maxWidth: 680, flexWrap: "wrap" }}>
        {TABS.map((tab) => (
          <Button
            key={tab.label}
            className={activeTab === tab.label ? "active" : ""}
            onClick={() => setActiveTab(tab.label)}
          >
            {tab.icon}
            {tab.label}
          </Button>
        ))}
      </div>

      {/* Unified Cards Wrapper */}
      <div className="plans-wrapper">
        {loading && <p style={{ textAlign: "center" }}>Loading plans...</p>}

        {!loading && error && (
          <p style={{ textAlign: "center", color: "#b91c1c" }}>{error}</p>
        )}

        {!loading && !error && filteredPlans.length === 0 && (
          <p style={{ textAlign: "center" }}>No plans are available in this category right now.</p>
        )}

        {filteredPlans.map((plan) => {
          const features = htmlToItems(plan.content1).slice(0, FEATURE_LIMIT);
          const badge = plan.isPopular
            ? "Most Popular"
            : plan.taxPercentage > 0
            ? `+ ${plan.taxPercentage}% GST`
            : "";

          return (
            <div className="plan-card" key={plan.planId}>
              {/* Left Side Duration Banner */}
              <div className="plan-duration">
                <span>{durationLabel(plan)}</span>
              </div>

              {/* Middle Structural Layout */}
              <div className="plan-content-inner">
                {/* Pricing Information */}
                <div className="price-box">
                  <h2>₹ {Number(plan.price).toLocaleString("en-IN")}</h2>
                  {badge && <span className="discount">{badge}</span>}
                </div>

                {/* Dynamic Feature List */}
                <div className="plan-features">
                  <h3>{plan.heading1 || "Why choose this plan?"}</h3>
                  <ul>
                    {features.map((feature, i) => (
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
                <Button
                  className="buy-now-btn"
                  onClick={() => navigate(`/admin/payment/${plan.planId}`)}
                >
                  Buy Now
                </Button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Bottom Info Section */}
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