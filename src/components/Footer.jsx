import { Link } from "react-router-dom";
import { Mail, Clock, MapPin, Phone, MessageCircle, ArrowRight, Shield } from "lucide-react";
import { useConsultation } from "../context/ConsultationContext";

const SocialIcon = ({ path }) => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
    <path d={path} />
  </svg>
);

const FB_PATH = "M22 12a10 10 0 1 0-11.6 9.9v-7H7.9V12h2.5V9.8c0-2.5 1.5-3.9 3.8-3.9 1.1 0 2.2.2 2.2.2v2.4h-1.2c-1.2 0-1.6.8-1.6 1.6V12h2.8l-.4 2.9h-2.4v7A10 10 0 0 0 22 12";
const TW_PATH = "M22 5.9c-.7.3-1.5.6-2.3.7.8-.5 1.5-1.3 1.8-2.3-.8.5-1.7.8-2.6 1a4.1 4.1 0 0 0-7 3.7A11.6 11.6 0 0 1 3.4 4.6a4.1 4.1 0 0 0 1.3 5.5c-.7 0-1.3-.2-1.9-.5v.1c0 2 1.4 3.6 3.3 4a4.1 4.1 0 0 1-1.9.1 4.1 4.1 0 0 0 3.8 2.8A8.2 8.2 0 0 1 2 18.4a11.6 11.6 0 0 0 6.3 1.8c7.5 0 11.7-6.3 11.7-11.7v-.5c.8-.6 1.5-1.3 2-2.1";
const LI_PATH = "M20.4 20.4h-3.6v-5.6c0-1.3 0-3-1.9-3s-2.1 1.5-2.1 2.9v5.7H9.2V9h3.4v1.6h.05c.5-.9 1.7-1.9 3.5-1.9 3.7 0 4.4 2.5 4.4 5.6v6.1zM5.3 7.4a2.1 2.1 0 1 1 0-4.2 2.1 2.1 0 0 1 0 4.2zM7.1 20.4H3.6V9h3.5v11.4z";
const YT_PATH = "M21.8 8s-.2-1.4-.8-2c-.8-.8-1.6-.8-2-.9C16.2 5 12 5 12 5s-4.2 0-7 .1c-.4.1-1.2.1-2 .9C2.4 6.6 2.2 8 2.2 8S2 9.6 2 11.2v1.5c0 1.6.2 3.2.2 3.2s.2 1.4.8 2c.8.8 1.8.8 2.3.8 1.6.2 6.7.2 6.7.2s4.2 0 7-.1c-.4-.1 1.2-.1 2-.9.6-.6.8-2 .8-2s.2-1.6.2-3.2v-1.5C22 9.6 21.8 8 21.8 8zM9.7 14.5V9l5.4 2.8-5.4 2.7z";

const navigation = [
  { to: "/", label: "Home" },
  { to: "/services", label: "Services" },
  { to: "/government-schemes", label: "Government Schemes" },
  { to: "/loans", label: "Loans" },
  { to: "/blogs", label: "Blogs" },
  { to: "/newsletter", label: "Newslatter" },
  { to: "/about", label: "About Us" },
  { to: "/contact", label: "Contact" },
  { to: "/employee", label: "Employee" },
];

const services = [
  { label: "Business Registration", to: "/services#registration" },
  { label: "Legal & Protection", to: "/services#legal" },
  { label: "Certifications", to: "/services#certifications" },
  { label: "Grants & Funding", to: "/services#grants" },
  { label: "Business Finance", to: "/services#finance" },
  { label: "Digital Services", to: "/services#digital" },
  { label: "GST Compliance", to: "/services#compliance" },
];

const schemes = [
  "PMEGP Scheme",
  "CGTMSE Guarantee",
  "Mudra Loan",
  "Stand-Up India",
  "Startup India",
  "PM-FME Scheme",
];

