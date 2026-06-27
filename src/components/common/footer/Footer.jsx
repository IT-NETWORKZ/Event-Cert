import "./Footer.css";

import {
  MapPin,
  Phone,
  Mail,
  ChevronRight
} from "lucide-react";

function Footer() {

return (

<footer className="footer-section">

<div className="container">

<div className="row gy-2">



{/* Column 1 */}

<div className="col-lg-3 col-md-6">

<h4 className="footer-title">

EventCert

</h4>


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

Preview

</li>



<li>

<ChevronRight size={14}/>

Terms & Conditions

</li>



<li>

<ChevronRight size={14}/>

Shipping & Delivery

</li>



<li>

<ChevronRight size={14}/>

Privacy Policy

</li>



<li>

<ChevronRight size={14}/>

Cancellation & Refund

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

FAQ

</li>



<li>

<ChevronRight size={14}/>

Organization Benefits

</li>



<li>

<ChevronRight size={14}/>

Individual Benefits

</li>



<li>

<ChevronRight size={14}/>

Key Features

</li>



<li>

<ChevronRight size={14}/>

Why Choose EventCert

</li>



<li>

<ChevronRight size={14}/>

Get Started In Minutes

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