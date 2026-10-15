import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./Terms.css";

import Navbar from "../../../../common/navbar/Navbar";
import Footer from "../../../../common/footer/Footer";

import {
  FileText,
  ArrowUp,
  Mail,
  Phone,
  MapPin,
  ChevronRight,
  CalendarDays,
} from "lucide-react";

const LAST_UPDATED = "15 October 2026";

const SECTIONS = [
  {
    id: "acceptance",
    title: "Acceptance of Terms",
    blocks: [
      {
        p: "Welcome to eventcert.com (the \"Platform\"), operated by Kavin India Pvt Ltd (\"EventCert\", \"we\", \"us\" or \"our\"). By accessing or using the Platform, you agree to be bound by these Terms & Conditions (\"Terms\"). If you do not agree with any part of these Terms, please do not use the Platform.",
      },
      {
        p: "These Terms apply to all visitors, registered users, organizations and individuals who access or use our website, tools and services.",
      },
    ],
  },
  {
    id: "services",
    title: "Description of Services",
    blocks: [
      {
        p: "EventCert is an online platform that allows users to design, manage and share personalized certificates, greeting cards, invitations and event-related communication. Our services include:",
      },
      {
        ul: [
          "Browsing and selecting ready-made card and certificate templates.",
          "Customizing templates with names, text, logos, images and signatures.",
          "Generating cards and certificates in bulk using uploaded Excel data.",
          "Delivering generated cards through email and WhatsApp.",
          "Scheduling deliveries and viewing delivery status reports.",
        ],
      },
      {
        p: "We may add, modify or discontinue any feature of the Platform at any time to improve the service.",
      },
    ],
  },
  {
    id: "eligibility",
    title: "Eligibility and Registration",
    blocks: [
      {
        p: "You must be at least 18 years of age, or have the consent of a parent, guardian or authorized organization, to use the Platform. By registering, you confirm that the information you provide is accurate, complete and up to date.",
      },
      {
        ul: [
          "You are responsible for keeping your login credentials confidential.",
          "You are responsible for all activity carried out through your account.",
          "You must notify us immediately of any unauthorized use of your account.",
        ],
      },
    ],
  },
  {
    id: "content",
    title: "User Content and Responsibilities",
    blocks: [
      {
        p: "You retain ownership of the text, images, logos, names and data you upload to the Platform (\"User Content\"). By uploading User Content, you grant EventCert a limited, non-exclusive licence to store, process and display it solely for the purpose of providing the service to you.",
      },
      {
        p: "You confirm that you have all necessary rights and permissions for the User Content, including the consent of recipients whose names, e-mail addresses or phone numbers you upload. You are solely responsible for the accuracy of the details printed on any certificate or card you generate.",
      },
    ],
  },
  {
    id: "acceptable-use",
    title: "Acceptable Use",
    blocks: [
      { p: "You agree not to use the Platform to:" },
      {
        ul: [
          "Create or send content that is unlawful, defamatory, obscene, hateful or misleading.",
          "Issue false certificates, forged credentials or impersonate any person or organization.",
          "Send spam, unsolicited bulk messages or messages without the recipient's consent.",
          "Upload viruses, malicious code or attempt to disrupt or gain unauthorized access to the Platform.",
          "Copy, resell or redistribute our templates or services without written permission.",
          "Violate any applicable law, regulation or third-party right.",
        ],
      },
    ],
  },
  {
    id: "payments",
    title: "Subscription, Fees and Payments",
    blocks: [
      {
        p: "Certain features are available only through paid subscription plans. The applicable fees, validity period and usage limits are displayed on the Subscription page at the time of purchase.",
      },
      {
        ul: [
          "All prices are listed in Indian Rupees (INR) unless stated otherwise and may be subject to applicable taxes.",
          "Payments are processed through secure third-party payment gateways. We do not store your card or bank details.",
          "Subscriptions are valid only for the selected period and do not renew automatically unless stated at purchase.",
          "Refunds and cancellations are governed by our Cancellation & Refund policy.",
        ],
      },
      {
        p: "We reserve the right to revise our pricing and plans. Changes will not affect plans that have already been purchased.",
      },
    ],
  },
  {
    id: "ip",
    title: "Intellectual Property",
    blocks: [
      {
        p: "The Platform, including its design, software, templates, graphics, logos, text and trademarks, is the property of Kavin India Pvt Ltd or its licensors and is protected by applicable intellectual property laws.",
      },
      {
        p: "You are granted a limited, non-transferable and revocable right to use the templates to create cards and certificates for your own events or organization. You may not claim ownership of our templates or sell them as standalone designs.",
      },
    ],
  },
  {
    id: "privacy",
    title: "Privacy and Data Protection",
    blocks: [
      {
        p: "We collect and use personal information in accordance with our Privacy Policy. By using the Platform, you consent to the collection, storage and processing of your information as described in that policy.",
      },
      {
        p: "Where you upload personal data of recipients, you act as the data controller and are responsible for having a lawful basis to share that data with us for the purpose of generating and delivering cards and certificates.",
      },
    ],
  },
  {
    id: "third-party",
    title: "Third-Party Services",
    blocks: [
      {
        p: "The Platform relies on third-party services such as email providers, WhatsApp messaging services and payment gateways. We are not responsible for delays, failures or interruptions caused by these providers. Your use of such services may also be subject to their own terms and policies.",
      },
    ],
  },
  {
    id: "disclaimer",
    title: "Disclaimer of Warranties",
    blocks: [
      {
        p: "The Platform is provided on an \"as is\" and \"as available\" basis. While we work to keep the service accurate and reliable, we do not guarantee that it will be uninterrupted, error-free or free from harmful components, or that messages will always be delivered or read by recipients.",
      },
    ],
  },
  {
    id: "liability",
    title: "Limitation of Liability",
    blocks: [
      {
        p: "To the fullest extent permitted by law, EventCert and Kavin India Pvt Ltd shall not be liable for any indirect, incidental, special or consequential damages, including loss of data, profits or reputation, arising from your use of, or inability to use, the Platform.",
      },
      {
        p: "Our total liability for any claim relating to the service shall not exceed the amount you paid to us for the service in the three (3) months preceding the claim.",
      },
    ],
  },
  {
    id: "termination",
    title: "Suspension and Termination",
    blocks: [
      {
        p: "We may suspend or terminate your access to the Platform, with or without notice, if you breach these Terms or misuse the service. You may stop using the Platform at any time. Provisions that by their nature should survive termination, including intellectual property, disclaimers and limitation of liability, will continue to apply.",
      },
    ],
  },
  {
    id: "changes",
    title: "Changes to These Terms",
    blocks: [
      {
        p: "We may update these Terms from time to time. The revised version will be posted on this page with a new \"Last updated\" date. Your continued use of the Platform after changes are published means you accept the updated Terms.",
      },
    ],
  },
  {
    id: "law",
    title: "Governing Law and Jurisdiction",
    blocks: [
      {
        p: "These Terms are governed by the laws of India. Any dispute arising out of or in connection with these Terms shall be subject to the exclusive jurisdiction of the courts at Chennai, Tamil Nadu.",
      },
    ],
  },
];