export default function Footer() {
  const { openConsultationModal } = useConsultation();

  return (
    <footer className="footer-dark bg-gradient-to-b from-[#0b1e3f] via-[#07152e] to-[#040d1c] text-slate-200">
      {/* ====== PRE-FOOTER CTA ====== */}
      <div
        className="relative py-16 px-6 overflow-hidden border-t border-b border-blue-500/20"
        style={{ background: "linear-gradient(135deg, #091e42 0%, #0e2d63 45%, #071733 100%)" }}
      >
        <div className="absolute top-0 right-0 w-[500px] h-[300px] bg-blue-500/20 blur-[130px] rounded-full pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[250px] bg-indigo-600/25 blur-[100px] rounded-full pointer-events-none" />

        <div className="relative z-10 max-w-6xl mx-auto grid md:grid-cols-2 gap-8 items-center text-white">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-400/20 border border-blue-400/30 text-blue-200 text-xs font-bold uppercase tracking-wider mb-3 shadow-xs">
              Fast Track Your MSME Funding
            </div>
            <h3 className="font-display font-black text-3xl md:text-4xl leading-tight text-white drop-shadow-sm">
              Ready to Accelerate Your Business Growth?
            </h3>
            <p className="text-slate-200 mt-3 text-sm md:text-base leading-relaxed font-normal">
              Book a 1-on-1 strategy session with our empanelled MSME advisors. Discover applicable government grants, subsidies, and credit options with zero upfront commitment.
            </p>
          </div>
          <div className="flex flex-wrap gap-4 md:justify-end">
            <button
              onClick={() => openConsultationModal("Strategy Session")}
              className="btn-3d inline-flex items-center gap-2.5 bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 hover:opacity-95 text-white font-bold px-7 py-4 rounded-xl shadow-lg shadow-emerald-500/25 transition-all cursor-pointer"
            >
              <span>Book Free Session</span> <ArrowRight size={16} />
            </button>
            <a
              href="tel:+919899902568"
              className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white font-semibold px-6 py-4 rounded-xl border border-white/20 transition-all hover:scale-105 backdrop-blur-md"
            >
              <Phone size={16} className="text-amber-400" /> +91 98999 02568
            </a>
          </div>
        </div>
      </div>

      {/* ====== STATS STRIP ====== */}
      <div className="border-b border-blue-900/40" style={{ background: "rgba(10, 27, 58, 0.65)" }}>
        <div className="max-w-6xl mx-auto px-6 py-8 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {[
            { v: "500+", l: "Businesses Served" },
            { v: "₹50Cr+", l: "Funding Facilitated" },
            { v: "98%", l: "Success Rate" },
            { v: "6+", l: "Years of Legacy" },
          ].map((s) => (
            <div key={s.l}>
              <div className="font-display font-black text-orange-400 text-2xl">{s.v}</div>
              <div className="text-slate-300 text-xs mt-1">{s.l}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ====== MAIN FOOTER GRID ====== */}
      <div className="max-w-6xl mx-auto px-6 py-14 grid sm:grid-cols-2 lg:grid-cols-4 gap-10">
        {/* Brand */}
        <div>
          <Link to="/" className="inline-block bg-white p-2.5 rounded-2xl mb-4 shadow-md hover:opacity-95 transition-opacity">
            <img
              src="/logo.png"
              alt="ArthoVista - सपनों से समृद्धि तक"
              className="h-14 w-auto object-contain"
            />
          </Link>
          <p className="text-sm text-slate-300 leading-relaxed mb-5">
            India's trusted MSME & startup support platform. End-to-end business support from registration and certifications to government funding and digital growth.
          </p>
          <div className="flex gap-3 mb-5">
            {[FB_PATH, TW_PATH, LI_PATH, YT_PATH].map((path, i) => (
              <a
                key={i}
                href="#"
                className="w-9 h-9 rounded-lg bg-blue-950/60 border border-blue-800/40 flex items-center justify-center text-slate-300 hover:bg-orange-500 hover:text-white hover:border-orange-500 transition-all"
              >
                <SocialIcon path={path} />
              </a>
            ))}
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <Shield size={12} className="text-emerald-400" />
            KVIC Empanelled · MSME Certified
          </div>
        </div>

        {/* Navigation */}
        <div>
          <h4 className="font-semibold text-orange-400 text-xs uppercase tracking-widest mb-5">Quick Links</h4>
          <ul className="space-y-3">
            {navigation.map((n) => (
              <li key={n.to}>
                <Link
                  to={n.to}
                  className="text-slate-300 hover:text-orange-400 text-sm transition-colors flex items-center gap-2 group"
                >
                  <ArrowRight size={12} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                  {n.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Services */}
        <div>
          <h4 className="font-semibold text-orange-400 text-xs uppercase tracking-widest mb-5">Our Services</h4>
          <ul className="space-y-3">
            {services.map((s) => (
              <li key={s.to}>
                <Link
                  to={s.to}
                  className="text-slate-300 hover:text-orange-400 text-sm transition-colors flex items-center gap-2 group"
                >
                  <ArrowRight size={12} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                  {s.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h4 className="font-semibold text-orange-400 text-xs uppercase tracking-widest mb-5">Contact Us</h4>
          <ul className="space-y-4 text-sm text-slate-300">
            <li className="flex gap-3">
              <MapPin size={16} className="shrink-0 mt-0.5 text-orange-500" />
              <span>Logix Cyber Park, Sector 62, Noida, Uttar Pradesh - 201309</span>
            </li>
            <li>
              <a href="tel:+919899902568" className="flex gap-3 hover:text-orange-400 transition-colors">
                <Phone size={16} className="shrink-0 text-orange-500" />
                +91 98999 02568
              </a>
            </li>
            <li>
              <a href="mailto:support@arthovista.com" className="flex gap-3 hover:text-orange-400 transition-colors">
                <Mail size={16} className="shrink-0 text-orange-500" />
                support@arthovista.com
              </a>
            </li>
            <li className="flex gap-3">
              <Clock size={16} className="shrink-0 mt-0.5 text-orange-500" />
              <span>Mon-Sat: 9:30 AM – 6:00 PM IST</span>
            </li>
          </ul>
          <a
            href="https://wa.me/919899902568"
            target="_blank"
            rel="noreferrer"
            className="mt-5 inline-flex items-center gap-2 bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 hover:bg-emerald-500 hover:text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition-all"
          >
            <MessageCircle size={14} /> Chat on WhatsApp
          </a>
        </div>
      </div>

      {/* ====== DISCLAIMER ====== */}
      <div className="border-t border-blue-900/40 max-w-6xl mx-auto px-6 py-6">
        <div className="grid md:grid-cols-2 gap-4 text-xs text-slate-400 leading-relaxed">
          <p>
            <span className="font-semibold text-slate-300">DISCLAIMER:</span> ArthoVista is a consulting firm providing advisory and execution support services. We do not guarantee loan or scheme approval outcomes.
          </p>
          <p>
            <span className="font-semibold text-slate-300">PAYMENT NOTE:</span> All payments must be made exclusively to the official ArthoVista bank accounts. We do not accept payments to personal accounts.
          </p>
        </div>
      </div>

      {/* ====== BOTTOM BAR ====== */}
      <div className="border-t border-blue-900/40 py-5 px-6 text-center text-xs text-slate-400">
        © {new Date().getFullYear()} ArthoVista. All rights reserved. &nbsp;·&nbsp;
        <Link to="/privacy-policy" className="hover:text-white transition-colors">Privacy Policy</Link>
        &nbsp;·&nbsp;
        <Link to="/terms-of-service" className="hover:text-white transition-colors">Terms of Service</Link>
        &nbsp;·&nbsp; 🇮🇳 Made in India
      </div>

      {/* ====== WHATSAPP FAB ====== */}
      <div className="fixed bottom-6 right-6 z-40 group">
        <a
          href="https://wa.me/919899902568"
          target="_blank"
          rel="noreferrer"
          className="fixed bottom-6 right-6 z-40 bg-emerald-500 hover:bg-emerald-600 text-white w-14 h-14 rounded-full flex items-center justify-center shadow-2xl hover:scale-110 transition-all"
          style={{ boxShadow: "0 8px 30px rgba(16,185,129,0.4)" }}
          aria-label="Chat on WhatsApp"
        >
          <MessageCircle size={26} />
        </a>
        <span className="absolute right-14 top-1/2 -translate-y-1/2 whitespace-nowrap bg-gray-900 text-white text-xs px-3 py-1 rounded-lg opacity-0 group-hover:opacity-100 group-hover:translate-x-0 translate-x-2 transition-all duration-300 pointer-events-none">
          Chat on WhatsApp
        </span>
      </div>
    </footer>
  );
}