import React, { useState, useEffect } from 'react';
import { api, useAuth } from '../../context/AuthContext';
import { 
  Megaphone, 
  Plus, 
  Trash2, 
  Calendar, 
  AlertTriangle,
  AlertCircle,
  Loader2, 
  X,
  Send,
  User,
  CheckCircle
} from 'lucide-react';

const Announcements = () => {
  const { user } = useAuth();
  const isAdmin = user?.role === 'Admin';

  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'Low'
  });

  const fetchAnnouncements = async () => {
    setLoading(true);
    try {
      const res = await api.get('/announcements');
      if (res.data.success) {
        setAnnouncements(res.data.data);
      }
    } catch (err) {
      console.error(err);
      setError('Failed to fetch announcements bulletin.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    setSuccess('');

    try {
      const res = await api.post('/announcements', formData);
      if (res.data.success) {
        setSuccess('Announcement broadcasted successfully!');
        setShowModal(false);
        setFormData({ title: '', description: '', priority: 'Low' });
        fetchAnnouncements();
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to post announcement.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id, title) => {
    if (window.confirm(`Are you sure you want to delete the announcement "${title}"?`)) {
      try {
        const res = await api.delete(`/announcements/${id}`);
        if (res.data.success) {
          setSuccess('Announcement deleted successfully.');
          fetchAnnouncements();
        }
      } catch (err) {
        setError('Failed to delete announcement.');
      }
    }
  };

  const getPriorityBadgeClass = (priority) => {
    switch (priority) {
      case 'High':
        return 'bg-rose-50 text-rose-700 dark:bg-rose-950/20 dark:text-rose-450 border border-rose-100 dark:border-rose-900/30';
      case 'Medium':
        return 'bg-amber-50 text-amber-700 dark:bg-amber-950/20 dark:text-amber-400 border border-amber-100 dark:border-amber-900/30';
      default:
        return 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400 border-transparent';
    }
  };

  const formatDateTime = (dateStr) => {
    return new Date(dateStr).toLocaleDateString([], { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      
      {success && (
        <div className="flex items-center gap-3 p-4 bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900/30 text-emerald-600 dark:text-emerald-400 text-sm font-medium rounded-2xl animate-fade-in">
          <CheckCircle className="w-5 h-5 shrink-0" />
          <span>{success}</span>
        </div>
      )}

      {error && (
        <div className="flex items-center gap-3 p-4 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/30 text-red-600 dark:text-red-400 text-sm font-medium rounded-2xl animate-fade-in">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <div className="flex items-center justify-between bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary-50 dark:bg-primary-950/20 text-primary-500 flex items-center justify-center">
            <Megaphone className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-850 dark:text-slate-200 uppercase tracking-wide">Company Announcements</h2>
            <p className="text-xs text-slate-400 mt-0.5">Stay updated with the latest corporate bulletins</p>
          </div>
        </div>

        {isAdmin && (
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-primary-500 to-indigo-650 text-white font-semibold text-xs rounded-xl shadow-md transition-all active:scale-[0.98]"
          >
            <Plus className="w-4 h-4" />
            New Broadcast
          </button>
        )}
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20 text-slate-400">
          <Loader2 className="w-8 h-8 animate-spin text-primary-500" />
        </div>
      ) : announcements.length === 0 ? (
        <div className="text-center py-20 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl text-slate-400">
          <Megaphone className="w-12 h-12 mx-auto stroke-[1.2] opacity-35 mb-2" />
          <p className="text-sm font-semibold">No announcements have been broadcasted.</p>
          <p className="text-xs">Important corporate bulletins will populate here.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {announcements.map((ann) => (
            <div 
              key={ann._id} 
              className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200/60 dark:border-slate-800 shadow-sm flex flex-col justify-between hover:border-primary-500/20 transition-colors relative group"
            >
              
              <div className="flex justify-between items-start gap-4">
                <div className="flex items-center gap-2.5">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded text-[9px] font-extrabold uppercase ${getPriorityBadgeClass(ann.priority)}`}>
                    {ann.priority === 'High' && <AlertTriangle className="w-3 h-3 mr-1 shrink-0" />}
                    {ann.priority} Priority
                  </span>
                  <span className="text-[10px] text-slate-400 flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-slate-400" />
                    {formatDateTime(ann.createdAt)}
                  </span>
                </div>

                {isAdmin && (
                  <button
                    onClick={() => handleDelete(ann._id, ann.title)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 md:opacity-0 group-hover:opacity-100 transition-opacity"
                    title="Delete Announcement"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>

              <div className="mt-4 space-y-2.5">
                <h3 className="text-base font-bold text-slate-800 dark:text-slate-100 leading-snug">{ann.title}</h3>
                <p className="text-xs text-slate-600 dark:text-slate-450 leading-relaxed whitespace-pre-line">{ann.description}</p>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800/60 flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-850 flex items-center justify-center text-primary-600 font-bold shrink-0 text-xs">
                  <User className="w-4 h-4 text-slate-400" />
                </div>
                <div className="text-[11px]">
                  <p className="font-semibold text-slate-700 dark:text-slate-350">{ann.author?.fullName || 'System Admin'}</p>
                  <p className="text-slate-400 mt-0.5">{ann.author?.designation || 'IT Administrator'}</p>
                </div>
              </div>

            </div>
          ))}
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-850 rounded-3xl shadow-xl">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-sm font-bold text-slate-850 dark:text-slate-200">New Broadcast Announcement</h3>
              <button onClick={() => setShowModal(false)} className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1.5 uppercase">Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Server Maintenance or Office Relocation"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/40"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1.5 uppercase">Broadcast Priority</label>
                <select
                  name="priority"
                  value={formData.priority}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/40"
                >
                  <option value="Low">Low Priority</option>
                  <option value="Medium">Medium Priority</option>
                  <option value="High">High (Urgent Alerts)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1.5 uppercase">Announcement Details</label>
                <textarea
                  required
                  name="description"
                  rows="4"
                  placeholder="Write the details to be broadcasted to all employees..."
                  value={formData.description}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/40"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-gradient-to-r from-primary-500 to-indigo-650 text-white font-semibold text-xs shadow-md"
                >
                  <Send className="w-3.5 h-3.5" />
                  {submitting ? 'Broadcasting...' : 'Broadcast'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default Announcements;
