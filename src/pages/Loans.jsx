import { useState, useEffect } from "react";
import {
  Briefcase, User, Home as HomeIcon, Building, GraduationCap, Cog,
  ChevronDown, PhoneCall, ArrowRight, CheckCircle, TrendingUp, Shield,
  X, Loader2
} from "lucide-react";
import { Link } from "react-router-dom";
import useDocumentMetadata from "../hooks/useDocumentMetadata";
import { useConsultation } from "../context/ConsultationContext";
import axisLogo from "../assets/banks/Axis.png";
import iciciLogo from "../assets/banks/ICICI.png";
import hdfcLogo from "../assets/banks/HDFC.png";
import kotakLogo from "../assets/banks/kotak.png";
import idfcFirstLogo from "../assets/banks/IDFC-First.png"; 
import sbiLogo from "../assets/banks/sbi.png";
import standardLogo from "../assets/banks/standard_bank.png";
import adityaBirlaLogo from "../assets/banks/Aditya-Birlaa.png";


const banks = [
  { name: "Axis Bank", logo: axisLogo },
  { name: "ICICI Bank", logo: iciciLogo },
  { name: "Kotak Mahindra Bank", logo: kotakLogo },
  { name: "HDFC Bank", logo: hdfcLogo },
  { name: "IDFC First Bank", logo: idfcFirstLogo },
  { name: "Standard Bank", logo: standardLogo },
  { name: "Aditya Birla", logo: adityaBirlaLogo },
  { name: "SBI", logo: sbiLogo },
];


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

const faqs = [
  { q: "What is the minimum CIBIL score required?", a: "Most lenders prefer a CIBIL score of 700 or above for the best interest rates. However, we work with NBFCs that can approve loans with scores as low as 600." },
  { q: "How long does loan approval take?", a: "Approval typically takes 24-72 hours once all documents are submitted, with disbursal following within 3-7 business days." },
  { q: "Is collateral required for a business loan?", a: "Not always. Many of our banking partners offer collateral-free loans up to ₹50 lakh under government-backed guarantee schemes like CGTMSE." },
  { q: "Who can apply for a Salaried Personal Loan?", a: "Salaried individuals with a minimum monthly income and at least 1 year of continuous employment can apply." },
  { q: "What is a Machinery Loan and who is it for?", a: "It funds purchase of new or used machinery/equipment for manufacturing businesses, secured against the machinery itself." },
  { q: "How does ArthoVista help with loan applications?", a: "We match you to the right lender, prepare and verify documentation, and follow up on your behalf until disbursal." },
];

export default function Loans() {
  useDocumentMetadata(
    "Business & MSME Loans | Artha Ventures",
    "Get hassle-free business loans, MSME financing, working capital, and term loans with competitive interest rates and direct assistance."
  );
  const [openFaq, setOpenFaq] = useState(0);
  const { openConsultationModal } = useConsultation();

  return (
    <div>

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
            <button
              onClick={() => openConsultationModal("Business Loans & Funding")}
              className="btn-3d inline-flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white font-bold text-sm px-6 py-3 rounded-xl cursor-pointer"
            >
              Check Loan Eligibility <ArrowRight size={15} />
            </button>
            <a href="tel:+919899902568" className="btn-outline-white-3d">
              <PhoneCall size={15} /> +91 98999 02568
            </a>
          </div>
        </div>
      </section>i

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
              <div key={l.title} className="tilt-3d rounded-2xl overflow-hidden bg-white border border-slate-200/80 shadow-sm hover:border-blue-500/30 transition-all">
                <div className="loan-card-inner">
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
                      onClick={() => openConsultationModal(l.title)}
                      className="btn-3d w-full block text-center bg-teal-600 hover:bg-teal-700 text-white font-bold text-sm py-3 rounded-xl transition-all cursor-pointer"
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
                  key={`${b.name}-${i}`}
                  className="mx-3 px-6 py-3 bg-white rounded-xl border border-slate-100 shadow-sm whitespace-nowrap text-sm font-semibold text-slate-600 hover:border-orange-200 hover:text-orange-600 transition-colors"
                >
                  <img
                    src={b.logo}
                    alt={b.name}
                    className="max-w-[110px] max-h-[45px] object-contain"
                  />
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
            <a href="tel:+919899902568" className="btn-outline-white-3d">
              <PhoneCall size={15} /> +91 98999 02568
            </a>
          </div>
          <p className="text-white/30 text-xs mt-5">400+ businesses funded · No hidden fees</p>
        </div>
      </section>
    </div>
  );
}