import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Mail, Plus, Search, Users, Edit3, Trash2, Send,
  CheckCircle2, AlertCircle, FileText, Bell, Sparkles,
  ExternalLink, Download, RefreshCw, Calendar, Tag,
  Copy, Check, Wand2, Zap
} from 'lucide-react';

const newsletterPresets = [
  {
    topic: 'PMEGP Subsidy Caps & Priority Lending',
    edition: 'Issue #53',
    date: 'September 2026',
    title: 'PMEGP 2026 Expansion: Revised Subsidy Caps & Priority Lending Window',
    desc: 'KVIC circular updating project cost ceilings up to ₹50 Lakhs for manufacturing with 35% rural subsidies and fast-track nodal bank sanctions.',
    highlights: 'Manufacturing ceiling raised to ₹50 Lakhs\nSpecial 35% capital subsidy for rural women & SC/ST founders\nFast-track nodal bank sanctions roadmap',
    readTime: '4 min read',
    tag: 'Govt. Subsidies',
    content: 'The Ministry of MSME has rolled out substantial revisions to the Prime Minister Employment Generation Programme (PMEGP)...'
  },
  {
    topic: 'CGTMSE ₹5 Crore Guarantee Overhaul',
    edition: 'Issue #52',
    date: 'August 2026',
    title: 'CGTMSE Guarantee Overhaul: Collateral-Free Loans Up to ₹5 Crore with Reduced Fees',
    desc: "Ministry of MSME's expanded credit guarantee mechanism, reducing annual guarantee fee for micro enterprises and women-led ventures.",
    highlights: 'Guarantee coverage expanded to ₹500 Lakhs\nAnnual fee reduced to 0.37% for micro units\nSimplified hybrid collateral guidelines',
    readTime: '3 min read',
    tag: 'MSME Loans',
    content: 'SIDBI and the Ministry of MSME have implemented fee reductions and expanded eligibility across commercial banks...'
  },
  {
    topic: 'GST Annual Reconciliation & ROC Filing Alert',
    edition: 'Issue #51',
    date: 'August 2026',
    title: 'Annual GST & Corporate Compliance Roadmap: ITC Matching & ROC Guidelines',
    desc: 'Critical filing dates, GSTR-9/9C reconciliation rules, and mandatory MCA filings to avoid heavy penalty notices for Indian MSMEs.',
    highlights: 'Key compliance deadlines for Q3/Q4\nInput Tax Credit (ITC) matching checklist\nROC annual return filing best practices',
    readTime: '5 min read',
    tag: 'Tax & Compliance',
    content: 'Founders and CFOs should ensure timely GSTR-9 reconciliations to eliminate ITC mismatch notices...'
  }
];

