import "./Footer.css";
import { Link } from "react-router-dom";

import {
  MapPin,
  Phone,
  Mail,
  ChevronRight
} from "lucide-react";

import logo from "../../../assets/img/logo_EventCert.png";

function Footer() {

return (

<footer className="footer-section">

<div className="container">

<div className="row gy-2">



{/* Column 1 */}

<div className="col-lg-3 col-md-6">

<img
  src={logo}
  alt="EventCert"
  className="footer-logo"
/>


<p className="footer-desc">

eventcert.com – A smart platform to design,
manage and share personalized event
certificates and greeting cards instantly.
Perfect for schools, corporates and organizers
to celebrate achievements effortlessly.

</p>

</div>




{/* Column 2 */}

<div className="col-lg-3 col-md-6">


<h4 className="footer-title">

Get In Touch

</h4>


<div className="footer-contact">


<p>

<MapPin size={16}/>

<span>

Chennai

<br/>

Kavin India Pvt Ltd

<br/>

194F II Floor

<br/>

Venkateswara Nagar

<br/>

12th Street

Kottivakkam

<br/>

Chennai – 41

</span>

</p>



<p>

<Phone size={16}/>

<span>

+91 4440423238

</span>

</p>



<p>

<Mail size={16}/>

<span>

info@eventcert.com

</span>

</p>



</div>



<div className="social-icons">


<a href="#">

<i className="bi bi-facebook"></i>

</a>



<a href="#">

<i className="bi bi-twitter-x"></i>

</a>



<a href="#">

<i className="bi bi-youtube"></i>

</a>



<a href="#">

<i className="bi bi-instagram"></i>

</a>



<a href="#">

<i className="bi bi-linkedin"></i>

</a>



</div>


</div>






{/* Column 3 */}


<div className="col-lg-3 col-md-6">


<h4 className="footer-title">

Popular Links

</h4>



<ul className="footer-links">


<li>

<ChevronRight size={14}/>

<Link to="/preview">Preview</Link>

</li>



<li>

<ChevronRight size={14}/>

<Link to="/termsandconditions">Terms & Conditions</Link>

</li>



<li>

<ChevronRight size={14}/>

<Link to="/shippinganddelivery">Shipping & Delivery</Link>

</li>



<li>

<ChevronRight size={14}/>

<Link to="/privacyandpolicy">Privacy Policy</Link>

</li>



<li>

<ChevronRight size={14}/>

<Link to="/refundprocess">Cancellation & Refund</Link>

</li>



</ul>


</div>






{/* Column 4 */}



<div className="col-lg-3 col-md-6">


<h4 className="footer-title">

Our Services

</h4>



<ul className="footer-links">


<li>

<ChevronRight size={14}/>

<Link to="/faq">FAQ</Link>

</li>



<li>

<ChevronRight size={14}/>

<Link to="/benefits">Organization Benefits</Link>

</li>



<li>

<ChevronRight size={14}/>

<Link to="/individual_benefits">Individual Benefits</Link>

</li>



<li>

<ChevronRight size={14}/>

<Link to="/keyfeatures">Key Features</Link>

</li>



<li>

<ChevronRight size={14}/>

<Link to="/whychooseus">Why Choose EventCert</Link>

</li>



<li>

<ChevronRight size={14}/>

<Link to="/getstarted">Get Started In Minutes</Link>

</li>



</ul>


</div>


</div>



<hr className="footer-line"/>



<div className="footer-bottom">

Designed & Developed by

<b>

Kavin India Pvt Ltd ©

</b>

</div>



</div>

</footer>

)

}

export default Footer;