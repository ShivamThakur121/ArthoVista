import { useState, useEffect } from "react";
import {
  Landmark, Clock, ArrowRight, CheckCircle, TrendingUp,
  PhoneCall, X, Loader2, Sparkles, FileText, CheckCircle2, BookOpen, AlertCircle, Layers, ChevronDown
} from "lucide-react";
import { Link } from "react-router-dom";
import useDocumentMetadata from "../hooks/useDocumentMetadata";
import { useConsultation } from "../context/ConsultationContext";
import { blogPosts } from "../data/blogData";

const API_URL = "/api/contact";

const schemeFaqs = [
  {
    q: "Who is eligible to receive up to 35% subsidy under the PMEGP scheme?",
    a: "Any individual above 18 years of age setting up a new manufacturing or service enterprise in rural areas belonging to special categories (Women, SC, ST, OBC, Ex-Servicemen, Minorities, Differently-abled) is eligible for a 35% margin money subsidy. General category applicants in rural areas receive 25%, while urban projects receive 15% (General) to 25% (Special)."
  },
  {
    q: "Is collateral or third-party guarantee required for CGTMSE loans?",
    a: "No. Under the CGTMSE scheme, banks and NBFCs provide 100% collateral-free credit facilities up to ₹5 Crore, as the Credit Guarantee Fund Trust covers 75% to 85% of the default risk for micro and small enterprises."
  },
  {
    q: "What is a Detailed Project Report (DPR) and why is it required for government schemes?",
    a: "A DPR is a bankable technical-cum-financial report detailing your capital expenditure, working capital requirements, projected cash flows, Debt Service Coverage Ratio (DSCR), and break-even analysis. All lending institutions and KVIC/DIC committees require a certified DPR to approve scheme subsidies."
  },
  {
    q: "Can an existing business apply for subsidies under PMEGP or PM-FME?",
    a: "PMEGP is strictly for new unit establishments (first-time entrepreneurs). However, PM-FME allows both existing micro food processing units to apply for up to 35% capital subsidy (max ₹10 Lakh) for technology/equipment upgrades as well as new units under ODOP clusters."
  },
  {
    q: "How long does the entire scheme sanction and subsidy disbursal process take?",
    a: "The typical timeline is 30 to 60 days, which includes DPR preparation, portal submission, District Level Task Force Committee (DLTFC) interview, bank sanction, and subsidy margin money lock-in release."
  },
];

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
    overview: "Credit-linked subsidy scheme by MSME Ministry & KVIC to establish new micro-enterprises in manufacturing (up to ₹50 Lakh) and services (up to ₹20 Lakh) with government margin money grant.",
    subsidyDetails: [
      "General Category: 15% (Urban) / 25% (Rural) margin money subsidy",
      "Special Category (SC/ST/OBC/Women/Minorities/Ex-Servicemen): 25% (Urban) / 35% (Rural) subsidy",
      "Beneficiary Contribution: Only 10% (General) or 5% (Special category) of project cost",
      "Bank Loan Component: 90% to 95% of total project cost"
    ],
    eligibility: [
      "Any individual above 18 years of age (no upper income ceiling)",
      "At least VIII standard pass for manufacturing projects >₹10L / services >₹5L",
      "Only for new unit setups (existing running units not eligible)",
      "Self Help Groups (SHGs) and institutions registered under Societies Act"
    ],
    documents: [
      "Detailed Project Report (DPR) with 5-year financials & cash flow projections",
      "Aadhaar Card, PAN Card & Caste / Category Certificate (if applicable)",
      "Highest Educational Qualification Certificate & EDP training certificate",
      "Rent / Lease agreement or land ownership document with electricity bill"
    ],
    features: ["Government backed grant", "No collateral required", "Subsidy up to 35%", "For new enterprises"],
    guideSlug: "pmegp-loan-scheme",
  },
  {
    code: "CGTMSE",
    name: "Credit Guarantee Fund Trust for Micro and Small Enterprises",
    amount: "₹5 Crore",
    tag: "Collateral Free",
    timeline: "30-45 days",
    type: "Manufacturing / Service",
    color: "from-indigo-600 to-purple-800",
    overview: "Trust set up by Ministry of MSME and SIDBI to provide third-party guarantee coverage up to ₹5 Crore for collateral-free credit facilities to Micro and Small enterprises.",
    subsidyDetails: [
      "Guarantee coverage up to 85% for micro-enterprises up to ₹5 Lakh",
      "Guarantee coverage up to 85% for women entrepreneurs, SC/ST, and units in NER",
      "Coverage up to 75% for all other standard MSME credit facilities up to ₹5 Crore",
      "Annual guarantee fee: Reduced to as low as 0.37% to 1.35% p.a."
    ],
    eligibility: [
      "New and existing Micro and Small Enterprises (Manufacturing & Services)",
      "Retail trade eligible up to ₹2 Crore limit",
      "Educational institutions, training institutions, and IT/ITES units",
      "Must have a valid Udyam MSME Registration"
    ],
    documents: [
      "Udyam Registration Certificate & GST Registration Certificate",
      "Bankable CMA data / Project Report showing debt service coverage ratio (DSCR)",
      "Past 2–3 years audited balance sheet & ITR (for existing units)",
      "Promoter KYC, net worth statement & business bank account statements"
    ],
    features: ["Collateral free lending", "Up to ₹5 Crore limit", "Low interest rates", "Direct credit guarantee"],
    guideSlug: "cgtmse-loan-scheme",
  },
  {
    code: "MUDRA LOAN",
    name: "Micro Units Development and Refinance Agency",
    amount: "₹10 Lakh",
    tag: "Low Interest",
    timeline: "7-15 days",
    type: "Micro Enterprises",
    color: "from-emerald-600 to-teal-800",
    overview: "Pradhan Mantri Mudra Yojana (PMMY) facilitates institutional credit up to ₹20 Lakh (Tarun Plus) to non-corporate, non-farm small/micro enterprises across Shishu, Kishore, and Tarun categories.",
    subsidyDetails: [
      "Shishu: Loans up to ₹50,000 (for nascent stage micro-businesses)",
      "Kishore: Loans above ₹50,000 and up to ₹5,00,000",
      "Tarun: Loans above ₹5,00,000 and up to ₹10,00,000",
      "Tarun Plus: Enhanced limit up to ₹20 Lakh for successful past borrowers",
      "Zero collateral or third-party guarantee required"
    ],
    eligibility: [
      "Small manufacturing units, shopkeepers, artisans, fruit/vegetable vendors, small service providers",
      "Indian citizen with non-defaulter credit history",
      "Age: 18 to 65 years"
    ],
    documents: [
      "Proof of Identity (Aadhaar / Voter ID / PAN / Driving License)",
      "Proof of Residence & Business address proof",
      "Bank account statement for past 6 months",
      "Quotation of machinery/items to be purchased & trade license / Udyam"
    ],
    features: ["Quick approval in 7-15 days", "Low documentation", "Flexible repayment terms", "No collateral required"],
    guideSlug: "business-loan-india",
  },
  {
    code: "STAND-UP INDIA",
    name: "Stand-Up India Scheme",
    amount: "₹1 Crore",
    tag: "SC/ST & Women Focused",
    timeline: "30-45 days",
    type: "Greenfield Projects",
    color: "from-amber-600 to-amber-800",
    overview: "Government scheme facilitating bank loans between ₹10 Lakh and ₹1 Crore to at least one SC/ST borrower and at least one woman borrower per bank branch for setting up greenfield enterprises.",
    subsidyDetails: [
      "Composite loan (Term loan + Working capital) covering up to 85% of project cost",
      "Borrower margin money: Minimum 15% (can be converged with eligible state/central subsidies)",
      "Repayment tenure: Up to 7 years with a moratorium period of up to 18 months",
      "Guaranteed through Credit Guarantee Scheme for Stand Up India (CGSUI)"
    ],
    eligibility: [
      "SC/ST and/or Woman entrepreneurs above 18 years of age",
      "Greenfield enterprise in manufacturing, services, agri-allied, or trading sector",
      "In non-individual enterprises, 51% shareholding & controlling stake must be held by SC/ST/Woman",
      "Borrower should not be in default to any bank or financial institution"
    ],
    documents: [
      "Promoter KYC, Proof of SC/ST category (if applicable) & Udyam registration",
      "Comprehensive DPR with technical feasibility and financial viability",
      "Land/premises lease or ownership documents & pollution NOC (if applicable)",
      "Proforma invoices for machinery, tools, and preliminary expenses"
    ],
    features: ["SC/ST focused funding", "Women entrepreneurs priority", "₹10L to ₹1Cr ticket size", "Greenfield project support"],
    guideSlug: "stand-up-india-scheme-2026",
  },
  {
    code: "STARTUP INDIA",
    name: "Startup India Seed Fund Scheme",
    amount: "₹50 Lakh",
    tag: "DPIIT Recognised",
    timeline: "45-60 days",
    type: "Startups",
    color: "from-sky-600 to-blue-800",
    overview: "Flagship initiative providing DPIIT recognition, Startup India Seed Fund Scheme (SISFS) grants up to ₹20L / debt up to ₹50L, 80-IAC 3-year tax exemptions, and fast-tracked patent examination.",
    subsidyDetails: [
      "Grants up to ₹20 Lakh for proof of concept, prototype development, and product trials",
      "Convertible debentures / debt-linked funding up to ₹50 Lakh for market entry and scaling",
      "100% income tax exemption under Section 80-IAC for 3 consecutive years out of 10",
      "Exemption from angel tax under Section 56(2)(viib)"
    ],
    eligibility: [
      "Incorporated as a Private Limited Company or LLP within the past 10 years",
      "Turnover not exceeding ₹100 Crore in any financial year since incorporation",
      "Working towards innovation, development or commercialization of new products/services",
      "Must have an innovative business model with high potential of employment generation or wealth creation"
    ],
    documents: [
      "Certificate of Incorporation / Registration & MoA/AoA or LLP Agreement",
      "Pitch Deck / Brief note explaining innovativeness and scalability of the product",
      "DPIIT Startup Recognition Certificate & Form 1/2 filing",
      "Prototype demo link, patent filing numbers, or website URL"
    ],
    features: ["DPIIT recognition support", "Seed funding & grants", "3-year tax holiday", "Simplified compliance"],
    guideSlug: "venture-capital-fund-india",
  },
  {
    code: "PM-FME",
    name: "PM Formalisation of Micro Food Processing Enterprises",
    amount: "₹10 Lakh",
    tag: "Capital Subsidy",
    timeline: "45-60 days",
    type: "Food Processing",
    color: "from-slate-600 to-slate-800",
    overview: "Pradhan Mantri Formalisation of Micro Food Processing Enterprises scheme providing 35% capital subsidy (up to ₹10 Lakh) for upgradation and formalization of micro food processing units.",
    subsidyDetails: [
      "Credit-linked capital subsidy @ 35% of eligible project cost, max ₹10.00 Lakh per unit",
      "Beneficiary contribution: Minimum 10% of the project cost, with the balance being bank loan",
      "Seed capital of ₹40,000 per SHG member for working capital and small tools",
      "Support for One District One Product (ODOP) and common infrastructure up to ₹3 Crore"
    ],
    eligibility: [
      "Individual micro food processing units (bakery, spices, dairy, pickle, snacks, grains, flour mills)",
      "Farmer Producer Organizations (FPOs), Self Help Groups (SHGs), and Producer Cooperatives",
      "Existing units upgrading technology/capacity or new units under ODOP cluster",
      "Applicant age >18 years with ownership/leasehold premises"
    ],
    documents: [
      "DPR for Food Processing Unit prepared by empanelled District Resource Person (DRP)",
      "Udyam Registration & FSSAI Food License (Basic / State)",
      "Quotation of food processing machinery and equipment with GST breakdown",
      "Aadhaar, PAN, Bank passbook & electricity bill of production facility"
    ],
    features: ["35% capital cash subsidy", "Food sector specialization", "Technology & equipment upgrade", "Market branding linkage"],
    guideSlug: "pmfme-scheme-2026",
  },
];

