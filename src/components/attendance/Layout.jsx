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
  User,
  BookOpen,
  Mail
} from 'lucide-react';

const Layout = ({ children }) => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(localStorage.getItem('theme') === 'dark' ? false : false);

  // Sync theme to root DOM (default to clean white enterprise mode)
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
    { name: 'Blog Studio', href: '/admin/blogs', icon: BookOpen },
    { name: 'Gazette Studio', href: '/admin/newsletters', icon: Mail },
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
    <div className="flex h-screen bg-[#f8fafc] dark:bg-slate-950 text-slate-800 dark:text-slate-100 font-sans relative overflow-hidden transition-colors duration-200">
      
      {/* Mobile Sidebar overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-xs lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar Panel */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 flex flex-col w-64 border-r border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 transition-transform duration-300 transform shadow-xs
        lg:translate-x-0 lg:static lg:inset-auto 
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        {/* Brand Banner */}
        <div className="flex items-center justify-between h-16 px-6 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-tr from-primary-600 to-indigo-600 text-white shadow-md shadow-primary-500/20">
              <UserCheck className="w-5 h-5" />
            </div>
            <span className="text-lg font-black tracking-tight text-slate-900 dark:text-white">
              Attendance<span className="text-primary-600 dark:text-primary-400">Hub</span>
            </span>
          </div>
          <button 
            onClick={() => setSidebarOpen(false)}
            className="p-1 rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 lg:hidden"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Sidebar Nav Items */}
        <nav className="flex-1 px-3.5 py-6 space-y-1.5 overflow-y-auto">
          {navigation.map((item) => {
            const isActive = location.pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                to={item.href}
                onClick={() => setSidebarOpen(false)}
                className={`
                  flex items-center gap-3 px-3.5 py-2.5 text-sm font-semibold rounded-xl transition-all duration-150 group
                  ${isActive 
                    ? 'bg-primary-50 dark:bg-primary-950/40 text-primary-700 dark:text-primary-300 font-bold border border-primary-200/70 dark:border-primary-800/50 shadow-xs' 
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100/70 dark:hover:bg-slate-800/60'}
                `}
              >
                <Icon className={`w-4.5 h-4.5 transition-transform duration-150 group-hover:scale-105 ${isActive ? 'text-primary-600 dark:text-primary-400' : 'text-slate-400 group-hover:text-slate-700 dark:group-hover:text-slate-200'}`} />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* Back to main portal link & User Card */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/60 space-y-2.5">
          <Link
            to="/"
            className="flex items-center gap-2 px-3 py-2 text-xs font-bold text-slate-600 dark:text-slate-300 hover:text-primary-600 hover:bg-white dark:hover:bg-slate-800 rounded-xl transition-all border border-transparent hover:border-slate-200 dark:hover:border-slate-700"
          >
            <ArrowLeft className="w-4 h-4 text-primary-600 dark:text-primary-400" />
            Main Website
          </Link>

          <Link 
            to={user?.role === 'Admin' || user?.role === 'Manager' ? '/admin/profile' : '/employee/profile'}
            className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-white dark:hover:bg-slate-800 transition-all group border border-slate-200/60 dark:border-slate-800 bg-white/80 dark:bg-slate-950/40 shadow-2xs"
            title="View Profile Console"
          >
            <div className="w-9 h-9 rounded-full bg-primary-100 dark:bg-primary-900/50 text-primary-700 dark:text-primary-300 flex items-center justify-center font-bold overflow-hidden border border-primary-200 dark:border-primary-700 shrink-0 group-hover:scale-105 transition-transform">
              {user?.profilePhoto ? (
                <img src={user.profilePhoto} alt="profile" className="w-full h-full object-cover" />
              ) : (
                user?.fullName?.charAt(0).toUpperCase()
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-slate-800 dark:text-white truncate group-hover:text-primary-600 transition-colors">{user?.fullName}</p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium truncate capitalize">{user?.role} • {user?.designation || 'Staff'}</p>
            </div>
          </Link>

          <button
            onClick={handleLogout}
            className="flex items-center justify-center gap-2 w-full px-4 py-2.5 text-xs font-bold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 border border-rose-200 dark:border-rose-900/30 rounded-xl transition-colors cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main View Container */}
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden relative z-10 bg-[#f8fafc] dark:bg-slate-950">
        {/* Top Navbar */}
        <header className="flex items-center justify-between h-16 px-6 border-b border-slate-200/80 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md z-30 shadow-2xs">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setSidebarOpen(true)}
              className="p-1.5 rounded-lg text-slate-600 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 lg:hidden"
            >
              <Menu className="w-5 h-5" />
            </button>
            <h1 className="text-lg font-bold text-slate-900 dark:text-white hidden sm:block tracking-tight">
              {navigation.find(nav => nav.href === location.pathname)?.name || 'Dashboard'}
            </h1>
          </div>

          <div className="flex items-center gap-3">
            {/* Theme Toggle */}
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title="Toggle Theme"
            >
              {darkMode ? <Sun className="w-4 h-4 text-amber-500" /> : <Moon className="w-4 h-4 text-indigo-600" />}
            </button>

            {/* Notification Trigger */}
            <button
              className="relative p-2 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title="Notifications"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute top-1 right-1 w-2.5 h-2.5 rounded-full bg-red-500 border-2 border-white dark:border-slate-900" />
            </button>
          </div>
        </header>

        {/* Page Inner Content Container */}
        <main className="flex-1 overflow-y-auto p-6 md:p-8 bg-[#f8fafc] dark:bg-slate-950">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
