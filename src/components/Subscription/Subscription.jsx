import React, { useState, useEffect } from 'react';
import './Subscription.css';

import { motion, AnimatePresence } from 'framer-motion';

import {
  ChevronDown,
  CheckCircle2,
  HelpCircle,
  ShieldCheck,
  Zap,
  Smartphone,
  Cloud,
  Check
} from 'lucide-react';

import { useNavigate } from 'react-router-dom';

import Footer from '../common/footer/Footer';
import Button from "../common/button/Button";
import Navbar from '../common/navbar/Navbar';
import { getSubscriptionPlans } from '../../api/adminService';

// Global Animation Variants
const fadeUpVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" }
  }
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const Subscription = () => {

  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('event');
  const [openCardIndex, setOpenCardIndex] = useState(null);

  const [plansMap, setPlansMap] = useState({
    event: [],
    creative: [],
    combo: [],
    download: []
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch subscription plans from backend
  useEffect(() => {

    let cancelled = false;

    getSubscriptionPlans()
      .then((res) => {

        if (!cancelled && res && res.data) {

          const activePlans = res.data.filter((p) => p.isActive);

          setPlansMap({
            event: activePlans.filter((p) => p.planCategory === 1),
            creative: activePlans.filter((p) => p.planCategory === 2),
            combo: activePlans.filter((p) => p.planCategory === 3),
            download: activePlans.filter((p) => p.planCategory === 4)
          });

        }

      })
      .catch((err) => {

        if (!cancelled) {
          setError("Failed to load subscription plans.");
          console.error(err);
        }

      })
      .finally(() => {

        if (!cancelled) {
          setLoading(false);
        }

      });

    return () => {
      cancelled = true;
    };

  }, []);

  // Toggle Accordion
  const toggleAccordion = (index) => {

    setOpenCardIndex(
      openCardIndex === index ? null : index
    );

  };

  // Buy Now - Navigate directly to Payment Gateway
  const handleBuyNow = (plan) => {

    navigate(`/admin/payment/${plan.planId}`);

  };

  return (
    <>
      <Navbar />

      <div className="sub-page-container">

        <main className="sub-main-content">

          {/* Page Heading */}
          <motion.h1
            className="sub-heading"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            Smart Pricing & All-in-One Features
          </motion.h1>

          <motion.div
            className="sub-underline"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            style={{ originX: 0.5 }}
          />

          {/* Categories Control Tabs */}
          <motion.div
            className="sub-tabs-wrapper"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >

            {['event', 'creative', 'combo', 'download'].map((tab) => (

              <Button
                key={tab}
                className={`sub-tab-btn ${activeTab === tab ? 'selected' : ''}`}
                onClick={() => {
                  setActiveTab(tab);
                  setOpenCardIndex(null);
                }}
              >

                <span className="sub-circle-indicator"></span>

                {tab === 'event'
                  ? 'Event'
                  : tab === 'creative'
                    ? 'Creatives'
                    : tab === 'combo'
                      ? 'Event + Creatives'
                      : 'Download'}

              </Button>

            ))}

          </motion.div>

          {/* Pricing Rows Grid */}
          {loading ? (

            <p
              className="text-center py-5"
              style={{ color: '#0c2340' }}
            >
              Loading plans...
            </p>

          ) : error ? (

            <p className="text-center py-5 text-danger">
              {error}
            </p>

          ) : (

            <motion.div
              className="sub-pricing-stack"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              key={activeTab}
            >

              {plansMap[activeTab].length === 0 ? (

                <p
                  className="text-center py-4"
                  style={{ color: '#4a5568' }}
                >
                  No plans available in this category.
                </p>

              ) : (

                plansMap[activeTab].map((plan, index) => {

                  const isOpen = openCardIndex === index;

                  return (

                    <motion.div
                      key={plan.planId}
                      layout
                      variants={fadeUpVariants}
                      className={`sub-price-row-card ${isOpen ? 'expanded' : ''}`}
                      onClick={() => toggleAccordion(index)}
                    >

                      {/* Plan Main Row */}
                      <div className="sub-card-main-row">

                        <div className="sub-card-info">

                          <span className="sub-duration-lbl">
                            {plan.planName}
                          </span>

                          <h2 className="sub-price-lbl">
                            ₹ {Number(plan.price).toLocaleString('en-IN')}
                          </h2>

                        </div>

                        <div
                          className={`sub-arrow-toggle-btn ${isOpen ? 'rotated' : ''}`}
                        >
                          <ChevronDown
                            size={20}
                            color="#ffffff"
                          />
                        </div>

                      </div>

                      {/* Dropdown Plan Details */}
                      <AnimatePresence initial={false}>

                        {isOpen && (

                          <motion.div
                            className="sub-card-dropdown-drawer"
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{
                              duration: 0.3,
                              ease: "easeInOut"
                            }}
                            onClick={(e) => e.stopPropagation()}
                          >

                            <div className="sub-drawer-inner-content">

                              {plan.heading1 && (
                                <h4 className="sub-drawer-subheading">
                                  {plan.heading1}
                                </h4>
                              )}

                              {plan.content1 ? (

                                <div
                                  dangerouslySetInnerHTML={{
                                    __html: plan.content1
                                  }}
                                />

                              ) : (

                                <ul className="sub-formal-bullets">

                                  <li>
                                    <Check size={14} />
                                    Full access to automated event creation pipelines
                                  </li>

                                  <li>
                                    <Check size={14} />
                                    Instant downloadable digital certificates with QR validation
                                  </li>

                                </ul>

                              )}

                              {plan.heading2 && (

                                <h4 className="sub-drawer-subheading mt-3">
                                  {plan.heading2}
                                </h4>

                              )}

                              {plan.content2 ? (

                                <div
                                  dangerouslySetInnerHTML={{
                                    __html: plan.content2
                                  }}
                                />

                              ) : (

                                <ul className="sub-formal-bullets">

                                  <li>
                                    <Check size={14} />
                                    Priority customer support desk availability
                                  </li>

                                  <li>
                                    <Check size={14} />
                                    Advanced telemetry and export logs
                                  </li>

                                </ul>

                              )}

                              {/* Buy Now Button */}
                              <button
                                className="sub-purchase-action-btn mt-3"
                                onClick={() => handleBuyNow(plan)}
                              >
                                Buy Now
                              </button>

                            </div>

                          </motion.div>

                        )}

                      </AnimatePresence>

                    </motion.div>

                  );

                })

              )}

            </motion.div>

          )}

          {/* Info Section */}
          <motion.section
            className="sub-info-section"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeUpVariants}
          >

            <hr className="sub-divider" />

            <div className="sub-features-grid">

              {/* Features */}
              <div className="sub-feature-box">

                <h3>
                  <ShieldCheck
                    size={20}
                    className="inline-icon"
                  />
                  What's included in every plan?
                </h3>

                <ul>

                  <li>
                    <CheckCircle2
                      size={16}
                      className="sub-list-icon"
                    />
                    Secure, verifiable QR codes on every certificate
                  </li>

                  <li>
                    <Zap
                      size={16}
                      className="sub-list-icon"
                    />
                    High-speed automated batch generation tools
                  </li>

                  <li>
                    <Smartphone
                      size={16}
                      className="sub-list-icon"
                    />
                    Responsive mobile tracking & real-time delivery telemetry
                  </li>

                  <li>
                    <Cloud
                      size={16}
                      className="sub-list-icon"
                    />
                    Safe & secure standard cloud infrastructure management
                  </li>

                </ul>

              </div>

              {/* FAQ */}
              <div className="sub-feature-box">

                <h3>
                  <HelpCircle
                    size={20}
                    className="inline-icon"
                  />
                  Frequently Asked Questions
                </h3>

                <div className="sub-faq-item">

                  <h4>
                    Can I upgrade or downgrade later?
                  </h4>

                  <p>
                    Yes, you can shift between plan brackets or tiers anytime directly from your profile billing dashboard panel.
                  </p>

                </div>

                <div className="sub-faq-item">

                  <h4>
                    Are there any hidden verification costs?
                  </h4>

                  <p>
                    No, all generation metrics and data checks are included completely within the specified flat subscription costs.
                  </p>

                </div>

              </div>

            </div>

          </motion.section>

        </main>

      </div>

      <Footer />
    </>
  );

};

export default Subscription;