export default function GovernmentSchemes() {
  useDocumentMetadata(
    "Government Schemes & Subsidies | ArthoVista",
    "Access central government schemes and subsidies like PMEGP, CGTMSE, Startup India, and Mudra loans with ArthoVista."
  );
  const [selectedScheme, setSelectedScheme] = useState(null);
  const [openFaq, setOpenFaq] = useState(0);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    projectCost: "",
    sector: "Manufacturing Unit",
    state: "",
  });
  const [formStatus, setFormStatus] = useState("idle"); // idle | loading | success | error
  const [formMsg, setFormMsg] = useState("");

  const { openConsultationModal } = useConsultation();

  const handleSchemeFormSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.phone) {
      setFormStatus("error");
      setFormMsg("Please enter your name and phone number.");
      return;
    }
    setFormStatus("loading");
    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          phone: formData.phone,
          email: formData.email || "schemes-applicant@arthovista.in",
          service: selectedScheme ? `${selectedScheme.code} Scheme Leads` : "Government Scheme Leads",
          message: `Proposed Project Cost: ₹${formData.projectCost || "Not specified"}, Sector: ${formData.sector}, State: ${formData.state || "Not specified"}`,
          source: "scheme-detail-modal",
        }),
      });
      if (res.ok) {
        setFormStatus("success");
        setFormMsg("Your scheme assessment application has been submitted! Our KVIC / Scheme advisor will contact you within 24 hours.");
        setFormData({ name: "", phone: "", email: "", projectCost: "", sector: "Manufacturing Unit", state: "" });
      } else {
        setFormStatus("error");
        setFormMsg("Submission error. Please call +91 98999 02568 directly.");
      }
    } catch (err) {
      setFormStatus("error");
      setFormMsg("Network error. Please call +91 98999 02568 directly.");
    }
  };

  return (
    <div>

      {/* ====== HERO ====== */}
      <section className="hero-dark relative py-16 px-6">
        <div className="grid-bg" />
        <div className="relative z-10 max-w-6xl mx-auto text-center">
          <div className="eyebrow text-white/60">Government Initiatives</div>
          <h1
            className="font-display font-black text-white mt-2"
            style={{ fontSize: "clamp(30px, 5vw, 54px)" }}
          >
            Government <span className="gradient-text">Schemes</span>
          </h1>
          <p className="text-white/50 mt-4 max-w-2xl mx-auto">
            Unlock financial assistance, subsidies, and credit guarantee schemes designed to empower MSMEs and innovative startups across India.
          </p>
          <div className="flex flex-wrap gap-3 justify-center mt-8">
            <button
              onClick={() => openConsultationModal("Government Schemes & Subsidies Leads")}
              className="btn-3d inline-flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white font-bold text-sm px-6 py-3 rounded-xl cursor-pointer"
            >
              Check Scheme Eligibility <ArrowRight size={15} />
            </button>
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

      {/* ====== SCHEMES GRID ====== */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <div className="eyebrow">Key Programmes</div>
            <h2 className="section-title text-white">
              Featured <span className="highlight">Government Schemes</span>
            </h2>
            <p className="text-slate-100 mt-3 font-medium text-base max-w-xl mx-auto">
              Our team assists with documentation, DPR preparation, application filing, and end-to-end follow-up with nodal agencies.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {schemes.map((s) => (
              <div key={s.code} className="tilt-3d rounded-2xl overflow-hidden bg-slate-900/80 border border-slate-700/70 shadow-xl hover:border-teal-500 transition-all">
                {/* Card Header */}
                <div className={`bg-gradient-to-br ${s.color} p-6`}>
                  <div className="flex items-center justify-between">
                    <span className="font-display font-black text-white text-xs bg-black/30 backdrop-blur-sm px-3 py-1 rounded-full uppercase tracking-wider">
                      {s.type}
                    </span>
                    <span className="text-teal-200 text-xs font-semibold bg-white/15 px-2.5 py-0.5 rounded-full">{s.tag}</span>
                  </div>
                  <h3 className="font-display font-black text-white text-2xl mt-4 drop-shadow-sm">{s.code}</h3>
                  <p className="text-white text-xs mt-1 line-clamp-1 font-semibold">{s.name}</p>
                  <div className="text-white font-black text-3xl mt-2 drop-shadow-sm">{s.amount}</div>
                  <div className="text-white/80 text-xs mt-0.5">Maximum Support / Grant</div>
                </div>

                {/* Card Body */}
                <div className="p-5">
                  <div className="flex items-center justify-between mb-4">
                    <div className="text-xs text-slate-300 font-semibold">
                      Processing Time
                    </div>
                    <div className="flex items-center gap-1 text-xs font-bold text-slate-100 bg-slate-800 px-3 py-1.5 rounded-full border border-slate-700">
                      <Clock size={11} className="text-teal-400" />
                      {s.timeline}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 mb-5">
                    {s.features.map((f) => (
                      <div key={f} className="flex items-center gap-1.5 text-xs font-medium text-slate-100">
                        <CheckCircle size={12} className="text-teal-400 shrink-0" />
                        {f}
                      </div>
                    ))}
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => openConsultationModal(`${s.code} Scheme Leads`)}
                      className="btn-3d flex-1 text-center bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold py-2.5 rounded-lg transition-all cursor-pointer shadow-md shadow-teal-500/20"
                    >
                      Apply Now
                    </button>
                    <button
                      onClick={() => {
                        setSelectedScheme(s);
                        setFormStatus("idle");
                        setFormMsg("");
                      }}
                      className="flex-1 text-center border border-slate-600 text-slate-200 hover:text-white text-xs font-bold py-2.5 rounded-lg hover:bg-slate-800 transition-all flex items-center justify-center gap-1 cursor-pointer"
                    >
                      <span>Full Details</span> <ArrowRight size={12} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ====== FAQ SECTION ====== */}
      <section className="py-16 px-6 border-t border-slate-800/40">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <div className="eyebrow">Scheme Guidance</div>
            <h2 className="section-title text-white">Common <span className="highlight">Scheme Questions</span></h2>
            <p className="text-slate-200 mt-2 font-medium text-sm">Key information regarding subsidy percentages, collateral waivers, and sanction procedures.</p>
          </div>

          <div className="space-y-3">
            {schemeFaqs.map((f, idx) => (
              <div
                key={f.q}
                className={`glass-card-dark rounded-xl overflow-hidden transition-all duration-300 border border-slate-700/60 ${
                  openFaq === idx ? "ring-2 ring-teal-400" : ""
                }`}
              >
                <button
                  className="w-full text-left p-5 flex items-center justify-between gap-3 cursor-pointer"
                  onClick={() => setOpenFaq(openFaq === idx ? -1 : idx)}
                >
                  <span className="font-bold text-white text-sm sm:text-base">{f.q}</span>
                  <ChevronDown
                    size={18}
                    className={`shrink-0 text-teal-400 transition-transform duration-300 ${
                      openFaq === idx ? "rotate-180" : ""
                    }`}
                  />
                </button>
                <div
                  className={`overflow-hidden transition-all duration-300 ${
                    openFaq === idx ? "max-h-60 pb-5 px-5" : "max-h-0"
                  }`}
                >
                  <p className="text-slate-200 text-xs sm:text-sm font-medium leading-relaxed">{f.a}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ====== CTA ====== */}
      <section className="relative py-16 px-6 overflow-hidden border-t border-slate-800/40">
        <div className="relative z-10 max-w-3xl mx-auto text-center">
          <h2 className="font-display font-black text-white" style={{ fontSize: "clamp(24px, 4vw, 40px)" }}>
            Not Sure Which Scheme Fits Your Business?
          </h2>
          <p className="text-slate-100 mt-3 font-medium text-base max-w-xl mx-auto">
            Our MSME experts will evaluate your business profile and recommend the scheme with the highest approval chance — for free.
          </p>
          <div className="flex flex-wrap gap-3 justify-center mt-7">
            <Link to="/contact" className="btn-primary-3d">
              Get Free Scheme Assessment
            </Link>
            <a href="tel:+919899902568" className="btn-outline-white-3d">
              +91 98999 02568
            </a>
          </div>
        </div>
      </section>

      {/* ====== SCHEME DETAIL & APPLICATION MODAL ====== */}
      {selectedScheme && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fade-in"
          onClick={() => setSelectedScheme(null)}
        >
          <div
            className="relative w-full max-w-4xl max-h-[92vh] overflow-y-auto bg-slate-900 border border-slate-700 rounded-3xl shadow-2xl custom-scrollbar"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className={`bg-gradient-to-r ${selectedScheme.color} p-6 sm:p-8 relative`}>
              <button
                onClick={() => setSelectedScheme(null)}
                className="absolute top-5 right-5 p-2 rounded-full bg-black/25 hover:bg-black/50 text-white/80 hover:text-white transition cursor-pointer"
                title="Close"
              >
                <X size={20} />
              </button>

              <div className="flex flex-wrap items-center gap-2 mb-3">
                <span className="px-3 py-1 rounded-full bg-white/20 text-white text-xs font-bold uppercase tracking-wider">
                  {selectedScheme.type}
                </span>
                <span className="px-3 py-1 rounded-full bg-black/20 text-amber-300 text-xs font-bold">
                  ⚡ Subsidy: {selectedScheme.tag}
                </span>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center text-white shrink-0 shadow-lg">
                  <Landmark size={28} />
                </div>
                <div>
                  <h3 className="font-display font-black text-2xl sm:text-3xl text-white">
                    {selectedScheme.code}
                  </h3>
                  <p className="text-white/90 font-medium text-xs sm:text-sm mt-0.5">
                    {selectedScheme.name}
                  </p>
                  <div className="flex flex-wrap items-center gap-3 text-white/80 text-xs font-semibold mt-2">
                    <span>Max Assistance: {selectedScheme.amount}</span>
                    <span>•</span>
                    <span>Timeline: {selectedScheme.timeline}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Content: 2-Column Responsive Layout */}
            <div className="p-6 sm:p-8 grid lg:grid-cols-12 gap-8">
              
              {/* Left Column: Scheme Specifications */}
              <div className="lg:col-span-7 space-y-6">
                <div>
                  <h4 className="text-xs font-bold uppercase text-teal-400 tracking-wider mb-2 flex items-center gap-1.5">
                    <Layers size={14} /> Scheme Overview & Purpose
                  </h4>
                  <p className="text-slate-200 text-sm leading-relaxed bg-slate-800/50 p-4 rounded-xl border border-slate-700/60">
                    {selectedScheme.overview}
                  </p>
                </div>

                {/* Subsidy & Financial Structure */}
                <div>
                  <h4 className="text-xs font-bold uppercase text-teal-400 tracking-wider mb-3 flex items-center gap-1.5">
                    <Sparkles size={14} /> Subsidy & Financial Structure
                  </h4>
                  <div className="space-y-2 bg-slate-800/40 p-4 rounded-xl border border-slate-700/50">
                    {selectedScheme.subsidyDetails.map((sub, i) => (
                      <div key={i} className="flex items-start gap-2 text-xs text-slate-200">
                        <CheckCircle size={14} className="text-teal-400 shrink-0 mt-0.5" />
                        <span>{sub}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Eligibility Criteria */}
                <div>
                  <h4 className="text-xs font-bold uppercase text-teal-400 tracking-wider mb-3 flex items-center gap-1.5">
                    <CheckCircle2 size={14} /> Who Can Apply (Eligibility)
                  </h4>
                  <div className="space-y-2 bg-slate-800/40 p-4 rounded-xl border border-slate-700/50">
                    {selectedScheme.eligibility.map((el, i) => (
                      <div key={i} className="flex items-start gap-2 text-xs text-slate-200">
                        <span className="w-1.5 h-1.5 rounded-full bg-teal-400 mt-1.5 shrink-0" />
                        <span>{el}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Documents Checklist */}
                <div>
                  <h4 className="text-xs font-bold uppercase text-amber-400 tracking-wider mb-3 flex items-center gap-1.5">
                    <FileText size={14} /> Required Project Documents
                  </h4>
                  <div className="space-y-2 bg-slate-800/40 p-4 rounded-xl border border-slate-700/50">
                    {selectedScheme.documents.map((doc, i) => (
                      <div key={i} className="flex items-start gap-2 text-xs text-slate-200">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 shrink-0" />
                        <span>{doc}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Distributed In-Depth Knowledge Base Guide */}
                <div className="pt-2">
                  <div className="p-4 rounded-xl bg-slate-800/80 border border-slate-700 space-y-2.5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <BookOpen size={14} className="text-teal-400" />
                        <span className="text-xs font-bold text-white">
                          Official 2026 Scheme Guidelines & DPR Blueprint
                        </span>
                      </div>
                      <span className="text-[10px] font-bold text-teal-300 bg-teal-950 px-2 py-0.5 rounded border border-teal-500/40">
                        KVIC Empanelled
                      </span>
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      Our certified financial analysts prepare full bankable Detailed Project Reports (DPR), CMA data, and handle portal filing until margin money subsidy credit.
                    </p>
                  </div>
                </div>
              </div>

              {/* Right Column: Scheme Assessment & Application Form */}
              <div className="lg:col-span-5 bg-slate-800/80 border border-slate-700 rounded-2xl p-6 shadow-xl flex flex-col justify-between">
                <div>
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-500/15 border border-teal-500/30 text-teal-400 text-xs font-bold mb-3">
                    <Sparkles size={13} /> Official Scheme Application
                  </div>
                  <h4 className="font-display font-black text-xl text-white">
                    Apply for {selectedScheme.code}
                  </h4>
                  <p className="text-slate-300 text-xs mt-1 mb-5">
                    Submit your project parameters for our KVIC-empanelled team to draft your DPR and file your subsidy application.
                  </p>

                  {formStatus === "success" ? (
                    <div className="p-5 rounded-xl bg-emerald-950/50 border border-emerald-500/40 text-center space-y-3">
                      <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
                        <CheckCircle size={28} />
                      </div>
                      <p className="font-bold text-white text-sm">Assessment Request Received!</p>
                      <p className="text-xs text-emerald-200 leading-relaxed">{formMsg}</p>
                      <button
                        onClick={() => {
                          setFormStatus("idle");
                          setFormMsg("");
                        }}
                        className="mt-2 text-xs text-emerald-400 underline font-semibold"
                      >
                        Submit another application
                      </button>
                    </div>
                  ) : (
                    <form onSubmit={handleSchemeFormSubmit} className="space-y-3.5">
                      {formStatus === "error" && (
                        <div className="p-3 rounded-lg bg-red-950/60 border border-red-500/40 text-red-300 text-xs flex items-center gap-2">
                          <AlertCircle size={15} className="shrink-0" />
                          <span>{formMsg}</span>
                        </div>
                      )}

                      <div>
                        <label className="block text-xs font-semibold text-slate-300 mb-1">
                          Applicant Full Name *
                        </label>
                        <input
                          type="text"
                          required
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          placeholder="e.g. Anand Verma"
                          className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs placeholder:text-slate-500 focus:outline-none focus:border-teal-500 transition"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-300 mb-1">
                          Mobile Phone Number *
                        </label>
                        <input
                          type="tel"
                          required
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          placeholder="e.g. 9876543210"
                          className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs placeholder:text-slate-500 focus:outline-none focus:border-teal-500 transition"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-300 mb-1">
                          Email Address
                        </label>
                        <input
                          type="email"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          placeholder="e.g. anand@company.in"
                          className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs placeholder:text-slate-500 focus:outline-none focus:border-teal-500 transition"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-semibold text-slate-300 mb-1">
                            Project Cost (₹)
                          </label>
                          <input
                            type="text"
                            value={formData.projectCost}
                            onChange={(e) => setFormData({ ...formData, projectCost: e.target.value })}
                            placeholder="e.g. 25,00,000"
                            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs placeholder:text-slate-500 focus:outline-none focus:border-teal-500 transition"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-slate-300 mb-1">
                            State / Location
                          </label>
                          <input
                            type="text"
                            value={formData.state}
                            onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                            placeholder="e.g. Uttar Pradesh"
                            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs placeholder:text-slate-500 focus:outline-none focus:border-teal-500 transition"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-300 mb-1">
                          Business / Unit Sector
                        </label>
                        <select
                          value={formData.sector}
                          onChange={(e) => setFormData({ ...formData, sector: e.target.value })}
                          className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-teal-500 transition cursor-pointer"
                        >
                          <option value="Manufacturing Unit">Manufacturing & Engineering Unit</option>
                          <option value="Food Processing / Agro">Food Processing & Agro Enterprise</option>
                          <option value="Service Sector">Service Industry / Digital Center</option>
                          <option value="Trading / Retail">Trading & Retail Business</option>
                          <option value="Tech / Innovation Startup">Tech / DPIIT Startup</option>
                        </select>
                      </div>

                      <button
                        type="submit"
                        disabled={formStatus === "loading"}
                        className="w-full py-3 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold shadow-lg shadow-teal-500/25 transition cursor-pointer flex items-center justify-center gap-2 mt-2 disabled:opacity-50"
                      >
                        {formStatus === "loading" ? (
                          <>
                            <Loader2 size={15} className="animate-spin" />
                            <span>Submitting Application...</span>
                          </>
                        ) : (
                          <>
                            <span>Submit Scheme Assessment</span>
                            <ArrowRight size={15} />
                          </>
                        )}
                      </button>
                    </form>
                  )}
                </div>

                <div className="pt-4 mt-4 border-t border-slate-700/60 text-center">
                  <p className="text-[11px] text-slate-400">
                    🏛️ KVIC & MSME Empanelled Advisory · 98% Approval Success
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
