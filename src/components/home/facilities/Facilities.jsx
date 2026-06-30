import "./Facilities.css";
import { Check, Play } from "lucide-react";

import facilityImg from "../../../assets/img/testimonial-3.jpg";

function Facilities() {
  return (

    <section className="facilities-section">

      <div className="container">


        <div className="row mb-5">

          <div className="col-12 text-center">

            <h2 className="facility-heading">

              <span className="facility-badge">

                FACILITIES

              </span>

              at EventCert

            </h2>

            <div className="facility-line"></div>

          </div>

        </div>




        <div className="row align-items-center gy-5">


          {/* left */}


          <div className="col-lg-6">


            <div className="facility-content">


              <div className="facility-item">

                <h3>

                  <Check size={24} />

                  Event Promotion

                </h3>

                <h4>

                  Promote Smart. Engage Faster.
                  Celebrate Bigger.

                </h4>

                <p>

                  Bring your participants, students,
                  employees or guests together under one
                  digital roof.

                </p>

              </div>



              <div className="facility-item">

                <h3>

                  Advertise Any Event Seamlessly

                </h3>

                <p>

                  From seminars, workshops,
                  conferences, sports meets,
                  annual functions, cultural fests,
                  training sessions and webinars.

                </p>

              </div>



              <div className="facility-item">

                <h3>

                  New: One-Click Auto Certificate
                  Generation

                </h3>

                <p>

                  Instantly issue Participation,
                  Achievement and Appreciation
                  certificates to registered users.

                </p>

              </div>



              <button className="facility-btn">

                Read More

              </button>



            </div>

          </div>





          {/* right */}


          <div className="col-lg-6">


            <div className="facility-video">


              <img

                src={facilityImg}

                alt=""

                className="img-fluid"

              />



              <div className="play-btn">

                <Play size={35} fill="white" />

              </div>


            </div>

          </div>



        </div>

      </div>

    </section>

  );
}

export default Facilities;