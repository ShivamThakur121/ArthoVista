import { useState, useEffect } from "react";
import {
  Landmark, Clock, ArrowRight, CheckCircle, TrendingUp,
  PhoneCall, X, Loader2
} from "lucide-react";
import { Link } from "react-router-dom";
import useDocumentMetadata from "../hooks/useDocumentMetadata";
import { useConsultation } from "../context/ConsultationContext";

const API_URL = "/api/contact";

const stats = [
  { value: "₹50L+", label: "Max Funding" },
  { value: "35%", label: "Max Subsidy" },
  { value: "6", label: "Active Schemes" },
  { value: "90%+", label: "Approval Rate" },
];

const schemes = [
  {
    code: "PMEGP",
    name: "Prime Minister's Employment Generation Programme",
    amount: "₹50 Lakh",
    tag: "Up to 35% Subsidy",
    timeline: "45-60 days",
    type: "Manufacturing / Service",
    color: "from-blue-600 to-indigo-800",
    features: ["Government backed", "No collateral required", "Subsidy up to 35%", "For new enterprises"],
  },
  {
    code: "CGTMSE",
    name: "Credit Guarantee Fund Trust for Micro and Small Enterprises",
    amount: "₹5 Crore",
    tag: "Collateral Free",
    timeline: "30-45 days",
    type: "Manufacturing / Service",
    color: "from-indigo-600 to-purple-800",
    features: ["Collateral free", "Up to ₹5 Crore", "Low interest", "Credit guarantee"],
  },
  {
    code: "MUDRA LOAN",
    name: "Micro Units Development and Refinance Agency",
    amount: "₹10 Lakh",
    tag: "Low Interest",
    timeline: "7-15 days",
    type: "Micro Enterprises",
    color: "from-emerald-600 to-teal-800",
    features: ["Quick approval", "Low documentation", "Flexible repayment", "No collateral"],
  },
  {
    code: "STAND-UP INDIA",
    name: "Stand-Up India Scheme",
    amount: "₹1 Crore",
    tag: "SC/ST & Women Focused",
    timeline: "30-45 days",
    type: "Greenfield Projects",
    color: "from-amber-600 to-amber-800",
    features: ["SC/ST focused", "Women entrepreneurs", "₹10L-₹1Cr range", "Greenfield projects"],
  },
  {
    code: "STARTUP INDIA",
    name: "Startup India Seed Fund Scheme",
    amount: "₹50 Lakh",
    tag: "DPIIT Recognised",
    timeline: "45-60 days",
    type: "Startups",
    color: "from-sky-600 to-blue-800",
    features: ["DPIIT recognized", "Seed funding", "Tax relaxations", "Easy compliance"],
  },
  {
    code: "PM-FME",
    name: "PM Formalisation of Micro Food Processing Enterprises",
    amount: "₹10 Lakh",
    tag: "Capital Subsidy",
    timeline: "45-60 days",
    type: "Food Processing",
    color: "from-slate-600 to-slate-800",
    features: ["35% capital subsidy", "Food sector", "Technology upgrade", "Market linkage"],
  },
];

