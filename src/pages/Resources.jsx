// src/pages/Resources.jsx
import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import {
  BookOpen, Mail, Search, Sparkles, Clock, Calendar, ArrowRight,
  CheckCircle2, Filter, ShieldCheck, Tag, Download, Bell, Send,
  FileText, TrendingUp, Users, Check, AlertCircle, MessageSquare
} from "lucide-react";
import useDocumentMetadata from "../hooks/useDocumentMetadata";
import { blogPosts, categories } from "../data/blogData";
import { useConsultation } from "../context/ConsultationContext";

// Sample Newsletter Gazette Editions
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

export default function Resources() {
  useDocumentMetadata(
    "Resources & MSME Knowledge Hub | ArthoVista",
    "Access verified MSME scheme guides, business blogs, DPR templates, and subscribe to the ArthoVista Weekly Gazette newsletter for subsidy alerts."
  );

  const { openConsultationModal } = useConsultation();
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  // Newsletter Form State
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [newsletterName, setNewsletterName] = useState("");
  const [newsletterInterest, setNewsletterInterest] = useState("Govt. Subsidies & Grants");
  const [newsletterStatus, setNewsletterStatus] = useState("idle"); // 'idle', 'submitting', 'success', 'error'
  const [selectedBulletin, setSelectedBulletin] = useState(null);

  // Filtered Blog Posts
  const filteredPosts = useMemo(() => {
    return blogPosts.filter((post) => {
      const matchesCategory =
        selectedCategory === "All" || post.category === selectedCategory;
      const matchesSearch =
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.keywords?.some((k) => k.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  const featuredPost = useMemo(() => {
    return blogPosts.find((p) => p.featured) || blogPosts[0];
  }, []);

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    if (!newsletterEmail || !newsletterEmail.includes("@")) {
      setNewsletterStatus("error");
      return;
    }
    setNewsletterStatus("submitting");
    setTimeout(() => {
      setNewsletterStatus("success");
      setNewsletterEmail("");
      setNewsletterName("");
    }, 900);
  };

  return (
    <div className="relative overflow-hidden pt-6 pb-20">
      {/* ====== HERO HEADER ====== */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-10 text-center relative z-10">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-teal-50 border border-teal-200 text-teal-700 text-xs font-bold uppercase tracking-wider mb-5 shadow-2xs">
          <BookOpen size={14} className="text-teal-600" />
          <span>ArthoVista Enterprise Resources</span>
        </div>

        <h1 className="font-display font-black text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-slate-900 tracking-tight leading-tight max-w-4xl mx-auto">
          Knowledge Hub & <span className="text-teal-600">Weekly Newsletter</span>
        </h1>

        <p className="mt-4 text-slate-600 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed font-normal">
          Empowering founders and MSMEs across India with verified scheme breakdowns, DPR advisory, regulatory updates, and our curated weekly business gazette.
        </p>

        {/* Quick Section Switcher Buttons */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <a
            href="#blogs-section"
            className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-800 font-bold text-xs sm:text-sm shadow-xs transition-all hover:border-teal-500 hover:text-teal-700"
          >
            <BookOpen size={16} className="text-teal-600" />
            <span>Browse Blogs & Guides ({blogPosts.length})</span>
          </a>

          <a
            href="#newsletter-section"
            className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs sm:text-sm shadow-md shadow-teal-600/20 transition-all hover:scale-105"
          >
            <Mail size={16} className="text-teal-200" />
            <span>Subscribe to Newsletter (Newslater)</span>
          </a>
        </div>

        {/* Live Metrics Strip */}
        <div className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
          <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs">
            <div className="text-xl sm:text-2xl font-black text-teal-700 font-display">50+</div>
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mt-0.5">Scheme Guides</div>
          </div>
          <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs">
            <div className="text-xl sm:text-2xl font-black text-teal-700 font-display">25,000+</div>
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mt-0.5">MSME Subscribers</div>
          </div>
          <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs">
            <div className="text-xl sm:text-2xl font-black text-teal-700 font-display">Every Tuesday</div>
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mt-0.5">Gazette Dispatch</div>
          </div>
          <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs">
            <div className="text-xl sm:text-2xl font-black text-teal-700 font-display">100% Free</div>
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mt-0.5">Open Access</div>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* ======================= SECTION 1: BLOGS & GUIDES ======================= */}
      {/* ========================================================================= */}
      <section id="blogs-section" className="pt-10 pb-16 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 pb-4 border-b border-slate-200 gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-50 border border-teal-200 text-teal-700 text-xs font-bold uppercase tracking-wider mb-2">
                <BookOpen size={13} /> Section 1
              </div>
              <h2 className="font-display font-black text-2xl sm:text-3xl text-slate-900">
                Blogs & MSME Knowledge Base
              </h2>
              <p className="text-slate-600 text-sm mt-1 font-medium">
                Step-by-step verified roadmaps for subsidies, credit schemes, corporate filings, and compliance.
              </p>
            </div>

            {/* Search Bar */}
            <div className="w-full md:w-80 relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search blogs, schemes, loans..."
                className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-300 rounded-xl text-slate-900 text-xs sm:text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500 shadow-2xs"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-500 hover:text-slate-800"
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap items-center gap-2 mb-8">
            {categories.map((cat) => {
              const isSelected = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${isSelected
                      ? "bg-teal-600 text-white shadow-sm"
                      : "bg-white text-slate-700 hover:bg-slate-100 border border-slate-200 shadow-2xs"
                    }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>

          {/* Featured Post Banner */}
          {selectedCategory === "All" && !searchQuery && featuredPost && (
            <div className="mb-10 rounded-3xl overflow-hidden border border-slate-200 bg-white p-6 sm:p-8 shadow-sm">
              <div className="grid lg:grid-cols-12 gap-6 items-center">
                <div className="lg:col-span-8">
                  <div className="flex flex-wrap items-center gap-2.5 mb-3">
                    <span className="px-2.5 py-0.5 rounded-full bg-teal-50 border border-teal-200 text-teal-700 text-xs font-bold uppercase tracking-wider flex items-center gap-1">
                      <Sparkles size={12} className="text-amber-500" /> Featured Article
                    </span>
                    <span className="text-xs text-slate-500 font-medium">
                      {featuredPost.category} · {featuredPost.readTime}
                    </span>
                  </div>

                  <h3 className="font-display font-bold text-xl sm:text-2xl text-slate-900 leading-snug">
                    <Link to={`/blog/${featuredPost.slug}`} className="hover:text-teal-600 transition-colors">
                      {featuredPost.title}
                    </Link>
                  </h3>

                  <p className="text-slate-600 mt-2.5 text-xs sm:text-sm leading-relaxed line-clamp-2 font-normal">
                    {featuredPost.excerpt}
                  </p>

                  <div className="mt-5 flex items-center gap-3">
                    <Link
                      to={`/blog/${featuredPost.slug}`}
                      className="inline-flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white font-bold px-5 py-2.5 rounded-xl shadow-sm text-xs transition-all"
                    >
                      <span>Read Full Guide</span>
                      <ArrowRight size={14} />
                    </Link>
                    <button
                      onClick={() => openConsultationModal(featuredPost.title)}
                      className="inline-flex items-center gap-1.5 bg-white hover:bg-slate-50 text-slate-700 font-bold px-4 py-2.5 rounded-xl border border-slate-200 text-xs transition-all shadow-2xs cursor-pointer"
                    >
                      <ShieldCheck size={14} className="text-teal-600" />
                      <span>Get Scheme Help</span>
                    </button>
                  </div>
                </div>

                <div className="lg:col-span-4 bg-slate-50 p-5 rounded-2xl border border-slate-200">
                  <div className="text-xs font-bold text-teal-700 uppercase tracking-wider mb-2">
                    Key Takeaways & Chapters
                  </div>
                  <ul className="space-y-2 text-xs text-slate-700 font-medium">
                    {featuredPost.tableOfContents.slice(0, 4).map((toc) => (
                      <li key={toc.id} className="flex items-start gap-1.5">
                        <CheckCircle2 size={13} className="text-teal-600 shrink-0 mt-0.5" />
                        <span className="line-clamp-1">{toc.label}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* Blogs Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPosts.slice(0, 6).map((post) => (
              <article
                key={post.id}
                className="group rounded-2xl bg-white border border-slate-200 hover:border-teal-500 p-5 flex flex-col justify-between transition-all duration-200 hover:shadow-md hover:-translate-y-0.5"
              >
                <div>
                  <div className="flex items-center justify-between text-xs text-slate-500 mb-2.5 font-medium">
                    <span className="px-2 py-0.5 rounded-md bg-teal-50 text-teal-700 border border-teal-200 font-bold text-[11px]">
                      {post.category}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock size={11} />
                      {post.readTime}
                    </span>
                  </div>

                  <h4 className="font-display font-bold text-base text-slate-900 group-hover:text-teal-600 transition-colors leading-snug line-clamp-2">
                    <Link to={`/blog/${post.slug}`}>
                      {post.title}
                    </Link>
                  </h4>

                  <p className="mt-2 text-xs text-slate-600 leading-relaxed line-clamp-3 font-normal">
                    {post.excerpt}
                  </p>
                </div>

                <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[11px] text-slate-500 font-medium">{post.date}</span>
                  <Link
                    to={`/blog/${post.slug}`}
                    className="inline-flex items-center gap-1 text-xs font-bold text-teal-600 hover:text-teal-700"
                  >
                    <span>Read Guide</span>
                    <ArrowRight size={13} />
                  </Link>
                </div>
              </article>
            ))}
          </div>

          <div className="mt-8 text-center">
            <Link
              to="/blogs"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs sm:text-sm border border-slate-300 transition-all shadow-2xs"
            >
              <BookOpen size={15} className="text-teal-600" />
              <span>View All Knowledge Hub Articles ({blogPosts.length})</span>
              <ArrowRight size={15} />
            </Link>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* ===================== SECTION 2: NEWSLETTER (NEWLATER) ================== */}
      {/* ========================================================================= */}
      <section id="newsletter-section" className="pt-8 pb-16 relative z-10 border-t border-slate-200 bg-white/70">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          <div className="mb-10 text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-xs font-bold uppercase tracking-wider mb-3 shadow-2xs">
              <Mail size={13} className="text-amber-600" /> Section 2 · Weekly Gazette
            </div>
            <h2 className="font-display font-black text-2xl sm:text-3xl md:text-4xl text-slate-900">
              The ArthoVista <span className="text-teal-600">MSME Newsletter</span>
            </h2>
            <p className="text-slate-600 text-sm sm:text-base mt-2 font-normal leading-relaxed">
              Stay ahead of policy amendments, sudden subsidy budget allocations, interest subventions, and compliance alerts. Direct to your inbox every Tuesday.
            </p>
          </div>

          <div className="grid lg:grid-cols-12 gap-8 items-start">

            {/* Left 7 Columns: Interactive Subscription Card */}
            <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-md relative overflow-hidden">
              <div className="absolute top-0 right-0 w-48 h-48 bg-teal-500/10 rounded-full blur-2xl pointer-events-none" />

              <div className="flex items-center justify-between mb-5 pb-4 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-teal-50 border border-teal-200 flex items-center justify-center text-teal-600">
                    <Bell size={20} />
                  </div>
                  <div>
                    <h3 className="font-display font-bold text-lg text-slate-900">Subscribe for Free Weekly Updates</h3>
                    <p className="text-xs text-slate-500 font-medium">Join 25,000+ Indian entrepreneurs and CFOs</p>
                  </div>
                </div>
                <span className="hidden sm:inline-block px-3 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 text-[11px] font-bold rounded-full">
                  Zero Spam
                </span>
              </div>

              {newsletterStatus === "success" ? (
                <div className="p-8 rounded-2xl bg-emerald-50 border border-emerald-200 text-center animate-fade-in space-y-3">
                  <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-sm">
                    <Check size={24} />
                  </div>
                  <h4 className="font-display font-black text-xl text-slate-900">You're on the Gazette VIP List!</h4>
                  <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto font-medium">
                    Thank you for subscribing! We've sent your welcome edition and the <strong className="text-slate-900">2026 MSME Subsidy Checklist PDF</strong> to your email.
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

                  <div className="pt-1">
                    <button
                      type="submit"
                      disabled={newsletterStatus === "submitting"}
                      className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white font-bold text-sm shadow-md shadow-teal-500/25 flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50"
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
                      <span>1-Click Unsubscribe</span>
                    </div>
                    <div className="flex items-center justify-center gap-1">
                      <CheckCircle2 size={13} className="text-emerald-600 shrink-0" />
                      <span>Free DPR Checklist</span>
                    </div>
                  </div>
                </form>
              )}
            </div>

            {/* Right 5 Columns: Recent Gazette Releases Archive */}
            <div className="lg:col-span-5 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-display font-bold text-base text-slate-900 flex items-center gap-2">
                  <FileText size={16} className="text-teal-600" />
                  Recent Gazette Bulletins
                </h3>
                <span className="text-xs font-bold text-slate-500">2026 Archive</span>
              </div>

              <div className="space-y-3">
                {newsletterEditions.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => setSelectedBulletin(item)}
                    className="p-4 rounded-2xl bg-white border border-slate-200 hover:border-teal-500 transition-all shadow-2xs cursor-pointer hover:shadow-sm group"
                  >
                    <div className="flex items-center justify-between text-[11px] font-semibold text-slate-500 mb-1.5">
                      <span className="px-2 py-0.5 rounded-md bg-amber-50 text-amber-800 border border-amber-200 font-bold">
                        {item.edition}
                      </span>
                      <span>{item.date} · {item.readTime}</span>
                    </div>

                    <h4 className="font-display font-bold text-sm text-slate-900 group-hover:text-teal-600 transition-colors leading-snug">
                      {item.title}
                    </h4>

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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10 relative z-10">
        <div className="rounded-3xl p-8 sm:p-10 text-center relative overflow-hidden border border-teal-600/40 bg-gradient-to-r from-teal-800 via-teal-900 to-indigo-950 text-white shadow-xl">
          <h3 className="font-display font-black text-2xl sm:text-3xl text-white">
            Need Tailored Consulting or Scheme Approval Support?
          </h3>
          <p className="text-white/90 text-sm sm:text-base mt-2 max-w-xl mx-auto font-medium">
            Speak directly with our empanelled advisors for DPR drafting, subsidy filing, and bank loan approvals.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <button
              onClick={() => openConsultationModal("Resources Hub Consultation")}
              className="btn-3d inline-flex items-center gap-2 bg-white hover:bg-slate-100 text-teal-900 font-bold px-7 py-3 rounded-xl shadow-lg text-sm transition-all cursor-pointer"
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
