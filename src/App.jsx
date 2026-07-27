import { BrowserRouter, Routes, Route, useLocation, Navigate, Outlet } from "react-router-dom";
import { useEffect } from "react";

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
import Home from "./pages/Home";
import Services from "./pages/Services";
import GovernmentSchemes from "./pages/GovernmentSchemes";
import Loans from "./pages/Loans";
import About from "./pages/About";
import Contact from "./pages/Contact";

// Attendance System Components & Pages
import ProtectedRoute from "./components/attendance/ProtectedRoute";
import Layout from "./components/attendance/Layout";
import ColorSplashCanvas from "./components/ColorSplashCanvas";
import Login from "./pages/attendance/Login";
import AdminDashboard from "./pages/attendance/AdminDashboard";
import EmployeeDashboard from "./pages/attendance/EmployeeDashboard";
import EmployeeManagement from "./pages/attendance/EmployeeManagement";
import FaceEnrollment from "./pages/attendance/FaceEnrollment";
import AttendancePortal from "./pages/attendance/AttendancePortal";
import LeaveRequests from "./pages/attendance/LeaveRequests";
import HolidaysEvents from "./pages/attendance/HolidaysEvents";
import Announcements from "./pages/attendance/Announcements";
import Reports from "./pages/attendance/Reports";

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
    location.pathname.startsWith('/admin') || 
    location.pathname.startsWith('/employee');

  if (isAttendanceRoute) {
    return (
      <Routes>
        {/* Public Login Route */}
          <Route path="/login" element={<Login />} />

          {/* Admin Protected Routes */}
          <Route element={
            <ProtectedRoute allowedRoles={['Admin']}>
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
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans">
      <StickyBar />
      <Navbar />
      <main className="flex-1 w-full max-w-[100vw] overflow-x-hidden">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/services" element={<Services />} />
          <Route path="/government-schemes" element={<GovernmentSchemes />} />
          <Route path="/loans" element={<Loans />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>
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
