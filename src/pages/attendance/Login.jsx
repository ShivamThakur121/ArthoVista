import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Shield, Lock, User, AlertCircle, Eye, EyeOff, ArrowLeft, Globe } from 'lucide-react';

const Login = () => {
  const { login, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Determine where to redirect after success
  const from = location.state?.from?.pathname || '';

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username || !password) {
      setError('Please fill in all fields.');
      return;
    }

    setError('');
    setSubmitting(true);

    const result = await login(username, password);
    setSubmitting(false);

    if (!result.success) {
      setError(result.message);
    }
  };

  // React to successful login
  React.useEffect(() => {
    if (user) {
      if (from) {
        navigate(from, { replace: true });
      } else {
        navigate(user.role === 'Admin' ? '/admin' : '/employee', { replace: true });
      }
    }
  }, [user, navigate, from]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50 dark:bg-slate-950 px-4 transition-colors duration-200 relative">
      
      {/* Background radial gradient decoration */}
      <div className="absolute top-0 left-0 right-0 bottom-0 bg-[radial-gradient(circle_at_top_right,rgba(79,115,255,0.08),transparent_45%)] dark:bg-[radial-gradient(circle_at_top_right,rgba(79,115,255,0.03),transparent_45%)] pointer-events-none" />
      <div className="absolute bottom-0 left-0 right-0 top-0 bg-[radial-gradient(circle_at_bottom_left,rgba(99,102,241,0.08),transparent_45%)] dark:bg-[radial-gradient(circle_at_bottom_left,rgba(99,102,241,0.03),transparent_45%)] pointer-events-none" />

      {/* Main glass card container */}
      <div className="w-full max-w-md glass-panel p-8 rounded-3xl relative z-10 border border-white/40 dark:border-slate-800/40">
        
        {/* Back to main website button */}
        <div className="mb-6 flex items-center justify-between border-b border-slate-100 dark:border-slate-800/80 pb-4">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-xs font-bold text-teal-600 dark:text-teal-400 hover:text-teal-700 dark:hover:text-teal-300 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Go to Main Website
          </Link>
          <Globe className="w-4 h-4 text-slate-400" />
        </div>

        {/* Brand Banner */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-12 h-12 bg-gradient-to-tr from-primary-500 to-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-primary-500/20 mb-3 animate-pulse-ring">
            <Shield className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-800 dark:text-slate-100">Welcome Back</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Sign in to manage biometric attendance</p>
        </div>

        {/* Error Alert Box */}
        {error && (
          <div className="flex items-start gap-2.5 p-3.5 mb-6 rounded-2xl bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/30 text-red-600 dark:text-red-400 text-xs leading-relaxed animate-shake">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-2">
              Email / Employee ID
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-slate-400 dark:text-slate-500">
                <User className="w-4 h-4" />
              </span>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="admin@attendance.com or ADMIN001"
                className="w-full pl-10 pr-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/40 focus:border-primary-500 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-600 transition-all"
                disabled={submitting}
                required
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                Password
              </label>
            </div>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-slate-400 dark:text-slate-500">
                <Lock className="w-4 h-4" />
              </span>
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-10 py-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/40 focus:border-primary-500 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-600 transition-all"
                disabled={submitting}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-primary-500 to-indigo-600 hover:from-primary-600 hover:to-indigo-700 text-white font-semibold text-sm shadow-lg shadow-primary-500/10 hover:shadow-primary-500/20 active:scale-[0.98] transition-all disabled:opacity-50 disabled:pointer-events-none mt-2"
          >
            {submitting ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        {/* Demo Credentials Footer */}
        <div className="mt-8 pt-6 border-t border-slate-200/50 dark:border-slate-800/50 text-center">
          <h1 className="text-[32px] text-slate-400 dark:text-slate-500">
            🕉️🔱📿
          </h1>
        </div>

      </div>
    </div>
  );
};

export default Login;
