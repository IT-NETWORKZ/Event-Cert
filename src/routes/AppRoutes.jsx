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
import Subscriptionplan from "../components/admin/Subscription/Subscriptionplan";
import FeedbackForm from "../components/admin/FeedbackForm/FeedbackForm";
import CustomPlus from "../pages/Admin/CustomPlus";
import Payment from "../components/admin/Payment/Payment";
import AddEvent from "../components/admin/AddEvent/AddEvent";

import CPanel from "../pages/CPanel/CPanel";
import CDashboard from "../components/cpanel/Dashboard/CDashboard";
import CLogin from "../components/cpanel/Login/CLogin";
import CPContact from "../pages/CPanel/CPContact";
import CRegistrationList from "../pages/CPanel/CRegistrationList";
import CAddplans from "../pages/CPanel/CAddplans";


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
            <Route path="/admin/customplus" element={<CustomPlus />} />
            <Route path="/admin" element={<Admin />}>

                {/* Default page -> /admin */}
                <Route index element={<Dashboard />} />

                {/* /admin/dashboard */}
                <Route path="dashboard" element={<Dashboard />} />

                {/* /admin/profile */}
                <Route path="profile" element={<Profile />} />

                {/* /admin/subscriptionplan */}
                <Route path="subscriptionplan" element={<Subscriptionplan />} />


                {/* /admin/feedback */}
                <Route path="feedback" element={<FeedbackForm />} />

                {/* /admin/payment */}
                <Route path="payment" element={<Payment />} />

                {/* /admin/addevent */}
                <Route path="addevent" element={<AddEvent />} />
            </Route>


            {/* ================= CPANEL LAYOUT ================= */}

      {/* Unified CPanel Route Group */}
<Route path="/cpanel">
  {/* Resolves exactly at: /cpanel */}
  <Route index element={<CLogin />} />

  {/* Resolves sub-routes wrapped in the <CPanel /> Layout layout */}
  <Route element={<CPanel />}>
    <Route path="dashboard" element={<CDashboard />} />
    <Route path="contact" element={<CPContact />} />
    <Route path="registrationlist" element={<CRegistrationList />} />
    <Route path="addplans" element={<CAddplans />} />
  </Route>
</Route>




        </Routes>
    );
}

export default AppRoutes;