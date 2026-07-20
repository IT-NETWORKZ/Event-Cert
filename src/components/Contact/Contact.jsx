import Footer from "../common/footer/Footer";
import "./Contact.css";
import InnerNavbar from "../common/navbar/InnerNavbar";
import Button from "../common/button/Button"

import {
  Phone,
  Mail,
  Globe,
  MapPin,
} from "lucide-react";

function Contact() {
  return (
    <>
      <InnerNavbar />
      <section className="contact-section py-5">
        <div className="container">

          <div className="contact-wrapper">

            {/* Left Side - Corrected class name from 'contact-right' to 'contact-left' */}
            <div className="contact-left">

              <h4>Contact Us / Support</h4>

              <p className="contact-text text-white">
                Have a question or need help? We'd love to hear from you!
              </p>

              <p className="contact-text text-white">
                Our team is available to help you set up your event,
                customize your certificates or troubleshoot any issue
                you face on the platform.
              </p>

              <div className="contact-info">

                <div className="info-item">
                  <div className="icon-box">
                    <Phone size={22} />
                  </div>
                  <span>+91 4440423238</span>
                </div>

                <div className="info-item">
                  <div className="icon-box">
                    <Mail size={22} />
                  </div>
                  <span>info@eventcert.com</span>
                </div>

                <div className="info-item">
                  <div className="icon-box">
                    <Globe size={22} />
                  </div>
                  <span>www.eventcert.com</span>
                </div>

                <div className="info-item align-start">
                  <div className="icon-box">
                    <MapPin size={22} />
                  </div>
                  <div>
                    <strong>Kavin India Pvt Ltd</strong>
                    <p className="mb-0 text-white">
                      194F II Floor,
                      Venkateswara Nagar,
                      12th Street,
                      Kottivakkam,
                      Chennai - 41,
                      India
                    </p>
                  </div>
                </div>

              </div>

            </div>

            {/* Right Side */}
            <div className="contact-right">

              <form>

                <div className="mb-4">
                  <input
                    type="text"
                    className="form-control contact-input"
                    placeholder="Full Name *"
                  />
                </div>

                <div className="mb-4">
                  <input
                    type="email"
                    className="form-control contact-input"
                    placeholder="Email Address *"
                  />
                </div>

                <div className="mb-4">
                  <input
                    type="text"
                    className="form-control contact-input"
                    placeholder="Phone Number *"
                  />
                </div>

                <div className="mb-2">
                  <textarea
                    className="form-control contact-textarea"
                    rows="5"
                    maxLength="200"
                    placeholder="Your Message *"
                  ></textarea>
                </div>

                <div className="text-end character-count">
                  0 / 200 characters
                </div>

                <Button
                  type="submit"
                  className="contact-btn"
                >
                  SEND MESSAGE
                </Button>

              </form>

            </div>

          </div>

        </div>
      </section>
      <Footer />
    </>
  );
}

export default Contact;