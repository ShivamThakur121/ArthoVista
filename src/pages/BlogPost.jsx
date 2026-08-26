// src/pages/BlogPost.jsx
import { useState, useMemo, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { 
  Clock, Calendar, ArrowLeft, ArrowRight, Share2, 
  CheckCircle2, AlertTriangle, Info, FileText, 
  ChevronDown, ChevronUp, Sparkles, MessageCircle, 
  Copy, Check, ShieldCheck, Tag, Landmark
} from "lucide-react";
import useDocumentMetadata from "../hooks/useDocumentMetadata";
import { blogPosts } from "../data/blogData";
import { useConsultation } from "../context/ConsultationContext";

export default function BlogPost() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { openConsultationModal } = useConsultation();

  const [activeToc, setActiveToc] = useState("");
  const [openFaqIndex, setOpenFaqIndex] = useState(null);
  const [copied, setCopied] = useState(false);

  // Find post matching slug
  const post = useMemo(() => {
    return blogPosts.find((p) => p.slug === slug);
  }, [slug]);

  // Dynamic SEO Metadata
  useDocumentMetadata(
    post ? `${post.title} | ArthoVista Guide` : "Article Not Found | ArthoVista",
    post?.metaDescription || post?.excerpt
  );

  // Related posts (from same category or next posts)
  const relatedPosts = useMemo(() => {
    if (!post) return [];
    return blogPosts
      .filter((p) => p.id !== post.id && (p.category === post.category || p.featured))
      .slice(0, 3);
  }, [post]);

  // Scroll spy for Table of Contents
  useEffect(() => {
    if (!post) return;
    const handleScroll = () => {
      const headings = post.tableOfContents.map((t) => document.getElementById(t.id));
      const scrollPosition = window.scrollY + 180;

      for (let i = headings.length - 1; i >= 0; i--) {
        const heading = headings[i];
        if (heading && heading.offsetTop <= scrollPosition) {
          setActiveToc(post.tableOfContents[i].id);
          break;
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [post]);

  if (!post) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4 py-20">
        <h2 className="font-display font-bold text-3xl text-white">Article Not Found</h2>
        <p className="text-slate-400 mt-2 text-sm max-w-md">
          The guide you are looking for may have been moved or updated.
        </p>
        <Link
          to="/blogs"
          className="mt-6 inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-sm transition-all"
        >
          <ArrowLeft size={16} /> Back to Knowledge Hub
        </Link>
      </div>
    );
  }

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareUrl = encodeURIComponent(window.location.href);
  const shareTitle = encodeURIComponent(post.title);

  return (
    <div className="relative pt-6 pb-24 overflow-hidden">
      {/* Background glow effects */}
      <div className="absolute top-10 left-1/3 w-[600px] h-[300px] bg-teal-500/10 blur-[150px] rounded-full pointer-events-none" />
      <div className="absolute top-[600px] right-10 w-[450px] h-[450px] bg-orange-500/05 blur-[160px] rounded-full pointer-events-none" />

      {/* ====== BREADCRUMBS & HEADER ====== */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Breadcrumb navigation */}
        <nav className="flex items-center gap-2 text-xs text-slate-400 mb-6 flex-wrap">
          <Link to="/" className="hover:text-teal-400 transition-colors">Home</Link>
          <span>/</span>
          <Link to="/blogs" className="hover:text-teal-400 transition-colors">Knowledge Hub</Link>
          <span>/</span>
          <span className="text-teal-400 font-medium">{post.category}</span>
        </nav>

        {/* Title & Metadata */}
        <div className="max-w-4xl">
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <span className="px-3 py-1 rounded-lg bg-teal-500/15 text-teal-400 border border-teal-500/30 text-xs font-bold uppercase tracking-wider">
              {post.category}
            </span>
            <span className="text-xs text-slate-400 flex items-center gap-1.5">
              <Clock size={13} /> {post.readTime}
            </span>
            <span className="text-xs text-slate-400 flex items-center gap-1.5">
              <Calendar size={13} /> Updated {post.date}
            </span>
          </div>

          <h1 className="font-display font-black text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-white leading-tight">
            {post.title}
          </h1>

          <p className="text-slate-300 mt-5 text-base sm:text-lg leading-relaxed border-l-4 border-teal-500 pl-4 bg-teal-950/20 py-2 rounded-r-xl">
            {post.excerpt}
          </p>

          {/* Social Share Strip */}
          <div className="mt-6 flex items-center gap-2 pt-4 border-t border-slate-800">
            <span className="text-xs text-slate-400 font-semibold flex items-center gap-1.5 mr-2">
              <Share2 size={13} /> Share Guide:
            </span>
            <a
              href={`https://wa.me/?text=${shareTitle}%20${shareUrl}`}
              target="_blank"
              rel="noreferrer"
              className="p-2 rounded-lg bg-green-500/15 hover:bg-green-500/30 text-green-400 border border-green-500/30 transition-all text-xs flex items-center gap-1 font-medium"
              title="Share on WhatsApp"
            >
              <MessageCircle size={14} /> WhatsApp
            </a>
            <a
              href={`https://www.linkedin.com/sharing/share-offsite/?url=${shareUrl}`}
              target="_blank"
              rel="noreferrer"
              className="p-2 rounded-lg bg-blue-500/15 hover:bg-blue-500/30 text-blue-400 border border-blue-500/30 transition-all text-xs flex items-center gap-1 font-medium"
              title="Share on LinkedIn"
            >
              <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z"/>
              </svg>
              <span>LinkedIn</span>
            </a>
            <a
              href={`https://twitter.com/intent/tweet?text=${shareTitle}&url=${shareUrl}`}
              target="_blank"
              rel="noreferrer"
              className="p-2 rounded-lg bg-sky-500/15 hover:bg-sky-500/30 text-sky-400 border border-sky-500/30 transition-all text-xs flex items-center gap-1 font-medium"
              title="Share on Twitter"
            >
              <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
              </svg>
              <span>X / Twitter</span>
            </a>
            <button
              onClick={handleCopyLink}
              className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-all text-xs flex items-center gap-1 font-medium cursor-pointer"
              title="Copy Link"
            >
              {copied ? <Check size={14} className="text-teal-400" /> : <Copy size={14} />}
              <span>{copied ? "Copied!" : "Copy"}</span>
            </button>
          </div>
        </div>
      </div>

      {/* ====== MAIN ARTICLE LAYOUT ====== */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 relative z-10">
        <div className="grid lg:grid-cols-12 gap-10">
          
          {/* Article Main Content (8 cols) */}
          <main className="lg:col-span-8 space-y-12">
            {post.sections.map((section) => {
              switch (section.type) {
                case "lead":
                  return (
                    <div key={section.id} className="text-slate-200 text-base sm:text-lg leading-relaxed">
                      <p>{section.content}</p>
                    </div>
                  );

                case "content":
                  return (
                    <section key={section.id} id={section.id} className="scroll-mt-24">
                      {section.title && (
                        <h2 className="font-display font-bold text-xl sm:text-2xl text-white mb-4 flex items-center gap-2 border-b border-slate-800 pb-3">
                          <span className="w-2 h-2 rounded-full bg-teal-400"></span>
                          {section.title}
                        </h2>
                      )}
                      <div className="text-slate-300 leading-relaxed space-y-3 whitespace-pre-line text-sm sm:text-base">
                        {section.content}
                      </div>
                    </section>
                  );

                case "table":
                  return (
                    <section key={section.id} id={section.id} className="scroll-mt-24">
                      {section.title && (
                        <h2 className="font-display font-bold text-xl sm:text-2xl text-white mb-4 flex items-center gap-2 border-b border-slate-800 pb-3">
                          <span className="w-2 h-2 rounded-full bg-teal-400"></span>
                          {section.title}
                        </h2>
                      )}
                      {section.description && (
                        <p className="text-slate-300 text-sm mb-4">{section.description}</p>
                      )}
                      <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-900/90 shadow-xl">
                        <table className="w-full text-left text-xs sm:text-sm">
                          <thead className="bg-slate-800/90 text-teal-400 uppercase tracking-wider font-semibold border-b border-slate-700">
                            <tr>
                              {section.tableData.headers.map((h, i) => (
                                <th key={i} className="px-4 sm:px-6 py-3.5">{h}</th>
                              ))}
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-800">
                            {section.tableData.rows.map((row, rIdx) => (
                              <tr key={rIdx} className="hover:bg-slate-800/40 transition-colors">
                                {row.map((cell, cIdx) => (
                                  <td key={cIdx} className={`px-4 sm:px-6 py-3.5 text-slate-200 ${cIdx === 0 ? "font-semibold text-white" : ""}`}>
                                    {cell}
                                  </td>
                                ))}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </section>
                  );

                case "steps":
                  return (
                    <section key={section.id} id={section.id} className="scroll-mt-24">
                      {section.title && (
                        <h2 className="font-display font-bold text-xl sm:text-2xl text-white mb-6 flex items-center gap-2 border-b border-slate-800 pb-3">
                          <span className="w-2 h-2 rounded-full bg-teal-400"></span>
                          {section.title}
                        </h2>
                      )}
                      <div className="space-y-4">
                        {section.steps.map((s, idx) => (
                          <div
                            key={idx}
                            className="flex items-start gap-4 p-5 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-teal-500/30 transition-all shadow-md"
                          >
                            <div className="w-8 h-8 rounded-xl bg-teal-500/20 text-teal-400 font-black flex items-center justify-center shrink-0 border border-teal-500/30 text-sm">
                              {s.step}
                            </div>
                            <div>
                              <h4 className="font-display font-bold text-white text-base">
                                {s.title}
                              </h4>
                              <p className="text-slate-300 text-xs sm:text-sm mt-1 leading-relaxed">
                                {s.desc}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </section>
                  );

                case "documents":
                  return (
                    <section key={section.id} id={section.id} className="scroll-mt-24">
                      {section.title && (
                        <h2 className="font-display font-bold text-xl sm:text-2xl text-white mb-6 flex items-center gap-2 border-b border-slate-800 pb-3">
                          <span className="w-2 h-2 rounded-full bg-teal-400"></span>
                          {section.title}
                        </h2>
                      )}
                      <div className="grid sm:grid-cols-2 gap-6">
                        {section.businessDocs && (
                          <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800">
                            <h4 className="font-display font-bold text-teal-400 text-sm uppercase tracking-wider mb-3 flex items-center gap-2">
                              <FileText size={16} /> Business & KYC Records
                            </h4>
                            <ul className="space-y-2.5 text-xs sm:text-sm text-slate-300">
                              {section.businessDocs.map((doc, dIdx) => (
                                <li key={dIdx} className="flex items-start gap-2">
                                  <CheckCircle2 size={15} className="text-teal-400 shrink-0 mt-0.5" />
                                  <span>{doc}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                        {section.systemDocs && (
                          <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800">
                            <h4 className="font-display font-bold text-amber-400 text-sm uppercase tracking-wider mb-3 flex items-center gap-2">
                              <Landmark size={16} /> Technical / Project Records
                            </h4>
                            <ul className="space-y-2.5 text-xs sm:text-sm text-slate-300">
                              {section.systemDocs.map((doc, dIdx) => (
                                <li key={dIdx} className="flex items-start gap-2">
                                  <CheckCircle2 size={15} className="text-amber-400 shrink-0 mt-0.5" />
                                  <span>{doc}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    </section>
                  );

                case "cards":
                  return (
                    <section key={section.id} id={section.id} className="scroll-mt-24">
                      {section.title && (
                        <h2 className="font-display font-bold text-xl sm:text-2xl text-white mb-6 flex items-center gap-2 border-b border-slate-800 pb-3">
                          <span className="w-2 h-2 rounded-full bg-teal-400"></span>
                          {section.title}
                        </h2>
                      )}
                      <div className="grid sm:grid-cols-2 gap-4">
                        {section.cards.map((c, cIdx) => (
                          <div
                            key={cIdx}
                            className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 transition-all"
                          >
                            <h4 className="font-display font-bold text-white text-base">
                              {c.title}
                            </h4>
                            <p className="text-slate-300 text-xs sm:text-sm mt-1.5 leading-relaxed">
                              {c.desc}
                            </p>
                          </div>
                        ))}
                      </div>
                    </section>
                  );

                case "callout":
                  return (
                    <section key={section.id} id={section.id} className="scroll-mt-24">
                      {section.title && (
                        <h2 className="font-display font-bold text-xl sm:text-2xl text-white mb-4 flex items-center gap-2 border-b border-slate-800 pb-3">
                          <span className="w-2 h-2 rounded-full bg-teal-400"></span>
                          {section.title}
                        </h2>
                      )}
                      <div
                        className={`p-6 rounded-2xl border ${
                          section.calloutType === "warning"
                            ? "bg-rose-950/20 border-rose-500/30 text-rose-200"
                            : "bg-teal-950/20 border-teal-500/30 text-teal-200"
                        }`}
                      >
                        <div className="flex items-center gap-2 font-bold mb-3">
                          {section.calloutType === "warning" ? (
                            <AlertTriangle className="text-rose-400" size={18} />
                          ) : (
                            <Info className="text-teal-400" size={18} />
                          )}
                          <span className="text-sm uppercase tracking-wider text-white">
                            {section.calloutType === "warning" ? "Caution & Common Pitfalls" : "Important Advisory Notice"}
                          </span>
                        </div>
                        <ul className="space-y-2 text-xs sm:text-sm text-slate-300">
                          {section.items.map((item, idx) => (
                            <li key={idx} className="flex items-start gap-2">
                              <span className="text-teal-400 mt-1">•</span>
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </section>
                  );

                case "list":
                  return (
                    <section key={section.id} id={section.id} className="scroll-mt-24">
                      {section.title && (
                        <h2 className="font-display font-bold text-xl sm:text-2xl text-white mb-4 flex items-center gap-2 border-b border-slate-800 pb-3">
                          <span className="w-2 h-2 rounded-full bg-teal-400"></span>
                          {section.title}
                        </h2>
                      )}
                      {section.content && (
                        <p className="text-slate-300 text-sm mb-3">{section.content}</p>
                      )}
                      <ul className="space-y-2.5 text-xs sm:text-sm text-slate-300">
                        {section.items.map((item, idx) => (
                          <li key={idx} className="flex items-start gap-2 bg-slate-900/60 p-3 rounded-xl border border-slate-800/80">
                            <CheckCircle2 size={15} className="text-teal-400 shrink-0 mt-0.5" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </section>
                  );

                default:
                  return null;
              }
            })}

            {/* ====== INTERACTIVE FAQ ACCORDION ====== */}
            {post.faqs && post.faqs.length > 0 && (
              <section id="faqs" className="scroll-mt-24 pt-6 border-t border-slate-800">
                <h2 className="font-display font-bold text-2xl text-white mb-6 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-teal-400"></span>
                  Frequently Asked Questions
                </h2>

                <div className="space-y-3">
                  {post.faqs.map((faq, fIdx) => {
                    const isOpen = openFaqIndex === fIdx;
                    return (
                      <div
                        key={fIdx}
                        className="rounded-2xl border border-slate-800 bg-slate-900/80 overflow-hidden transition-all"
                      >
                        <button
                          onClick={() => setOpenFaqIndex(isOpen ? null : fIdx)}
                          className="w-full p-5 text-left flex items-center justify-between gap-4 text-sm sm:text-base font-semibold text-white hover:text-teal-400 transition-colors cursor-pointer"
                        >
                          <span>{faq.q}</span>
                          {isOpen ? (
                            <ChevronUp size={18} className="text-teal-400 shrink-0" />
                          ) : (
                            <ChevronDown size={18} className="text-slate-500 shrink-0" />
                          )}
                        </button>

                        {isOpen && (
                          <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-slate-300 leading-relaxed border-t border-slate-800/60 bg-slate-950/40 animate-fade-in">
                            {faq.a}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </section>
            )}

            {/* ====== IN-ARTICLE CTA CARD ====== */}
            <div className="p-8 rounded-3xl bg-gradient-to-br from-slate-900 via-slate-850 to-teal-950/50 border border-teal-500/30 text-center relative overflow-hidden shadow-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/20 text-teal-300 text-xs font-bold uppercase tracking-wider mb-3">
                <Sparkles size={14} className="text-amber-300" /> Professional Execution Support
              </div>
              <h3 className="font-display font-bold text-2xl text-white">
                Need Help Navigating {post.title.split(":")[0]}?
              </h3>
              <p className="text-slate-300 text-sm mt-2.5 max-w-lg mx-auto">
                Speak directly with our empanelled advisors for eligibility assessment, DPR structuring, and end-to-end statutory execution.
              </p>
              <button
                onClick={() => openConsultationModal(post.title)}
                className="btn-3d mt-5 inline-flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white font-bold px-7 py-3.5 rounded-xl shadow-lg shadow-teal-500/25 text-sm transition-all cursor-pointer"
              >
                <span>Book 1-on-1 Strategy Session</span>
                <ArrowRight size={16} />
              </button>
            </div>

            {/* Legal Disclaimer Badge */}
            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 text-xs text-slate-400 leading-relaxed">
              <span className="font-bold text-slate-300">DISCLAIMER:</span> This article is intended for general informational purposes and reflects regulatory/scheme guidelines current as of August 2026. Official scheme guidelines, statutory fees, and lending policies are subject to updates by government authorities and financial institutions.
            </div>
          </main>

          {/* Sidebar / Sticky Table of Contents (4 cols) */}
          <aside className="lg:col-span-4 space-y-8">
            <div className="sticky top-24 space-y-6">
              
              {/* Table of Contents */}
              <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl backdrop-blur-md">
                <h4 className="font-display font-bold text-white text-sm uppercase tracking-wider mb-4 flex items-center gap-2">
                  <Tag size={16} className="text-teal-400" /> Table of Contents
                </h4>
                <nav className="space-y-1.5 text-xs">
                  {post.tableOfContents.map((toc) => {
                    const isActive = activeToc === toc.id;
                    return (
                      <a
                        key={toc.id}
                        href={`#${toc.id}`}
                        className={`block py-1.5 px-3 rounded-lg transition-all ${
                          isActive
                            ? "bg-teal-600 text-white font-bold translate-x-1"
                            : "text-slate-400 hover:text-white hover:bg-slate-800/80"
                        }`}
                      >
                        {toc.label}
                      </a>
                    );
                  })}
                </nav>
              </div>

              {/* Consultation Card */}
              <div className="p-6 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-800 border border-teal-500/20 text-center shadow-lg">
                <ShieldCheck size={32} className="mx-auto text-teal-400 mb-3" />
                <h4 className="font-display font-bold text-white text-base">
                  Expert Advisory
                </h4>
                <p className="text-slate-300 text-xs mt-1.5 leading-relaxed">
                  Have questions about this scheme or compliance process? Talk to our advisory team today.
                </p>
                <button
                  onClick={() => openConsultationModal(post.title)}
                  className="mt-4 w-full py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow-md transition-all cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <Sparkles size={14} className="text-amber-300" />
                  <span>Free Consultation</span>
                </button>
              </div>

            </div>
          </aside>

        </div>
      </div>

      {/* ====== RELATED POSTS ====== */}
      {relatedPosts.length > 0 && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-20 pt-12 border-t border-slate-800 relative z-10">
          <div className="flex items-center justify-between mb-8">
            <h3 className="font-display font-bold text-white text-2xl">
              Related Guides & Insights
            </h3>
            <Link
              to="/blogs"
              className="text-xs font-bold text-teal-400 hover:text-teal-300 flex items-center gap-1"
            >
              <span>View All</span> <ArrowRight size={14} />
            </Link>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {relatedPosts.map((rel) => (
              <Link
                key={rel.id}
                to={`/blog/${rel.slug}`}
                className="group p-5 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-teal-500/40 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between text-xs text-slate-400 mb-2.5">
                    <span className="px-2 py-0.5 rounded bg-teal-500/10 text-teal-400 font-semibold">
                      {rel.category}
                    </span>
                    <span>{rel.readTime}</span>
                  </div>
                  <h4 className="font-display font-bold text-white text-sm group-hover:text-teal-400 transition-colors line-clamp-2">
                    {rel.title}
                  </h4>
                  <p className="text-slate-400 text-xs mt-2 line-clamp-2">
                    {rel.excerpt}
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-slate-800/60 flex items-center justify-between text-xs text-teal-400 font-semibold">
                  <span>Read Guide</span>
                  <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
