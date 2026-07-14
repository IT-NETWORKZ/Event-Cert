import "./Hero.css";
// import Navbar from "../../common/navbar/Navbar";

import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useRef } from "react";
import hero1 from "../../../assets/img/hero-slider-1.jpg";
import hero2 from "../../../assets/img/hero-slider-2.jpg";
import hero3 from "../../../assets/img/hero-slider-3.jpg";
import LoginCard from "../../common/Login/LoginCard"

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




            
            <div className="col-lg-5 col-md-12">

              <LoginCard />

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



        </div>


      </div>
    </>
  );
}

export default Hero;