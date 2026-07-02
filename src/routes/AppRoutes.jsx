import { Routes, Route } from "react-router-dom";

import Home from "../pages/HomeDefault/Home";
import Services from "../components/services/Services";
import Facilities from "../components/Facilities/Facilities";
import Contact from "../components/Contact/Contact";
import Register from "../components/home/register/Register";
import Subscription from "../components/Subscription/Subscription";

import Admin from "../pages/Admin/Admin";
import Dashboard from "../components/admin/Dashboard/Dashboard";
import Profile from "../pages/Admin/Profile";

function AppRoutes() {
    return (
        <Routes>

            {/* Public Routes */}

            <Route path="/" element={<Home />} />

            <Route path="/services" element={<Services />} />

            <Route path="/facilities" element={<Facilities />} />

            <Route path="/contact" element={<Contact />} />

            <Route path="/register" element={<Register />} />

            <Route path="/subscription" element={<Subscription />} />

            {/* Admin Layout */}

            <Route path="/admin" element={<Admin />}>

                {/* Default page -> /admin */}
                <Route index element={<Dashboard />} />

                {/* /admin/dashboard */}
                <Route path="dashboard" element={<Dashboard />} />

                {/* /admin/profile */}
                <Route path="profile" element={<Profile />} />

            </Route>

        </Routes>
    );
}

export default AppRoutes;