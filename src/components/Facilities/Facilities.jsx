import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import "./Facilities.css";

import Navbar from "../common/navbar/Navbar";
import Footer from "../common/footer/Footer";

import {
  Megaphone,
  UserPlus,
  Database,
  BarChart3,
  Layers,
  Mail,
  Award,
  PartyPopper,
  GraduationCap,
  Trophy,
  HeartPulse,
  Building2,
  Briefcase,
  CheckCircle2,
  ChevronRight,
  Quote,
  Sparkles,
} from "lucide-react";

/* ---------- Animation variants ---------- */
const fadeUp = {
  hidden: { opacity: 0, y: 36 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};
const slideLeft = {
  hidden: { opacity: 0, x: -50 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.7, ease: "easeOut" } },
};
const slideRight = {
  hidden: { opacity: 0, x: 50 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.7, ease: "easeOut" } },
};
const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
};

/* Scroll reveal wrapper */
const Reveal = ({ children, variants = fadeUp, className = "" }) => (
  <motion.div
    className={className}
    variants={variants}
    initial="hidden"
    whileInView="visible"
    viewport={{ once: true, margin: "-80px" }}
  >
    {children}
  </motion.div>
);

/* Staggered grid: children use <motion.div variants={fadeUp}> */
const StaggerGrid = ({ children, className = "" }) => (
  <motion.div
    className={className}
    variants={stagger}
    initial="hidden"
    whileInView="visible"
    viewport={{ once: true, margin: "-60px" }}
  >
    {children}
  </motion.div>
);

const SectionHead = ({ title, highlight, sub }) => (
  <Reveal className="fc-head">
    <h2>
      {title} <span>{highlight}</span>
    </h2>
    <div className="fc-line"></div>
    {sub && <p>{sub}</p>}
  </Reveal>
);

/* ---------- Content ---------- */
const PROMO_POINTS = [
  {
    title: "Advertise Any Event Seamlessly",
    text: "From seminars, workshops, conferences, sports meets, annual functions and cultural fests to training sessions, webinars and contests, showcase everything effortlessly.",
  },
  {
    title: "One-Click Auto Certificate Generation",
    text: "Instantly issue Participation, Appreciation or Achievement certificates to all registered participants after the event. Participants feel proud and recognized, with no manual work required.",
  },
];

const MANAGE = [
  { icon: UserPlus, title: "Easy Participant Registration", text: "Attendees register directly with their details. No complicated forms, no delays, no confusion." },
  { icon: Database, title: "Centralized Event Database", text: "Keep a digital record of all participants and events for future communication, invitations and recognition." },
  { icon: BarChart3, title: "Smart Tracking & Reports", text: "Track participant engagement, attendance and achievements with ease." },
  { icon: Layers, title: "Multi-Event Management", text: "Institutions and organizations can run multiple events at once with complete participant visibility." },
];

const OFFERS = [
  {
    icon: Mail,
    title: "Invitation Cards",
    tagline: "Invite with elegance. Impress with ease.",
    text: "Create stylish, customized digital invitations that leave a mark, whether professional, personal or festive.",
    groupTitle: "Exclusive templates for",
    list: [
      "Corporate events and business launches",
      "Product inaugurations and press meets",
      "Educational events and alumni meets",
      "Sports tournaments and award ceremonies",
      "Marriages, engagements, birthdays, anniversaries, housewarmings and religious ceremonies",
    ],
    extras: [
      { t: "Add a Personal Touch", d: "Include the recipient's name, photo and a personalized message." },
      { t: "Brand-Enhanced Invites", d: "Add your logo, tagline and contact details for a professional look." },
      { t: "Send Instantly", d: "Share by email or WhatsApp with a single click." },
    ],
    quote: "An invitation is not just a message. It's your first impression.",
  },
  {
    icon: Award,
    title: "Certificate Generation",
    tagline: "Instant certificates. Infinite possibilities.",
    text: "Design, personalize and deliver e-certificates within seconds, beautifully and professionally.",
    stats: [
      { n: "10", l: "Logos on front" },
      { n: "12", l: "Logos on back" },
      { n: "5", l: "Signatories" },
    ],
    groupTitle: "Front and back certificate design",
    list: [
      "Front: up to 10 logos/images and 5 signatories",
      "Back: up to 12 logos/images, message, address and contact details",
      "Total: 22 logos/images and 5 signatories, exclusive to EventCert",
    ],
    extras: [
      { t: "Ready-to-Use Templates", d: "Elegant, theme-based templates for any occasion or discipline." },
      { t: "One-Click Bulk Sending", d: "Send to one or thousands by email or WhatsApp." },
      { t: "Categories", d: "Participation, Appreciation, Achievement, Excellence, Completion, Contribution." },
    ],
    quote: "Save days of manual work. From draft to delivery, now in minutes.",
  },
  {
    icon: PartyPopper,
    title: "Greeting Cards",
    tagline: "Greet. Connect. Celebrate, digitally.",
    text: "Celebrate every special day, milestone or occasion with beautifully designed digital greetings.",
    groupTitle: "Occasions covered",
    list: [
      "Festivals: Diwali, Holi, Christmas, New Year, Independence Day, Republic Day, Eid, Pongal and more",
      "Professional days: Doctor's Day, Teacher's Day, Engineer's Day, Women's Day, Yoga Day and more",
      "Personal: birthdays, anniversaries, achievements, promotions, retirement and success stories",
    ],
    extras: [
      { t: "Customizable Elements", d: "Add the recipient's name, photo and your personalized message." },
      { t: "Add Brand Identity", d: "Attach your logo, contact info and design theme." },
      { t: "Instant Delivery", d: "Send to one or many by email or WhatsApp." },
    ],
    quote: "Every greeting is an opportunity to connect.",
  },
];

