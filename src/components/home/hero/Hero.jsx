import "./Hero.css";
import Navbar from "../../common/navbar/Navbar";

import { useState, useEffect } from "react";

import hero1 from "../../../assets/img/hero-slider-1.jpg";
import hero2 from "../../../assets/img/hero-slider-2.jpg";
import hero3 from "../../../assets/img/hero-slider-3.jpg";

function Hero() {

  const slides = [hero1, hero2, hero3];

  const [current, setCurrent] = useState(0);


  useEffect(() => {

    const interval = setInterval(() => {

      setCurrent((prev) => (prev + 1) % slides.length);

    }, 3000);

    return () => clearInterval(interval);

  }, []);



  return (

    <div className="container-fluid  hero-header bg-light ">

      <Navbar />


      <div className="container  pt-5 pb-3">


        {/* <div className="row g-5 align-items-center mb-5">
         */}
         <div className="row align-items-center mb-5 hero-row">


          {/* Left Side */}
{/* 
          <div className="col-lg-6">


            <h1 className="display-1 mb-4">

              We Make Your

              <span className="text-primary">

                {" "}Home{" "}

              </span>

              Better

            </h1>



            <h5 className="d-inline-block border border-2 border-white py-3 px-5 mb-0">

              An Award Winning Studio Since 1990

            </h5>


          </div> */}

          {/* <div className="col-lg-5"> */}
          <div className="col-lg-5 col-md-12">

    <div className="login-card">

        <h1>LOGIN</h1>

        <p>
            Login to continue your journey
        </p>


        <div className="otp-options">

            <label>

                <input
                    type="radio"
                    name="otp"
                />

                Email OTP

            </label>


            <label>

                <input
                    type="radio"
                    name="otp"
                />

                Mobile OTP

            </label>

        </div>



        <div className="input-group mb-4">

            <input
                type="text"
                className="form-control"
                placeholder="Email Id / Mobile No."
            />

            <button
                className="otp-btn"
            >

                Send OTP

            </button>

        </div>



        <h6>

            Enter OTP

        </h6>



        <div className="otp-boxes">

            <input maxLength="1" />
            <input maxLength="1" />
            <input maxLength="1" />
            <input maxLength="1" />
            <input maxLength="1" />
            <input maxLength="1" />

        </div>



        <button className="submit-btn">

            Submit

        </button>



     <p className="register">

Don't have an account?

<a href="#"> Register</a>

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

  );
}

export default Hero;