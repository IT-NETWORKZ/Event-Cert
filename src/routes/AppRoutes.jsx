import { Routes, Route } from 'react-router-dom'
import Services from '../components/services/Services'
import Facilities from '../components/Facilities/Facilities'
import Dashboard from '../components/admin/Dashboard/Dashboard'
import Admin from '../pages/Admin/Admin'
import Contact from '../components/Contact/Contact'
import Home from "../pages/Home"
import Register from '../pages/register/Register'
import Subscription from '../components/Subscription/Subscription'
import Profile from '../pages/Admin/Profile'

function AppRoutes() {

    return (

        <Routes>

            <Route path="/" element={<Home />} />

            <Route path="/services" element={<Services />} />

            <Route path="/facilities" element={<Facilities />} />

            <Route path="/contact" element={<Contact />} />

            <Route path="/register" element={<Register />} />

            <Route path="/subscription" element={<Subscription />} />

            {/* Admin Routes */}
            <Route path="/admin" element={<Admin />}>

                <Route path="dashboard" element={<Dashboard />} />

                <Route path="profile" element={<Profile />} />

            </Route>

        </Routes>

    )

}


export default AppRoutes