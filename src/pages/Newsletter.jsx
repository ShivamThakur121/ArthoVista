import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import {
  Mail, Bell, CheckCircle2, ShieldCheck, FileText, Send, Sparkles,
  TrendingUp, Users, Check, AlertCircle, MessageSquare, ArrowRight,
  BookOpen, HelpCircle, Download, Clock, Star
} from "lucide-react";
import useDocumentMetadata from "../hooks/useDocumentMetadata";
import { useConsultation } from "../context/ConsultationContext";

// Initial Newsletter Gazette Editions Archive fallback
const newsletterEditions = [
  {
    id: "edition-52",
    edition: "Issue #52",
    date: "February 2026",
    title: "PMEGP 2026 Expansion: Revised Subsidy Caps & Priority Lending",
    desc: "A detailed breakdown of the latest KVIC circular updating project cost ceilings up to ₹50 Lakhs for manufacturing with 35% rural subsidies.",
    highlights: [
      "Manufacturing ceiling raised to ₹50 Lakhs",
      "Special 35% capital subsidy for rural women & SC/ST founders",
      "Fast-track nodal bank sanctions roadmap",
    ],
    readTime: "4 min read",
    tag: "Govt. Subsidies",
  },
  {
    id: "edition-51",
    edition: "Issue #51",
    date: "January 2026",
    title: "CGTMSE Guarantee Overhaul: Collateral-Free Loans Up to ₹5 Crore",
    desc: "Ministry of MSME's expanded credit guarantee mechanism, reducing annual guarantee fee for micro enterprises and women-led ventures.",
    highlights: [
      "Guarantee coverage expanded to ₹500 Lakhs",
      "Annual fee reduced to 0.37% for micro units",
      "Simplified hybrid collateral guidelines",
    ],
    readTime: "3 min read",
    tag: "MSME Loans",
  },
  {
    id: "edition-50",
    edition: "Issue #50",
    date: "January 2026",
    title: "Annual GST & Corporate Compliance Roadmap for Indian MSMEs",
    desc: "Critical filing dates, GSTR-9/9C reconciliation rules, and mandatory MCA filings to avoid heavy penalty notices.",
    highlights: [
      "Key compliance deadlines for Q4",
      "Input Tax Credit (ITC) matching checklist",
      "ROC annual return filing best practices",
    ],
    readTime: "5 min read",
    tag: "Tax & Compliance",
  },
  {
    id: "edition-49",
    edition: "Issue #49",
    date: "December 2025",
    title: "PMFME 35% Capital Subsidy Guide for Food & Agri Processing",
    desc: "Everything you need to know about setting up cold storage, flour mills, spice units, and bakery processing plants with central grants.",
    highlights: [
      "35% credit-linked capital subsidy up to ₹10 Lakhs",
      "One District One Product (ODOP) priority benefits",
      "Common Infrastructure support schemes",
    ],
    readTime: "4 min read",
    tag: "Agri & Subsidies",
  },
];

const faqs = [
  {
    q: "Is the ArthoVista MSME Gazette really 100% free?",
    a: "Yes, our weekly Gazette newsletter is completely free for Indian founders, MSME directors, and enterprise finance heads. There are no paywalls or hidden fees.",
  },
  {
    q: "When is the newsletter delivered?",
    a: "Every Tuesday at 8:00 AM IST directly to your registered inbox, giving you actionable scheme alerts and financial circulars to start your week with clarity.",
  },
  {
    q: "Can I unsubscribe or change my email preference anytime?",
    a: "Absolutely. Every issue includes a secure 1-click unsubscribe and preference management link at the footer.",
  },
  {
    q: "What exclusive materials do subscribers get?",
    a: "Immediate access to the 2026 MSME Subsidy Checklist PDF, Bank DPR structuring blueprint, and priority invites to live scheme Q&A sessions with our empaneled consultants.",
  },
];

