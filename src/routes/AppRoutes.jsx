import { Routes, Route } from 'react-router-dom'
import Home from '../pages/Home'
import Services from '../components/services/Services'
import Facilities from '../components/Facilities/Facilities'
import Contact from '../components/Contact/Contact'


function AppRoutes() {

    return (

        <Routes>
            {/* Home Page */}
            <Route path="/" element={<Home />} />
            {/* Services page */}
            <Route path="/services" element={<Services />} />
            {/* Facilities */}
            <Route path="/facilities" element={<Facilities />} />

             {/* Contact */}
            <Route path="/contact" element={<Contact />} />

        </Routes>

    )

}


export default AppRoutes