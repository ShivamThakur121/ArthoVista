import { Link } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import useDocumentMetadata from "../hooks/useDocumentMetadata";
import { useConsultation } from "../context/ConsultationContext";
import {
  Building2, Rocket, HeartHandshake, FileCheck2, Landmark,
  Percent, ArrowRight, Phone, Star, CheckCircle, TrendingUp,
  Shield, Award, Users, BookOpen, Clock, X, Sparkles, CheckCircle2, FileText, Layers
} from "lucide-react";
import { blogPosts } from "../data/blogData";

/* ---------- DATA ---------- */
const stats = [
  { value: "500+", label: "Businesses Served", icon: Users },
  { value: "₹50Cr+", label: "Funding Facilitated", icon: TrendingUp },
  { value: "98%", label: "Success Rate", icon: Award },
  { value: "6+", label: "Years Legacy", icon: Shield },
];

const segments = [
  {
    id: "corporates",
    icon: Building2,
    title: "For Corporates",
    subtitle: "1000+ Employees / ₹250Cr+ Turnover",
    color: "from-blue-600 to-blue-800",
    badge: "Enterprise Advisory",
    description: "End-to-end strategic advisory, statutory governance, large-scale debt syndication, and ROC compliance tailored for mature enterprises and corporate groups.",
    items: [
      "Corporate Compliance & GST",
      "Company Registration (ROC)",
      "Fundraising & Investor Readiness",
      "DPR & Pitch Deck Creation"
    ],
    detailedServices: [
      { name: "ROC & Corporate Compliance", desc: "Secretarial audits, annual ROC filings, board resolutions, and Director KYC governance." },
      { name: "GST Audit & Tax Advisory", desc: "Comprehensive GST health checks, tax optimization, reconciliation, and departmental representation." },
      { name: "Large Debt Syndication & Working Capital", desc: "Consortium banking, term loans up to ₹50Cr+, and working capital credit lines." },
      { name: "Fundraising & Investor Readiness", desc: "Institutional investor pitch decks, bankable DPRs, and company valuation models." },
      { name: "Enterprise Certifications (ISO 27001, 14001, 9001)", desc: "Full-scale information security and environmental management system audits." },
      { name: "IP & Trademark Portfolio Protection", desc: "Multi-class brand registrations, patent filings, and trademark enforcement." },
    ],
    timeline: "3–7 Business Days for initial roadmap",
    deliverables: [
      "Dedicated Partner-level CA/CS team",
      "Statutory compliance & audit reports",
      "Bankable DPR & financial modeling",
      "ROC filings & regulatory approvals",
    ],
    relatedGuides: [
      { title: "Private Limited Company Registration & Process", slug: "private-limited-company-registration" },
      { title: "Venture Capital & Institutional Funding in India", slug: "venture-capital-fund-india" },
      { title: "ISO 27001 & 9001 Certification Guide", slug: "iso-certification-india" },
      { title: "Trademark Registration & Protection in India", slug: "trademark-registration-india" },
    ],
  },
  {
    id: "startups",
    icon: Rocket,
    title: "For Startups & MSMEs",
    subtitle: "Ideation to Growth Stage",
    color: "from-orange-500 to-orange-700",
    badge: "Startup & MSME Growth",
    description: "Turnkey company setup, government margin-money subsidies (PMEGP, PMFME), collateral-free credit (CGTMSE), and licensing for emerging businesses.",
    items: [
      "Business Registration & Setup",
      "Government Schemes & Subsidies",
      "MSME Loans & Funding",
      "Certifications (ISO, FSSAI, etc.)"
    ],
    detailedServices: [
      { name: "Turnkey Company Setup (Pvt Ltd, OPC, LLP)", desc: "Complete incorporation via MCA SPICe+ with zero filing fee concessions up to ₹15L capital." },
      { name: "PMEGP Subsidy (Up to 35% Margin Money)", desc: "Preparation of bankable DPR and subsidy tracking up to ₹50 Lakh project cost." },
      { name: "PMFME Scheme for Food Processors", desc: "35% credit-linked capital subsidy up to ₹10 Lakh for individual food processing units." },
      { name: "CGTMSE Collateral-Free Loans", desc: "Credit guarantee facilitation up to ₹10 Crore without conventional collateral." },
      { name: "FSSAI Food License (2026 Revised Limits)", desc: "Basic registration up to ₹1.5 Cr and State/Central licences with perpetual validity." },
      { name: "Digital Growth & SEO Setup", desc: "High-converting web development, Google Business Profile local SEO, and lead funnels." },
    ],
    timeline: "5–10 Business Days for setup & filings",
    deliverables: [
      "Certificate of Incorporation, PAN & TAN",
      "Udyam MSME Registration Certificate",
      "Detailed Project Report (DPR) for Bank Loans",
      "FSSAI / ISO / Scheme Approval Filings",
    ],
    relatedGuides: [
      { title: "PMEGP Loan: 35% Subsidy & Process", slug: "pmegp-loan-scheme" },
      { title: "PMFME Scheme 2026: 35% Subsidy & ODOP", slug: "pmfme-scheme-2026" },
      { title: "CGTMSE Collateral-Free Credit Guide", slug: "cgtmse-loan-scheme" },
      { title: "One Person Company (OPC) Setup", slug: "opc-registration-india" },
      { title: "FSSAI License 2026 Rules & Thresholds", slug: "fssai-license-india" },
    ],
  },
  {
    id: "ngos",
    icon: HeartHandshake,
    title: "For NGOs / Trusts",
    subtitle: "Charitable, SHGs, Trusts",
    color: "from-purple-600 to-purple-800",
    badge: "Non-Profit & Social Impact",
    description: "Complete legal structuring for non-profit organizations, Section 8 companies, charitable trusts, 12A/80G tax exemptions, and government grant access.",
    items: [
      "NGO Registration (Trust/Society/Sec 8)",
      "FCRA Registration & Compliance",
      "Government Grants for NGOs",
      "80G & 12A Certification"
    ],
    detailedServices: [
      { name: "Section 8 Company Incorporation", desc: "Central MCA incorporation without 'Pvt Ltd' suffix; highly preferred for corporate CSR funding." },
      { name: "Trust & Society Registration", desc: "State-level registration with drafted Trust Deed, bylaws, and founding member resolutions." },
      { name: "12A & 80G Tax Exemption Filings", desc: "Securing 100% tax exemption for the NGO and 50% income tax deductions for donors." },
      { name: "FCRA Registration & Prior Permission", desc: "Ministry of Home Affairs compliance to legally receive foreign charitable contributions." },
      { name: "NITI Aayog NGO Darpan Registration", desc: "Mandatory portal enrollment for accessing Central and State ministry grants." },
      { name: "CSR Project Proposals & DPRs", desc: "Drafting high-impact project proposals for corporate CSR grant allocations." },
    ],
    timeline: "7–15 Business Days for incorporation / 30 days for 12A/80G",
    deliverables: [
      "Section 8 License & Certificate of Incorporation",
      "Registered Trust Deed / Society Bylaws",
      "12A and 80G Certificates",
      "NGO Darpan Unique ID",
    ],
    relatedGuides: [
      { title: "Section 8 Company Registration Guide", slug: "section-8-company-registration" },
      { title: "PMFME Seed Capital & SHG Support", slug: "pmfme-scheme-2026" },
      { title: "Copyright Protection for Educational Assets", slug: "copyright-protection-india" },
    ],
  },
];

