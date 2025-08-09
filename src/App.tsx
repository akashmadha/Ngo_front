import React, { Suspense, lazy } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
// Lazy-loaded routes
const ForgotPassword = lazy(() => import("./pages/AuthPages/ForgotPassword"));
const VerifyOtp = lazy(() => import("./pages/AuthPages/VerifyOtp"));
const ResetPassword = lazy(() => import("./pages/AuthPages/ResetPassword"));
const AuthSelection = lazy(() => import("./pages/AuthPages/AuthSelection"));
const AdminLogin = lazy(() => import("./pages/AuthPages/AdminLogin"));
const TrustMemberAuth = lazy(() => import("./pages/AuthPages/TrustMemberAuth"));
const NotFound = lazy(() => import("./pages/OtherPage/NotFound"));
const UserProfiles = lazy(() => import("./pages/UserProfiles"));
const Videos = lazy(() => import("./pages/UiElements/Videos"));
const Images = lazy(() => import("./pages/UiElements/Images"));
const Alerts = lazy(() => import("./pages/UiElements/Alerts"));
const Badges = lazy(() => import("./pages/UiElements/Badges"));
const Avatars = lazy(() => import("./pages/UiElements/Avatars"));
const Buttons = lazy(() => import("./pages/UiElements/Buttons"));
const LineChart = lazy(() => import("./pages/Charts/LineChart"));
const BarChart = lazy(() => import("./pages/Charts/BarChart"));
const Calendar = lazy(() => import("./pages/Calendar"));
const BasicTables = lazy(() => import("./pages/Tables/BasicTables"));
const FormElements = lazy(() => import("./pages/Forms/FormElements"));
const Blank = lazy(() => import("./pages/Blank"));
const AppLayout = lazy(() => import("./layout/AppLayout"));
import { ScrollToTop } from "./components/common/ScrollToTop";
const Home = lazy(() => import("./pages/Dashboard/Home"));
const MemberDashboard = lazy(() => import("./pages/MemberDashboard/MemberDashboard"));
const MemberDocuments = lazy(() => import("./pages/MemberDashboard/MemberDocuments"));
const MasterForm = lazy(() => import("./pages/Forms/MasterForm"));
const StateMaster = lazy(() => import("./pages/Masters/StateMaster"));
const DistrictMaster = lazy(() => import("./pages/Masters/DistrictMaster"));
const TalukaMaster = lazy(() => import("./pages/Masters/TalukaMaster"));
const CityMaster = lazy(() => import("./pages/Masters/CityMaster"));
const OccupationMaster = lazy(() => import("./pages/Masters/OccupationMaster"));
const DesignationMaster = lazy(() => import("./pages/Masters/DesignationMaster"));
const OMMemberForm = lazy(() => import("./pages/Tables/OMMemberForm"));
const MemberDetailsPage = lazy(() => import("./pages/Tables/MemberDetailsPage"));

// ProtectedRoute component
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const isLoggedIn = !!localStorage.getItem("userId");
  return isLoggedIn ? children : <Navigate to="/signin" replace />;
}

export default function App() {
  return (
    <>
      <Router>
        <ScrollToTop />
        <Suspense fallback={<div />}> 
          <Routes>
          {/* Protected Dashboard Layout */}
          <Route element={<ProtectedRoute><AppLayout /></ProtectedRoute>}>
            <Route path="/admin-dashboard" element={<Home />} />
            {/* Remove old /dashboard route */}
            {/* <Route path="/dashboard" element={<Home />} /> */}
            {/* Others Page */}
            <Route path="/profile" element={<UserProfiles />} />
            <Route path="/calendar" element={<Calendar />} />
            <Route path="/blank" element={<Blank />} />
            {/* Forms */}
            <Route path="/form-elements" element={<FormElements />} />
            <Route path="/master-form" element={<MasterForm />} />
            {/* Tables */}
            <Route path="/basic-tables" element={<BasicTables />} />
            <Route path="/om-member-form" element={<OMMemberForm />} />
            <Route path="/member-details/:memberId" element={<MemberDetailsPage />} />
            {/* Ui Elements */}
            <Route path="/alerts" element={<Alerts />} />
            <Route path="/avatars" element={<Avatars />} />
            <Route path="/badge" element={<Badges />} />
            <Route path="/buttons" element={<Buttons />} />
            <Route path="/images" element={<Images />} />
            <Route path="/videos" element={<Videos />} />
            {/* Charts */}
            <Route path="/line-chart" element={<LineChart />} />
            <Route path="/bar-chart" element={<BarChart />} />
            {/* Masters (moved inside layout) */}
            <Route path="/admin/state-master" element={<StateMaster />} />
            <Route path="/admin/district-master" element={<DistrictMaster />} />
            <Route path="/admin/taluka-master" element={<TalukaMaster />} />
            <Route path="/admin/city-master" element={<CityMaster />} />
            <Route path="/admin/occupation-master" element={<OccupationMaster />} />
            <Route path="/admin/designation-master" element={<DesignationMaster />} />
          </Route>

          {/* Member Dashboard (No Layout) */}
          <Route path="/member-dashboard" element={<ProtectedRoute><MemberDashboard /></ProtectedRoute>} />
          <Route path="/member-documents" element={<ProtectedRoute><MemberDocuments /></ProtectedRoute>} />

          {/* Remove direct /admin-dashboard route if present */}

          {/* Redirect root to dashboard or auth selection based on login */}
          <Route path="/" element={localStorage.getItem("userId") ? <Navigate to="/admin-dashboard" replace /> : <Navigate to="/auth-selection" replace />} />

          {/* Auth Selection */}
          <Route path="/auth-selection" element={<AuthSelection />} />
          
          {/* Admin Auth */}
          <Route path="/admin-login" element={<AdminLogin />} />
          
          {/* Trust Member Auth */}
          <Route path="/trust-member-auth" element={<TrustMemberAuth />} />
          
          {/* Legacy Auth Routes (removed) */}
          {/* <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} /> */}
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/verify-otp" element={<VerifyOtp />} />
          <Route path="/reset-password" element={<ResetPassword />} />

          {/* Fallback Route */}
          <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </Router>
    </>
  );
}
