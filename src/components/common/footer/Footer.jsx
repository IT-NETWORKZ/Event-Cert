import "./Footer.css";

// import logo from "../../../assets/img/logo.png";

import {
  MapPin,
  Phone,
  Mail,
  ChevronRight,
  Facebook,
  Instagram,
  Linkedin,
  Youtube
} from "lucide-react";

function Footer() {

return (

<section className="footer-section">

<div className="container">

<div className="row gy-3">



{/* Column 1 */}

<div className="col-lg-3 col-md-6">

{/* <img
src={logo}
alt=""
className="footer-logo"
/> */}


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

Chennai – 41, India

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

<Facebook size={16}/>

</a>


<a href="#">

<Youtube size={16}/>

</a>


<a href="#">

<Instagram size={16}/>

</a>


<a href="#">

<Linkedin size={16}/>

</a>



</div>


</div>






{/* Column 3 */}


<div className="col-lg-3 col-md-6">


<h4 className="footer-title">

Popular Link

</h4>



<ul className="footer-links">


<li>

<ChevronRight size={15}/>

Preview

</li>


<li>

<ChevronRight size={15}/>

Terms & Conditions

</li>



<li>

<ChevronRight size={15}/>

Shipping & Delivery

</li>



<li>

<ChevronRight size={15}/>

Privacy Policy

</li>



<li>

<ChevronRight size={15}/>

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

<ChevronRight size={15}/>

FAQ

</li>


<li>

<ChevronRight size={15}/>

Organization Benefits

</li>



<li>

<ChevronRight size={15}/>

Individual Benefits

</li>



<li>

<ChevronRight size={15}/>

Key Features

</li>



<li>

<ChevronRight size={15}/>

Why Choose EventCert

</li>



<li>

<ChevronRight size={15}/>

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

</section>

)

}

export default Footer