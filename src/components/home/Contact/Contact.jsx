import React, { useEffect, useState } from "react";
import "./Contact.css";

import Navbar from "../../common/navbar/Navbar";
import Footer from "../../common/footer/Footer";

import { Phone, Mail, Globe, MapPin, Send, CheckCircle2, Clock } from "lucide-react";

const MAX = 200;

const initial = { name: "", email: "", phone: "", subject: "", message: "" };

function Contact() {
  const [form, setForm] = useState(initial);
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);

  // Always open the page from the top
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const onChange = (e) => {
    const { name, value } = e.target;
    if (name === "phone" && value && !/^[\d+\s-]*$/.test(value)) return;
    setForm((p) => ({ ...p, [name]: value }));
    setError("");
    setSent(false);
  };

  const onSubmit = (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim() || !form.phone.trim() || !form.message.trim())
      return setError("Please fill in all the required fields.");
    if (!/^\S+@\S+\.\S+$/.test(form.email)) return setError("Please enter a valid email address.");

    // TODO: call your contact API here
    console.log("Contact form:", form);
    setSent(true);
    setForm(initial);
  };

  return (
    <>
      <Navbar />

      <main className="ct-page">
        <div className="container">

          {/* Heading */}
          <div className="ct-head">
            <h2>
              Contact <span>Us</span>
            </h2>
            <div className="ct-line"></div>
            <p>Have a question or need help? We'd love to hear from you.</p>
          </div>

          <div className="ct-card">

            {/* ================= LEFT ================= */}
            <aside className="ct-info">
              <span className="ct-circle c1"></span>
              <span className="ct-circle c2"></span>

              <h3>Get in touch</h3>
              <p>
                Our team can help you set up your event, customize your certificates or
                troubleshoot any issue on the platform.
              </p>

              <div className="ct-list">
                <div className="ct-item">
                  <span><Phone size={18} /></span>
                  <div>
                    <small>Call us</small>
                    <a href="tel:+914440423238">+91 4440423238</a>
                  </div>
                </div>

                <div className="ct-item">
                  <span><Mail size={18} /></span>
                  <div>
                    <small>Email</small>
                    <a href="mailto:info@eventcert.com">info@eventcert.com</a>
                  </div>
                </div>

                <div className="ct-item">
                  <span><Globe size={18} /></span>
                  <div>
                    <small>Website</small>
                    <b>www.eventcert.com</b>
                  </div>
                </div>

                <div className="ct-item">
                  <span><MapPin size={18} /></span>
                  <div>
                    <small>Kavin India Pvt Ltd</small>
                    <b>
                      194F II Floor, Venkateswara Nagar, 12th Street, Kottivakkam, Chennai - 41
                    </b>
                  </div>
                </div>
              </div>

              <div className="ct-reply">
                <Clock size={15} /> We usually reply within one working day
              </div>
            </aside>

            {/* ================= FORM ================= */}
            <section className="ct-form-wrap">
              <h3>Send us a message</h3>

              <form className="ct-form" onSubmit={onSubmit} noValidate>
                <div className="ct-field">
                  <label htmlFor="ct-name">Full Name *</label>
                  <input id="ct-name" name="name" value={form.name} onChange={onChange} placeholder="Your name" />
                </div>

                <div className="ct-field">
                  <label htmlFor="ct-email">Email Address *</label>
                  <input id="ct-email" type="email" name="email" value={form.email} onChange={onChange} placeholder="you@example.com" />
                </div>

                <div className="ct-field">
                  <label htmlFor="ct-phone">Phone Number *</label>
                  <input id="ct-phone" type="tel" name="phone" value={form.phone} onChange={onChange} placeholder="+91 98765 43210" inputMode="tel" />
                </div>

                <div className="ct-field">
                  <label htmlFor="ct-subject">Subject</label>
                  <select id="ct-subject" name="subject" value={form.subject} onChange={onChange}>
                    <option value="">Select a topic</option>
                    <option>Event setup help</option>
                    <option>Certificates & templates</option>
                    <option>Subscription & payment</option>
                    <option>Technical issue</option>
                    <option>Other</option>
                  </select>
                </div>

                <div className="ct-field ct-full">
                  <label htmlFor="ct-message">Your Message *</label>
                  <textarea
                    id="ct-message"
                    name="message"
                    rows="4"
                    maxLength={MAX}
                    value={form.message}
                    onChange={onChange}
                    placeholder="How can we help you?"
                  ></textarea>
                  <span className="ct-count">{form.message.length} / {MAX} characters</span>
                </div>

                {error && <p className="ct-error ct-full" role="alert">{error}</p>}
                {sent && (
                  <p className="ct-success ct-full" role="status">
                    <CheckCircle2 size={16} /> Thank you! Your message has been sent.
                  </p>
                )}

                <div className="ct-full ct-submit-row">
                  <button type="submit" className="ct-submit">
                    <Send size={16} /> Send Message
                  </button>
                </div>
              </form>
            </section>

          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}

export default Contact;