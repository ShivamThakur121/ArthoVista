import React, { useState, useEffect } from 'react';
import { useAuth, api } from '../../context/AuthContext';
import { Link } from 'react-router-dom';
import { 
  User, 
  Building2, 
  Calendar, 
  ShieldCheck, 
  CheckCircle2, 
  Clock, 
  CalendarCheck2, 
  Copy, 
  Check, 
  ArrowRight,
  AlertCircle,
  Fingerprint
} from 'lucide-react';

const Profile = () => {
  const { user } = useAuth();
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [copiedField, setCopiedField] = useState('');
  const [stats, setStats] = useState(null);

  useEffect(() => {
    const loadProfileAndStats = async () => {
      try {
        const [meRes, dashRes] = await Promise.allSettled([
          api.get('/auth/me'),
          api.get('/dashboard/employee')
        ]);

        if (meRes.status === 'fulfilled' && meRes.value.data.success) {
          setProfileData(meRes.value.data.user);
        } else if (user) {
          setProfileData(user);
        }

        if (dashRes.status === 'fulfilled' && dashRes.value.data.success) {
          setStats(dashRes.value.data.data);
        }
      } catch (err) {
        console.error('Failed to load profile data:', err);
      } finally {
        setLoading(false);
      }
    };

    loadProfileAndStats();
  }, [user]);

  const handleCopy = (text, fieldName) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    setTimeout(() => setCopiedField(''), 2000);
  };

  const currentUser = profileData || user;

  const formatDate = (dateStr) => {
    if (!dateStr) return 'Not Specified';
    try {
      return new Date(dateStr).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch {
      return dateStr;
    }
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

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] text-slate-400">
        <div className="w-10 h-10 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin mb-3"></div>
        <p className="text-sm font-medium">Loading your profile console...</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-fadeIn">
      
      {/* Header Banner Card */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border border-slate-800 shadow-2xl p-6 md:p-8 text-white">
        {/* Decorative ambient gradients */}
        <div className="absolute top-0 right-0 -mt-12 -mr-12 w-80 h-80 bg-indigo-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 -mb-12 w-64 h-64 bg-primary-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row items-center md:items-start gap-6 text-center md:text-left">
          {/* Avatar / Profile Photo */}
          <div className="relative group shrink-0">
            <div className="w-24 h-24 md:w-28 md:h-28 rounded-2xl bg-gradient-to-tr from-indigo-500 to-primary-500 p-1 shadow-xl">
              <div className="w-full h-full rounded-[14px] bg-slate-900 overflow-hidden flex items-center justify-center font-bold text-3xl text-white">
                {currentUser?.profilePhoto ? (
                  <img 
                    src={currentUser.profilePhoto} 
                    alt={currentUser.fullName} 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  currentUser?.fullName?.charAt(0).toUpperCase() || 'U'
                )}
              </div>
            </div>
            {currentUser?.hasBiometrics && (
              <span 
                title="Face Biometrics Registered & Active"
                className="absolute -bottom-2 -right-2 bg-emerald-500 text-white p-1.5 rounded-full shadow-lg border-2 border-slate-900"
              >
                <ShieldCheck className="w-4 h-4" />
              </span>
            )}
          </div>

          {/* User Titles & Key Tags */}
          <div className="flex-1 space-y-2">
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-2.5">
              <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-white">
                {currentUser?.fullName}
              </h1>
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                {currentUser?.status || 'Active'}
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                {currentUser?.role || 'Employee'}
              </span>
            </div>

            <p className="text-sm text-slate-300 font-medium">
              {currentUser?.designation || 'Staff Member'} • <span className="text-indigo-300">{currentUser?.department?.name || 'Department'}</span>
            </p>

            <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 pt-2 text-xs text-slate-300">
              <div className="flex items-center gap-1.5 bg-white/5 border border-white/10 px-3 py-1.5 rounded-xl">
                <span className="text-slate-400 font-medium">Employee ID:</span>
                <strong className="text-white font-mono">{currentUser?.employeeId}</strong>
                <button
                  onClick={() => handleCopy(currentUser?.employeeId, 'empId')}
                  className="hover:text-primary-300 transition-colors ml-1"
                  title="Copy Employee ID"
                >
                  {copiedField === 'empId' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>

              <div className="flex items-center gap-1.5 bg-white/5 border border-white/10 px-3 py-1.5 rounded-xl">
                <Calendar className="w-3.5 h-3.5 text-indigo-400" />
                <span>Joined {formatDate(currentUser?.joiningDate)}</span>
                <span className="text-slate-400">({calculateTenure(currentUser?.joiningDate)})</span>
              </div>
            </div>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex flex-col gap-2 shrink-0 w-full md:w-auto">
            <Link
              to="/employee/attendance"
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-gradient-to-r from-primary-500 to-indigo-600 hover:from-primary-600 hover:to-indigo-700 text-white font-bold text-xs rounded-xl shadow-lg transition-all active:scale-[0.98]"
            >
              <Clock className="w-4 h-4" />
              Mark Attendance
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
            <Link
              to="/employee/leaves"
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-white/10 hover:bg-white/15 text-white font-semibold text-xs rounded-xl border border-white/10 transition-colors"
            >
              <CalendarCheck2 className="w-4 h-4 text-purple-300" />
              Request Leave
            </Link>
          </div>
        </div>
      </div>

      {/* Profile Sections Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Columns: Personal & Organizational Details */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Personal Information Card */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/60 dark:border-slate-800 p-6 shadow-sm space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                  <User className="w-4 h-4" />
                </div>
                <h2 className="text-base font-bold text-slate-800 dark:text-slate-200">
                  Personal Information
                </h2>
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-lg">
                View Only
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              
              {/* Full Name */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/50 border border-slate-100 dark:border-slate-800/80">
                <span className="text-[11px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wide block">
                  Full Legal Name
                </span>
                <p className="font-bold text-slate-800 dark:text-slate-200 mt-1">
                  {currentUser?.fullName || 'Not provided'}
                </p>
              </div>

              {/* Email Address */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/50 border border-slate-100 dark:border-slate-800/80">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wide">
                    Official Email
                  </span>
                  <button
                    onClick={() => handleCopy(currentUser?.email, 'email')}
                    className="text-slate-400 hover:text-primary-500 transition-colors text-xs flex items-center gap-1"
                    title="Copy Email"
                  >
                    {copiedField === 'email' ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                  </button>
                </div>
                <p className="font-bold text-slate-800 dark:text-slate-200 mt-1 truncate">
                  {currentUser?.email || 'Not provided'}
                </p>
              </div>

              {/* Phone Number */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/50 border border-slate-100 dark:border-slate-800/80">
                <span className="text-[11px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wide block">
                  Contact Phone
                </span>
                <p className="font-bold text-slate-800 dark:text-slate-200 mt-1">
                  {currentUser?.phone || 'Not provided'}
                </p>
              </div>

              {/* Residential Address */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/50 border border-slate-100 dark:border-slate-800/80">
                <span className="text-[11px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wide block">
                  Residential Address
                </span>
                <p className="font-bold text-slate-800 dark:text-slate-200 mt-1">
                  {currentUser?.address || 'Office Standard Address / On Record'}
                </p>
              </div>

            </div>
          </div>

          {/* Organizational & Employment Details */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/60 dark:border-slate-800 p-6 shadow-sm space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400 flex items-center justify-center">
                  <Building2 className="w-4 h-4" />
                </div>
                <h2 className="text-base font-bold text-slate-800 dark:text-slate-200">
                  Employment & Department
                </h2>
              </div>
              <span className="text-xs text-slate-400 font-mono">
                {currentUser?.employeeId}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/50 border border-slate-100 dark:border-slate-800/80">
                <span className="text-[11px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wide block">
                  Department
                </span>
                <p className="font-bold text-slate-800 dark:text-slate-200 mt-1">
                  {currentUser?.department?.name || 'General Administration'}
                </p>
                <span className="text-[10px] text-slate-400 font-mono">
                  Code: {currentUser?.department?.code || 'DEPT'}
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/50 border border-slate-100 dark:border-slate-800/80">
                <span className="text-[11px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wide block">
                  Designation
                </span>
                <p className="font-bold text-slate-800 dark:text-slate-200 mt-1">
                  {currentUser?.designation || 'Staff'}
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/50 border border-slate-100 dark:border-slate-800/80">
                <span className="text-[11px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wide block">
                  Office Shift Timing
                </span>
                <p className="font-bold text-indigo-600 dark:text-indigo-400 mt-1">
                  10:00 AM – 6:00 PM
                </p>
                <span className="text-[10px] text-slate-400">
                  Mon – Sat (6 Working Days)
                </span>
              </div>

            </div>
          </div>

        </div>

        {/* Right 1 Column: Biometrics & Security, Attendance Overview */}
        <div className="space-y-6">
          
          {/* Biometrics & Facial Security */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/60 dark:border-slate-800 p-6 shadow-sm space-y-4">
            <div className="flex items-center gap-2.5 border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="w-8 h-8 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                <Fingerprint className="w-4 h-4" />
              </div>
              <h2 className="text-base font-bold text-slate-800 dark:text-slate-200">
                Biometrics & Security
              </h2>
            </div>

            <div className={`p-4 rounded-2xl border ${
              currentUser?.hasBiometrics 
                ? 'bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-200/60 dark:border-emerald-900/30' 
                : 'bg-amber-50/50 dark:bg-amber-950/20 border-amber-200/60 dark:border-amber-900/30'
            }`}>
              <div className="flex items-start gap-3">
                {currentUser?.hasBiometrics ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                ) : (
                  <AlertCircle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                )}
                <div className="space-y-1">
                  <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
                    {currentUser?.hasBiometrics 
                      ? 'Face Biometrics Enrolled' 
                      : 'Biometrics Pending Enrollment'}
                  </p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                    {currentUser?.hasBiometrics 
                      ? 'Your facial recognition embeddings are verified and active for geofenced check-ins.' 
                      : 'Please contact the administrator or HR to complete your facial enrollment.'}
                  </p>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/50 border border-slate-100 dark:border-slate-800/80 space-y-2 text-xs">
              <div className="flex justify-between items-center text-slate-500 dark:text-slate-400">
                <span>Geofenced Check-in:</span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400">Enabled (200m Radius)</span>
              </div>
              <div className="flex justify-between items-center text-slate-500 dark:text-slate-400">
                <span>Shift Start Baseline:</span>
                <strong className="text-slate-800 dark:text-slate-200">10:00 AM IST</strong>
              </div>
              <div className="flex justify-between items-center text-slate-500 dark:text-slate-400">
                <span>Working Days:</span>
                <strong className="text-slate-800 dark:text-slate-200">Monday – Saturday</strong>
              </div>
            </div>
          </div>

          {/* Quick Month Attendance Snapshot */}
          {stats && (
            <div className="bg-gradient-to-tr from-primary-600 to-indigo-700 rounded-3xl p-6 text-white shadow-lg space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider bg-white/20 px-2.5 py-1 rounded-full">
                  Monthly Performance
                </span>
                <span className="text-2xl font-black">
                  {stats.attendancePercentage}%
                </span>
              </div>

              <p className="text-xs text-primary-100">
                Overall monthly attendance rate calculated across official working days.
              </p>

              <div className="grid grid-cols-3 gap-2 pt-2 border-t border-white/10 text-center">
                <div className="p-2 rounded-xl bg-white/10">
                  <p className="text-[9px] uppercase tracking-wider text-primary-200 font-bold">Present</p>
                  <p className="text-sm font-bold mt-0.5">{stats.stats?.presentDays || 0}d</p>
                </div>
                <div className="p-2 rounded-xl bg-white/10">
                  <p className="text-[9px] uppercase tracking-wider text-primary-200 font-bold">Late</p>
                  <p className="text-sm font-bold mt-0.5">{stats.stats?.lateDays || 0}</p>
                </div>
                <div className="p-2 rounded-xl bg-white/10">
                  <p className="text-[9px] uppercase tracking-wider text-primary-200 font-bold">Leaves</p>
                  <p className="text-sm font-bold mt-0.5">{stats.stats?.leaveDays || 0}d</p>
                </div>
              </div>
            </div>
          )}

        </div>

      </div>

    </div>
  );
};

export default Profile;
