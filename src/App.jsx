import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { useEffect } from "react";
import Sidebar from "./components/Sidebar";
import StickyBar from "./components/StickyBar";
import Footer from "./components/Footer";
import CookieConsent from "./components/CookieConsent";
import Home from "./pages/Home";
import Services from "./pages/Services";
import GovernmentSchemes from "./pages/GovernmentSchemes";
import Loans from "./pages/Loans";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Employee from "./pages/Employee"

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Sidebar />
      <div className="main-content">
        {/* Sticky Consultation Bar - shows on ALL pages */}
        <StickyBar />
        <main className="flex-1 page-wrapper bg-slate-400">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/services" element={<Services />} />
            <Route path="/government-schemes" element={<GovernmentSchemes />} />
            <Route path="/loans" element={<Loans />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/employee" element={<Employee />}>
            </Route>
          </Routes>
        </main>
        <Footer/>
      </div>
      <CookieConsent />
    </BrowserRouter>
  );
}
