import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import useDocumentMetadata from "../hooks/useDocumentMetadata";
import { useConsultation } from "../context/ConsultationContext";
import {
  Building2, ShieldCheck, HandCoins, Banknote, Laptop2,
  ClipboardCheck, Scale, ArrowRight, PhoneCall, CheckCircle,
  X, Loader2
} from "lucide-react";

const API_URL = "/api/contact";

const categories = [
  { id: "registration", label: "Business Registration", icon: Building2 },
  { id: "certifications", label: "Certifications", icon: ShieldCheck },
  { id: "grants", label: "Grants & Funding", icon: HandCoins },
  { id: "finance", label: "Business Finance", icon: Banknote },
  { id: "digital", label: "Digital Services", icon: Laptop2 },
  { id: "compliance", label: "Compliance", icon: ClipboardCheck },
  { id: "legal", label: "Legal & Protection", icon: Scale },
];

const blocks = [
  {
    num: "01", id: "registration", icon: Building2,
    title: "Business Registration",
    desc: "Private Limited, OPC, LLP, Partnership Firm, Section 8 Company, NGO registrations — we handle it all.",
    color: "from-blue-600 to-indigo-800",
    items: [
      { t: "Private Limited Company", d: "Most popular startup structure under Companies Act 2013. Ideal for scale, funding & investors." },
      { t: "One Person Company", d: "Sole proprietor gets corporate benefits — limited liability and legal recognition, with a single founder." },
      { t: "LLP Registration", d: "Combines partnership flexibility with limited liability. Lower compliance burden than a company." },
      { t: "Section 8 / NGO", d: "Non-profit structure for social, educational or charitable causes. Eligible for NGO/CSR grants and funding." },
    ],
  },
  {
    num: "02", id: "certifications", icon: ShieldCheck,
    title: "Certifications",
    desc: "Get certified with ISO, FSSAI, GeM, GST, Udyam, NSIC and more.",
    color: "from-yellow-600 to-purple-800",
    items: [
      { t: "ISO Certification", d: "Boosts your business credibility with quality internationally recognised standards for goods and services." },
      { t: "FSSAI License", d: "Mandatory for all food businesses — manufacturing, transporting, or distributing food products." },
      { t: "GeM / Import-Export", d: "Get onboarded on the Government e-Marketplace to sell products and services to government buyers." },
      { t: "Udyam Registration", d: "Official MSME registration for benefits like subsidies, priority lending, and government schemes." },
      { t: "Startup India", d: "Government's flagship startup initiative offering regulatory, tax relaxations, and access to funding." },
    ],
  },
  {
    num: "03", id: "grants", icon: HandCoins,
    title: "Grants & Funding",
    desc: "Access government grants, seed funding, and schemes like PMEGP, CGTMSE, Mudra, Stand-Up India.",
    color: "from-emerald-600 to-teal-800",
    items: [
      { t: "PMEGP Grant", d: "Prime Minister's Employment Generation Programme funds new micro-enterprises with government subsidy up to 35%." },
      { t: "CGTMSE Guarantee", d: "Credit Guarantee Fund Trust for Micro and Small Enterprises — collateral-free loans up to ₹2 Crore." },
      { t: "Mudra Loan", d: "Provides micro-financing up to ₹10 lakh for non-corporate, non-farm small/micro enterprises." },
      { t: "Stand-Up India", d: "Loans between ₹10 lakh and ₹1 Crore for SC/ST and women entrepreneurs for greenfield enterprises." },
      { t: "Startup India Seed Fund", d: "Financial assistance for proof of concept, prototype development, product trials, and market entry." },
    ],
  },
  {
    num: "04", id: "finance", icon: Banknote,
    title: "Business Finance",
    desc: "Working capital loans, venture capital connections, and MSME-specific financing up to ₹5 Crore.",
    color: "from-amber-600 to-amber-800",
    items: [
      { t: "Working Capital Loan", d: "Short-term financing to cover day-to-day operational expenses, inventory, and receivables management." },
      { t: "Term Loan", d: "Long-term funding for business expansion, equipment purchase, and infrastructure development." },
      { t: "ArthoVista Capital", d: "Connect with angel investors and VC funds for equity funding backed by growth potential." },
      { t: "MSME Financing", d: "Specialised products for micro, small, and medium enterprises tailored to business need." },
    ],
  },
  {
    num: "05", id: "digital", icon: Laptop2,
    title: "Digital Services",
    desc: "Website development, digital marketing, CRM, SEO, and social media to accelerate your online growth.",
    color: "from-sky-600 to-blue-800",
    items: [
      { t: "Website Development", d: "Professional, conversion-optimised websites built for e-commerce, service, and portfolio businesses." },
      { t: "SEO & Digital Marketing", d: "Improve organic reach, search rankings, and paid ads with data-driven digital marketing strategy." },
      { t: "CRM Solutions", d: "Custom relationship-management software to manage leads, sales, and improve customer retention." },
      { t: "Social Media Management", d: "Build brand presence on Facebook, Instagram, LinkedIn with engaging and targeted campaigns." },
    ],
  },
  {
    num: "06", id: "compliance", icon: ClipboardCheck,
    title: "Compliance",
    desc: "Stay compliant with ROC filings, GST returns, income tax, and annual compliance requirements.",
    color: "from-slate-600 to-slate-800",
    items: [
      { t: "ROC Compliance", d: "Annual filings, KYC, board resolutions, and Registrar of Companies compliance management." },
      { t: "GST Filing", d: "Monthly, quarterly, and annual GST return filing, tax reconciliation, and credit management." },
      { t: "Income Tax Returns", d: "Income tax filing for individuals, businesses, and firms — tax planning and assessment support." },
      { t: "Audit Support", d: "Ready audit-ready documentation, whether it's a statutory audit, tax audit, or government inspection." },
    ],
  },
  {
    num: "07", id: "legal", icon: Scale,
    title: "Legal & Protection",
    desc: "Protect your brand and business with trademark, patent, copyright, and legal registrations.",
    color: "from-pink-600 to-teal-800",
    items: [
      { t: "Trademark Registration", d: "Protect your brand name, logo, and slogan from unauthorised use — prevent copycats, theft & misuse." },
      { t: "Patent Filing", d: "Secure up to 20 years of exclusive rights over your invention, blocking others from making or selling it." },
      { t: "Copyright Protection", d: "Protect original content — software, content, music, literature, and art from infringement and piracy." },
      { t: "Legal Compliance", d: "Ensure your business complies with Indian labour, industry, and regulatory legal requirements." },
    ],
  },
];

