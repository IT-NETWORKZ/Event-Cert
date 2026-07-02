import React, { useEffect, useState } from "react";
import "./Dashboard.css";
import confetti from "canvas-confetti";
import { Modal } from "bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import { useLocation } from "react-router-dom";
import {
  FaCalendarAlt,
  FaDraftingCompass,
  FaLayerGroup,
  FaGraduationCap,
  FaCity,
  FaGlobeAmericas,
  FaDollyFlatbed,
  FaReceipt,
  FaCreditCard,
  FaCommentAlt,
  FaFileContract,
} from "react-icons/fa";

const Dashboard = () => {
  const location = useLocation();
  const [showProfilePopup, setShowProfilePopup] = useState(false);

  const dashboardData = {
    eventsUsed: 2450,
    designs: "20000+",
    categories: "500+",
    certificates: 120500,
    cities: 185,
    countries: 35,
    eventStock: 150,
    certificateStock: 5000,
  };

  const cards = [
    {
      title: "Total Events Used",
      value: dashboardData.eventsUsed,
      icon: <FaCalendarAlt />,
      theme: "card-theme-teal",
    },
    {
      title: "Certificates / Cards Designs",
      value: dashboardData.designs,
      icon: <FaDraftingCompass />,
      theme: "card-theme-teal",
    },
    {
      title: "Active Categories",
      value: dashboardData.categories,
      icon: <FaLayerGroup />,
      theme: "card-theme-error",
    },
    {
      title: "Certificates Generated",
      value: dashboardData.certificates,
      icon: <FaGraduationCap />,
      theme: "card-theme-success",
    },
    {
      title: "Cities Serviced",
      value: dashboardData.cities,
      icon: <FaCity />,
      theme: "card-theme-teal",
    },
    {
      title: "Countries Reached",
      value: dashboardData.countries,
      icon: <FaGlobeAmericas />,
      theme: "card-theme-teal",
    },
    {
      title: "Remaining Events Stock",
      value: dashboardData.eventStock,
      icon: <FaDollyFlatbed />,
      theme: "card-theme-error",
    },
    {
      title: "Remaining Certificates Stock",
      value: dashboardData.certificateStock,
      icon: <FaReceipt />,
      theme: "card-theme-success",
    },
  ];

  const promoCodes = [
    {
      id: 1,
      discount: "25%",
      code: "CERT25",
      valid: "31 Dec 2026",
      plan: "Premium Plan",
    },
    {
      id: 2,
      discount: "40%",
      code: "SAVE40",
      valid: "31 Dec 2026",
      plan: "Annual Plan",
    },
  ];

  useEffect(() => {
    if (location.pathname !== "/admin/dashboard") return;

    startConfetti();

    if (!localStorage.getItem("profilePopupShown")) {
      setShowProfilePopup(true);
    }

    const popup = window.open("", "", "width=100,height=100");
    if (!popup || popup.closed || typeof popup.closed === "undefined") {
      setTimeout(() => openGuideModal(), 700);
    } else {
      popup.close();
    }

    return () => {
      confetti.reset();
    };
  }, [location.pathname]);

  const handlePopupOk = () => {
    localStorage.setItem("profilePopupShown", "true");
    setShowProfilePopup(false);
  };

  const copyPromo = (code) => {
    navigator.clipboard.writeText(code);
    alert("Promo code copied successfully.");
  };

  const startConfetti = () => {
    const defaults = {
      spread: 60,
      startVelocity: 30,
      ticks: 200,
      zIndex: 9999,
    };

    const fire = (particleRatio, opts) => {
      confetti({
        ...defaults,
        ...opts,
        particleCount: Math.floor(200 * particleRatio),
      });
    };

    fire(0.25, { spread: 26, startVelocity: 55 });
    fire(0.2, { spread: 60 });
    fire(0.35, { spread: 100, decay: 0.91, scalar: 0.8 });
    fire(0.1, { spread: 120, startVelocity: 25 });
    fire(0.1, { spread: 120, startVelocity: 45 });
  };

  const openGuideModal = () => {
    const guideEl = document.getElementById("guideModal");
    if (!guideEl) return;
    const modal = new Modal(guideEl);
    modal.show();
  };

  return (
    <main className="app-content content default_container">
      <section id="welcome-message">
        <h1 className="welcome-title">Welcome to</h1>
        <h2 className="eventcert-logo">
          EVENT<span>CERT</span>
        </h2>
      </section>

      <section className="dashboard-wrapper">
        <div className="container-fluid dashboard-container">
          <div className="row g-4">
            {cards.map((card, index) => (
              <div className="col-12 col-sm-6 col-lg-3 d-flex" key={index}>
                <div className={`premium-card ${card.theme} w-100`}>
                  <div className="card-icon">{card.icon}</div>
                  <div className="card-content">
                    <h3>{card.value.toLocaleString("en-IN")}</h3>
                    <p>{card.title}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="quick-links">
            <ul className="top-menu">
              <li>
                <a href="#">
                  <FaCreditCard />
                  <span>Payment</span>
                </a>
              </li>
              <li>
                <a href="#">
                  <FaCommentAlt />
                  <span>Feedback</span>
                </a>
              </li>
              <li>
                <a href="#">
                  <FaFileContract />
                  <span>T & C</span>
                </a>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {showProfilePopup && (
        <div className="profile-popup show">
          <div className="profile-popup-box">
            <div className="smile-happy">😁</div>
            <h3>Reminder</h3>
            <h2>Profile Required</h2>
            <p>
              Profile creation is mandatory to generate <strong>Certificates.</strong>
            </p>
            <button className="frutiger-button" onClick={handlePopupOk}>
              <div className="inner">
                <div className="top-white"></div>
                <span className="text">OK</span>
              </div>
            </button>
          </div>
        </div>
      )}

      <div
        className="promo-fab"
        data-bs-toggle="modal"
        data-bs-target="#promoModal"
      >
        <button className="vertical-btn">Promo Code</button>
      </div>

      <div className="modal fade" id="promoModal" tabIndex="-1">
        <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable modal-lg">
          <div className="modal-content promo-toggle-container">
            <div className="modal-header promo-header">
              <h3 className="modal-title w-100 text-center">Available Offers</h3>
              <button className="btn-close btn-close-white" data-bs-dismiss="modal"></button>
            </div>

            <div className="modal-body">
              {promoCodes.map((promo) => (
                <div className="coupon-cardd" key={promo.id}>
                  <div className="coupon-top">
                    <div className="gift-icon">🎁</div>
                    <h2>{promo.discount} OFF</h2>
                    <p>on your purchase</p>
                    <p>
                      Valid For : <b>{promo.plan}</b>
                    </p>
                  </div>

                  <div className="promo-code-section">
                    <span className="promo-code-label">Promo Code</span>
                    <div className="code-display">
                      <h3 className="promo-text">{promo.code}</h3>
                      <span className="copy-link" onClick={() => copyPromo(promo.code)}>
                        Copy Code
                      </span>
                    </div>
                    <span className="valid-until">Valid Till {promo.valid}</span>
                  </div>

                  <div className="coupon-footer">
                    <button className="btn-fly">Unlock Benefits</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="modal fade" id="guideModal" tabIndex="-1">
        <div className="modal-dialog modal-lg modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header guide-header">
              <h5 className="modal-title">Enable Pop-ups & Redirects</h5>
              <button className="btn-close btn-close-white" data-bs-dismiss="modal"></button>
            </div>

            <div className="modal-body guide-body">
              <div
                id="carouselExampleIndicators"
                className="carousel slide"
                data-bs-ride="carousel"
              >
                <div className="carousel-inner">
                  <div className="carousel-item active">
                    <img src="/img/Pop-ups_Redirects/step_1.png" className="d-block w-100" alt="" />
                  </div>
                  <div className="carousel-item">
                    <img src="/img/Pop-ups_Redirects/step_2.png" className="d-block w-100" alt="" />
                  </div>
                  <div className="carousel-item">
                    <img src="/img/Pop-ups_Redirects/step_3.png" className="d-block w-100" alt="" />
                  </div>
                  <div className="carousel-item">
                    <img src="/img/Pop-ups_Redirects/step_4.png" className="d-block w-100" alt="" />
                  </div>
                </div>

                <button
                  className="carousel-control-prev"
                  type="button"
                  data-bs-target="#carouselExampleIndicators"
                  data-bs-slide="prev"
                >
                  <span className="carousel-control-prev-icon"></span>
                </button>

                <button
                  className="carousel-control-next"
                  type="button"
                  data-bs-target="#carouselExampleIndicators"
                  data-bs-slide="next"
                >
                  <span className="carousel-control-next-icon"></span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Dashboard;


// import React, { useEffect, useState } from "react";
// import "./Dashboard.css";
// import confetti from "canvas-confetti";
// import { Modal } from "bootstrap";
// import "bootstrap/dist/css/bootstrap.min.css";
// import "bootstrap/dist/js/bootstrap.bundle.min.js";
// import { useLocation } from "react-router-dom";

// import {
//     FaCalendarAlt,
//     FaDraftingCompass,
//     FaLayerGroup,
//     FaGraduationCap,
//     FaCity,
//     FaGlobeAmericas,
//     FaDollyFlatbed,
//     FaReceipt,
//     FaCreditCard,
//     FaCommentAlt,
//     FaFileContract,
// } from "react-icons/fa";
// import Sidebar from "../Sidebar/Sidebar";

// const Dashboard = () => {
//     const location = useLocation();

//     const [dashboardData] = useState({
//         eventsUsed: 2450,
//         designs: "20000+",
//         categories: "500+",
//         certificates: 120500,
//         cities: 185,
//         countries: 35,
//         eventStock: 150,
//         certificateStock: 5000,
//     });

//     const [welcomeText, setWelcomeText] = useState("");

//     useEffect(() => {
//         setWelcomeText("Welcome to CertWala!");
//     }, []);
//     const [showProfilePopup, setShowProfilePopup] = useState(false);

//     const [promoCodes] = useState([
//         {
//             id: 1,
//             discount: "25%",
//             code: "CERT25",
//             valid: "31 Dec 2026",
//             plan: "Premium Plan",
//         },
//         {
//             id: 2,
//             discount: "40%",
//             code: "SAVE40",
//             valid: "31 Dec 2026",
//             plan: "Annual Plan",
//         },
//     ]);
//     const cards = [
//         {
//             title: "Total Events Used",
//             value: dashboardData.eventsUsed,
//             icon: <FaCalendarAlt />,
//             theme: "card-theme-teal",
//         },
//         {
//             title: "Certificates / Cards Designs",
//             value: dashboardData.designs,
//             icon: <FaDraftingCompass />,
//             theme: "card-theme-teal",
//         },
//         {
//             title: "Active Categories",
//             value: dashboardData.categories,
//             icon: <FaLayerGroup />,
//             theme: "card-theme-error",
//         },
//         {
//             title: "Certificates Generated",
//             value: dashboardData.certificates,
//             icon: <FaGraduationCap />,
//             theme: "card-theme-success",
//         },
//         {
//             title: "Cities Serviced",
//             value: dashboardData.cities,
//             icon: <FaCity />,
//             theme: "card-theme-teal",
//         },
//         {
//             title: "Countries Reached",
//             value: dashboardData.countries,
//             icon: <FaGlobeAmericas />,
//             theme: "card-theme-teal",
//         },
//         {
//             title: "Remaining Events Stock",
//             value: dashboardData.eventStock,
//             icon: <FaDollyFlatbed />,
//             theme: "card-theme-error",
//         },
//         {
//             title: "Remaining Certificates Stock",
//             value: dashboardData.certificateStock,
//             icon: <FaReceipt />,
//             theme: "card-theme-success",
//         },
//     ];

//     useEffect(() => {
//         if (location.pathname !== "/admin/dashboard") return;

//         setWelcomeText("Welcome to CertWala!");

//         startConfetti();

//         if (!localStorage.getItem("profilePopupShown")) {
//             setShowProfilePopup(true);
//         }

//         const popup = window.open("", "", "width=100,height=100");

//         if (!popup || popup.closed || typeof popup.closed === "undefined") {
//             setTimeout(() => {
//                 openGuideModal();
//             }, 700);
//         } else {
//             popup.close();
//         }
//     }, [location.pathname]);

//     useEffect(() => {
//         if (location.pathname !== "/admin/dashboard") return;

//         startConfetti();

//         return () => {
//             confetti.reset();
//         };
//     }, [location.pathname]);

//     const handlePopupOk = () => {
//         localStorage.setItem("profilePopupShown", "true");
//         setShowProfilePopup(false);
//     };

//     const copyPromo = (code) => {
//         navigator.clipboard.writeText(code);
//         alert("Promo code copied successfully.");
//     };


//     const startConfetti = () => {
//         const defaults = {
//             spread: 60,
//             startVelocity: 30,
//             ticks: 200,
//             zIndex: 9999,
//         };

//         const fire = (particleRatio, opts) => {
//             confetti({
//                 ...defaults,
//                 ...opts,
//                 particleCount: Math.floor(200 * particleRatio),
//             });
//         };

//         fire(0.25, {
//             spread: 26,
//             startVelocity: 55,
//         });

//         fire(0.2, {
//             spread: 60,
//         });

//         fire(0.35, {
//             spread: 100,
//             decay: 0.91,
//             scalar: 0.8,
//         });

//         fire(0.1, {
//             spread: 120,
//             startVelocity: 25,
//         });

//         fire(0.1, {
//             spread: 120,
//             startVelocity: 45,
//         });
//     };

//     const openGuideModal = () => {
//         const modal = new Modal(document.getElementById("guideModal"));
//         modal.show();
//     };
//     return (
//         <>
//             <main className="app-content content default_container">
//                 {/* Welcome Section */}

//                 <section id="welcome-message" className="text-center">
//                     <h1 className="welcome-title">
//                         Welcome to
//                     </h1>

//                     <h2 className="eventcert-logo">
//                         EVENT<span>CERT</span>
//                     </h2>

//                 </section>

//                 {/* Dashboard */}

//                 <section className="dashboard-wrapper">
//                     <div className="container-fluid dashboard-container">
//                         <div className="row g-4">
//                             {cards.map((card, index) => (
//                                 <div
//                                     className="col-xl-3 col-lg-6 col-md-6 col-sm-12"
//                                     key={index}
//                                 >
//                                     <div className={`premium-card ${card.theme}`}>
//                                         <div className="d-flex justify-content-between align-items-center">
//                                             <div className="card-icon">
//                                                 {card.icon}
//                                             </div>

//                                             <div>
//                                                 <h3 className="mb-0">{card.value.toLocaleString("en-IN")}</h3>
//                                             </div>
//                                         </div>

//                                         <div className="card-content">

//                                             <p>{card.title}</p>
//                                         </div>
//                                     </div>
//                                 </div>
//                             ))}
//                         </div>

//                         {/* Quick Links */}

//                         <div className="quick-links mt-5">
//                             <ul className="top-menu">
//                                 <li>
//                                     <a href="#">
//                                         <FaCreditCard />
//                                         <span>Payment</span>
//                                     </a>
//                                 </li>

//                                 <li>
//                                     <a href="#">
//                                         <FaCommentAlt />
//                                         <span>Feedback</span>
//                                     </a>
//                                 </li>

//                                 <li>
//                                     <a href="#">
//                                         <FaFileContract />
//                                         <span>T & C</span>
//                                     </a>
//                                 </li>
//                             </ul>
//                         </div>
//                     </div>
//                 </section>

//                 {/* PROFILE POPUP */}

//                 {showProfilePopup && (
//                     <div className="profile-popup show">

//                         <div className="profile-popup-box">

//                             <div className="icon smile-happy">
//                                 😁
//                             </div>

//                             <h3>Reminder</h3>

//                             <h2>Profile Required</h2>

//                             <p>
//                                 Profile creation is mandatory to generate
//                                 <strong> Certificates.</strong>
//                             </p>

//                             <button
//                                 className="frutiger-button"
//                                 onClick={handlePopupOk}
//                             >
//                                 <div className="inner">

//                                     <div className="top-white"></div>

//                                     <span className="text">
//                                         OK
//                                     </span>

//                                 </div>
//                             </button>

//                         </div>

//                     </div>
//                 )}

//                 {/* PROMO BUTTON*/}

//                 <div
//                     className="promo-fab"
//                     data-bs-toggle="modal"
//                     data-bs-target="#promoModal"
//                 >
//                     <button className="vertical-btn right-btn">
//                         Promo Code
//                     </button>
//                 </div>

//                 {/* PROMO MODAL */}

//                 <div
//                     className="modal fade"
//                     id="promoModal"
//                     tabIndex="-1"
//                 >

//                     <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable">

//                         <div className="modal-content promo-toggle-container">

//                             <div className="modal-header">

//                                 <h3 className="modal-title w-100 text-center">
//                                     Available Offers
//                                 </h3>

//                                 <button
//                                     className="btn-close"
//                                     data-bs-dismiss="modal"
//                                 ></button>

//                             </div>

//                             <div className="modal-body">

//                                 {promoCodes.map((promo) => (

//                                     <div
//                                         className="coupon-cardd mb-4"
//                                         key={promo.id}
//                                     >

//                                         <div className="coupon-top">

//                                             <div className="gift-icon">
//                                                 🎁
//                                             </div>

//                                             <h2>
//                                                 {promo.discount} OFF
//                                             </h2>

//                                             <p>on your purchase</p>

//                                             <p>
//                                                 Valid For :
//                                                 <b> {promo.plan}</b>
//                                             </p>

//                                         </div>

//                                         <div className="promo-code-section">

//                                             <span className="promo-code-label">
//                                                 Promo Code
//                                             </span>

//                                             <div className="code-display">

//                                                 <h3 className="promo-text">
//                                                     {promo.code}
//                                                 </h3>

//                                                 <span
//                                                     className="copy-link"
//                                                     onClick={() => copyPromo(promo.code)}
//                                                 >
//                                                     Copy Code
//                                                 </span>

//                                             </div>

//                                             <span className="valid-until">
//                                                 Valid Till {promo.valid}
//                                             </span>

//                                         </div>

//                                         <div className="coupon-footer">

//                                             <button className="btn-fly">
//                                                 Unlock Benefits
//                                             </button>

//                                         </div>

//                                     </div>

//                                 ))}

//                             </div>

//                         </div>

//                     </div>

//                 </div>
//                 {/* ==========================
//         GUIDE MODAL
// =========================== */}

//                 <div
//                     className="modal fade"
//                     id="guideModal"
//                     tabIndex="-1"
//                 >

//                     <div className="modal-dialog modal-lg">

//                         <div className="modal-content">

//                             <div className="modal-header">

//                                 <h5 className="modal-title">
//                                     Enable Pop-ups & Redirects
//                                 </h5>

//                                 <button
//                                     className="btn-close"
//                                     data-bs-dismiss="modal"
//                                 ></button>

//                             </div>

//                             <div className="modal-body">

//                                 <div
//                                     id="carouselExampleIndicators"
//                                     className="carousel slide"
//                                     data-bs-ride="carousel"
//                                 >

//                                     <div className="carousel-inner">

//                                         <div className="carousel-item active">

//                                             <img
//                                                 src="/img/Pop-ups_Redirects/step_1.png"
//                                                 className="d-block w-100"
//                                                 alt=""
//                                             />

//                                         </div>

//                                         <div className="carousel-item">

//                                             <img
//                                                 src="/img/Pop-ups_Redirects/step_2.png"
//                                                 className="d-block w-100"
//                                                 alt=""
//                                             />

//                                         </div>

//                                         <div className="carousel-item">

//                                             <img
//                                                 src="/img/Pop-ups_Redirects/step_3.png"
//                                                 className="d-block w-100"
//                                                 alt=""
//                                             />

//                                         </div>

//                                         <div className="carousel-item">

//                                             <img
//                                                 src="/img/Pop-ups_Redirects/step_4.png"
//                                                 className="d-block w-100"
//                                                 alt=""
//                                             />

//                                         </div>

//                                     </div>

//                                     <button
//                                         className="carousel-control-prev"
//                                         type="button"
//                                         data-bs-target="#carouselExampleIndicators"
//                                         data-bs-slide="prev"
//                                     >
//                                         <span className="carousel-control-prev-icon"></span>
//                                     </button>

//                                     <button
//                                         className="carousel-control-next"
//                                         type="button"
//                                         data-bs-target="#carouselExampleIndicators"
//                                         data-bs-slide="next"
//                                     >
//                                         <span className="carousel-control-next-icon"></span>
//                                     </button>

//                                 </div>

//                             </div>

//                         </div>

//                     </div>

//                 </div>
//             </main>
//         </>
//     );
// };

// export default Dashboard;