const quickLinks = [
  { icon: FileCheck2, title: "Business Registration", desc: "Start smart — from OPC, LLP to full company setup", to: "/services", color: "bg-blue-50 text-blue-600" },
  { icon: Landmark, title: "Government Schemes", desc: "MSME, PMEGP, Mudra Loan & every scheme you qualify for", to: "/government-schemes", color: "bg-orange-50 text-orange-600" },
  { icon: Percent, title: "GST & Tax", desc: "Compliance, filing, and advisory for businesses of all sizes", to: "/services", color: "bg-green-50 text-green-600" },
];

const testimonials = [
  { quote: "ArthoVista helped us secure MSME funding through PMEGP scheme. Their team was very professional and guided us at every step.", name: "Ramesh Patel", role: "Founder, Digital Fresh", rating: 5 },
  { quote: "Their expertise in company registration and compliance saved us months of effort. Highly recommended for every entrepreneur.", name: "Priya Mehta", role: "Co-Founder, TechBridge", rating: 5 },
  { quote: "Got our NGO registered and 80G certification done within weeks. Their team was very responsive and knowledgeable.", name: "Amit Sharma", role: "Trustee, Asha Foundation", rating: 5 },
];

/* ---------- COUNTER HOOK ---------- */
function useCountUp(target, duration = 2000) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          let start = 0;
          const num = parseInt(target.replace(/\D/g, "")) || 0;
          if (!num) { setCount(target); return; }
          const step = num / (duration / 16);
          const timer = setInterval(() => {
            start += step;
            if (start >= num) {
              setCount(target);
              clearInterval(timer);
            } else {
              const prefix = target.replace(/[\d.]+/, "");
              setCount(Math.floor(start) + (prefix.includes("+") ? "" : ""));
            }
          }, 16);
          observer.disconnect();
        }
      },
      { threshold: 0.5 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target, duration]);

  return { count, ref };
}

