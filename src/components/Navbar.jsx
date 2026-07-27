import { useState, useEffect } from "react";
import { NavLink, Link, useLocation } from "react-router-dom";
import {
  Menu, X, PhoneCall, ChevronRight, Sparkles,
  Home, Briefcase, Landmark, PiggyBank, Info, Phone, LogIn
} from "lucide-react";
import { useConsultation } from "../context/ConsultationContext";

const navLinks = [
  { to: "/", label: "Home", icon: Home },
  { to: "/services", label: "Services", icon: Briefcase },
  { to: "/government-schemes", label: "Govt. Schemes", icon: Landmark },
  { to: "/loans", label: "Loans", icon: PiggyBank },
  { to: "/about", label: "About Us", icon: Info },
  { to: "/contact", label: "Contact", icon: Phone },
  { to: "/employee", label: "Employee", icon: LogIn },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { pathname } = useLocation();
  const { openConsultationModal } = useConsultation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 15);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <header
      className={`sticky top-0 z-40 transition-all duration-300 ${
        scrolled
          ? "bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-md py-3"
          : "bg-white border-b border-slate-100 py-4"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-teal-600 to-emerald-600 flex items-center justify-center text-white font-black text-lg shadow-md shadow-teal-500/25 group-hover:scale-105 transition-all">
            A
          </div>
          <div className="flex flex-col leading-none">
            <span className="font-display font-black text-xl text-slate-900 tracking-tight">
              Artho<span className="text-teal-600">Vista</span>
            </span>
            <span className="text-[10px] font-bold tracking-widest text-slate-400 uppercase mt-0.5">
              MSME & Startup Advisory
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden xl:flex items-center gap-1 bg-slate-100/70 p-1.5 rounded-2xl border border-slate-200/60">
          {navLinks.map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              end={to === "/"}
              className={({ isActive }) =>
                `px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
                  isActive
                    ? "bg-white text-teal-600 shadow-sm font-bold"
                    : "text-slate-600 hover:text-slate-900 hover:bg-white/60"
                }`
              }
            >
              {label}
            </NavLink>
          ))}
        </nav>

        {/* Right Action Call Button */}
        <div className="hidden md:flex items-center gap-3">
          <a
            href="tel:+919899902568"
            className="flex items-center gap-2 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 px-3.5 py-2.5 rounded-xl border border-slate-200 transition-colors"
          >
            <PhoneCall size={14} className="text-teal-600" />
            +91 98999 02568
          </a>
          <button
            onClick={() => openConsultationModal("General Consultation")}
            className="btn-3d inline-flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-md shadow-teal-500/20 transition-all cursor-pointer"
          >
            <Sparkles size={14} className="text-amber-300" />
            <span>Free Consult</span>
          </button>
        </div>

        {/* Mobile Hamburger Trigger */}
        <button
          className="xl:hidden p-2 rounded-xl text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors"
          onClick={() => setOpen(!open)}
          aria-label="Toggle Navigation Menu"
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile Drawer Menu */}
      {open && (
        <div className="xl:hidden bg-white border-b border-slate-200 px-5 py-5 space-y-2 shadow-xl animate-slide-up">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-3 mb-2">
            Navigation
          </p>
          {navLinks.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              end={to === "/"}
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                `flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? "bg-teal-50 text-teal-600 font-bold"
                    : "text-slate-700 hover:bg-slate-50"
                }`
              }
            >
              <div className="flex items-center gap-3">
                <Icon size={16} className="text-slate-400" />
                <span>{label}</span>
              </div>
              <ChevronRight size={15} className="text-slate-300" />
            </NavLink>
          ))}
          <div className="pt-4 border-t border-slate-100 space-y-2">
            <a
              href="tel:+919899902568"
              className="flex items-center justify-center gap-2 w-full py-3 rounded-xl text-xs font-bold text-slate-700 bg-slate-100"
            >
              <PhoneCall size={14} className="text-teal-600" />
              Call +91 98999 02568
            </a>
            <button
              onClick={() => {
                setOpen(false);
                openConsultationModal("General Consultation");
              }}
              className="flex items-center justify-center gap-2 w-full py-3 rounded-xl text-xs font-bold text-white bg-teal-600 shadow-md shadow-teal-500/20 cursor-pointer"
            >
              <Sparkles size={14} className="text-amber-300" />
              Book Free Consultation
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
