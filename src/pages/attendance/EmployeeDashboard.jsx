import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api, useAuth } from '../../context/AuthContext';
import {
  CheckCircle2,
  Clock,
  ChevronRight,
  Megaphone,
  Loader2,
  CalendarCheck2,
  AlertCircle,
  Calendar as CalendarIcon,
  ListFilter,
  ChevronLeft,
  Search,
  Sparkles,
  ShieldCheck,
  Info,
  X,
  User,
  ArrowRight,
  Mail,
  Phone,
  MapPin,
  Building2,
  Copy,
  Check,
  Fingerprint
} from 'lucide-react';

const EmployeeDashboard = () => {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Calendar state
  const [calendarYear, setCalendarYear] = useState(new Date().getFullYear());
  const [calendarMonth, setCalendarMonth] = useState(new Date().getMonth() + 1); // 1-12
  const [calendarData, setCalendarData] = useState(null);
  const [calendarLoading, setCalendarLoading] = useState(false);
  const [selectedDayDetails, setSelectedDayDetails] = useState(null);

  // Logs table state
  const [logsSearch, setLogsSearch] = useState('');
  const [logsStatusFilter, setLogsStatusFilter] = useState('All');
  const [historyLogs, setHistoryLogs] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(false);

  // Profile data & copy state
  const [profileData, setProfileData] = useState(null);
  const [copiedField, setCopiedField] = useState('');

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  // Initial fetch for summary metrics
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

  // Fetch calendar data for month
  const fetchCalendar = async (year, month) => {
    setCalendarLoading(true);
    try {
      const res = await api.get(`/attendance/calendar?year=${year}&month=${month}`);
      if (res.data.success) {
        setCalendarData(res.data.data);
      }
    } catch (err) {
      console.error('Failed to fetch calendar:', err);
    } finally {
      setCalendarLoading(false);
    }
  };

  // Fetch logs history
  const fetchHistory = async () => {
    setHistoryLoading(true);
    try {
      const res = await api.get('/attendance/history');
      if (res.data.success) {
        setHistoryLogs(res.data.data);
      }
    } catch (err) {
      console.error('Failed to fetch logs history:', err);
    } finally {
      setHistoryLoading(false);
    }
  };

  useEffect(() => {
    // Parallelize all initial fetches for fastest initial paint
    Promise.allSettled([
      fetchEmployeeStats(),
      fetchCalendar(calendarYear, calendarMonth),
      fetchHistory(),
      api.get('/auth/me').then(res => {
        if (res.data.success) {
          setProfileData(res.data.user);
        }
      }).catch(err => console.error('Failed to load profile for dashboard:', err))
    ]);
  }, []);

  const handleCopy = (text, fieldName) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    setTimeout(() => setCopiedField(''), 2000);
  };

  const calculateTenure = (dateStr) => {
    if (!dateStr) return 'Active Member';
    const start = new Date(dateStr);
    const now = new Date();
    const diffTime = Math.abs(now - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 30) return `${diffDays} days`;
    const months = Math.floor(diffDays / 30);
    if (months < 12) return `${months} month${months > 1 ? 's' : ''}`;
    const years = Math.floor(months / 12);
    const remainingMonths = months % 12;
    return `${years} yr${years > 1 ? 's' : ''} ${remainingMonths > 0 ? `${remainingMonths} mo` : ''}`;
  };

  const handlePrevMonth = () => {
    let newM = calendarMonth - 1;
    let newY = calendarYear;
    if (newM < 1) {
      newM = 12;
      newY -= 1;
    }
    setCalendarMonth(newM);
    setCalendarYear(newY);
    fetchCalendar(newY, newM);
  };

  const handleNextMonth = () => {
    let newM = calendarMonth + 1;
    let newY = calendarYear;
    if (newM > 12) {
      newM = 1;
      newY += 1;
    }
    setCalendarMonth(newM);
    setCalendarYear(newY);
    fetchCalendar(newY, newM);
  };

  const handleCurrentMonth = () => {
    const now = new Date();
    const curY = now.getFullYear();
    const curM = now.getMonth() + 1;
    setCalendarYear(curY);
    setCalendarMonth(curM);
    fetchCalendar(curY, curM);
  };

  const formatTime = (timeStr) => {
    if (!timeStr) return '--:--';
    return new Date(timeStr).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const getStatusClass = (status) => {
    switch (status) {
      case 'Present':
        return 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30';
      case 'Late':
        return 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30';
      case 'Half Day':
        return 'bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/30';
      case 'Leave':
        return 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/30';
      case 'Absent':
        return 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/30';
      case 'Holiday':
        return 'bg-sky-500/10 text-sky-600 dark:text-sky-400 border-sky-500/30';
      case 'Weekend':
        return 'bg-slate-500/10 text-slate-500 dark:text-slate-400 border-slate-500/20';
      default:
        return 'bg-slate-100 text-slate-400 dark:bg-slate-900/40 border-slate-200 dark:border-slate-800';
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] text-slate-500 dark:text-slate-400 space-y-4 animate-fadeIn">
        <div className="relative flex items-center justify-center">
          <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 dark:bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center">
            <CalendarCheck2 className="w-7 h-7 text-indigo-600 dark:text-indigo-400 animate-pulse" />
          </div>
          <Loader2 className="w-16 h-16 animate-spin text-primary-500 absolute -inset-1 opacity-70" />
        </div>
        <div className="text-center space-y-1">
          <p className="text-sm font-bold text-slate-800 dark:text-slate-100">
            Loading Attendance Console
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm">
            Synchronizing shift roster, monthly logs, and live biometrics status...
          </p>
        </div>
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
    { label: 'Present (Last 30 days)', value: `${stats.presentDays} Days`, icon: CheckCircle2, color: 'text-emerald-500', bg: 'bg-emerald-50 dark:bg-emerald-950/30' },
    { label: 'Late (After 10:00 AM)', value: `${stats.lateDays} Times`, icon: Clock, color: 'text-amber-500', bg: 'bg-amber-50 dark:bg-amber-950/30' },
    { label: 'Leaves Approved', value: `${stats.leaveDays} Days`, icon: CalendarCheck2, color: 'text-purple-500', bg: 'bg-purple-50 dark:bg-purple-950/30' },
  ];

  // Filter logs history
  const filteredLogs = historyLogs.filter(log => {
    const matchesSearch = log.date.includes(logsSearch) ||
      (log.checkIn?.deviceInfo && log.checkIn.deviceInfo.toLowerCase().includes(logsSearch.toLowerCase())) ||
      (log.checkIn?.gps?.address && log.checkIn.gps.address.toLowerCase().includes(logsSearch.toLowerCase()));

    const matchesStatus = logsStatusFilter === 'All' || log.status === logsStatusFilter;
    return matchesSearch && matchesStatus;
  });

  // Calculate calendar blank prefix slots (Monday = 1, Sunday = 7)
  let blankDays = 0;
  if (calendarData?.calendar?.length > 0) {
    const firstDayOfWeek = calendarData.calendar[0].dayOfWeek; // 0 = Sunday, 1 = Monday
    blankDays = firstDayOfWeek === 0 ? 6 : firstDayOfWeek - 1;
  }

  return (
    <div className="space-y-8 animate-fadeIn">

      {/* Short Attendance Alert Banner */}
      {data?.shortAttendanceAlert && (
        <div className="flex items-center gap-3 p-4 rounded-3xl bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/30 text-red-700 dark:text-red-400 text-sm leading-relaxed shadow-sm">
          <AlertCircle className="w-5 h-5 shrink-0 animate-bounce" />
          <div className="flex-1">
            <span className="font-bold">⚠️ Notice: Short Attendance Alert!</span> Your attendance percentage for this month is <span className="font-bold">{data.attendancePercentage}%</span> (minimum required is 80%). Please check in regularly to maintain active standing.
          </div>
        </div>
      )}

      {/* Top Banner: Shift Info, Welcome & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* Main Banner (8 Columns) */}
        <div className="lg:col-span-8 bg-gradient-to-r from-primary-600 via-indigo-600 to-indigo-800 text-white p-6 md:p-8 rounded-3xl shadow-xl relative overflow-hidden flex flex-col justify-between min-h-[200px]">
          <div className="absolute right-0 bottom-0 top-0 w-1/2 bg-[radial-gradient(circle_at_bottom_right,rgba(255,255,255,0.18),transparent_70%)] pointer-events-none" />
          <div className="absolute left-10 top-0 w-32 h-32 rounded-full bg-white/5 blur-3xl pointer-events-none" />

          <div className="space-y-3 relative z-10">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-wider bg-white/20 backdrop-blur-md px-3 py-1 rounded-full">
                Attendance Terminal
              </span>
              <span className="text-[10px] font-bold uppercase tracking-wider bg-amber-400/20 text-amber-200 border border-amber-300/30 px-3 py-1 rounded-full flex items-center gap-1">
                <Clock className="w-3 h-3" /> Shift: 10:00 AM – 06:00 PM (Mon–Sat)
              </span>
            </div>

            <h2 className="text-2xl md:text-3xl font-black tracking-tight">
              {todayLog?.checkOut?.time
                ? "Shift Completed! Great work today."
                : todayLog?.checkIn?.time
                  ? "You are Logged In. Have a productive day!"
                  : "Welcome! Ready to mark attendance?"}
            </h2>

            <p className="text-xs text-primary-100 max-w-lg leading-relaxed">
              Standard shift starts at <strong>10:00 AM</strong>. Saturdays are active working days. Your daily punches, hours worked, and monthly attendance calendar are tracked in real-time.
            </p>
          </div>

          <div className="flex flex-wrap justify-between items-center pt-6 relative z-10 gap-3 border-t border-white/10 mt-4">
            <div className="text-xs text-primary-200 flex items-center gap-4">
              {todayLog?.checkIn?.time && (
                <span>In: <strong className="text-white bg-white/10 px-2 py-0.5 rounded-lg">{formatTime(todayLog.checkIn.time)}</strong></span>
              )}
              {todayLog?.checkOut?.time && (
                <span>Out: <strong className="text-white bg-white/10 px-2 py-0.5 rounded-lg">{formatTime(todayLog.checkOut.time)}</strong></span>
              )}
              {todayLog?.workHours > 0 && (
                <span>Hours: <strong className="text-emerald-300 font-bold">{todayLog.workHours} hrs</strong></span>
              )}
            </div>

            <div className="flex items-center gap-2">
              <Link
                to="/employee/profile"
                className="flex items-center gap-1.5 px-4 py-2.5 bg-white/15 hover:bg-white/20 text-white font-semibold text-xs rounded-xl border border-white/15 transition-all"
              >
                <User className="w-3.5 h-3.5" />
                My Profile
              </Link>
              <Link
                to="/employee/attendance"
                className="flex items-center gap-2 px-5 py-2.5 bg-white text-primary-700 hover:bg-slate-50 font-bold text-xs rounded-xl shadow-lg transition-all active:scale-[0.98]"
              >
                <Clock className="w-4 h-4 text-primary-600" />
                {todayLog?.checkIn?.time ? (todayLog?.checkOut?.time ? 'Portal View' : 'Check Out Now') : 'Punch In Now'}
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>

        {/* 3 Metric Cards (4 Columns) */}
        <div className="lg:col-span-4 flex flex-col justify-between gap-3">
          {cardMetrics.map((card, idx) => {
            const Icon = card.icon;
            return (
              <div
                key={idx}
                className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200/60 dark:border-slate-800 shadow-sm flex items-center justify-between hover:border-primary-500/30 transition-all"
              >
                <div className="flex items-center gap-3.5">
                  <div className={`w-11 h-11 rounded-2xl ${card.bg} ${card.color} flex items-center justify-center shrink-0 shadow-sm`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">{card.label}</p>
                    <p className="text-lg font-extrabold text-slate-800 dark:text-slate-100 mt-0.5">{card.value}</p>
                  </div>
                </div>
                <div className="text-xs font-bold text-slate-300 dark:text-slate-600">
                  30d
                </div>
              </div>
            );
          })}
        </div>

      </div>

      {/* Week Attendance Roster (Attractive 6-Day Grid: Mon - Sat) */}
      <div className="bg-white dark:bg-slate-900 p-6 md:p-7 rounded-3xl border border-slate-200/60 dark:border-slate-800 shadow-sm space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-primary-50 dark:bg-primary-950/40 text-primary-600 dark:text-primary-400 flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">
                Current Week Attendance Grid (6-Day Working Schedule)
              </h3>
              <p className="text-xs text-slate-400">
                Monday to Saturday roster with official 10:00 AM shift timing.
              </p>
            </div>
          </div>
          <span className="text-xs font-semibold px-3 py-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-full w-fit">
            Mon – Sat Active
          </span>
        </div>

        {/* 6-Day Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
          {weeklyGrid.map((day, idx) => {
            const todayStr = new Date().toISOString().split('T')[0];
            const isToday = day.date === todayStr;

            return (
              <div
                key={idx}
                className={`relative p-4 rounded-2xl border text-center flex flex-col justify-between min-h-[160px] transition-all duration-300 hover:scale-[1.03] hover:shadow-md ${getStatusClass(day.status)} ${isToday ? 'ring-2 ring-primary-500 shadow-lg shadow-primary-500/10' : ''
                  }`}
              >
                {isToday && (
                  <span className="absolute -top-2.5 left-1/2 transform -translate-x-1/2 bg-primary-600 text-white text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-full shadow">
                    Today
                  </span>
                )}

                <div>
                  <p className="text-xs font-black uppercase tracking-wider">{day.day}</p>
                  <p className="text-[10px] font-medium opacity-70 mt-0.5">
                    {new Date(day.date).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                  </p>
                </div>

                <div className="my-2.5 space-y-1 bg-white/40 dark:bg-black/20 rounded-xl p-2 text-[10px]">
                  <div className="flex justify-between items-center text-slate-700 dark:text-slate-300">
                    <span className="opacity-60 text-[9px]">In:</span>
                    <strong className="font-mono">{formatTime(day.checkIn)}</strong>
                  </div>
                  <div className="flex justify-between items-center text-slate-700 dark:text-slate-300">
                    <span className="opacity-60 text-[9px]">Out:</span>
                    <strong className="font-mono">{formatTime(day.checkOut)}</strong>
                  </div>
                  {day.workHours > 0 && (
                    <div className="text-[9px] font-bold text-emerald-600 dark:text-emerald-400 pt-0.5 border-t border-black/5 dark:border-white/5">
                      {day.workHours} hrs
                    </div>
                  )}
                </div>

                <div>
                  <span className="inline-block px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase border border-current">
                    {day.status}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Monthly Attendance Calendar View */}
      <div className="bg-white dark:bg-slate-900 p-6 md:p-8 rounded-3xl border border-slate-200/60 dark:border-slate-800 shadow-sm space-y-6">

        {/* Month Selector & Summary Stats Bar */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-6">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-2xl border border-slate-200 dark:border-slate-700">
              <button
                onClick={handlePrevMonth}
                className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-700 shadow-sm transition-all"
                title="Previous Month"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              <span className="px-4 text-sm font-extrabold text-slate-800 dark:text-slate-100 min-w-[140px] text-center">
                {monthNames[calendarMonth - 1]} {calendarYear}
              </span>

              <button
                onClick={handleNextMonth}
                className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-700 shadow-sm transition-all"
                title="Next Month"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            <button
              onClick={handleCurrentMonth}
              className="px-3 py-2 text-xs font-bold text-primary-600 dark:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-950/40 rounded-xl transition-colors border border-primary-200 dark:border-primary-900/40"
            >
              Today
            </button>
          </div>

          {/* Monthly KPI Chips */}
          {calendarData?.summary && (
            <div className="flex flex-wrap items-center gap-2 text-xs font-semibold">
              <span className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200/60 dark:border-slate-700">
                Working Days: <strong>{calendarData.summary.workingDays}d</strong>
              </span>
              <span className="px-3 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-900/40">
                Present: <strong>{calendarData.summary.presentDays}d</strong>
              </span>
              <span className="px-3 py-1.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-900/40">
                Late: <strong>{calendarData.summary.lateDays}</strong>
              </span>
              <span className="px-3 py-1.5 rounded-xl bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-900/40">
                Leaves: <strong>{calendarData.summary.leaveDays}d</strong>
              </span>
              <span className="px-3 py-1.5 rounded-xl bg-indigo-600 text-white shadow-md">
                Attendance: <strong>{calendarData.summary.attendancePercentage}%</strong>
              </span>
            </div>
          )}
        </div>

        {/* Calendar Grid Container */}
        {calendarLoading ? (
          <div className="py-16 text-center text-slate-400 flex flex-col items-center justify-center">
            <Loader2 className="w-8 h-8 animate-spin text-primary-500 mb-2" />
            <p className="text-xs font-medium">Rendering attendance calendar...</p>
          </div>
        ) : (
          <div className="space-y-2">

            {/* Day Headers (Mon - Sun) */}
            <div className="grid grid-cols-7 gap-2 text-center text-[11px] font-bold text-slate-400 uppercase tracking-wider py-2">
              <div>Mon</div>
              <div>Tue</div>
              <div>Wed</div>
              <div>Thu</div>
              <div>Fri</div>
              <div className="text-indigo-600 dark:text-indigo-400">Sat (Work)</div>
              <div className="text-rose-500">Sun (Off)</div>
            </div>

            {/* Day Cells Grid */}
            <div className="grid grid-cols-7 gap-2">
              {Array.from({ length: blankDays }).map((_, idx) => (
                <div key={`blank-${idx}`} className="min-h-[85px] rounded-2xl bg-slate-50/50 dark:bg-slate-950/20 border border-transparent" />
              ))}

              {calendarData?.calendar?.map((day) => {
                return (
                  <div
                    key={day.date}
                    onClick={() => setSelectedDayDetails(day)}
                    className={`group relative p-2.5 rounded-2xl border min-h-[90px] flex flex-col justify-between cursor-pointer transition-all duration-200 hover:scale-[1.03] hover:shadow-md ${getStatusClass(
                      day.status
                    )} ${day.isToday ? 'ring-2 ring-primary-500 shadow-md' : ''}`}
                  >
                    {/* Cell Header: Day number & Badge */}
                    <div className="flex items-center justify-between">
                      <span className={`text-xs font-bold ${day.isToday ? 'bg-primary-600 text-white px-1.5 py-0.5 rounded-md' : ''}`}>
                        {day.dayNumber}
                      </span>
                      <span className="text-[9px] font-extrabold uppercase px-1.5 py-0.2 rounded border border-current">
                        {day.status === 'Weekend' ? 'Sun' : day.status}
                      </span>
                    </div>

                    {/* Cell Center Content (Times / Holiday name / Leave) */}
                    <div className="my-1 text-[10px] space-y-0.5 leading-tight">
                      {day.log?.checkIn && (
                        <div className="truncate text-slate-700 dark:text-slate-300 font-mono text-[9px]">
                          In: {formatTime(day.log.checkIn)}
                        </div>
                      )}
                      {day.log?.workHours > 0 && (
                        <div className="text-emerald-600 dark:text-emerald-400 font-bold text-[9px]">
                          {day.log.workHours} hrs
                        </div>
                      )}
                      {day.holiday && (
                        <div className="text-sky-600 dark:text-sky-400 font-semibold truncate text-[9px]" title={day.holiday.name}>
                          🎉 {day.holiday.name}
                        </div>
                      )}
                      {day.leave && (
                        <div className="text-purple-600 dark:text-purple-400 font-semibold truncate text-[9px]" title={day.leave.reason}>
                          📝 {day.leave.type}
                        </div>
                      )}
                    </div>

                    {/* Cell Footer icon info */}
                    <div className="flex items-center justify-end text-[9px] opacity-40 group-hover:opacity-100 transition-opacity">
                      <Info className="w-3 h-3" />
                    </div>
                  </div>
                );
              })}
            </div>

          </div>
        )}

        {/* Calendar Status Legend */}
        <div className="flex flex-wrap items-center justify-center gap-4 text-xs font-medium text-slate-500 dark:text-slate-400 pt-4 border-t border-slate-100 dark:border-slate-800">
          <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> Present (On Time)</span>
          <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-amber-500" /> Late (After 10:00 AM)</span>
          <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-orange-500" /> Half Day</span>
          <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-rose-500" /> Absent</span>
          <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-purple-500" /> Leave</span>
          <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-sky-500" /> Public Holiday</span>
          <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-slate-400" /> Sunday (Off)</span>
        </div>

      </div>

      {/* Detailed Attendance Logs History Table */}
      <div className="bg-white dark:bg-slate-900 p-6 md:p-8 rounded-3xl border border-slate-200/60 dark:border-slate-800 shadow-sm space-y-6">

        {/* Filter Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-base font-bold text-slate-800 dark:text-slate-100">
              Attendance Activity Logs History
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Complete punch logs, facial descriptor matches, timestamps, and locations.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Search Bar */}
            <div className="relative min-w-[200px]">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                placeholder="Search date, device, IP..."
                value={logsSearch}
                onChange={(e) => setLogsSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800 focus:outline-none focus:border-primary-500 text-slate-800 dark:text-slate-200"
              />
            </div>

            {/* Status Filter */}
            <select
              value={logsStatusFilter}
              onChange={(e) => setLogsStatusFilter(e.target.value)}
              className="px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 font-semibold focus:outline-none"
            >
              <option value="All">All Statuses</option>
              <option value="Present">Present</option>
              <option value="Late">Late (After 10 AM)</option>
              <option value="Half Day">Half Day</option>
              <option value="Absent">Absent</option>
            </select>
          </div>
        </div>

        {/* Logs Table */}
        {historyLoading ? (
          <div className="py-16 text-center text-slate-400 flex flex-col items-center justify-center">
            <Loader2 className="w-8 h-8 animate-spin text-primary-500 mb-2" />
            <p className="text-xs font-medium">Loading attendance history logs...</p>
          </div>
        ) : filteredLogs.length === 0 ? (
          <div className="text-center py-16 text-slate-400 space-y-2">
            <CalendarCheck2 className="w-10 h-10 mx-auto opacity-30" />
            <p className="text-sm font-semibold">No attendance log records found.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-800 text-slate-400 uppercase tracking-wider text-[10px]">
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Check-In</th>
                  <th className="py-3 px-4">Check-Out</th>
                  <th className="py-3 px-4">Work Hours</th>
                  <th className="py-3 px-4">Verification</th>
                  <th className="py-3 px-4 text-right">Location</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                {filteredLogs.map((log) => (
                  <tr key={log._id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="py-3 px-4 font-bold text-slate-800 dark:text-slate-200">
                      {log.date}
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase border ${getStatusClass(log.status)}`}>
                        {log.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-mono">
                      {formatTime(log.checkIn?.time)}
                      {log.checkIn?.time && new Date(log.checkIn.time).getHours() > 10 && (
                        <span className="text-[9px] text-amber-500 ml-1 font-sans font-bold">(Late)</span>
                      )}
                    </td>
                    <td className="py-3 px-4 font-mono">
                      {formatTime(log.checkOut?.time)}
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-bold text-slate-800 dark:text-slate-200">
                        {log.workHours ? `${log.workHours} hrs` : '--'}
                      </span>
                      {log.overtime > 0 && (
                        <span className="text-[10px] text-emerald-500 ml-1">(+{log.overtime} OT)</span>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400">
                        <ShieldCheck className="w-3.5 h-3.5" />
                        <span className="text-[11px] font-semibold">Face & GPS Verified</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-right text-slate-500 dark:text-slate-400 text-[11px] truncate max-w-[200px]" title={log.checkIn?.gps?.address}>
                      {log.checkIn?.gps?.address || 'Office Geofenced Zone'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

      </div>

      {/* Announcements Bulletin */}
      <div className="bg-white dark:bg-slate-900 p-6 md:p-7 rounded-3xl border border-slate-200/60 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
              <Megaphone className="w-4 h-4" />
            </div>
            <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">
              Notice Board & Announcements
            </h3>
          </div>
          <Link
            to="/employee/announcements"
            className="text-xs font-bold text-primary-600 dark:text-primary-400 hover:underline flex items-center gap-1"
          >
            View All Broadcasts <ArrowRight className="w-3 h-3" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {announcements.length === 0 ? (
            <div className="col-span-3 text-center py-8 text-slate-400">
              <p className="text-xs font-medium">No active broadcasts today.</p>
            </div>
          ) : (
            announcements.map((ann) => (
              <div key={ann._id} className="p-4 bg-slate-50 dark:bg-slate-950/40 rounded-2xl border border-slate-100 dark:border-slate-800/80 space-y-2">
                <div className="flex justify-between items-center text-[10px]">
                  <span className={`px-2 py-0.5 rounded font-bold uppercase ${ann.priority === 'High'
                    ? 'bg-rose-50 text-rose-600 dark:bg-rose-950/20'
                    : 'bg-indigo-50 text-indigo-600 dark:bg-indigo-950/20'
                    }`}>
                    {ann.priority} Priority
                  </span>
                  <span className="text-slate-400">
                    {new Date(ann.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                  </span>
                </div>
                <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 leading-snug">{ann.title}</h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">{ann.description}</p>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Dedicated Employee Profile Section (Below Announcements) */}
      {(() => {
        const currentProfile = profileData || user;
        return (
          <div className="bg-white dark:bg-slate-900 p-6 md:p-8 rounded-3xl border border-slate-200/60 dark:border-slate-800 shadow-sm space-y-6">

            {/* Profile Section Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shadow-sm">
                  <User className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-800 dark:text-slate-100">
                    My Employee Profile & Credentials
                  </h3>
                  <p className="text-xs text-slate-400">
                    Official employee information, contact details, and facial biometric verification status.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-xl">
                  View Only Console
                </span>
                <Link
                  to="/employee/profile"
                  className="flex items-center gap-1.5 px-3.5 py-1.5 bg-primary-50 dark:bg-primary-950/40 text-primary-600 dark:text-primary-400 hover:bg-primary-100 dark:hover:bg-primary-900/50 rounded-xl font-bold text-xs transition-colors"
                >
                  Full Profile <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            {/* Profile Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">

              {/* Card 1: Avatar, Name, Employee ID & Biometrics */}
              <div className="p-5 rounded-2xl bg-slate-50/70 dark:bg-slate-950/50 border border-slate-100 dark:border-slate-800/80 flex flex-col justify-between space-y-4">
                <div className="flex items-center gap-4">
                  <div className="relative shrink-0">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-primary-500 to-indigo-600 p-0.5 shadow-md">
                      <div className="w-full h-full rounded-[14px] bg-slate-900 overflow-hidden flex items-center justify-center font-bold text-lg text-white">
                        {currentProfile?.profilePhoto ? (
                          <img src={currentProfile.profilePhoto} alt={currentProfile.fullName} className="w-full h-full object-cover" />
                        ) : (
                          currentProfile?.fullName?.charAt(0).toUpperCase() || 'E'
                        )}
                      </div>
                    </div>
                    {currentProfile?.hasBiometrics && (
                      <span className="absolute -bottom-1 -right-1 bg-emerald-500 text-white p-1 rounded-full shadow border-2 border-white dark:border-slate-900">
                        <ShieldCheck className="w-3 h-3" />
                      </span>
                    )}
                  </div>

                  <div className="min-w-0">
                    <h4 className="text-sm font-bold text-slate-800 dark:text-slate-100 truncate">{currentProfile?.fullName || 'Staff Member'}</h4>
                    <p className="text-xs text-indigo-600 dark:text-indigo-400 font-semibold">{currentProfile?.designation || 'Staff'}</p>
                    <div className="flex items-center gap-1.5 mt-1">
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                        {currentProfile?.status || 'Active'}
                      </span>
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-indigo-500/15 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20 capitalize">
                        {currentProfile?.role || 'Employee'}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="space-y-2 pt-2 border-t border-slate-200/50 dark:border-slate-800 text-xs">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400 font-medium">Employee ID:</span>
                    <div className="flex items-center gap-1.5 font-mono font-bold text-slate-800 dark:text-slate-200">
                      <span>{currentProfile?.employeeId || 'ID'}</span>
                      <button
                        onClick={() => handleCopy(currentProfile?.employeeId, 'empId')}
                        className="text-slate-400 hover:text-primary-500 transition-colors"
                        title="Copy ID"
                      >
                        {copiedField === 'empId' ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-slate-400 font-medium">Biometric Face ID:</span>
                    <span className={`font-bold flex items-center gap-1 ${currentProfile?.hasBiometrics ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-500'
                      }`}>
                      <Fingerprint className="w-3.5 h-3.5" />
                      {currentProfile?.hasBiometrics ? 'Registered & Active' : 'Pending'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Card 2: Department, Shift & Joining Info */}
              <div className="p-5 rounded-2xl bg-slate-50/70 dark:bg-slate-950/50 border border-slate-100 dark:border-slate-800/80 flex flex-col justify-between space-y-3">
                <div className="space-y-2">
                  <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">
                    Organizational Details
                  </span>

                  <div className="flex items-center gap-2 text-xs">
                    <Building2 className="w-4 h-4 text-slate-400 shrink-0" />
                    <div>
                      <span className="text-slate-400 text-[10px] block">Department:</span>
                      <strong className="text-slate-800 dark:text-slate-200">{currentProfile?.department?.name || 'General Operations'}</strong>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-xs">
                    <Clock className="w-4 h-4 text-indigo-500 shrink-0" />
                    <div>
                      <span className="text-slate-400 text-[10px] block">Shift Timings:</span>
                      <strong className="text-indigo-600 dark:text-indigo-400">10:00 AM – 06:00 PM (Mon–Sat)</strong>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-200/50 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400 space-y-1">
                  <div className="flex justify-between items-center">
                    <span>Date of Joining:</span>
                    <strong className="text-slate-800 dark:text-slate-200">
                      {currentProfile?.joiningDate ? new Date(currentProfile.joiningDate).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' }) : 'On Record'}
                    </strong>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Company Tenure:</span>
                    <span className="font-semibold text-slate-700 dark:text-slate-300">{calculateTenure(currentProfile?.joiningDate)}</span>
                  </div>
                </div>
              </div>

              {/* Card 3: Contact & Residential Info */}
              <div className="p-5 rounded-2xl bg-slate-50/70 dark:bg-slate-950/50 border border-slate-100 dark:border-slate-800/80 flex flex-col justify-between space-y-3">
                <div className="space-y-2.5">
                  <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">
                    Contact & Communication
                  </span>

                  <div className="space-y-1 text-xs">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5 text-slate-400 text-[11px]">
                        <Mail className="w-3.5 h-3.5" />
                        <span>Email Address:</span>
                      </div>
                      <button
                        onClick={() => handleCopy(currentProfile?.email, 'email')}
                        className="text-slate-400 hover:text-primary-500 transition-colors"
                        title="Copy Email"
                      >
                        {copiedField === 'email' ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                      </button>
                    </div>
                    <p className="font-bold text-slate-800 dark:text-slate-200 truncate">{currentProfile?.email || 'Not provided'}</p>
                  </div>

                  <div className="space-y-1 text-xs">
                    <div className="flex items-center gap-1.5 text-slate-400 text-[11px]">
                      <Phone className="w-3.5 h-3.5" />
                      <span>Phone:</span>
                    </div>
                    <p className="font-bold text-slate-800 dark:text-slate-200">{currentProfile?.phone || 'Not provided'}</p>
                  </div>
                </div>

                <div className="pt-2.5 border-t border-slate-200/50 dark:border-slate-800 text-xs">
                  <div className="flex items-start gap-1.5 text-slate-400 text-[11px]">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                    <p className="text-slate-700 dark:text-slate-300 line-clamp-2 text-[11px]">
                      {currentProfile?.address || 'Official Office Address / On Record'}
                    </p>
                  </div>
                </div>
              </div>

            </div>

          </div>
        );
      })()}

      {/* Selected Day Details Modal */}
      {selectedDayDetails && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 max-w-md w-full shadow-2xl space-y-5 animate-scaleUp">

            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div>
                <h4 className="text-base font-bold text-slate-800 dark:text-slate-200">
                  {new Date(selectedDayDetails.date).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
                </h4>
                <p className="text-xs text-slate-400">Attendance & Shift Information</p>
              </div>
              <button
                onClick={() => setSelectedDayDetails(null)}
                className="p-1.5 rounded-xl text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 dark:bg-slate-950/50 border border-slate-100 dark:border-slate-800">
                <span className="text-slate-500 font-medium">Day Status:</span>
                <span className={`px-2.5 py-0.5 rounded-full font-extrabold uppercase border ${getStatusClass(selectedDayDetails.status)}`}>
                  {selectedDayDetails.status}
                </span>
              </div>

              {selectedDayDetails.log ? (
                <>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-950/50 border border-slate-100 dark:border-slate-800">
                      <span className="text-[10px] text-slate-400 uppercase font-semibold block">Check In Time</span>
                      <strong className="text-sm text-slate-800 dark:text-slate-200 mt-1 block font-mono">
                        {formatTime(selectedDayDetails.log.checkIn)}
                      </strong>
                    </div>
                    <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-950/50 border border-slate-100 dark:border-slate-800">
                      <span className="text-[10px] text-slate-400 uppercase font-semibold block">Check Out Time</span>
                      <strong className="text-sm text-slate-800 dark:text-slate-200 mt-1 block font-mono">
                        {formatTime(selectedDayDetails.log.checkOut)}
                      </strong>
                    </div>
                  </div>

                  <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-950/50 border border-slate-100 dark:border-slate-800 space-y-1.5">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Total Work Hours:</span>
                      <strong className="text-emerald-600 dark:text-emerald-400">{selectedDayDetails.log.workHours || 0} Hours</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Overtime Recorded:</span>
                      <strong className="text-slate-800 dark:text-slate-200">{selectedDayDetails.log.overtime || 0} Hours</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Biometric Verification:</span>
                      <strong className="text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                        <ShieldCheck className="w-3.5 h-3.5" /> Face Match Verified
                      </strong>
                    </div>
                  </div>

                  {selectedDayDetails.log.address && (
                    <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-950/50 border border-slate-100 dark:border-slate-800">
                      <span className="text-[10px] text-slate-400 uppercase font-semibold block">Geofence GPS Location</span>
                      <p className="text-slate-700 dark:text-slate-300 text-[11px] mt-1">
                        {selectedDayDetails.log.address}
                      </p>
                    </div>
                  )}
                </>
              ) : selectedDayDetails.holiday ? (
                <div className="p-4 rounded-2xl bg-sky-50 dark:bg-sky-950/20 border border-sky-200 dark:border-sky-900/30 text-sky-800 dark:text-sky-300">
                  <p className="font-bold">🎉 Official Public Holiday</p>
                  <p className="text-[11px] mt-1">{selectedDayDetails.holiday.name}</p>
                </div>
              ) : selectedDayDetails.leave ? (
                <div className="p-4 rounded-2xl bg-purple-50 dark:bg-purple-950/20 border border-purple-200 dark:border-purple-900/30 text-purple-800 dark:text-purple-300">
                  <p className="font-bold">📝 Approved Leave</p>
                  <p className="text-[11px] mt-1">{selectedDayDetails.leave.type} - {selectedDayDetails.leave.reason}</p>
                </div>
              ) : selectedDayDetails.isSunday ? (
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/50 border border-slate-100 dark:border-slate-800 text-slate-600 dark:text-slate-400">
                  <p className="font-bold">☕ Weekend (Sunday)</p>
                  <p className="text-[11px] mt-1">Official non-working weekly rest day.</p>
                </div>
              ) : (
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/50 border border-slate-100 dark:border-slate-800 text-slate-600 dark:text-slate-400">
                  <p className="font-bold">No Attendance Recorded</p>
                  <p className="text-[11px] mt-1">Standard shift begins at 10:00 AM.</p>
                </div>
              )}
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setSelectedDayDetails(null)}
                className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs transition-colors"
              >
                Close
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};

export default EmployeeDashboard;
