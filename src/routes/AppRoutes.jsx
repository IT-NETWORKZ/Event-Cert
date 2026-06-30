import { Routes, Route } from 'react-router-dom'
import Services from '../components/services/Services'
import Facilities from '../components/Facilities/Facilities'
import Dashboard from '../components/admin/Dashboard/Dashboard'
import Admin from '../pages/Admin'
import Contact from '../components/Contact/Contact'
import Home from "../pages/Home"
import Register from '../pages/register/Register'
import Subscription from '../components/Subscription/Subscription'

function AppRoutes() {

    return (

        <Routes>
            {/* Home Page */}
            <Route path="/" element={<Home/>} />
            {/* Services page */}
            <Route path="/services" element={<Services />} />
            {/* Facilities */}
            <Route path="/facilities" element={<Facilities />} />
            {/* Admin Dashboard */}
            <Route path="/admin" element={<Admin/>} />
            {/* Admin Dashboard */}

             {/* Contact */}
            <Route path="/contact" element={<Contact />} />

              {/* Register */}
            <Route path="/register" element={<Register />} />

             <Route path="/subscription" element={<Subscription />} />





        </Routes>

    )

}


export default AppRoutes