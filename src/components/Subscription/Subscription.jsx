import React, { useState } from 'react';
import './Subscription.css';
import { motion, AnimatePresence } from 'framer-motion';

// Replace with your actual logo file path if necessary
import logo from '../../assets/img/logo_EventCert.png'; 
import InnerNavbar from '../common/navbar/InnerNavbar';
import Footer from '../common/footer/Footer';
import Button from "../common/button/Button"

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
  const [activeTab, setActiveTab] = useState('certificate');
  const [openCardIndex, setOpenCardIndex] = useState(null);

  const plansData = {
    certificate: [
      { duration: '1 MONTH/S', price: '₹199', details: 'Access to custom certificate templates, high-res downloads, and standard email verification tools.' },
      { duration: '3 MONTH/S', price: '₹1699', details: 'Priority creation dashboard, bulk certificate generations, premium badge overlays, and full support.' },
      { duration: '1 YEAR/S', price: '₹3199', details: 'All enterprise features, custom subdomain integrations, priority white-label features, and 24/7 technical manager assistance.' },
    ],
    event: [
      { duration: '1 MONTH/S', price: '₹299', details: 'Basic event hosting setups, participant ticketing tools, check-in apps, and basic telemetry.' },
      { duration: '3 MONTH/S', price: '₹2499', details: 'Unlimited concurrent active events, dynamic custom forms, discount logic processors, and CRM sync.' },
      { duration: '1 YEAR/S', price: '₹4999', details: 'Complete white-label event portals, custom API webhooks, bulk attendee imports, and designated server clusters.' },
    ],
    combo: [
      { duration: '1 MONTH/S', price: '₹399', details: 'Unlocks entry-level features for both independent Event hosting modules and Certificate dynamic generators.' },
      { duration: '3 MONTH/S', price: '₹3499', details: 'Mid-tier bundle combining pro event scheduling mechanics directly tied to post-event automated smart credential distributions.' },
      { duration: '1 YEAR/S', price: '₹6999', details: 'Ultimate package containing unrestrained master dashboard control across both full suite platforms for large scale operations.' },
    ]
  };

  const toggleAccordion = (index) => {
    setOpenCardIndex(openCardIndex === index ? null : index);
  };

  return (
    <>
      <InnerNavbar />
      <div className="sub-page-container">
        
        <main className="sub-main-content">
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
          ></motion.div>

          {/* Categories Control */}
          <motion.div 
            className="sub-tabs-wrapper"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Button 
              className={`sub-tab-btn ${activeTab === 'certificate' ? 'selected' : ''}`}
              onClick={() => { setActiveTab('certificate'); setOpenCardIndex(null); }}
            >
              <span className="sub-circle-indicator"></span>
              Certificate
            </Button>
            
            <Button 
              className={`sub-tab-btn ${activeTab === 'event' ? 'selected' : ''}`}
              onClick={() => { setActiveTab('event'); setOpenCardIndex(null); }}
            >
              <span className="sub-circle-indicator"></span>
              Event
            </Button>
            
            <Button 
              className={`sub-tab-btn ${activeTab === 'combo' ? 'selected' : ''}`}
              onClick={() => { setActiveTab('combo'); setOpenCardIndex(null); }}
            >
              <span className="sub-circle-indicator"></span>
              Event + Certificate
            </Button>
          </motion.div>

          {/* Pricing Rows Grid */}
          <motion.div 
            className="sub-pricing-stack"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            key={activeTab} // Resets initial grid sequence trigger during tab swap
          >
            {plansData[activeTab].map((plan, index) => {
              const isOpen = openCardIndex === index;
              return (
                <motion.div 
                  key={index} 
                  layout
                  variants={fadeUpVariants}
                  className={`sub-price-row-card ${isOpen ? 'expanded' : ''}`}
                  onClick={() => toggleAccordion(index)}
                >
                  <div className="sub-card-main-row">
                    <div className="sub-card-info">
                      <span className="sub-duration-lbl">{plan.duration}</span>
                      <h2 className="sub-price-lbl">{plan.price}</h2>
                    </div>
                    
                    <button className={`sub-arrow-toggle-btn ${isOpen ? 'rotated' : ''}`}>
                      <svg width="14" height="9" viewBox="0 0 14 9" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M1 1.5L7 7.5L13 1.5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </button>
                  </div>

                  {/* Dropdown collapsible view info with dynamic slide-open behavior */}
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div 
                        className="sub-card-dropdown-drawer"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                      >
                        <div className="sub-drawer-inner-content">
                          <p>{plan.details}</p>
                          <button className="sub-purchase-action-btn">Choose Plan</button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </motion.div>

          {/* Info Section Triggered on Scroll Viewport */}
          <motion.section 
            className="sub-info-section"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeUpVariants}
          >
            <hr className="sub-divider" />
            
            <div className="sub-features-grid">
              <div className="sub-feature-box">
                <h3>What's included in every plan?</h3>
                <ul>
                  <li>✓ Secure, verifiable QR codes on every certificate</li>
                  <li>✓ High-speed automated batch generation tools</li>
                  <li>✓ Responsive mobile tracking & real-time delivery telemetry</li>
                  <li>✓ Safe & secure standard cloud infrastructure management</li>
                </ul>
              </div>

              <div className="sub-feature-box">
                <h3>Frequently Asked Questions</h3>
                <div className="sub-faq-item">
                  <h4>Can I upgrade or downgrade later?</h4>
                  <p>Yes, you can shift between plan brackets or tiers anytime directly from your profile billing dashboard panel.</p>
                </div>
                <div className="sub-faq-item">
                  <h4>Are there any hidden verification costs?</h4>
                  <p>No, all generation metrics and data checks are included completely within the specified flat subscription costs.</p>
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