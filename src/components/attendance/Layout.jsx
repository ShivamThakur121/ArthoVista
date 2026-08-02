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
  ArrowLeft
} from 'lucide-react';

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
  ] : [
    { name: 'Dashboard', href: '/employee', icon: LayoutDashboard },
    { name: 'Mark Attendance', href: '/employee/attendance', icon: UserCheck },
    { name: 'My Leaves', href: '/employee/leaves', icon: Briefcase },
    { name: 'Holidays & Events', href: '/employee/holidays', icon: Calendar },
    { name: 'Announcements', href: '/employee/announcements', icon: Megaphone },
  ];

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-slate-950 font-sans transition-colors duration-200">
      
      {/* Mobile Sidebar overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar Panel */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 flex flex-col w-64 border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 transition-transform duration-300 transform 
        lg:translate-x-0 lg:static lg:inset-auto 
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        {/* Brand Banner */}
        <div className="flex items-center justify-between h-16 px-6 border-b border-slate-100 dark:border-slate-800">
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
        <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
          {navigation.map((item) => {
            const isActive = location.pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                to={item.href}
                onClick={() => setSidebarOpen(false)}
                className={`
                  flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 group
                  ${isActive 
                    ? 'bg-primary-50 dark:bg-primary-950/40 text-primary-600 dark:text-primary-400' 
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-200'}
                `}
              >
                <Icon className={`w-5 h-5 transition-transform duration-200 group-hover:scale-105 ${isActive ? 'text-primary-600 dark:text-primary-400' : 'text-slate-400 dark:text-slate-500'}`} />
                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* Back to main portal link & User Card */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 space-y-2">
          <Link
            to="/"
            className="flex items-center gap-2 px-3 py-2 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-200/50 dark:hover:bg-slate-800 rounded-xl transition-colors"
          >
            <ArrowLeft className="w-4 h-4 text-orange-500" />
            Main Website
          </Link>

          <div className="flex items-center gap-3 px-2 py-3">
            <div className="w-9 h-9 rounded-full bg-primary-100 dark:bg-primary-900/50 flex items-center justify-center font-bold text-primary-600 overflow-hidden border border-slate-200 dark:border-slate-700">
              {user?.profilePhoto ? (
                <img src={user.profilePhoto} alt="profile" className="w-full h-full object-cover" />
              ) : (
                user?.fullName?.charAt(0).toUpperCase()
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate">{user?.fullName}</p>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate capitalize">{user?.role} • {user?.designation || 'Staff'}</p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="flex items-center justify-center gap-2 w-full px-4 py-2.5 text-xs font-semibold text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-xl transition-colors duration-200"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main View Container */}
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        {/* Top Navbar */}
        <header className="flex items-center justify-between h-16 px-6 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/80 backdrop-blur-md z-30">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setSidebarOpen(true)}
              className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 lg:hidden"
            >
              <Menu className="w-5 h-5" />
            </button>
            <h1 className="text-lg font-bold text-slate-800 dark:text-slate-200 hidden sm:block">
              {navigation.find(nav => nav.href === location.pathname)?.name || 'Dashboard'}
            </h1>
          </div>

          <div className="flex items-center gap-4">
            {/* Theme Toggle */}
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
              title="Toggle Theme"
            >
              {darkMode ? <Sun className="w-4 h-4 text-amber-500" /> : <Moon className="w-4 h-4 text-indigo-500" />}
            </button>

            {/* Notification Trigger */}
            <button
              className="relative p-2 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
              title="Notifications"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute top-1 right-1 w-2.5 h-2.5 rounded-full bg-red-500 border-2 border-white dark:border-slate-900" />
            </button>
          </div>
        </header>

        {/* Page Inner Content Container */}
        <main className="flex-1 overflow-y-auto p-6 md:p-8">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
