import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import {
  BookOpen, Plus, Search, Filter, Edit3, Trash2, Eye,
  Sparkles, CheckCircle2, AlertCircle, Clock, Tag, Globe,
  FileText, ExternalLink, X, Save, RefreshCw, Send, Copy, Check,
  Wand2, Zap, ArrowRight, HelpCircle
} from 'lucide-react';
import { categories as defaultCategories } from '../../data/blogData';

// Pre-built trending daily blog templates for 1-click generation
const blogPresets = [
  {
    topic: 'PMEGP 2026 35% Subsidy Guidelines',
    title: 'PMEGP Scheme 2026: Complete 35% Capital Subsidy Guidelines, Eligibility & DPR Checklist',
    slug: 'pmegp-subsidy-guidelines-2026',
    category: 'Government Schemes',
    readTime: '7 min read',
    excerpt: 'Comprehensive roadmap for manufacturing and service entrepreneurs to secure up to ₹50 Lakhs project funding with 35% rural capital subsidies through KVIC.',
    metaDescription: 'Complete PMEGP 2026 subsidy guide. Learn eligibility rules, 35% capital subsidy calculations, nodal bank application process, and DPR preparation.',
    keywords: 'PMEGP 2026, KVIC subsidy, MSME manufacturing grant, 35% rural subsidy, DPR project report',
    sections: [
      {
        id: 'overview',
        title: 'Overview of PMEGP Scheme 2026',
        content: 'The Prime Minister Employment Generation Programme (PMEGP) is a credit-linked subsidy programme administered by the Ministry of MSME through KVIC. The project cost ceiling for manufacturing has been updated up to ₹50 Lakhs and ₹20 Lakhs for service enterprises.',
        bullets: [
          'Up to 35% capital subsidy for rural area units (Special Category)',
          '25% subsidy for urban area units under special categories',
          'Beneficiary contribution restricted to 5% - 10% of total project cost'
        ]
      },
      {
        id: 'eligibility',
        title: 'Eligibility Criteria & Beneficiary Categories',
        content: 'Any individual above 18 years of age with at least 8th standard pass qualification for projects above ₹10 Lakhs in manufacturing or ₹5 Lakhs in service sector can apply.',
        bullets: [
          'General Category: 15% Urban, 25% Rural subsidy',
          'Special Category (Women, SC/ST, OBC, Ex-Servicemen, PWD): 25% Urban, 35% Rural subsidy',
          'Self Help Groups and Co-operative societies are also eligible'
        ]
      },
      {
        id: 'dpr-checklist',
        title: 'Mandatory DPR & Document Checklist',
        content: 'A detailed project report prepared by empanelled chartered accountants or MSME financial advisors is crucial for nodal bank sanction and margin money clearance.',
        bullets: [
          'Detailed Project Report (DPR) with 3-year cash flow projections',
          'Aadhaar Card, PAN, and Caste/Category Certificate',
          'Rural Area Certificate verified by local Gram Panchayat / Tehsildar',
          'Machinery quotations and factory lease agreement'
        ]
      }
    ]
  },
  {
    topic: 'CGTMSE ₹5 Crore Collateral-Free Loans',
    title: 'CGTMSE Scheme Guide: How MSMEs Can Get Collateral-Free Bank Loans Up to ₹5 Crore',
    slug: 'cgtmse-collateral-free-loan-guide',
    category: 'Business Finance',
    readTime: '6 min read',
    excerpt: 'Step-by-step framework to secure working capital and term loans up to ₹500 Lakhs without pledging property or personal collateral under CGTMSE trust.',
    metaDescription: 'CGTMSE collateral-free loan guide for Indian businesses. Understand eligibility, bank guarantee coverage, annual fee structure, and sanction process.',
    keywords: 'CGTMSE loan, collateral free business loan, MSME bank credit, SIDBI guarantee, working capital loan',
    sections: [
      {
        id: 'overview',
        title: 'What is the CGTMSE Credit Guarantee Scheme?',
        content: 'Credit Guarantee Fund Trust for Micro and Small Enterprises (CGTMSE) was jointly set up by the Ministry of MSME and SIDBI to make collateral-free credit flow easily to micro and small businesses across India.',
        bullets: [
          'Credit facility up to ₹500 Lakhs (₹5 Crore) without third-party guarantee',
          'Guarantee coverage ranging from 75% up to 85% of sanctioned facility',
          'Covers both term loans (machinery/assets) and working capital limits (CC/OD)'
        ]
      },
      {
        id: 'fee-structure',
        title: 'Reduced Annual Guarantee Fee (AGF) Structure',
        content: 'Recent policy amendments have lowered the annual guarantee fee significantly for micro units and women-led enterprises to reduce borrowing costs.',
        bullets: [
          'Annual fee starts as low as 0.37% for loans up to ₹10 Lakhs',
          '0.55% to 0.75% for facilities between ₹10 Lakhs to ₹100 Lakhs',
          'Special 10% fee concession for women and SC/ST-owned enterprises'
        ]
      }
    ]
  },
  {
    topic: 'ISO 9001 vs ISO 27001 Certification',
    title: 'ISO 9001 vs ISO 27001 for Indian Enterprises: Benefits, Process, Audit & Cost',
    slug: 'iso-9001-vs-iso-27001-certification-guide',
    category: 'Certifications & Compliance',
    readTime: '8 min read',
    excerpt: 'Detailed comparison of Quality Management (ISO 9001) and Information Security Management (ISO 27001) certifications for tender eligibility and buyer trust.',
    metaDescription: 'Compare ISO 9001 vs ISO 27001 certifications. Audit roadmap, document preparation, accreditation bodies (NABCB/IAF), and enterprise benefits.',
    keywords: 'ISO 9001 quality certification, ISO 27001 security, ISO audit process, NABCB accredited ISO, MSME certification',
    sections: [
      {
        id: 'overview',
        title: 'Core Differences Between ISO 9001 and ISO 27001',
        content: 'While ISO 9001 establishes a systematic Quality Management System (QMS) across operations, ISO 27001 enforces stringent Information Security Management Systems (ISMS) protecting proprietary and client data.',
        bullets: [
          'ISO 9001 focuses on product/service consistency, customer satisfaction, and continuous improvement',
          'ISO 27001 focuses on cyber risk management, data confidentiality, and regulatory compliance',
          'Both standards drastically increase winning probability in corporate and government e-tenders'
        ]
      }
    ]
  }
];

