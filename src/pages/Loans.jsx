import { useState, useEffect } from "react";
import {
  Briefcase, User, Home as HomeIcon, Building, GraduationCap, Cog,
  ChevronDown, PhoneCall, ArrowRight, CheckCircle, TrendingUp, Shield,
  X, Loader2
} from "lucide-react";
import { Link } from "react-router-dom";

const API_URL = "/api/contact";

const stats = [
  { value: "₹100Cr+", label: "Loans Facilitated" },
  { value: "400+", label: "Clients Funded" },
  { value: "24 hrs", label: "Avg Approval" },
  { value: "85%", label: "Satisfaction Rate" },
];

const loans = [
  {
    icon: Briefcase,
    title: "Business Loan",
    range: "₹1L - ₹50L+",
    detail: "15% - 24% p.a.",
    tenure: "1-5 years",
    color: "from-blue-600 to-indigo-800",
    features: ["Quick approval", "Minimal docs", "Collateral free option", "Flexible repayment"],
  },
  {
    icon: User,
    title: "Salaried Personal Loan",
    range: "₹50K - ₹40L+",
    detail: "10% - 24% p.a.",
    tenure: "1-5 years",
    color: "from-indigo-600 to-purple-800",
    features: ["Instant disbursal", "No collateral", "Online process", "Salary based"],
  },
  {
    icon: HomeIcon,
    title: "Home Loan",
    range: "₹5L - ₹10Cr+",
    detail: "7.35% - 15.5% p.a.",
    tenure: "Up to 30 years",
    color: "from-emerald-600 to-teal-800",
    features: ["Low interest rate", "Tax benefits", "Long tenure", "Top-up facility"],
  },
  {
    icon: Building,
    title: "Loan Against Property",
    range: "50-75% of Value",
    detail: "9% - 15% p.a.",
    tenure: "Up to 20 years",
    color: "from-amber-600 to-amber-800",
    features: ["High loan value", "Lower rates", "Business use", "Retain property"],
  },
  {
    icon: GraduationCap,
    title: "Education Loan",
    range: "Up to ₹50L+",
    detail: "9% - 15% p.a.",
    tenure: "Up to 15 years",
    color: "from-sky-600 to-blue-800",
    features: ["Study abroad", "No collateral upto ₹7.5L", "Moratorium period", "Tax deduction"],
  },
  {
    icon: Cog,
    title: "Machinery Loan",
    range: "₹1L - ₹5Cr+",
    detail: "8% - 18% p.a.",
    tenure: "Up to 7 years",
    color: "from-slate-600 to-slate-800",
    features: ["Asset backed", "Manufacturing units", "Upgradation support", "MSME focused"],
  },
];

const steps = [
  { num: "01", t: "Free Consultation", d: "Experts assess your needs and suggest the best loan type." },
  { num: "02", t: "Document Check", d: "We review and fix document issues before submission." },
  { num: "03", t: "Application Filing", d: "We prepare and file the application for approval." },
  { num: "04", t: "Track & Follow Up", d: "We track, respond to queries, and keep you updated." },
  { num: "05", t: "Loan Disbursal", d: "We guide on timely disbursal and repayments." },
];

const banks = [
  "IDFC Bank", "Axis Bank", "ICICI Bank", "Kotak Mahindra Bank",
  "HDFC Bank", "IDFC First Bank", "Standard Bank", "Mahindra Bank",
  "Aditya Birla", "Manipal Finance", "SBI"
];

const faqs = [
  { q: "What is the minimum CIBIL score required?", a: "Most lenders prefer a CIBIL score of 700 or above for the best interest rates. However, we work with NBFCs that can approve loans with scores as low as 600." },
  { q: "How long does loan approval take?", a: "Approval typically takes 24-72 hours once all documents are submitted, with disbursal following within 3-7 business days." },
  { q: "Is collateral required for a business loan?", a: "Not always. Many of our banking partners offer collateral-free loans up to ₹50 lakh under government-backed guarantee schemes like CGTMSE." },
  { q: "Who can apply for a Salaried Personal Loan?", a: "Salaried individuals with a minimum monthly income and at least 1 year of continuous employment can apply." },
  { q: "What is a Machinery Loan and who is it for?", a: "It funds purchase of new or used machinery/equipment for manufacturing businesses, secured against the machinery itself." },
  { q: "How does Artha Ventures help with loan applications?", a: "We match you to the right lender, prepare and verify documentation, and follow up on your behalf until disbursal." },
];

