import "./InnerNavbar.css";
import { Link, NavLink, useLocation } from "react-router-dom";
import { HashLink } from "react-router-hash-link";
import logo from "../../../assets/img/logo_EventCert.png";
import { useState } from "react";

function InnerNavbar() {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false); // Track if mobile menu is open

  // Helper to toggle the menu state open/closed
  const toggleNavbar = () => {
    setIsOpen(!isOpen);
  };

  // Helper to automatically close menu when a link is clicked
  const closeNavbar = () => {
    setIsOpen(false);
  };

  return (
    <div
      className="container-fluid inner-navbar-wrapper"
      data-aos="fade-down"
      data-aos-duration="300"
      data-aos-easing="ease-in-out"
    >
      <div className="container">
        <nav className="navbar navbar-expand-lg">

          {/* Logo */}
          <Link to="/" className="navbar-brand" onClick={closeNavbar}>
            <img
              src={logo}
              alt="EventCert Logo"
              className="navbar-logo"
            />
          </Link>

          {/* Mobile Toggle controlled by React State */}
          <button
            type="button"
            className="navbar-toggler"
            onClick={toggleNavbar}
            aria-expanded={isOpen}
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          {/* Dynamic 'show' class conditional on React State */}
          <div
            className={`collapse navbar-collapse ${isOpen ? "show" : ""}`}
            id="navbarCollapse"
          >
            <div className="navbar-nav ms-auto">

              {/* Home */}
             
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

              {/* Services */}
              <NavLink
                to="/services"
                className={({ isActive }) =>
                  `nav-item nav-link ${isActive ? "active" : ""}`
                }
                onClick={closeNavbar}
              >
                Services
              </NavLink>

              {/* EventHub */}
              <HashLink
                smooth
                to="/#eventhub"
                className={`nav-item nav-link ${
                  location.pathname === "/" && location.hash === "#eventhub" ? "active" : ""
                }`}
                onClick={closeNavbar}
              >
                EventHub
              </HashLink>

              {/* Facilities */}
              <NavLink
                to="/facilities"
                className={({ isActive }) =>
                  `nav-item nav-link ${isActive ? "active" : ""}`
                }
                onClick={closeNavbar}
              >
                Facilities
              </NavLink>

              {/* Subscription */}
              <NavLink
                to="/subscription"
                className={({ isActive }) =>
                  `nav-item nav-link ${isActive ? "active" : ""}`
                }
                onClick={closeNavbar}
              >
                Subscription
              </NavLink>

              {/* Contact */}
              <NavLink
                to="/contact"
                className={({ isActive }) =>
                  `nav-item nav-link ${isActive ? "active" : ""}`
                }
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

export default InnerNavbar;

// import "./InnerNavbar.css";
// import { Link } from "react-router-dom";
// import logo from "../../../assets/img/logo_EventCert.png";

// function InnerNavbar() {
//   return (
//     <div
//       className="container-fluid inner-navbar-wrapper"
//       data-aos="fade-down"
//       data-aos-duration="300"
//       data-aos-easing="ease-in-out"
//     >
//       <div className="container">
//         <nav className="navbar navbar-expand-lg">

//           {/* <Link to="/" className="navbar-brand">
//             <h1>EventCert</h1>
//           </Link> */}
//              <Link to="/" className="navbar-brand">
//             <img src={logo} alt="EventCert Logo" className="navbar-logo" />
//           </Link>

//           <button
//             type="button"
//             className="navbar-toggler"
//             data-bs-toggle="collapse"
//             data-bs-target="#navbarCollapse"
//           >
//             <span className="navbar-toggler-icon"></span>
//           </button>

//           <div
//             className="collapse navbar-collapse"
//             id="navbarCollapse"
//           >
//             <div className="navbar-nav ms-auto">

//               <Link to="/" className="nav-item nav-link">
//                 Home
//               </Link>

//               <Link to="/services" className="nav-item nav-link">
//                 Services
//               </Link>

//               <Link to="/#eventhub" className="nav-item nav-link">
//                 EventHub
//               </Link>

//               <Link to="/facilities" className="nav-item nav-link">
//                 Facilities
//               </Link>

//               <Link to="/subscription" className="nav-item nav-link">
//                 Subscription
//               </Link>

//               <Link to="/contact" className="nav-item nav-link">
//                 Contact
//               </Link>

//             </div>
//           </div>

//         </nav>
//       </div>
//     </div>
//   );
// }

// export default InnerNavbar;