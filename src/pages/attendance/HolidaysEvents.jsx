import React, { useState, useEffect } from 'react';
import { api, useAuth } from '../../context/AuthContext';
import { 
  Plus, 
  Calendar as CalendarIcon, 
  Sparkles, 
  Clock, 
  MapPin, 
  Trash2, 
  CheckCircle2, 
  AlertCircle,
  Loader2,
  X,
  Upload,
  CalendarDays
} from 'lucide-react';

const HolidaysEvents = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('holidays'); // 'holidays' | 'events'
  
  const [holidays, setHolidays] = useState([]);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [showHolidayModal, setShowHolidayModal] = useState(false);
  const [showEventModal, setShowEventModal] = useState(false);

  const [holidayForm, setHolidayForm] = useState({
    name: '',
    date: '',
    type: 'Public'
  });

  const [eventForm, setEventForm] = useState({
    name: '',
    description: '',
    date: '',
    time: '',
    venue: ''
  });
  const [eventBanner, setEventBanner] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    setError('');
    try {
      const [holidaysRes, eventsRes] = await Promise.all([
        api.get('/holidays'),
        api.get('/events')
      ]);

      if (holidaysRes.data.success) {
        setHolidays(holidaysRes.data.data);
      }
      if (eventsRes.data.success) {
        setEvents(eventsRes.data.data);
      }
    } catch (err) {
      console.error(err);
      setError('Failed to fetch holidays & events register.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleHolidaySubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    setSuccess('');

    try {
      const res = await api.post('/holidays', holidayForm);
      if (res.data.success) {
        setSuccess(`Holiday "${holidayForm.name}" added successfully!`);
        setShowHolidayModal(false);
        setHolidayForm({ name: '', date: '', type: 'Public' });
        fetchData();
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add holiday.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEventSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    setSuccess('');

    const eventData = new FormData();
    eventData.append('name', eventForm.name);
    eventData.append('description', eventForm.description);
    eventData.append('date', eventForm.date);
    eventData.append('time', eventForm.time);
    eventData.append('venue', eventForm.venue);
    if (eventBanner) {
      eventData.append('banner', eventBanner);
    }

    try {
      const res = await api.post('/events', eventData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      if (res.data.success) {
        setSuccess(`Corporate Event "${eventForm.name}" created successfully!`);
        setShowEventModal(false);
        setEventForm({ name: '', description: '', date: '', time: '', venue: '' });
        setEventBanner(null);
        fetchData();
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create event.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteHoliday = async (id, name) => {
    if (window.confirm(`Delete holiday "${name}"?`)) {
      setError('');
      setSuccess('');
      try {
        const res = await api.delete(`/holidays/${id}`);
        if (res.data.success) {
          setSuccess(`Holiday "${name}" deleted.`);
          fetchData();
        }
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to delete holiday.');
      }
    }
  };

  const handleDeleteEvent = async (id, name) => {
    if (window.confirm(`Delete event "${name}"?`)) {
      setError('');
      setSuccess('');
      try {
        const res = await api.delete(`/events/${id}`);
        if (res.data.success) {
          setSuccess(`Event "${name}" deleted.`);
          fetchData();
        }
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to delete event.');
      }
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return 'TBD';
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return String(dateStr);
    return d.toLocaleDateString([], { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' });
  };

  return (
    <div className="space-y-6">
      
      {success && (
        <div className="flex items-center gap-3 p-4 bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900/30 text-emerald-600 dark:text-emerald-400 text-sm font-medium rounded-2xl animate-fade-in">
          <CheckCircle2 className="w-5 h-5 shrink-0" />
          <span>{success}</span>
          <button onClick={() => setSuccess('')} className="ml-auto p-1 hover:bg-emerald-100 dark:hover:bg-emerald-900/50 rounded-lg"><X className="w-4 h-4" /></button>
        </div>
      )}

      {error && (
        <div className="flex items-center gap-3 p-4 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/30 text-red-600 dark:text-red-400 text-sm font-medium rounded-2xl animate-fade-in">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{error}</span>
          <button onClick={() => setError('')} className="ml-auto p-1 hover:bg-red-100 dark:hover:bg-red-900/50 rounded-lg"><X className="w-4 h-4" /></button>
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-4 justify-between items-stretch sm:items-center bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm">
        
        <div className="flex items-center gap-2 p-1 bg-slate-100 dark:bg-slate-950 rounded-2xl w-fit">
          <button
            onClick={() => setActiveTab('holidays')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'holidays'
                ? 'bg-white dark:bg-slate-800 text-primary-600 dark:text-primary-400 shadow-sm'
                : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <CalendarDays className="w-4 h-4" />
            Company Holidays ({holidays.length})
          </button>

          <button
            onClick={() => setActiveTab('events')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'events'
                ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-sm'
                : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            Corporate Events ({events.length})
          </button>
        </div>

        {user?.role === 'Admin' && (
          <div className="flex items-center gap-3">
            {activeTab === 'holidays' ? (
              <button
                onClick={() => setShowHolidayModal(true)}
                className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-gradient-to-r from-primary-500 to-indigo-600 hover:from-primary-600 hover:to-indigo-700 text-white font-semibold text-sm shadow-md shadow-primary-500/10 active:scale-[0.98] transition-all"
              >
                <Plus className="w-4 h-4" />
                Insert Holiday
              </button>
            ) : (
              <button
                onClick={() => setShowEventModal(true)}
                className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-semibold text-sm shadow-md shadow-indigo-500/10 active:scale-[0.98] transition-all"
              >
                <Plus className="w-4 h-4" />
                Add Corporate Event
              </button>
            )}
          </div>
        )}
      </div>

      {activeTab === 'holidays' && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/60 dark:border-slate-800 shadow-sm overflow-hidden">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 text-slate-400">
              <Loader2 className="w-8 h-8 animate-spin text-primary-500" />
              <span className="mt-2 text-sm">Loading holiday schedule...</span>
            </div>
          ) : holidays.length === 0 ? (
            <div className="text-center py-16 text-slate-400">
              <CalendarIcon className="w-12 h-12 mx-auto stroke-[1.5] mb-2 opacity-40" />
              <p className="text-sm font-semibold">No holidays configured yet.</p>
              <p className="text-xs">Click "Insert Holiday" to add official dates.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    <th className="px-6 py-4">Holiday Name</th>
                    <th className="px-6 py-4">Scheduled Date</th>
                    <th className="px-6 py-4 text-center">Type</th>
                    {user?.role === 'Admin' && <th className="px-6 py-4 text-right">Action</th>}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-sm">
                  {holidays.map((h) => (
                    <tr key={h._id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                      <td className="px-6 py-4 font-semibold text-slate-800 dark:text-slate-200">
                        {h.name}
                      </td>

                      <td className="px-6 py-4 text-slate-600 dark:text-slate-400 text-xs font-medium">
                        {formatDate(h.date)}
                      </td>

                      <td className="px-6 py-4 text-center">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${
                          h.type === 'Public'
                            ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/20 dark:text-emerald-400'
                            : 'bg-primary-50 text-primary-700 dark:bg-primary-950/20 dark:text-primary-400'
                        }`}>
                          {h.type} Holiday
                        </span>
                      </td>

                      {user?.role === 'Admin' && (
                        <td className="px-6 py-4 text-right">
                          <button
                            onClick={() => handleDeleteHoliday(h._id, h.name)}
                            className="p-2 rounded-xl text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20 transition-all"
                            title="Delete Holiday"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {activeTab === 'events' && (
        <div className="space-y-4">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 text-slate-400">
              <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
              <span className="mt-2 text-sm">Loading corporate events...</span>
            </div>
          ) : events.length === 0 ? (
            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/60 dark:border-slate-800 p-12 text-center text-slate-400">
              <Sparkles className="w-12 h-12 mx-auto stroke-[1.5] mb-2 opacity-40" />
              <p className="text-sm font-semibold">No corporate events scheduled.</p>
              <p className="text-xs">Click "Add Corporate Event" to publish an event.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {events.map((evt) => (
                <div key={evt._id} className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/60 dark:border-slate-800 p-6 shadow-sm flex flex-col justify-between space-y-4">
                  
                  {evt.bannerUrl && (
                    <div className="w-full h-40 rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-800">
                      <img src={evt.bannerUrl} alt={evt.name} className="w-full h-full object-cover" />
                    </div>
                  )}

                  <div className="space-y-2">
                    <div className="flex items-start justify-between gap-3">
                      <h3 className="font-bold text-base text-slate-850 dark:text-slate-100">{evt.name}</h3>
                      {user?.role === 'Admin' && (
                        <button
                          onClick={() => handleDeleteEvent(evt._id, evt.name)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20 transition-all shrink-0"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">{evt.description}</p>
                  </div>

                  <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 grid grid-cols-2 gap-2 text-xs">
                    <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300 font-medium">
                      <CalendarIcon className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                      <span>{formatDate(evt.date)}</span>
                    </div>

                    <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300 font-medium">
                      <Clock className="w-3.5 h-3.5 text-purple-500 shrink-0" />
                      <span>{evt.time}</span>
                    </div>

                    <div className="col-span-2 flex items-center gap-1.5 text-slate-600 dark:text-slate-300 font-medium mt-1">
                      <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                      <span className="truncate">{evt.venue}</span>
                    </div>
                  </div>

                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {showHolidayModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-850 rounded-3xl shadow-xl">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-lg font-bold text-slate-850 dark:text-slate-200">Insert Holiday Entry</h3>
              <button onClick={() => setShowHolidayModal(false)} className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleHolidaySubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1.5 uppercase">Holiday Title</label>
                <input
                  type="text"
                  value={holidayForm.name}
                  onChange={(e) => setHolidayForm({ ...holidayForm, name: e.target.value })}
                  required
                  placeholder="e.g. Independence Day"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/40"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1.5 uppercase">Holiday Date</label>
                <input
                  type="date"
                  value={holidayForm.date}
                  onChange={(e) => setHolidayForm({ ...holidayForm, date: e.target.value })}
                  required
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/40"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1.5 uppercase">Holiday Type</label>
                <select
                  value={holidayForm.type}
                  onChange={(e) => setHolidayForm({ ...holidayForm, type: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/40"
                >
                  <option value="Public" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100">Public Holiday</option>
                  <option value="Company" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100">Company Restricted Holiday</option>
                </select>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowHolidayModal(false)}
                  className="px-5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-sm font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-primary-500 to-indigo-600 text-white font-semibold text-sm shadow-md shadow-primary-500/10"
                >
                  {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
                  Save Holiday
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showEventModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="w-full max-w-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-850 rounded-3xl shadow-xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-lg font-bold text-slate-850 dark:text-slate-200">Insert Corporate Event</h3>
              <button onClick={() => setShowEventModal(false)} className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleEventSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1.5 uppercase">Event Title</label>
                <input
                  type="text"
                  value={eventForm.name}
                  onChange={(e) => setEventForm({ ...eventForm, name: e.target.value })}
                  required
                  placeholder="e.g. Annual Strategy Summit 2026"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1.5 uppercase">Description</label>
                <textarea
                  value={eventForm.description}
                  onChange={(e) => setEventForm({ ...eventForm, description: e.target.value })}
                  required
                  rows="3"
                  placeholder="Event agenda and key details..."
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1.5 uppercase">Event Date</label>
                  <input
                    type="date"
                    value={eventForm.date}
                    onChange={(e) => setEventForm({ ...eventForm, date: e.target.value })}
                    required
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1.5 uppercase">Event Time</label>
                  <input
                    type="text"
                    value={eventForm.time}
                    onChange={(e) => setEventForm({ ...eventForm, time: e.target.value })}
                    required
                    placeholder="e.g. 10:00 AM IST"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1.5 uppercase">Venue / Room</label>
                <input
                  type="text"
                  value={eventForm.venue}
                  onChange={(e) => setEventForm({ ...eventForm, venue: e.target.value })}
                  required
                  placeholder="e.g. Grand Conference Hall B or Virtual Zoom"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1.5 uppercase">Event Banner Image (Optional)</label>
                <div className="relative border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-xl p-4 flex flex-col items-center justify-center hover:bg-slate-50 dark:hover:bg-slate-950/40 cursor-pointer">
                  <Upload className="w-6 h-6 text-slate-400 mb-1.5" />
                  <span className="text-xs text-slate-500">{eventBanner ? eventBanner.name : 'Upload JPG/PNG banner (Max 5MB)'}</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setEventBanner(e.target.files[0])}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowEventModal(false)}
                  className="px-5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-sm font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold text-sm shadow-md shadow-indigo-500/10"
                >
                  {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
                  Publish Event
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default HolidaysEvents;
