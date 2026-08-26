import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Shield, Lock, User, AlertCircle, Eye, EyeOff, ArrowLeft, Globe, CheckCircle2 } from 'lucide-react';
import StarfieldBackground from '../../components/StarfieldBackground';

const Login = () => {
  const { login, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Standard Login state
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Determine where to redirect after success
  const from = location.state?.from?.pathname || '';

  // Handle success message from redirect state (e.g., after password reset)
  useEffect(() => {
    if (location.state?.successMessage) {
      setSuccess(location.state.successMessage);
      // Clear the state so it doesn't show again on refresh
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username || !password) {
      setError('Please fill in all fields.');
      return;
    }

    setError('');
    setSuccess('');
    setSubmitting(true);

    const result = await login(username, password);
    setSubmitting(false);

    if (!result.success) {
      setError(result.message);
    }
  };

  // React to successful login
  useEffect(() => {
    if (user) {
      if (from) {
        navigate(from, { replace: true });
      } else {
        navigate(['Admin', 'Manager'].includes(user.role) ? '/admin' : '/employee', { replace: true });
      }
    }
  }, [user, navigate, from]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#07192f] text-slate-100 px-4 relative overflow-hidden">
      <StarfieldBackground />

      {/* Background radial gradient decoration */}
      <div className="absolute top-0 left-0 right-0 bottom-0 bg-[radial-gradient(circle_at_top_right,rgba(79,115,255,0.08),transparent_45%)] dark:bg-[radial-gradient(circle_at_top_right,rgba(79,115,255,0.03),transparent_45%)] pointer-events-none" />
      <div className="absolute bottom-0 left-0 right-0 top-0 bg-[radial-gradient(circle_at_bottom_left,rgba(99,102,241,0.08),transparent_45%)] dark:bg-[radial-gradient(circle_at_bottom_left,rgba(99,102,241,0.03),transparent_45%)] pointer-events-none" />

      {/* Main glass card container */}
      <div className="w-full max-w-md bg-slate-900/95 backdrop-blur-2xl p-8 rounded-3xl relative z-10 border border-slate-700/80 shadow-2xl text-white">

        {/* Back to main website button */}
        <div className="mb-6 flex items-center justify-between border-b border-slate-800 pb-4">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-xs font-bold text-teal-400 hover:text-teal-300 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Go to Main Website
          </Link>
          <Globe className="w-4 h-4 text-slate-400" />
        </div>

        {/* Brand Banner */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-12 h-12 bg-gradient-to-tr from-teal-500 to-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-teal-500/20 mb-3 animate-pulse-ring">
            <Shield className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-display font-black tracking-tight text-white">
            Welcome Back
          </h2>
          <p className="text-sm font-medium text-slate-300 mt-1 text-center">
            Sign in to manage biometric attendance
          </p>
        </div>

        {/* Error Alert Box */}
        {error && (
          <div className="flex items-start gap-2.5 p-3.5 mb-6 rounded-2xl bg-red-950/60 border border-red-500/40 text-red-300 text-xs font-medium leading-relaxed animate-shake">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-400" />
            <span>{error}</span>
          </div>
        )}

        {/* Success Alert Box */}
        {success && (
          <div className="flex items-start gap-2.5 p-3.5 mb-6 rounded-2xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 text-xs font-medium leading-relaxed">
            <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-emerald-400" />
            <span>{success}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-bold text-teal-300 uppercase tracking-wider mb-2">
              Email / Employee ID *
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-teal-400">
                <User className="w-4 h-4" />
              </span>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="admin@attendance.com or ADMIN001"
                className="w-full pl-10 pr-4 py-3 rounded-2xl border border-slate-700 bg-slate-950/90 text-white font-semibold text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/50 focus:border-teal-500 placeholder:text-slate-500 transition-all shadow-inner"
                disabled={submitting}
                required
              />
            </div>
          </div>

          <div className='w-full'>
            <div className="flex items-start mb-2">
              <label className="block text-xs font-bold text-teal-300 uppercase tracking-wider">
                Password *
              </label>
            </div>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-teal-400">
                <Lock className="w-4 h-4" />
              </span>
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-10 py-3 rounded-2xl border border-slate-700 bg-slate-950/90 text-white font-semibold text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/50 focus:border-teal-500 placeholder:text-slate-500 transition-all shadow-inner"
                disabled={submitting}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-white"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            <button
              type="button"
              onClick={() => navigate('/forgot-password')}
              className="flex justify-end w-full text-xs font-bold text-teal-400 hover:text-teal-300 hover:underline focus:outline-none mt-2 cursor-pointer"
            >
              Forgot Password?
            </button>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="btn-3d w-full py-3.5 px-4 rounded-2xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-sm shadow-lg shadow-teal-500/25 active:scale-[0.98] transition-all disabled:opacity-50 disabled:pointer-events-none mt-2 cursor-pointer"
          >
            {submitting ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

      </div>
    </div>
  );
};

export default Login;