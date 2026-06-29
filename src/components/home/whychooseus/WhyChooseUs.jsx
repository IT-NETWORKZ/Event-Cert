import "./WhyChooseUs.css";

import {
  Check,
  HandCoins,
  PencilRuler,
  UserRound,
  CalendarDays,
  ListChecks
} from "lucide-react";

const features = [
  {
    icon: <Check size={52} />,
    title: "Customer Satisfaction",
    desc: "We value your trust and happiness. Every service is designed to deliver excellence, reliability and complete satisfaction — ensuring you enjoy a seamless and delightful experience every time"
  },

  {
    icon: <HandCoins size={52} />,
    title: "Budget Friendly",
    desc: "Enjoy premium-quality designs and automation tools without overspending. Our transparent, affordable plans make professional certificate, invitation and greeting management accessible to everyone."
  },

  {
    icon: <PencilRuler size={52} />,
    title: "Sustainable Balancing",
    desc: "Go digital, go green! EventCert promotes eco-friendly celebrations by eliminating paper waste through 100% digital certificates, invitations and greetings — making every event environmentally responsible."
  },

  {
    icon: <UserRound size={52} />,
    title: "User-Friendly Experience",
    desc: "Built for simplicity — no design skills needed! Create, customize and send certificates, invitations and greetings with just a few clicks through our intuitive, easy-to-navigate platform."
  },

  {
    icon: <CalendarDays size={52} />,
    title: "Time Saving",
    desc: "Automate your entire process — from creation to delivery. EventCert helps you generate and share hundreds of digital documents instantly, saving hours of manual work."
  },

  {
    icon: <ListChecks size={52} />,
    title: "Multifunctional Platform",
    desc: "All-in-one solution for every occasion! Design, promote and deliver certificates, invitations and greetings from one dashboard — perfect for individuals, institutions and organizations of all sizes."
  }
];

function WhyChooseUs() {

return (

<section className="why-section">

<div className="container">


<div className="text-center mb-5">

<h2 className="why-title">

Why People

<span>

CHOOSE US

</span>

</h2>

<div className="why-line"></div>

</div>



<div className="row g-5">


{features.map((item,index)=>(


<div
className="col-lg-4 col-md-6"
key={index}
>

<div className="why-card">

<div className="why-icon">

{item.icon}

</div>


<h4>

{item.title}

</h4>


<p>

{item.desc}

</p>


</div>

</div>

))}


</div>

</div>

</section>

);

}

export default WhyChooseUs;

// import "./WhyChooseUs.css";

// import {
//   Check,
//   HandCoins,
//   PencilRuler,
//   UserRound,
//   CalendarDays,
//   ListChecks,
// } from "lucide-react";

// const features = [
//   {
//     icon: <Check size={52} />,
//     title: "Customer Satisfaction",
//     desc: "We value your trust and happiness. Every service is designed to deliver excellence, reliability and complete satisfaction — ensuring you enjoy a seamless and delightful experience every time.",
//   },
//   {
//     icon: <HandCoins size={52} />,
//     title: "Budget Friendly",
//     desc: "Enjoy premium-quality designs and automation tools without overspending. Our transparent, affordable plans make professional certificate, invitation and greeting management accessible to everyone.",
//   },
//   {
//     icon: <PencilRuler size={52} />,
//     title: "Sustainable Balancing",
//     desc: "Go digital, go green! EventCert promotes eco-friendly celebrations by eliminating paper waste through 100% digital certificates, invitations and greetings — making every event environmentally responsible.",
//   },
//   {
//     icon: <UserRound size={52} />,
//     title: "User-Friendly Experience",
//     desc: "Built for simplicity — no design skills needed! Create, customize and send certificates, invitations and greetings with just a few clicks through our intuitive, easy-to-navigate platform.",
//   },
//   {
//     icon: <CalendarDays size={52} />,
//     title: "Time Saving",
//     desc: "Automate your entire process — from creation to delivery. EventCert helps you generate and share hundreds of digital documents instantly, saving hours of manual work.",
//   },
//   {
//     icon: <ListChecks size={52} />,
//     title: "Multifunctional Platform",
//     desc: "All-in-one solution for every occasion! Design, promote and deliver certificates, invitations and greetings from one dashboard — perfect for individuals, institutions and organizations of all sizes.",
//   },
// ];

// function WhyChooseUs() {
//   return (
//     <section className="why-section">
//       <div className="container">

//         {/* Section Heading */}
//         <div
//           className="text-center mb-5"
//           data-aos="fade-down"
//         >
//           <h2 className="why-title">
//             Why People <span>CHOOSE US</span>
//           </h2>

//           <div className="why-line"></div>
//         </div>

//         {/* Feature Cards */}
//         <div className="row g-5">
//           {features.map((item, index) => (
//             <div
//               className="col-lg-4 col-md-6"
//               key={index}
//               data-aos="fade-up"
//               data-aos-delay={index * 150}
//             >
//               <div className="why-card">
//                 <div className="why-icon">
//                   {item.icon}
//                 </div>

//                 <h4>{item.title}</h4>

//                 <p>{item.desc}</p>
//               </div>
//             </div>
//           ))}
//         </div>

//       </div>
//     </section>
//   );
// }

// export default WhyChooseUs;