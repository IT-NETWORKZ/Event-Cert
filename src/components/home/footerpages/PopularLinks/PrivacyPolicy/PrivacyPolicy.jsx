import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./PrivacyPolicy.css";

// Navbar & Footer imports
import Navbar from "../../../../common/navbar/Navbar";
import Footer from "../../../../common/footer/Footer";

import {
  ShieldCheck,
  ArrowUp,
  Mail,
  Phone,
  MapPin,
  ChevronRight,
} from "lucide-react";

const SECTIONS = [
  {
    id: "introduction",
    title: "Introduction",
    blocks: [
      {
        p: "Welcome to eventcert.com (the \"Platform\"), operated by Kavin India Pvt Ltd (\"EventCert\", \"we\", \"us\" or \"our\"). We respect your privacy and are committed to protecting your personal data. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website or use our services.",
      },
    ],
  },
  {
    id: "information-collected",
    title: "Information We Collect",
    blocks: [
      {
        p: "We collect information that helps us provide and improve our certificate generation and event communication services. This includes:",
      },
      {
        ul: [
          "Personal details such as your name, email address, phone number, and organization details when you register.",
          "Content and data you upload, including recipient lists, custom templates, logos, and signatures.",
          "Payment and transaction details processed securely through our authorized third-party payment gateways.",
          "Technical data including IP address, browser type, device info, and usage analytics when you navigate our platform.",
        ],
      },
    ],
  },
  {
    id: "use-of-information",
    title: "How We Use Your Information",
    blocks: [
      {
        p: "The information we collect is used strictly to deliver, maintain, and enhance our platform capabilities, including:",
      },
      {
        ul: [
          "Creating and managing your user account and subscription plans.",
          "Processing, generating, and delivering digital certificates and cards via email and WhatsApp.",
          "Providing customer support, responding to inquiries, and sending important service notifications.",
          "Ensuring platform security, preventing fraudulent activities, and complying with legal obligations.",
        ],
      },
    ],
  },
  {
    id: "data-sharing",
    title: "Data Sharing and Disclosure",
    blocks: [
      {
        p: "We do not sell or rent your personal data. We may share your information only under the following circumstances:",
      },
      {
        ul: [
          "With trusted service providers (such as email delivery, messaging APIs, and payment processors) necessary to operate our services.",
          "When required by law, legal process, court order, or governmental authority.",
          "To protect the rights, property, or safety of EventCert, our users, or the public.",
        ],
      },
    ],
  },
  {
    id: "data-security",
    title: "Data Security",
    blocks: [
      {
        p: "We implement appropriate administrative, technical, and physical security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the internet is completely secure.",
      },
    ],
  },
  {
    id: "user-rights",
    title: "Your Rights and Choices",
    blocks: [
      {
        p: "You have certain rights regarding your personal information, including the right to access, correct, or request the deletion of your account data. You may update your profile details or manage communications directly through your dashboard settings.",
      },
    ],
  },
  {
    id: "policy-changes",
    title: "Changes to This Policy",
    blocks: [
      {
        p: "We may update this Privacy Policy from time to time to reflect changes in our practices or legal requirements. Continued use of the Platform after modifications indicates your acknowledgment of the revised policy.",
      },
    ],
  },
];

function PrivacyPolicy() {
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

      <main className="privacy-page">
        {/* ================= HERO ================= */}
        <section className="privacy-hero">
          <span className="privacy-blob b1"></span>
          <span className="privacy-blob b2"></span>
          <div className="container">
            <span className="privacy-hero-icon">
              <ShieldCheck size={30} />
            </span>
            <h1>
              Privacy <span>Policy</span>
            </h1>
            <p className="privacy-hero-sub">
              We value your trust. Read about how we collect, safeguard, and handle your
              personal information when you use EventCert.
            </p>
          </div>
        </section>

        {/* ================= CONTENT ================= */}
        <section className="privacy-body">
          <div className="container">
            <div className="privacy-layout">
              {/* ---- Privacy text ---- */}
              <article className="privacy-content">
                <div className="privacy-intro">
                  <p>
                    By using eventcert.com you acknowledge and agree to the data collection
                    and processing practices outlined in this Privacy Policy.
                  </p>
                </div>

                {SECTIONS.map((s, i) => (
                  <section className="privacy-section" id={s.id} key={s.id}>
                    <h2>
                      <span className="privacy-num">{String(i + 1).padStart(2, "0")}</span>
                      {s.title}
                    </h2>
                    {s.blocks.map((b, k) =>
                      b.p ? (
                        <p key={k}>{b.p}</p>
                      ) : (
                        <ul key={k}>
                          {b.ul.map((item) => (
                            <li key={item}>
                              <ChevronRight size={15} />
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      )
                    )}
                  </section>
                ))}

                {/* ---- Contact ---- */}
                <section className="privacy-section" id="contact">
                  <h2>
                    <span className="privacy-num">{String(SECTIONS.length + 1).padStart(2, "0")}</span>
                    Contact Us
                  </h2>
                  <p>If you have any questions or concerns regarding our privacy practices, please contact us.</p>

                  <div className="privacy-contact">
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

                  <div className="privacy-note">
                    <p>
                      Have questions about your data privacy or account safety?
                    </p>
                    <Link to="/contact" className="privacy-btn">
                      Contact Us
                    </Link>
                  </div>
                </section>
              </article>
            </div>
          </div>
        </section>

        {/* Back to top */}
        <button
          type="button"
          className={`privacy-top ${showTop ? "show" : ""}`}
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

export default PrivacyPolicy;