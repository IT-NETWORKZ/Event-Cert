import "./Hero.css";

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import hero1 from "../../../assets/img/Homeimg1.avif";
import hero2 from "../../../assets/img/Homeimg2.jpg";
import hero3 from "../../../assets/img/Homeimg3.jpg";
import hero4 from "../../../assets/img/Homeimg4.jpg";
import hero5 from "../../../assets/img/Homeimg5.avif";
import LoginCard from "../../common/Login/LoginCard";
import { useAuth } from "../../../context/AuthContext";

function Hero() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState("");

  const slides = [hero1, hero2, hero3, hero4, hero5];
  const [current, setCurrent] = useState(0);

  const handleLogin = async ({ email, password }) => {
    setError("");
    try {
      await login(email, password);
      navigate("/admin/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed. Please try again.");
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <div className="container-fluid hero-header bg-light">
        <div className="container pt-5 pb-3">
          <div className="row align-items-center mb-5 hero-row">
            <div className="col-lg-5 col-md-12">
              <LoginCard onFormSubmit={handleLogin} error={error} />
            </div>

            {/* Right Side */}
            <div className="col-lg-6 col-md-12 slider-col">
              <div className="header-carousel">
                <img
                  src={slides[current]}
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