function Terms() {
  const [activeId, setActiveId] = useState(SECTIONS[0].id);
  const [showTop, setShowTop] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible.length) setActiveId(visible[0].target.id);
      },
      { rootMargin: "-120px 0px -60% 0px", threshold: 0 }
    );
    SECTIONS.forEach((s) => {
      const el = document.getElementById(s.id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 600);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const goTo = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    setActiveId(id);
  };

  return (
    <>
      <Navbar />

      <main className="tc-page">
        {/* HERO */}
        <section className="tc-hero">
          <div className="container">
            <span className="tc-hero-icon"><FileText size={28} /></span>
            <h1>
              Terms <span>&amp; Conditions</span>
            </h1>
            <p className="tc-hero-sub">
              Please read these terms carefully before using EventCert. They explain your rights
              and responsibilities when you use our platform.
            </p>
            <div className="tc-hero-meta">
              <span><CalendarDays size={14} /> Last updated: {LAST_UPDATED}</span>
            </div>
          </div>
        </section>

        {/* CONTENT */}
        <section className="tc-body">
          <div className="container">
            <div className="tc-layout">
              {/* Table of Contents */}
              <aside className="tc-toc">
                <p className="tc-toc-title">On this page</p>
                <nav>
                  {SECTIONS.map((s, i) => (
                    <button
                      key={s.id}
                      type="button"
                      className={activeId === s.id ? "active" : ""}
                      onClick={() => goTo(s.id)}
                    >
                      <b>{String(i + 1).padStart(2, "0")}</b>
                      <span>{s.title}</span>
                    </button>
                  ))}
                  <button
                    type="button"
                    className={activeId === "contact" ? "active" : ""}
                    onClick={() => goTo("contact")}
                  >
                    <b>{String(SECTIONS.length + 1).padStart(2, "0")}</b>
                    <span>Contact Us</span>
                  </button>
                </nav>
              </aside>

              {/* Main Article Content */}
              <article className="tc-content">
                <div className="tc-intro">
                  <p>
                    By using eventcert.com you confirm that you have read, understood and agreed
                    to the terms below. Related policies such as the <b>Privacy Policy</b> and{" "}
                    <b>Cancellation &amp; Refund</b> policy form part of these Terms.
                  </p>
                </div>

                {SECTIONS.map((s, i) => (
                  <section className="tc-section" id={s.id} key={s.id}>
                    <h2>
                      <span className="tc-num">{String(i + 1).padStart(2, "0")}</span>
                      {s.title}
                    </h2>
                    {s.blocks.map((b, k) =>
                      b.p ? (
                        <p key={k}>{b.p}</p>
                      ) : (
                        <ul key={k}>
                          {b.ul.map((item) => (
                            <li key={item}>
                              <ChevronRight size={14} />
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      )
                    )}
                  </section>
                ))}

                {/* Contact Section */}
                <section className="tc-section" id="contact">
                  <h2>
                    <span className="tc-num">{String(SECTIONS.length + 1).padStart(2, "0")}</span>
                    Contact Us
                  </h2>
                  <p>If you have any questions about these Terms, please get in touch with us.</p>

                  <div className="tc-contact">
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

                  <div className="tc-note">
                    <p>
                      By continuing to use EventCert you acknowledge that you have read and agree
                      to these Terms &amp; Conditions.
                    </p>
                    <Link to="/contact" className="tc-btn">Contact Us</Link>
                  </div>
                </section>
              </article>
            </div>
          </div>
        </section>

        {/* Back to top button */}
        <button
          type="button"
          className={`tc-top ${showTop ? "show" : ""}`}
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          aria-label="Back to top"
        >
          <ArrowUp size={18} />
        </button>
      </main>

      <Footer />
    </>
  );
}

export default Terms;