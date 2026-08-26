import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api, useAuth } from '../../context/AuthContext';
import { 
  AreaChart, 
  Area, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Legend
} from 'recharts';
import { 
  Users, 
  Building, 
  UserCheck, 
  Clock, 
  Calendar as CalendarIcon, 
  UserMinus, 
  Loader2, 
  ShieldCheck,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  Search,
  Sparkles,
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

const AdminDashboard = () => {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [sendingEmailId, setSendingEmailId] = useState(null);

  // Calendar view state
  const [employeesList, setEmployeesList] = useState([]);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState('');
  const [calendarYear, setCalendarYear] = useState(new Date().getFullYear());
  const [calendarMonth, setCalendarMonth] = useState(new Date().getMonth() + 1);
  const [calendarData, setCalendarData] = useState(null);
  const [calendarLoading, setCalendarLoading] = useState(false);
  const [selectedDayDetails, setSelectedDayDetails] = useState(null);

  // Activity logs state
  const [logsSearch, setLogsSearch] = useState('');
  const [logsStatusFilter, setLogsStatusFilter] = useState('All');
  const [allLogs, setAllLogs] = useState([]);
  const [logsLoading, setLogsLoading] = useState(false);

  // Profile state
  const [profileData, setProfileData] = useState(null);
  const [copiedField, setCopiedField] = useState('');

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const fetchStats = async () => {
    try {
      const res = await api.get('/dashboard/admin');
      if (res.data.success) {
        setData(res.data.data);
      }
    } catch (err) {
      console.error(err);
      setError('Failed to fetch dashboard statistics.');
    } finally {
      setLoading(false);
    }
  };

  const fetchEmployeesList = async () => {
    try {
      const res = await api.get('/employees');
      if (res.data.success) {
        setEmployeesList(res.data.data);
      }
    } catch (err) {
      console.error('Failed to load employee list:', err);
    }
  };

  const fetchCalendar = async (year, month, empId) => {
    setCalendarLoading(true);
    try {
      const url = empId 
        ? `/attendance/calendar?year=${year}&month=${month}&employeeId=${empId}`
        : `/attendance/calendar?year=${year}&month=${month}`;
      const res = await api.get(url);
      if (res.data.success) {
        setCalendarData(res.data.data);
      }
    } catch (err) {
      console.error('Failed to fetch calendar:', err);
    } finally {
      setCalendarLoading(false);
    }
  };

  const fetchLogs = async () => {
    setLogsLoading(true);
    try {
      const res = await api.get('/attendance/history');
      if (res.data.success) {
        setAllLogs(res.data.data);
      }
    } catch (err) {
      console.error('Failed to fetch all logs:', err);
    } finally {
      setLogsLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
    fetchEmployeesList();
    fetchCalendar(calendarYear, calendarMonth, selectedEmployeeId);
    fetchLogs();

    const fetchProfile = async () => {
      try {
        const res = await api.get('/auth/me');
        if (res.data.success) {
          setProfileData(res.data.user);
        }
      } catch (err) {
        console.error('Failed to load profile for admin dashboard:', err);
      }
    };
    fetchProfile();
  }, []);

  const handleCopy = (text, fieldName) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    setTimeout(() => setCopiedField(''), 2000);
  };

  const calculateTenure = (dateStr) => {
    if (!dateStr) return 'Active Administrator';
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
    fetchCalendar(newY, newM, selectedEmployeeId);
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
    fetchCalendar(newY, newM, selectedEmployeeId);
  };

  const handleCurrentMonth = () => {
    const now = new Date();
    const curY = now.getFullYear();
    const curM = now.getMonth() + 1;
    setCalendarYear(curY);
    setCalendarMonth(curM);
    fetchCalendar(curY, curM, selectedEmployeeId);
  };

  const handleEmployeeChange = (e) => {
    const newId = e.target.value;
    setSelectedEmployeeId(newId);
    fetchCalendar(calendarYear, calendarMonth, newId);
  };

  const handleSendWarningEmail = async (employeeId) => {
    setSendingEmailId(employeeId);
    try {
      const res = await api.post('/dashboard/send-warning-email', { employeeId });
      if (res.data.success) {
        alert(res.data.message || 'Warning email sent successfully.');
      } else {
        alert(res.data.message || 'Failed to send warning email.');
      }
    } catch (err) {
      console.error(err);
      alert('Error sending warning email.');
    } finally {
      setSendingEmailId(null);
    }
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
      <div className="flex flex-col items-center justify-center min-h-[50vh] text-slate-400">
        <Loader2 className="w-9 h-9 animate-spin text-primary-500 mb-2" />
        <p className="text-sm font-medium">Aggregating attendance console metrics...</p>
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

  const { kpis, weeklyTrend, departmentBreakdown } = data;

  const cardStats = [
    { label: 'Total Employees', value: kpis.totalEmployees, icon: Users, color: 'text-blue-500', bg: 'bg-blue-50 dark:bg-blue-950/20' },
    { label: 'Departments', value: kpis.totalDepartments, icon: Building, color: 'text-indigo-500', bg: 'bg-indigo-50 dark:bg-indigo-950/20' },
    { label: 'Present Today', value: kpis.presentToday, icon: UserCheck, color: 'text-emerald-500', bg: 'bg-emerald-50 dark:bg-emerald-950/20' },
    { label: 'Late (After 10 AM)', value: kpis.lateToday, icon: Clock, color: 'text-amber-500', bg: 'bg-amber-50 dark:bg-amber-950/20' },
    { label: 'On Leave Today', value: kpis.leavesToday, icon: CalendarIcon, color: 'text-purple-500', bg: 'bg-purple-50 dark:bg-purple-950/20' },
    { label: 'Absent Today', value: kpis.absentToday, icon: UserMinus, color: 'text-rose-500', bg: 'bg-rose-50 dark:bg-rose-950/20' },
  ];

  // Filter logs
  const filteredLogs = allLogs.filter(log => {
    const empName = log.employee?.fullName || '';
    const empId = log.employee?.employeeId || '';
    const dateStr = log.date || '';
    const searchLow = logsSearch.toLowerCase();

    const matchesSearch = empName.toLowerCase().includes(searchLow) ||
      empId.toLowerCase().includes(searchLow) ||
      dateStr.includes(searchLow) ||
      (log.checkIn?.gps?.address && log.checkIn.gps.address.toLowerCase().includes(searchLow));

    const matchesStatus = logsStatusFilter === 'All' || log.status === logsStatusFilter;
    return matchesSearch && matchesStatus;
  });

  // Calculate calendar blank prefix slots
  let blankDays = 0;
  if (calendarData?.calendar?.length > 0) {
    const firstDayOfWeek = calendarData.calendar[0].dayOfWeek; // 0 = Sunday, 1 = Monday
    blankDays = firstDayOfWeek === 0 ? 6 : firstDayOfWeek - 1;
  }

  return (
    <div className="space-y-8 animate-fadeIn">
      
      {/* Top Banner Card with 10:00 AM Shift & Quick Profile Access */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border border-slate-800 shadow-2xl p-6 md:p-8 text-white">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-72 h-72 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-wider bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 px-3 py-1 rounded-full">
                Management Terminal
              </span>
              <span className="text-[10px] font-bold uppercase tracking-wider bg-amber-400/20 text-amber-200 border border-amber-300/30 px-3 py-1 rounded-full flex items-center gap-1">
                <Clock className="w-3 h-3" /> Shift Start: 10:00 AM IST (Mon – Sat)
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
              Welcome back, {user?.fullName || 'Administrator'}
            </h1>
            <p className="text-xs text-slate-300 max-w-xl leading-relaxed">
              Official company shift starts at <strong>10:00 AM</strong>. Saturdays are active working days. Monitor staff check-ins, monthly calendar rosters, and biometric verification logs below.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <Link
              to="/admin/profile"
              className="flex items-center gap-2 px-5 py-2.5 bg-white text-slate-900 hover:bg-slate-100 font-bold text-xs rounded-xl shadow-lg transition-all active:scale-[0.98]"
            >
              <User className="w-4 h-4 text-primary-600" />
              My Profile
            </Link>
            <Link
              to="/admin/reports"
              className="flex items-center gap-2 px-5 py-2.5 bg-white/10 hover:bg-white/15 text-white font-semibold text-xs rounded-xl border border-white/10 transition-colors"
            >
              Export Reports
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>

      {/* KPIs Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-5">
        {cardStats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div key={idx} className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200/60 dark:border-slate-800 shadow-sm flex flex-col justify-between group hover:border-primary-500/30 transition-all duration-200">
              <div className={`w-10 h-10 rounded-2xl ${stat.bg} ${stat.color} flex items-center justify-center mb-4 transition-transform group-hover:scale-105`}>
                <Icon className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">{stat.label}</p>
                <p className="text-2xl font-black text-slate-800 dark:text-slate-100 mt-1">{stat.value}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Short Attendance Alerts */}
      {data.shortAttendanceEmployees && data.shortAttendanceEmployees.length > 0 && (
        <div className="bg-red-50 dark:bg-red-950/10 border border-red-200 dark:border-red-900/30 rounded-3xl p-5 space-y-3">
          <div className="flex items-center gap-2 text-red-700 dark:text-red-400 font-bold text-sm">
            <AlertCircle className="w-5 h-5" />
            <span>Employees with Short Attendance (Below 75% this month)</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {data.shortAttendanceEmployees.map((emp) => (
              <div key={emp.employee.id} className="bg-white dark:bg-slate-900/50 p-4 rounded-2xl border border-red-100 dark:border-red-950/50 flex items-center justify-between gap-3 text-xs">
                <div>
                  <p className="font-bold text-slate-800 dark:text-slate-200">{emp.employee.fullName}</p>
                  <p className="text-slate-400 text-[10px] mt-0.5">{emp.employee.employeeId} • Attendance: <strong className="text-red-600 dark:text-red-400">{emp.attendancePercentage}%</strong></p>
                </div>
                <button
                  onClick={() => handleSendWarningEmail(emp.employee.id)}
                  disabled={sendingEmailId === emp.employee.id}
                  className="px-3 py-1.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-[10px] transition-colors disabled:opacity-50"
                >
                  {sendingEmailId === emp.employee.id ? 'Sending...' : 'Send Email Alert'}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Attractive Current Week Attendance Overview (6-Day Grid: Mon - Sat) */}
      <div className="bg-white dark:bg-slate-900 p-6 md:p-7 rounded-3xl border border-slate-200/60 dark:border-slate-800 shadow-sm space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-primary-50 dark:bg-primary-950/40 text-primary-600 dark:text-primary-400 flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">
                Weekly Attendance Roster (6-Day Working Week: Monday to Saturday)
              </h3>
              <p className="text-xs text-slate-400">
                Daily staff presence summary with 10:00 AM shift start timing.
              </p>
            </div>
          </div>
          <span className="text-xs font-semibold px-3 py-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-full w-fit">
            6 Working Days (Mon–Sat)
          </span>
        </div>

        {/* 6 Cards Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
          {weeklyTrend.map((day, idx) => {
            const total = (day.Present || 0) + (day.Absent || 0);
            const presentPercent = total > 0 ? Math.round((day.Present / total) * 100) : 0;

            return (
              <div 
                key={idx} 
                className="p-4 rounded-2xl border border-slate-200/60 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/30 text-center flex flex-col justify-between min-h-[160px] hover:border-primary-500/40 hover:shadow-md transition-all"
              >
                <div>
                  <p className="text-xs font-black uppercase tracking-wider text-slate-800 dark:text-slate-200">{day.day}</p>
                  <p className="text-[10px] font-medium text-slate-400 mt-0.5">
                    {new Date(day.date).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                  </p>
                </div>

                <div className="my-2 space-y-1 text-xs">
                  <div className="flex justify-between items-center text-emerald-600 dark:text-emerald-400 font-bold">
                    <span className="text-[10px] opacity-70">Present:</span>
                    <span>{day.Present || 0}</span>
                  </div>
                  <div className="flex justify-between items-center text-amber-500 font-bold">
                    <span className="text-[10px] opacity-70">Late (After 10 AM):</span>
                    <span>{day.Late || 0}</span>
                  </div>
                  <div className="flex justify-between items-center text-rose-500 font-bold">
                    <span className="text-[10px] opacity-70">Absent:</span>
                    <span>{day.Absent || 0}</span>
                  </div>
                </div>

                <div className="w-full bg-slate-200 dark:bg-slate-800 rounded-full h-1.5 overflow-hidden">
                  <div 
                    className="bg-emerald-500 h-full rounded-full transition-all" 
                    style={{ width: `${presentPercent}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Interactive Monthly Attendance Calendar View */}
      <div className="bg-white dark:bg-slate-900 p-6 md:p-8 rounded-3xl border border-slate-200/60 dark:border-slate-800 shadow-sm space-y-6">
        
        {/* Calendar Header & Controls */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-6">
          <div className="flex flex-wrap items-center gap-3">
            {/* Month Switcher */}
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

            {/* Employee Selector Dropdown */}
            <div className="flex items-center gap-2">
              <select
                value={selectedEmployeeId}
                onChange={handleEmployeeChange}
                className="px-3.5 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 font-bold focus:outline-none focus:border-primary-500"
              >
                <option value="">My Admin Calendar</option>
                {employeesList.map((emp) => (
                  <option key={emp._id} value={emp._id}>
                    {emp.fullName} ({emp.employeeId}) • {emp.designation || 'Staff'}
                  </option>
                ))}
              </select>
            </div>
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

        {/* Calendar Grid */}
        {calendarLoading ? (
          <div className="py-16 text-center text-slate-400 flex flex-col items-center justify-center">
            <Loader2 className="w-8 h-8 animate-spin text-primary-500 mb-2" />
            <p className="text-xs font-medium">Loading monthly attendance calendar...</p>
          </div>
        ) : (
          <div className="space-y-2">
            
            {/* Headers */}
            <div className="grid grid-cols-7 gap-2 text-center text-[11px] font-bold text-slate-400 uppercase tracking-wider py-2">
              <div>Mon</div>
              <div>Tue</div>
              <div>Wed</div>
              <div>Thu</div>
              <div>Fri</div>
              <div className="text-indigo-600 dark:text-indigo-400">Sat (Work)</div>
              <div className="text-rose-500">Sun (Off)</div>
            </div>

            {/* Cells */}
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
                    <div className="flex items-center justify-between">
                      <span className={`text-xs font-bold ${day.isToday ? 'bg-primary-600 text-white px-1.5 py-0.5 rounded-md' : ''}`}>
                        {day.dayNumber}
                      </span>
                      <span className="text-[9px] font-extrabold uppercase px-1.5 py-0.2 rounded border border-current">
                        {day.status === 'Weekend' ? 'Sun' : day.status}
                      </span>
                    </div>

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

                    <div className="flex items-center justify-end text-[9px] opacity-40 group-hover:opacity-100 transition-opacity">
                      <Info className="w-3 h-3" />
                    </div>
                  </div>
                );
              })}
            </div>

          </div>
        )}

        {/* Legend */}
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

      {/* Attendance Activity Logs History Table */}
      <div className="bg-white dark:bg-slate-900 p-6 md:p-8 rounded-3xl border border-slate-200/60 dark:border-slate-800 shadow-sm space-y-6">
        
        {/* Filter Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-base font-bold text-slate-800 dark:text-slate-100">
              Live Attendance Activity Logs
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Live biometric logs, timestamps, work hours, and geofence locations for all employees.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Search */}
            <div className="relative min-w-[220px]">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                placeholder="Search employee, ID, date..."
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
        {logsLoading ? (
          <div className="py-16 text-center text-slate-400 flex flex-col items-center justify-center">
            <Loader2 className="w-8 h-8 animate-spin text-primary-500 mb-2" />
            <p className="text-xs font-medium">Loading attendance activity logs...</p>
          </div>
        ) : filteredLogs.length === 0 ? (
          <div className="text-center py-16 text-slate-400 space-y-2">
            <CalendarIcon className="w-10 h-10 mx-auto opacity-30" />
            <p className="text-sm font-semibold">No attendance log records matching criteria.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-800 text-slate-400 uppercase tracking-wider text-[10px]">
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4">Employee</th>
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
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-full bg-primary-100 dark:bg-primary-900/50 flex items-center justify-center text-primary-600 font-bold text-[10px] overflow-hidden shrink-0">
                          {log.employee?.profilePhoto ? (
                            <img src={log.employee.profilePhoto} alt="avatar" className="w-full h-full object-cover" />
                          ) : (
                            log.employee?.fullName?.charAt(0).toUpperCase() || 'E'
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="font-bold text-slate-800 dark:text-slate-200 truncate">{log.employee?.fullName || 'Staff Member'}</p>
                          <p className="text-[10px] text-slate-400 font-mono">{log.employee?.employeeId || 'ID'}</p>
                        </div>
                      </div>
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
                    <td className="py-3 px-4 text-right text-slate-500 dark:text-slate-400 text-[11px] truncate max-w-[180px]" title={log.checkIn?.gps?.address}>
                      {log.checkIn?.gps?.address || 'Office Geofenced Zone'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

      </div>

      {/* Analytics & Department Breakdown Split Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Weekly Trend Chart (7 Columns) */}
        <div className="lg:col-span-7 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200/60 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex justify-between items-center pb-2 border-b border-slate-100 dark:border-slate-800">
            <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wide">
              Weekly Attendance Trend (Mon - Sat)
            </h3>
          </div>
          <div className="h-72 w-full text-xs">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={weeklyTrend} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorPresent" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4f73ff" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#4f73ff" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorLate" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="day" tickLine={false} axisLine={false} tick={{ fill: '#94a3b8' }} />
                <YAxis tickLine={false} axisLine={false} tick={{ fill: '#94a3b8' }} />
                <Tooltip contentStyle={{ borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }} />
                <Legend iconType="circle" wrapperStyle={{ paddingTop: '10px' }} />
                <Area type="monotone" dataKey="Present" stroke="#4f73ff" strokeWidth={2.5} fillOpacity={1} fill="url(#colorPresent)" />
                <Area type="monotone" dataKey="Late" stroke="#f59e0b" strokeWidth={2.5} fillOpacity={1} fill="url(#colorLate)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Department Personnel Breakdown (5 Columns) */}
        <div className="lg:col-span-5 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200/60 dark:border-slate-800 shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wide border-b border-slate-100 dark:border-slate-800 pb-3">
            Department Strength & Active Presence
          </h3>
          <div className="h-72 w-full text-xs">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={departmentBreakdown} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="department" tickLine={false} axisLine={false} tick={{ fill: '#94a3b8' }} />
                <YAxis tickLine={false} axisLine={false} tick={{ fill: '#94a3b8' }} />
                <Tooltip contentStyle={{ borderRadius: '16px', border: '1px solid #e2e8f0' }} />
                <Legend iconType="circle" wrapperStyle={{ paddingTop: '10px' }} />
                <Bar dataKey="Total" fill="#4f73ff" radius={[4, 4, 0, 0]} maxBarSize={35} />
                <Bar dataKey="Present" fill="#10b981" radius={[4, 4, 0, 0]} maxBarSize={35} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* Admin / Employee Profile Console */}
      {(() => {
        const currentProfile = profileData || user;
        return (
          <div className="bg-white dark:bg-slate-900 p-6 md:p-8 rounded-3xl border border-slate-200/60 dark:border-slate-800 shadow-sm space-y-6">
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-2xl bg-primary-50 dark:bg-primary-950/40 text-primary-600 dark:text-primary-400 flex items-center justify-center shadow-sm">
                  <User className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-800 dark:text-slate-100">
                    Administrator Profile & Account Credentials
                  </h3>
                  <p className="text-xs text-slate-400">
                    Official account details, system permissions, and contact records.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-xl">
                  Admin Console
                </span>
                <Link
                  to="/admin/profile"
                  className="flex items-center gap-1.5 px-3.5 py-1.5 bg-primary-50 dark:bg-primary-950/40 text-primary-600 dark:text-primary-400 hover:bg-primary-100 dark:hover:bg-primary-900/50 rounded-xl font-bold text-xs transition-colors"
                >
                  Full Profile <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              
              {/* Card 1: Avatar, Name, Employee ID & Security */}
              <div className="p-5 rounded-2xl bg-slate-50/70 dark:bg-slate-950/50 border border-slate-100 dark:border-slate-800/80 flex flex-col justify-between space-y-4">
                <div className="flex items-center gap-4">
                  <div className="relative shrink-0">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-primary-500 to-indigo-600 p-0.5 shadow-md">
                      <div className="w-full h-full rounded-[14px] bg-slate-900 overflow-hidden flex items-center justify-center font-bold text-lg text-white">
                        {currentProfile?.profilePhoto ? (
                          <img src={currentProfile.profilePhoto} alt={currentProfile.fullName} className="w-full h-full object-cover" />
                        ) : (
                          currentProfile?.fullName?.charAt(0).toUpperCase() || 'A'
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
                    <h4 className="text-sm font-bold text-slate-800 dark:text-slate-100 truncate">{currentProfile?.fullName || 'Administrator'}</h4>
                    <p className="text-xs text-indigo-600 dark:text-indigo-400 font-semibold">{currentProfile?.designation || 'System Admin'}</p>
                    <div className="flex items-center gap-1.5 mt-1">
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                        {currentProfile?.status || 'Active'}
                      </span>
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-indigo-500/15 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20 capitalize">
                        {currentProfile?.role || 'Admin'}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="space-y-2 pt-2 border-t border-slate-200/50 dark:border-slate-800 text-xs">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400 font-medium">Employee ID:</span>
                    <div className="flex items-center gap-1.5 font-mono font-bold text-slate-800 dark:text-slate-200">
                      <span>{currentProfile?.employeeId || 'ADMIN001'}</span>
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
                    <span className="text-slate-400 font-medium">Biometric Descriptor:</span>
                    <span className={`font-bold flex items-center gap-1 ${
                      currentProfile?.hasBiometrics ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400'
                    }`}>
                      <Fingerprint className="w-3.5 h-3.5" />
                      {currentProfile?.hasBiometrics ? 'Enrolled & Verified' : 'Master Account'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Card 2: Department, Shift & Role */}
              <div className="p-5 rounded-2xl bg-slate-50/70 dark:bg-slate-950/50 border border-slate-100 dark:border-slate-800/80 flex flex-col justify-between space-y-3">
                <div className="space-y-2">
                  <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">
                    Role & Operations
                  </span>
                  
                  <div className="flex items-center gap-2 text-xs">
                    <Building2 className="w-4 h-4 text-slate-400 shrink-0" />
                    <div>
                      <span className="text-slate-400 text-[10px] block">Department:</span>
                      <strong className="text-slate-800 dark:text-slate-200">{currentProfile?.department?.name || 'Executive Management'}</strong>
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
                      {currentProfile?.joiningDate ? new Date(currentProfile.joiningDate).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' }) : 'System Inception'}
                    </strong>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Account Standing:</span>
                    <span className="font-semibold text-emerald-600 dark:text-emerald-400">{calculateTenure(currentProfile?.joiningDate)}</span>
                  </div>
                </div>
              </div>

              {/* Card 3: Contact Details */}
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
                    <p className="font-bold text-slate-800 dark:text-slate-200 truncate">{currentProfile?.email || 'shivamthakur12012@gmail.com'}</p>
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
                      {currentProfile?.address || 'Corporate Headquarters'}
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
                      <span className="text-slate-500">Overtime:</span>
                      <strong className="text-slate-800 dark:text-slate-200">{selectedDayDetails.log.overtime || 0} Hours</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Biometric Match:</span>
                      <strong className="text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                        <ShieldCheck className="w-3.5 h-3.5" /> Face Descriptor Verified
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

export default AdminDashboard;
