import "./Navbar.css";
import { Link, NavLink, useLocation } from "react-router-dom";
import { HashLink } from "react-router-hash-link";
import logo from "../../../assets/img/logo_EventCert.png";
import { useEffect, useState } from "react";

function Navbar() {
  const location = useLocation();
  const [sticky, setSticky] = useState(false);
  const [isOpen, setIsOpen] = useState(false); // Track if mobile menu is open

  useEffect(() => {
    const handleScroll = () => {
      setSticky(window.scrollY > 250);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Helper to toggle the menu state
  const toggleNavbar = () => {
    setIsOpen(!isOpen);
  };

  // Helper to automatically close menu when a link is clicked
  const closeNavbar = () => {
    setIsOpen(false);
  };

  return (
    <div className={`container-fluid navbar-wrapper ${sticky ? "navbar-fixed" : ""}`}>
      <div className="container">
        <nav className="navbar navbar-expand-lg navbar-light border-bottom border-2 border-white">
          
          <Link to="/" className="navbar-brand" onClick={closeNavbar}>
            <img src={logo} alt="EventCert Logo" className="navbar-logo" />
          </Link>

          {/* Toggle Button managed by React State */}
          <button
            type="button"
            className="navbar-toggler ms-auto me-0"
            onClick={toggleNavbar}
            aria-expanded={isOpen}
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          {/* Conditionally apply 'show' class based on React State */}
          <div
            className={`collapse navbar-collapse ${isOpen ? "show" : ""}`}
            id="navbarCollapse"
          >
            <div className="navbar-nav ms-auto">
              
<NavLink
  to="/"
  className={() =>
    `nav-item nav-link ${
      location.pathname === "/" && location.hash !== "#eventhub" ? "active" : ""
    }`
  }
  onClick={closeNavbar}
>
  Home
</NavLink>

              <NavLink
                to="/services"
                className={({ isActive }) => `nav-item nav-link ${isActive ? "active" : ""}`}
                onClick={closeNavbar}
              >
                Services
              </NavLink>

              <HashLink
                smooth
                to="/#eventhub"
                className={`nav-item nav-link ${location.hash === "#eventhub" ? "active" : ""}`}
                onClick={closeNavbar}
              >
                EventHub
              </HashLink>

              <NavLink
                to="/facilities"
                className={({ isActive }) => `nav-item nav-link ${isActive ? "active" : ""}`}
                onClick={closeNavbar}
              >
                Facilities
              </NavLink>

              <NavLink
                to="/subscription"
                className={({ isActive }) => `nav-item nav-link ${isActive ? "active" : ""}`}
                onClick={closeNavbar}
              >
                Subscription
              </NavLink>

              <NavLink
                to="/contact"
                className={({ isActive }) => `nav-item nav-link ${isActive ? "active" : ""}`}
                onClick={closeNavbar}
              >
                Contact
              </NavLink>
            </div>
          </div>
        </nav>
      </div>
    </div>
  );
}

export default Navbar;

