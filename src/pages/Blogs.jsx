import { useState, useMemo, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
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
  const [allBlogs, setAllBlogs] = useState(blogPosts);

  useEffect(() => {
    let isMounted = true;
    axios.get('/api/blogs')
      .then(res => {
        if (isMounted && res.data.success && res.data.data?.length > 0) {
          const apiBlogs = res.data.data;
          const apiSlugs = new Set(apiBlogs.map(b => b.slug));
          const nonDuplicateStatic = blogPosts.filter(b => !apiSlugs.has(b.slug));
          setAllBlogs([...apiBlogs, ...nonDuplicateStatic]);
        }
      })
      .catch(() => {});
    return () => { isMounted = false; };
  }, []);

  // Filter blog posts based on category and search query
  const filteredPosts = useMemo(() => {
    return allBlogs.filter((post) => {
      const matchesCategory =
        selectedCategory === "All" || post.category === selectedCategory;
      const matchesSearch =
        post.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.excerpt?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.category?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.keywords?.some((k) => k.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesCategory && matchesSearch;
    });
  }, [allBlogs, selectedCategory, searchQuery]);

  const featuredPost = useMemo(() => {
    return allBlogs.find((p) => p.featured) || allBlogs[0];
  }, [allBlogs]);

  return (
    <div className="relative overflow-hidden pt-6 pb-20">
      {/* ====== HERO SECTION ====== */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-12 text-center relative z-10">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-teal-50 border border-teal-200 text-teal-700 text-xs font-bold uppercase tracking-wider mb-5 animate-fade-in shadow-2xs">
          <BookOpen size={14} className="text-teal-600" />
          <span>Browse Blogs ({blogPosts.length}) & Guides</span>
        </div>

        <h1 className="font-display font-black text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-slate-900 tracking-tight leading-tight max-w-4xl mx-auto">
          Authoritative Guides for <span className="text-teal-600">MSMEs & Startups</span>
        </h1>

        <p className="mt-5 text-slate-600 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed font-normal">
          Comprehensive, verified guides covering government subsidies, loan schemes, corporate registrations, IP protection, and high-impact digital growth strategies.
        </p>

        {/* Quick link to Newsletter */}
        <div className="mt-4 flex items-center justify-center gap-2 text-xs font-semibold text-slate-600">
          <span>Want weekly subsidy alerts directly in your inbox?</span>
          <Link to="/newsletter" className="text-teal-700 hover:text-teal-800 font-bold underline inline-flex items-center gap-1">
            <span>Subscribe to Newsletter</span>
            <ArrowRight size={13} />
          </Link>
        </div>

        {/* Search Bar & Stats */}
        <div className="mt-8 max-w-2xl mx-auto">
          <div className="relative flex items-center">
            <Search className="absolute left-4 text-slate-400" size={20} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search schemes, loans, registrations, FSSAI, ISO..."
              className="w-full pl-12 pr-4 py-3.5 bg-white border border-slate-200 rounded-2xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500/50 focus:border-teal-500 transition-all text-sm sm:text-base shadow-sm"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-4 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-slate-100 px-2 py-1 rounded-md cursor-pointer"
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
                    ? "bg-teal-600 text-white shadow-md shadow-teal-600/20 scale-105"
                    : "bg-white text-slate-700 hover:bg-slate-50 border border-slate-200 hover:text-slate-900 shadow-2xs"
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
          <div className="relative rounded-3xl overflow-hidden border border-slate-200/90 bg-white p-6 sm:p-10 shadow-md">
            <div className="grid lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-8">
                <div className="flex flex-wrap items-center gap-3 mb-4">
                  <span className="px-3 py-1 rounded-full bg-teal-50 border border-teal-200 text-teal-700 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
                    <Sparkles size={13} className="text-amber-500" /> Featured Guide
                  </span>
                  <span className="text-xs text-slate-500 flex items-center gap-1 font-medium">
                    <Tag size={13} className="text-slate-400" /> {featuredPost.category}
                  </span>
                  <span className="text-xs text-slate-500 flex items-center gap-1 font-medium">
                    <Clock size={13} /> {featuredPost.readTime}
                  </span>
                </div>

                <h2 className="font-display font-bold text-2xl sm:text-3xl md:text-4xl text-slate-900 leading-tight">
                  <Link to={`/blog/${featuredPost.slug}`} className="hover:text-teal-600 transition-colors">
                    {featuredPost.title}
                  </Link>
                </h2>

                <p className="text-slate-600 mt-4 text-sm sm:text-base leading-relaxed line-clamp-3 font-normal">
                  {featuredPost.excerpt}
                </p>

                <div className="mt-6 flex flex-wrap items-center gap-4">
                  <Link
                    to={`/blog/${featuredPost.slug}`}
                    className="btn-3d inline-flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white font-bold px-6 py-3 rounded-xl shadow-md text-sm transition-all"
                  >
                    <span>Read Full Guide</span>
                    <ArrowRight size={16} />
                  </Link>

                  <button
                    onClick={() => openConsultationModal(featuredPost.title)}
                    className="inline-flex items-center gap-2 bg-white hover:bg-slate-50 text-slate-700 hover:text-slate-900 font-semibold px-5 py-3 rounded-xl border border-slate-200 text-sm transition-all shadow-2xs cursor-pointer"
                  >
                    <ShieldCheck size={16} className="text-teal-600" />
                    <span>Get Advisory Assistance</span>
                  </button>
                </div>
              </div>

              <div className="lg:col-span-4 hidden lg:flex flex-col justify-center bg-slate-50 p-6 rounded-2xl border border-slate-200">
                <div className="text-xs font-bold text-teal-700 uppercase tracking-wider mb-2">
                  What's Inside This Guide
                </div>
                <ul className="space-y-2.5 text-xs text-slate-700 font-medium">
                  {featuredPost.tableOfContents.slice(0, 5).map((toc) => (
                    <li key={toc.id} className="flex items-start gap-2">
                      <CheckCircle2 size={14} className="text-teal-600 shrink-0 mt-0.5" />
                      <span>{toc.label}</span>
                    </li>
                  ))}
                  {featuredPost.tableOfContents.length > 5 && (
                    <li className="text-slate-500 italic pl-5">
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
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-200">
          <div className="flex items-center gap-2">
            <Filter size={18} className="text-teal-600" />
            <h3 className="font-display font-bold text-slate-900 text-xl">
              {selectedCategory === "All" ? "All Knowledge Base Articles" : `${selectedCategory} Guides`}
            </h3>
            <span className="ml-2 px-2.5 py-0.5 rounded-full bg-teal-50 text-xs font-bold text-teal-700 border border-teal-200">
              {filteredPosts.length}
            </span>
          </div>

          {searchQuery && (
            <p className="text-xs text-slate-500 font-medium">
              Showing results for "<span className="text-slate-900 font-semibold">{searchQuery}</span>"
            </p>
          )}
        </div>

        {filteredPosts.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 p-8 shadow-xs">
            <BookOpen size={48} className="mx-auto text-slate-400 mb-4" />
            <h4 className="font-display font-bold text-slate-900 text-lg">No articles found</h4>
            <p className="text-slate-600 text-sm mt-2 max-w-md mx-auto">
              We couldn't find any guides matching "{searchQuery}". Try searching for terms like "PMEGP", "ISO", "FSSAI", "OPC", or "CGTMSE".
            </p>
            <button
              onClick={() => {
                setSearchQuery("");
                setSelectedCategory("All");
              }}
              className="mt-5 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-teal-600 text-white text-xs font-bold hover:bg-teal-700 transition-all cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {filteredPosts.map((post) => (
              <article
                key={post._id || post.slug || post.id}
                className="group relative rounded-2xl bg-white border border-slate-200/90 hover:border-teal-500 p-6 flex flex-col justify-between transition-all duration-300 hover:shadow-md hover:-translate-y-1"
              >
                <div>
                  {/* Category & Read Time */}
                  <div className="flex items-center justify-between text-xs text-slate-500 mb-3.5 font-medium">
                    <span className="px-2.5 py-1 rounded-lg bg-teal-50 text-teal-700 border border-teal-200 font-semibold">
                      {post.category}
                    </span>
                    <span className="flex items-center gap-1 text-slate-500">
                      <Clock size={12} />
                      {post.readTime}
                    </span>
                  </div>

                  {/* Title */}
                  <h4 className="font-display font-bold text-lg sm:text-xl text-slate-900 group-hover:text-teal-600 transition-colors leading-snug line-clamp-2">
                    <Link to={`/blog/${post.slug}`}>
                      {post.title}
                    </Link>
                  </h4>

                  {/* Excerpt */}
                  <p className="mt-3 text-xs sm:text-sm text-slate-600 leading-relaxed line-clamp-3 font-normal">
                    {post.excerpt}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-[11px] text-slate-500 font-medium">
                    <Calendar size={12} />
                    <span>{post.date}</span>
                  </div>

                  <Link
                    to={`/blog/${post.slug}`}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-teal-600 group-hover:text-teal-700 transition-colors"
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
        <div className="rounded-3xl p-8 sm:p-12 text-center relative overflow-hidden border border-white/20 bg-gradient-to-r from-green-500 via-blue-500 to-green-500 text-white shadow-xl">
          <h3 className="font-display font-black text-2xl sm:text-3xl md:text-4xl text-white">
            Need Personalized Assistance for Your Business?
          </h3>
          <p className="text-white/90 text-sm sm:text-base mt-3 max-w-xl mx-auto font-medium">
            Our empanelled team of financial and legal advisors assists you from DPR structuring to bank sanctions and statutory licensing.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-4">
            <button
              onClick={() => openConsultationModal("Knowledge Hub Banner")}
              className="btn-3d inline-flex items-center gap-2 bg-white hover:bg-slate-100 text-slate-900 font-bold px-7 py-3.5 rounded-xl shadow-lg text-sm transition-all cursor-pointer"
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
