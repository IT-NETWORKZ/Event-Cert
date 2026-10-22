import "./Services.css";
import { useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";

import eventImg from "../../../assets/img/project-1.jpg";
import inviteImg from "../../../assets/img/project-1.jpg";
import greetingImg from "../../../assets/img/project-1.jpg";
import certImg from "../../../assets/img/project-1.jpg";

function Services() {
  const navigate = useNavigate();

  return (
    <section className="services-section">
      <div className="container">
        <div className="row g-4 align-items-stretch">

          {/* LEFT SIDE */}
          <div className="col-lg-5">
            <div className="service-left">
              <h2 className="service-title">
                Our Creative
                <span>SERVICES</span>
              </h2>

              <p>
                eventcert.com is an innovative digital platform that simplifies how organizations
                and individuals create, manage and deliver event certificates, invitations and
                greeting cards.
              </p>

              <p>
                Whether for a seminar, workshop, competition or celebration, EventCert helps you
                design and share personalized, professional-looking certificates and cards in just
                a few clicks.
              </p>

              <p>
                With a wide range of ready-made templates and the flexibility to create customized
                designs, the platform is ideal for schools, colleges, corporates and event
                organizers.
              </p>

              <p className="service-tagline">
                Empower your events with EventCert — Smart. Scalable. Seamless.
              </p>

              {/* Simple call to action */}
              <div className="service-cta">
                <p>Have a question or need a custom design? We're happy to help.</p>
                <button
                  type="button"
                  className="service-contact-btn"
                  onClick={() => navigate("/contact")}
                >
                  Contact Us <ArrowRight size={16} />
                </button>
              </div>
            </div>
          </div>

          {/* RIGHT SIDE */}
          <div className="col-lg-7">
            <div className="services-grid">
              <div className="service-card active">
                <img src={eventImg} alt="" />
                <h3>Event Promotion</h3>
                <p>Boost your event's reach with smart digital promotions.</p>
              </div>

              <div className="service-card">
                <img src={inviteImg} alt="" />
                <h3>Invitation Cards</h3>
                <p>Send personalized stylish invites that make every event feel special.</p>
              </div>

              <div className="service-card">
                <img src={greetingImg} alt="" />
                <h3>Greeting Cards / Events</h3>
                <p>Share heartfelt wishes with beautifully designed greetings.</p>
              </div>

              <div className="service-card">
                <img src={certImg} alt="" />
                <h3>Certificates</h3>
                <p>Recognize achievements instantly with professional certificates.</p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

export default Services;