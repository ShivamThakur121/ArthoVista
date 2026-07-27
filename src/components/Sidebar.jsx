import { useState, useEffect } from "react";
import { NavLink, Link } from "react-router-dom";
import {
  Home, Briefcase, Landmark, PiggyBank, Info, Phone,
  TrendingUp, PhoneCall, X, LogIn, Sparkles, ChevronRight
} from "lucide-react";

const navItems = [
  { to: "/", label: "Home", icon: Home },
  { to: "/services", label: "Services", icon: Briefcase },
  { to: "/government-schemes", label: "Govt. Schemes", icon: Landmark },
  { to: "/loans", label: "Loan", icon: PiggyBank },
  { to: "/about", label: "About Us", icon: Info },
  { to: "/contact", label: "Contact", icon: Phone },
  { to: "/employee", label: "Employee", icon: LogIn },
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
        <Link to="/" className="flex items-center gap-2 font-display text-xl font-black text-white" onClick={closeSidebar}>
          <span className="w-7 h-7 rounded-lg bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center text-xs font-black shadow-lg">A</span>
          Artho<span className="text-orange-500">Vista</span>
        </Link>
        <div className="flex items-center gap-3">
          <Link
            to="/contact"
            className="inline-flex items-center gap-1.5 bg-gradient-to-r from-orange-500 to-amber-500 text-white text-xs font-bold py-2 px-3.5 rounded-lg shadow-md hover:scale-105 transition-all"
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
        <div className="nav-logo border-b border-white/10 pb-5">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2.5 font-display text-2xl font-black text-white tracking-tight" onClick={closeSidebar}>
              <span className="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-amber-500 flex items-center justify-center text-sm font-black text-white shadow-lg shadow-blue-500/20">
                A
              </span>
              <span>
                Artho<span className="text-orange-400">Vista</span>
              </span>
            </Link>
            <button
              className="md:hidden text-white/60 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors"
              onClick={closeSidebar}
            >
              <X size={18} />
            </button>
          </div>
          <div className="mt-2.5 flex items-center gap-2">
            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-300 bg-amber-400/10 px-2.5 py-0.5 rounded-full border border-amber-400/20">
              <Sparkles size={11} /> MSME & Startup Hub
            </span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="nav-menu my-2">
          <p className="text-[10px] font-bold text-white/30 uppercase tracking-widest mb-3 px-2">
            Main Menu
          </p>
          {navItems.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              end={to === "/"}
              className={({ isActive }) =>
                `nav-link group ${isActive ? "active" : ""}`
              }
              onClick={closeSidebar}
            >
              <span className="nav-icon text-white/70 group-hover:text-white transition-colors">
                <Icon size={16} />
              </span>
              <span className="font-medium">{label}</span>
              <ChevronRight size={14} className="ml-auto opacity-0 group-hover:opacity-60 group-hover:translate-x-0.5 transition-all" />
            </NavLink>
          ))}
        </nav>

        {/* CTA Box */}
        <div className="sidebar-cta bg-gradient-to-b from-blue-600/20 to-indigo-900/40 border border-blue-500/30 rounded-2xl p-4 shadow-xl backdrop-blur-md">
          <div className="flex items-center gap-2 mb-1.5">
            <div className="w-7 h-7 rounded-lg bg-orange-500/20 border border-orange-500/30 flex items-center justify-center text-orange-400">
              <TrendingUp size={15} />
            </div>
            <span className="text-white font-poppins font-bold text-sm">
              Free Business Audit
            </span>
          </div>
          <p className="text-white/60 text-xs leading-relaxed mt-1">
            Get personalized MSME grant & loan eligibility guidance.
          </p>
          <Link
            to="/contact"
            className="sidebar-cta-btn bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold text-xs py-2.5 rounded-xl shadow-lg shadow-orange-500/25 flex items-center justify-center gap-1.5 transition-all hover:scale-[1.02] mt-3"
            onClick={closeSidebar}
          >
            Book Free Call →
          </Link>
        </div>

        {/* Contact Info */}
        <div className="px-6 pb-6 pt-2 border-t border-white/05 mt-auto">
          <a
            href="tel:+919899902568"
            className="flex items-center gap-2 text-white/50 hover:text-white text-xs transition-colors group"
          >
            <div className="w-6 h-6 rounded-full bg-orange-500/10 flex items-center justify-center text-orange-400 group-hover:bg-orange-500 group-hover:text-white transition-all">
              <PhoneCall size={12} />
            </div>
            <span className="font-semibold">+91 98999 02568</span>
          </a>
        </div>
      </aside>
    </>
  );
}