export default function AdminNewsletters() {
  const [newsletters, setNewsletters] = useState([]);
  const [subscribers, setSubscribers] = useState([]);
  const [activeTab, setActiveTab] = useState('editions'); // 'editions' | 'subscribers'
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingNewsletter, setEditingNewsletter] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [message, setMessage] = useState(null);

  // AI Prompt Studio State
  const [aiAssistantOpen, setAiAssistantOpen] = useState(false);
  const [customTopic, setCustomTopic] = useState('');
  const [rawAiOutput, setRawAiOutput] = useState('');
  const [copiedPrompt, setCopiedPrompt] = useState(false);

  const [formData, setFormData] = useState({
    edition: 'Issue #53',
    title: '',
    date: new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
    desc: '',
    highlights: '',
    readTime: '4 min read',
    tag: 'Govt. Subsidies',
    content: '',
    status: 'Published'
  });

  const fetchData = async () => {
    try {
      setLoading(true);
      const [resNewsletters, resSubscribers] = await Promise.all([
        axios.get('/api/newsletters?status=All'),
        axios.get('/api/newsletters/subscribers').catch(() => ({ data: { data: [] } }))
      ]);

      if (resNewsletters.data.success) {
        setNewsletters(resNewsletters.data.data);
      }
      if (resSubscribers.data.success) {
        setSubscribers(resSubscribers.data.data);
      }
    } catch (err) {
      console.error('Error fetching newsletter data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleOpenCreate = () => {
    setEditingNewsletter(null);
    const nextIssueNumber = newsletters.length > 0 ? (52 + newsletters.length) : 53;
    setFormData({
      edition: `Issue #${nextIssueNumber}`,
      title: '',
      date: new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
      desc: '',
      highlights: 'New subsidy cost cap revised\nPriority sanction guidelines issued\nKey documentation checklist',
      readTime: '4 min read',
      tag: 'Govt. Subsidies',
      content: '',
      status: 'Published'
    });
    setModalOpen(true);
  };

  const handleOpenEdit = (item) => {
    setEditingNewsletter(item);
    setFormData({
      edition: item.edition || '',
      title: item.title || '',
      date: item.date || '',
      desc: item.desc || '',
      highlights: Array.isArray(item.highlights) ? item.highlights.join('\n') : (item.highlights || ''),
      readTime: item.readTime || '4 min read',
      tag: item.tag || 'Govt. Subsidies',
      content: item.content || '',
      status: item.status || 'Published'
    });
    setModalOpen(true);
  };

  const generateNewsletterPrompt = (topic) => {
    const currentTopic = topic || customTopic || "PMEGP 2026 Revised Subsidy Guidelines";
    return `You are the Chief Editor of the "ArthoVista Weekly MSME Gazette".

Write a timely, impactful newsletter edition summarizing the latest circular, policy revision, or subsidy alert on: "${currentTopic}".

Format the output EXACTLY as follows so the ArthoVista Smart Parser can auto-fill the CMS:

EDITION_NUMBER: Issue #53
PUBLICATION_DATE: ${new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
TITLE: [Punchy, urgent headline under 80 characters]
CATEGORY_TAG: [Govt. Subsidies | MSME Loans | Tax & Compliance | Agri & Subsidies | Startup Grants]
READ_TIME: [e.g. 4 min read]
SUMMARY_DESCRIPTION: [2-3 sentence executive summary of what changed and what MSME founders must do this week]

BULLET_HIGHLIGHTS:
- [Highlight 1: Specific financial figure or percentage change]
- [Highlight 2: Deadline date or eligibility condition]
- [Highlight 3: Key action item for business owners]

FULL_BODY_DISPATCH:
[Write a 250-word engaging bulletin in conversational, professional tone with greetings, breakdown of the circular, and guidance for MSME directors.]`;
  };

  const handleCopyPrompt = (topic) => {
    const promptText = generateNewsletterPrompt(topic);
    navigator.clipboard.writeText(promptText);
    setCopiedPrompt(true);
    setTimeout(() => setCopiedPrompt(false), 2000);
  };

  const handleApplyPreset = (preset) => {
    setFormData({
      edition: preset.edition,
      title: preset.title,
      date: preset.date,
      desc: preset.desc,
      highlights: preset.highlights,
      readTime: preset.readTime,
      tag: preset.tag,
      content: preset.content,
      status: 'Published'
    });
    setAiAssistantOpen(false);
  };

  const handleParseAiOutput = () => {
    if (!rawAiOutput || !rawAiOutput.trim()) {
      alert('Please paste AI generated text first.');
      return;
    }

    const text = rawAiOutput;
    const newForm = { ...formData };

    const editionMatch = text.match(/EDITION_NUMBER:\s*(.+)/i);
    if (editionMatch) newForm.edition = editionMatch[1].trim();

    const dateMatch = text.match(/PUBLICATION_DATE:\s*(.+)/i);
    if (dateMatch) newForm.date = dateMatch[1].trim();

    const titleMatch = text.match(/TITLE:\s*(.+)/i);
    if (titleMatch) newForm.title = titleMatch[1].trim();

    const tagMatch = text.match(/CATEGORY_TAG:\s*(.+)/i);
    if (tagMatch) newForm.tag = tagMatch[1].trim();

    const readTimeMatch = text.match(/READ_TIME:\s*(.+)/i);
    if (readTimeMatch) newForm.readTime = readTimeMatch[1].trim();

    const summaryMatch = text.match(/SUMMARY_DESCRIPTION:\s*([\s\S]*?)(?=BULLET_HIGHLIGHTS:|FULL_BODY_DISPATCH:|$)/i);
    if (summaryMatch) newForm.desc = summaryMatch[1].trim();

    const highlightsMatch = text.match(/BULLET_HIGHLIGHTS:\s*([\s\S]*?)(?=FULL_BODY_DISPATCH:|$)/i);
    if (highlightsMatch) {
      const cleanBullets = highlightsMatch[1]
        .split('\n')
        .map(b => b.replace(/^[-*•\d.]\s*/, '').trim())
        .filter(Boolean)
        .join('\n');
      newForm.highlights = cleanBullets;
    }

    const bodyMatch = text.match(/FULL_BODY_DISPATCH:\s*([\s\S]*)/i);
    if (bodyMatch) newForm.content = bodyMatch[1].trim();

    setFormData(newForm);
    setRawAiOutput('');
    setAiAssistantOpen(false);
    setMessage({ type: 'success', text: 'Gazette edition parsed and auto-filled successfully!' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.edition || !formData.title || !formData.desc) {
      setMessage({ type: 'error', text: 'Edition, title, and summary are required.' });
      return;
    }

    try {
      setSubmitting(true);
      setMessage(null);

      const highlightsArray = formData.highlights
        .split('\n')
        .map(h => h.trim())
        .filter(Boolean);

      const payload = {
        ...formData,
        highlights: highlightsArray
      };

      if (editingNewsletter) {
        await axios.put(`/api/newsletters/${editingNewsletter._id}`, payload);
        setMessage({ type: 'success', text: 'Gazette edition updated successfully!' });
      } else {
        await axios.post('/api/newsletters', payload);
        setMessage({ type: 'success', text: 'Gazette edition published live to the archive!' });
      }

      setTimeout(() => {
        setModalOpen(false);
        fetchData();
      }, 700);
    } catch (err) {
      setMessage({
        type: 'error',
        text: err.response?.data?.message || 'Error saving newsletter edition.'
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Delete Gazette edition "${title}"?`)) return;

    try {
      await axios.delete(`/api/newsletters/${id}`);
      fetchData();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete edition.');
    }
  };

  const filteredNewsletters = newsletters.filter(item =>
    item.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.desc?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.edition?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredSubscribers = subscribers.filter(sub =>
    sub.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    sub.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    sub.interest?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-6 sm:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 text-xs font-bold uppercase tracking-wider mb-2 border border-amber-200/80 dark:border-amber-800">
            <Sparkles size={13} className="text-amber-500" />
            <span>AI-Powered Gazette Studio</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white font-display">
            MSME Newsletter & Gazette Manager
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm mt-1">
            Write and dispatch weekly Gazette editions, review subscriber rosters, and broadcast policy alerts with AI prompts.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={fetchData}
            className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-all cursor-pointer"
            title="Refresh List"
          >
            <RefreshCw size={16} />
          </button>
          <button
            onClick={handleOpenCreate}
            className="btn-3d inline-flex items-center gap-2 bg-amber-600 hover:bg-amber-700 text-white text-xs sm:text-sm font-bold px-4 sm:px-5 py-2.5 rounded-xl shadow-md shadow-amber-500/20 transition-all cursor-pointer"
          >
            <Plus size={16} />
            <span>Write New Edition</span>
          </button>
        </div>
      </div>

      {/* Metrics Strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Total Editions</span>
          <p className="text-2xl font-black text-slate-900 dark:text-white font-display mt-1">{newsletters.length}</p>
        </div>
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs">
          <span className="text-[11px] font-bold text-emerald-500 uppercase tracking-wider">Registered Subscribers</span>
          <p className="text-2xl font-black text-emerald-600 dark:text-emerald-400 font-display mt-1">{subscribers.length}</p>
        </div>
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs">
          <span className="text-[11px] font-bold text-amber-500 uppercase tracking-wider">Dispatch Schedule</span>
          <p className="text-sm font-bold text-amber-700 dark:text-amber-400 mt-1">Every Tuesday 8 AM</p>
        </div>
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs">
          <span className="text-[11px] font-bold text-teal-600 uppercase tracking-wider">Spam Rate</span>
          <p className="text-2xl font-black text-teal-700 dark:text-teal-300 font-display mt-1">0.0% (Opt-In)</p>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3 gap-4">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('editions')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'editions'
                ? 'bg-amber-600 text-white shadow-xs'
                : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800'
            }`}
          >
            Gazette Editions ({newsletters.length})
          </button>
          <button
            onClick={() => setActiveTab('subscribers')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'subscribers'
                ? 'bg-amber-600 text-white shadow-xs'
                : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800'
            }`}
          >
            Subscribers List ({subscribers.length})
          </button>
        </div>

        <div className="relative w-72">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={15} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={`Search ${activeTab}...`}
            className="w-full pl-9 pr-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-amber-500 shadow-2xs"
          />
        </div>
      </div>

      {/* Tab 1: Gazette Editions List */}
      {activeTab === 'editions' && (
        <div className="grid md:grid-cols-2 gap-6">
          {filteredNewsletters.map((item) => (
            <div
              key={item._id || item.edition}
              className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between space-y-4 hover:border-amber-400 transition-all"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="px-2.5 py-0.5 rounded-md bg-amber-50 text-amber-800 dark:bg-amber-950 dark:text-amber-300 border border-amber-200 dark:border-amber-800 text-xs font-bold">
                    {item.edition}
                  </span>
                  <span className="text-[11px] text-slate-400 font-semibold">{item.date} · {item.readTime}</span>
                </div>

                <h3 className="font-display font-bold text-base text-slate-900 dark:text-white leading-snug">
                  {item.title}
                </h3>

                <p className="text-xs text-slate-600 dark:text-slate-300 mt-2 line-clamp-2 leading-relaxed font-normal">
                  {item.desc}
                </p>

                {item.highlights && item.highlights.length > 0 && (
                  <div className="mt-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-100 dark:border-slate-800 space-y-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                      Key Highlights
                    </span>
                    {item.highlights.slice(0, 3).map((h, i) => (
                      <div key={i} className="flex items-start gap-1.5 text-[11px] text-slate-700 dark:text-slate-300 font-medium">
                        <CheckCircle2 size={12} className="text-amber-600 shrink-0 mt-0.5" />
                        <span className="line-clamp-1">{h}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800">
                <span className="text-[11px] font-bold text-slate-500">
                  Tag: <span className="text-slate-700 dark:text-slate-300">{item.tag}</span>
                </span>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleOpenEdit(item)}
                    className="p-2 rounded-xl text-slate-500 hover:text-amber-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                    title="Edit Edition"
                  >
                    <Edit3 size={15} />
                  </button>
                  <button
                    onClick={() => handleDelete(item._id, item.title)}
                    className="p-2 rounded-xl text-slate-500 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                    title="Delete Edition"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab 2: Subscribers Roster */}
      {activeTab === 'subscribers' && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
          {loading ? (
            <div className="p-12 text-center text-slate-400">Loading subscribers...</div>
          ) : filteredSubscribers.length === 0 ? (
            <div className="p-12 text-center text-slate-400">No subscribers registered yet.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead className="bg-slate-50 dark:bg-slate-950/50 border-b border-slate-200 dark:border-slate-800 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  <tr>
                    <th className="px-6 py-4">Subscriber</th>
                    <th className="px-4 py-4">Area of Interest</th>
                    <th className="px-4 py-4">Status</th>
                    <th className="px-4 py-4">Subscribed Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {filteredSubscribers.map(sub => (
                    <tr key={sub._id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors">
                      <td className="px-6 py-3.5">
                        <p className="font-bold text-slate-900 dark:text-white">{sub.name || 'Anonymous Founder'}</p>
                        <p className="text-[11px] font-mono text-slate-500">{sub.email}</p>
                      </td>
                      <td className="px-4 py-3.5 text-xs text-slate-700 dark:text-slate-300 font-medium">
                        {sub.interest}
                      </td>
                      <td className="px-4 py-3.5">
                        <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          {sub.status}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 text-xs text-slate-400 font-medium">
                        {new Date(sub.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Write / Edit Gazette Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
          <div className="relative w-full max-w-2xl max-h-[90vh] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl p-6 sm:p-8 overflow-y-auto space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
              <div>
                <h3 className="font-display font-black text-xl text-slate-900 dark:text-white">
                  {editingNewsletter ? 'Edit Gazette Edition' : 'Write & Publish Gazette Edition'}
                </h3>
                <p className="text-xs text-slate-400">Publish new issues to the live newsletter page.</p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setAiAssistantOpen(!aiAssistantOpen)}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    aiAssistantOpen
                      ? 'bg-gradient-to-r from-amber-600 to-orange-600 text-white shadow-sm'
                      : 'bg-amber-50 text-amber-800 border border-amber-200 hover:bg-amber-100'
                  }`}
                >
                  <Sparkles size={14} className={aiAssistantOpen ? 'text-amber-300' : 'text-amber-600'} />
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
              <div className="p-5 rounded-2xl bg-gradient-to-br from-amber-950 via-slate-900 to-stone-900 text-white border border-amber-500/30 shadow-lg space-y-4 animate-fade-in">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Wand2 size={18} className="text-amber-400" />
                    <h4 className="font-display font-bold text-sm text-white">Gazette AI Assistant & Smart Auto-Fill</h4>
                  </div>
                  <span className="text-[10px] font-bold bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded-full border border-amber-400/30">
                    ChatGPT / Claude Compatible
                  </span>
                </div>

                {/* Option 1: 1-Click Ready Gazette Presets */}
                <div>
                  <label className="block text-[11px] font-bold text-amber-300 uppercase tracking-wider mb-2">
                    ⚡ Option 1: 1-Click Gazette Templates (Click to load):
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {newsletterPresets.map((preset, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => handleApplyPreset(preset)}
                        className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-amber-600 text-slate-200 hover:text-white text-xs font-semibold border border-white/15 transition-all text-left cursor-pointer"
                      >
                        + {preset.topic}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Option 2: Copy Master Prompt */}
                <div className="pt-2 border-t border-white/10 space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-[11px] font-bold text-amber-300 uppercase tracking-wider">
                      📋 Option 2: Copy Gazette Master Prompt for Custom News:
                    </label>
                    <button
                      type="button"
                      onClick={() => handleCopyPrompt(customTopic)}
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold shadow-xs cursor-pointer"
                    >
                      {copiedPrompt ? <Check size={13} /> : <Copy size={13} />}
                      <span>{copiedPrompt ? 'Prompt Copied!' : 'Copy Gazette Prompt'}</span>
                    </button>
                  </div>
                  <input
                    type="text"
                    value={customTopic}
                    onChange={(e) => setCustomTopic(e.target.value)}
                    placeholder="Enter custom circular / alert topic e.g. RBI rate reduction for MSME loans..."
                    className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-xl text-xs text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-400"
                  />
                </div>

                {/* Option 3: Paste AI Output and Auto-Fill */}
                <div className="pt-2 border-t border-white/10 space-y-2">
                  <label className="block text-[11px] font-bold text-amber-300 uppercase tracking-wider">
                    ⚡ Option 3: Paste AI Generated Text (Auto-Fills Whole Gazette Form):
                  </label>
                  <textarea
                    rows={3}
                    value={rawAiOutput}
                    onChange={(e) => setRawAiOutput(e.target.value)}
                    placeholder="Paste the generated response from ChatGPT/Claude here..."
                    className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-xl text-xs text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-400 font-mono"
                  />
                  <button
                    type="button"
                    onClick={handleParseAiOutput}
                    className="w-full py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-bold text-xs shadow-md flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Zap size={14} />
                    <span>Parse & Auto-Fill Gazette Form Instantly</span>
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
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                    Edition Number *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.edition}
                    onChange={(e) => setFormData({ ...formData, edition: e.target.value })}
                    placeholder="e.g. Issue #53"
                    className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl text-xs font-bold focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                    Publication Month / Date *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    placeholder="e.g. September 2026"
                    className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                  Edition Title *
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. PMFME Scheme Capital Grants: ₹10 Lakhs Allocation Window"
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                    Category Tag
                  </label>
                  <select
                    value={formData.tag}
                    onChange={(e) => setFormData({ ...formData, tag: e.target.value })}
                    className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-amber-500"
                  >
                    <option value="Govt. Subsidies">Govt. Subsidies</option>
                    <option value="MSME Loans">MSME Loans</option>
                    <option value="Tax & Compliance">Tax & Compliance</option>
                    <option value="Agri & Subsidies">Agri & Subsidies</option>
                    <option value="Startup Grants">Startup Grants</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                    Read Time
                  </label>
                  <input
                    type="text"
                    value={formData.readTime}
                    onChange={(e) => setFormData({ ...formData, readTime: e.target.value })}
                    placeholder="e.g. 4 min read"
                    className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                  Summary / Overview Description *
                </label>
                <textarea
                  rows={2}
                  required
                  value={formData.desc}
                  onChange={(e) => setFormData({ ...formData, desc: e.target.value })}
                  placeholder="A detailed breakdown of the circular updating cost ceilings..."
                  className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-amber-500 font-normal"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                  Bullet Highlights (1 per line)
                </label>
                <textarea
                  rows={3}
                  value={formData.highlights}
                  onChange={(e) => setFormData({ ...formData, highlights: e.target.value })}
                  placeholder="35% capital subsidy cap&#10;One District One Product preference&#10;Fast-track bank sanction"
                  className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-amber-500 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                  Full Dispatch Content / Body (Optional)
                </label>
                <textarea
                  rows={3}
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  placeholder="Detailed bulletin letter content to subscribers..."
                  className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-amber-500 font-normal"
                />
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
                  className="btn-3d inline-flex items-center gap-2 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs sm:text-sm px-6 py-2.5 rounded-xl shadow-md transition-all cursor-pointer disabled:opacity-50"
                >
                  <Send size={15} />
                  <span>{submitting ? 'Publishing...' : editingNewsletter ? 'Update Edition' : 'Publish Gazette Edition'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
