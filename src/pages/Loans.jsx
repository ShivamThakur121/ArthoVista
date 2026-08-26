import { useState, useEffect } from "react";
import {
  Briefcase, User, Home as HomeIcon, Building, GraduationCap, Cog,
  ChevronDown, PhoneCall, ArrowRight, CheckCircle, TrendingUp, Shield,
  X, Loader2, Sparkles, Clock, FileText, CheckCircle2, BookOpen, AlertCircle, Layers
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
    id: "business-loan",
    icon: Briefcase,
    title: "Business Loan",
    range: "₹1L - ₹50L+",
    detail: "15% - 24% p.a.",
    tenure: "1-5 years",
    color: "from-blue-600 to-indigo-800",
    overview: "Unsecured business loans designed for working capital, business expansion, inventory purchase, and equipment financing with zero collateral requirements.",
    eligibility: [
      "Business vintage: Minimum 1 to 2 years in continuous operations",
      "Annual turnover: Minimum ₹15 Lakhs to ₹40 Lakhs",
      "Applicant age: 21 to 65 years",
      "CIBIL score: 650+ preferred (options available for lower scores)"
    ],
    documents: [
      "PAN Card & Aadhaar Card of Promoters/Directors",
      "Business Registration Proof (GST, Udyam, Certificate of Incorporation)",
      "Bank statements for the last 12 months",
      "Income Tax Returns (ITR) & Audited financials for the last 2 years"
    ],
    features: ["Quick approval in 24-48 hrs", "Minimal documentation", "Collateral-free credit options", "Flexible tenure up to 5 years"],
    guideSlug: "business-loan-india",
  },
  {
    id: "personal-loan",
    icon: User,
    title: "Salaried Personal Loan",
    range: "₹50K - ₹40L+",
    detail: "10% - 24% p.a.",
    tenure: "1-5 years",
    color: "from-indigo-600 to-purple-800",
    overview: "Fast, hassle-free personal funding for salaried professionals to meet planned life milestones, medical emergencies, debt consolidation, or travel.",
    eligibility: [
      "Minimum monthly net salary: ₹20,000 to ₹35,000 (city dependent)",
      "Employment tenure: Minimum 6 months with current employer / 1 year total",
      "Applicant age: 21 to 58 years",
      "CIBIL score: 700+ for best interest rates"
    ],
    documents: [
      "PAN Card & Aadhaar Card",
      "Salary slips for the last 3 months",
      "Salary bank account statements for the last 6 months",
      "Current employment ID card & Form 16 / appointment letter"
    ],
    features: ["Instant approval & disbursal", "100% paperless digital process", "No collateral or security needed", "Competitive salary-tier rates"],
    guideSlug: "salaried-personal-loan-india",
  },
  {
    id: "home-loan",
    icon: HomeIcon,
    title: "Home Loan",
    range: "₹5L - ₹10Cr+",
    detail: "7.35% - 15.5% p.a.",
    tenure: "Up to 30 years",
    color: "from-emerald-600 to-teal-800",
    overview: "Affordable housing finance for purchase of ready-to-move properties, under-construction units, plot purchase + construction, and balance transfer with top-up.",
    eligibility: [
      "Salaried and Self-Employed individuals with regular source of income",
      "Age: 21 to 65 years at loan maturity",
      "CIBIL score: 720+ for tier-1 bank interest rates (from 8.40% p.a.)",
      "Co-applicant allowed to increase loan eligibility"
    ],
    documents: [
      "KYC (PAN, Aadhaar, Passport / Voter ID)",
      "Income proof (Last 3 months salary slips / 3 years ITR & Computation)",
      "Last 6 months bank statement",
      "Complete property chain papers, Approved building plan & Allotment letter"
    ],
    features: ["Low interest rates starting from 8.40% p.a.", "Extended tenure up to 30 years", "Tax deductions under Section 80C & 24(b)", "Attractive Top-Up loan facility"],
    guideSlug: "home-loan-india",
  },
  {
    id: "lap",
    icon: Building,
    title: "Loan Against Property",
    range: "50-75% of Value",
    detail: "9% - 15% p.a.",
    tenure: "Up to 20 years",
    color: "from-amber-600 to-amber-800",
    overview: "Unlock the highest financial leverage against your residential, commercial, or industrial property at substantially lower interest rates than unsecured loans.",
    eligibility: [
      "Clear marketable title of residential, commercial, or industrial property",
      "Salaried professionals, self-employed businessmen, MSMEs, and Corporates",
      "Repayment track record & verified cash flows",
      "Age: 25 to 70 years"
    ],
    documents: [
      "Title Deeds / Registered Sale Deed of the mortgaged property",
      "Encumbrance Certificate & Tax paid receipts",
      "3 years audited financial statements, ITR, and CMA report",
      "12 months primary banking statements"
    ],
    features: ["High ticket funding up to 75% market value", "Significantly lower interest rates", "Retain property ownership and usage", "Long repayment tenure up to 20 years"],
    guideSlug: "loan-against-property-india",
  },
  {
    id: "education-loan",
    icon: GraduationCap,
    title: "Education Loan",
    range: "Up to ₹50L+",
    detail: "9% - 15% p.a.",
    tenure: "Up to 15 years",
    color: "from-sky-600 to-blue-800",
    overview: "Comprehensive student financing for premier higher education in India and top universities abroad, covering tuition fees, living costs, and travel.",
    eligibility: [
      "Confirmed admission in recognized university/college in India or abroad",
      "Co-borrower (Parent/Guardian/Spouse) with stable income profile",
      "Collateral-free loans available up to ₹7.5 Lakh (and up to ₹50L for premier institutes)",
      "Merit-based underwriting"
    ],
    documents: [
      "Admission confirmation letter & fee structure breakdown",
      "Academic mark sheets (10th, 12th, Graduation, GRE/GMAT/IELTS)",
      "Co-applicant KYC, ITR for 2 years & 6 months bank statement",
      "Passport and Visa copy (for foreign studies)"
    ],
    features: ["Covers 100% course fees + living expenses", "Moratorium period (Course duration + 6-12 months)", "No collateral required up to ₹7.5 Lakh", "Income tax deduction on interest under Section 80E"],
    guideSlug: "education-loan-india",
  },
  {
    id: "machinery-loan",
    icon: Cog,
    title: "Machinery Loan",
    range: "₹1L - ₹5Cr+",
    detail: "8% - 18% p.a.",
    tenure: "Up to 7 years",
    color: "from-slate-600 to-slate-800",
    overview: "Asset-backed financing for industrial machinery, plant equipment, technological modernization, and commercial tools for manufacturing and service MSMEs.",
    eligibility: [
      "Manufacturing, engineering, food processing, or specialized service units",
      "Business operation for minimum 2 years with positive cash flow",
      "Machinery from reputable OEM suppliers/dealers",
      "Eligible for interest subvention & subsidy under central schemes"
    ],
    documents: [
      "Proforma Invoice / Quotation of machinery from manufacturer",
      "Business KYC & Udyam MSME Registration Certificate",
      "Last 2–3 years audited Balance Sheet & P&L with schedules",
      "Last 12 months active bank account statements"
    ],
    features: ["Primary collateral is the machinery itself", "Funding up to 80-90% of equipment cost", "Subsidized interest options for MSMEs", "Tenure up to 7 years matching asset life"],
    guideSlug: "machinery-loan-india",
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
    "Business & MSME Loans | ArthoVista",
    "Get hassle-free business loans, MSME financing, working capital, and term loans with competitive interest rates and direct assistance from ArthoVista."
  );
  const [openFaq, setOpenFaq] = useState(0);
  const [selectedLoan, setSelectedLoan] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    amount: "",
    city: "",
    // Business loan
    businessVintage: "1 to 3 Years",
    annualTurnover: "₹50L – ₹1 Crore",
    businessConstitution: "Private Limited",
    // Personal loan
    monthlySalary: "",
    companyName: "",
    salaryMode: "Direct Bank Transfer",
    existingEmi: "",
    // Home loan
    propertyStage: "Ready to Move Property",
    propertyCost: "",
    employmentType: "Salaried Professional",
    // LAP
    propertyCategory: "Residential Property",
    propertyMarketValue: "",
    propertyOwnership: "Self Owned",
    // Education loan
    studyDestination: "Abroad - USA / Canada",
    degreeLevel: "Masters / MBA / MS",
    coApplicantOccupation: "",
    admissionStatus: "Confirmed Offer Letter Received",
    // Machinery loan
    machineryDescription: "",
    machineryQuotation: "",
    procurementType: "Domestic / Indigenous OEM Purchase",
    factoryLocation: ""
  });
  const [formStatus, setFormStatus] = useState("idle"); // idle | loading | success | error
  const [formMsg, setFormMsg] = useState("");

  const { openConsultationModal } = useConsultation();

  const handleApplyClick = (loan) => {
    setSelectedLoan(loan);
    setFormStatus("idle");
    setFormMsg("");
  };

  const handleLoanFormSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.phone) {
      setFormStatus("error");
      setFormMsg("Please enter your full name and phone number.");
      return;
    }
    setFormStatus("loading");

    let specificParams = "";
    if (selectedLoan?.id === "business-loan") {
      specificParams = `Vintage: ${formData.businessVintage}, Turnover: ${formData.annualTurnover}, Entity: ${formData.businessConstitution}`;
    } else if (selectedLoan?.id === "personal-loan") {
      specificParams = `Monthly Salary: ₹${formData.monthlySalary || "N/A"}, Employer: ${formData.companyName || "N/A"}, Salary Mode: ${formData.salaryMode}, Existing EMIs: ₹${formData.existingEmi || "0"}`;
    } else if (selectedLoan?.id === "home-loan") {
      specificParams = `Property Stage: ${formData.propertyStage}, Est. Property Cost: ₹${formData.propertyCost || "N/A"}, Income Source: ${formData.employmentType}`;
    } else if (selectedLoan?.id === "lap") {
      specificParams = `Property Type: ${formData.propertyCategory}, Market Value: ₹${formData.propertyMarketValue || "N/A"}, Ownership: ${formData.propertyOwnership}`;
    } else if (selectedLoan?.id === "education-loan") {
      specificParams = `Destination: ${formData.studyDestination}, Degree: ${formData.degreeLevel}, Co-Applicant: ${formData.coApplicantOccupation || "N/A"}, Admission: ${formData.admissionStatus}`;
    } else if (selectedLoan?.id === "machinery-loan") {
      specificParams = `Machinery: ${formData.machineryDescription || "N/A"}, Quotation Value: ₹${formData.machineryQuotation || "N/A"}, Procurement: ${formData.procurementType}, Plant Location: ${formData.factoryLocation || formData.city || "N/A"}`;
    }

    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          phone: formData.phone,
          email: formData.email || "loans-applicant@arthovista.in",
          service: selectedLoan ? `${selectedLoan.title} Leads` : "Business & MSME Loan Leads",
          message: `Required Amount: ₹${formData.amount || "Not specified"}, City/State: ${formData.city || "Not specified"}, [${specificParams}]`,
          source: `individual-loan-form-${selectedLoan?.id || "general"}`,
        }),
      });
      if (res.ok) {
        setFormStatus("success");
        setFormMsg(`Your application for ${selectedLoan?.title} has been received! Our specialized loan desk will verify your profile and contact you within 24 hours.`);
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
              onClick={() => openConsultationModal("Business & MSME Loan Leads")}
              className="btn-3d inline-flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white font-bold text-sm px-6 py-3 rounded-xl cursor-pointer"
            >
              Check Loan Eligibility <ArrowRight size={15} />
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

      {/* ====== LOAN CARDS ====== */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <div className="eyebrow">All Products</div>
            <h2 className="section-title text-white">
              Choose Your <span className="highlight">Loan Type</span>
            </h2>
            <p className="text-slate-100 mt-3 font-medium text-base max-w-xl mx-auto">
              We partner with India's top banks and NBFCs to get you the best rates and quickest approvals.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {loans.map((l) => (
              <div key={l.title} className="tilt-3d rounded-2xl overflow-hidden bg-slate-900/80 border border-slate-700/70 shadow-xl hover:border-teal-500 transition-all">
                <div className="loan-card-inner">
                  {/* Header */}
                  <div className={`bg-gradient-to-br ${l.color} p-6`}>
                    <div className="flex items-center justify-between">
                      <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center shadow-sm">
                        <l.icon size={22} className="text-white" />
                      </div>
                      <div className="text-right">
                        <div className="text-white text-xs font-semibold">Interest</div>
                        <div className="text-white font-bold text-sm bg-white/15 px-2.5 py-0.5 rounded-full mt-0.5">{l.detail}</div>
                      </div>
                    </div>
                    <h3 className="font-display font-black text-white text-xl mt-4 drop-shadow-sm">{l.title}</h3>
                    <div className="text-white font-black text-2xl mt-1 drop-shadow-sm">{l.range}</div>
                    <div className="text-white font-medium text-xs mt-1">Tenure: {l.tenure}</div>
                  </div>

                  {/* Body */}
                  <div className="p-5">
                    <div className="grid grid-cols-2 gap-2 mb-5">
                      {l.features.map((f) => (
                        <div key={f} className="flex items-center gap-1.5 text-xs font-medium text-slate-100">
                          <CheckCircle size={12} className="text-teal-400 shrink-0" />
                          {f}
                        </div>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleApplyClick(l)}
                        className="btn-3d flex-1 text-center bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs py-2.5 rounded-lg transition-all cursor-pointer shadow-md shadow-teal-500/20"
                      >
                        Apply Now
                      </button>
                      <button
                        onClick={() => handleApplyClick(l)}
                        className="flex-1 text-center border border-slate-600 text-slate-200 hover:text-white text-xs font-bold py-2.5 rounded-lg hover:bg-slate-800 transition-all flex items-center justify-center gap-1 cursor-pointer"
                      >
                        <span>Full Details</span> <ArrowRight size={12} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ====== 5 STEPS ====== */}
      <section className="py-16 px-6 border-t border-slate-800/40">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <div className="eyebrow">Simple Process</div>
            <h2 className="section-title text-white">Your Loan in <span className="highlight">5 Simple Steps</span></h2>
          </div>

          <div className="grid sm:grid-cols-5 gap-4">
            {steps.map((s, i) => (
              <div key={s.num} className="relative text-center bg-slate-900/80 p-5 rounded-2xl border border-slate-700">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-orange-500 to-orange-700 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-orange-500/20">
                  <span className="font-display font-black text-white text-lg">{s.num}</span>
                </div>
                <p className="font-bold text-white text-sm">{s.t}</p>
                <p className="text-xs font-medium text-slate-200 mt-1.5 leading-relaxed">{s.d}</p>
                {i < 4 && (
                  <div className="hidden sm:block absolute top-7 left-[70%] w-[60%] h-0.5 bg-gradient-to-r from-orange-500/40 to-slate-700/40" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ====== BANKING PARTNERS ====== */}
      <section className="py-16 px-6 border-t border-b border-slate-800/40">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-10">
            <div className="eyebrow">Trusted Partners</div>
            <h2 className="section-title text-white">Our Banking <span className="highlight">Partners</span></h2>
            <p className="text-slate-100 text-sm mt-2 font-medium">We work with India's most trusted public and private sector lending institutions.</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4 items-center">
            {banks.map((b) => (
              <div key={b.name} className="bg-slate-900/80 border border-slate-700/60 rounded-xl p-3 flex flex-col items-center justify-center h-20 hover:border-teal-500 transition-all shadow-sm">
                <img src={b.logo} alt={b.name} className="h-8 object-contain filter brightness-95 contrast-125" />
                <span className="text-[10px] font-semibold text-slate-300 mt-1.5 text-center leading-tight truncate w-full">{b.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ====== FAQ SECTION ====== */}
      <section className="py-16 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <div className="eyebrow">FAQ</div>
            <h2 className="section-title text-white">Common <span className="highlight">Loan Questions</span></h2>
          </div>

          <div className="space-y-3">
            {faqs.map((f, idx) => (
              <div
                key={f.q}
                className={`glass-card-dark rounded-xl overflow-hidden transition-all duration-300 border border-slate-700/60 ${
                  openFaq === idx ? "ring-2 ring-teal-400" : ""
                }`}
              >
                <button
                  className="w-full text-left p-5 flex items-center justify-between gap-3"
                  onClick={() => setOpenFaq(openFaq === idx ? -1 : idx)}
                >
                  <span className="font-bold text-white text-sm">{f.q}</span>
                  <ChevronDown
                    size={18}
                    className={`shrink-0 text-teal-400 transition-transform duration-300 ${
                      openFaq === idx ? "rotate-180" : ""
                    }`}
                  />
                </button>
                <div
                  className={`overflow-hidden transition-all duration-300 ${
                    openFaq === idx ? "max-h-40 pb-5 px-5" : "max-h-0"
                  }`}
                >
                  <p className="text-slate-100 text-sm font-medium leading-relaxed">{f.a}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ====== BOTTOM CTA ====== */}
      <section className="py-16 px-6 border-t border-slate-800/40">
        <div className="max-w-3xl mx-auto text-center">
          <div className="eyebrow">Expert Guidance</div>
          <h2
            className="font-display font-black text-white mt-2 drop-shadow-md"
            style={{ fontSize: "clamp(24px, 4vw, 40px)" }}
          >
            Not Sure Which Loan <span className="gradient-text">Suits You Best?</span>
          </h2>
          <p className="text-slate-100 mt-3 max-w-lg mx-auto text-base font-medium leading-relaxed">
            Our loan experts will evaluate your profile and recommend the best product with the highest approval chance — completely free.
          </p>
          <div className="flex flex-wrap gap-3 justify-center mt-8">
            <button 
              onClick={() => openConsultationModal("Business & MSME Loan Leads")}
              className="btn-primary-3d"
            >
              Get Free Loan Assessment <ArrowRight size={15} />
            </button>
            <a href="tel:+919899902568" className="btn-outline-white-3d">
              <PhoneCall size={15} /> +91 98999 02568
            </a>
          </div>
          <p className="text-slate-300 font-semibold text-xs mt-5">400+ businesses funded · No hidden fees</p>
        </div>
      </section>

      {/* ====== DEDICATED INDIVIDUAL LOAN MODAL & CUSTOM FORM ====== */}
      {selectedLoan && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fade-in"
          onClick={() => setSelectedLoan(null)}
        >
          <div
            className="relative w-full max-w-5xl max-h-[92vh] overflow-y-auto bg-slate-900 border border-slate-700 rounded-3xl shadow-2xl custom-scrollbar"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className={`bg-gradient-to-r ${selectedLoan.color} p-6 sm:p-8 relative`}>
              <button
                onClick={() => setSelectedLoan(null)}
                className="absolute top-5 right-5 p-2 rounded-full bg-black/25 hover:bg-black/50 text-white/80 hover:text-white transition cursor-pointer"
                title="Close"
              >
                <X size={20} />
              </button>

              <div className="flex flex-wrap items-center gap-2 mb-3">
                <span className="px-3 py-1 rounded-full bg-white/20 text-white text-xs font-bold uppercase tracking-wider">
                  Dedicated Application Form
                </span>
                <span className="px-3 py-1 rounded-full bg-black/20 text-amber-300 text-xs font-bold">
                  ⚡ Disbursal in 24–72 Hrs
                </span>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center text-white shrink-0 shadow-lg">
                  <selectedLoan.icon size={28} />
                </div>
                <div>
                  <h3 className="font-display font-black text-2xl sm:text-3xl text-white">
                    {selectedLoan.title}
                  </h3>
                  <div className="flex flex-wrap items-center gap-3 text-white/90 text-xs sm:text-sm font-semibold mt-1">
                    <span>Limit: {selectedLoan.range}</span>
                    <span>•</span>
                    <span>Rate: {selectedLoan.detail}</span>
                    <span>•</span>
                    <span>Tenure: {selectedLoan.tenure}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Content: 2-Column Responsive Layout */}
            <div className="p-6 sm:p-8 grid lg:grid-cols-12 gap-8">
              
              {/* Left Column: Loan Specifications */}
              <div className="lg:col-span-6 space-y-6">
                <div>
                  <h4 className="text-xs font-bold uppercase text-teal-400 tracking-wider mb-2 flex items-center gap-1.5">
                    <Layers size={14} /> Product Overview
                  </h4>
                  <p className="text-slate-200 text-sm leading-relaxed bg-slate-800/50 p-4 rounded-xl border border-slate-700/60">
                    {selectedLoan.overview}
                  </p>
                </div>

                {/* Eligibility Criteria */}
                <div>
                  <h4 className="text-xs font-bold uppercase text-teal-400 tracking-wider mb-3 flex items-center gap-1.5">
                    <CheckCircle2 size={14} /> Eligibility Criteria
                  </h4>
                  <div className="space-y-2 bg-slate-800/40 p-4 rounded-xl border border-slate-700/50">
                    {selectedLoan.eligibility.map((el, i) => (
                      <div key={i} className="flex items-start gap-2 text-xs text-slate-200">
                        <CheckCircle size={14} className="text-teal-400 shrink-0 mt-0.5" />
                        <span>{el}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Documents Checklist */}
                <div>
                  <h4 className="text-xs font-bold uppercase text-amber-400 tracking-wider mb-3 flex items-center gap-1.5">
                    <FileText size={14} /> Mandatory Documents Checklist
                  </h4>
                  <div className="space-y-2 bg-slate-800/40 p-4 rounded-xl border border-slate-700/50">
                    {selectedLoan.documents.map((doc, i) => (
                      <div key={i} className="flex items-start gap-2 text-xs text-slate-200">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 shrink-0" />
                        <span>{doc}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Column: TAILORED INDIVIDUAL LOAN FORM */}
              <div className="lg:col-span-6 bg-slate-800/80 border border-slate-700 rounded-2xl p-6 shadow-xl flex flex-col justify-between">
                <div>
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-500/15 border border-teal-500/30 text-teal-400 text-xs font-bold mb-3">
                    <Sparkles size={13} /> {selectedLoan.title} Specific Form
                  </div>
                  <h4 className="font-display font-black text-xl text-white">
                    Apply for {selectedLoan.title}
                  </h4>
                  <p className="text-slate-300 text-xs mt-1 mb-5">
                    Fill in your {selectedLoan.title.toLowerCase()} requirements for instant bank quotation and eligibility sanction.
                  </p>

                  {formStatus === "success" ? (
                    <div className="p-5 rounded-xl bg-emerald-950/50 border border-emerald-500/40 text-center space-y-3">
                      <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
                        <CheckCircle size={28} />
                      </div>
                      <p className="font-bold text-white text-sm">Application Received!</p>
                      <p className="text-xs text-emerald-200 leading-relaxed">{formMsg}</p>
                      <button
                        onClick={() => {
                          setFormStatus("idle");
                          setFormMsg("");
                        }}
                        className="mt-2 text-xs text-emerald-400 underline font-semibold cursor-pointer"
                      >
                        Submit another enquiry
                      </button>
                    </div>
                  ) : (
                    <form onSubmit={handleLoanFormSubmit} className="space-y-3.5">
                      {formStatus === "error" && (
                        <div className="p-3 rounded-lg bg-red-950/60 border border-red-500/40 text-red-300 text-xs flex items-center gap-2">
                          <AlertCircle size={15} className="shrink-0" />
                          <span>{formMsg}</span>
                        </div>
                      )}

                      {/* Common Basic Fields */}
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

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-semibold text-slate-300 mb-1">
                            Mobile Number *
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
                            placeholder="e.g. anand@domain.com"
                            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs placeholder:text-slate-500 focus:outline-none focus:border-teal-500 transition"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-semibold text-slate-300 mb-1">
                            Required Loan Amount (₹) *
                          </label>
                          <input
                            type="text"
                            required
                            value={formData.amount}
                            onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                            placeholder="e.g. 25,00,000"
                            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs placeholder:text-slate-500 focus:outline-none focus:border-teal-500 transition"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-slate-300 mb-1">
                            City / Location *
                          </label>
                          <input
                            type="text"
                            required
                            value={formData.city}
                            onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                            placeholder="e.g. Noida, Delhi NCR"
                            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs placeholder:text-slate-500 focus:outline-none focus:border-teal-500 transition"
                          />
                        </div>
                      </div>

                      {/* 1. INDIVIDUAL FORM: BUSINESS LOAN */}
                      {selectedLoan.id === "business-loan" && (
                        <div className="space-y-3 pt-1 border-t border-slate-700/60">
                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <label className="block text-xs font-semibold text-slate-300 mb-1">
                                Business Vintage
                              </label>
                              <select
                                value={formData.businessVintage}
                                onChange={(e) => setFormData({ ...formData, businessVintage: e.target.value })}
                                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-teal-500"
                              >
                                <option value="1 to 3 Years">1 to 3 Years</option>
                                <option value="3 to 5 Years">3 to 5 Years</option>
                                <option value="5+ Years">5+ Years</option>
                                <option value="Less than 1 Year">Less than 1 Year</option>
                              </select>
                            </div>
                            <div>
                              <label className="block text-xs font-semibold text-slate-300 mb-1">
                                Annual Turnover
                              </label>
                              <select
                                value={formData.annualTurnover}
                                onChange={(e) => setFormData({ ...formData, annualTurnover: e.target.value })}
                                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-teal-500"
                              >
                                <option value="₹20L – ₹50L">₹20L – ₹50 Lakh</option>
                                <option value="₹50L – ₹1 Crore">₹50L – ₹1 Crore</option>
                                <option value="₹1Cr – ₹5 Crore">₹1Cr – ₹5 Crore</option>
                                <option value="₹5 Crore+">₹5 Crore+</option>
                              </select>
                            </div>
                          </div>
                          <div>
                            <label className="block text-xs font-semibold text-slate-300 mb-1">
                              Business Legal Constitution
                            </label>
                            <select
                              value={formData.businessConstitution}
                              onChange={(e) => setFormData({ ...formData, businessConstitution: e.target.value })}
                              className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-teal-500"
                            >
                              <option value="Proprietorship">Sole Proprietorship</option>
                              <option value="Private Limited">Private Limited Company</option>
                              <option value="LLP">Limited Liability Partnership (LLP)</option>
                              <option value="Partnership">Partnership Firm</option>
                            </select>
                          </div>
                        </div>
                      )}

                      {/* 2. INDIVIDUAL FORM: SALARIED PERSONAL LOAN */}
                      {selectedLoan.id === "personal-loan" && (
                        <div className="space-y-3 pt-1 border-t border-slate-700/60">
                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <label className="block text-xs font-semibold text-slate-300 mb-1">
                                Monthly Net Salary (₹) *
                              </label>
                              <input
                                type="text"
                                value={formData.monthlySalary}
                                onChange={(e) => setFormData({ ...formData, monthlySalary: e.target.value })}
                                placeholder="e.g. ₹55,000"
                                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs placeholder:text-slate-500 focus:outline-none focus:border-teal-500"
                              />
                            </div>
                            <div>
                              <label className="block text-xs font-semibold text-slate-300 mb-1">
                                Employer / Company
                              </label>
                              <input
                                type="text"
                                value={formData.companyName}
                                onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                                placeholder="e.g. TCS, HCL, Govt/PSU"
                                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs placeholder:text-slate-500 focus:outline-none focus:border-teal-500"
                              />
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <label className="block text-xs font-semibold text-slate-300 mb-1">
                                Salary Credit Mode
                              </label>
                              <select
                                value={formData.salaryMode}
                                onChange={(e) => setFormData({ ...formData, salaryMode: e.target.value })}
                                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-teal-500"
                              >
                                <option value="Direct Bank Transfer">Direct Bank Transfer</option>
                                <option value="Company Cheque">Company Cheque</option>
                              </select>
                            </div>
                            <div>
                              <label className="block text-xs font-semibold text-slate-300 mb-1">
                                Existing Monthly EMIs (₹)
                              </label>
                              <input
                                type="text"
                                value={formData.existingEmi}
                                onChange={(e) => setFormData({ ...formData, existingEmi: e.target.value })}
                                placeholder="e.g. ₹8,000 or Nil"
                                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs placeholder:text-slate-500 focus:outline-none focus:border-teal-500"
                              />
                            </div>
                          </div>
                        </div>
                      )}

                      {/* 3. INDIVIDUAL FORM: HOME LOAN */}
                      {selectedLoan.id === "home-loan" && (
                        <div className="space-y-3 pt-1 border-t border-slate-700/60">
                          <div>
                            <label className="block text-xs font-semibold text-slate-300 mb-1">
                              Property Purchase Status
                            </label>
                            <select
                              value={formData.propertyStage}
                              onChange={(e) => setFormData({ ...formData, propertyStage: e.target.value })}
                              className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-teal-500"
                            >
                              <option value="Ready to Move Property">Ready to Move House / Flat</option>
                              <option value="Under Construction">Under Construction Project</option>
                              <option value="Resale Property">Resale Residential Property</option>
                              <option value="Plot + Construction">Plot Purchase + Self Construction</option>
                              <option value="Balance Transfer">Home Loan Balance Transfer + Top-Up</option>
                            </select>
                          </div>
                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <label className="block text-xs font-semibold text-slate-300 mb-1">
                                Estimated Property Value (₹)
                              </label>
                              <input
                                type="text"
                                value={formData.propertyCost}
                                onChange={(e) => setFormData({ ...formData, propertyCost: e.target.value })}
                                placeholder="e.g. ₹80 Lakh"
                                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs placeholder:text-slate-500 focus:outline-none focus:border-teal-500"
                              />
                            </div>
                            <div>
                              <label className="block text-xs font-semibold text-slate-300 mb-1">
                                Income Profile
                              </label>
                              <select
                                value={formData.employmentType}
                                onChange={(e) => setFormData({ ...formData, employmentType: e.target.value })}
                                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-teal-500"
                              >
                                <option value="Salaried Professional">Salaried Professional</option>
                                <option value="Self Employed Business">Business Owner / MSME</option>
                                <option value="Self Employed Professional">Doctor / CA / Lawyer</option>
                              </select>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* 4. INDIVIDUAL FORM: LOAN AGAINST PROPERTY (LAP) */}
                      {selectedLoan.id === "lap" && (
                        <div className="space-y-3 pt-1 border-t border-slate-700/60">
                          <div>
                            <label className="block text-xs font-semibold text-slate-300 mb-1">
                              Property Type to Mortgage
                            </label>
                            <select
                              value={formData.propertyCategory}
                              onChange={(e) => setFormData({ ...formData, propertyCategory: e.target.value })}
                              className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-teal-500"
                            >
                              <option value="Residential Property">Residential House / Villa / Flat</option>
                              <option value="Commercial Property">Commercial Office / Retail Shop</option>
                              <option value="Industrial Property">Industrial Shed / Factory Land</option>
                            </select>
                          </div>
                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <label className="block text-xs font-semibold text-slate-300 mb-1">
                                Estimated Market Value (₹)
                              </label>
                              <input
                                type="text"
                                value={formData.propertyMarketValue}
                                onChange={(e) => setFormData({ ...formData, propertyMarketValue: e.target.value })}
                                placeholder="e.g. ₹2.5 Crore"
                                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs placeholder:text-slate-500 focus:outline-none focus:border-teal-500"
                              />
                            </div>
                            <div>
                              <label className="block text-xs font-semibold text-slate-300 mb-1">
                                Property Ownership
                              </label>
                              <select
                                value={formData.propertyOwnership}
                                onChange={(e) => setFormData({ ...formData, propertyOwnership: e.target.value })}
                                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-teal-500"
                              >
                                <option value="Self Owned">Single / Self Owned</option>
                                <option value="Joint Family">Joint / Co-Owned with Family</option>
                                <option value="Company Owned">Company / Firm Owned</option>
                              </select>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* 5. INDIVIDUAL FORM: EDUCATION LOAN */}
                      {selectedLoan.id === "education-loan" && (
                        <div className="space-y-3 pt-1 border-t border-slate-700/60">
                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <label className="block text-xs font-semibold text-slate-300 mb-1">
                                Study Destination
                              </label>
                              <select
                                value={formData.studyDestination}
                                onChange={(e) => setFormData({ ...formData, studyDestination: e.target.value })}
                                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-teal-500"
                              >
                                <option value="Abroad - USA / Canada">USA / Canada</option>
                                <option value="Abroad - UK / Europe">UK / Europe / Germany</option>
                                <option value="Abroad - Australia / NZ">Australia / New Zealand</option>
                                <option value="India - IIT/IIM/Premier">Premier Indian Institute (IIT/IIM)</option>
                                <option value="India - Other University">Other Indian University</option>
                              </select>
                            </div>
                            <div>
                              <label className="block text-xs font-semibold text-slate-300 mb-1">
                                Degree Level
                              </label>
                              <select
                                value={formData.degreeLevel}
                                onChange={(e) => setFormData({ ...formData, degreeLevel: e.target.value })}
                                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-teal-500"
                              >
                                <option value="Masters / MBA / MS">Masters / MBA / MS</option>
                                <option value="Undergraduate / Bachelors">Undergraduate / Bachelors</option>
                                <option value="Doctoral / PhD">PhD / Fellowship</option>
                              </select>
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <label className="block text-xs font-semibold text-slate-300 mb-1">
                                Co-Applicant Occupation
                              </label>
                              <input
                                type="text"
                                value={formData.coApplicantOccupation}
                                onChange={(e) => setFormData({ ...formData, coApplicantOccupation: e.target.value })}
                                placeholder="e.g. Salaried / Business"
                                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs placeholder:text-slate-500 focus:outline-none focus:border-teal-500"
                              />
                            </div>
                            <div>
                              <label className="block text-xs font-semibold text-slate-300 mb-1">
                                Admission Status
                              </label>
                              <select
                                value={formData.admissionStatus}
                                onChange={(e) => setFormData({ ...formData, admissionStatus: e.target.value })}
                                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-teal-500"
                              >
                                <option value="Confirmed Offer Letter Received">Offer Letter Received</option>
                                <option value="Applied / Awaiting Decision">Applied / Awaiting Result</option>
                                <option value="GRE/GMAT Cleared">GRE/GMAT/IELTS Cleared</option>
                              </select>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* 6. INDIVIDUAL FORM: MACHINERY LOAN */}
                      {selectedLoan.id === "machinery-loan" && (
                        <div className="space-y-3 pt-1 border-t border-slate-700/60">
                          <div>
                            <label className="block text-xs font-semibold text-slate-300 mb-1">
                              Machinery Type / Description
                            </label>
                            <input
                              type="text"
                              value={formData.machineryDescription}
                              onChange={(e) => setFormData({ ...formData, machineryDescription: e.target.value })}
                              placeholder="e.g. 5-Axis CNC Machine, Food Packaging Line"
                              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs placeholder:text-slate-500 focus:outline-none focus:border-teal-500"
                            />
                          </div>
                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <label className="block text-xs font-semibold text-slate-300 mb-1">
                                Quotation / Invoice Value (₹)
                              </label>
                              <input
                                type="text"
                                value={formData.machineryQuotation}
                                onChange={(e) => setFormData({ ...formData, machineryQuotation: e.target.value })}
                                placeholder="e.g. ₹45,00,000"
                                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs placeholder:text-slate-500 focus:outline-none focus:border-teal-500"
                              />
                            </div>
                            <div>
                              <label className="block text-xs font-semibold text-slate-300 mb-1">
                                Procurement Channel
                              </label>
                              <select
                                value={formData.procurementType}
                                onChange={(e) => setFormData({ ...formData, procurementType: e.target.value })}
                                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-teal-500"
                              >
                                <option value="Domestic / Indigenous OEM Purchase">Domestic OEM Manufacturer</option>
                                <option value="Direct Import Machinery">Direct Import Machinery</option>
                                <option value="Refurbished Certified Machine">Certified Refurbished</option>
                              </select>
                            </div>
                          </div>
                        </div>
                      )}

                      <button
                        type="submit"
                        disabled={formStatus === "loading"}
                        className="w-full py-3 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold shadow-lg shadow-teal-500/25 transition cursor-pointer flex items-center justify-center gap-2 mt-4 disabled:opacity-50"
                      >
                        {formStatus === "loading" ? (
                          <>
                            <Loader2 size={15} className="animate-spin" />
                            <span>Submitting {selectedLoan.title} Application...</span>
                          </>
                        ) : (
                          <>
                            <span>Submit {selectedLoan.title} Application</span>
                            <ArrowRight size={15} />
                          </>
                        )}
                      </button>
                    </form>
                  )}
                </div>

                <div className="pt-4 mt-4 border-t border-slate-700/60 text-center">
                  <p className="text-[11px] text-slate-400">
                    🔒 100% Confidential · Free Assessment · Zero Advance Fees
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