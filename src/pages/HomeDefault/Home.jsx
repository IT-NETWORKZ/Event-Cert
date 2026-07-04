import Navbar from "../../components/common/navbar/Navbar";
import Footer from "../../components/common/footer/Footer";
import "../../css/Home.css";
import About from "../../components/home/about/About";
import Certificates from "../../components/home/certificates/Certificates";
import EventHighlights from "../../components/home/eventhighlights/EventHighlights";
import Eventinfo from "../../components/home/eventinfo/Eventinfo";
import Facilities from "../../components/home/facilities/Facilities";
import Hero from "../../components/home/hero/Hero";
import Services from "../../components/home/services/Services";
import WhyChooseUs from "../../components/home/whychooseus/WhyChooseUs";
import ScrollToTopButton from "../../components/common/ScrollToTopButton/ScrollToTopButton";

function Home() {
    return (
        <>
            <div className="home-page">


                <Navbar />

                

                    <Hero />
               

                
                    <Eventinfo />
                

              
                    <Certificates />
              

               
                    <About />
                

                
                    <Facilities />
                

                
                    <WhyChooseUs />
                

               
                    <EventHighlights />
            

             
                    <Services />
               
               
                    <Footer />

               
                <ScrollToTopButton />
            </div>
        </>
    );
}


export default Home
