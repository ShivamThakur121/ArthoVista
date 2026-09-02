import { useState, useEffect } from "react";
import { X, CheckCircle, Sparkles, PhoneCall, ArrowRight, Loader2 } from "lucide-react";
import { useConsultation } from "../context/ConsultationContext";

export default function ConsultationModal() {
  const { isOpen, presetService, closeConsultationModal } = useConsultation();
  const [form, setForm] = useState({ name: "", phone: "", email: "", service: "" });
  const [status, setStatus] = useState("idle"); // idle | loading | success | error
  const [errMsg, setErrMsg] = useState("");

  useEffect(() => {
    if (isOpen) {
      setForm({
        name: "",
        phone: "",
        email: "",
        service: presetService || "General Consultation",
      });
      setStatus("idle");
      setErrMsg("");
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen, presetService]);

  // Handle ESC key to close
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && isOpen) {
        closeConsultationModal();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, closeConsultationModal]);

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
      className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in"
      onClick={(e) => e.target === e.currentTarget && closeConsultationModal()}
      role="dialog"
      aria-modal="true"
    >
      <div className="relative w-full max-w-lg bg-white border border-slate-200 rounded-2xl shadow-2xl overflow-hidden text-slate-900 animate-scale-in">
        {/* Top Glow Accent */}
        <div className="h-1.5 bg-gradient-to-r from-green-500 via-blue-500 to-green-500" />

        {/* Close Button */}
        <button
          onClick={closeConsultationModal}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600 hover:text-slate-900 transition-colors cursor-pointer z-10"
          aria-label="Close Modal"
        >
          <X size={16} />
        </button>

        <div className="p-6 sm:p-8">
          {/* Header */}
          <div className="flex items-center gap-2.5 mb-2">
            <span className="w-8 h-8 rounded-lg bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700">
              <Sparkles size={16} />
            </span>
            <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">
              Free Advisory Session
            </span>
          </div>
          <h3 className="font-display font-black text-2xl text-slate-900">
            Book Your Free Consultation
          </h3>
          <p className="text-slate-600 text-xs sm:text-sm mt-1 mb-6 font-normal">
            Speak with an empanelled MSME advisor — no fees, no commitment required.
          </p>

          {status === "success" ? (
            <div className="py-8 text-center">
              <div className="w-16 h-16 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center mx-auto mb-4">
                <CheckCircle size={36} className="text-emerald-600" />
              </div>
              <h4 className="font-display font-bold text-xl text-slate-900">Request Submitted!</h4>
              <p className="text-slate-600 text-sm mt-2 font-medium">
                Thank you! Our senior MSME consultant will call you within 24 hours.
              </p>
              <button
                onClick={closeConsultationModal}
                className="mt-6 px-6 py-2.5 rounded-xl bg-gradient-to-r from-green-500 via-blue-500 to-green-500 text-white font-bold text-xs transition-opacity hover:opacity-95 cursor-pointer shadow-md"
              >
                Done
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Full Name *</label>
                <input
                  type="text"
                  placeholder="Enter your full name"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-white text-slate-900 border border-slate-300 focus:outline-none focus:border-green-600 focus:ring-1 focus:ring-green-600 placeholder-slate-400 text-sm font-medium shadow-2xs"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Phone Number *</label>
                <input
                  type="tel"
                  placeholder="+91 98765 43210"
                  required
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-white text-slate-900 border border-slate-300 focus:outline-none focus:border-green-600 focus:ring-1 focus:ring-green-600 placeholder-slate-400 text-sm font-medium shadow-2xs"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Email Address</label>
                <input
                  type="email"
                  placeholder="your.email@example.com"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-white text-slate-900 border border-slate-300 focus:outline-none focus:border-green-600 focus:ring-1 focus:ring-green-600 placeholder-slate-400 text-sm font-medium shadow-2xs"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Service / Scheme Required
                </label>
                <select
                  value={form.service}
                  onChange={(e) => setForm({ ...form, service: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-white text-slate-900 border border-slate-300 focus:outline-none focus:border-green-600 focus:ring-1 focus:ring-green-600 text-sm font-medium shadow-2xs cursor-pointer"
                >
                  <optgroup label="── Government Schemes & Subsidies ──">
                    <option value="PMEGP Subsidy Scheme Leads">PMEGP Subsidy (up to 35% subsidy)</option>
                    <option value="CGTMSE Collateral-Free Loans Leads">CGTMSE Collateral-Free Loan (up to ₹5Cr)</option>
                    <option value="Mudra Loans Leads">Mudra Loan (Shishu / Kishor / Tarun)</option>
                    <option value="PM-FME Food Processing Subsidy Leads">PM-FME Food Processing Subsidy (up to ₹10L)</option>
                    <option value="MSME Sustainable (ZED) Certification Leads">MSME ZED Certification (up to 80% subsidy)</option>
                    <option value="Startup India Seed Fund Leads">Startup India Seed Fund & Tax Exemption</option>
                  </optgroup>
                  <optgroup label="── Loans & Financial Products ──">
                    <option value="Business & MSME Loan Leads">Business & MSME Unsecured Loan</option>
                    <option value="Machinery & Equipment Financing Leads">Machinery & Equipment Loan</option>
                    <option value="Working Capital / CC Limit Leads">Working Capital / CC / OD Limit</option>
                    <option value="Home Loan & LAP Leads">Home Loan & Loan Against Property (LAP)</option>
                    <option value="Invoice Discounting Leads">Invoice Discounting & Bill Factoring</option>
                  </optgroup>
                  <optgroup label="── Business & Compliance Leads ──">
                    <option value="Business Registration Leads">Business Registration Leads</option>
                    <option value="Private Limited Company Leads">Private Limited Company Leads</option>
                    <option value="LLP Registration Leads">LLP Registration Leads</option>
                    <option value="ISO Certification Leads">ISO Certification Leads</option>
                    <option value="FSSAI License Leads">FSSAI License Leads</option>
                    <option value="GST & Tax Compliance Leads">GST & Tax Compliance Leads</option>
                    <option value="Trademark & IP Protection Leads">Trademark & IP Protection Leads</option>
                    <option value="General Consultation Leads">General Consultation Leads</option>
                  </optgroup>
                </select>
              </div>

              {status === "error" && (
                <p className="text-red-700 text-xs bg-red-50 border border-red-200 rounded-lg px-3 py-2 font-medium">
                  {errMsg}
                </p>
              )}

              <button
                type="submit"
                disabled={status === "loading"}
                className="btn-3d w-full bg-gradient-to-r from-green-500 via-blue-500 to-green-500 hover:opacity-95 text-white font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 transition-all disabled:opacity-70 shadow-md cursor-pointer"
              >
                {status === "loading" ? (
                  <><Loader2 size={16} className="animate-spin" /> Submitting…</>
                ) : (
                  <>Get Free Consultation <ArrowRight size={15} /></>
                )}
              </button>

              <div className="flex items-center justify-center gap-2 pt-2 text-xs text-slate-600 font-medium">
                <PhoneCall size={13} className="text-green-600" />
                <span>Or call direct: <strong className="text-slate-900 font-bold">+91 98999 02568</strong></span>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