export default function AdminBlogs() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingBlog, setEditingBlog] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState(null);

  // AI Prompt Studio State
  const [aiAssistantOpen, setAiAssistantOpen] = useState(false);
  const [customTopic, setCustomTopic] = useState('');
  const [rawAiOutput, setRawAiOutput] = useState('');
  const [copiedPrompt, setCopiedPrompt] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    category: 'Government Schemes',
    readTime: '6 min read',
    author: 'ArthoVista Advisory Team',
    featured: false,
    excerpt: '',
    metaDescription: '',
    keywords: '',
    status: 'Published',
    sections: [
      {
        id: 'overview',
        title: 'Executive Overview',
        content: '',
        bullets: ['Key eligibility criterion', 'Subsidized loan limits', 'Application steps']
      }
    ]
  });

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      const res = await axios.get('/api/blogs?status=All');
      if (res.data.success) {
        setBlogs(res.data.data);
      }
    } catch (err) {
      console.error('Error fetching blogs:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  const handleTitleChange = (e) => {
    const title = e.target.value;
    const generatedSlug = title
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();

    setFormData(prev => ({
      ...prev,
      title,
      slug: editingBlog ? prev.slug : generatedSlug
    }));
  };

  const handleOpenCreate = () => {
    setEditingBlog(null);
    setFormData({
      title: '',
      slug: '',
      category: 'Government Schemes',
      readTime: '6 min read',
      author: 'ArthoVista Advisory Team',
      featured: false,
      excerpt: '',
      metaDescription: '',
      keywords: 'MSME scheme, govt subsidy, loan interest subvention',
      status: 'Published',
      sections: [
        {
          id: 'overview',
          title: 'Executive Overview',
          content: '',
          bullets: ['Key eligibility criterion', 'Subsidized loan limits', 'Application steps']
        }
      ]
    });
    setModalOpen(true);
  };

  const handleOpenEdit = (blog) => {
    setEditingBlog(blog);
    setFormData({
      title: blog.title || '',
      slug: blog.slug || '',
      category: blog.category || 'Government Schemes',
      readTime: blog.readTime || '5 min read',
      author: blog.author || 'ArthoVista Advisory Team',
      featured: Boolean(blog.featured),
      excerpt: blog.excerpt || '',
      metaDescription: blog.metaDescription || '',
      keywords: Array.isArray(blog.keywords) ? blog.keywords.join(', ') : (blog.keywords || ''),
      status: blog.status || 'Published',
      sections: blog.sections && blog.sections.length > 0 ? blog.sections : [
        {
          id: 'overview',
          title: 'Overview',
          content: blog.excerpt || '',
          bullets: []
        }
      ]
    });
    setModalOpen(true);
  };

  // Generate customized master prompt for ChatGPT / Claude
  const generatePrompt = (topic) => {
    const currentTopic = topic || customTopic || "PMEGP 2026 35% Capital Subsidy Scheme";
    return `You are a Senior MSME & Financial Advisory Editor for ArthoVista (an Indian MSME & Startup advisory platform).

Write a high-ranking, authoritative, 100% verified blog guide on the topic: "${currentTopic}".

Please format the response EXACTLY in the following structured format so the ArthoVista Smart Parser can auto-fill the CMS:

TITLE: [Catchy, SEO-optimized title under 70 characters]
SLUG: [Clean URL slug, e.g. pmegp-subsidy-guide-2026]
CATEGORY: [Government Schemes | Business Finance | Business Registration | Legal & IP Protection | Certifications & Compliance | Startup Funding | Secured Loans | Digital Marketing & Growth]
READ_TIME: [e.g. 6 min read]
KEYWORDS: [5-8 comma-separated search keywords]
EXCERPT: [2-line punchy summary explaining who is eligible and key benefits]
META_DESCRIPTION: [150-160 character Google snippet description]

CHAPTER 1:
Heading: [Overview & Purpose]
Content: [1-2 rich paragraphs explaining the scheme in detail]
Bullets:
- [Key rule or figure 1]
- [Key rule or figure 2]
- [Key rule or figure 3]

CHAPTER 2:
Heading: [Eligibility Criteria & Subsidy Percentages]
Content: [Detailed breakdown with numbers and applicant criteria]
Bullets:
- [Requirement 1]
- [Requirement 2]

CHAPTER 3:
Heading: [Mandatory Documents & DPR Checklist]
Content: [Actionable guidance on preparing project reports and documents]
Bullets:
- [Document 1]
- [Document 2]
- [Document 3]`;
  };

  const handleCopyPrompt = (topic) => {
    const promptText = generatePrompt(topic);
    navigator.clipboard.writeText(promptText);
    setCopiedPrompt(true);
    setTimeout(() => setCopiedPrompt(false), 2000);
  };

  // Load one of the pre-built templates directly into the form
  const handleApplyPreset = (preset) => {
    setFormData({
      title: preset.title,
      slug: preset.slug,
      category: preset.category,
      readTime: preset.readTime,
      author: 'ArthoVista Advisory Team',
      featured: false,
      excerpt: preset.excerpt,
      metaDescription: preset.metaDescription,
      keywords: preset.keywords,
      status: 'Published',
      sections: preset.sections
    });
    setAiAssistantOpen(false);
  };

  // Smart Parser: parses raw AI output pasted from ChatGPT/Claude into form fields
  const handleParseAiOutput = () => {
    if (!rawAiOutput || !rawAiOutput.trim()) {
      alert('Please paste AI generated text first.');
      return;
    }

    const text = rawAiOutput;
    const newForm = { ...formData };

    // Extract basic fields
    const titleMatch = text.match(/TITLE:\s*(.+)/i);
    if (titleMatch) newForm.title = titleMatch[1].trim();

    const slugMatch = text.match(/SLUG:\s*(.+)/i);
    if (slugMatch) {
      newForm.slug = slugMatch[1].toLowerCase().replace(/[^\w-]/g, '').trim();
    } else if (newForm.title) {
      newForm.slug = newForm.title.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-').trim();
    }

    const catMatch = text.match(/CATEGORY:\s*(.+)/i);
    if (catMatch) newForm.category = catMatch[1].trim();

    const readTimeMatch = text.match(/READ_TIME:\s*(.+)/i);
    if (readTimeMatch) newForm.readTime = readTimeMatch[1].trim();

    const excerptMatch = text.match(/EXCERPT:\s*(.+)/i);
    if (excerptMatch) newForm.excerpt = excerptMatch[1].trim();

    const metaMatch = text.match(/META_DESCRIPTION:\s*(.+)/i);
    if (metaMatch) newForm.metaDescription = metaMatch[1].trim();

    const keywordsMatch = text.match(/KEYWORDS:\s*(.+)/i);
    if (keywordsMatch) newForm.keywords = keywordsMatch[1].trim();

    // Parse Chapters
    const chapterRegex = /CHAPTER\s*\d*:\s*[\r\n]+Heading:\s*(.+?)[\r\n]+Content:\s*(.+?)(?=[\r\n]+Bullets:|$)(?:[\r\n]+Bullets:\s*([\s\S]*?))?(?=(?:CHAPTER\s*\d*:|$))/gi;
    const parsedSections = [];
    let match;

    while ((match = chapterRegex.exec(text)) !== null) {
      const heading = match[1]?.trim() || 'Chapter';
      const content = match[2]?.trim() || '';
      const rawBullets = match[3] || '';
      const bullets = rawBullets
        .split('\n')
        .map(b => b.replace(/^[-*•\d.]\s*/, '').trim())
        .filter(Boolean);

      parsedSections.push({
        id: heading.toLowerCase().replace(/[^\w-]/g, '').replace(/\s+/g, '-').slice(0, 25),
        title: heading,
        content,
        bullets
      });
    }

    if (parsedSections.length > 0) {
      newForm.sections = parsedSections;
    }

    setFormData(newForm);
    setRawAiOutput('');
    setAiAssistantOpen(false);
    setMessage({ type: 'success', text: 'AI Content parsed and auto-filled successfully!' });
  };

  const handleAddSection = () => {
    const id = `section-${formData.sections.length + 1}`;
    setFormData(prev => ({
      ...prev,
      sections: [
        ...prev.sections,
        {
          id,
          title: `Section ${prev.sections.length + 1}`,
          content: '',
          bullets: []
        }
      ]
    }));
  };

  const handleRemoveSection = (index) => {
    setFormData(prev => ({
      ...prev,
      sections: prev.sections.filter((_, i) => i !== index)
    }));
  };

  const handleSectionChange = (index, field, value) => {
    setFormData(prev => {
      const updated = [...prev.sections];
      updated[index] = { ...updated[index], [field]: value };
      return { ...prev, sections: updated };
    });
  };

  const handleBulletsChange = (index, text) => {
    const bullets = text.split('\n').filter(b => b.trim() !== '');
    handleSectionChange(index, 'bullets', bullets);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.excerpt) {
      setMessage({ type: 'error', text: 'Title and Excerpt are mandatory.' });
      return;
    }

    try {
      setSubmitting(true);
      setMessage(null);

      const tableOfContents = formData.sections.map((sec, i) => ({
        id: sec.id || `sec-${i}`,
        label: sec.title || `Chapter ${i + 1}`
      }));

      const payload = {
        ...formData,
        tableOfContents
      };

      if (editingBlog) {
        await axios.put(`/api/blogs/${editingBlog._id}`, payload);
        setMessage({ type: 'success', text: 'Blog article updated successfully!' });
      } else {
        await axios.post('/api/blogs', payload);
        setMessage({ type: 'success', text: 'New blog article published live on website!' });
      }

      setTimeout(() => {
        setModalOpen(false);
        fetchBlogs();
      }, 700);
    } catch (err) {
      setMessage({
        type: 'error',
        text: err.response?.data?.message || 'Error saving blog. Please check slug uniqueness.'
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Are you sure you want to delete "${title}"?`)) return;

    try {
      await axios.delete(`/api/blogs/${id}`);
      fetchBlogs();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete blog.');
    }
  };

  const filteredBlogs = blogs.filter(b => {
    const matchesCat = selectedCategory === 'All' || b.category === selectedCategory;
    const matchesQuery =
      b.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.excerpt?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.category?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesQuery;
  });

  return (
    <div className="p-6 sm:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-50 dark:bg-teal-950/40 text-teal-700 dark:text-teal-300 text-xs font-bold uppercase tracking-wider mb-2 border border-teal-200/80 dark:border-teal-800">
            <Sparkles size={13} className="text-amber-500" />
            <span>AI-Powered Content Studio</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white font-display">
            Blog & Article Manager
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm mt-1">
            Write, edit, and publish verified MSME scheme guides and advisory articles with integrated AI prompting.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={fetchBlogs}
            className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-all cursor-pointer"
            title="Refresh List"
          >
            <RefreshCw size={16} />
          </button>
          <button
            onClick={handleOpenCreate}
            className="btn-3d inline-flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white text-xs sm:text-sm font-bold px-4 sm:px-5 py-2.5 rounded-xl shadow-md shadow-teal-500/20 transition-all cursor-pointer"
          >
            <Plus size={16} />
            <span>Write New Blog</span>
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Total Articles</span>
          <p className="text-2xl font-black text-slate-900 dark:text-white font-display mt-1">{blogs.length}</p>
        </div>
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs">
          <span className="text-[11px] font-bold text-emerald-500 uppercase tracking-wider">Published Live</span>
          <p className="text-2xl font-black text-emerald-600 dark:text-emerald-400 font-display mt-1">
            {blogs.filter(b => b.status === 'Published').length}
          </p>
        </div>
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs">
          <span className="text-[11px] font-bold text-amber-500 uppercase tracking-wider">Drafts</span>
          <p className="text-2xl font-black text-amber-600 dark:text-amber-400 font-display mt-1">
            {blogs.filter(b => b.status === 'Draft').length}
          </p>
        </div>
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs">
          <span className="text-[11px] font-bold text-teal-600 uppercase tracking-wider">Total Reader Views</span>
          <p className="text-2xl font-black text-teal-700 dark:text-teal-300 font-display mt-1">
            {blogs.reduce((acc, b) => acc + (b.views || 0), 0)}
          </p>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by title, keywords..."
            className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 shadow-2xs"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-1">
          {['All', 'Government Schemes', 'Business Finance', 'Certifications & Compliance', 'Startup Funding'].map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-teal-600 text-white shadow-xs'
                  : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:bg-slate-50'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Blogs Table / List */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
        {loading ? (
          <div className="p-12 text-center text-slate-400">Loading articles...</div>
        ) : filteredBlogs.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <BookOpen size={40} className="mx-auto text-slate-300 dark:text-slate-600" />
            <p className="text-slate-600 dark:text-slate-400 font-bold text-sm">No blog posts found</p>
            <button
              onClick={handleOpenCreate}
              className="text-xs font-bold text-teal-600 hover:underline cursor-pointer"
            >
              Click here to write the first article &rarr;
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-slate-50 dark:bg-slate-950/50 border-b border-slate-200 dark:border-slate-800 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-4">Title & Excerpt</th>
                  <th className="px-4 py-4">Category</th>
                  <th className="px-4 py-4">Date & Author</th>
                  <th className="px-4 py-4">Status</th>
                  <th className="px-4 py-4 text-center">Views</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filteredBlogs.map(blog => (
                  <tr key={blog._id || blog.slug} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="px-6 py-4 max-w-md">
                      <div className="flex items-start gap-2">
                        {blog.featured && (
                          <span className="px-1.5 py-0.5 rounded bg-amber-100 text-amber-800 text-[10px] font-bold shrink-0 mt-0.5">
                            Featured
                          </span>
                        )}
                        <div>
                          <p className="font-bold text-slate-900 dark:text-white leading-snug line-clamp-1">
                            {blog.title}
                          </p>
                          <p className="text-[11px] text-slate-500 line-clamp-2 mt-1 font-normal">
                            {blog.excerpt}
                          </p>
                          <span className="text-[10px] font-mono text-slate-400 mt-1 block">
                            /blog/{blog.slug}
                          </span>
                        </div>
                      </div>
                    </td>

                    <td className="px-4 py-4 whitespace-nowrap">
                      <span className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold">
                        {blog.category}
                      </span>
                    </td>

                    <td className="px-4 py-4 whitespace-nowrap text-xs text-slate-500 font-medium">
                      <p className="text-slate-800 dark:text-slate-200 font-semibold">{blog.date}</p>
                      <p className="text-[11px] text-slate-400">{blog.author}</p>
                    </td>

                    <td className="px-4 py-4 whitespace-nowrap">
                      <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold ${
                        blog.status === 'Published'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-amber-50 text-amber-800 border border-amber-200'
                      }`}>
                        {blog.status}
                      </span>
                    </td>

                    <td className="px-4 py-4 text-center whitespace-nowrap font-bold text-slate-700 dark:text-slate-300">
                      {blog.views || 0}
                    </td>

                    <td className="px-6 py-4 text-right whitespace-nowrap space-x-2">
                      <Link
                        to={`/blog/${blog.slug}`}
                        target="_blank"
                        className="p-1.5 rounded-lg text-slate-400 hover:text-teal-600 hover:bg-slate-100 dark:hover:bg-slate-800 inline-block transition-colors"
                        title="View Live"
                      >
                        <ExternalLink size={15} />
                      </Link>
                      <button
                        onClick={() => handleOpenEdit(blog)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-teal-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                        title="Edit Article"
                      >
                        <Edit3 size={15} />
                      </button>
                      <button
                        onClick={() => handleDelete(blog._id, blog.title)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                        title="Delete Article"
                      >
                        <Trash2 size={15} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Write / Edit Blog Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
          <div className="relative w-full max-w-3xl max-h-[90vh] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl p-6 sm:p-8 overflow-y-auto space-y-6">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
              <div>
                <h3 className="font-display font-black text-xl text-slate-900 dark:text-white">
                  {editingBlog ? 'Edit Blog Article' : 'Write & Publish New Blog'}
                </h3>
                <p className="text-xs text-slate-400">Fill in the fields or use the integrated AI assistant to auto-fill.</p>
              </div>
              
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setAiAssistantOpen(!aiAssistantOpen)}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    aiAssistantOpen
                      ? 'bg-gradient-to-r from-teal-600 to-indigo-600 text-white shadow-sm'
                      : 'bg-teal-50 text-teal-700 border border-teal-200 hover:bg-teal-100'
                  }`}
                >
                  <Sparkles size={14} className={aiAssistantOpen ? 'text-amber-300' : 'text-teal-600'} />
                  <span>{aiAssistantOpen ? 'Close AI Studio' : '✨ AI Prompt & Auto-Fill'}</span>
                </button>

                <button
                  onClick={() => setModalOpen(false)}
                  className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 flex items-center justify-center text-slate-600 dark:text-slate-300 font-bold text-sm cursor-pointer"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* AI Assistant Drawer & Parser */}
            {aiAssistantOpen && (
              <div className="p-5 rounded-2xl bg-gradient-to-br from-teal-900 via-slate-900 to-indigo-950 text-white border border-teal-500/30 shadow-lg space-y-4 animate-fade-in">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Wand2 size={18} className="text-teal-400" />
                    <h4 className="font-display font-bold text-sm text-white">AI Content Assistant & Smart Auto-Fill</h4>
                  </div>
                  <span className="text-[10px] font-bold bg-teal-500/20 text-teal-300 px-2 py-0.5 rounded-full border border-teal-400/30">
                    ChatGPT / Claude Compatible
                  </span>
                </div>

                {/* Option 1: 1-Click Instant Topic Presets */}
                <div>
                  <label className="block text-[11px] font-bold text-teal-300 uppercase tracking-wider mb-2">
                    ⚡ Option 1: 1-Click Ready Drafts (Click to load):
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {blogPresets.map((preset, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => handleApplyPreset(preset)}
                        className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-teal-600 text-slate-200 hover:text-white text-xs font-semibold border border-white/15 transition-all text-left cursor-pointer"
                      >
                        + {preset.topic}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Option 2: Copy Prompt Template */}
                <div className="pt-2 border-t border-white/10 space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-[11px] font-bold text-teal-300 uppercase tracking-wider">
                      📋 Option 2: Copy AI Master Prompt for Your Custom Topic:
                    </label>
                    <button
                      type="button"
                      onClick={() => handleCopyPrompt(customTopic)}
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-teal-500 hover:bg-teal-600 text-white text-xs font-bold shadow-xs cursor-pointer"
                    >
                      {copiedPrompt ? <Check size={13} /> : <Copy size={13} />}
                      <span>{copiedPrompt ? 'Prompt Copied!' : 'Copy Master Prompt'}</span>
                    </button>
                  </div>
                  <input
                    type="text"
                    value={customTopic}
                    onChange={(e) => setCustomTopic(e.target.value)}
                    placeholder="Enter custom topic e.g. Mudra Loan ₹20 Lakhs Limit Revision..."
                    className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-xl text-xs text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-400"
                  />
                </div>

                {/* Option 3: Paste AI Output and Auto-Fill */}
                <div className="pt-2 border-t border-white/10 space-y-2">
                  <label className="block text-[11px] font-bold text-teal-300 uppercase tracking-wider">
                    ⚡ Option 3: Paste AI Generated Output Here (Auto-Fills Whole Form):
                  </label>
                  <textarea
                    rows={3}
                    value={rawAiOutput}
                    onChange={(e) => setRawAiOutput(e.target.value)}
                    placeholder="Paste the generated response from ChatGPT/Claude here..."
                    className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-xl text-xs text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-400 font-mono"
                  />
                  <button
                    type="button"
                    onClick={handleParseAiOutput}
                    className="w-full py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-bold text-xs shadow-md flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Zap size={14} />
                    <span>Parse & Auto-Fill Blog Form Instantly</span>
                  </button>
                </div>
              </div>
            )}

            {message && (
              <div className={`p-4 rounded-xl text-xs font-bold flex items-center gap-2 ${
                message.type === 'success'
                  ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                  : 'bg-rose-50 text-rose-800 border border-rose-200'
              }`}>
                {message.type === 'success' ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
                <span>{message.text}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                  Article Title *
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={handleTitleChange}
                  placeholder="e.g. Complete Guide to PMEGP 2026 35% Subsidies"
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                    URL Slug *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    placeholder="e.g. pmegp-subsidy-guide-2026"
                    className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl text-xs font-mono focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                    Category *
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-teal-500"
                  >
                    <option value="Government Schemes">Government Schemes</option>
                    <option value="Business Finance">Business Finance</option>
                    <option value="Business Registration">Business Registration</option>
                    <option value="Legal & IP Protection">Legal & IP Protection</option>
                    <option value="Certifications & Compliance">Certifications & Compliance</option>
                    <option value="Startup Funding">Startup Funding</option>
                    <option value="Secured Loans">Secured Loans</option>
                    <option value="Digital Marketing & Growth">Digital Marketing & Growth</option>
                  </select>
                </div>
              </div>

              <div className="grid sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                    Read Time
                  </label>
                  <input
                    type="text"
                    value={formData.readTime}
                    onChange={(e) => setFormData({ ...formData, readTime: e.target.value })}
                    placeholder="e.g. 6 min read"
                    className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                    Author
                  </label>
                  <input
                    type="text"
                    value={formData.author}
                    onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                    placeholder="e.g. ArthoVista Advisory Team"
                    className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                    Status
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-teal-500"
                  >
                    <option value="Published">Published (Live)</option>
                    <option value="Draft">Draft (Hidden)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                  Article Excerpt / Summary *
                </label>
                <textarea
                  rows={2}
                  required
                  value={formData.excerpt}
                  onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                  placeholder="Concise 2-line summary explaining the core takeaway of this guide..."
                  className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-teal-500 font-normal"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                  Keywords / Tags (Comma-separated)
                </label>
                <input
                  type="text"
                  value={formData.keywords}
                  onChange={(e) => setFormData({ ...formData, keywords: e.target.value })}
                  placeholder="e.g. PMEGP 2026, KVIC subsidy, MSME manufacturing grant, DPR report"
                  className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>

              {/* Sections / Chapters Builder */}
              <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-display font-bold text-sm text-slate-900 dark:text-white">
                      Article Chapters & Content Sections
                    </h4>
                    <p className="text-[11px] text-slate-400">Structured sections will appear with TOC on the article page.</p>
                  </div>
                  <button
                    type="button"
                    onClick={handleAddSection}
                    className="inline-flex items-center gap-1 text-xs font-bold text-teal-600 hover:text-teal-700 bg-teal-50 dark:bg-teal-950/50 px-3 py-1.5 rounded-lg border border-teal-200 dark:border-teal-800 cursor-pointer"
                  >
                    <Plus size={14} />
                    <span>Add Chapter</span>
                  </button>
                </div>

                {formData.sections.map((sec, idx) => (
                  <div key={idx} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800 space-y-3 relative">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[11px] font-bold text-teal-700 dark:text-teal-400 uppercase">
                        Chapter {idx + 1}
                      </span>
                      {formData.sections.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveSection(idx)}
                          className="text-xs text-rose-500 hover:text-rose-700 font-bold cursor-pointer"
                        >
                          Remove
                        </button>
                      )}
                    </div>

                    <input
                      type="text"
                      value={sec.title}
                      onChange={(e) => handleSectionChange(idx, 'title', e.target.value)}
                      placeholder="Chapter Heading (e.g. Eligibility Criteria for Subsidy)"
                      className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />

                    <textarea
                      rows={3}
                      value={sec.content}
                      onChange={(e) => handleSectionChange(idx, 'content', e.target.value)}
                      placeholder="Detailed content paragraph..."
                      className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-teal-500 font-normal"
                    />

                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">
                        Bullet Points (1 per line)
                      </label>
                      <textarea
                        rows={2}
                        value={Array.isArray(sec.bullets) ? sec.bullets.join('\n') : ''}
                        onChange={(e) => handleBulletsChange(idx, e.target.value)}
                        placeholder="Bullet 1&#10;Bullet 2&#10;Bullet 3"
                        className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-teal-500 font-mono"
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-600 hover:bg-slate-100 cursor-pointer"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={submitting}
                  className="btn-3d inline-flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs sm:text-sm px-6 py-2.5 rounded-xl shadow-md transition-all cursor-pointer disabled:opacity-50"
                >
                  <Send size={15} />
                  <span>{submitting ? 'Publishing...' : editingBlog ? 'Update Article' : 'Publish Article Live'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
