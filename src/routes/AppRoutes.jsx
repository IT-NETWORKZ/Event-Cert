import { Routes, Route } from "react-router-dom";

import Home from "../pages/HomeDefault/Home";
import Services from "../components/services/Services";
import Facilities from "../components/Facilities/Facilities";
import Contact from "../components/home/Contact/Contact";
import Register from "../components/home/register/Register";
import Subscription from "../components/Subscription/Subscription";
import About from "../components/home/about/About";
import AboutUs from "../components/AboutUs/AboutUs";
import CResetPass from "../pages/CPanel/CResetPass";

import Admin from "../pages/Admin/Admin";
import Dashboard from "../components/admin/Dashboard/Dashboard";
import Profile from "../pages/Admin/Profile";
import Subscriptionplan from "../components/admin/Subscription/Subscriptionplan";
import FeedbackForm from "../components/admin/FeedbackForm/FeedbackForm";
import CustomPlus from "../pages/Admin/CustomPlus";
import Schedular from "../pages/Admin/Schedular";
import StatusReport from "../components/common/StatusReport/StatusReport";
import Payment from "../components/admin/Payment/Payment";
import AddEvent from "../components/admin/AddEvent/AddEvent";
import AdminParticipate from "../components/admin/AddEvent/AdminParticipate";
import EventRecipants from "../components/admin/AddEvent/EventRecipants";
import EventAttendance from "../components/admin/AddEvent/EventAttendance";
import UploadEventImages from "../components/admin/AddEvent/UploadEventImages";
//import MarkAttendance from "./components/admin/AddEvent/MarkAttendance";
import CustomPastRecords from "../components/admin/CustomPlus/CustomPastRecords";
import CustomRetrieveRecords from "../components/admin/CustomPlus/CustomRetrieveRecords";


import ResetPassword from "../components/admin/ResetPassword/ResetPassword";
import Preview from "../components/home/footerpages/PopularLinks/Preview/Preview";
import Terms from "../components/home/footerpages/PopularLinks/T&C/Terms";
import Shipping from "../components/home/footerpages/PopularLinks/Shipping&Delivery/Shipping";
import PrivacyPolicy from "../components/home/footerpages/PopularLinks/PrivacyPolicy/PrivacyPolicy";
import CancellationRefund from "../components/home/footerpages/PopularLinks/Cancellation&Refund/CancellationRefund";
import FAQ from "../components/home/footerpages/OurServices/FAQ/FAQ";
import OrganizationBenefits from "../components/home/footerpages/OurServices/OrganizationBenefits/OrganizationBenefits";
import IndividualBenefits from "../components/home/footerpages/OurServices/IndividualBenefits/IndividualBenefits";
import KeyFeatures from "../components/home/footerpages/OurServices/KeyFeatures/KeyFeatures";
import WhyChooseEventCert from "../components/home/footerpages/OurServices/WhyChooseEventCert/WhyChooseEventCert";
import GetStarted from "../components/home/footerpages/OurServices/GetStartedInMinutes/GetStarted";

import CPanel from "../pages/CPanel/CPanel";
import CDashboard from "../components/cpanel/Dashboard/CDashboard";
import CLogin from "../components/cpanel/Login/CLogin";
import CForgotPassword from "../pages/CPanel/CForgotPassword";
import CPContact from "../pages/CPanel/CPContact";
import CRegistrationList from "../pages/CPanel/CRegistrationList";
import CAddplans from "../pages/CPanel/CAddplans";
import CPromoCode from "../components/cpanel/Promocode/CPromoCode";
import CAddTemplates from "../components/cpanel/AddTemplates/CAddTemplates";
import CFeedbackDetails from "../pages/CPanel/CFeedbackDetails";
import CProfile from "../pages/CPanel/CProfile";
import CAddDraft from "../components/cpanel/AddCategory/CAddDraft";
import CAddCategory from "../components/cpanel/AddCategory/CAddCategory";
import AdminTransaction from "../components/cpanel/AdminTransaction/AdminTransaction";
import CResetPassword from "../components/cpanel/ResetPassword/CResetPassword";
import Taxes from "../components/cpanel/Taxes/Taxes";
import Event from "../components/home/eventinfo/Event";
import MarkAttendance from "../components/home/eventinfo/Event";



import ProtectedRoute from "../routes/ProtectedRoute";
import PaymentGateway from "../components/PaymentGateway/PaymentGateway";

