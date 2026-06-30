import "./Navbar.css";
import { Link } from "react-router-dom";
import logo from "../../../assets/img/logo_EventCert.png";
import { useEffect, useState } from "react";

function Navbar() {
  const [sticky, setSticky] = useState(false);

useEffect(() => {
  const handleScroll = () => {
    setSticky(window.scrollY > 250); // Change after Hero
  };

  window.addEventListener("scroll", handleScroll);

  return () => window.removeEventListener("scroll", handleScroll);
}, []);
  return (

    

    // <div className="container-fluid fixed-top px-0">
    <div className={`container-fluid navbar-wrapper ${sticky ? "navbar-fixed" : ""}`}>

      <div className="container">

        <nav className="navbar navbar-expand-lg navbar-light border-bottom border-2 border-white">


          {/* <Link to="/" className="navbar-brand">

            <h1>EventCert</h1>

          </Link> */}
          <Link to="/" className="navbar-brand">
  <img src={logo} alt="EventCert Logo" className="navbar-logo" />
</Link>



          <button

            type="button"

            className="navbar-toggler ms-auto me-0"

            data-bs-toggle="collapse"

            data-bs-target="#navbarCollapse"

          >

            <span className="navbar-toggler-icon"></span>

          </button>



          <div
            className="collapse navbar-collapse"
            id="navbarCollapse"
          >


            <div className="navbar-nav ms-auto">


              <Link to="/" className="nav-item nav-link active">

                Home

              </Link>






              <Link to="/services" className="nav-item nav-link">

                Services

              </Link>

              <Link to="/eventhub" className="nav-item nav-link">

                EventHub


              </Link>


              <Link to="/facilities" className="nav-item nav-link">

                Facilities


              </Link>

              <Link to="/subscription" className="nav-item nav-link">

                Subscription


              </Link>

              <Link to="/contact" className="nav-item nav-link">

                Contact

              </Link>



              <div className="nav-item dropdown">


                {/* <a

                  href="#"

                  className="nav-link dropdown-toggle"

                  data-bs-toggle="dropdown"

                >

                  Pages

                </a> */}



                <div className="dropdown-menu bg-light mt-2">

                  <a href="#" className="dropdown-item">

                    Features

                  </a>


                  <a href="#" className="dropdown-item">

                    Team

                  </a>


                  <a href="#" className="dropdown-item">

                    Testimonials

                  </a>



                </div>

              </div>






            </div>


          </div>

        </nav>

      </div>

    </div>

  );
}

export default Navbar;