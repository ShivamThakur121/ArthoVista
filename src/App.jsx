import { BrowserRouter, Routes, Route, useLocation, Navigate, Outlet } from "react-router-dom";
import { useEffect, Suspense, lazy } from "react";

// Context Providers
import { ConsultationProvider } from "./context/ConsultationContext";
import { AuthProvider } from "./context/AuthContext";

// Main Site Components
import Navbar from "./components/Navbar";
import StickyBar from "./components/StickyBar";
import Footer from "./components/Footer";
import CookieConsent from "./components/CookieConsent";
import ConsultationModal from "./components/ConsultationModal";

// Main Site Pages
const Home = lazy(() => import("./pages/Home"));
const Services = lazy(() => import("./pages/Services"));
const GovernmentSchemes = lazy(() => import("./pages/GovernmentSchemes"));
const Loans = lazy(() => import("./pages/Loans"));
const About = lazy(() => import("./pages/About"));
const Contact = lazy(() => import("./pages/Contact"));

// Attendance System Components & Pages
import ProtectedRoute from "./components/attendance/ProtectedRoute";
import Layout from "./components/attendance/Layout";
import ColorSplashCanvas from "./components/ColorSplashCanvas";
const Login = lazy(() => import("./pages/attendance/Login"));
const ForgotPassword = lazy(() => import("./pages/attendance/ForgotPassword"));
const VerifyOtp = lazy(() => import("./pages/attendance/VerifyOtp"));
const ResetPassword = lazy(() => import("./pages/attendance/ResetPassword"));
const AdminDashboard = lazy(() => import("./pages/attendance/AdminDashboard"));
const EmployeeDashboard = lazy(() => import("./pages/attendance/EmployeeDashboard"));
const EmployeeManagement = lazy(() => import("./pages/attendance/EmployeeManagement"));
const FaceEnrollment = lazy(() => import("./pages/attendance/FaceEnrollment"));
const AttendancePortal = lazy(() => import("./pages/attendance/AttendancePortal"));
const LeaveRequests = lazy(() => import("./pages/attendance/LeaveRequests"));
const HolidaysEvents = lazy(() => import("./pages/attendance/HolidaysEvents"));
const Announcements = lazy(() => import("./pages/attendance/Announcements"));
const Reports = lazy(() => import("./pages/attendance/Reports"));

const PageLoader = () => (
  <div className="flex flex-col items-center justify-center min-h-[50vh] bg-transparent">
    <div className="w-10 h-10 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin"></div>
  </div>
);

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

const AttendanceDashboardLayout = () => {
  return (
    <Layout>
      <Outlet />
    </Layout>
  );
};

function MainLayoutWrapper() {
  const location = useLocation();
  const isAttendanceRoute = 
    location.pathname === '/login' || 
    location.pathname === '/forgot-password' || 
    location.pathname === '/verify-otp' || 
    location.pathname === '/reset-password' || 
    location.pathname.startsWith('/admin') || 
    location.pathname.startsWith('/employee');

  if (isAttendanceRoute) {
    return (
      <Suspense fallback={<PageLoader />}>
        <Routes>
          {/* Public Login Route */}
            <Route path="/login" element={<Login />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/verify-otp" element={<VerifyOtp />} />
            <Route path="/reset-password" element={<ResetPassword />} />

            {/* Admin Protected Routes */}
            <Route element={
              <ProtectedRoute allowedRoles={['Admin', 'Manager']}>
                <AttendanceDashboardLayout />
              </ProtectedRoute>
            }>
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/admin/employees" element={<EmployeeManagement />} />
              <Route path="/admin/employees/enroll/:id" element={<FaceEnrollment />} />
              <Route path="/admin/leaves" element={<LeaveRequests />} />
              <Route path="/admin/holidays" element={<HolidaysEvents />} />
              <Route path="/admin/announcements" element={<Announcements />} />
              <Route path="/admin/reports" element={<Reports />} />
            </Route>

            {/* Employee Protected Routes */}
            <Route element={
              <ProtectedRoute allowedRoles={['Employee']}>
                <AttendanceDashboardLayout />
              </ProtectedRoute>
            }>
              <Route path="/employee" element={<EmployeeDashboard />} />
              <Route path="/employee/attendance" element={<AttendancePortal />} />
              <Route path="/employee/leaves" element={<LeaveRequests />} />
              <Route path="/employee/holidays" element={<HolidaysEvents />} />
              <Route path="/employee/announcements" element={<Announcements />} />
            </Route>

            {/* Fallback for unmatched attendance paths */}
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
      </Suspense>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans">
      <StickyBar />
      <Navbar />
      <main className="flex-1 w-full max-w-[100vw] overflow-x-hidden">
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/services" element={<Services />} />
            <Route path="/government-schemes" element={<GovernmentSchemes />} />
            <Route path="/loans" element={<Loans />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
          </Routes>
        </Suspense>
      </main>
      <Footer />
      <CookieConsent />
      <ConsultationModal />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <ConsultationProvider>
        <BrowserRouter>
          <ScrollToTop />
          <ColorSplashCanvas />
          <MainLayoutWrapper />
        </BrowserRouter>
      </ConsultationProvider>
    </AuthProvider>
  );
}