function AppRoutes() {
    return (
        <Routes>
            {/* ================= PUBLIC ROUTES ================= */}
            <Route path="/" element={<Home />} />
            <Route path="/services" element={<Services />} />
            <Route path="/About" element={<AboutUs />} />
            <Route path="/facilities" element={<Facilities />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/register" element={<Register />} />
            <Route path="/subscription" element={<Subscription />} />
            <Route path="/event" element={<Event />} />
            <Route path="/attendance" element={<MarkAttendance />} />
            <Route path="/reset-password" element={<CResetPass />} />



            {/* Popular Links (footer > Pages) */}
            <Route path="/preview" element={<Preview />} />
            <Route path="/termsandconditions" element={<Terms />} />
            <Route path="/shippinganddelivery" element={<Shipping />} />
            <Route path="/privacyandpolicy" element={<PrivacyPolicy />} />
            <Route path="/refundprocess" element={<CancellationRefund />} />

            {/* Our Services (footer > Pages) */}
            <Route path="/faq" element={<FAQ />} />
            <Route path="/benefits" element={<OrganizationBenefits />} />
            <Route path="/individual_benefits" element={<IndividualBenefits />} />
            <Route path="/keyfeatures" element={<KeyFeatures />} />
            <Route path="/whychooseus" element={<WhyChooseEventCert />} />
            <Route path="/getstarted" element={<GetStarted />} />

            {/* ================= ADMIN (requires login + role) ================= */}
            <Route element={<ProtectedRoute roles={["Admin", "User"]} />}>
                <Route path="/admin/customplus" element={<CustomPlus />} />
                <Route path="/admin/schedular" element={<Schedular />} />


                <Route path="/admin" element={<Admin />}>

                    {/* /admin */}
                    <Route index element={<Dashboard />} />
                    {/* /admin/dashboard */}
                    <Route path="dashboard" element={<Dashboard />} />
                    {/* /admin/profile */}
                    <Route path="profile" element={<Profile />} />
                    {/* /admin/subscriptionplan */}
                    <Route path="subscriptionplan" element={<Subscriptionplan />} />
                    {/* /admin/resetPassword */}
                    <Route path="resetPassword" element={<ResetPassword />} />
                    {/* /admin/feedback */}
                    <Route path="feedback" element={<FeedbackForm />} />
                    {/* /admin/payment */}
                    <Route path="payment" element={<Payment />} />
                    {/* /admin/addevent */}
                    <Route path="addevent" element={<AddEvent />} />
                    <Route path="admin-participate" element={<AdminParticipate />} />
                    <Route path="event-recipants" element={<EventRecipants />} />
                    <Route path="event-attendance" element={<EventAttendance />} />
                    <Route path="upload-event-images" element={<UploadEventImages />} />

                    {/* Delivery Report pages (inside the layout, so sidebar + navbar show) */}
                    <Route path="custom-status" element={<StatusReport type="custom" />} />
                    <Route path="schedule-status" element={<StatusReport type="schedule" />} />

                    {/* PastRecords & RetrieveRecords */}
                    <Route path="custom-past-records" element={<CustomPastRecords />} />
                    <Route path="custom-retrieve-records" element={<CustomRetrieveRecords />} />

                    <Route path="/admin/payment/:planId" element={<PaymentGateway />} />



                </Route>
            </Route>

            {/* ================= CPANEL ================= */}
            <Route path="/cpanel">
                {/* /cpanel (Login) - public */}
                <Route index element={<CLogin />} />

                {/* /cpanel/forgot-password - public */}
                <Route path="forgot-password" element={<CForgotPassword />} />

                {/* Protected sub-routes wrapped in the <CPanel /> layout */}
                <Route element={<ProtectedRoute roles={["SuperAdmin", "superadmin"]} />}>
                    <Route element={<CPanel />}>
                        <Route path="dashboard" element={<CDashboard />} />
                        <Route path="contact" element={<CPContact />} />
                        <Route path="registrationlist" element={<CRegistrationList />} />
                        <Route path="addplans" element={<CAddplans />} />
                        <Route path="promocode" element={<CPromoCode />} />
                        <Route path="addtemplate" element={<CAddTemplates />} />
                        <Route path="feedbackdetails" element={<CFeedbackDetails />} />
                        <Route path="profiledetails" element={<CProfile />} />
                        <Route path="resetpassword" element={<CResetPassword />} />

                        {/* ADD CATEGORY Routes */}
                        <Route path="category/addcategory" element={<CAddCategory />} />
                        <Route path="category/adddraft" element={<CAddDraft />} />
                        <Route path="transaction" element={<AdminTransaction />} />
                        <Route path="taxes" element={<Taxes />} />
                    </Route>
                </Route>
            </Route>
        </Routes>
    );
}

export default AppRoutes;