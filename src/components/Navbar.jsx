import { useState } from "react";
import { NavLink, Link } from "react-router-dom";
import { Menu, X, Phone } from "lucide-react";

const links = [
  { to: "/", label: "Home" },
  { to: "/services", label: "Services" },
  { to: "/government-schemes", label: "Government Schemes" },
  { to: "/loans", label: "Loans" },
  { to: "/about", label: "About Us" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="flex flex-col h-svh bg-white border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-5 md:px-8 h-20 flex items-center justify-between">
        <Link to="/" className="flex flex-col leading-none shrink-0">
          <span className="font-display font-extrabold text-2xl text-orange-600 tracking-tight">
            ARTHO
          </span>
          <span className="text-[11px] tracking-[0.3em] text-navy font-semibold -mt-0.5">
            VISTA
          </span>
        </Link>

        <nav className="hidden lg:flex items-center gap-8">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              className={({ isActive }) =>
                `text-sm font-medium transition-colors ${
                  isActive ? "text-orange-600" : "text-navy hover:text-orange-600"
                }`
              }
            >
              {l.label}
            </NavLink>
          ))}
        </nav>

        <div className="hidden lg:block">
          <Link to="/" className="btn-primary text-sm">
            <Phone size={16} /> Free Consultation
          </Link>
        </div>

        <button
          className="lg:hidden text-navy"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          {open ? <X size={26} /> : <Menu size={26} />}
        </button>
      </div>

      {open && (
        <div className="lg:hidden bg-white border-t border-slate-100 px-5 py-4 flex flex-col gap-4">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                `text-sm font-medium ${isActive ? "text-orange-600" : "text-navy"}`
              }
            >
              {l.label}
            </NavLink>
          ))}
          <Link to="/" onClick={() => setOpen(false)} className="btn-primary text-sm justify-center">
            <Phone size={16} /> Free Consultation
          </Link>
        </div>
      )}
    </header>
  );
}
