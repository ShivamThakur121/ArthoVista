import { Link } from "react-router-dom";
import { Mail, Clock, MapPin, Phone, MessageCircle, ArrowRight, Shield } from "lucide-react";

const SocialIcon = ({ path }) => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
    <path d={path} />
  </svg>
);

const FB_PATH = "M22 12a10 10 0 1 0-11.6 9.9v-7H7.9V12h2.5V9.8c0-2.5 1.5-3.9 3.8-3.9 1.1 0 2.2.2 2.2.2v2.4h-1.2c-1.2 0-1.6.8-1.6 1.6V12h2.8l-.4 2.9h-2.4v7A10 10 0 0 0 22 12";
const TW_PATH = "M22 5.9c-.7.3-1.5.6-2.3.7.8-.5 1.5-1.3 1.8-2.3-.8.5-1.7.8-2.6 1a4.1 4.1 0 0 0-7 3.7A11.6 11.6 0 0 1 3.4 4.6a4.1 4.1 0 0 0 1.3 5.5c-.7 0-1.3-.2-1.9-.5v.1c0 2 1.4 3.6 3.3 4a4.1 4.1 0 0 1-1.9.1 4.1 4.1 0 0 0 3.8 2.8A8.2 8.2 0 0 1 2 18.4a11.6 11.6 0 0 0 6.3 1.8c7.5 0 11.7-6.3 11.7-11.7v-.5c.8-.6 1.5-1.3 2-2.1";
const LI_PATH = "M20.4 20.4h-3.6v-5.6c0-1.3 0-3-1.9-3s-2.1 1.5-2.1 2.9v5.7H9.2V9h3.4v1.6h.05c.5-.9 1.7-1.9 3.5-1.9 3.7 0 4.4 2.5 4.4 5.6v6.1zM5.3 7.4a2.1 2.1 0 1 1 0-4.2 2.1 2.1 0 0 1 0 4.2zM7.1 20.4H3.6V9h3.5v11.4z";
const YT_PATH = "M21.8 8s-.2-1.4-.8-2c-.8-.8-1.6-.8-2-.9C16.2 5 12 5 12 5s-4.2 0-7 .1c-.4.1-1.2.1-2 .9C2.4 6.6 2.2 8 2.2 8S2 9.6 2 11.2v1.5c0 1.6.2 3.2.2 3.2s.2 1.4.8 2c.8.8 1.8.8 2.3.8 1.6.2 6.7.2 6.7.2s4.2 0 7-.1c.4-.1 1.2-.1 2-.9.6-.6.8-2 .8-2s.2-1.6.2-3.2v-1.5C22 9.6 21.8 8 21.8 8zM9.7 14.5V9l5.4 2.8-5.4 2.7z";

const navigation = [
  { to: "/", label: "Home" },
  { to: "/services", label: "Services" },
  { to: "/government-schemes", label: "Government Schemes" },
  { to: "/loans", label: "Loans" },
  { to: "/about", label: "About Us" },
  { to: "/contact", label: "Contact" },
  { to: "/employee", label: "Employee" },
];