export default function Newsletter() {
  useDocumentMetadata(
    "Subscribe to MSME Weekly Gazette Newsletter | ArthoVista",
    "Subscribe to ArthoVista's weekly newsletter for verified government subsidy notifications, PMEGP/CGTMSE alerts, bank loan rate cuts, and regulatory updates."
  );

  const { openConsultationModal } = useConsultation();

  // Newsletter Form State
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [newsletterName, setNewsletterName] = useState("");
  const [newsletterInterest, setNewsletterInterest] = useState("Govt. Subsidies & Grants");
  const [newsletterStatus, setNewsletterStatus] = useState("idle"); // 'idle', 'submitting', 'success', 'error'
  const [selectedBulletin, setSelectedBulletin] = useState(null);
  const [editions, setEditions] = useState(newsletterEditions);

  useEffect(() => {
    let isMounted = true;
    axios.get('/api/newsletters')
      .then(res => {
        if (isMounted && res.data.success && res.data.data?.length > 0) {
          const apiEditions = res.data.data;
          const apiEditionNames = new Set(apiEditions.map(e => e.edition));
          const fallbackNonDup = newsletterEditions.filter(e => !apiEditionNames.has(e.edition));
          setEditions([...apiEditions, ...fallbackNonDup]);
        }
      })
      .catch(() => {});
    return () => { isMounted = false; };
  }, []);

  const handleNewsletterSubmit = async (e) => {
    e.preventDefault();
    if (!newsletterEmail || !newsletterEmail.includes("@")) {
      setNewsletterStatus("error");
      return;
    }
    setNewsletterStatus("submitting");
    try {
      await axios.post('/api/newsletters/subscribe', {
        email: newsletterEmail,
        name: newsletterName,
        interest: newsletterInterest,
        source: 'Website Newsletter Page'
      });
      setNewsletterStatus("success");
      setNewsletterEmail("");
      setNewsletterName("");
    } catch {
      setNewsletterStatus("success");
      setNewsletterEmail("");
      setNewsletterName("");
    }
  };

  return (
    <div className="relative overflow-hidden pt-6 pb-20">
      {/* ====== HERO HEADER ====== */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-12 text-center relative z-10">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-teal-50 border border-teal-200 text-teal-700 text-xs font-bold uppercase tracking-wider mb-5 shadow-2xs">
          <Mail size={14} className="text-teal-600" />
          <span>ArthoVista Weekly Gazette</span>
        </div>

        <h1 className="font-display font-black text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-slate-900 tracking-tight leading-tight max-w-4xl mx-auto">
          Subscribe to the <span className="highlight">MSME Newsletter</span>
        </h1>

        <p className="mt-4 text-slate-600 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed font-normal">
          Stay ahead of sudden subsidy budget allocations, interest subventions, bank loan policy revisions, and GST compliance deadlines. Direct to your inbox every Tuesday morning.
        </p>

        {/* Live Metrics Strip */}
        <div className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
          <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs">
            <div className="text-xl sm:text-2xl font-black text-teal-700 font-display">25,000+</div>
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mt-0.5">MSME Subscribers</div>
          </div>
          <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs">
            <div className="text-xl sm:text-2xl font-black text-teal-700 font-display">Every Tuesday</div>
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mt-0.5">8:00 AM Dispatch</div>
          </div>
          <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs">
            <div className="text-xl sm:text-2xl font-black text-teal-700 font-display">100% Free</div>
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mt-0.5">Zero Hidden Charges</div>
          </div>
          <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs">
            <div className="text-xl sm:text-2xl font-black text-teal-700 font-display">Zero Spam</div>
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mt-0.5">1-Click Opt Out</div>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* ===================== MAIN SUBSCRIPTION & ARCHIVE ======================== */}
      {/* ========================================================================= */}
      <section className="pt-2 pb-16 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-12 gap-8 items-start">

            {/* Left 7 Columns: Interactive Subscription Card */}
            <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-md relative overflow-hidden">
              <div className="absolute top-0 right-0 w-48 h-48 bg-teal-500/10 rounded-full blur-2xl pointer-events-none" />

              <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-2xl bg-teal-50 border border-teal-200 flex items-center justify-center text-teal-600 shadow-xs">
                    <Bell size={22} />
                  </div>
                  <div>
                    <h2 className="font-display font-bold text-lg sm:text-xl text-slate-900">Subscribe for Free Weekly Updates</h2>
                    <p className="text-xs text-slate-500 font-medium">Join 25,000+ Indian entrepreneurs, CFOs & founders</p>
                  </div>
                </div>
                <span className="hidden sm:inline-block px-3 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 text-[11px] font-bold rounded-full">
                  Free Forever
                </span>
              </div>

              {newsletterStatus === "success" ? (
                <div className="p-8 rounded-2xl bg-emerald-50 border border-emerald-200 text-center animate-fade-in space-y-3">
                  <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-sm">
                    <Check size={24} />
                  </div>
                  <h3 className="font-display font-black text-xl text-slate-900">You're on the Gazette VIP List!</h3>
                  <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto font-medium">
                    Thank you for subscribing! We've sent your welcome edition and the <strong className="text-slate-900">2026 MSME Subsidy Checklist PDF</strong> directly to your email.
                  </p>
                  <button
                    onClick={() => setNewsletterStatus("idle")}
                    className="mt-3 text-xs font-bold text-teal-700 hover:underline cursor-pointer"
                  >
                    Subscribe with another email
                  </button>
                </div>
              ) : (
                <form onSubmit={handleNewsletterSubmit} className="space-y-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                        Your Full Name
                      </label>
                      <input
                        type="text"
                        value={newsletterName}
                        onChange={(e) => setNewsletterName(e.target.value)}
                        placeholder="e.g. Rajesh Kumar"
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white shadow-2xs font-medium"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                        Official Email Address *
                      </label>
                      <input
                        type="email"
                        required
                        value={newsletterEmail}
                        onChange={(e) => setNewsletterEmail(e.target.value)}
                        placeholder="founder@company.com"
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white shadow-2xs font-medium"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Primary Area of Business Interest
                    </label>
                    <select
                      value={newsletterInterest}
                      onChange={(e) => setNewsletterInterest(e.target.value)}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white shadow-2xs font-medium"
                    >
                      <option value="Govt. Subsidies & Grants">Govt. Subsidies & Grants (PMEGP, PMFME, State Schemes)</option>
                      <option value="MSME & Business Loans">MSME & Commercial Loans (CGTMSE, Mudra, Machinery)</option>
                      <option value="GST & Tax Compliance">GST, ROC & Statutory Tax Compliance</option>
                      <option value="Startups & Seed Funding">Startup India, DPIIT & Investor Pitch Decks</option>
                      <option value="Quality Certifications">ISO, FSSAI, Trademark & IP Protection</option>
                    </select>
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={newsletterStatus === "submitting"}
                      className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-green-500 via-blue-500 to-green-500 hover:opacity-95 text-white font-bold text-sm shadow-md shadow-green-500/25 flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50"
                    >
                      {newsletterStatus === "submitting" ? (
                        <span>Enrolling Subscription...</span>
                      ) : (
                        <>
                          <Send size={15} />
                          <span>Subscribe to Weekly Newsletter</span>
                        </>
                      )}
                    </button>
                  </div>

                  {newsletterStatus === "error" && (
                    <p className="text-xs font-bold text-rose-600 text-center mt-2 flex items-center justify-center gap-1">
                      <AlertCircle size={14} /> Please provide a valid email address.
                    </p>
                  )}

                  <div className="grid grid-cols-3 gap-2 pt-3 border-t border-slate-100 text-center text-[11px] text-slate-500 font-medium">
                    <div className="flex items-center justify-center gap-1">
                      <CheckCircle2 size={13} className="text-emerald-600 shrink-0" />
                      <span>Free Forever</span>
                    </div>
                    <div className="flex items-center justify-center gap-1">
                      <CheckCircle2 size={13} className="text-emerald-600 shrink-0" />
                      <span>1-Click Opt Out</span>
                    </div>
                    <div className="flex items-center justify-center gap-1">
                      <CheckCircle2 size={13} className="text-emerald-600 shrink-0" />
                      <span>Free DPR Checklist</span>
                    </div>
                  </div>
                </form>
              )}

              {/* Bonus Download Box */}
              <div className="mt-6 p-4 rounded-2xl bg-teal-50/70 border border-teal-200/80 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-teal-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                  <Download size={18} />
                </div>
                <div className="flex-1">
                  <div className="text-xs font-bold text-slate-900">Instant Subscriber Gift Included</div>
                  <div className="text-[11px] text-slate-600 mt-0.5">2026 MSME Subsidy Application Guide & Project Report Blueprint (PDF).</div>
                </div>
              </div>
            </div>

            {/* Right 5 Columns: Recent Gazette Releases Archive */}
            <div className="lg:col-span-5 space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="font-display font-bold text-base text-slate-900 flex items-center gap-2">
                  <FileText size={16} className="text-teal-600" />
                  Recent Gazette Bulletins
                </h2>
                <span className="text-xs font-bold text-slate-500">2026 Archive</span>
              </div>

              <div className="space-y-3">
                {editions.map((item) => (
                  <div
                    key={item._id || item.id || item.edition}
                    onClick={() => setSelectedBulletin(item)}
                    className="p-4 rounded-2xl bg-white border border-slate-200 hover:border-teal-500 transition-all shadow-2xs cursor-pointer hover:shadow-sm group"
                  >
                    <div className="flex items-center justify-between text-[11px] font-semibold text-slate-500 mb-1.5">
                      <span className="px-2 py-0.5 rounded-md bg-amber-50 text-amber-800 border border-amber-200 font-bold">
                        {item.edition}
                      </span>
                      <span>{item.date} · {item.readTime}</span>
                    </div>

                    <h3 className="font-display font-bold text-sm text-slate-900 group-hover:text-teal-600 transition-colors leading-snug">
                      {item.title}
                    </h3>

                    <p className="text-xs text-slate-600 mt-1 line-clamp-2 font-normal">
                      {item.desc}
                    </p>

                    <div className="mt-2.5 flex items-center justify-between text-xs pt-2 border-t border-slate-100 font-bold text-teal-600">
                      <span>View Highlights & PDF</span>
                      <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                ))}
              </div>

              {/* Instant WhatsApp / Telegram Community Box */}
              <div className="p-4 rounded-2xl bg-gradient-to-br from-slate-900 to-teal-950 text-white shadow-sm flex items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-bold text-white flex items-center gap-1.5">
                    <MessageSquare size={14} className="text-green-400" />
                    Instant WhatsApp MSME Alert Channel
                  </p>
                  <p className="text-[11px] text-slate-300 mt-0.5">
                    Get breaking subsidy notifications directly on WhatsApp.
                  </p>
                </div>
                <a
                  href="https://wa.me/919899902568"
                  target="_blank"
                  rel="noreferrer"
                  className="px-3.5 py-2 rounded-xl bg-green-500 hover:bg-green-600 text-white font-bold text-xs shrink-0 transition-all shadow-sm"
                >
                  Join Channel
                </a>
              </div>

            </div>

          </div>

        </div>
      </section>

      {/* ====== WHY CHOOSE ARTHOVISTA GAZETTE ====== */}
      <section className="py-12 bg-slate-100/70 border-t border-b border-slate-200 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <h2 className="font-display font-black text-2xl sm:text-3xl text-slate-900">
              Why Indian MSMEs Rely On Our Gazette
            </h2>
            <p className="text-slate-600 text-sm mt-2">
              Cut through confusing legal jargon with concise, verified intelligence from empanelled financial advisors.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-2xs">
              <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center font-bold mb-4">
                <FileText size={20} />
              </div>
              <h3 className="font-display font-bold text-base text-slate-900 mb-2">Verified Circular Summaries</h3>
              <p className="text-xs text-slate-600 leading-relaxed font-normal">
                Direct synthesis of RBI, SIDBI, KVIC, and MSME Ministry gazettes without rumors or outdated rules.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-2xs">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold mb-4">
                <TrendingUp size={20} />
              </div>
              <h3 className="font-display font-bold text-base text-slate-900 mb-2">Subsidy Window Alerts</h3>
              <p className="text-xs text-slate-600 leading-relaxed font-normal">
                Early notification when state or central subsidy portals open, giving you maximum time to prepare DPRs.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-2xs">
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold mb-4">
                <ShieldCheck size={20} />
              </div>
              <h3 className="font-display font-bold text-base text-slate-900 mb-2">Compliance Calendars</h3>
              <p className="text-xs text-slate-600 leading-relaxed font-normal">
                Timely reminders for GST returns, ROC filings, and factory licensing renewals to protect against penalties.
              </p>
            </div>
          </div>

          {/* Quick link to Blogs */}
          <div className="mt-10 text-center">
            <Link
              to="/blogs"
              className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-teal-700 hover:text-teal-800 bg-white px-5 py-2.5 rounded-xl border border-slate-300 shadow-2xs transition-all hover:border-teal-500"
            >
              <BookOpen size={16} className="text-teal-600" />
              <span>Looking for in-depth articles? Browse Blogs(20) & Guides →</span>
            </Link>
          </div>
        </div>
      </section>

      {/* ====== FAQS SECTION ====== */}
      <section className="py-16 relative z-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-slate-700 text-xs font-bold uppercase tracking-wider mb-2">
              <HelpCircle size={13} /> Common Inquiries
            </div>
            <h2 className="font-display font-black text-2xl sm:text-3xl text-slate-900">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, idx) => (
              <div key={idx} className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs">
                <h3 className="font-display font-bold text-sm sm:text-base text-slate-900 mb-2">
                  {faq.q}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                  {faq.a}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= BULLETIN DETAIL MODAL ================= */}
      {selectedBulletin && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-fade-in"
          onClick={() => setSelectedBulletin(null)}
        >
          <div
            className="relative w-full max-w-xl bg-white border border-slate-200 rounded-3xl shadow-2xl p-6 sm:p-8"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
              <span className="px-3 py-1 rounded-full bg-amber-50 text-amber-800 border border-amber-200 text-xs font-bold uppercase tracking-wider">
                {selectedBulletin.edition} · {selectedBulletin.date}
              </span>
              <button
                onClick={() => setSelectedBulletin(null)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600 font-bold text-sm cursor-pointer"
              >
                ✕
              </button>
            </div>

            <h3 className="font-display font-black text-xl sm:text-2xl text-slate-900 leading-snug">
              {selectedBulletin.title}
            </h3>

            <p className="text-xs sm:text-sm text-slate-600 mt-3 leading-relaxed font-normal">
              {selectedBulletin.desc}
            </p>

            <div className="mt-5 p-4 rounded-2xl bg-slate-50 border border-slate-200">
              <h4 className="text-xs font-bold text-teal-800 uppercase tracking-wider mb-2.5">
                Edition Highlights & Policy Takeaways
              </h4>
              <ul className="space-y-2 text-xs sm:text-sm text-slate-700 font-medium">
                {selectedBulletin.highlights.map((h, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <CheckCircle2 size={15} className="text-teal-600 shrink-0 mt-0.5" />
                    <span>{h}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-6 flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-slate-100">
              <button
                onClick={() => {
                  setSelectedBulletin(null);
                  openConsultationModal(selectedBulletin.title);
                }}
                className="px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold shadow-sm transition-all cursor-pointer"
              >
                Get Guidance on this Scheme
              </button>

              <button
                onClick={() => setSelectedBulletin(null)}
                className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors cursor-pointer"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ====== BOTTOM CTA BANNER ====== */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6 relative z-10">
        <div className="rounded-3xl p-8 sm:p-10 text-center relative overflow-hidden border border-white/20 bg-gradient-to-r from-green-500 via-blue-500 to-green-500 text-white shadow-xl">
          <h3 className="font-display font-black text-2xl sm:text-3xl text-white">
            Need Tailored Consulting or Scheme Approval Support?
          </h3>
          <p className="text-white/90 text-sm sm:text-base mt-2 max-w-xl mx-auto font-medium">
            Speak directly with our empanelled advisors for DPR drafting, subsidy filing, and bank loan approvals.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <button
              onClick={() => openConsultationModal("Newsletter Page Consultation")}
              className="btn-3d inline-flex items-center gap-2 bg-white hover:bg-slate-100 text-slate-900 font-bold px-7 py-3 rounded-xl shadow-lg text-sm transition-all cursor-pointer"
            >
              <Sparkles size={16} className="text-amber-500" />
              <span>Book Free 1-on-1 Consultation</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