const stats = [
  { value: "1000+", label: "Businesses Served" },
  { value: "98%", label: "Success Rate" },
  { value: "72 hrs", label: "Avg Turnaround" },
  { value: "7 Yrs", label: "Expert Experience" },
];

export default function Services() {
  useDocumentMetadata(
    "Business Services & Registrations | Artha Ventures",
    "Explore our professional services including Private Limited Company setup, LLP registration, GST filing, and ISO/FSSAI certifications."
  );
  const [active, setActive] = useState("registration");
  const { openConsultationModal } = useConsultation();

  const openModal = (service) => {
    openConsultationModal(service);
  };

  return (
    <div>

      {/* ====== HERO ====== */}
      <section className="hero-dark relative py-16 px-6">
        <div className="grid-bg" />
        <div className="relative z-10 max-w-6xl mx-auto text-center">
          <div className="eyebrow text-white/60">Our Expertise</div>
          <h1
            className="font-display font-black text-white mt-2"
            style={{ fontSize: "clamp(32px, 5vw, 56px)" }}
          >
            Our <span className="gradient-text">Services</span>
          </h1>
          <p className="text-white/50 mt-4 max-w-2xl mx-auto text-base">
            Comprehensive end-to-end business support for every stage of your entrepreneurial journey.
          </p>
          <div className="flex flex-wrap gap-3 justify-center mt-8">
            <Link to="/" className="btn-primary-3d">
              Free Consultation <ArrowRight size={15} />
            </Link>
            <a href="tel:+919899902568" className="btn-outline-white-3d">
              <PhoneCall size={15} /> +91 98999 02568
            </a>
          </div>
        </div>
      </section>

      {/* ====== STATS BAR ====== */}
      <section className="stats-section">
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 divide-x divide-white/10">
          {stats.map((s) => (
            <div key={s.label} className="stat-card">
              <div className="stat-value">{s.value}</div>
              <div className="stat-label">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ====== CATEGORY TABS ====== */}
      <section className="py-12 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="section-title">Explore <span className="highlight">All Services</span></h2>
          </div>
          <div className="flex flex-wrap gap-2 justify-center">
            {categories.map((c) => (
              <button
                key={c.id}
                onClick={() => setActive(c.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 ${
                  active === c.id
                    ? "bg-blue-600 text-white shadow-md shadow-blue-500/25"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200 border border-slate-200/60"
                }`}
              >
                <c.icon size={15} />
                {c.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ====== SERVICE BLOCKS ====== */}
      <section className="py-12 px-6 bg-slate-50 border-t border-slate-200/60">
        <div className="max-w-6xl mx-auto space-y-8">
          {blocks.map((b) => (
            <div
              key={b.id}
              id={b.id}
              className={`tilt-3d bg-white border border-slate-200/80 rounded-2xl overflow-hidden shadow-sm transition-all duration-500 ${
                active === b.id
                  ? "ring-2 ring-blue-500 ring-offset-2"
                  : "opacity-90"
              }`}
            >
              <div className="grid md:grid-cols-[300px_1fr]">
                {/* Left Panel */}
                <div className={`bg-gradient-to-br ${b.color} p-8 flex flex-col justify-between relative overflow-hidden`}>
                  <div>
                    <div className="w-12 h-12 rounded-xl bg-white/15 flex items-center justify-center mb-5">
                      <b.icon size={22} className="text-white" />
                    </div>
                    <h3 className="font-display font-bold text-white text-2xl">{b.title}</h3>
                    <p className="text-white/70 text-sm mt-3 leading-relaxed">{b.desc}</p>
                  </div>
                  <div className="flex gap-2 mt-8">
                    <button
                      onClick={() => openModal(b.title, b.color, b.icon)}
                      className="bg-white text-navy text-xs font-bold px-4 py-2.5 rounded-lg hover:bg-slate-50 transition cursor-pointer"
                    >
                      Full Details
                    </button>
                    <button
                      onClick={() => openModal(b.title, b.color, b.icon)}
                      className="border border-white/40 text-white text-xs font-bold px-4 py-2.5 rounded-lg hover:bg-white/10 transition cursor-pointer"
                    >
                      Get Started →
                    </button>
                  </div>
                  <span className="absolute -bottom-4 -right-4 text-8xl font-display font-black text-white/10">
                    {b.num}
                  </span>
                </div>

                {/* Right Panel */}
                <div className="p-8">
                  <div className="grid sm:grid-cols-2 gap-4">
                    {b.items.map((item) => (
                      <div
                        key={item.t}
                        className="border border-slate-100 rounded-xl p-4 hover:border-orange-200 hover:bg-orange-50/30 transition-all group cursor-pointer"
                        onClick={() => openModal(item.t, b.color, b.icon)}
                      >
                        <div className="flex items-start gap-2">
                          <CheckCircle size={14} className="text-orange-500 mt-0.5 shrink-0" />
                          <div>
                            <p className="font-semibold text-navy text-sm group-hover:text-orange-600 transition-colors">
                              {item.t}
                            </p>
                            <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">{item.d}</p>
                            <span className="inline-block mt-2 text-xs font-bold text-orange-500 group-hover:underline">
                              Enquire Now →
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ====== JOURNEY CTA ====== */}
      <section className="py-16 px-6" style={{ background: "gradient-to-r from-pink-600 to-teal-800",}}>
        <div className="max-w-6xl mx-auto">
          <div className="glass-card rounded-2xl p-8 md:p-12 text-center">
            <span className="badge-orange mb-5 inline-block">Free Consultation · No Obligation</span>
            <h2 className="section-title mb-3">
              Not Sure Which <span className="highlight">Service You Need?</span>
            </h2>
            <p className="text-slate-500 max-w-xl mx-auto">
              Our experts will map out the exact services, schemes, and subsidies that apply to your business — all in a free 30-minute call.
            </p>

            <div className="grid sm:grid-cols-4 gap-5 mt-10 text-left">
              {[
                { step: "01", t: "Service Mapping", d: "We identify exactly what your venture needs." },
                { step: "02", t: "Gap Analysis", d: "We audit your current registrations and compliance." },
                { step: "03", t: "Subsidy Discovery", d: "Uncover every government scheme you qualify for." },
                { step: "04", t: "Growth Roadmap", d: "Prioritised action plan with timelines and ROI." },
              ].map((j) => (
                <div key={j.t} className="relative">
                  <div className="w-10 h-10 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center font-bold font-display text-sm mb-3">
                    {j.step}
                  </div>
                  <p className="font-semibold text-navy text-sm">{j.t}</p>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">{j.d}</p>
                </div>
              ))}
            </div>

            <div
              className="rounded-xl p-6 mt-10 flex flex-col md:flex-row items-center justify-between gap-4"
              style={{ background: "linear-gradient(135deg, #0a1628, #1a3060)" }}
            >
              <div className="text-left">
                <p className="text-white font-semibold">Talk to an MSME Specialist</p>
                <p className="text-white/50 text-xs mt-1">We have helped 500+ businesses across India.</p>
              </div>
              <div className="flex gap-3 shrink-0">
                <Link to="/contact" className="btn-primary-3d">
                  Book Free Session <ArrowRight size={14} />
                </Link>
                <a href="tel:+919899902568" className="btn-outline-white-3d">
                  <PhoneCall size={15} /> +91 98999 02568
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
