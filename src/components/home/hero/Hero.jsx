import "./Hero.css";
// import Navbar from "../../common/navbar/Navbar";

import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useRef } from "react";
import hero1 from "../../../assets/img/hero-slider-1.jpg";
import hero2 from "../../../assets/img/hero-slider-2.jpg";
import hero3 from "../../../assets/img/hero-slider-3.jpg";

function Hero() {
  const otpRefs = useRef([]);
  const slides = [hero1, hero2, hero3];

  const [current, setCurrent] = useState(0);


  useEffect(() => {

    const interval = setInterval(() => {

      setCurrent((prev) => (prev + 1) % slides.length);

    }, 3000);

    return () => clearInterval(interval);

  }, []);

  const handleOTPChange = (e, index) => {
    const value = e.target.value;

    // Allow only numbers
    if (!/^\d?$/.test(value)) {
      e.target.value = "";
      return;
    }

    // Move to next input
    if (value && index < 5) {
      otpRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (e, index) => {
    // Move to previous input on Backspace
    if (
      e.key === "Backspace" &&
      !e.target.value &&
      index > 0
    ) {
      otpRefs.current[index - 1].focus();
    }
  };

  return (
    <>

      {/* <Navbar /> */}
      <div className="container-fluid  hero-header bg-light ">

        <div className="container  pt-5 pb-3">

          <div className="row align-items-center mb-5 hero-row">




            {/* <div className="col-lg-5"> */}
            <div className="col-lg-5 col-md-12">

              <div className="login-card">
                <h1>LOGIN</h1>
                <p>Login to continue your journey</p>

                <div className="otp-options">
                  <label>
                    <input type="radio" name="otp" defaultChecked />
                    Email OTP
                  </label>
                  <label>
                    <input type="radio" name="otp" />
                    Mobile OTP
                  </label>
                </div>

                {/* Input and Button locked cleanly in one responsive row layout */}
                <div className="input-row-group">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Email Id / Mobile No."
                  />
                  <button type="button" className="otp-btn">
                    Send OTP
                  </button>
                </div>

                <h6>Enter OTP</h6>
                <div className="otp-boxes">
                  {[...Array(6)].map((_, index) => (
                    <input
                      key={index}
                      type="text"
                      maxLength={1}
                      inputMode="numeric"
                      pattern="\d*"
                      ref={(el) => (otpRefs.current[index] = el)}
                      onChange={(e) => handleOTPChange(e, index)}
                      onKeyDown={(e) => handleKeyDown(e, index)}
                    />
                  ))}
                </div>

                <div className="submit-btn-wrapper">
                  <button type="submit" className="submit-btn">
                    Submit
                  </button>
                </div>

                {/* OR Divider */}
                <div className="divider">
                  <span>OR</span>
                </div>

                {/* Google Sign In */}
                <button type="button" className="google-btn">
                  <img
                    src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
                    alt="Google"
                  />
                  Continue with Google
                </button>

                <p className="register">
                  Don't have an account?
                  <Link to="/register" className="text-blue">
                    Register
                  </Link>
                </p>
              </div>

            </div>




            {/* Right Side */}

            {/* <div className="col-lg-6"> */}
            <div className="col-lg-6 col-md-12 slider-col">

              <div className="header-carousel">


                <img

                  src={slides[current]}

                  // className="img-fluid"
                  className="img-fluid slider-image"

                  alt=""

                />




                <div className="slider-dots">


                  {slides.map((_, index) => (


                    <span

                      key={index}

                      className={current === index ? "active-dot" : ""}


                    ></span>


                  ))}



                </div>



              </div>


            </div>



          </div>




          {/* Bottom Features */}


          {/* <div className="row g-5">


          <div className="col-md-6 col-lg-3">


            <div className="d-flex align-items-center">


              <div className="flex-shrink-0 btn-square border border-2 border-white me-3">

                ⭐

              </div>


              <h5 className="lh-base mb-0">

                Crafted Furniture

              </h5>


            </div>


          </div>





          <div className="col-md-6 col-lg-3">


            <div className="d-flex align-items-center">


              <div className="flex-shrink-0 btn-square border border-2 border-white me-3">

                ⭐

              </div>



              <h5 className="lh-base mb-0">

                Sustainable Material

              </h5>



            </div>



          </div>






          <div className="col-md-6 col-lg-3">


            <div className="d-flex align-items-center">


              <div className="flex-shrink-0 btn-square border border-2 border-white me-3">

                ⭐

              </div>



              <h5 className="lh-base mb-0">

                Innovative Architects

              </h5>


            </div>



          </div>





          <div className="col-md-6 col-lg-3">


            <div className="d-flex align-items-center">


              <div className="flex-shrink-0 btn-square border border-2 border-white me-3">

                ⭐

              </div>


              <h5 className="lh-base mb-0">

                Budget Friendly

              </h5>


            </div>


          </div>



        </div> */}



        </div>


      </div>
    </>
  );
}

export default Hero;