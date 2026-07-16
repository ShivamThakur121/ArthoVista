import { useState, useEffect } from "react";
import { NavLink, Link } from "react-router-dom";
import {
  Home, Briefcase, Landmark, PiggyBank, Info, Phone,
  TrendingUp, PhoneCall, X, Menu, Users,
  LogIn
} from "lucide-react";

const navItems = [
  { to: "/", label: "Home", icon: Home },
  { to: "/services", label: "Services", icon: Briefcase },
  { to: "/government-schemes", label: "Govt. Schemes", icon: Landmark },
  { to: "/loans", label: "Loan", icon: PiggyBank },
  { to: "/about", label: "About Us", icon: Info },
  { to: "/contact", label: "Contact", icon: Phone },
  { to: "/employee", label: "Employee", icon: LogIn},
];

export default function Sidebar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const closeSidebar = () => setOpen(false);

  return (
    <>
      {/* Mobile Top Bar */}
      <div className="mobile-topbar">
        <Link to="/" className="nav-logo-text" onClick={closeSidebar}>
          Artho<span>vista</span>
        </Link>
        <div className="flex items-center gap-3">
          <Link
            to="/contact"
            className="sticky-consult-btn !py-2 !px-3 text-xs"
            onClick={closeSidebar}
          >
            <PhoneCall size={13} /> Free Consult
          </Link>
          <button
            className={`hamburger ${open ? "open" : ""}`}
            onClick={() => setOpen(!open)}
            aria-label="Toggle Menu"
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </div>

      {/* Sidebar Overlay */}
      <div
        className={`sidebar-overlay ${open ? "visible" : ""}`}
        onClick={closeSidebar}
      />

      {/* Sidebar */}
      <aside className={`sidebar ${open ? "open" : ""}`}>
        {/* Logo */}
        <div className="nav-logo">
          <div className="flex items-center justify-between">
            <Link to="/" className="nav-logo-text" onClick={closeSidebar}>
              Artho<span>vista</span>
            </Link>
            <button
              className="md:hidden text-white/60 hover:text-white p-1"
              onClick={closeSidebar}
            >
              <X size={18} />
            </button>
          </div>
          <p className="text-xs text-white/40 mt-1 font-inter">MSME & Startup Support</p>
        </div>

        {/* Navigation */}
        <nav className="nav-menu">
          <p className="text-[10px] text-white/25 uppercase tracking-widest mb-3 px-2">
            Navigation
          </p>
          {navItems.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              end={to === "/"}
              className={({ isActive }) =>
                `nav-link ${isActive ? "active" : ""}`
              }
              onClick={closeSidebar}
            >
              <span className="nav-icon">
                <Icon size={16} />
              </span>
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>

        {/* CTA Box */}
        <div className="sidebar-cta">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp size={16} className="text-orange-500" />
            <span className="text-white/80 font-poppins font-semibold text-sm">
              Free Consultation
            </span>
          </div>
          <p className="text-white/40 text-xs leading-relaxed">
            Talk to our MSME expert — no fees, no commitment.
          </p>
          <Link to="/contact" className="sidebar-cta-btn" onClick={closeSidebar}>
            Book Free Session →
          </Link>
        </div>

        {/* Contact Info */}
        <div className="px-6 pb-6">
          <a
            href="tel:+918888802588"
            className="flex items-center gap-2 text-white/40 hover:text-white/70 text-xs transition-colors"
          >
            <PhoneCall size={12} className="text-orange-500" />
            +91 88888 02588
          </a>
        </div>
      </aside>
    </>
  );
}
