import "./InnerNavbar.css";
import { Link } from "react-router-dom";

function InnerNavbar() {
  return (
    <div
      className="container-fluid inner-navbar-wrapper"
      data-aos="fade-down"
      data-aos-duration="700"
      data-aos-easing="ease-in-out"
    >
      <div className="container">
        <nav className="navbar navbar-expand-lg">

          <Link to="/" className="navbar-brand">
            <h1>EventCert</h1>
          </Link>

          <button
            type="button"
            className="navbar-toggler"
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

              <Link to="/" className="nav-item nav-link">
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

            </div>
          </div>

        </nav>
      </div>
    </div>
  );
}

export default InnerNavbar;