const AUDIENCE = [
  {
    icon: GraduationCap,
    title: "Educational Institutions & Training Centers",
    perfect: "Schools, colleges and universities; coaching institutes (NEET, JEE, UPSC, MPSC, CA, CS, Banking); skill academies for coding, designing and digital marketing; vocational and skill development centers.",
    benefits: [
      "Simplified student registration and attendance tracking",
      "Easy event promotion and certificate distribution",
      "Participant history kept for future reference",
      "A stronger academic brand through professional communication",
    ],
  },
  {
    icon: Trophy,
    title: "Sports Academies & Clubs",
    perfect: "Cricket, football, chess, badminton, kabaddi and athletics clubs; yoga, fitness and dance academies.",
    benefits: [
      "Instant certificates for participation and excellence",
      "Tournament registration management",
      "Personalized greetings and invites for athletes and teams",
    ],
  },
  {
    icon: HeartPulse,
    title: "Hospitals & Healthcare Organizations",
    perfect: "Hospitals, clinics, wellness centers and health camps.",
    benefits: [
      "E-certificates for awareness events, workshops and health camps",
      "Digital greetings for Doctor's Day, Nurse's Day or patient milestones",
      "Wellness programs promoted digitally, with participation records",
    ],
  },
  {
    icon: Building2,
    title: "Corporate & Insurance Organizations",
    perfect: "Corporate companies, startups, NGOs and insurance agencies.",
    benefits: [
      "Digital certificates and greetings for employees and partners",
      "Event promotions, trainings and recognition programs",
      "Personalized invites for product launches and business events",
    ],
  },
  {
    icon: Briefcase,
    title: "Individuals & Freelancers",
    perfect: "Event planners, trainers, motivational speakers and artists.",
    benefits: [
      "Personalized invitations and certificates for your clients",
      "Greetings and invites for professional networking",
      "Logos and design elements to promote your personal brand",
    ],
  },
];

const WHY = [
  "Smart & Scalable",
  "Ready-to-Use Templates",
  "Bulk Email & WhatsApp Delivery",
  "Secure Cloud-Based Records",
  "Suitable for Institutions, Organizations & Individuals",
  "Saves Days of Effort, Delivers in Minutes",
];

