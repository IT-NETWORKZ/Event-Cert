import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./Shipping.css";

// Navbar & Footer imports
import Navbar from "../../../../common/navbar/Navbar";
import Footer from "../../../../common/footer/Footer";

import {
  Truck,
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
    id: "overview",
    title: "Service Overview",
    blocks: [
      {
        p: "EventCert is primarily a digital platform offering online services, certificate generation, and electronic delivery. However, certain physical merchandise, custom print kits, or tangible event materials may be shipped as part of specialized packages.",
      },
    ],
  },
  {
    id: "digital-delivery",
    title: "Digital Delivery",
    blocks: [
      {
        p: "For all digital certificates, greeting cards, and invitations generated through our platform, delivery is instantaneous upon final processing.",
      },
      {
        ul: [
          "Delivered directly to designated email addresses and WhatsApp numbers.",
          "Available for instant download via your EventCert user dashboard.",
          "No shipping charges or delivery delays apply to digital assets.",
        ],
      },
    ],
  },
  {
    id: "physical-shipping",
    title: "Physical Shipping & Timelines",
    blocks: [
      {
        p: "When physical goods or printed materials are ordered, we partner with reliable courier services to ensure prompt delivery across India.",
      },
      {
        ul: [
          "Standard processing and dispatch take between 2 to 5 business days.",
          "Delivery timelines typically range from 3 to 7 business days depending on the destination pin code.",
          "Orders are not processed or dispatched on national holidays or Sundays.",
        ],
      },
    ],
  },
  {
    id: "shipping-charges",
    title: "Shipping Charges",
    blocks: [
      {
        p: "Shipping fees, if applicable, are calculated at checkout based on the delivery address, package weight, and order volume. Any promotional free shipping offers will be explicitly displayed during the payment process.",
      },
    ],
  },
  {
    id: "tracking",
    title: "Order Tracking",
    blocks: [
      {
        p: "Once your physical order has been dispatched, you will receive a tracking link via email or SMS, allowing you to monitor the real-time status of your shipment through our courier partner's portal.",
      },
    ],
  },
  {
    id: "issues",
    title: "Delivery Issues & Delays",
    blocks: [
      {
        p: "While we strive to ensure timely arrivals, unforeseen circumstances such as extreme weather, logistical bottlenecks, or incorrect address details may cause delays. If your shipment is significantly delayed, please reach out to our support team for assistance.",
      },
    ],
  },
];

function Shipping() {
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

      <main className="ship-page">
        {/* ================= HERO ================= */}
        <section className="ship-hero">
          <span className="ship-blob b1"></span>
          <span className="ship-blob b2"></span>
          <div className="container">
            <span className="ship-hero-icon">
              <Truck size={30} />
            </span>
            <h1>
              Shipping <span>&amp; Delivery</span>
            </h1>
            <p className="ship-hero-sub">
              Learn more about how we handle digital dispatches and physical item shipments
              for your event solutions.
            </p>
            {/* <div className="ship-hero-meta">
              <span>
                <CalendarDays size={15} /> Last updated: {LAST_UPDATED}
              </span>
            </div> */}
          </div>
        </section>

        {/* ================= CONTENT ================= */}
        <section className="ship-body">
          <div className="container">
            <div className="ship-layout">
              {/* ---- Table of contents ---- */}
              <aside className="ship-toc">
                <p className="ship-toc-title">On this page</p>
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

              {/* ---- Shipping text ---- */}
              <article className="ship-content">
                <div className="ship-intro">
                  <p>
                    At EventCert, we ensure seamless delivery for both our digital communication tools
                    and any supplementary physical merchandise you purchase.
                  </p>
                </div>

                {SECTIONS.map((s, i) => (
                  <section className="ship-section" id={s.id} key={s.id}>
                    <h2>
                      <span className="ship-num">{String(i + 1).padStart(2, "0")}</span>
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
                <section className="ship-section" id="contact">
                  <h2>
                    <span className="ship-num">{String(SECTIONS.length + 1).padStart(2, "0")}</span>
                    Contact Us
                  </h2>
                  <p>If you have any questions regarding your shipment, please get in touch with us.</p>

                  <div className="ship-contact">
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

                  <div className="ship-note">
                    <p>
                      Need assistance with an ongoing shipment or digital delivery issue?
                    </p>
                    <Link to="/contact" className="ship-btn">
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
          className={`ship-top ${showTop ? "show" : ""}`}
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

export default Shipping;