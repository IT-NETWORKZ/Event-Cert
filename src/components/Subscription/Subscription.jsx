import React, { useState } from 'react';
import './Subscription.css';

// Replace with your actual logo file path if necessary
import logo from '../../assets/img/logo_EventCert.png'; 
import InnerNavbar from '../common/navbar/InnerNavbar';
import Footer from '../common/footer/Footer';

const Subscription = () => {
  const [activeTab, setActiveTab] = useState('certificate');
  const [openCardIndex, setOpenCardIndex] = useState(null);

  // Dynamic pricing data structure depending on selected toggle block
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
       
        {/* Main Content Body */}
        <main className="sub-main-content">
          <h1 className="sub-heading">Smart Pricing & All-in-One Features</h1>
          <div className="sub-underline"></div>

          {/* Categories Dynamic Selector Control */}
          <div className="sub-tabs-wrapper">
            <button 
              className={`sub-tab-btn ${activeTab === 'certificate' ? 'selected' : ''}`}
              onClick={() => { setActiveTab('certificate'); setOpenCardIndex(null); }}
            >
              <span className="sub-circle-indicator"></span>
              Certificate
            </button>
            
            <button 
              className={`sub-tab-btn ${activeTab === 'event' ? 'selected' : ''}`}
              onClick={() => { setActiveTab('event'); setOpenCardIndex(null); }}
            >
              <span className="sub-circle-indicator"></span>
              Event
            </button>
            
            <button 
              className={`sub-tab-btn ${activeTab === 'combo' ? 'selected' : ''}`}
              onClick={() => { setActiveTab('combo'); setOpenCardIndex(null); }}
            >
              <span className="sub-circle-indicator"></span>
              Event + Certificate
            </button>
          </div>

          {/* Pricing Rows Grid */}
          <div className="sub-pricing-stack">
            {plansData[activeTab].map((plan, index) => {
              const isOpen = openCardIndex === index;
              return (
                <div 
                  key={index} 
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

                  {/* Dropdown collapsible view info */}
                  <div className="sub-card-dropdown-drawer">
                    <div className="sub-drawer-inner-content">
                      <p>{plan.details}</p>
                      <button className="sub-purchase-action-btn">Choose Plan</button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* New Info Section Added Below */}
          <section className="sub-info-section">
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
          </section>

        </main>
      </div>
      <Footer />
    </>
  );
};

export default Subscription;