function Facilities() {
  return (
    <>
      <Navbar />

      <main className="fc-page">

        {/* ================= PAGE HEADING ================= */}
        <section className="fc-top">
          <div className="container">
            <Reveal className="fc-head">
              <h2>
                Our <span>Facilities</span>
              </h2>
              <div className="fc-line"></div>
              <p>Everything you need to promote, manage and celebrate your events in one place.</p>
            </Reveal>
          </div>
        </section>

        {/* ================= EVENT PROMOTION ================= */}
        <section className="fc-promo">
          <div className="container">
            <div className="fc-promo-grid">

              <Reveal variants={slideLeft} className="fc-promo-text">
                <span className="fc-tag">
                  <Megaphone size={15} /> Event Promotion
                </span>
                <h3>Promote Smart. Engage Faster. Celebrate Bigger.</h3>
                <p className="fc-lead">
                  Bring your participants, students, employees or guests together under one digital roof.
                </p>

                {PROMO_POINTS.map((p) => (
                  <div className="fc-point" key={p.title}>
                    <span className="fc-point-icon"><CheckCircle2 size={20} /></span>
                    <div>
                      <h5>{p.title}</h5>
                      <p>{p.text}</p>
                    </div>
                  </div>
                ))}
              </Reveal>

              <Reveal variants={slideRight} className="fc-video-wrap">
                <div className="fc-video">
                  <iframe
                    src="https://www.youtube.com/embed/sSakBz_eYzQ"
                    title="EventCert overview video"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                  ></iframe>
                </div>
              </Reveal>

            </div>
          </div>
        </section>

        {/* ================= EVENT MANAGEMENT ================= */}
        <section className="fc-manage">
          <div className="container">
            <SectionHead
              title="Smart Event"
              highlight="Management"
              sub="Handle registrations, records and reports without the paperwork."
            />

            <StaggerGrid className="fc-grid-4">
              {MANAGE.map(({ icon: Icon, title, text }) => (
                <motion.div className="fc-card" variants={fadeUp} key={title}>
                  <span className="fc-icon"><Icon size={26} /></span>
                  <h5>{title}</h5>
                  <p>{text}</p>
                </motion.div>
              ))}
            </StaggerGrid>

            <Reveal className="fc-quote">
              <Quote size={22} />
              <p>Your event deserves more than attendance. It deserves recognition.</p>
            </Reveal>
          </div>
        </section>

        {/* ================= WHAT WE OFFER ================= */}
        <section className="fc-offer">
          <div className="container">
            <SectionHead
              title="Cards &"
              highlight="Certificates"
              sub="Beautiful, ready-to-use designs for every occasion, delivered in minutes."
            />

            <StaggerGrid className="fc-grid-3">
              {OFFERS.map((o) => {
                const Icon = o.icon;
                return (
                  <motion.article className="fc-offer-card" variants={fadeUp} key={o.title}>
                    <div className="fc-offer-top">
                      <span className="fc-icon fc-icon-lg"><Icon size={28} /></span>
                      <h4>{o.title}</h4>
                      <em>{o.tagline}</em>
                    </div>

                    <p className="fc-offer-text">{o.text}</p>

                    {o.stats && (
                      <div className="fc-stats">
                        {o.stats.map((s) => (
                          <div key={s.l}>
                            <strong>{s.n}</strong>
                            <span>{s.l}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    <h6>{o.groupTitle}</h6>
                    <ul className="fc-list">
                      {o.list.map((item) => (
                        <li key={item}>
                          <ChevronRight size={15} />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>

                    <div className="fc-extras">
                      {o.extras.map((x) => (
                        <div key={x.t}>
                          <b>{x.t}</b>
                          <span>{x.d}</span>
                        </div>
                      ))}
                    </div>

                    <p className="fc-offer-quote">{o.quote}</p>
                  </motion.article>
                );
              })}
            </StaggerGrid>
          </div>
        </section>

        {/* ================= WHO CAN BENEFIT ================= */}
        <section className="fc-who">
          <div className="container">
            <SectionHead
              title="Who Can Benefit from"
              highlight="EventCert?"
              sub="Built for institutions, organizations and individuals alike."
            />

            <StaggerGrid className="fc-grid-who">
              {AUDIENCE.map(({ icon: Icon, title, perfect, benefits }) => (
                <motion.article className="fc-who-card" variants={fadeUp} key={title}>
                  <div className="fc-who-head">
                    <span className="fc-icon"><Icon size={24} /></span>
                    <h5>{title}</h5>
                  </div>
                  <p className="fc-perfect">
                    <b>Perfect for: </b>
                    {perfect}
                  </p>
                  <h6>Benefits</h6>
                  <ul className="fc-list">
                    {benefits.map((b) => (
                      <li key={b}>
                        <ChevronRight size={15} />
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                </motion.article>
              ))}
            </StaggerGrid>
          </div>
        </section>

        {/* ================= WHY CHOOSE ================= */}
        <section className="fc-why">
          <div className="container">
            <Reveal className="fc-why-box">
              <div className="fc-why-left">
                <span className="fc-tag fc-tag-light">
                  <Sparkles size={15} /> Why Choose EventCert?
                </span>
                <h3>Where every event meets innovation.</h3>
                <p>Promote, Participate, Appreciate and Celebrate, the smart way.</p>
                <Link to="/subscription" className="fc-btn">Get Started</Link>
              </div>

              <StaggerGrid className="fc-why-list">
                {WHY.map((w) => (
                  <motion.div className="fc-why-item" variants={fadeUp} key={w}>
                    <CheckCircle2 size={20} />
                    <span>{w}</span>
                  </motion.div>
                ))}
              </StaggerGrid>
            </Reveal>
          </div>
        </section>

      </main>

      <Footer />
    </>
  );
}

export default Facilities;