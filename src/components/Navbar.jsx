import { useState, useEffect, useRef } from "react";
import { NavLink, Link, useLocation } from "react-router-dom";
import {
  Menu, X, ChevronDown, ChevronRight, Phone, Sparkles,
  Home, Briefcase, Landmark, PiggyBank, Info, LogIn, BookOpen
} from "lucide-react";
import { useConsultation } from "../context/ConsultationContext";

const navLinks = [
  { to: "/", label: "Home", icon: Home },
  { to: "/services", label: "Services", icon: Briefcase },
  { to: "/government-schemes", label: "Govt. Schemes", icon: Landmark },
  { to: "/loans", label: "Loans", icon: PiggyBank },
  {
    isDropdown: true,
    label: "Resources",
    icon: BookOpen,
    items: [
      {
        to: "/blogs",
        label: "Blogs",
      },
      {
        to: "/newsletter",
        label: "Newsletter",
      },
    ],
  },
  { to: "/about", label: "About Us", icon: Info },
  { to: "/contact", label: "Contact", icon: Phone },
  { to: "/employee", label: "Employee", icon: LogIn },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileResourcesOpen, setMobileResourcesOpen] = useState(true);
  const dropdownRef = useRef(null);
  const timeoutRef = useRef(null);
  const { pathname } = useLocation();
  const { openConsultationModal } = useConsultation();

  const isResourceActive =
    pathname.startsWith("/blog") ||
    pathname === "/newsletter" ||
    pathname === "/resources" ||
    pathname === "/blogs";

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
    setDropdownOpen(false);
  }, [pathname]);

  // Click outside listener for desktop dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleMouseEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setDropdownOpen(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setDropdownOpen(false);
    }, 180);
  };

  return (
    <header
      className={`sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200/90 transition-all duration-300 ${scrolled ? "shadow-md py-2.5" : "shadow-xs py-3"
        }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">

        {/* ================= LEFT: LOGO (OFFICIAL ARTHOVISTA LOGO) ================= */}
        <Link to="/" className="flex items-center gap-2 group shrink-0 pr-3 z-10 py-0.5">
          <img
            src="/logo.png"
            alt="ArthoVista - सपनों से समृद्धि तक"
            className="h-14 sm:h-16 lg:h-18 w-auto max-w-[200px] sm:max-w-[240px] object-contain transition-transform duration-200 group-hover:scale-105"
          />
        </Link>

        {/* ================= RIGHT: BLUE RIBBON WITH ROUND CURVE ================= */}
        <div className="hidden lg:flex items-center justify-between flex-1 relative bg-gradient-to-r from-green-500 via-blue-500 to-green-500 py-1.5 px-6 rounded-full shadow-sm">

          {/* Navigation Links inside Blue Curve */}
          <nav className="flex items-center gap-1 xl:gap-1.5">
            {navLinks.map((item) => {
              if (item.isDropdown) {
                return (
                  <div
                    key={item.label}
                    ref={dropdownRef}
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                    className="relative"
                  >
                    <button
                      type="button"
                      onClick={() => setDropdownOpen(!dropdownOpen)}
                      className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs xl:text-sm font-semibold transition-all whitespace-nowrap cursor-pointer ${isResourceActive
                        ? "bg-white text-blue-900 font-bold shadow-xs"
                        : "text-white/90 hover:text-white hover:bg-white/15"
                        }`}
                    >
                      <span>{item.label}</span>
                      <ChevronDown
                        size={13}
                        className={`transition-transform duration-200 ${dropdownOpen ? "rotate-180" : ""
                          }`}
                      />
                    </button>

                    {/* Dropdown Floating Menu */}
                    {dropdownOpen && (
                      <div className="absolute top-full left-0 mt-2 min-w-[160px] bg-white rounded-2xl shadow-xl border border-slate-200/90 p-1.5 z-50 animate-fade-in flex flex-col gap-1">
                        {item.items.map((subItem) => {
                          const isSubActive =
                            (subItem.to === "/blogs" && (pathname.startsWith("/blog") || pathname === "/blogs")) ||
                            pathname === subItem.to;

                          return (
                            <Link
                              key={subItem.to}
                              to={subItem.to}
                              onClick={() => setDropdownOpen(false)}
                              className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all whitespace-nowrap ${isSubActive
                                ? "bg-teal-50 text-teal-700 font-bold"
                                : "text-slate-700 hover:text-slate-900 hover:bg-slate-50"
                                }`}
                            >
                              {subItem.label}
                            </Link>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              }

              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.to === "/"}
                  className={({ isActive }) =>
                    `px-3 py-1.5 rounded-full text-xs xl:text-sm font-semibold transition-all whitespace-nowrap ${isActive
                      ? "bg-white text-blue-900 font-bold shadow-xs"
                      : "text-white/90 hover:text-white hover:bg-white/15"
                    }`
                  }
                >
                  {item.label}
                </NavLink>
              );
            })}
          </nav>

          {/* Right Action Call Button */}
          <div className="flex items-center pl-2">
            <button
              onClick={() => openConsultationModal("Navbar Free Consult")}
              className="btn-3d inline-flex items-center gap-1.5 bg-white hover:bg-slate-50 text-blue-800 text-xs font-bold px-4 py-2 rounded-full shadow-md transition-all cursor-pointer whitespace-nowrap"
            >
              <Sparkles size={13} className="text-amber-500" />
              <span>Free Consult</span>
            </button>
          </div>
        </div>

        {/* Mobile Hamburger Trigger */}
        <div className="flex items-center gap-2 lg:hidden">
          <button
            onClick={() => openConsultationModal("Mobile Quick Consult")}
            className="px-3.5 py-1.5 rounded-full bg-gradient-to-r from-teal-600 to-blue-600 text-white text-xs font-bold shadow-xs flex items-center gap-1.5"
          >
            <Sparkles size={12} className="text-amber-300" />
            <span>Free Consult</span>
          </button>

          <button
            className="p-2 rounded-xl text-slate-800 bg-slate-100 hover:bg-slate-200 border border-slate-200 transition-colors cursor-pointer"
            onClick={() => setOpen(!open)}
            aria-label="Toggle Navigation Menu"
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* ================= MOBILE DRAWER MENU ================= */}
      {open && (
        <div className="lg:hidden bg-white border-b border-slate-200 px-5 py-5 space-y-2 shadow-2xl animate-slide-up max-h-[85vh] overflow-y-auto">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-3 mb-2">
            Navigation
          </p>

          {navLinks.map((item) => {
            if (item.isDropdown) {
              return (
                <div key={item.label} className="rounded-xl border border-slate-200 overflow-hidden bg-slate-50/50">
                  <button
                    type="button"
                    onClick={() => setMobileResourcesOpen(!mobileResourcesOpen)}
                    className={`w-full flex items-center justify-between px-4 py-3 text-sm font-medium transition-all ${isResourceActive ? "bg-teal-50 text-teal-700 font-bold" : "text-slate-700"
                      }`}
                  >
                    <div className="flex items-center gap-3">
                      <BookOpen size={16} className="text-teal-600" />
                      <span>{item.label}</span>
                    </div>
                    <ChevronDown
                      size={15}
                      className={`text-slate-400 transition-transform ${mobileResourcesOpen ? "rotate-180 text-teal-600" : ""
                        }`}
                    />
                  </button>

                  {mobileResourcesOpen && (
                    <div className="bg-white border-t border-slate-200 px-3 py-1.5 space-y-1">
                      {item.items.map((subItem) => {
                        const isSubActive =
                          (subItem.to === "/blogs" && (pathname.startsWith("/blog") || pathname === "/blogs")) ||
                          pathname === subItem.to;

                        return (
                          <Link
                            key={subItem.to}
                            to={subItem.to}
                            onClick={() => setOpen(false)}
                            className={`block px-3 py-2 rounded-lg text-xs font-semibold transition-all ${isSubActive
                              ? "bg-teal-50 text-teal-700 font-bold border border-teal-200"
                              : "text-slate-700 hover:bg-slate-100"
                              }`}
                          >
                            {subItem.label}
                          </Link>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            }

            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === "/"}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  `flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-all ${isActive
                    ? "bg-teal-50 text-teal-700 font-bold border border-teal-200"
                    : "text-slate-700 hover:bg-slate-100"
                  }`
                }
              >
                <div className="flex items-center gap-3">
                  <Icon size={16} className="text-slate-500" />
                  <span>{item.label}</span>
                </div>
                <ChevronRight size={14} className="text-slate-400" />
              </NavLink>
            );
          })}

          <div className="pt-3 border-t border-slate-200 flex flex-col gap-2">
            <a
              href="tel:+919899902568"
              className="flex items-center justify-center gap-2 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-sm font-bold border border-slate-200 transition-colors"
            >
              <Phone size={15} className="text-teal-600" />
              +91 98999 02568
            </a>
            <button
              onClick={() => {
                setOpen(false);
                openConsultationModal("Mobile Navigation");
              }}
              className="btn-3d w-full py-3 rounded-xl bg-gradient-to-r from-teal-600 to-blue-600 text-white text-sm font-bold flex items-center justify-center gap-2 cursor-pointer"
            >
              <Sparkles size={15} className="text-amber-300" />
              Book Free Consultation
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
