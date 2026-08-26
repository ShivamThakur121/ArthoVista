// src/pages/Blogs.jsx
import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { 
  Search, BookOpen, Clock, Calendar, ArrowRight, 
  Sparkles, Filter, ShieldCheck, Tag, CheckCircle2, TrendingUp 
} from "lucide-react";
import useDocumentMetadata from "../hooks/useDocumentMetadata";
import { blogPosts, categories } from "../data/blogData";
import { useConsultation } from "../context/ConsultationContext";

export default function Blogs() {
  useDocumentMetadata(
    "Knowledge Hub & MSME Insights | ArthoVista",
    "Explore in-depth business guides, MSME scheme breakdowns (PMEGP, PMFME, CGTMSE), company registration steps, ISO certifications, loans, and SEO strategies for Indian enterprises."
  );

  const { openConsultationModal } = useConsultation();
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  // Filter blog posts based on category and search query
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

  return (
    <div className="relative overflow-hidden pt-6 pb-20">
      {/* Background ambient lighting */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-teal-500/10 blur-[140px] rounded-full pointer-events-none" />
      <div className="absolute top-80 right-10 w-[400px] h-[400px] bg-amber-500/08 blur-[150px] rounded-full pointer-events-none" />

      {/* ====== HERO SECTION ====== */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-12 text-center relative z-10">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-teal-500/10 border border-teal-500/25 text-teal-400 text-xs font-bold uppercase tracking-wider mb-5 animate-fade-in shadow-sm">
          <BookOpen size={14} className="text-teal-400" />
          <span>ArthoVista Knowledge Hub</span>
        </div>

        <h1 className="font-display font-black text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-white tracking-tight leading-tight max-w-4xl mx-auto drop-shadow-lg">
          Authoritative Insights for <span className="bg-gradient-to-r from-teal-400 via-emerald-400 to-amber-300 bg-clip-text text-transparent">MSMEs & Startups</span>
        </h1>

        <p className="mt-5 text-slate-200 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed drop-shadow-md font-medium">
          Comprehensive, verified guides covering government subsidies, loan schemes, corporate registrations, IP protection, and high-impact digital growth strategies.
        </p>

        {/* Search Bar & Stats */}
        <div className="mt-8 max-w-2xl mx-auto">
          <div className="relative flex items-center">
            <Search className="absolute left-4 text-slate-400" size={20} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search schemes, loans, registrations, FSSAI, ISO..."
              className="w-full pl-12 pr-4 py-3.5 bg-slate-800/90 border border-slate-700/80 rounded-2xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500/50 focus:border-teal-500 transition-all text-sm sm:text-base backdrop-blur-md shadow-xl"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-4 text-xs font-semibold text-slate-400 hover:text-white bg-slate-700 px-2 py-1 rounded-md"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Category Pills */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-2 max-w-5xl mx-auto">
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                  isSelected
                    ? "bg-teal-600 text-white shadow-md shadow-teal-600/30 scale-105"
                    : "bg-slate-800/70 text-slate-300 hover:bg-slate-700/80 border border-slate-700/60 hover:text-white"
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </div>

      {/* ====== FEATURED ARTICLE SPOTLIGHT (When viewing 'All' and no search) ====== */}
      {selectedCategory === "All" && !searchQuery && featuredPost && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-14 relative z-10">
          <div className="relative rounded-3xl overflow-hidden border border-teal-500/30 bg-gradient-to-br from-slate-900/95 via-slate-800/90 to-teal-950/40 p-6 sm:p-10 shadow-2xl backdrop-blur-md">
            <div className="absolute -top-12 -right-12 w-64 h-64 bg-teal-500/15 rounded-full blur-3xl pointer-events-none" />
            
            <div className="grid lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-8">
                <div className="flex flex-wrap items-center gap-3 mb-4">
                  <span className="px-3 py-1 rounded-full bg-teal-500/20 border border-teal-500/40 text-teal-300 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
                    <Sparkles size={13} className="text-amber-400" /> Featured Guide
                  </span>
                  <span className="text-xs text-slate-400 flex items-center gap-1">
                    <Tag size={13} className="text-slate-400" /> {featuredPost.category}
                  </span>
                  <span className="text-xs text-slate-400 flex items-center gap-1">
                    <Clock size={13} /> {featuredPost.readTime}
                  </span>
                </div>

                <h2 className="font-display font-bold text-2xl sm:text-3xl md:text-4xl text-white leading-tight">
                  <Link to={`/blog/${featuredPost.slug}`} className="hover:text-teal-400 transition-colors">
                    {featuredPost.title}
                  </Link>
                </h2>

                <p className="text-slate-300 mt-4 text-sm sm:text-base leading-relaxed line-clamp-3">
                  {featuredPost.excerpt}
                </p>

                <div className="mt-6 flex flex-wrap items-center gap-4">
                  <Link
                    to={`/blog/${featuredPost.slug}`}
                    className="btn-3d inline-flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white font-bold px-6 py-3 rounded-xl shadow-lg shadow-teal-500/20 text-sm transition-all"
                  >
                    <span>Read Full Guide</span>
                    <ArrowRight size={16} />
                  </Link>

                  <button
                    onClick={() => openConsultationModal(featuredPost.title)}
                    className="inline-flex items-center gap-2 bg-slate-800/80 hover:bg-slate-700 text-slate-200 hover:text-white font-semibold px-5 py-3 rounded-xl border border-slate-700 text-sm transition-all"
                  >
                    <ShieldCheck size={16} className="text-teal-400" />
                    <span>Get Advisory Assistance</span>
                  </button>
                </div>
              </div>

              <div className="lg:col-span-4 hidden lg:flex flex-col justify-center bg-slate-800/60 p-6 rounded-2xl border border-slate-700/60">
                <div className="text-xs font-bold text-teal-400 uppercase tracking-wider mb-2">
                  What's Inside This Guide
                </div>
                <ul className="space-y-2.5 text-xs text-slate-300">
                  {featuredPost.tableOfContents.slice(0, 5).map((toc) => (
                    <li key={toc.id} className="flex items-start gap-2">
                      <CheckCircle2 size={14} className="text-teal-400 shrink-0 mt-0.5" />
                      <span>{toc.label}</span>
                    </li>
                  ))}
                  {featuredPost.tableOfContents.length > 5 && (
                    <li className="text-slate-400 italic pl-5">
                      + {featuredPost.tableOfContents.length - 5} more sections & FAQs...
                    </li>
                  )}
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ====== ARTICLE GRID ====== */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Filter size={18} className="text-teal-400" />
            <h3 className="font-display font-bold text-white text-xl">
              {selectedCategory === "All" ? "All Knowledge Base Articles" : `${selectedCategory} Guides`}
            </h3>
            <span className="ml-2 px-2.5 py-0.5 rounded-full bg-slate-800 text-xs font-bold text-teal-400 border border-slate-700">
              {filteredPosts.length}
            </span>
          </div>

          {searchQuery && (
            <p className="text-xs text-slate-400">
              Showing results for "<span className="text-white font-medium">{searchQuery}</span>"
            </p>
          )}
        </div>

        {filteredPosts.length === 0 ? (
          <div className="text-center py-16 bg-slate-900/60 rounded-3xl border border-slate-800 p-8">
            <BookOpen size={48} className="mx-auto text-slate-600 mb-4" />
            <h4 className="font-display font-bold text-white text-lg">No articles found</h4>
            <p className="text-slate-400 text-sm mt-2 max-w-md mx-auto">
              We couldn't find any guides matching "{searchQuery}". Try searching for terms like "PMEGP", "ISO", "FSSAI", "OPC", or "CGTMSE".
            </p>
            <button
              onClick={() => {
                setSearchQuery("");
                setSelectedCategory("All");
              }}
              className="mt-5 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-teal-600 text-white text-xs font-bold hover:bg-teal-700 transition-all"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {filteredPosts.map((post) => (
              <article
                key={post.id}
                className="group relative rounded-2xl bg-slate-900/80 hover:bg-slate-850 border border-slate-800 hover:border-teal-500/40 p-6 flex flex-col justify-between transition-all duration-300 hover:shadow-xl hover:shadow-teal-900/10 hover:-translate-y-1 backdrop-blur-sm"
              >
                <div>
                  {/* Category & Read Time */}
                  <div className="flex items-center justify-between text-xs text-slate-400 mb-3.5">
                    <span className="px-2.5 py-1 rounded-lg bg-teal-500/10 text-teal-400 border border-teal-500/20 font-semibold">
                      {post.category}
                    </span>
                    <span className="flex items-center gap-1 text-slate-400">
                      <Clock size={12} />
                      {post.readTime}
                    </span>
                  </div>

                  {/* Title */}
                  <h4 className="font-display font-bold text-lg sm:text-xl text-white group-hover:text-teal-400 transition-colors leading-snug line-clamp-2">
                    <Link to={`/blog/${post.slug}`}>
                      {post.title}
                    </Link>
                  </h4>

                  {/* Excerpt */}
                  <p className="mt-3 text-xs sm:text-sm text-slate-300 leading-relaxed line-clamp-3">
                    {post.excerpt}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
                    <Calendar size={12} />
                    <span>{post.date}</span>
                  </div>

                  <Link
                    to={`/blog/${post.slug}`}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-teal-400 group-hover:text-teal-300 transition-colors"
                  >
                    <span>Read Article</span>
                    <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>

      {/* ====== BOTTOM CTA BANNER ====== */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-20 relative z-10">
        <div className="rounded-3xl p-8 sm:p-12 text-center relative overflow-hidden border border-teal-500/20 bg-gradient-to-r from-slate-900 via-teal-950/40 to-slate-900">
          <h3 className="font-display font-black text-2xl sm:text-3xl md:text-4xl text-white">
            Need Personalized Assistance for Your Business?
          </h3>
          <p className="text-slate-300 text-sm sm:text-base mt-3 max-w-xl mx-auto">
            Our empanelled team of financial and legal advisors assists you from DPR structuring to bank sanctions and statutory licensing.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-4">
            <button
              onClick={() => openConsultationModal("Knowledge Hub Banner")}
              className="btn-3d inline-flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white font-bold px-7 py-3.5 rounded-xl shadow-lg shadow-teal-500/20 text-sm transition-all cursor-pointer"
            >
              <Sparkles size={16} className="text-amber-300" />
              <span>Book Free 1-on-1 Consultation</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