/* ─── Lead Modal ─────────────────────────────────────────────────────── */
function LeadModal({ loan, onClose }) {
  const [form, setForm] = useState({ name: "", phone: "", email: "" });
  const [status, setStatus] = useState("idle"); // idle | loading | success | error
  const [errMsg, setErrMsg] = useState("");
  const [active, setActive] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    // Trigger slide/fade in
    const timer = setTimeout(() => setActive(true), 10);
    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(onClose, 300); // Wait for transition animation to complete
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("loading");
    setErrMsg("");
    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          phone: form.phone,
          email: form.email,
          service: loan.title,
          source: "website-loan-card",
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
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-opacity duration-300 ${
        active && !isClosing ? "opacity-100" : "opacity-0"
      }`}
      style={{ background: "rgba(10,22,40,0.75)", backdropFilter: "blur(6px)" }}
      onClick={(e) => e.target === e.currentTarget && handleClose()}
    >
      <div
        className={`relative w-full max-w-md rounded-2xl overflow-hidden shadow-2xl transition-all duration-300 ${
          active && !isClosing
            ? "opacity-100 scale-100 translate-y-0"
            : "opacity-0 scale-95 translate-y-4"
        }`}
        style={{ background: "linear-gradient(145deg,#0b1329,#16254e)" }}
      >
        {/* Top accent */}
        <div className={`h-1.5 bg-gradient-to-r ${loan.color}`} />

        {/* Close */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 transition flex items-center justify-center text-white/70 hover:text-white"
        >
          <X size={16} />
        </button>

        <div className="p-7">
          {/* Icon + title */}
          <div className="flex items-center gap-3 mb-5">
            <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${loan.color} flex items-center justify-center`}>
              <loan.icon size={20} className="text-white" />
            </div>
            <div>
              <p className="text-white/50 text-xs">Applying for</p>
              <h3 className="font-display font-bold text-white text-lg leading-tight">{loan.title}</h3>
            </div>
          </div>

          {status === "success" ? (
            <div className="py-8 text-center">
              <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-4">
                <CheckCircle size={36} className="text-green-400" />
              </div>
              <p className="text-white font-semibold text-lg">Request Submitted!</p>
              <p className="text-white/50 text-sm mt-2">Our loan expert will call you within 24 hours.</p>
              <button
                onClick={handleClose}
                className="mt-6 px-6 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-semibold text-sm transition"
              >
                Close
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-white/60 text-xs mb-1.5 block">Full Name *</label>
                <input
                  type="text"
                  placeholder="Enter your full name"
                  required
                  className="w-full px-4 py-3 rounded-xl text-sm text-white placeholder-white/30 outline-none focus:ring-2 focus:ring-orange-500 transition"
                  style={{ background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.12)" }}
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
              </div>
              <div>
                <label className="text-white/60 text-xs mb-1.5 block">Phone Number *</label>
                <input
                  type="tel"
                  placeholder="+91 98765 43210"
                  required
                  pattern="[0-9+\s\-]{7,15}"
                  className="w-full px-4 py-3 rounded-xl text-sm text-white placeholder-white/30 outline-none focus:ring-2 focus:ring-orange-500 transition"
                  style={{ background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.12)" }}
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                />
              </div>
              <div>
                <label className="text-white/60 text-xs mb-1.5 block">Email Address <span className="text-white/30">(optional)</span></label>
                <input
                  type="email"
                  placeholder="you@example.com"
                  className="w-full px-4 py-3 rounded-xl text-sm text-white placeholder-white/30 outline-none focus:ring-2 focus:ring-orange-500 transition"
                  style={{ background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.12)" }}
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                />
              </div>

              {status === "error" && (
                <p className="text-red-400 text-xs bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">
                  {errMsg}
                </p>
              )}

              <button
                type="submit"
                disabled={status === "loading"}
                className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-bold text-sm text-white transition-all disabled:opacity-70"
                style={{ background: "linear-gradient(135deg,#f97316,#ea6820)" }}
              >
                {status === "loading" ? (
                  <><Loader2 size={16} className="animate-spin" /> Submitting…</>
                ) : (
                  <>Get Free Loan Consultation <ArrowRight size={15} /></>
                )}
              </button>
              <p className="text-center text-xs text-white/25">No hidden fees · 100% Confidential · Callback within 24 hrs</p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

/* ─── Main Component ─────────────────────────────────────────────────── */
export default function Loans() {
  const [openFaq, setOpenFaq] = useState(0);
  const [selectedLoan, setSelectedLoan] = useState(null);

  return (
    <div>
      {/* Lead Modal */}
      {selectedLoan && (
        <LeadModal loan={selectedLoan} onClose={() => setSelectedLoan(null)} />
      )}

      {/* ====== HERO ====== */}
      <section className="hero-dark relative py-16 px-6">
        <div className="grid-bg" />
        <div className="relative z-10 max-w-6xl mx-auto text-center">
          <div className="eyebrow text-white/60">Smart Financing</div>
          <h1
            className="font-display font-black text-white mt-2"
            style={{ fontSize: "clamp(30px, 5vw, 54px)" }}
          >
            Loan <span className="gradient-text">Products</span>
          </h1>
          <p className="text-white/50 mt-4 max-w-2xl mx-auto">
            Smart funding for every need — from Business Loans to Home Loans, Education to Machinery. Get the best rates with our expert guidance.
          </p>
          <div className="flex flex-wrap gap-3 justify-center mt-8">
            <Link to="/contact" className="btn-primary-3d">
              Check Loan Eligibility <ArrowRight size={15} />
            </Link>
            <a href="tel:+918888802588" className="btn-outline-white-3d">
              <PhoneCall size={15} /> +91 88888 02588
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

      {/* ====== LOAN CARDS ====== */}
      <section className="py-20 px-6 bg-slate-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <div className="eyebrow">All Products</div>
            <h2 className="section-title">
              Choose Your <span className="highlight">Loan Type</span>
            </h2>
            <p className="text-slate-500 mt-3 max-w-xl mx-auto">
              We partner with India's top banks and NBFCs to get you the best rates and quickest approvals.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {loans.map((l) => (
              <div key={l.title} className="loan-card">
                <div className="loan-card-inner glass-card rounded-2xl overflow-hidden">
                  {/* Header */}
                  <div className={`bg-gradient-to-br ${l.color} p-6`}>
                    <div className="flex items-center justify-between">
                      <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                        <l.icon size={22} className="text-white" />
                      </div>
                      <div className="text-right">
                        <div className="text-white/60 text-xs">Interest</div>
                        <div className="text-white font-bold text-sm">{l.detail}</div>
                      </div>
                    </div>
                    <h3 className="font-display font-black text-white text-xl mt-4">{l.title}</h3>
                    <div className="text-white/90 font-bold text-2xl mt-1">{l.range}</div>
                    <div className="text-white/50 text-xs mt-1">Tenure: {l.tenure}</div>
                  </div>

                  {/* Body */}
                  <div className="p-5">
                    <div className="grid grid-cols-2 gap-2 mb-5">
                      {l.features.map((f) => (
                        <div key={f} className="flex items-center gap-1.5 text-xs text-slate-600">
                          <CheckCircle size={11} className="text-green-500 shrink-0" />
                          {f}
                        </div>
                      ))}
                    </div>
                    <button
                      onClick={() => setSelectedLoan(l)}
                      className="w-full block text-center bg-gradient-to-r from-orange-500 to-orange-600 text-white font-bold text-sm py-3 rounded-xl hover:shadow-lg hover:shadow-orange-200 transition-all hover:-translate-y-0.5 cursor-pointer"
                    >
                      Apply Now →
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ====== 5 STEPS ====== */}
      <section className="py-16 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <div className="eyebrow">Simple Process</div>
            <h2 className="section-title">Your Loan in <span className="highlight">5 Simple Steps</span></h2>
          </div>

          <div className="grid sm:grid-cols-5 gap-4">
            {steps.map((s, i) => (
              <div key={s.num} className="relative text-center">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-orange-500 to-orange-700 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-orange-100">
                  <span className="font-display font-black text-white text-lg">{s.num}</span>
                </div>
                <p className="font-semibold text-navy text-sm">{s.t}</p>
                <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">{s.d}</p>
                {i < 4 && (
                  <div className="hidden sm:block absolute top-7 left-[70%] w-[60%] h-0.5 bg-gradient-to-r from-orange-300 to-slate-100" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ====== BANKING PARTNERS ====== */}
      <section className="py-16 px-6" style={{ background: "linear-gradient(135deg, #fdf3ec 0%, #fff7f3 100%)" }}>
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-10">
            <div className="eyebrow">Trusted Partners</div>
            <h2 className="section-title">Our Banking <span className="highlight">Partners</span></h2>
            <p className="text-slate-500 text-sm mt-3">Collaborated Banks & NBFCs — working with India's leading financial institutions.</p>
          </div>

          <div className="overflow-hidden">
            <div className="marquee-track">
              {[...banks, ...banks].map((b, i) => (
                <div
                  key={`${b}-${i}`}
                  className="mx-3 px-6 py-3 bg-white rounded-xl border border-slate-100 shadow-sm whitespace-nowrap text-sm font-semibold text-slate-600 hover:border-orange-200 hover:text-orange-600 transition-colors"
                >
                  {b}
                </div>
              ))}
            </div>
          </div>
          <p className="text-center text-xs text-slate-400 mt-5">
            *Loan tie-ups vary by region, subject to institution/eligibility criteria.
          </p>
        </div>
      </section>

      {/* ====== FAQ SECTION ====== */}
      <section className="py-16 px-6 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <div className="eyebrow">FAQ</div>
            <h2 className="section-title">Common <span className="highlight">Loan Questions</span></h2>
          </div>

          <div className="space-y-3">
            {faqs.map((f, idx) => (
              <div
                key={f.q}
                className={`glass-card rounded-xl overflow-hidden transition-all duration-300 ${
                  openFaq === idx ? "ring-2 ring-orange-400" : ""
                }`}
              >
                <button
                  className="w-full text-left p-5 flex items-center justify-between gap-3"
                  onClick={() => setOpenFaq(openFaq === idx ? -1 : idx)}
                >
                  <span className="font-semibold text-navy text-sm">{f.q}</span>
                  <ChevronDown
                    size={18}
                    className={`shrink-0 text-orange-500 transition-transform duration-300 ${
                      openFaq === idx ? "rotate-180" : ""
                    }`}
                  />
                </button>
                <div
                  className={`overflow-hidden transition-all duration-300 ${
                    openFaq === idx ? "max-h-40 pb-5 px-5" : "max-h-0"
                  }`}
                >
                  <p className="text-slate-500 text-sm leading-relaxed">{f.a}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ====== BOTTOM CTA ====== */}
      <section
        className="py-16 px-6"
        style={{ background: "linear-gradient(135deg, #0a1628 0%, #1a3060 100%)" }}
      >
        <div className="max-w-3xl mx-auto text-center">
          <div className="eyebrow text-white/50">Expert Guidance</div>
          <h2
            className="font-display font-black text-white mt-2"
            style={{ fontSize: "clamp(24px, 4vw, 40px)" }}
          >
            Not Sure Which Loan <span className="gradient-text">Suits You Best?</span>
          </h2>
          <p className="text-white/50 mt-3 max-w-lg mx-auto text-sm">
            Our loan experts will evaluate your profile and recommend the best product with the highest approval chance — completely free.
          </p>
          <div className="flex flex-wrap gap-3 justify-center mt-8">
            <Link to="/contact" className="btn-primary-3d">
              Get Free Loan Assessment <ArrowRight size={15} />
            </Link>
            <a href="tel:+918888802588" className="btn-outline-white-3d">
              <PhoneCall size={15} /> +91 88888 02588
            </a>
          </div>
          <p className="text-white/30 text-xs mt-5">400+ businesses funded · No hidden fees</p>
        </div>
      </section>
    </div>
  );
}
