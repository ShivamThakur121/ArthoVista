import { useState, useEffect } from "react";
import { X, CheckCircle, Sparkles, PhoneCall, ArrowRight, Loader2 } from "lucide-react";
import { useConsultation } from "../context/ConsultationContext";

export default function ConsultationModal() {
  const { isOpen, presetService, closeConsultationModal } = useConsultation();
  const [form, setForm] = useState({ name: "", phone: "", email: "", service: "" });
  const [status, setStatus] = useState("idle"); // idle | loading | success | error
  const [errMsg, setErrMsg] = useState("");
  const [animateIn, setAnimateIn] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setForm((prev) => ({ ...prev, service: presetService || "General Consultation" }));
      setStatus("idle");
      setErrMsg("");
      const timer = setTimeout(() => setAnimateIn(true), 10);
      return () => clearTimeout(timer);
    } else {
      setAnimateIn(false);
    }
  }, [isOpen, presetService]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("loading");
    setErrMsg("");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          phone: form.phone,
          email: form.email,
          service: form.service || "General Consultation",
          source: "global-consultation-modal",
        }),
      });
      const data = await res.json();
      if (data.success) {
        setStatus("success");
      } else {
        setErrMsg(data.message || "Unable to send request. Please try again.");
        setStatus("error");
      }
    } catch {
      setErrMsg("Network error. Please check connection and try again.");
      setStatus("error");
    }
  };

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-all duration-300 ${
        animateIn ? "bg-slate-950/80 backdrop-blur-md opacity-100" : "bg-slate-950/0 opacity-0"
      }`}
      onClick={(e) => e.target === e.currentTarget && closeConsultationModal()}
    >
      <div
        className={`relative w-full max-w-lg bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden text-white transition-all duration-300 ${
          animateIn ? "opacity-100 scale-100 translate-y-0" : "opacity-0 scale-95 translate-y-4"
        }`}
      >
        {/* Top Glow Accent */}
        <div className="h-1.5 bg-gradient-to-r from-teal-500 via-emerald-400 to-amber-500" />

        {/* Close Button */}
        <button
          onClick={closeConsultationModal}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-800/80 hover:bg-slate-700 flex items-center justify-center text-slate-300 hover:text-white transition-colors"
          aria-label="Close Modal"
        >
          <X size={16} />
        </button>

        <div className="p-6 sm:p-8">
          {/* Header */}
          <div className="flex items-center gap-2.5 mb-2">
            <span className="w-8 h-8 rounded-lg bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-400">
              <Sparkles size={16} />
            </span>
            <span className="text-xs font-semibold text-teal-400 uppercase tracking-wider">
              Free Advisory Session
            </span>
          </div>
          <h3 className="font-display font-black text-2xl text-white">
            Book Your Free Consultation
          </h3>
          <p className="text-slate-400 text-xs sm:text-sm mt-1 mb-6">
            Speak with an empanelled MSME advisor — no fees, no commitment required.
          </p>

          {status === "success" ? (
            <div className="py-8 text-center">
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center mx-auto mb-4">
                <CheckCircle size={36} className="text-emerald-400" />
              </div>
              <h4 className="font-display font-bold text-xl text-white">Request Submitted!</h4>
              <p className="text-slate-300 text-sm mt-2">
                Thank you! Our senior MSME consultant will call you within 24 hours.
              </p>
              <button
                onClick={closeConsultationModal}
                className="mt-6 px-6 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs transition-colors"
              >
                Done
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Full Name *</label>
                <input
                  type="text"
                  placeholder="Enter your full name"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="input-3d bg-slate-800/80 text-white border-slate-700 focus:border-teal-500 placeholder-slate-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Phone Number *</label>
                <input
                  type="tel"
                  placeholder="+91 98765 43210"
                  required
                  pattern="[0-9+\s\-]{7,15}"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  className="input-3d bg-slate-800/80 text-white border-slate-700 focus:border-teal-500 placeholder-slate-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  Email Address <span className="text-slate-500">(Optional)</span>
                </label>
                <input
                  type="email"
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="input-3d bg-slate-800/80 text-white border-slate-700 focus:border-teal-500 placeholder-slate-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Service / Lead Type</label>
                <select
                  value={form.service}
                  onChange={(e) => setForm({ ...form, service: e.target.value })}
                  className="input-3d bg-slate-800 text-white border-slate-700 focus:border-teal-500 rounded-xl w-full p-3 text-xs font-semibold"
                >
                  {/* Dynamic preset option if not already in list */}
                  {form.service && (
                    <option value={form.service} className="bg-slate-900 text-teal-300 font-bold">
                      ★ {form.service} (Selected)
                    </option>
                  )}
                  <optgroup label="── Loan Leads ──" className="bg-slate-900 text-slate-300">
                    <option value="Business Loan Leads" className="bg-slate-900 text-white">Business Loan Leads</option>
                    <option value="Salaried Personal Loan Leads" className="bg-slate-900 text-white">Salaried Personal Loan Leads</option>
                    <option value="Home Loan Leads" className="bg-slate-900 text-white">Home Loan Leads</option>
                    <option value="Loan Against Property Leads" className="bg-slate-900 text-white">Loan Against Property Leads</option>
                    <option value="Education Loan Leads" className="bg-slate-900 text-white">Education Loan Leads</option>
                    <option value="Machinery Loan Leads" className="bg-slate-900 text-white">Machinery Loan Leads</option>
                  </optgroup>
                  <optgroup label="── Government Scheme Leads ──" className="bg-slate-900 text-slate-300">
                    <option value="PMEGP Scheme Leads" className="bg-slate-900 text-white">PMEGP Scheme Leads</option>
                    <option value="CGTMSE Scheme Leads" className="bg-slate-900 text-white">CGTMSE Scheme Leads</option>
                    <option value="Mudra Loan Leads" className="bg-slate-900 text-white">Mudra Loan Leads</option>
                    <option value="Stand-Up India Scheme Leads" className="bg-slate-900 text-white">Stand-Up India Scheme Leads</option>
                    <option value="Startup India Seed Fund Leads" className="bg-slate-900 text-white">Startup India Seed Fund Leads</option>
                    <option value="PM-FME Scheme Leads" className="bg-slate-900 text-white">PM-FME Scheme Leads</option>
                  </optgroup>
                  <optgroup label="── Business & Compliance Leads ──" className="bg-slate-900 text-slate-300">
                    <option value="Business Registration Leads" className="bg-slate-900 text-white">Business Registration Leads</option>
                    <option value="Private Limited Company Leads" className="bg-slate-900 text-white">Private Limited Company Leads</option>
                    <option value="LLP Registration Leads" className="bg-slate-900 text-white">LLP Registration Leads</option>
                    <option value="ISO Certification Leads" className="bg-slate-900 text-white">ISO Certification Leads</option>
                    <option value="FSSAI License Leads" className="bg-slate-900 text-white">FSSAI License Leads</option>
                    <option value="GST & Tax Compliance Leads" className="bg-slate-900 text-white">GST & Tax Compliance Leads</option>
                    <option value="Trademark & IP Protection Leads" className="bg-slate-900 text-white">Trademark & IP Protection Leads</option>
                    <option value="General Consultation Leads" className="bg-slate-900 text-white">General Consultation Leads</option>
                  </optgroup>
                </select>
              </div>

              {status === "error" && (
                <p className="text-red-400 text-xs bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">
                  {errMsg}
                </p>
              )}

              <button
                type="submit"
                disabled={status === "loading"}
                className="btn-3d w-full bg-teal-600 hover:bg-teal-700 text-white font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 transition-all disabled:opacity-70"
              >
                {status === "loading" ? (
                  <><Loader2 size={16} className="animate-spin" /> Submitting…</>
                ) : (
                  <>Get Free Consultation <ArrowRight size={15} /></>
                )}
              </button>

              <div className="flex items-center justify-center gap-2 pt-2 text-[11px] text-slate-400">
                <PhoneCall size={12} className="text-amber-400" />
                <span>Or call direct: <strong className="text-white">+91 98999 02568</strong></span>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
