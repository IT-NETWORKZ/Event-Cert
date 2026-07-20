import "./About.css";
import { Check } from "lucide-react";

import promoImg from "../../../assets/img/EVENTPROMOTION.jpg";
import invitationImg from "../../../assets/img/INVITATIONCARD.jpg";
import greetingImg from "../../../assets/img/GREETINGCARD.jpg";
import certImg from "../../../assets/img/CERTIFICATE.avif";
import Button from "../../common/button/Button"

function About() {
  return (
    <section className="about-section">

      <div className="container">

        <div className="row align-items-center gy-5">


          {/* LEFT */}


          <div className="col-lg-5">

            <div className="about-features-grid">


              <div className="about-feature-item">

                <div className="about-icon-box">
                  <img src={promoImg} alt="" />
                </div>

                <h6>EVENT PROMOTION</h6>

              </div>



              <div className="about-feature-item">

                <div className="about-icon-box">
                  <img src={invitationImg} alt="" />
                </div>

                <h6>INVITATION CARD</h6>

              </div>



              <div className="about-feature-item">

                <div className="about-icon-box">
                  <img src={greetingImg} alt="" />
                </div>

                <h6>GREETING CARD</h6>

              </div>



              <div className="about-feature-item">

                <div className="about-icon-box">
                  <img src={certImg} alt="" />
                </div>

                <h6>CERTIFICATE</h6>

              </div>



            </div>

          </div>




          {/* RIGHT */}


          <div className="col-lg-7">


            <h2 className="about-main-header">

              <span className="about-badge">

                ABOUT US

              </span>

              EventCert

            </h2>




            <div className="about-paragraphs-group">


              <p>

                <Check className="check-icon"/>

                EventCert is a next-generation platform designed to digitize and transform event management and recognition.

              </p>


              <p>

                <Check className="check-icon"/>

                Our mission is simple — to make event organization effortless and modern.

              </p>



              <p className="about-plain-text">

                We understand that managing events whether seminars competitions workshops or sports meets involves countless details.

              </p>



              <p>

                <Check className="check-icon"/>

                Our goal is to simplify this journey allowing organizers to focus on participants and achievements.

              </p>



            </div>




            <h4 className="about-sub-header">

              <Check className="check-icon"/>

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


              <Button className="btn-about-read">

                Read More

              </Button>

                <a href="#">
                  <i className="bi bi-facebook"></i>
                </a>


                <a href="#">
                  <i className="bi bi-twitter-x"></i>
                </a>


                <a href="#">
                  <i className="bi bi-instagram"></i>
                </a>


                <a href="#">
                  <i className="bi bi-linkedin"></i>
                </a>


              </div>



            </div>



          </div>


        </div>

      </div>

    </section>
  );
}

export default About;