import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import "./CancellationRefund.css";

// Navbar & Footer imports
import Navbar from "../../../../common/navbar/Navbar";
import Footer from "../../../../common/footer/Footer";

import {
  RotateCcw,
  ArrowUp,
  Mail,
  Phone,
  MapPin,
  CheckCircle2,
  FileSpreadsheet,
  Clock,
  Wallet,
} from "lucide-react";

function CancellationRefund() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <Navbar />

      <main className="cr-page">
        {/* ================= HERO ================= */}
        <section className="cr-hero">
          <span className="cr-blob b1"></span>
          <span className="cr-blob b2"></span>
          <div className="container">
            <span className="cr-hero-icon">
              <RotateCcw size={30} />
            </span>
            <h1>
              Cancellation <span>&amp; Refund</span>
            </h1>
            <p className="cr-hero-sub">
              Understand our straightforward policies regarding subscription cancellations,
              digital service limitations, and refund processing timelines.
            </p>
          </div>
        </section>

        {/* ================= CONTENT ================= */}
        <section className="cr-body">
          <div className="container">
            <article className="cr-content">
              
              {/* ---- Intro box ---- */}
              <div className="cr-intro">
                <p>
                  At EventCert, we strive to provide seamless digital certificate and event communication
                  services. Please review our policies below regarding subscriptions and refund eligibility.
                </p>
              </div>

              {/* ---- Section 1: Subscriptions & Cancellations ---- */}
              <section className="cr-section">
                <h2>
                  <span className="cr-num">01</span>
                  Subscription &amp; Plan Cancellations
                </h2>
                <p>
                  Paid subscription plans unlock advanced features such as bulk certificate generation,
                  custom branding, and priority messaging delivery. 
                </p>
                <ul>
                  <li>
                    <CheckCircle2 size={16} />
                    <span>You may cancel your active subscription plan at any time directly through your account dashboard settings.</span>
                  </li>
                  <li>
                    <CheckCircle2 size={16} />
                    <span>Upon cancellation, your subscription remains active until the end of your current billing or validity period.</span>
                  </li>
                  <li>
                    <CheckCircle2 size={16} />
                    <span>We do not impose any hidden fees or cancellation penalties for discontinuing your plan.</span>
                  </li>
                </ul>
              </section>

              {/* ---- Section 2: Refund Policy & Digital Nature ---- */}
              <section className="cr-section">
                <h2>
                  <span className="cr-num">02</span>
                  Refund Eligibility &amp; Digital Services
                </h2>
                <p>
                  Because EventCert provides instantaneous digital access, downloadable assets, and automated
                  communication credits upon purchase:
                </p>
                <ul>
                  <li>
                    <CheckCircle2 size={16} />
                    <span>Subscription fees and digital credit purchases are generally non-refundable once the service has been accessed or utilized.</span>
                  </li>
                  <li>
                    <CheckCircle2 size={16} />
                    <span>Exceptions are made strictly in cases of proven technical billing errors, duplicate transactions, or failure of service delivery caused directly by our platform.</span>
                  </li>
                </ul>
              </section>

              {/* ---- Section 3: Visual Flowchart / Workflow ---- */}
              <section className="cr-section">
                <h2>
                  <span className="cr-num">03</span>
                  Refund Request Workflow
                </h2>
                <p>
                  If you believe you qualify for an exceptional refund due to a transaction error,
                  our process follows these simple steps:
                </p>

                <div className="cr-flow">
                  <div className="cr-flow-step">
                    <div className="cr-flow-icon">
                      <FileSpreadsheet size={22} />
                    </div>
                    <h3>1. Submit Request</h3>
                    <p>Contact our support team with your registered email and transaction details within 7 days of purchase.</p>
                  </div>

                  <div className="cr-flow-arrow">→</div>

                  <div className="cr-flow-step">
                    <div className="cr-flow-icon">
                      <Clock size={22} />
                    </div>
                    <h3>2. Review &amp; Verification</h3>
                    <p>Our team verifies the payment logs, system usage logs, and nature of the reported discrepancy.</p>
                  </div>

                  <div className="cr-flow-arrow">→</div>

                  <div className="cr-flow-step">
                    <div className="cr-flow-icon">
                      <Wallet size={22} />
                    </div>
                    <h3>3. Refund Credited</h3>
                    <p>Approved refunds are processed and credited back to the original payment method within 5 to 7 business days.</p>
                  </div>
                </div>
              </section>

              {/* ---- Section 4: Contact Us ---- */}
              <section className="cr-section">
                <h2>
                  <span className="cr-num">04</span>
                  Contact Us for Support
                </h2>
                <p>If you have questions regarding your billing or need assistance with a cancellation, reach out to us.</p>

                <div className="cr-contact">
                  <div>
                    <MapPin size={18} />
                    <span>
                      Kavin India Pvt Ltd, 194F II Floor, Venkateswara Nagar, 12th Street,
                      Kottivakkam, Chennai – 41
                    </span>
                  </div>
                  <div>
                    <Phone size={18} />
                    <span>+91 4440423238</span>
                  </div>
                  <div>
                    <Mail size={18} />
                    <span>info@eventcert.com</span>
                  </div>
                </div>

                <div className="cr-note">
                  <p>Need immediate help with your account or billing status?</p>
                  <Link to="/contact" className="cr-btn">
                    Contact Us
                  </Link>
                </div>
              </section>

            </article>
          </div>
        </section>

        {/* Back to top */}
        <button
          type="button"
          className="cr-top"
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

export default CancellationRefund;