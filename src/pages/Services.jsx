import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import useDocumentMetadata from "../hooks/useDocumentMetadata";
import { useConsultation } from "../context/ConsultationContext";
import {
  Building2, ShieldCheck, HandCoins, Banknote, Laptop2,
  ClipboardCheck, Scale, ArrowRight, PhoneCall, CheckCircle,
  X, Loader2, Sparkles, Clock, FileText, BookOpen, Layers, CheckCircle2, ChevronDown, MapPin, TrendingUp, Landmark
} from "lucide-react";
import { blogPosts } from "../data/blogData";

const API_URL = "/api/contact";

const serviceFaqs = [
  {
    q: "How long does it take to register a Private Limited Company or LLP in India?",
    a: "Private Limited Company and LLP incorporations typically take 3 to 7 business days once DSC, SPICe+ forms, and name approvals are completed through the Ministry of Corporate Affairs (MCA). We provide expedited processing with zero branch visits required."
  },
  {
    q: "What is the difference between MSME Udyam Registration and Startup India DPIIT Recognition?",
    a: "Udyam Registration is statutory for all micro, small, and medium businesses to access priority bank lending, collateral-free credit, and government subsidies. DPIIT Recognition is specifically for innovative startups, granting access to 3-year tax holidays (Section 80-IAC), seed funding grants up to ₹50 Lakh, and fast-track patent processing."
  },
  {
    q: "Which ISO and quality certifications are essential for manufacturing and service businesses?",
    a: "ISO 9001:2015 (Quality Management System) is recommended for all businesses to bid for corporate and government tenders. For food units, FSSAI, ISO 22000, and HACCP are mandatory. For IT/Software firms, ISO 27001 (Information Security) is essential."
  },
  {
    q: "Are your consulting and government compliance fees transparent with no hidden charges?",
    a: "Yes, 100%. We provide an itemized upfront quotation clearly distinguishing government statutory portal fees from our professional consultation charges. There are zero hidden costs or surprise surcharges."
  },
  {
    q: "Can ArthoVista manage monthly GST returns, ROC annual filings, and accounting on a retainer model?",
    a: "Yes. We offer dedicated annual and monthly corporate compliance retainers covering GST return filing, TDS reconciliation, monthly payroll, secretarial board resolutions, statutory audits, and ROC filing with dedicated account managers."
  },
];

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
    longDesc: "Turnkey company incorporation with MCA SPICe+ filing, digital signatures (DSC), Director Identification Numbers (DIN), name approval (RUN), PAN/TAN allotment, and post-incorporation statutory bank account opening.",
    color: "from-blue-600 to-indigo-800",
    timeline: "5–10 Business Days",
    documents: [
      "PAN Card and Aadhaar Card of all Directors/Partners",
      "Passport size photos and specimen signatures",
      "Proof of Registered Office Address (Electricity bill / Rent agreement + NOC)",
      "Bank Statement / Utility Bill (less than 2 months old)"
    ],
    deliverables: [
      "Certificate of Incorporation (COI)",
      "Company PAN and TAN Numbers",
      "Drafted Memorandum (MOA) and Articles of Association (AOA)",
      "Class-3 Digital Signature Certificates (DSC) for Directors",
      "EPFO and ESIC Registration Allotment"
    ],
    guideSlug: "private-limited-company-registration",
    items: [
      { t: "Private Limited Company", d: "Most popular startup structure under Companies Act 2013. Ideal for scale, funding & investors.", guideSlug: "private-limited-company-registration" },
      { t: "One Person Company", d: "Sole proprietor gets corporate benefits — limited liability and legal recognition, with a single founder.", guideSlug: "opc-registration-india" },
      { t: "LLP Registration", d: "Combines partnership flexibility with limited liability. Lower compliance burden than a company.", guideSlug: "llp-registration-india" },
      { t: "Section 8 / NGO", d: "Non-profit structure for social, educational or charitable causes. Eligible for NGO/CSR grants and funding.", guideSlug: "section-8-company-registration" },
    ],
  },
  {
    num: "02", id: "certifications", icon: ShieldCheck,
    title: "Certifications",
    desc: "Get certified with ISO, FSSAI, GeM, GST, Udyam, NSIC and more.",
    longDesc: "End-to-end statutory and quality certification management — from gap analysis and audit preparation to official government liaison and certificate issuance across central and international bodies.",
    color: "from-yellow-600 to-purple-800",
    timeline: "3–15 Business Days (depending on standard)",
    documents: [
      "Business Registration Certificate / Udyam Certificate",
      "Premises Proof & Layout Plan (for FSSAI / ISO)",
      "List of Machinery, Equipment & Key Personnel",
      "Bank Account statement & GST Certificate"
    ],
    deliverables: [
      "Official Accredited ISO Certificate (9001/14001/27001/22000)",
      "FSSAI License / Registration with QR verification",
      "GeM Seller Account setup & brand authorization",
      "Udyam MSME Certificate with priority lending tag"
    ],
    guideSlug: "iso-certification-india",
    items: [
      { t: "ISO Certification", d: "Boosts your business credibility with quality internationally recognised standards for goods and services.", guideSlug: "iso-certification-india" },
      { t: "FSSAI License", d: "Mandatory for all food businesses — manufacturing, transporting, or distributing food products (2026 revised rules).", guideSlug: "fssai-license-india" },
      { t: "GeM / Import-Export", d: "Get onboarded on the Government e-Marketplace to sell products and services to government buyers.", guideSlug: "iso-certification-india" },
      { t: "Udyam Registration", d: "Official MSME registration for benefits like subsidies, priority lending, and government schemes.", guideSlug: "pmegp-loan-scheme" },
      { t: "Startup India", d: "Government's flagship startup initiative offering regulatory, tax relaxations, and access to funding.", guideSlug: "venture-capital-fund-india" },
    ],
  },
  {
    num: "03", id: "grants", icon: HandCoins,
    title: "Grants & Funding",
    desc: "Access government grants, seed funding, and schemes like PMEGP, CGTMSE, Mudra, Stand-Up India.",
    longDesc: "Dedicated facilitation for government-backed subsidy schemes. We handle project concept formulation, bankable DPR preparation, portal filing, state-level task force presentation, and bank sanction coordination.",
    color: "from-emerald-600 to-teal-800",
    timeline: "30–60 Days (Scheme & Bank Appraisal dependent)",
    documents: [
      "Detailed Project Report (DPR) with 5-year financials",
      "Educational qualification certificates & Caste/Special category proof (for subsidy uplift)",
      "Quotation for plant, machinery & civil work",
      "ITR for past 2–3 years (if existing unit) & bank statements"
    ],
    deliverables: [
      "Bankable Techno-Economic Viability (TEV) Report",
      "Government portal application acknowledgement",
      "Direct bank coordination for loan sanction",
      "Margin money / subsidy claim settlement tracking"
    ],
    guideSlug: "pmegp-loan-scheme",
    items: [
      { t: "PMEGP Grant", d: "Prime Minister's Employment Generation Programme funds new micro-enterprises with government subsidy up to 35%.", guideSlug: "pmegp-loan-scheme" },
      { t: "PMFME 35% Subsidy", d: "PM Formalisation of Micro Food Processing Enterprises with credit-linked subsidy up to ₹10 Lakh.", guideSlug: "pmfme-scheme-2026" },
      { t: "CGTMSE Guarantee", d: "Credit Guarantee Fund Trust for Micro and Small Enterprises — collateral-free loans up to ₹10 Crore.", guideSlug: "cgtmse-loan-scheme" },
      { t: "Mudra Loan", d: "Provides micro-financing up to ₹10 lakh for non-corporate, non-farm small/micro enterprises.", guideSlug: "business-loan-india" },
      { t: "Stand-Up India", d: "Loans between ₹10 lakh and ₹1 Crore for SC/ST and women entrepreneurs for greenfield enterprises.", guideSlug: "stand-up-india-scheme-2026" },
    ],
  },
  {
    num: "04", id: "finance", icon: Banknote,
    title: "Business Finance",
    desc: "Working capital loans, venture capital connections, and MSME-specific financing up to ₹5 Crore.",
    longDesc: "Custom debt structuring, cash flow financing, loan against property, and institutional equity connections designed to give you optimal interest rates and manageable repayment schedules.",
    color: "from-amber-600 to-amber-800",
    timeline: "7–21 Business Days",
    documents: [
      "Past 3 years audited balance sheets & P&L statements",
      "Past 12 months comprehensive bank account statements",
      "GST returns (GSTR-3B & GSTR-1) for past 12 months",
      "Property / collateral papers (for secured loans)"
    ],
    deliverables: [
      "Financial Health Assessment & CMA Report",
      "Multiple competitive term-sheet comparisons",
      "Direct liaison with leading PSU & Private banks",
      "Speedy loan sanction & disbursement support"
    ],
    guideSlug: "business-loan-india",
    items: [
      { t: "Business Loan", d: "Unsecured business loans up to ₹50L+ with rapid approval and flexible tenures.", guideSlug: "business-loan-india" },
      { t: "Machinery Loan", d: "Asset-backed financing for industrial machinery and commercial technology up to ₹5 Crore.", guideSlug: "machinery-loan-india" },
      { t: "Loan Against Property", d: "High-value funding up to 75% of market valuation for working capital or expansion.", guideSlug: "loan-against-property-india" },
      { t: "Venture Capital Advisory", d: "Connect with angel investors and VC funds for equity funding backed by growth potential.", guideSlug: "venture-capital-fund-india" },
    ],
  },
  {
    num: "05", id: "digital", icon: Laptop2,
    title: "Digital Services",
    desc: "Website development, digital marketing, CRM, SEO, and social media to accelerate your online growth.",
    longDesc: "Modern, high-converting digital presence systems engineered specifically for B2B and consumer brands. We build high-speed web apps, organic SEO funnels, and performance lead pipelines.",
    color: "from-sky-600 to-blue-800",
    timeline: "7–20 Business Days",
    documents: [
      "Brand logo, color guidelines, and asset files",
      "Product/Service catalog & company profile",
      "Domain and hosting credentials (or we set up new)",
      "Target customer geography & keywords"
    ],
    deliverables: [
      "Custom responsive website built with modern frameworks",
      "On-page & Technical SEO setup with Google Search Console & Analytics",
      "Google Business Profile optimization for local search",
      "Automated lead capture & WhatsApp chat integration"
    ],
    guideSlug: "seo-and-digital-marketing-guide",
    items: [
      { t: "Website Development", d: "Professional, conversion-optimised websites built for e-commerce, service, and portfolio businesses.", guideSlug: "seo-and-digital-marketing-guide" },
      { t: "SEO & Digital Marketing", d: "Improve organic reach, search rankings, and paid ads with data-driven digital marketing strategy.", guideSlug: "seo-and-digital-marketing-guide" },
      { t: "CRM Solutions", d: "Custom relationship-management software to manage leads, sales, and improve customer retention.", guideSlug: "seo-and-digital-marketing-guide" },
      { t: "Social Media Management", d: "Build brand presence on Facebook, Instagram, LinkedIn with engaging and targeted campaigns.", guideSlug: "seo-and-digital-marketing-guide" },
    ],
  },
  {
    num: "06", id: "compliance", icon: ClipboardCheck,
    title: "Compliance",
    desc: "Stay compliant with ROC filings, GST returns, income tax, and annual compliance requirements.",
    longDesc: "Comprehensive statutory compliance retainer that shields your business from heavy penalties, late fees, and director disqualifications through proactive deadline tracking.",
    color: "from-slate-600 to-slate-800",
    timeline: "Ongoing Retainer / Monthly Filings",
    documents: [
      "Sales & purchase invoices / purchase registers",
      "Bank statements with transaction narrations",
      "Previous filing acknowledgements (ITR, GSTR-9, AOC-4, MGT-7)",
      "Director/Partner KYC records"
    ],
    deliverables: [
      "Timely monthly/quarterly GST return filings",
      "Annual ROC compliance package (AOC-4, MGT-7, DIR-3 KYC)",
      "Statutory Audit & Tax Audit coordination",
      "Compliance calendar & penalty-free advisory"
    ],
    guideSlug: "private-limited-company-registration",
    items: [
      { t: "ROC Compliance", d: "Annual filings, KYC, board resolutions, and Registrar of Companies compliance management.", guideSlug: "private-limited-company-registration" },
      { t: "GST Filing", d: "Monthly, quarterly, and annual GST return filing, tax reconciliation, and credit management.", guideSlug: "private-limited-company-registration" },
      { t: "Income Tax Returns", d: "Income tax filing for individuals, businesses, and firms — tax planning and assessment support.", guideSlug: "salaried-personal-loan-india" },
      { t: "Audit Support", d: "Ready audit-ready documentation, whether it's a statutory audit, tax audit, or government inspection.", guideSlug: "iso-certification-india" },
    ],
  },
  {
    num: "07", id: "legal", icon: Scale,
    title: "Legal & Protection",
    desc: "Protect your brand and business with trademark, patent, copyright, and legal registrations.",
    longDesc: "Comprehensive Intellectual Property (IP) and legal shielding for proprietary brands, software, inventions, and agreements under the Indian Trademark Registry and Copyright Office.",
    color: "from-pink-600 to-teal-800",
    timeline: "1–3 Days for TM Application / Official Registration as per IP Office",
    documents: [
      "Brand logo, wordmark, or slogan artwork",
      "User Affidavit with proof of prior usage in India (if applicable)",
      "Power of Attorney (Form TM-48) signed by applicant",
      "Applicant identity and business incorporation proof"
    ],
    deliverables: [
      "Official Trademark Application Filing with TM Number (allowing use of ™)",
      "Trademark Examination Response & Hearing Representation",
      "Final Trademark Registration Certificate (granting ® symbol)",
      "Copyright Registration Certificate & Legal contracts"
    ],
    guideSlug: "trademark-registration-india",
    items: [
      { t: "Trademark Registration", d: "Protect your brand name, logo, and slogan from unauthorised use — prevent copycats, theft & misuse.", guideSlug: "trademark-registration-india" },
      { t: "Copyright Protection", d: "Protect original content — software, content, music, literature, and art from infringement and piracy.", guideSlug: "copyright-protection-india" },
      { t: "Patent Filing", d: "Secure up to 20 years of exclusive rights over your invention, blocking others from making or selling it.", guideSlug: "trademark-registration-india" },
      { t: "Legal Compliance", d: "Ensure your business complies with Indian labour, industry, and regulatory legal requirements.", guideSlug: "terms-of-service" },
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
    "Business Services & Registrations | ArthoVista",
    "Explore our professional services including Private Limited Company setup, LLP registration, GST filing, and ISO/FSSAI certifications with ArthoVista."
  );
  const [active, setActive] = useState("registration");
  const [selectedDetail, setSelectedDetail] = useState(null);
  const [openFaq, setOpenFaq] = useState(0);
  const [showGuideDetails, setShowGuideDetails] = useState(true);
  const { openConsultationModal } = useConsultation();
  const location = useLocation();

  useEffect(() => {
    const hash = location.hash ? location.hash.replace("#", "") : "";
    if (hash) {
      const validBlock = blocks.find((b) => b.id === hash);
      if (validBlock) {
        setActive(hash);
        setTimeout(() => {
          const element = document.getElementById(hash);
          if (element) {
            element.scrollIntoView({ behavior: "smooth", block: "start" });
          }
        }, 150);
      }
    }
  }, [location.hash]);

  const openModal = (service) => {
    openConsultationModal(service);
  };

  const openBlockDetail = (block) => {
    setSelectedDetail(block);
    setShowGuideDetails(true);
  };

  const openItemDetail = (block, item) => {
    setSelectedDetail({
      ...block,
      activeItem: item,
      title: `${block.title} — ${item.t}`,
      longDesc: `${item.d} As part of our ${block.title} practice, ArthoVista provides end-to-end documentation, regulatory portal filing, and government liaison.`,
      guideSlug: item.guideSlug || block.guideSlug
    });
    setShowGuideDetails(true);
  };

  const handleCategoryClick = (id) => {
    setActive(id);

    const element = document.getElementById(id);

    if (element) {
      element.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  const matchedGuide = selectedDetail?.guideSlug 
    ? blogPosts.find(p => p.slug === selectedDetail.guideSlug)
    : null;

  return (
    <div>

      {/* ====== HERO ====== */}
      <section className="relative py-16 px-6 border-b border-slate-200">
        <div className="relative z-10 max-w-6xl mx-auto text-center">
          <div className="eyebrow">Our Expertise</div>
          <h1
            className="font-display font-black text-slate-900 mt-2"
            style={{ fontSize: "clamp(32px, 5vw, 56px)" }}
          >
            Our <span className="highlight">Services</span>
          </h1>
          <p className="text-slate-600 mt-4 max-w-2xl mx-auto text-base font-normal leading-relaxed">
            Comprehensive end-to-end business support for every stage of your entrepreneurial journey with ArthoVista.
          </p>
          <div className="flex flex-wrap gap-3 justify-center mt-8">
            <button
              onClick={() => openConsultationModal("General Consultation Leads")}
              className="btn-primary-3d cursor-pointer"
            >
              Free Consultation <ArrowRight size={15} />
            </button>
            <a href="tel:+919899902568" className="btn-outline-3d">
              <PhoneCall size={15} /> +91 98999 02568
            </a>
          </div>
        </div>
      </section>

      {/* ====== STATS BAR ====== */}
      <section className="stats-section">
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 divide-x divide-slate-200">
          {stats.map((s) => (
            <div key={s.label} className="stat-card">
              <div className="stat-value">{s.value}</div>
              <div className="stat-label">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ====== CATEGORY TABS ====== */}
      <section className="py-10 px-6 border-b border-slate-200 bg-white/60">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="section-title">Explore <span className="highlight">All Services</span></h2>
          </div>
          <div className="flex flex-wrap gap-2 justify-center">
            {categories.map((c) => (
              <button
                key={c.id}
                onClick={() => handleCategoryClick(c.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 cursor-pointer ${
                  active === c.id
                    ? "bg-teal-600 text-white shadow-md shadow-teal-500/25"
                    : "bg-white text-slate-700 hover:bg-slate-50 border border-slate-200 shadow-xs"
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
      <section className="py-12 px-6">
        <div className="max-w-6xl mx-auto space-y-8">
          {blocks.map((b) => (
            <div
              key={b.id}
              id={b.id}
              className={`tilt-3d scroll-mt-28 bg-white border border-slate-200/90 rounded-2xl overflow-hidden shadow-md transition-all duration-500 ${
                active === b.id
                  ? "ring-2 ring-teal-500 ring-offset-2 ring-offset-slate-100"
                  : "opacity-100"
              }`}
            >
              <div className="grid md:grid-cols-[300px_1fr]">
                {/* Left Panel */}
                <div className={`bg-gradient-to-br ${b.color} p-8 flex flex-col justify-between relative overflow-hidden`}>
                  <div>
                    <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center mb-5 shadow-xs">
                      <b.icon size={22} className="text-white" />
                    </div>
                    <h3 className="font-display font-bold text-white text-2xl drop-shadow-xs">{b.title}</h3>
                    <p className="text-white text-sm mt-3 leading-relaxed font-medium">{b.desc}</p>
                  </div>
                  <div className="flex gap-2 mt-8">
                    <button
                      onClick={() => openBlockDetail(b)}
                      className="bg-white text-slate-900 text-xs font-bold px-4 py-2.5 rounded-lg hover:bg-slate-100 transition cursor-pointer shadow-xs"
                    >
                      Full Details
                    </button>
                    <button
                      onClick={() => openModal(`${b.title} Leads`)}
                      className="border border-white/60 text-white text-xs font-bold px-4 py-2.5 rounded-lg hover:bg-white/20 transition cursor-pointer"
                    >
                      Get Started →
                    </button>
                  </div>
                </div>

                {/* Right Panel */}
                <div className="p-8 bg-white">
                  <div className="grid sm:grid-cols-2 gap-4">
                    {b.items.map((item) => (
                      <div
                        key={item.t}
                        className="border border-slate-200 bg-slate-50/70 rounded-xl p-4 hover:border-teal-500 hover:bg-white transition-all group cursor-pointer shadow-2xs"
                        onClick={() => openItemDetail(b, item)}
                      >
                        <div className="flex items-start gap-2.5">
                          <CheckCircle size={15} className="text-teal-600 mt-0.5 shrink-0" />
                          <div>
                            <p className="font-bold text-slate-900 text-sm group-hover:text-teal-600 transition-colors">
                              {item.t}
                            </p>
                            <p className="text-xs font-medium text-slate-600 mt-1.5 leading-relaxed">{item.d}</p>
                            <span className="inline-block mt-2 text-xs font-bold text-teal-600 group-hover:underline">
                              View Details & Enquire →
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

      {/* ====== FAQ SECTION ====== */}
      <section className="py-16 px-6 border-t border-slate-200">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <div className="eyebrow">Got Questions?</div>
            <h2 className="section-title">Frequently Asked <span className="highlight">Questions</span></h2>
            <p className="text-slate-600 mt-2 font-medium text-sm">Everything you need to know about our business services, compliance, and timelines.</p>
          </div>

          <div className="space-y-3">
            {serviceFaqs.map((f, idx) => (
              <div
                key={f.q}
                className={`bg-white rounded-xl overflow-hidden transition-all duration-300 border border-slate-200 shadow-xs ${
                  openFaq === idx ? "ring-2 ring-teal-500" : ""
                }`}
              >
                <button
                  className="w-full text-left p-5 flex items-center justify-between gap-3 cursor-pointer"
                  onClick={() => setOpenFaq(openFaq === idx ? -1 : idx)}
                >
                  <span className="font-bold text-slate-900 text-sm sm:text-base">{f.q}</span>
                  <ChevronDown
                    size={18}
                    className={`shrink-0 text-teal-600 transition-transform duration-300 ${
                      openFaq === idx ? "rotate-180" : ""
                    }`}
                  />
                </button>
                <div
                  className={`overflow-hidden transition-all duration-300 ${
                    openFaq === idx ? "max-h-60 pb-5 px-5" : "max-h-0"
                  }`}
                >
                  <p className="text-slate-600 text-xs sm:text-sm font-medium leading-relaxed">{f.a}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ====== JOURNEY CTA ====== */}
      <section className="py-16 px-6 border-t border-slate-200">
        <div className="max-w-6xl mx-auto">
          <div className="bg-white rounded-2xl p-8 md:p-12 text-center border border-slate-200 shadow-md">
            <span className="badge-orange mb-5 inline-block font-bold">Free Consultation · No Obligation</span>
            <h2 className="section-title text-slate-900 mb-3">
              Not Sure Which <span className="highlight">Service You Need?</span>
            </h2>
            <p className="text-slate-600 max-w-xl mx-auto font-medium text-base">
              Our experts will map out the exact services, schemes, and subsidies that apply to your business — all in a free 30-minute call.
            </p>

            <div className="grid sm:grid-cols-4 gap-5 mt-10 text-left">
              {[
                { icon: MapPin, t: "Service Mapping", d: "We identify exactly what your venture needs." },
                { icon: ShieldCheck, t: "Gap Analysis", d: "We audit your current registrations and compliance." },
                { icon: Landmark, t: "Subsidy Discovery", d: "Uncover every government scheme you qualify for." },
                { icon: TrendingUp, t: "Growth Roadmap", d: "Prioritised action plan with timelines and ROI." },
              ].map((j) => (
                <div key={j.t} className="relative bg-slate-50 p-5 rounded-xl border border-slate-200 shadow-2xs">
                  <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center font-bold mb-3 border border-teal-200">
                    <j.icon size={18} />
                  </div>
                  <p className="font-bold text-slate-900 text-sm">{j.t}</p>
                  <p className="text-xs font-medium text-slate-600 mt-1 leading-relaxed">{j.d}</p>
                </div>
              ))}
            </div>

            <div
              className="rounded-xl p-6 mt-10 flex flex-col md:flex-row items-center justify-between gap-4 border border-teal-200 bg-teal-50/80"
            >
              <div className="text-left">
                <p className="text-slate-900 font-bold text-base">Talk to an MSME Specialist</p>
                <p className="text-slate-600 text-xs font-medium mt-1">We have helped 500+ businesses across India with ArthoVista.</p>
              </div>
              <div className="flex gap-3 shrink-0">
                <button
                  onClick={() => openConsultationModal("MSME Specialist Consultation")}
                  className="btn-primary-3d cursor-pointer"
                >
                  Book Free Session <ArrowRight size={14} />
                </button>
                <a href="tel:+919899902568" className="inline-flex items-center gap-2 bg-white text-slate-900 font-bold px-5 py-2.5 rounded-xl border border-slate-300 shadow-xs hover:bg-slate-50 text-xs">
                  <PhoneCall size={15} className="text-teal-600" /> +91 98999 02568
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ====== SERVICE DETAIL MODAL ====== */}
      {selectedDetail && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-fade-in"
          onClick={() => setSelectedDetail(null)}
        >
          <div
            className="relative w-full max-w-4xl max-h-[92vh] overflow-y-auto bg-white border border-slate-200 rounded-3xl shadow-2xl custom-scrollbar"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className={`bg-gradient-to-r ${selectedDetail.color} p-6 sm:p-8 relative`}>
              <button
                onClick={() => setSelectedDetail(null)}
                className="absolute top-5 right-5 p-2 rounded-full bg-black/20 hover:bg-black/40 text-white transition cursor-pointer"
                title="Close"
              >
                <X size={18} />
              </button>

              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-white text-xs font-bold uppercase tracking-wider mb-3">
                <Sparkles size={12} /> Official Service Practice
              </div>

              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center text-white shrink-0 shadow-xs">
                  <selectedDetail.icon size={28} />
                </div>
                <div>
                  <h3 className="font-display font-black text-2xl sm:text-3xl text-white">
                    {selectedDetail.title}
                  </h3>
                  <p className="text-white font-semibold text-xs sm:text-sm mt-1">
                    {selectedDetail.desc}
                  </p>
                </div>
              </div>
            </div>

            {/* Content Body */}
            <div className="p-6 sm:p-8 space-y-6 bg-white">
              {/* Domain Overview */}
              <div>
                <h4 className="text-xs font-bold uppercase text-teal-700 tracking-wider mb-2 flex items-center gap-1.5">
                  <Layers size={14} /> Scope & Advisory Overview
                </h4>
                <p className="text-slate-700 text-sm sm:text-base leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-200 font-normal">
                  {selectedDetail.longDesc || selectedDetail.desc}
                </p>
              </div>

              {/* Sub-Services List */}
              {selectedDetail.items && (
                <div>
                  <h4 className="text-xs font-bold uppercase text-teal-700 tracking-wider mb-3 flex items-center gap-1.5">
                    <CheckCircle2 size={14} /> Included Sub-Services & Coverage
                  </h4>
                  <div className="grid sm:grid-cols-2 gap-3">
                    {selectedDetail.items.map((it) => (
                      <div
                        key={it.t}
                        className={`p-3.5 rounded-xl border transition-all ${
                          selectedDetail.activeItem?.t === it.t
                            ? "bg-teal-50 border-teal-500 ring-1 ring-teal-500"
                            : "bg-slate-50 border-slate-200"
                        }`}
                      >
                        <p className="font-bold text-slate-900 text-sm flex items-center gap-2">
                          <CheckCircle size={14} className="text-teal-600 shrink-0" />
                          <span>{it.t}</span>
                        </p>
                        <p className="text-xs text-slate-600 mt-1.5 ml-5 leading-relaxed font-normal">
                          {it.d}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Deliverables & Documents */}
              <div className="grid sm:grid-cols-2 gap-4 pt-2 border-t border-slate-200">
                {selectedDetail.deliverables && (
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                    <p className="text-xs font-bold uppercase text-amber-700 tracking-wider mb-2 flex items-center gap-1.5">
                      <FileText size={13} /> Official Deliverables
                    </p>
                    <ul className="space-y-1.5">
                      {selectedDetail.deliverables.map((del) => (
                        <li key={del} className="text-xs text-slate-700 flex items-start gap-1.5 font-medium">
                          <span className="w-1.5 h-1.5 rounded-full bg-teal-600 mt-1.5 shrink-0" />
                          <span>{del}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {selectedDetail.documents && (
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                    <p className="text-xs font-bold uppercase text-amber-700 tracking-wider mb-2 flex items-center gap-1.5">
                      <Clock size={13} /> Documents & Turnaround
                    </p>
                    <p className="text-xs font-bold text-teal-700 mb-2">
                      Timeline: {selectedDetail.timeline || "3–7 Business Days"}
                    </p>
                    <ul className="space-y-1.5">
                      {selectedDetail.documents.map((doc) => (
                        <li key={doc} className="text-xs text-slate-700 flex items-start gap-1.5 font-medium">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-600 mt-1.5 shrink-0" />
                          <span>{doc}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* IN-DEPTH DISTRIBUTED KNOWLEDGE GUIDE (From Knowledge Hub) */}
              {matchedGuide && (
                <div className="pt-4 border-t border-slate-200">
                  <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <BookOpen size={16} className="text-teal-700" />
                        <h4 className="text-sm font-bold text-slate-900">
                          In-Depth Regulatory Handbook & Statutory Guidelines
                        </h4>
                      </div>
                      <span className="text-xs font-bold text-teal-700 bg-teal-100/60 px-2.5 py-1 rounded-full border border-teal-200">
                        {matchedGuide.readTime}
                      </span>
                    </div>

                    <p className="text-xs text-slate-600 leading-relaxed font-normal">
                      {matchedGuide.excerpt}
                    </p>

                    {matchedGuide.tableOfContents && (
                      <div>
                        <p className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                          Key Coverage Topics:
                        </p>
                        <div className="flex flex-wrap gap-1.5">
                          {matchedGuide.tableOfContents.slice(0, 6).map((toc) => (
                            <span key={toc.id} className="text-[11px] px-2.5 py-1 rounded-lg bg-white text-slate-700 border border-slate-200 font-medium">
                              {toc.label}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Footer Actions */}
            <div className="p-6 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
              <p className="text-xs text-slate-600 text-center sm:text-left font-medium">
                Speak directly with an ArthoVista advisor for <span className="text-slate-900 font-bold">{selectedDetail.title}</span>.
              </p>
              <div className="flex gap-2 w-full sm:w-auto">
                <button
                  onClick={() => setSelectedDetail(null)}
                  className="px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 hover:text-slate-900 hover:bg-slate-100 text-xs font-bold transition cursor-pointer flex-1 sm:flex-none shadow-2xs"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    const title = selectedDetail.title.includes("Leads") ? selectedDetail.title : `${selectedDetail.title} Leads`;
                    setSelectedDetail(null);
                    openConsultationModal(title);
                  }}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-green-500 via-blue-500 to-green-500 hover:opacity-95 text-white text-xs font-bold shadow-md transition cursor-pointer flex items-center justify-center gap-1.5 flex-1 sm:flex-none"
                >
                  <span>Book Free Consultation</span> <ArrowRight size={14} />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
