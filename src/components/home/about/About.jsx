import "./About.css";
import { useNavigate } from "react-router-dom";
import { Check } from "lucide-react";
import Button from "../../common/button/Button";
import { getCertificateImageUrl } from "../../../api/homeService"; // adjust path if your services folder is elsewhere

// Live folder images (/home/rimg -> about1.png, about2.png), built from the same IMAGE_BASE_URL as the certificates
const aboutImg1 = getCertificateImageUrl("about1");
const aboutImg2 = getCertificateImageUrl("about2");

// If an image is missing on the server, hide it instead of showing a broken icon
const hideIfBroken = (e) => {
  e.currentTarget.parentElement.style.display = "none";
};

function About() {
  const navigate = useNavigate();

  return (
    <div>
      <section className="about-section">
        <div className="container">
          <div className="row align-items-center gy-5">
            {/* LEFT - images from the live folder */}
            <div className="col-lg-5">
              <div className="about-showcase">
                <span className="about-deco about-deco-ring"></span>
                <span className="about-deco about-deco-blob"></span>
                <span className="about-deco about-deco-dots"></span>

                <figure className="about-photo about-photo-1">
                  <img
                    src={aboutImg1}
                    alt="EventCert certificates and cards"
                    onError={hideIfBroken}
                  />
                </figure>

                <figure className="about-photo about-photo-2">
                  <img
                    src={aboutImg2}
                    alt="EventCert event promotion"
                    onError={hideIfBroken}
                  />
                </figure>
              </div>
            </div>

            {/* RIGHT */}
            <div className="col-lg-7">
              <h2 className="about-main-header">
                <span className="about-badge">ABOUT US</span>
                EventCert
              </h2>

              <div className="about-paragraphs-group">
                <p>
                  <Check className="check-icon" />
                  EventCert is a next-generation platform designed to digitize and transform event management and recognition.
                </p>

                <p>
                  <Check className="check-icon" />
                  Our mission is simple — to make event organization effortless and modern.
                </p>

                <p className="about-plain-text">
                  We understand that managing events whether seminars competitions workshops or sports meets involves countless details.
                </p>

                <p>
                  <Check className="check-icon" />
                  Our goal is to simplify this journey allowing organizers to focus on participants and achievements.
                </p>
              </div>

              <h4 className="about-sub-header">
                <Check className="check-icon" />
                EventCert
              </h4>

              <ul className="about-points-list">
                <li>Promote seminars conferences competitions and sports activities</li>
                <li>Quick participant registration</li>
                <li>Generate certificates invitations greetings instantly</li>
                <li>Ready-made customizable templates</li>
                <li>Instant delivery through Email and WhatsApp</li>
                <li>Affordable pricing</li>
                <li>Track sent certificates anytime</li>
              </ul>

              <div className="about-footer">
                <div className="social-icons">
                  <Button className="btn-about-read" onClick={() => navigate("/About")}>
                    Read More
                  </Button>

                  <a href="#"><i className="bi bi-facebook"></i></a>
                  <a href="#"><i className="bi bi-twitter-x"></i></a>
                  <a href="#"><i className="bi bi-instagram"></i></a>
                  <a href="#"><i className="bi bi-linkedin"></i></a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default About;