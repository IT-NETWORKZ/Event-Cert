import "./EventHighlights.css";

import cert1 from "../../../assets/img/project-1.jpg";
import cert2 from "../../../assets/img/project-2.jpg";
import cert3 from "../../../assets/img/project-3.jpg";
import cert4 from "../../../assets/img/project-4.jpg";
import cert5 from "../../../assets/img/project-5.jpg";
import cert6 from "../../../assets/img/project-6.jpg";

function EventHighlights() {


const items=[

{
img:cert1,
text:"800+ Ways to Spread Joy"
},

{
img:cert2,
text:"Recognize Every Achievement\n3000+ Styles"
},

{
img:cert3,
text:"3000+ Ways to Certify Success"
},

{
img:cert4,
text:"Promote Professionally"
},

{
img:cert5,
text:"2000+ Elegant Cards to Celebrate Love"
},

{
img:cert6,
text:"Promote, Participate, Appreciate\n(1000+ Combinations)"
}

];



return(

<section id="eventhub" className="highlight-section">

<div className="container-fluid p-90">


<div className="row g-0">


{/* LEFT */}


<div className="col-lg-5">

<div className="highlight-content">


<h2>

EventCert

<span>

HIGHLIGHTS

</span>

</h2>



<p>

Promote Events, Send Wishes &

Recognize Achievements -

All in One Platform.


</p>


</div>


</div>





{/* RIGHT */}


<div className="col-lg-7">


<div className="row g-0">


{items.map((item,index)=>(


<div
className="col-md-4"
key={index}
>


<div className="highlight-card">


<img

src={item.img}

alt=""

/>



<div className="overlay">


<p>

{item.text}

</p>


</div>



</div>



</div>


))}


</div>



</div>



</div>


</div>

</section>

);

}


export default EventHighlights;