import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../context/AuthContext';
import { 
  CheckCircle, 
  Clock, 
  ChevronRight, 
  Megaphone,
  Loader2,
  CalendarCheck2
} from 'lucide-react';

const EmployeeDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchEmployeeStats = async () => {
      try {
        const res = await api.get('/dashboard/employee');
        if (res.data.success) {
          setData(res.data.data);
        }
      } catch (err) {
        console.error(err);
        setError('Failed to fetch dashboard metrics.');
      } finally {
        setLoading(false);
      }
    };

    fetchEmployeeStats();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] text-slate-400">
        <Loader2 className="w-8 h-8 animate-spin text-primary-500 mb-2" />
        <p className="text-sm font-medium">Loading your profile console...</p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="glass-panel p-6 rounded-3xl text-center text-red-500">
        <p className="font-semibold">{error || 'Something went wrong.'}</p>
      </div>
    );
  }

  const { stats, weeklyGrid, announcements, todayLog } = data;

  const cardMetrics = [
    { label: 'Present (Last 30 days)', value: `${stats.presentDays} days`, icon: CheckCircle, color: 'text-emerald-500', bg: 'bg-emerald-50 dark:bg-emerald-950/20' },
    { label: 'Late Arrivals', value: `${stats.lateDays} times`, icon: Clock, color: 'text-amber-500', bg: 'bg-amber-50 dark:bg-amber-950/20' },
    { label: 'Leaves Approved', value: `${stats.leaveDays} days`, icon: CalendarCheck2, color: 'text-purple-500', bg: 'bg-purple-50 dark:bg-purple-950/20' },
  ];

  const formatTime = (timeStr) => {
    if (!timeStr) return '--:--';
    return new Date(timeStr).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const getStatusClass = (status) => {
    switch (status) {
      case 'Present':
        return 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/25 dark:text-emerald-400 border-emerald-100 dark:border-emerald-900/30';
      case 'Late':
        return 'bg-amber-50 text-amber-700 dark:bg-amber-950/25 dark:text-amber-400 border-amber-100 dark:border-amber-900/30';
      case 'Leave':
        return 'bg-purple-50 text-purple-700 dark:bg-purple-950/25 dark:text-purple-400 border-purple-100 dark:border-purple-900/30';
      case 'Absent':
        return 'bg-red-50 text-red-700 dark:bg-red-950/25 dark:text-red-400 border-red-100 dark:border-red-900/30';
      case 'Weekend':
      case 'Holiday':
        return 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400 border-transparent';
      default:
        return 'bg-slate-50 text-slate-400 dark:bg-slate-900/40 border-slate-100 dark:border-slate-800';
    }
  };

  return (
    <div className="space-y-8">
      
      {/* Upper Grid: Welcome banner & stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Quick Check-in Access card */}
        <div className="md:col-span-2 bg-gradient-to-tr from-primary-600 to-indigo-700 text-white p-6 rounded-3xl shadow-lg relative overflow-hidden flex flex-col justify-between min-h-[180px]">
          {/* Background decoration */}
          <div className="absolute right-0 bottom-0 top-0 w-1/3 bg-[radial-gradient(circle_at_bottom_right,rgba(255,255,255,0.15),transparent_70%)] pointer-events-none" />
          <div className="absolute left-6 bottom-6 w-24 h-24 rounded-full bg-white/5 blur-2xl pointer-events-none" />

          <div className="space-y-2">
            <span className="text-[10px] font-bold uppercase tracking-wider bg-white/20 px-2.5 py-1 rounded-full">Attendance Desk</span>
            <h2 className="text-xl md:text-2xl font-extrabold tracking-tight mt-2">
              {todayLog?.checkOut?.time 
                ? "Shift Finished! Have a great evening." 
                : todayLog?.checkIn?.time 
                  ? "Logged In. Remember to check-out when leaving." 
                  : "Ready for check-in?"}
            </h2>
            <p className="text-xs text-primary-100 max-w-md">
              Secure attendance access using real-time facial feature mapping and GPS geofence radius checks.
            </p>
          </div>

          <div className="flex justify-between items-center pt-4">
            <div className="text-xs text-primary-200">
              {todayLog?.checkIn?.time && (
                <span>Checked In: <strong className="text-white">{formatTime(todayLog.checkIn.time)}</strong></span>
              )}
            </div>

            {(!todayLog || !todayLog.checkOut?.time) && (
              <Link
                to="/employee/attendance"
                className="flex items-center gap-1.5 px-5 py-2.5 bg-white text-primary-600 hover:bg-slate-50 font-bold text-xs rounded-xl shadow-md transition-all active:scale-[0.98]"
              >
                Go to Portal
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            )}
          </div>
        </div>

        {/* stats cards list */}
        <div className="space-y-4">
          {cardMetrics.map((card, idx) => {
            const Icon = card.icon;
            return (
              <div key={idx} className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200/60 dark:border-slate-800 shadow-sm flex items-center gap-4">
                <div className={`w-10 h-10 rounded-xl ${card.bg} ${card.color} flex items-center justify-center shrink-0`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-[10px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wide">{card.label}</p>
                  <p className="text-base font-bold text-slate-800 dark:text-slate-200 mt-0.5">{card.value}</p>
                </div>
              </div>
            );
          })}
        </div>

      </div>

      {/* Main Grid: Weekly Log Calendar & Announcement Bulletin */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Weekly Log Grid (8 Columns) */}
        <div className="lg:col-span-8 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200/60 dark:border-slate-800 shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wide border-b border-slate-100 dark:border-slate-800 pb-3">
            Current Week Roster Grid
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-5 gap-4">
            {weeklyGrid.map((day, idx) => (
              <div 
                key={idx} 
                className={`p-4 rounded-2xl border text-center flex flex-col justify-between min-h-[140px] transition-all hover:scale-[1.02] ${getStatusClass(day.status)}`}
              >
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider opacity-85">{day.day}</p>
                  <p className="text-[10px] opacity-60 mt-0.5">{new Date(day.date).toLocaleDateString([], { month: 'short', day: 'numeric' })}</p>
                </div>
                
                <div className="my-3 space-y-0.5">
                  <div className="text-[10px]">
                    <span className="opacity-60 block">In: {formatTime(day.checkIn)}</span>
                    <span className="opacity-60 block">Out: {formatTime(day.checkOut)}</span>
                  </div>
                </div>

                <div>
                  <span className="inline-block px-2.5 py-0.5 rounded-full text-[9px] font-extrabold uppercase border border-current">
                    {day.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Announcement Feed Cards (4 Columns) */}
        <div className="lg:col-span-4 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200/60 dark:border-slate-800 shadow-sm flex flex-col">
          <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wide border-b border-slate-100 dark:border-slate-800 pb-3 mb-4">
            Announcements Board
          </h3>

          <div className="flex-1 overflow-y-auto space-y-4 max-h-[300px] pr-2">
            {announcements.length === 0 ? (
              <div className="text-center py-12 text-slate-400">
                <Megaphone className="w-8 h-8 mx-auto opacity-30 mb-2" />
                <p className="text-xs font-medium">No announcements broadcasted yet.</p>
              </div>
            ) : (
              announcements.map((ann) => (
                <div key={ann._id} className="p-3.5 bg-slate-50 dark:bg-slate-950/30 rounded-2xl border border-slate-100 dark:border-slate-800/80 space-y-2">
                  <div className="flex justify-between items-start">
                    <span className={`px-2 py-0.5 rounded text-[8px] font-bold uppercase ${
                      ann.priority === 'High' 
                        ? 'bg-rose-50 text-rose-600 dark:bg-rose-950/20' 
                        : ann.priority === 'Medium' 
                          ? 'bg-amber-50 text-amber-600 dark:bg-amber-950/20'
                          : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                    }`}>
                      {ann.priority} Priority
                    </span>
                    <span className="text-[9px] text-slate-400">
                      {new Date(ann.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                    </span>
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 leading-snug">{ann.title}</h4>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 line-clamp-2 leading-relaxed">{ann.description}</p>
                  </div>
                  <div className="text-[9px] text-slate-400 border-t border-slate-100 dark:border-slate-800/50 pt-1.5 flex justify-between">
                    <span>By: {ann.author?.fullName || 'Admin'}</span>
                    <span className="italic">{ann.author?.designation}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

      </div>

    </div>
  );
};

export default EmployeeDashboard;
