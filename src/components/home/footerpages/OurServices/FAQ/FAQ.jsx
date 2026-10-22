import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./FAQ.css";

// Navbar & Footer imports
import Navbar from "../../../../common/navbar/Navbar";
import Footer from "../../../../common/footer/Footer";

import { ChevronDown, HelpCircle, ArrowUp } from "lucide-react";

const FAQ_DATA = [
  {
    category: "General",
    questions: [
      {
        q: "What is EventCert?",
        a: "EventCert is a smart digital platform designed to help schools, corporates, and event organizers create, manage, and instantly share personalized certificates and greeting cards via email and WhatsApp.",
      },
      {
        q: "Who can use EventCert?",
        a: "EventCert is ideal for educational institutions, corporate trainers, HR professionals, event organizers, webinar hosts, and non-profits looking to automate achievement recognition and event greetings.",
      },
      {
        q: "Do recipients need an account to view their certificates?",
        a: "No, recipients do not need an account. They receive their secure digital certificates directly via email or WhatsApp link and can instantly view, download, or share them.",
      },
    ],
  },
  {
    category: "Certificates & Templates",
    questions: [
      {
        q: "Can I upload my own custom certificate templates?",
        a: "Yes! You can easily upload your custom background designs, logos, and digital signatures, and place dynamic placeholder fields for recipient names and details.",
      },
      {
        q: "How do I upload recipient lists?",
        a: "You can upload your recipient data seamlessly using standard spreadsheet formats like CSV or Excel containing names, email addresses, phone numbers, and any custom variables.",
      },
      {
        q: "Is there a limit to how many certificates I can generate?",
        a: "Generation limits depend on your active subscription plan. You can check your dashboard or our pricing page to choose a plan that fits your high-volume event needs.",
      },
    ],
  },
  {
    category: "Delivery & WhatsApp Integration",
    questions: [
      {
        q: "How are certificates delivered to participants?",
        a: "Certificates can be automatically broadcasted in bulk directly to recipients' email inboxes and WhatsApp numbers with a single click.",
      },
      {
        q: "Are the WhatsApp delivery messages customizable?",
        a: "Yes, you can customize the accompanying text message and greeting template sent along with the certificate link on WhatsApp and email.",
      },
    ],
  },
  {
    category: "Pricing & Account",
    questions: [
      {
        q: "How do I upgrade or manage my subscription plan?",
        a: "You can view and manage your current subscription plan, billing details, and transaction history directly from your user dashboard settings.",
      },
      {
        q: "What payment methods are supported?",
        a: "All major credit cards, debit cards, UPI, net banking, and digital wallets are securely processed through our authorized third-party payment gateways.",
      },
    ],
  },
];

function FAQ() {
  const [openIndex, setOpenIndex] = useState("0-0"); // Default first item open
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

  const toggleAccordion = (catIdx, qIdx) => {
    const key = `${catIdx}-${qIdx}`;
    setOpenIndex(openIndex === key ? null : key);
  };

  return (
    <>
      <Navbar />

      <main className="faq-page">
        <div className="container">
          {/* ---- Page Header (No Hero) ---- */}
          <div className="faq-header">
            <span className="faq-badge">
              <HelpCircle size={18} />
              Support & Knowledge Base
            </span>
            <h1>
              Frequently Asked <span>Questions</span>
            </h1>
            <p>
              Find answers to common questions about creating, managing, and distributing
              certificates and greeting cards with EventCert.
            </p>
          </div>

          {/* ---- FAQ Categories & Accordions ---- */}
          <div className="faq-content-wrapper">
            {FAQ_DATA.map((cat, catIdx) => (
              <div className="faq-category-block" key={cat.category}>
                <h3 className="faq-category-title">{cat.category}</h3>
                <div className="faq-list">
                  {cat.questions.map((item, qIdx) => {
                    const isOpen = openIndex === `${catIdx}-${qIdx}`;
                    return (
                      <div
                        className={`faq-item ${isOpen ? "open" : ""}`}
                        key={qIdx}
                      >
                        <button
                          type="button"
                          className="faq-question-btn"
                          onClick={() => toggleAccordion(catIdx, qIdx)}
                          aria-expanded={isOpen}
                        >
                          <span>{item.q}</span>
                          <span className="faq-icon-wrap">
                            <ChevronDown size={18} />
                          </span>
                        </button>
                        <div className="faq-answer-wrap">
                          <div className="faq-answer-inner">
                            <p>{item.a}</p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          {/* ---- Still Have Questions Box ---- */}
          <div className="faq-help-box">
            <div className="faq-help-text">
              <h4>Still have questions or need assistance?</h4>
              <p>Our support team is available 24/7 to help you with your event certificate campaigns.</p>
            </div>
            <Link to="/contact" className="faq-contact-btn">
              Contact Support
            </Link>
          </div>
        </div>

        {/* Back to top */}
        <button
          type="button"
          className={`faq-top ${showTop ? "show" : ""}`}
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

export default FAQ;