/* ---------- STAT CARD ---------- */
function StatCard({ value, label, icon: Icon, delay }) {
  const { count, ref } = useCountUp(value);
  return (
    <div
      ref={ref}
      className="stat-card"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="flex justify-center mb-3">
        <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center">
          <Icon size={22} className="text-orange-400" />
        </div>
      </div>
      <div className="stat-value">{count || value}</div>
      <div className="stat-label">{label}</div>
    </div>
  );
}

/* ---------- MAIN HOME ---------- */
export default function Home() {
  useDocumentMetadata(
    "ArthoVista | MSME & Startup Business Support",
    "End-to-end support for MSMEs and startups — registration, certifications, government funding and digital growth with ArthoVista."
  );
  const { openConsultationModal } = useConsultation();
  const [formData, setFormData] = useState({ name: "", phone: "", email: "", service: "" });
  const [status, setStatus] = useState("idle"); // idle | loading | success | error
  const [errMsg, setErrMsg] = useState("");
  const [selectedSegment, setSelectedSegment] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("loading");
    setErrMsg("");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          phone: formData.phone,
          email: formData.email,
          service: formData.service || "General Consultation",
          source: "website-home-hero",
        }),
      });
      const data = await res.json();
      if (data.success) {
        setStatus("success");
      } else {
        setErrMsg(data.message || "Something went wrong.");
        setStatus("error");
      }
    } catch {
      setErrMsg("Network error. Please try again.");
      setStatus("error");
    }
  };

  return (
    <div className="w-full">
      {/* ====== HERO SECTION ====== */}
      <section className="relative min-h-[85vh] flex items-center overflow-hidden border-b border-slate-800/40">
        <div className="w-full max-w-7xl mx-auto px-6 md:px-10 py-16 grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="animate-slide-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/20 border border-blue-400/40 text-blue-300 text-xs font-bold uppercase tracking-wider mb-6">
              <Shield size={14} className="text-amber-400" />
              Empanelled Advisory · 500+ MSMEs Empowered
            </div>
            <h1
              className="font-display font-black text-white leading-tight tracking-tight drop-shadow-md"
              style={{ fontSize: "clamp(34px, 5vw, 56px)" }}
            >
              Accelerate Your{" "}
              <span className="text-teal-300 relative font-black">
                Business Growth
                <svg className="absolute -bottom-2 left-0 w-full" height="4" viewBox="0 0 200 4">
                  <path d="M0 2 Q50 0 100 2 Q150 4 200 2" stroke="#2dd4bf" strokeWidth="2.5" fill="none" strokeLinecap="round" />
                </svg>
              </span>
              <br />With ArthoVista
            </h1>
            <p className="text-slate-100 mt-5 text-base font-medium leading-relaxed max-w-lg drop-shadow-sm">
              Official end-to-end consulting for MSMEs, Corporates, and NGOs — registrations, ISO/FSSAI certifications, government scheme grants, and loan facilitation.
            </p>

            {/* Badges */}
            <div className="flex flex-wrap gap-8 mt-8">
              {[
                { val: "500+", lab: "Clients Empowered" },
                { val: "₹50Cr+", lab: "Funding Facilitated" },
                { val: "98%", lab: "Approval Rate" },
              ].map((b) => (
                <div key={b.lab} className="text-left">
                  <div className="text-2xl md:text-3xl font-display font-black text-white drop-shadow-sm">{b.val}</div>
                  <div className="text-xs font-bold text-slate-300 mt-0.5 tracking-wide">{b.lab}</div>
                </div>
              ))}
            </div>

            <div className="flex flex-wrap gap-4 mt-8">
              <button
                onClick={() => openConsultationModal("General Consultation")}
                className="btn-3d inline-flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white font-bold text-sm px-6 py-3.5 rounded-xl shadow-lg shadow-teal-500/30 transition-all cursor-pointer"
              >
                <Phone size={15} />
                <span>Free Consultation</span>
                <ArrowRight size={15} />
              </button>
              <Link to="/services" className="inline-flex items-center gap-2 bg-slate-800/90 hover:bg-slate-700 text-white border border-slate-600 font-bold text-sm px-6 py-3.5 rounded-xl transition-all">
                Explore Services
              </Link>
            </div>

            {/* Trust badges */}
            <div className="flex flex-wrap gap-5 mt-8 pt-5 border-t border-slate-800/80">
              {["KVIC Empanelled", "MSME Certified", "Startup India Partner"].map((b) => (
                <span key={b} className="flex items-center gap-1.5 text-xs font-bold text-slate-100">
                  <CheckCircle size={14} className="text-emerald-400" />
                  {b}
                </span>
              ))}
            </div>
          </div>

          {/* Right — 3D Lead Form Card */}
          <div className="animate-slide-right lg:animate-scale-in">
            <div
              className="tilt-3d float-3d bg-slate-900/90 border border-slate-700/80 rounded-2xl p-7 md:p-8 relative overflow-hidden shadow-2xl"
            >
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-teal-500 via-emerald-400 to-amber-400" />
              <h2 className="font-display font-bold text-white text-xl mb-1">
                Get Free Business Assessment
              </h2>
              <p className="text-slate-200 text-sm font-medium mb-6">
                Our expert advisor will call you within 24 hours.
              </p>

              {status === "success" ? (
                <div className="py-10 text-center">
                  <CheckCircle size={48} className="text-emerald-400 mx-auto mb-4" />
                  <p className="text-white font-bold text-lg">Consultation Requested!</p>
                  <p className="text-slate-200 text-sm font-medium mt-2">Thank you! Our expert will call you within 24 hours.</p>
                </div>
              ) : (
                <form className="space-y-4" onSubmit={handleSubmit}>
                  <input
                    type="text"
                    placeholder="Full Name"
                    required
                    className="input-3d bg-slate-800 text-white border-slate-600 focus:border-teal-500 placeholder-slate-400 font-medium"
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                  <input
                    type="tel"
                    placeholder="Phone Number"
                    required
                    className="input-3d bg-slate-800 text-white border-slate-600 focus:border-teal-500 placeholder-slate-400 font-medium"
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  />
                  <input
                    type="email"
                    placeholder="Email Address"
                    className="input-3d bg-slate-800 text-white border-slate-600 focus:border-teal-500 placeholder-slate-400 font-medium"
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                  <select
                    className="input-3d bg-slate-800 text-white border-slate-600 focus:border-teal-500 font-medium"
                    onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                    required
                  >
                    <option value="" className="bg-slate-900 text-white">Select Service / Lead Category</option>
                    <option value="Business Registration Leads" className="bg-slate-900 text-white">Business Registration Leads</option>
                    <option value="Government Schemes & Subsidies Leads" className="bg-slate-900 text-white">Government Schemes & Subsidies Leads</option>
                    <option value="Business & MSME Loan Leads" className="bg-slate-900 text-white">Business & MSME Loan Leads</option>
                    <option value="Home Loan Leads" className="bg-slate-900 text-white">Home Loan Leads</option>
                    <option value="ISO & Quality Certifications Leads" className="bg-slate-900 text-white">ISO & Quality Certifications Leads</option>
                    <option value="GST & Tax Compliance Leads" className="bg-slate-900 text-white">GST & Tax Compliance Leads</option>
                    <option value="NGO & Section 8 Leads" className="bg-slate-900 text-white">NGO & Section 8 Leads</option>
                    <option value="Digital Marketing & Growth Leads" className="bg-slate-900 text-white">Digital Marketing & Growth Leads</option>
                    <option value="DPR & Pitch Deck Leads" className="bg-slate-900 text-white">DPR & Pitch Deck Leads</option>
                  </select>

                  {status === "error" && (
                    <p className="text-red-300 text-xs font-semibold bg-red-500/20 border border-red-500/40 rounded-lg px-3 py-2">
                      {errMsg}
                    </p>
                  )}

                  <button
                    type="submit"
                    disabled={status === "loading"}
                    className="btn-3d w-full bg-teal-600 hover:bg-teal-700 text-white font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 transition-all disabled:opacity-70 cursor-pointer shadow-lg shadow-teal-500/25"
                  >
                    {status === "loading" ? "Booking..." : "Book Free Consultation"}
                    <ArrowRight size={15} />
                  </button>
                  <p className="text-center text-xs font-medium text-slate-300">
                    No hidden fees · 100% Confidential
                  </p>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ====== STATS SECTION ====== */}
      <section className="stats-section border-b border-slate-800/40">
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 divide-x divide-white/15">
          {stats.map((s, i) => (
            <StatCard key={s.label} {...s} delay={i * 100} />
          ))}
        </div>
      </section>

      {/* ====== WE SERVE SECTION ====== */}
      <section className="py-20 px-6 max-w-6xl mx-auto">
        <div className="text-center mb-14">
          <div className="eyebrow">Solutions for Every Business</div>
          <h2 className="section-title text-white">
            We Serve <span className="highlight">Every Business</span>
          </h2>
          <p className="text-slate-100 mt-3 max-w-xl mx-auto font-medium text-base">
            Tailored consulting & scheme solutions for businesses of all sizes and types.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {segments.map((s, i) => (
            <div
              key={s.title}
              className="tilt-3d service-block rounded-2xl overflow-hidden bg-slate-900/85 backdrop-blur-md border border-slate-700/80 shadow-2xl"
              style={{ animationDelay: `${i * 150}ms` }}
            >
              <div className={`bg-gradient-to-br ${s.color} p-6`}>
                <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center mb-4 shadow-sm">
                  <s.icon size={22} className="text-white" />
                </div>
                <h3 className="font-display font-black text-white text-xl drop-shadow-sm">{s.title}</h3>
                <p className="text-white font-semibold text-xs mt-1">{s.subtitle}</p>
              </div>
              <div className="p-6">
                <ul className="space-y-3">
                  {s.items.map((item) => (
                    <li key={item} className="flex items-start gap-2.5 text-sm font-medium text-slate-100">
                      <CheckCircle size={15} className="text-teal-400 mt-0.5 shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
                <button
                  onClick={() => setSelectedSegment(s)}
                  className="mt-6 inline-flex items-center gap-1.5 text-teal-400 hover:text-teal-300 font-bold text-sm hover:gap-2.5 transition-all cursor-pointer"
                >
                  <span>Learn More</span> <ArrowRight size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ====== QUICK LINKS SECTION ====== */}
      <section className="py-16 border-t border-b border-slate-800/40">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <div className="eyebrow">Quick Access</div>
            <h2 className="section-title text-white">Popular <span className="highlight">Services</span></h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {quickLinks.map((q) => (
              <Link
                key={q.title}
                to={q.to}
                className="tilt-3d bg-slate-900/85 backdrop-blur-md rounded-2xl p-6 border border-slate-700/80 shadow-xl hover:border-teal-500 transition-all group"
              >
                <div className={`w-12 h-12 rounded-xl ${q.color} bg-opacity-20 flex items-center justify-center mb-4 shadow-sm`}>
                  <q.icon size={22} />
                </div>
                <h4 className="font-display font-bold text-white text-lg mb-2 drop-shadow-sm">{q.title}</h4>
                <p className="text-slate-100 text-sm font-medium leading-relaxed">{q.desc}</p>
                <div className="mt-4 flex items-center gap-1.5 text-teal-400 font-bold text-sm opacity-0 group-hover:opacity-100 transition-opacity">
                  Get Started <ArrowRight size={13} />
                </div>
              </Link>
            ))}

            {/* CTA Card */}
            <div
              className="rounded-2xl p-6 text-white flex flex-col justify-between card-3d border border-slate-700/80 backdrop-blur-md"
              style={{ background: "linear-gradient(135deg, rgba(10,22,40,0.88) 0%, rgba(26,48,96,0.88) 100%)", boxShadow: "0 20px 50px rgba(10,22,40,0.5)" }}
            >
              <div>
                <div className="w-12 h-12 rounded-xl bg-orange-500/20 flex items-center justify-center mb-4 shadow-sm">
                  <Phone size={22} className="text-orange-400" />
                </div>
                <h4 className="font-display font-bold text-xl mb-2 text-white drop-shadow-sm">Free 30-min Consultation</h4>
                <p className="text-slate-100 text-sm font-medium">No commitment. No hidden fees. Just expert guidance.</p>
              </div>
              <Link to="/contact" className="btn-primary-3d mt-6 justify-center shadow-lg shadow-teal-500/25">
                Book Now <ArrowRight size={15} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ====== WHY ARTHOVISTA SECTION ====== */}
      <section className="py-20 px-6 max-w-6xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="eyebrow">Why Choose Us</div>
            <h2 className="section-title text-white">
              India's Most <span className="highlight">Trusted</span>
              <br />MSME Advisor
            </h2>
            <p className="text-slate-100 mt-4 font-medium leading-relaxed text-base">
              We combine deep regulatory expertise with a proven track record — helping businesses unlock funding, stay compliant, and scale fast.
            </p>
            <div className="grid sm:grid-cols-2 gap-4 mt-8">
              {[
                { icon: Shield, title: "100% Transparent", desc: "No hidden charges. Clear timelines and pricing." },
                { icon: Award, title: "KVIC Empanelled", desc: "Officially recognized for scheme facilitation." },
                { icon: TrendingUp, title: "₹50Cr+ Facilitated", desc: "Consistent track record of securing funding." },
                { icon: Users, title: "500+ Happy Clients", desc: "Businesses across 24+ states trust us." },
              ].map((f) => (
                <div key={f.title} className="bg-slate-900/85 backdrop-blur-md border border-slate-700/80 rounded-xl p-4 flex gap-3 card-3d shadow-md">
                  <div className="w-10 h-10 rounded-lg bg-orange-500/15 flex items-center justify-center shrink-0">
                    <f.icon size={18} className="text-orange-400" />
                  </div>
                  <div>
                    <p className="font-bold text-white text-sm">{f.title}</p>
                    <p className="text-slate-200 text-xs font-medium mt-0.5">{f.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Visual */}
          <div className="relative hidden lg:block">
            <div
              className="rounded-2xl p-8 text-white text-center animate-breathe border border-slate-700/80 backdrop-blur-md"
              style={{ background: "linear-gradient(135deg, rgba(10,22,40,0.88) 0%, rgba(26,48,96,0.88) 100%)", boxShadow: "0 30px 80px rgba(10,22,40,0.5)" }}
            >
              <div className="text-6xl font-display font-black gradient-text">98%</div>
              <p className="text-white mt-2 font-bold text-base">Application Success Rate</p>
              <div className="mt-6 grid grid-cols-3 gap-3">
                {["₹50Cr+ Funded", "500+ Clients", "6+ Years"].map((t) => (
                  <div key={t} className="bg-white/15 rounded-lg p-3 border border-white/10">
                    <p className="text-xs font-bold text-white">{t}</p>
                  </div>
                ))}
              </div>
              <Link to="/contact" className="btn-primary-3d mt-6 w-full justify-center shadow-lg shadow-teal-500/25">
                Start Today <ArrowRight size={15} />
              </Link>
            </div>

            {/* Floating badges */}
            <div className="absolute -top-4 -left-4 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl p-3 flex items-center gap-2">
              <div className="w-8 h-8 bg-green-500/20 rounded-full flex items-center justify-center">
                <CheckCircle size={14} className="text-green-400" />
              </div>
              <span className="text-xs font-bold text-white">PMEGP Approved!</span>
            </div>
            <div className="absolute -bottom-4 -right-4 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl p-3 flex items-center gap-2">
              <div className="w-8 h-8 bg-orange-500/20 rounded-full flex items-center justify-center">
                <Star size={14} className="text-orange-400 fill-orange-400" />
              </div>
              <span className="text-xs font-bold text-white">5-Star Rated</span>
            </div>
          </div>
        </div>
      </section>

      {/* ====== KNOWLEDGE HUB & MSME INSIGHTS ====== */}
      <section className="py-20 px-6 max-w-6xl mx-auto border-t border-slate-800/40">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div>
            <div className="eyebrow">Official Scheme Guides & Regulatory Insights</div>
            <h2 className="section-title text-white">
              Knowledge <span className="highlight">Hub</span>
            </h2>
            <p className="text-slate-100 mt-2 font-medium text-base">
              Actionable, research-backed guides on government schemes, business finance, and compliance.
            </p>
          </div>
          <Link
            to="/blogs"
            className="mt-4 md:mt-0 inline-flex items-center gap-2 text-teal-400 hover:text-teal-300 font-bold text-sm hover:gap-3 transition-all"
          >
            <span>Explore All 20 Guides</span> <ArrowRight size={16} />
          </Link>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {blogPosts.slice(0, 3).map((post) => (
            <Link
              key={post.id}
              to={`/blog/${post.slug}`}
              className="group bg-slate-900/85 backdrop-blur-md rounded-2xl p-6 border border-slate-700/80 shadow-xl hover:border-teal-500/50 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between text-xs text-slate-400 mb-3">
                  <span className="px-2.5 py-1 rounded-lg bg-teal-500/10 text-teal-400 border border-teal-500/20 font-semibold">
                    {post.category}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock size={12} /> {post.readTime}
                  </span>
                </div>
                <h3 className="font-display font-bold text-white text-lg group-hover:text-teal-400 transition-colors leading-snug line-clamp-2">
                  {post.title}
                </h3>
                <p className="mt-3 text-xs sm:text-sm text-slate-200 line-clamp-3 leading-relaxed">
                  {post.excerpt}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between text-xs font-bold text-teal-400">
                <span>Read Full Guide</span>
                <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ====== TESTIMONIALS ====== */}
      <section className="py-20 border-t border-b border-slate-800/40">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <div className="eyebrow">Client Stories</div>
            <h2 className="section-title text-white">What Our <span className="highlight">Clients Say</span></h2>
            <p className="text-slate-100 mt-3 font-medium text-base">Real results from real businesses we've helped grow.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((t) => (
              <div key={t.name} className="bg-slate-900/85 backdrop-blur-md border border-slate-700/80 rounded-2xl p-6 card-3d shadow-xl">
                <div className="flex gap-0.5 mb-4">
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <Star key={i} size={14} className="text-amber-400 fill-amber-400" />
                  ))}
                </div>
                <p className="text-slate-100 text-sm font-medium leading-relaxed mb-5">"{t.quote}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white font-bold text-sm shadow-md">
                    {t.name[0]}
                  </div>
                  <div>
                    <p className="font-bold text-white text-sm">{t.name}</p>
                    <p className="text-xs font-bold text-teal-300">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-10">
            <Link to="/about" className="inline-flex items-center gap-2 text-teal-400 hover:text-teal-300 font-bold text-sm hover:gap-4 transition-all">
              View More Success Stories <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>

      {/* ====== CTA BANNER ====== */}
      <section
        className="relative py-20 px-6 overflow-hidden border-t border-slate-800/40"
      >
        <div className="relative z-10 max-w-3xl mx-auto text-center">
          <div className="eyebrow">Get Started Today</div>
          <h2
            className="font-display font-black text-white"
            style={{ fontSize: "clamp(28px, 4vw, 46px)" }}
          >
            Ready to <span className="gradient-text">Grow Your Business?</span>
          </h2>
          <p className="text-slate-100 font-medium text-base mt-4 max-w-lg mx-auto">
            Join 500+ businesses that chose ArthoVista as their trusted growth partner.
          </p>
          <div className="flex flex-wrap gap-3 justify-center mt-8">
            <Link to="/" className="btn-primary-3d">
              <Phone size={15} />
              Book Free Consultation
              <ArrowRight size={15} />
            </Link>
            <a href="tel:+919899902568" className="btn-outline-white-3d">
              +91 98999 02568
            </a>
          </div>
          <p className="text-slate-300 font-semibold text-xs mt-5">
            ★★★★★ &nbsp;Rated 5.0 · No hidden fees · Callback in 24 hours
          </p>
        </div>
      </section>

      {/* ====== SEGMENT DETAIL MODAL ====== */}
      {selectedSegment && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in"
          onClick={() => setSelectedSegment(null)}
        >
          <div
            className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto bg-slate-900 border border-slate-700/90 rounded-3xl shadow-2xl custom-scrollbar"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header Bar */}
            <div className={`bg-gradient-to-r ${selectedSegment.color} p-6 sm:p-8 relative`}>
              <button
                onClick={() => setSelectedSegment(null)}
                className="absolute top-5 right-5 p-2 rounded-full bg-black/20 hover:bg-black/40 text-white/80 hover:text-white transition cursor-pointer"
                title="Close"
              >
                <X size={18} />
              </button>

              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-white text-xs font-bold uppercase tracking-wider mb-3">
                <Sparkles size={12} /> {selectedSegment.badge}
              </div>

              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center text-white shrink-0 shadow-lg">
                  <selectedSegment.icon size={28} />
                </div>
                <div>
                  <h3 className="font-display font-black text-2xl sm:text-3xl text-white">
                    {selectedSegment.title}
                  </h3>
                  <p className="text-white/80 font-medium text-xs sm:text-sm mt-0.5">
                    {selectedSegment.subtitle}
                  </p>
                </div>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6 sm:p-8 space-y-6">
              {/* Executive Overview */}
              <div>
                <h4 className="text-xs font-bold uppercase text-teal-400 tracking-wider mb-2 flex items-center gap-1.5">
                  <Layers size={14} /> Scope & Strategic Overview
                </h4>
                <p className="text-slate-200 text-sm sm:text-base leading-relaxed bg-slate-800/50 p-4 rounded-xl border border-slate-700/60">
                  {selectedSegment.description}
                </p>
              </div>

              {/* Detailed Services Grid */}
              <div>
                <h4 className="text-xs font-bold uppercase text-teal-400 tracking-wider mb-3 flex items-center gap-1.5">
                  <CheckCircle2 size={14} /> Included Services & Turnkey Solutions
                </h4>
                <div className="grid sm:grid-cols-2 gap-3">
                  {selectedSegment.detailedServices.map((srv) => (
                    <div
                      key={srv.name}
                      className="p-3.5 rounded-xl bg-slate-800/60 border border-slate-700/70 hover:border-teal-500/40 transition-colors"
                    >
                      <div className="font-bold text-white text-sm flex items-start gap-2">
                        <CheckCircle size={15} className="text-teal-400 mt-0.5 shrink-0" />
                        <span>{srv.name}</span>
                      </div>
                      <p className="text-xs text-slate-300 mt-1.5 ml-6 leading-relaxed">
                        {srv.desc}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Deliverables & SLA */}
              <div className="grid sm:grid-cols-2 gap-4 pt-2 border-t border-slate-800">
                <div className="p-4 rounded-xl bg-slate-800/40 border border-slate-700/50">
                  <p className="text-xs font-bold uppercase text-amber-400 tracking-wider mb-2 flex items-center gap-1.5">
                    <Clock size={13} /> Turnaround SLA
                  </p>
                  <p className="text-sm font-semibold text-white">
                    {selectedSegment.timeline}
                  </p>
                </div>
                <div className="p-4 rounded-xl bg-slate-800/40 border border-slate-700/50">
                  <p className="text-xs font-bold uppercase text-amber-400 tracking-wider mb-2 flex items-center gap-1.5">
                    <FileText size={13} /> Key Deliverables
                  </p>
                  <ul className="space-y-1">
                    {selectedSegment.deliverables.map((del) => (
                      <li key={del} className="text-xs text-slate-300 flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-teal-400" />
                        <span>{del}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Related Knowledge Hub Guides */}
              {selectedSegment.relatedGuides && (
                <div className="pt-2 border-t border-slate-800">
                  <h4 className="text-xs font-bold uppercase text-teal-400 tracking-wider mb-3 flex items-center gap-1.5">
                    <BookOpen size={14} /> Relevant Scheme & Advisory Guides
                  </h4>
                  <div className="grid sm:grid-cols-2 gap-2">
                    {selectedSegment.relatedGuides.map((guide) => (
                      <Link
                        key={guide.slug}
                        to={`/blog/${guide.slug}`}
                        onClick={() => setSelectedSegment(null)}
                        className="p-3 rounded-lg bg-teal-950/20 hover:bg-teal-950/40 border border-teal-500/20 hover:border-teal-500/50 text-xs font-semibold text-teal-300 hover:text-teal-200 transition flex items-center justify-between group"
                      >
                        <span className="line-clamp-1">{guide.title}</span>
                        <ArrowRight size={13} className="shrink-0 group-hover:translate-x-1 transition-transform" />
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer CTA */}
            <div className="p-6 bg-slate-950/70 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
              <p className="text-xs text-slate-400 text-center sm:text-left">
                Need tailored consultation for <span className="text-white font-semibold">{selectedSegment.title}</span>?
              </p>
              <div className="flex gap-2 w-full sm:w-auto">
                <button
                  onClick={() => setSelectedSegment(null)}
                  className="px-4 py-2.5 rounded-xl border border-slate-700 text-slate-300 hover:text-white hover:bg-slate-800 text-xs font-bold transition cursor-pointer flex-1 sm:flex-none"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    const segTitle = `${selectedSegment.title} Leads`;
                    setSelectedSegment(null);
                    openConsultationModal(segTitle);
                  }}
                  className="px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold shadow-lg shadow-teal-500/25 transition cursor-pointer flex items-center justify-center gap-1.5 flex-1 sm:flex-none"
                >
                  <span>Book Free Strategy Call</span> <ArrowRight size={14} />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
