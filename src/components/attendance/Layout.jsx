import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  LayoutDashboard, 
  Users, 
  Calendar, 
  FileText, 
  LogOut, 
  Menu, 
  X, 
  Sun, 
  Moon, 
  Bell, 
  Megaphone,
  Briefcase,
  UserCheck,
  ArrowLeft,
  User
} from 'lucide-react';
import StarfieldBackground from '../StarfieldBackground';

const Layout = ({ children }) => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(localStorage.getItem('theme') === 'dark');

  // Sync theme to root DOM
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  // Sidebar navigation configuration based on role
  const navigation = (user?.role === 'Admin' || user?.role === 'Manager') ? [
    { name: 'Admin Dashboard', href: '/admin', icon: LayoutDashboard },
    { name: 'Employees', href: '/admin/employees', icon: Users },
    { name: 'Leaves Board', href: '/admin/leaves', icon: Briefcase },
    { name: 'Holidays & Events', href: '/admin/holidays', icon: Calendar },
    { name: 'Broadcasts', href: '/admin/announcements', icon: Megaphone },
    { name: 'Reports & Logs', href: '/admin/reports', icon: FileText },
    { name: 'My Profile', href: '/admin/profile', icon: User },
  ] : [
    { name: 'Dashboard', href: '/employee', icon: LayoutDashboard },
    { name: 'Mark Attendance', href: '/employee/attendance', icon: UserCheck },
    { name: 'My Leaves', href: '/employee/leaves', icon: Briefcase },
    { name: 'Holidays & Events', href: '/employee/holidays', icon: Calendar },
    { name: 'Announcements', href: '/employee/announcements', icon: Megaphone },
    { name: 'My Profile', href: '/employee/profile', icon: User },
  ];

  return (
    <div className="flex h-screen bg-[#07192f] text-slate-100 font-sans relative overflow-hidden">
      <StarfieldBackground />
      
      {/* Mobile Sidebar overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-slate-950/60 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar Panel */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 flex flex-col w-64 border-r border-slate-800/80 bg-slate-900/90 backdrop-blur-md transition-transform duration-300 transform 
        lg:translate-x-0 lg:static lg:inset-auto 
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        {/* Brand Banner */}
        <div className="flex items-center justify-between h-16 px-6 border-b border-slate-800/80">
          <div className="flex items-center gap-2">
            <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-gradient-to-tr from-primary-500 to-indigo-600 text-white shadow-md shadow-primary-500/20">
              <UserCheck className="w-5 h-5" />
            </div>
            <span className="text-lg font-bold tracking-tight bg-gradient-to-r from-primary-600 to-indigo-500 bg-clip-text text-transparent dark:from-primary-400 dark:to-indigo-300">
              AttendanceHub
            </span>
          </div>
          <button 
            onClick={() => setSidebarOpen(false)}
            className="p-1 rounded-md text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 lg:hidden"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Sidebar Nav Items */}
        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
          {navigation.map((item) => {
            const isActive = location.pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                to={item.href}
                onClick={() => setSidebarOpen(false)}
                className={`
                  flex items-center gap-3 px-4 py-3 text-sm font-semibold rounded-xl transition-all duration-200 group
                  ${isActive 
                    ? 'bg-teal-500/25 text-teal-300 font-bold border border-teal-500/50 shadow-md shadow-teal-500/10' 
                    : 'text-slate-200 hover:text-white hover:bg-slate-800/90'}
                `}
              >
                <Icon className={`w-5 h-5 transition-transform duration-200 group-hover:scale-105 ${isActive ? 'text-teal-400' : 'text-slate-300 group-hover:text-white'}`} />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* Back to main portal link & User Card */}
        <div className="p-4 border-t border-slate-800 bg-slate-900/80 space-y-2.5">
          <Link
            to="/"
            className="flex items-center gap-2 px-3 py-2 text-xs font-bold text-slate-200 hover:text-white hover:bg-slate-800 rounded-xl transition-colors"
          >
            <ArrowLeft className="w-4 h-4 text-teal-400" />
            Main Website
          </Link>

          <Link 
            to={user?.role === 'Admin' || user?.role === 'Manager' ? '/admin/profile' : '/employee/profile'}
            className="flex items-center gap-3 px-2.5 py-2.5 rounded-xl hover:bg-slate-800 transition-colors group border border-slate-800/80 bg-slate-950/40"
            title="View Profile Console"
          >
            <div className="w-9 h-9 rounded-full bg-teal-800/60 flex items-center justify-center font-bold text-white overflow-hidden border border-teal-500/40 shrink-0 group-hover:scale-105 transition-transform shadow-sm">
              {user?.profilePhoto ? (
                <img src={user.profilePhoto} alt="profile" className="w-full h-full object-cover" />
              ) : (
                user?.fullName?.charAt(0).toUpperCase()
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-white truncate group-hover:text-teal-300 transition-colors">{user?.fullName}</p>
              <p className="text-[11px] text-slate-300 font-medium truncate capitalize">{user?.role} • {user?.designation || 'Staff'}</p>
            </div>
          </Link>

          <button
            onClick={handleLogout}
            className="flex items-center justify-center gap-2 w-full px-4 py-2.5 text-xs font-bold text-rose-400 hover:text-rose-300 hover:bg-rose-950/40 border border-rose-900/30 rounded-xl transition-colors duration-200 cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main View Container */}
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden relative z-10">
        {/* Top Navbar */}
        <header className="flex items-center justify-between h-16 px-6 border-b border-slate-800 bg-slate-900/90 backdrop-blur-md z-30 shadow-md">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setSidebarOpen(true)}
              className="p-1.5 rounded-lg text-slate-200 hover:bg-slate-800 lg:hidden"
            >
              <Menu className="w-5 h-5" />
            </button>
            <h1 className="text-lg font-black text-white hidden sm:block tracking-wide">
              {navigation.find(nav => nav.href === location.pathname)?.name || 'Dashboard'}
            </h1>
          </div>

          <div className="flex items-center gap-4">
            {/* Theme Toggle */}
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 rounded-xl border border-slate-800 text-slate-400 hover:bg-slate-800 transition-colors"
              title="Toggle Theme"
            >
              {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-400" />}
            </button>

            {/* Notification Trigger */}
            <button
              className="relative p-2 rounded-xl border border-slate-800 text-slate-400 hover:bg-slate-800 transition-colors"
              title="Notifications"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute top-1 right-1 w-2.5 h-2.5 rounded-full bg-red-500 border-2 border-slate-900" />
            </button>
          </div>
        </header>

        {/* Page Inner Content Container */}
        <main className="flex-1 overflow-y-auto p-6 md:p-8 bg-slate-950/40 backdrop-blur-[2px]">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