const services = [
  "Business Registration",
  "Legal & Protection",
  "Certifications",
  "Grants & Funding",
  "Business Finance",
  "Digital Services",
  "GST Compliance",
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
  return (
    <footer className="footer-dark">
      {/* ====== PRE-FOOTER CTA ====== */}
      <div
        className="relative py-14 px-6 overflow-hidden"
        style={{ background: "linear-gradient(135deg, #ea580c 0%, #c2410c 100%)" }}
      >
        <div className="absolute inset-0 opacity-10 bg-repeat" style={{ backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)", backgroundSize: "24px 24px" }} />
        <div className="relative z-10 max-w-6xl mx-auto grid md:grid-cols-2 gap-8 items-center">
          <div>
            <h3 className="font-display font-black text-white text-2xl md:text-3xl leading-tight">
              Ready to Grow Your Business?
            </h3>
            <p className="text-orange-100 mt-2 text-sm leading-relaxed">
              Book a free consultation with our experts. Get a tailored roadmap for your business growth — no commitment required.
            </p>
          </div>
          <div className="flex flex-wrap gap-3 md:justify-end">
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 bg-white text-orange-600 font-bold px-7 py-3.5 rounded-xl hover:bg-orange-50 transition-all hover:scale-105 hover:shadow-xl"
            >
              Book a Free Call <ArrowRight size={15} />
            </Link>
            <a
              href="tel:+918888802588"
              className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white font-semibold px-7 py-3.5 rounded-xl border border-white/30 transition-all"
            >
              <Phone size={15} /> +91 88888 02588
            </a>
          </div>
        </div>
      </div>

      {/* ====== STATS STRIP ====== */}
      <div className="border-b border-white/06" style={{ background: "rgba(255,255,255,0.03)" }}>
        <div className="max-w-6xl mx-auto px-6 py-8 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {[
            { v: "500+", l: "Businesses Served" },
            { v: "₹50Cr+", l: "Funding Facilitated" },
            { v: "98%", l: "Success Rate" },
            { v: "6+", l: "Years of Legacy" },
          ].map((s) => (
            <div key={s.l}>
              <div className="font-display font-black text-orange-400 text-2xl">{s.v}</div>
              <div className="text-white/40 text-xs mt-1">{s.l}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ====== MAIN FOOTER GRID ====== */}
      <div className="max-w-6xl mx-auto px-6 py-14 grid sm:grid-cols-2 lg:grid-cols-4 gap-10">
        {/* Brand */}
        <div>
          <div className="font-display font-black text-xl text-white mb-3">
            Artha <span className="text-orange-500">Ventures</span>
          </div>
          <p className="text-sm text-white/40 leading-relaxed mb-5">
            India's trusted MSME & startup support platform. End-to-end business support from registration and certifications to government funding and digital growth.
          </p>
          <div className="flex gap-3 mb-5">
            {[FB_PATH, TW_PATH, LI_PATH, YT_PATH].map((path, i) => (
              <a
                key={i}
                href="#"
                className="w-9 h-9 rounded-lg bg-white/08 border border-white/08 flex items-center justify-center text-white/50 hover:bg-orange-500 hover:text-white hover:border-orange-500 transition-all"
              >
                <SocialIcon path={path} />
              </a>
            ))}
          </div>
          <div className="flex items-center gap-2 text-xs text-white/30">
            <Shield size={12} className="text-green-400" />
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
                  className="text-white/50 hover:text-orange-400 text-sm transition-colors flex items-center gap-2 group"
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
              <li key={s}>
                <Link
                  to="/services"
                  className="text-white/50 hover:text-orange-400 text-sm transition-colors flex items-center gap-2 group"
                >
                  <ArrowRight size={12} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                  {s}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h4 className="font-semibold text-orange-400 text-xs uppercase tracking-widest mb-5">Contact Us</h4>
          <ul className="space-y-4 text-sm text-white/50">
            <li className="flex gap-3">
              <MapPin size={16} className="shrink-0 mt-0.5 text-orange-500" />
              <span>Logix Cyber Park, Sector 62, Noida, Uttar Pradesh - 201309</span>
            </li>
            <li>
              <a href="tel:+918888802588" className="flex gap-3 hover:text-orange-400 transition-colors">
                <Phone size={16} className="shrink-0 text-orange-500" />
                +91 98999 02568
              </a>
            </li>
            <li>
              <a href="mailto:info@arthaventures.com" className="flex gap-3 hover:text-orange-400 transition-colors">
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
            href="https://wa.me/918888802588"
            target="_blank"
            rel="noreferrer"
            className="mt-5 inline-flex items-center gap-2 bg-green-500/15 border border-green-500/25 text-green-400 hover:bg-green-500 hover:text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition-all"
          >
            <MessageCircle size={14} /> Chat on WhatsApp
          </a>
        </div>
      </div>

      {/* ====== DISCLAIMER ====== */}
      <div className="border-t border-white/06 max-w-6xl mx-auto px-6 py-6">
        <div className="grid md:grid-cols-2 gap-4 text-xs text-white/25 leading-relaxed">
          <p>
            <span className="font-semibold text-white/40">DISCLAIMER:</span> Artha Ventures is a consulting firm providing advisory and execution support services. We do not guarantee loan or scheme approval outcomes.
          </p>
          <p>
            <span className="font-semibold text-white/40">PAYMENT NOTE:</span> All payments must be made exclusively to the official Artha Ventures bank accounts. We do not accept payments to personal accounts.
          </p>
        </div>
      </div>

      {/* ====== BOTTOM BAR ====== */}
      <div className="border-t border-white/06 py-5 px-6 text-center text-xs text-white/25">
        © {new Date().getFullYear()} Artha Ventures. All rights reserved. &nbsp;·&nbsp;
        <span className="hover:text-white/50 cursor-pointer transition-colors">Privacy Policy</span>
        &nbsp;·&nbsp;
        <span className="hover:text-white/50 cursor-pointer transition-colors">Terms of Service</span>
        &nbsp;·&nbsp; 🇮🇳 Made in India
      </div>

      {/* ====== WHATSAPP FAB ====== */}
      <a
        href="https://wa.me/918888802588"
        target="_blank"
        rel="noreferrer"
        className="fixed bottom-6 right-6 z-40 bg-green-500 hover:bg-green-600 text-white w-14 h-14 rounded-full flex items-center justify-center shadow-2xl hover:scale-110 transition-all"
        style={{ boxShadow: "0 8px 30px rgba(34,197,94,0.4)" }}
        aria-label="Chat on WhatsApp"
      >
        <MessageCircle size={26} />
      </a>
    </footer>
  );
}