export default function GovernmentSchemes() {
  useDocumentMetadata(
    "Government Schemes & Subsidies | Artha Ventures",
    "Access government schemes and subsidies like PMEGP, CGTMSE, Startup India, and Mudra loans to fund your business growth."
  );
  const { openConsultationModal } = useConsultation();

  return (
    <div>

      {/* ====== HERO ====== */}
      <section className="hero-dark relative py-16 px-6">
        <div className="grid-bg" />
        <div className="relative z-10 max-w-6xl mx-auto text-center">
          <div className="eyebrow text-white/60">Government Support</div>
          <h1
            className="font-display font-black text-white mt-2"
            style={{ fontSize: "clamp(30px, 5vw, 54px)" }}
          >
            Government <span className="gradient-text">Schemes</span>
          </h1>
          <p className="text-white/50 mt-4 max-w-2xl mx-auto">
            We help you access the best government schemes designed for MSMEs and startups — maximizing your funding and subsidies.
          </p>
          <div className="flex flex-wrap gap-3 justify-center mt-8">
            <Link to="/contact" className="btn-primary-3d">
              Free Scheme Assessment <ArrowRight size={15} />
            </Link>
            <a href="tel:+919899902568" className="btn-outline-white-3d">
              <PhoneCall size={15} /> Call Now
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

      {/* ====== SCHEME CARDS ====== */}
      <section className="py-20 px-6 bg-slate-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <div className="eyebrow">Available Schemes</div>
            <h2 className="section-title">
              Explore All <span className="highlight">Government Schemes</span>
            </h2>
            <p className="text-slate-500 mt-3">
              Find the scheme best suited for your business stage, sector, and funding needs.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {schemes.map((s) => (
              <div key={s.code} className="tilt-3d scheme-card bg-white border border-slate-200/80 rounded-2xl overflow-hidden shadow-sm hover:border-blue-500/30 transition-all">
                {/* Card Header */}
                <div className={`bg-gradient-to-br ${s.color} p-5`}>
                  <div className="flex items-center justify-between">
                    <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                      <Landmark size={18} className="text-white" />
                    </div>
                    <span className="text-xs font-semibold text-white/70 bg-white/15 px-3 py-1 rounded-full">
                      {s.type}
                    </span>
                  </div>
                  <h3 className="font-display font-black text-white text-xl mt-4">{s.code}</h3>
                  <p className="text-white/70 text-xs mt-1 leading-relaxed">{s.name}</p>
                </div>

                {/* Card Body */}
                <div className="p-5">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <div className="text-2xl font-display font-black text-orange-600">{s.amount}</div>
                      <div className="text-xs text-slate-500 mt-0.5">{s.tag}</div>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-slate-500 bg-slate-50 px-3 py-1.5 rounded-full">
                      <Clock size={11} />
                      {s.timeline}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 mb-5">
                    {s.features.map((f) => (
                      <div key={f} className="flex items-center gap-1.5 text-xs text-slate-600">
                        <CheckCircle size={11} className="text-green-500 shrink-0" />
                        {f}
                      </div>
                    ))}
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => openConsultationModal(s.code)}
                      className="btn-3d flex-1 text-center bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold py-2.5 rounded-lg transition-all cursor-pointer"
                    >
                      Apply Now
                    </button>
                    <button
                      onClick={() => openConsultationModal(s.code)}
                      className="flex-1 text-center border border-slate-300 text-slate-700 text-xs font-bold py-2.5 rounded-lg hover:bg-slate-100 transition-all cursor-pointer"
                    >
                      Learn More
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Info Banner */}
          <div className="mt-10 glass-card rounded-2xl p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-5">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center shrink-0">
                <TrendingUp size={22} className="text-orange-600" />
              </div>
              <div>
                <p className="font-semibold text-navy">Not sure which scheme fits your business?</p>
                <p className="text-slate-500 text-sm mt-0.5">Chat with us — get free advice on government schemes & funding.</p>
              </div>
            </div>
            <Link to="/contact" className="btn-primary-3d shrink-0">
              Free Assessment <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>

      {/* ====== PROCESS SECTION ====== */}
      <section className="py-16 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <div className="eyebrow">Our Process</div>
            <h2 className="section-title">How We <span className="highlight">Help You Apply</span></h2>
          </div>
          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { num: "01", t: "Eligibility Check", d: "We assess your business profile for the best matching schemes." },
              { num: "02", t: "Document Prep", d: "Our team prepares and reviews all required documents." },
              { num: "03", t: "Application Filing", d: "We file the application on your behalf with precision." },
              { num: "04", t: "Approval & Disbursal", d: "We track progress and follow up till you get funded." },
            ].map((step, i) => (
              <div key={step.num} className="text-center relative">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-orange-500 to-orange-700 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-orange-200">
                  <span className="font-display font-black text-white text-xl">{step.num}</span>
                </div>
                <h3 className="font-semibold text-navy">{step.t}</h3>
                <p className="text-slate-500 text-sm mt-2 leading-relaxed">{step.d}</p>
                {i < 3 && (
                  <div className="hidden md:block absolute top-8 left-[60%] w-[80%] h-0.5 bg-gradient-to-r from-orange-200 to-slate-100" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ====== ORANGE CTA ====== */}
      <section
        className="relative py-16 px-6 overflow-hidden"
        style={{ background: "linear-gradient(135deg, #ea580c, #c2410c)" }}
      >
        <div className="absolute inset-0 opacity-10 bg-repeat" style={{ backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)", backgroundSize: "30px 30px" }} />
        <div className="relative z-10 max-w-3xl mx-auto text-center">
          <h2 className="font-display font-black text-white" style={{ fontSize: "clamp(24px, 4vw, 40px)" }}>
            Not Sure Which Scheme Fits Your Business?
          </h2>
          <p className="text-orange-100 mt-3 max-w-xl mx-auto">
            Our MSME experts will evaluate your business profile and recommend the scheme with the highest approval chance — for free.
          </p>
          <div className="flex flex-wrap gap-3 justify-center mt-7">
            <Link to="/contact" className="bg-white text-orange-600 font-bold px-8 py-3.5 rounded-xl hover:bg-orange-50 transition-all hover:scale-105">
              Get Free Scheme Assessment
            </Link>
            <a href="tel:+919899902568" className="btn-outline-white-3d">
              +91 98999 02568
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
