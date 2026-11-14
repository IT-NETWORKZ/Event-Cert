import Navbar from "../../components/common/navbar/Navbar";
import Footer from "../../components/common/footer/Footer";
import "../../css/Home.css";
import Hero from "../../components/home/hero/Hero";
import Eventinfo from "../../components/home/eventinfo/Eventinfo";
import About from "../../components/home/about/About";
import Services from "../../components/home/services/Services";
import HomeFeedback from "../../components/home/feedback/HomeFeedback";
import Certificates from "../../components/home/certificates/Certificates";
import EventHighlights from "../../components/home/eventhighlights/EventHighlights";
import Facilities from "../../components/home/facilities/Facilities";
import WhyChooseUs from "../../components/home/whychooseus/WhyChooseUs";
import ScrollToTopButton from "../../components/common/ScrollToTopButton/ScrollToTopButton";

import { motion } from "framer-motion";

const fadeUp = {
    hidden: { opacity: 0, y: 40 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.7, ease: "easeOut" },
    },
};

// Each section fades in as it scrolls into view (no stagger delay).
const FadeSection = ({ children }) => (
    <motion.div
        variants={fadeUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.15 }}
    >
        {children}
    </motion.div>
);

function Home() {
    return (
        <div className="home-page">
            <Navbar />

            {/* 1. Introduce the brand */}
            <Hero />

            {/* 2. Event details / quick info */}
            <FadeSection>
                <Eventinfo />
            </FadeSection>

            {/* 3. Who we are */}
            <FadeSection>
                <About />
            </FadeSection>

            {/* 4. What we offer */}
            <FadeSection>
                <Services />
            </FadeSection>

            {/* 5. Customer feedback (middle of the page) */}
            <FadeSection>
                <HomeFeedback />
            </FadeSection>

            {/* 6. Certificate samples */}
            <FadeSection>
                <Certificates />
            </FadeSection>

            {/* 7. Event hub: greeting and event banners */}
            <FadeSection>
                <EventHighlights />
            </FadeSection>

            {/* 8. Platform features */}
            <FadeSection>
                <Facilities />
            </FadeSection>

            {/* 9. Reasons to choose us, closing argument before the footer */}
            <FadeSection>
                <WhyChooseUs />
            </FadeSection>

            <Footer />

            <ScrollToTopButton />
        </div>
    );
}

export default Home;