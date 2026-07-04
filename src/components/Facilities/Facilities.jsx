import React, { useEffect } from 'react';
import "./Facilities.css";
import { motion } from 'framer-motion';
import InnerNavbar from '../common/navbar/InnerNavbar';
import Footer from '../common/footer/Footer';

// Global Animation Variants
const fadeUpVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" }
  }
};

const fadeDownVariants = {
  hidden: { opacity: 0, y: -40 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.8, ease: "easeOut" }
  }
};

const slideLeftVariants = {
  hidden: { opacity: 0, x: -50 },
  visible: { 
    opacity: 1, 
    x: 0,
    transition: { duration: 0.9, ease: "easeOut" }
  }
};

// Reusable Scroll Animation Wrapper
const ScrollAnimatedSection = ({ children, variants = fadeUpVariants }) => {
  return (
    <motion.div
      variants={variants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
    >
      {children}
    </motion.div>
  );
};

function Facilities() {

  // React Hook to replicate your icon animation logic safely
  useEffect(() => {
    const icons = document.querySelectorAll('.zigzag-icon');
    let current = 0;

    if (icons.length === 0) return;  

    const blinkIcon = () => {
      icons.forEach((icon) => {
        icon.style.animation = 'none';
      });

      if (icons[current]) {
        icons[current].style.animation = 'zigzag-blink 1s ease-in-out';
        current = (current + 1) % icons.length;
      }
    };

    const intervalId = setInterval(blinkIcon, 2000);
    return () => clearInterval(intervalId); // Clean up on component unmount
  }, []);

  return (
    <>
      <InnerNavbar />
      
      <ScrollAnimatedSection variants={fadeDownVariants}>
        <h2 className="text-center mt-5">Facilities</h2>
      </ScrollAnimatedSection>
      
      <ScrollAnimatedSection>
        <div className="line1"></div>
      </ScrollAnimatedSection>

      <div className="container">
        <div className="row align-items-center">
          <div className="about-us-area section-padding mt-3 clearfix">
            <div className="container">
              <div className="row align-items-center ">
                <div className="col-lg-6 col-12 mt-5">
                  <div className="about-us-content mb-30">
                    <ScrollAnimatedSection>
                      <h5 className="mb-3" style={{ textAlign: 'left' }}>
                        <i className="fa fa-check text-primary"></i>Event Promotion
                        <br />
                        Promote Smart. Engage Faster. Celebrate Bigger.
                      </h5>
                      <div className="line mt-2"></div>
                      <p style={{ textAlign: 'justify' }}>
                        Bring your participants, students, employees or guests together under one digital roof!
                      </p>
                    </ScrollAnimatedSection>

                    <ScrollAnimatedSection>
                      <h5 className="mb-3" style={{ textAlign: 'left' }}>Advertise Any Event Seamlessly</h5>
                      <p style={{ textAlign: 'justify' }}>
                        From seminars, workshops, conferences, sports meets, annual functions, cultural fests, to
                        training sessions, webinars and contests — showcase everything effortlessly.
                      </p>
                    </ScrollAnimatedSection>

                    <ScrollAnimatedSection>
                      <h5 className="mb-3" style={{ textAlign: 'left' }}>New: One-Click Auto Certificate Generation</h5>
                      <p style={{ textAlign: 'justify' }}>
                        to all registered participants with a single click. Instantly issue Participation, Appreciation or
                        Achievement certificates after the event; make participants feel glad, proud and recognized
                        — no manual work required.
                      </p>
                    </ScrollAnimatedSection>
                  </div>
                </div>

                <div className="col-12 col-lg-6">
                  <div className="about-video-area mb-30" style={{ width: "100%" }}>
                    <ScrollAnimatedSection variants={slideLeftVariants}>
                      <div className="ratio ratio-16x9">
                        <iframe
                          src="https://www.youtube.com/embed/sSakBz_eYzQ"
                          title="Event Video"
                          frameBorder="0"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                          allowFullScreen
                        ></iframe>
                      </div>
                    </ScrollAnimatedSection>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="col-12 mt-5">
            <div className="three-topics-grid">

              <div className="topic topic-1">
                <ScrollAnimatedSection>
                  <h5 className="mb-3">
                    <i className="fa fa-check text-primary"></i>Easy Participant Registration
                  </h5>
                  <p>Attendees can register directly with their details — no forms, no delays, no confusion.</p>
                </ScrollAnimatedSection>

                <ScrollAnimatedSection>
                  <h5 className="mb-3">Centralized Event Database</h5>
                  <p>Keep a digital record of all participants and events for future communication, invitations and recognition.</p>
                </ScrollAnimatedSection>

                <ScrollAnimatedSection>
                  <h5 className="mb-3">Smart Tracking & Reports</h5>
                  <p>Track participant engagement, attendance and achievements with ease.</p>
                </ScrollAnimatedSection>

                <ScrollAnimatedSection>
                  <h5 className="mb-3">Multi-Event Management</h5>
                  <p>
                    Institutions and organizations can manage multiple events simultaneously with complete participant visibility.<br />
                    “Your event deserves more than attendance — it deserves recognition.”
                  </p>
                </ScrollAnimatedSection>

                <br />
                <br />

                <ScrollAnimatedSection>
                  <h5 className="mb-3">
                    <i className="fa fa-check text-primary"></i>Invitation Cards
                  </h5>
                  <h5 className="mb-3">Invite with Elegance. Impress with Ease.</h5>
                  <p>Create stylish, customized digital invitations that leave a mark — professional, personal or festive!</p>
                </ScrollAnimatedSection>

                <ScrollAnimatedSection>
                  <h5 className="mb-3">Choose from Exclusive Templates For</h5>
                  <p>
                    Corporate Events & Business Launches
                    Product Inaugurations & Press Meets
                    Educational Events & Alumni Meets
                    Sports Tournaments & Award Ceremonies
                    Personal Events — Marriages, Engagements, Birthdays, Anniversaries, Housewarmings, Religious Ceremonies
                  </p>
                </ScrollAnimatedSection>

                <ScrollAnimatedSection>
                  <h5 className="mb-3">Add a Personal Touch</h5>
                  <p>Include recipient’s name, photo and personalized message.</p>
                </ScrollAnimatedSection>

                <ScrollAnimatedSection>
                  <h5 className="mb-3">Brand-Enhanced Invites</h5>
                  <p>Add your company logo, tagline and contact details for professional appeal.</p>
                </ScrollAnimatedSection>

                <ScrollAnimatedSection>
                  <h5 className="mb-3">Send Instantly</h5>
                  <p>
                    Share instantly via Email Id or WhatsApp with a single click.
                    An invitation is not just a message — it’s your first impression.
                  </p>
                </ScrollAnimatedSection>

                <br />
                <br />

                <ScrollAnimatedSection>
                  <h5 className="mb-3">
                    <i className="fa fa-check text-primary"></i>Customizable Elements
                  </h5>
                  <p>Add recipient’s name, photo and your personalized message.</p>
                </ScrollAnimatedSection>

                <ScrollAnimatedSection>
                  <h5 className="mb-3">Add Brand Identity</h5>
                  <p>Attach your logo, contact info and design theme to make every greeting look professional.</p>
                </ScrollAnimatedSection>

                <ScrollAnimatedSection>
                  <h5 className="mb-3">Instant Delivery</h5>
                  <p>
                    Send greetings to one or many instantly via Email Id or WhatsApp.
                    Because every greeting is an opportunity to connect.
                  </p>
                </ScrollAnimatedSection>

                <br />
                <br />

                <ScrollAnimatedSection>
                  <h5 className="mb-3">
                    <i className="fa fa-check text-primary"></i>Hospitals & Healthcare Organizations
                  </h5>
                  <p>Perfect for: Hospitals, Clinics, Wellness Centers and Health Camps</p>
                </ScrollAnimatedSection>

                <ScrollAnimatedSection>
                  <h5 className="mb-3">Benefits:</h5>
                  <p>
                    Distribute e-certificates for awareness events, workshops and health camps<br />
                    Send digital greetings for Doctor’s Day, Nurse’s Day or patient milestones<br />
                    Promote wellness programs digitally and maintain participation records
                  </p>
                </ScrollAnimatedSection>

                <ScrollAnimatedSection>
                  <h5 className="mb-3">Corporate & Insurance Organizations</h5>
                  <p>Perfect for: Corporate Companies, Startups, NGOs and Insurance Agencies</p>
                </ScrollAnimatedSection>

                <ScrollAnimatedSection>
                  <h5 className="mb-3">Benefits:</h5>
                  <p>
                    Appreciate employees and partners with digital certificates and greetings<br />
                    Manage event promotions, trainings and recognition programs<br />
                    Send personalized invites for product launches and business events
                  </p>
                </ScrollAnimatedSection>

                <ScrollAnimatedSection>
                  <h5 className="mb-3">For Individuals & Freelancers</h5>
                  <p>Perfect for: Event Planners, Trainers, Motivational Speakers and Artists</p>
                </ScrollAnimatedSection>

                <ScrollAnimatedSection>
                  <h5 className="mb-3">Benefits:</h5>
                  <p>
                    Create personalized invitations and certificates for your clients<br />
                    Send greetings and invites for professional networking<br />
                    Add logos and design elements to promote your personal brand
                  </p>
                </ScrollAnimatedSection>

                <ScrollAnimatedSection>
                  <p>➤ Why Choose EventCert?</p>
                  <ul>
                    <li>Smart & Scalable</li>
                    <li>Ready-to-Use Templates</li>
                    <li>Bulk Email Id & WhatsApp Delivery</li>
                    <li>Secure Cloud-Based Records</li>
                    <li>Suitable for Institutions organizations & Individuals</li>
                    <li>Saves Days of Effort — Delivers in Minutes!</li>
                  </ul>
                  <p>
                    EventCert — Where Every Event Meets Innovation!<br />
                    Promote • Participate • Appreciate • Celebrate — the Smart Way.
                  </p>
                </ScrollAnimatedSection>
              </div>

              <div className="topic topic-2">
                <ScrollAnimatedSection>
                  <h5 className="mb-3">
                    <i className="fa fa-check text-primary"></i>Certificate Generation
                  </h5>
                  <h5 className="mb-3">Instant Certificates. Infinite Possibilities.</h5>
                  <p>Design, personalize and deliver e-certificates within seconds — beautifully and professionally.</p>
                </ScrollAnimatedSection>

                <ScrollAnimatedSection>
                  <h5 className="mb-3">Ready-to-Use & Customizable Templates</h5>
                  <p>Choose from elegant, theme-based templates for any occasion or discipline.</p>
                </ScrollAnimatedSection>

                <ScrollAnimatedSection>
                  <h5 className="mb-3">Front & Back Certificate Design</h5>
                  <p>
                    Front Side: Up to 10 Logos/Images + 5 Signatories<br />
                    Back Side: Up to 12 Logos/Images + Message, Address & Contact Details<br />
                    Total: 22 Logos/Images + 5 Signatories — exclusive to EventCert!
                  </p>
                </ScrollAnimatedSection>

                <ScrollAnimatedSection>
                  <h5 className="mb-3">One-Click Bulk Sending</h5>
                  <p>Send certificates instantly to one or thousands via Email Id or WhatsApp.</p>
                </ScrollAnimatedSection>

                <ScrollAnimatedSection>
                  <h5 className="mb-3">Ideal Certificate Categories</h5>
                  <p>Participation, Appreciation, Achievement, Excellence, Completion, Contribution</p>
                </ScrollAnimatedSection>

                <ScrollAnimatedSection>
                  <h5 className="mb-3">Time Saver</h5>
                  <p>
                    Save days of manual work — now complete in minutes!<br />
                    From draft to delivery — your certificates, faster than ever.
                  </p>
                </ScrollAnimatedSection>

                <br />
                <br />

                <ScrollAnimatedSection>
                  <h5><i className="fa fa-check text-primary"></i>Greeting Cards</h5>
                  <h5 className="mb-3">Greet. Connect. Celebrate — Digitally!</h5>
                  <p>Celebrate every special day, milestone or occasion with beautifully designed digital greetings.</p>
                </ScrollAnimatedSection>

                <ScrollAnimatedSection>
                  <h5 className="mb-3">Occasions Covered</h5>
                  <p>Festivals: Diwali, Holi, Christmas, New Year, Independence Day, Republic Day, Eid, Pongal, etc.</p>
                  <p>Professional Events: Doctor’s Day, Teacher’s Day, Engineer’s Day, Women’s Day, Yoga Day, etc.</p>
                  <p>Personal Celebrations: Birthdays, Anniversaries, Achievements, Promotions, Retirement, Success Stories</p>
                </ScrollAnimatedSection>

                <br />
                <br />

                <ScrollAnimatedSection>
                  <h5><i className="fa fa-check text-primary"></i>Who Can Benefit from EventCert?</h5>
                  <h5 className="mb-3">Educational Institutions & Training Centers</h5>
                  <p>
                    Perfect for:<br />
                    Schools, Colleges and Universities<br />
                    Coaching Institutes (NEET, JEE, UPSC, MPSC, CA, CS, Banking, etc.)<br />
                    Professional Skill Academies (Coding, Designing, Digital Marketing, etc.)<br />
                    Vocational & Skill Development Centers
                  </p>
                </ScrollAnimatedSection>

                <ScrollAnimatedSection>
                  <h5 className="mb-3">Benefits</h5>
                  <p>
                    Simplified student registration and attendance tracking<br />
                    Easy event promotion and certificate distribution<br />
                    Maintain participant history for future reference<br />
                    Strengthen your academic brand with professional communication
                  </p>
                </ScrollAnimatedSection>

                <br />
                <br />

                <ScrollAnimatedSection>
                  <h5 className="mb-3">
                    <i className="fa fa-check text-primary"></i>Sports Academies & Clubs
                  </h5>
                  <p>
                    Perfect for:<br />
                    Cricket, Football, Chess, Badminton, Kabaddi and Athletics Clubs<br />
                    Yoga, Fitness and Dance Academies
                  </p>
                </ScrollAnimatedSection>

                <ScrollAnimatedSection>
                  <h5 className="mb-3">Benefits:</h5>
                  <p>
                    Create and distribute instant certificates for participation and excellence<br />
                    Manage tournament registrations<br />
                    Send personalized greetings and event invites to athletes and teams
                  </p>
                </ScrollAnimatedSection>
              </div>

            </div>
          </div>
        </div>
      </div>
      <br />
      <br />
      <Footer />
    </>
  );
}

export default Facilities;