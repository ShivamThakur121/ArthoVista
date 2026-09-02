import { useState, useMemo, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import axios from "axios";
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

  // Find post matching slug (check static data first, then dynamic API)
  const staticPost = useMemo(() => {
    return blogPosts.find((p) => p.slug === slug);
  }, [slug]);

  const [dynamicPost, setDynamicPost] = useState(null);

  useEffect(() => {
    if (!staticPost) {
      axios.get(`/api/blogs/${slug}`)
        .then(res => {
          if (res.data.success) {
            setDynamicPost(res.data.data);
          }
        })
        .catch(() => {});
    }
  }, [slug, staticPost]);

  const post = staticPost || dynamicPost;

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

  const formatMarkdown = (text) => {
    if (!text) return null;
    return text.split("\n").map((line, lIdx) => {
      const isBullet = line.trim().startsWith("•") || line.trim().startsWith("-");
      const cleanLine = isBullet ? line.trim().replace(/^[•-]\s*/, "") : line;
      const parts = cleanLine.split(/(\*\*.*?\*\*)/g);
      
      const parsedParts = parts.map((part, pIdx) => {
        if (part.startsWith("**") && part.endsWith("**")) {
          return (
            <strong key={pIdx} className="font-bold text-slate-900">
              {part.slice(2, -2)}
            </strong>
          );
        }
        return part;
      });

      if (isBullet) {
        return (
          <div key={lIdx} className="flex items-start gap-2 my-1">
            <span className="text-teal-600 font-bold mt-0.5">•</span>
            <span>{parsedParts}</span>
          </div>
        );
      }

      return (
        <p key={lIdx} className="my-1.5">
          {parsedParts}
        </p>
      );
    });
  };

  return (
    <div className="relative pt-6 pb-24 overflow-hidden">
      {/* ====== BREADCRUMBS & HEADER ====== */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Breadcrumb navigation */}
        <nav className="flex items-center gap-2 text-xs text-slate-500 mb-6 flex-wrap font-medium">
          <Link to="/" className="hover:text-teal-600 transition-colors">Home</Link>
          <span>/</span>
          <Link to="/blogs" className="hover:text-teal-600 transition-colors">Knowledge Hub</Link>
          <span>/</span>
          <span className="text-teal-700 font-semibold">{post.category}</span>
        </nav>

        {/* Title & Metadata */}
        <div className="max-w-4xl">
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <span className="px-3 py-1 rounded-lg bg-teal-50 text-teal-700 border border-teal-200 text-xs font-bold uppercase tracking-wider">
              {post.category}
            </span>
            <span className="text-xs text-slate-500 flex items-center gap-1.5 font-medium">
              <Clock size={13} /> {post.readTime}
            </span>
            <span className="text-xs text-slate-500 flex items-center gap-1.5 font-medium">
              <Calendar size={13} /> Updated {post.date}
            </span>
          </div>

          <h1 className="font-display font-black text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-slate-900 leading-tight">
            {post.title}
          </h1>

          <p className="text-slate-700 mt-5 text-base sm:text-lg leading-relaxed border-l-4 border-teal-600 pl-4 bg-teal-50/80 py-3 rounded-r-xl font-normal">
            {post.excerpt}
          </p>

          {/* Social Share Strip */}
          <div className="mt-6 flex items-center gap-2 pt-4 border-t border-slate-200">
            <span className="text-xs text-slate-500 font-semibold flex items-center gap-1.5 mr-2">
              <Share2 size={13} /> Share Guide:
            </span>
            <a
              href={`https://wa.me/?text=${shareTitle}%20${shareUrl}`}
              target="_blank"
              rel="noreferrer"
              className="p-2 rounded-lg bg-green-50 hover:bg-green-100 text-green-700 border border-green-200 transition-all text-xs flex items-center gap-1 font-medium shadow-2xs"
              title="Share on WhatsApp"
            >
              <MessageCircle size={14} /> WhatsApp
            </a>
            <a
              href={`https://www.linkedin.com/sharing/share-offsite/?url=${shareUrl}`}
              target="_blank"
              rel="noreferrer"
              className="p-2 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 transition-all text-xs flex items-center gap-1 font-medium shadow-2xs"
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
              className="p-2 rounded-lg bg-sky-50 hover:bg-sky-100 text-sky-700 border border-sky-200 transition-all text-xs flex items-center gap-1 font-medium shadow-2xs"
              title="Share on Twitter"
            >
              <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
              </svg>
              <span>X / Twitter</span>
            </a>
            <button
              onClick={handleCopyLink}
              className="p-2 rounded-lg bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 transition-all text-xs flex items-center gap-1 font-medium cursor-pointer shadow-2xs"
              title="Copy Link"
            >
              {copied ? <Check size={14} className="text-teal-600" /> : <Copy size={14} />}
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
                    <div key={section.id} className="text-slate-700 text-base sm:text-lg leading-relaxed font-normal">
                      <p>{section.content}</p>
                    </div>
                  );

                case "content":
                  return (
                    <section key={section.id} id={section.id} className="scroll-mt-24">
                      {section.title && (
                        <h2 className="font-display font-bold text-xl sm:text-2xl text-slate-900 mb-4 flex items-center gap-2 border-b border-slate-200 pb-3">
                          <span className="w-2 h-2 rounded-full bg-teal-600"></span>
                          {section.title}
                        </h2>
                      )}
                      <div className="text-slate-700 leading-relaxed space-y-2 text-sm sm:text-base font-normal">
                        {formatMarkdown(section.content)}
                      </div>
                    </section>
                  );

                case "table":
                  return (
                    <section key={section.id} id={section.id} className="scroll-mt-24">
                      {section.title && (
                        <h2 className="font-display font-bold text-xl sm:text-2xl text-slate-900 mb-4 flex items-center gap-2 border-b border-slate-200 pb-3">
                          <span className="w-2 h-2 rounded-full bg-teal-600"></span>
                          {section.title}
                        </h2>
                      )}
                      {section.description && (
                        <p className="text-slate-600 text-sm mb-4 font-medium">{section.description}</p>
                      )}
                      <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-xs">
                        <table className="w-full text-left text-xs sm:text-sm">
                          <thead className="bg-slate-100 text-teal-800 uppercase tracking-wider font-bold border-b border-slate-200">
                            <tr>
                              {section.tableData.headers.map((h, i) => (
                                <th key={i} className="px-4 sm:px-6 py-3.5">{h}</th>
                              ))}
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100">
                            {section.tableData.rows.map((row, rIdx) => (
                              <tr key={rIdx} className="hover:bg-slate-50 transition-colors">
                                {row.map((cell, cIdx) => (
                                  <td key={cIdx} className={`px-4 sm:px-6 py-3.5 text-slate-700 ${cIdx === 0 ? "font-bold text-slate-900" : ""}`}>
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
                        <h2 className="font-display font-bold text-xl sm:text-2xl text-slate-900 mb-6 flex items-center gap-2 border-b border-slate-200 pb-3">
                          <span className="w-2 h-2 rounded-full bg-teal-600"></span>
                          {section.title}
                        </h2>
                      )}
                      <div className="space-y-4">
                        {section.steps.map((s, idx) => (
                          <div
                            key={idx}
                            className="flex items-start gap-4 p-5 rounded-2xl bg-white border border-slate-200/90 shadow-xs hover:border-teal-500 transition-all"
                          >
                            <div className="w-8 h-8 rounded-xl bg-teal-50 text-teal-700 font-black flex items-center justify-center shrink-0 border border-teal-200 text-sm">
                              {s.step}
                            </div>
                            <div>
                              <h4 className="font-display font-bold text-slate-900 text-base">
                                {s.title}
                              </h4>
                              <p className="text-slate-600 text-xs sm:text-sm mt-1 leading-relaxed">
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
                        <h2 className="font-display font-bold text-xl sm:text-2xl text-slate-900 mb-6 flex items-center gap-2 border-b border-slate-200 pb-3">
                          <span className="w-2 h-2 rounded-full bg-teal-600"></span>
                          {section.title}
                        </h2>
                      )}
                      <div className="grid sm:grid-cols-2 gap-6">
                        {section.businessDocs && (
                          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs">
                            <h4 className="font-display font-bold text-teal-700 text-sm uppercase tracking-wider mb-3 flex items-center gap-2">
                              <FileText size={16} /> Business & KYC Records
                            </h4>
                            <ul className="space-y-2.5 text-xs sm:text-sm text-slate-700 font-medium">
                              {section.businessDocs.map((doc, dIdx) => (
                                <li key={dIdx} className="flex items-start gap-2">
                                  <CheckCircle2 size={15} className="text-teal-600 shrink-0 mt-0.5" />
                                  <span>{doc}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                        {section.systemDocs && (
                          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs">
                            <h4 className="font-display font-bold text-amber-700 text-sm uppercase tracking-wider mb-3 flex items-center gap-2">
                              <Landmark size={16} /> Technical / Project Records
                            </h4>
                            <ul className="space-y-2.5 text-xs sm:text-sm text-slate-700 font-medium">
                              {section.systemDocs.map((doc, dIdx) => (
                                <li key={dIdx} className="flex items-start gap-2">
                                  <CheckCircle2 size={15} className="text-amber-600 shrink-0 mt-0.5" />
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
                        <h2 className="font-display font-bold text-xl sm:text-2xl text-slate-900 mb-6 flex items-center gap-2 border-b border-slate-200 pb-3">
                          <span className="w-2 h-2 rounded-full bg-teal-600"></span>
                          {section.title}
                        </h2>
                      )}
                      <div className="grid sm:grid-cols-2 gap-4">
                        {section.cards.map((c, cIdx) => (
                          <div
                            key={cIdx}
                            className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs hover:border-teal-500 transition-all"
                          >
                            <h4 className="font-display font-bold text-slate-900 text-base">
                              {c.title}
                            </h4>
                            <p className="text-slate-600 text-xs sm:text-sm mt-1.5 leading-relaxed">
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
                        <h2 className="font-display font-bold text-xl sm:text-2xl text-slate-900 mb-4 flex items-center gap-2 border-b border-slate-200 pb-3">
                          <span className="w-2 h-2 rounded-full bg-teal-600"></span>
                          {section.title}
                        </h2>
                      )}
                      <div
                        className={`p-6 rounded-2xl border ${
                          section.calloutType === "warning"
                            ? "bg-rose-50 border-rose-200 text-slate-800"
                            : "bg-teal-50/90 border-teal-200 text-slate-800"
                        }`}
                      >
                        <div className="flex items-center gap-2 font-bold mb-3">
                          {section.calloutType === "warning" ? (
                            <AlertTriangle className="text-rose-600" size={18} />
                          ) : (
                            <Info className="text-teal-700" size={18} />
                          )}
                          <span className="text-sm uppercase tracking-wider font-bold text-slate-900">
                            {section.calloutType === "warning" ? "Caution & Common Pitfalls" : "Important Advisory Notice"}
                          </span>
                        </div>
                        <ul className="space-y-2 text-xs sm:text-sm text-slate-700 font-medium">
                          {section.items.map((item, idx) => (
                            <li key={idx} className="flex items-start gap-2">
                              <span className="text-teal-600 mt-1">•</span>
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
                        <h2 className="font-display font-bold text-xl sm:text-2xl text-slate-900 mb-4 flex items-center gap-2 border-b border-slate-200 pb-3">
                          <span className="w-2 h-2 rounded-full bg-teal-600"></span>
                          {section.title}
                        </h2>
                      )}
                      {section.content && (
                        <p className="text-slate-700 text-sm mb-3 font-medium">{section.content}</p>
                      )}
                      <ul className="space-y-2.5 text-xs sm:text-sm text-slate-700 font-medium">
                        {section.items.map((item, idx) => (
                          <li key={idx} className="flex items-start gap-2 bg-white p-3 rounded-xl border border-slate-200/90 shadow-2xs">
                            <CheckCircle2 size={15} className="text-teal-600 shrink-0 mt-0.5" />
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
              <section id="faqs" className="scroll-mt-24 pt-6 border-t border-slate-200">
                <h2 className="font-display font-bold text-2xl text-slate-900 mb-6 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-teal-600"></span>
                  Frequently Asked Questions
                </h2>

                <div className="space-y-3">
                  {post.faqs.map((faq, fIdx) => {
                    const isOpen = openFaqIndex === fIdx;
                    return (
                      <div
                        key={fIdx}
                        className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-xs transition-all"
                      >
                        <button
                          onClick={() => setOpenFaqIndex(isOpen ? null : fIdx)}
                          className="w-full p-5 text-left flex items-center justify-between gap-4 text-sm sm:text-base font-semibold text-slate-900 hover:text-teal-600 transition-colors cursor-pointer"
                        >
                          <span>{faq.q}</span>
                          {isOpen ? (
                            <ChevronUp size={18} className="text-teal-600 shrink-0" />
                          ) : (
                            <ChevronDown size={18} className="text-slate-400 shrink-0" />
                          )}
                        </button>

                        {isOpen && (
                          <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100 bg-slate-50/50 animate-fade-in font-medium">
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
            <div className="p-8 rounded-3xl bg-gradient-to-r from-green-500 via-blue-500 to-green-500 border border-white/20 text-center relative overflow-hidden shadow-xl text-white">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 text-white text-xs font-bold uppercase tracking-wider mb-3 shadow-xs">
                <Sparkles size={14} className="text-amber-300" /> Professional Execution Support
              </div>
              <h3 className="font-display font-bold text-2xl text-white">
                Need Help Navigating {post.title.split(":")[0]}?
              </h3>
              <p className="text-white/90 text-sm mt-2.5 max-w-lg mx-auto font-medium">
                Speak directly with our empanelled advisors for eligibility assessment, DPR structuring, and end-to-end statutory execution.
              </p>
              <button
                onClick={() => openConsultationModal(post.title)}
                className="btn-3d mt-5 inline-flex items-center gap-2 bg-white hover:bg-slate-100 text-slate-900 font-bold px-7 py-3.5 rounded-xl shadow-lg text-sm transition-all cursor-pointer"
              >
                <span>Book 1-on-1 Strategy Session</span>
                <ArrowRight size={16} />
              </button>
            </div>

            {/* Legal Disclaimer Badge */}
            <div className="p-4 rounded-xl bg-white border border-slate-200 text-xs text-slate-500 leading-relaxed shadow-2xs">
              <span className="font-bold text-slate-700">DISCLAIMER:</span> This article is intended for general informational purposes and reflects regulatory/scheme guidelines current as of August 2026. Official scheme guidelines, statutory fees, and lending policies are subject to updates by government authorities and financial institutions.
            </div>
          </main>

          {/* Sidebar / Sticky Table of Contents (4 cols) */}
          <aside className="lg:col-span-4 space-y-8">
            <div className="sticky top-24 space-y-6">
              
              {/* Table of Contents */}
              <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-md">
                <h4 className="font-display font-bold text-slate-900 text-sm uppercase tracking-wider mb-4 flex items-center gap-2">
                  <Tag size={16} className="text-teal-600" /> Table of Contents
                </h4>
                <nav className="space-y-1.5 text-xs font-medium">
                  {post.tableOfContents.map((toc) => {
                    const isActive = activeToc === toc.id;
                    return (
                      <a
                        key={toc.id}
                        href={`#${toc.id}`}
                        className={`block py-1.5 px-3 rounded-lg transition-all ${
                          isActive
                            ? "bg-teal-600 text-white font-bold translate-x-1 shadow-xs"
                            : "text-slate-600 hover:text-teal-600 hover:bg-slate-50"
                        }`}
                      >
                        {toc.label}
                      </a>
                    );
                  })}
                </nav>
              </div>

              {/* Consultation Card */}
              <div className="p-6 rounded-2xl bg-white border border-teal-200 text-center shadow-md">
                <ShieldCheck size={32} className="mx-auto text-teal-600 mb-3" />
                <h4 className="font-display font-bold text-slate-900 text-base">
                  Expert Advisory
                </h4>
                <p className="text-slate-600 text-xs mt-1.5 leading-relaxed font-medium">
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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-20 pt-12 border-t border-slate-200 relative z-10">
          <div className="flex items-center justify-between mb-8">
            <h3 className="font-display font-bold text-slate-900 text-2xl">
              Related Guides & Insights
            </h3>
            <Link
              to="/blogs"
              className="text-xs font-bold text-teal-600 hover:text-teal-700 flex items-center gap-1"
            >
              <span>View All</span> <ArrowRight size={14} />
            </Link>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {relatedPosts.map((rel) => (
              <Link
                key={rel.id}
                to={`/blog/${rel.slug}`}
                className="group p-5 rounded-2xl bg-white border border-slate-200 shadow-xs hover:border-teal-500 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between text-xs text-slate-500 mb-2.5">
                    <span className="px-2 py-0.5 rounded bg-teal-50 text-teal-700 font-semibold">
                      {rel.category}
                    </span>
                    <span>{rel.readTime}</span>
                  </div>
                  <h4 className="font-display font-bold text-slate-900 text-sm group-hover:text-teal-600 transition-colors line-clamp-2">
                    {rel.title}
                  </h4>
                  <p className="text-slate-600 text-xs mt-2 line-clamp-2 font-normal">
                    {rel.excerpt}
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-teal-600 font-semibold">
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
