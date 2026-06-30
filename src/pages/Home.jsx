// import Navbar from "../components/common/navbar/Navbar";
import Footer from "../components/common/footer/Footer";
import Navbar from "../components/common/navbar/Navbar";
import About from "../components/home/about/About";
import Certificates from "../components/home/certificates/Certificates";
import EventHighlights from "../components/home/eventhighlights/EventHighlights";
import Eventinfo from "../components/home/eventinfo/Eventinfo";
import Facilities from "../components/home/facilities/Facilities";
import Hero from "../components/home/hero/Hero";
import Services from "../components/home/services/Services";
import WhyChooseUs from "../components/home/whychooseus/WhyChooseUs";

function Home() {
    return (


        <>
        <Navbar/>
            <Hero />
           
            <div data-aos="fade-up">
                <Eventinfo />
            </div>

            <div data-aos="fade-up" data-aos-delay="100">
                <Certificates />
            </div>

            <div data-aos="fade-up" data-aos-delay="150">
                <About />
            </div>

            <div data-aos="fade-up" data-aos-delay="200">
                <Facilities />
            </div>

            <div data-aos="fade-up" data-aos-delay="250">
                <WhyChooseUs />
            </div>

            <div data-aos="fade-up" data-aos-delay="300">
                <EventHighlights />
            </div>

            <div data-aos="fade-up" data-aos-delay="350">
                <Services />
            </div>

            <Footer />
        </>
    );
}


export default Home