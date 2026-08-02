import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { api } from '../../context/AuthContext';
import { Shield, Mail, AlertCircle, ArrowLeft, Globe, CheckCircle2 } from 'lucide-react';

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) {
      setError('Please enter your registered email address.');
      return;
    }

    setError('');
    setSuccess('');
    setSubmitting(true);

    try {
      const res = await api.post('/auth/forgot-password', { email });
      if (res.data.success) {
        setSuccess(res.data.message);
        // Wait 1.5 seconds so the user can read the success message, then redirect
        setTimeout(() => {
          navigate('/verify-otp', { state: { email } });
        }, 1500);
      } else {
        setError(res.data.message || 'Failed to send OTP.');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Error occurred while sending OTP.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50 dark:bg-slate-950 px-4 transition-colors duration-200 relative">
      {/* Background radial gradient decoration */}
      <div className="absolute top-0 left-0 right-0 bottom-0 bg-[radial-gradient(circle_at_top_right,rgba(79,115,255,0.08),transparent_45%)] dark:bg-[radial-gradient(circle_at_top_right,rgba(79,115,255,0.03),transparent_45%)] pointer-events-none" />
      <div className="absolute bottom-0 left-0 right-0 top-0 bg-[radial-gradient(circle_at_bottom_left,rgba(99,102,241,0.08),transparent_45%)] dark:bg-[radial-gradient(circle_at_bottom_left,rgba(99,102,241,0.03),transparent_45%)] pointer-events-none" />

      {/* Main glass card container */}
      <div className="w-full max-w-md glass-panel p-8 rounded-3xl relative z-10 border border-white/40 dark:border-slate-800/40">
        
        {/* Back to Login link */}
        <div className="mb-6 flex items-center justify-between border-b border-slate-100 dark:border-slate-800/80 pb-4">
          <Link
            to="/login"
            className="inline-flex items-center gap-2 text-xs font-bold text-teal-600 dark:text-teal-400 hover:text-teal-700 dark:hover:text-teal-300 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Login
          </Link>
          <Globe className="w-4 h-4 text-slate-400" />
        </div>

        {/* Brand Banner */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-12 h-12 bg-gradient-to-tr from-primary-500 to-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-primary-500/20 mb-3 animate-pulse-ring">
            <Shield className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-800 dark:text-slate-100">
            Forgot Password
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 text-center">
            Enter your registered email address to receive a 6-digit OTP code
          </p>
        </div>

        {/* Error Alert Box */}
        {error && (
          <div className="flex items-start gap-2.5 p-3.5 mb-6 rounded-2xl bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/30 text-red-600 dark:text-red-400 text-xs leading-relaxed animate-shake">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {/* Success Alert Box */}
        {success && (
          <div className="flex items-start gap-2.5 p-3.5 mb-6 rounded-2xl bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900/30 text-emerald-600 dark:text-emerald-400 text-xs leading-relaxed">
            <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{success}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-2">
              Registered Email
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-slate-400 dark:text-slate-500">
                <Mail className="w-4 h-4" />
              </span>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="employee@company.com"
                className="w-full pl-10 pr-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/40 focus:border-primary-500 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-600 transition-all"
                disabled={submitting}
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-primary-500 to-indigo-600 hover:from-primary-600 hover:to-indigo-700 text-white font-semibold text-sm shadow-lg shadow-primary-500/10 hover:shadow-primary-500/20 active:scale-[0.98] transition-all disabled:opacity-50 disabled:pointer-events-none mt-2"
          >
            {submitting ? 'Sending OTP...' : 'Send OTP'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;
