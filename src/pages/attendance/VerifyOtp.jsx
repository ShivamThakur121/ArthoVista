import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { api } from '../../context/AuthContext';
import { Shield, Lock, AlertCircle, ArrowLeft, Globe, CheckCircle2 } from 'lucide-react';
import StarfieldBackground from '../../components/StarfieldBackground';

const VerifyOtp = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email || '';

  const [otp, setOtp] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Secure navigation check: Redirect if email is not present in state
  useEffect(() => {
    if (!email) {
      navigate('/forgot-password', { replace: true });
    }
  }, [email, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!otp || otp.length !== 6) {
      setError('Please enter the 6-digit verification code.');
      return;
    }

    setError('');
    setSuccess('');
    setSubmitting(true);

    try {
      const res = await api.post('/auth/verify-otp', { email, otp });
      if (res.data.success) {
        setSuccess(res.data.message);
        setTimeout(() => {
          navigate('/reset-password', { state: { email, otp } });
        }, 1500);
      } else {
        setError(res.data.message || 'Verification failed.');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Error verifying OTP code.');
    } finally {
      setSubmitting(false);
    }
  };

  if (!email) return null;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#07192f] text-slate-100 px-4 relative overflow-hidden">
      <StarfieldBackground />
      {/* Background radial gradient decoration */}
      <div className="absolute top-0 left-0 right-0 bottom-0 bg-[radial-gradient(circle_at_top_right,rgba(79,115,255,0.08),transparent_45%)] dark:bg-[radial-gradient(circle_at_top_right,rgba(79,115,255,0.03),transparent_45%)] pointer-events-none" />
      <div className="absolute bottom-0 left-0 right-0 top-0 bg-[radial-gradient(circle_at_bottom_left,rgba(99,102,241,0.08),transparent_45%)] dark:bg-[radial-gradient(circle_at_bottom_left,rgba(99,102,241,0.03),transparent_45%)] pointer-events-none" />

      {/* Main glass card container */}
      <div className="w-full max-w-md bg-slate-900/95 backdrop-blur-2xl p-8 rounded-3xl relative z-10 border border-slate-700/80 shadow-2xl text-white">
        
        {/* Back link */}
        <div className="mb-6 flex items-center justify-between border-b border-slate-800 pb-4">
          <Link
            to="/forgot-password"
            className="inline-flex items-center gap-2 text-xs font-bold text-teal-400 hover:text-teal-300 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </Link>
          <Globe className="w-4 h-4 text-slate-400" />
        </div>

        {/* Brand Banner */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-12 h-12 bg-gradient-to-tr from-teal-500 to-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-teal-500/20 mb-3 animate-pulse-ring">
            <Shield className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-display font-black tracking-tight text-white">
            Verify Code
          </h2>
          <p className="text-sm font-medium text-slate-300 mt-1 text-center">
            We've sent a 6-digit verification code to <span className="font-bold text-teal-300">{email}</span>
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
              6-Digit OTP Code *
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-teal-400">
                <Lock className="w-4 h-4" />
              </span>
              <input
                type="text"
                maxLength={6}
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                placeholder="123456"
                className="w-full pl-10 pr-4 py-3 rounded-2xl border border-slate-700 bg-slate-950/90 text-white tracking-[6px] font-black text-center text-lg focus:outline-none focus:ring-2 focus:ring-teal-500/50 focus:border-teal-500 placeholder:tracking-normal placeholder:font-normal placeholder:text-slate-500 transition-all shadow-inner"
                disabled={submitting}
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="btn-3d w-full py-3.5 px-4 rounded-2xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-sm shadow-lg shadow-teal-500/25 active:scale-[0.98] transition-all disabled:opacity-50 disabled:pointer-events-none mt-2 cursor-pointer"
          >
            {submitting ? 'Verifying...' : 'Verify Code'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default VerifyOtp;
