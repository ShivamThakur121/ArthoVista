// src/pages/PrivacyPolicy.jsx
import { Link } from "react-router-dom";
import { Shield, Lock, FileText, Mail, Phone, MapPin, ArrowLeft } from "lucide-react";
import useDocumentMetadata from "../hooks/useDocumentMetadata";
import { legalData } from "../data/legalData";

export default function PrivacyPolicy() {
  useDocumentMetadata(
    "Privacy Policy | ArthoVista Legal",
    "ArthoVista Privacy Policy detailing our data collection, processing, DPDP Act 2023 compliance, cookies, retention, security safeguards, and grievance redressal mechanisms."
  );

  const { privacyPolicy, company } = legalData;

  return (
    <div className="relative pt-8 pb-24 overflow-hidden">
      {/* Background Lighting */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[700px] h-[300px] bg-teal-500/10 blur-[150px] rounded-full pointer-events-none" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Navigation back */}
        <div className="mb-6">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-xs font-semibold text-teal-400 hover:text-teal-300 transition-colors"
          >
            <ArrowLeft size={14} /> Back to Home
          </Link>
        </div>

        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 p-6 sm:p-8 rounded-3xl bg-slate-900/80 border border-slate-800 backdrop-blur-md shadow-xl">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-teal-500/10 border border-teal-500/20 text-teal-400 text-xs font-bold uppercase tracking-wider mb-4">
            <Lock size={14} /> Official Legal Policy
          </div>
          <h1 className="font-display font-black text-3xl sm:text-4xl md:text-5xl text-white">
            {privacyPolicy.title}
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-3">
            Effective Date: <span className="text-teal-400 font-semibold">{privacyPolicy.effectiveDate}</span> &nbsp;|&nbsp; Last Updated: <span className="text-teal-400 font-semibold">{privacyPolicy.lastUpdated}</span>
          </p>
        </div>

        {/* Lead Banner */}
        <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/90 border border-teal-500/30 text-slate-200 text-sm sm:text-base leading-relaxed mb-10 shadow-2xl backdrop-blur-md">
          {privacyPolicy.lead}
        </div>

        {/* Policy Sections */}
        <div className="space-y-8">
          {privacyPolicy.sections.map((sec) => (
            <div
              key={sec.id}
              id={sec.id}
              className="p-6 sm:p-8 rounded-2xl bg-slate-900/80 border border-slate-800 backdrop-blur-sm"
            >
              <h2 className="font-display font-bold text-xl text-white mb-4 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-teal-400"></span>
                {sec.title}
              </h2>

              {sec.content && (
                <p className="text-slate-300 text-sm leading-relaxed whitespace-pre-line">
                  {sec.content}
                </p>
              )}

              {sec.items && (
                <ul className="mt-4 space-y-2.5 text-xs sm:text-sm text-slate-300">
                  {sec.items.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2.5">
                      <span className="text-teal-400 mt-1 font-bold">•</span>
                      <span dangerouslySetInnerHTML={{ __html: item.replace(/\*\*(.*?)\*\*/g, '<strong class="text-white font-semibold">$1</strong>') }} />
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>

        {/* Legal Contact Card */}
        <div className="mt-12 p-8 rounded-3xl bg-gradient-to-br from-slate-900 via-slate-850 to-teal-950/40 border border-teal-500/30">
          <h3 className="font-display font-bold text-xl text-white mb-4 flex items-center gap-2">
            <Shield size={20} className="text-teal-400" />
            Contact Us & Privacy Grievance Officer
          </h3>

          <div className="grid sm:grid-cols-2 gap-6 text-xs sm:text-sm text-slate-300 mt-4">
            <div>
              <p><strong className="text-white">Brand:</strong> {company.brand}</p>
              <p className="mt-1.5"><strong className="text-white">Legal Entity:</strong> {company.legalEntity}</p>
              <p className="mt-1.5"><strong className="text-white">Privacy Officer:</strong> {company.grievanceOfficer}</p>
            </div>
            <div>
              <p className="flex items-start gap-2">
                <MapPin size={16} className="text-teal-400 shrink-0 mt-0.5" />
                <span>{company.communicationOffice}</span>
              </p>
              <p className="flex items-center gap-2 mt-2">
                <Mail size={16} className="text-teal-400 shrink-0" />
                <a href={`mailto:${company.email}`} className="text-teal-400 hover:underline">{company.email}</a>
              </p>
              <p className="flex items-center gap-2 mt-2">
                <Phone size={16} className="text-teal-400 shrink-0" />
                <a href={`tel:${company.phone}`} className="text-teal-400 hover:underline">{company.phone}</a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
