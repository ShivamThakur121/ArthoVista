import React, { useState, useEffect } from 'react';
import { api } from '../../context/AuthContext';
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
  Calendar, 
  UserMinus, 
  Loader2, 
  ShieldCheck
} from 'lucide-react';

const AdminDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
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

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] text-slate-400">
        <Loader2 className="w-8 h-8 animate-spin text-primary-500 mb-2" />
        <p className="text-sm font-medium">Aggregating attendance metrics...</p>
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

  const { kpis, recentLogs, weeklyTrend, departmentBreakdown } = data;

  const cardStats = [
    { label: 'Total Employees', value: kpis.totalEmployees, icon: Users, color: 'text-blue-500', bg: 'bg-blue-50 dark:bg-blue-950/20' },
    { label: 'Departments', value: kpis.totalDepartments, icon: Building, color: 'text-indigo-500', bg: 'bg-indigo-50 dark:bg-indigo-950/20' },
    { label: 'Present Today', value: kpis.presentToday, icon: UserCheck, color: 'text-emerald-500', bg: 'bg-emerald-50 dark:bg-emerald-950/20' },
    { label: 'Late check-ins', value: kpis.lateToday, icon: Clock, color: 'text-amber-500', bg: 'bg-amber-50 dark:bg-amber-950/20' },
    { label: 'On Approved Leave', value: kpis.leavesToday, icon: Calendar, color: 'text-purple-500', bg: 'bg-purple-50 dark:bg-purple-950/20' },
    { label: 'Absent Today', value: kpis.absentToday, icon: UserMinus, color: 'text-rose-500', bg: 'bg-rose-50 dark:bg-rose-950/20' },
  ];

  return (
    <div className="space-y-8">
      
      {/* KPIs Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-5">
        {cardStats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div key={idx} className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200/60 dark:border-slate-800 shadow-sm flex flex-col justify-between group hover:border-primary-500/30 transition-all duration-200">
              <div className={`w-9 h-9 rounded-xl ${stat.bg} ${stat.color} flex items-center justify-center mb-4 transition-transform group-hover:scale-105`}>
                <Icon className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">{stat.label}</p>
                <p className="text-2xl font-bold text-slate-800 dark:text-slate-100 mt-1">{stat.value}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Analytics and Recent Activity Split Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Weekly Trend Chart (8 Columns) */}
        <div className="lg:col-span-8 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200/60 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex justify-between items-center pb-2 border-b border-slate-100 dark:border-slate-800">
            <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wide">
              Weekly Attendance Trend
            </h3>
          </div>
          <div className="h-80 w-full text-xs">
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

        {/* Recent Activity Logs (4 Columns) */}
        <div className="lg:col-span-4 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200/60 dark:border-slate-800 shadow-sm flex flex-col">
          <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wide border-b border-slate-100 dark:border-slate-800 pb-3 mb-4">
            Recent Operations Log
          </h3>

          <div className="flex-1 overflow-y-auto space-y-4 max-h-[300px] pr-2">
            {recentLogs.length === 0 ? (
              <p className="text-center text-xs text-slate-400 py-10">No recent logs recorded.</p>
            ) : (
              recentLogs.map((log, idx) => (
                <div key={idx} className="flex items-start gap-3 border-b border-slate-50 dark:border-slate-800/50 pb-3 last:border-b-0">
                  <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-primary-500 font-bold shrink-0 overflow-hidden text-xs">
                    {log.employee?.profilePhoto ? (
                      <img src={log.employee.profilePhoto} alt="avatar" className="w-full h-full object-cover" />
                    ) : (
                      log.employee?.fullName.charAt(0).toUpperCase()
                    )}
                  </div>
                  <div className="flex-1 min-w-0 text-xs">
                    <p className="font-semibold text-slate-800 dark:text-slate-200 truncate">{log.employee?.fullName}</p>
                    <p className="text-[10px] text-slate-400 truncate capitalize">
                      {log.status === 'Present' || log.status === 'Late' ? 'Check-in' : 'Operation'} • {log.employee?.department?.code || 'Staff'}
                    </p>
                    <div className="flex items-center gap-1.5 mt-1 text-[9px] text-slate-400">
                      <Clock className="w-3 h-3 text-slate-400" />
                      <span>{log.checkIn?.time ? new Date(log.checkIn.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : log.date}</span>
                      {log.checkIn?.faceVerified && (
                        <span className="flex items-center text-emerald-600 font-bold gap-0.5">
                          <ShieldCheck className="w-3 h-3" />
                          Match
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

      </div>

      {/* Secondary Row: Department Breakdowns */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200/60 dark:border-slate-800 shadow-sm space-y-4">
        <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wide border-b border-slate-100 dark:border-slate-800 pb-3">
          Department Personnel Strength & Active Presence today
        </h3>
        <div className="h-64 w-full text-xs">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={departmentBreakdown} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="department" tickLine={false} axisLine={false} tick={{ fill: '#94a3b8' }} />
              <YAxis tickLine={false} axisLine={false} tick={{ fill: '#94a3b8' }} />
              <Tooltip contentStyle={{ borderRadius: '16px', border: '1px solid #e2e8f0' }} />
              <Legend iconType="circle" wrapperStyle={{ paddingTop: '10px' }} />
              <Bar dataKey="Total" fill="#4f73ff" radius={[4, 4, 0, 0]} maxBarSize={45} />
              <Bar dataKey="Present" fill="#10b981" radius={[4, 4, 0, 0]} maxBarSize={45} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

    </div>
  );
};

export default AdminDashboard;
