// src/pages/TermsOfService.jsx
import { Link } from "react-router-dom";
import { ShieldAlert, FileCheck, ArrowLeft, Mail, Phone, MapPin } from "lucide-react";
import useDocumentMetadata from "../hooks/useDocumentMetadata";
import { legalData } from "../data/legalData";

export default function TermsOfService() {
  useDocumentMetadata(
    "Terms of Service | ArthoVista Legal",
    "ArthoVista Terms of Service governing platform usage, advisory scope, fee structures, cancellation/refund policies, and legal jurisdiction."
  );

  const { termsOfService, company } = legalData;

  return (
    <div className="relative pt-8 pb-24 overflow-hidden">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Navigation back */}
        <div className="mb-6">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-xs font-bold text-amber-700 hover:text-amber-800 transition-colors"
          >
            <ArrowLeft size={14} /> Back to Home
          </Link>
        </div>

        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-md">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-700 text-xs font-bold uppercase tracking-wider mb-4">
            <ShieldAlert size={14} /> Terms & User Agreement
          </div>
          <h1 className="font-display font-black text-3xl sm:text-4xl md:text-5xl text-slate-900">
            {termsOfService.title}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-3 font-medium">
            Effective Date: <span className="text-amber-700 font-bold">{termsOfService.effectiveDate}</span> &nbsp;|&nbsp; Last Updated: <span className="text-amber-700 font-bold">{termsOfService.lastUpdated}</span>
          </p>
        </div>

        {/* Lead Banner */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white border border-amber-200 text-slate-700 text-sm sm:text-base leading-relaxed mb-10 shadow-sm font-normal">
          {termsOfService.lead}
        </div>

        {/* Terms Sections */}
        <div className="space-y-8">
          {termsOfService.sections.map((sec) => (
            <div
              key={sec.id}
              id={sec.id}
              className="p-6 sm:p-8 rounded-2xl bg-white border border-slate-200 shadow-xs"
            >
              <h2 className="font-display font-bold text-xl text-slate-900 mb-4 flex items-center gap-2 border-b border-slate-100 pb-3">
                <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                {sec.title}
              </h2>

              {sec.content && (
                <p className="text-slate-700 text-sm leading-relaxed whitespace-pre-line font-normal">
                  {sec.content}
                </p>
              )}

              {sec.items && (
                <ul className="mt-4 space-y-2.5 text-xs sm:text-sm text-slate-700 font-normal">
                  {sec.items.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2.5">
                      <span className="text-amber-600 mt-1 font-bold">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>

        {/* Legal Contact Card */}
        <div className="mt-12 p-8 rounded-3xl bg-white border border-amber-200 shadow-md">
          <h3 className="font-display font-bold text-xl text-slate-900 mb-4 flex items-center gap-2 border-b border-slate-100 pb-3">
            <FileCheck size={20} className="text-amber-700" />
            Contact for Legal Questions
          </h3>

          <div className="grid sm:grid-cols-2 gap-6 text-xs sm:text-sm text-slate-700 mt-4 font-medium">
            <div>
              <p><strong className="text-slate-900 font-bold">Brand:</strong> {company.brand}</p>
              <p className="mt-1.5"><strong className="text-slate-900 font-bold">Legal Entity:</strong> {company.legalEntity}</p>
            </div>
            <div>
              <p className="flex items-start gap-2">
                <MapPin size={16} className="text-amber-700 shrink-0 mt-0.5" />
                <span>{company.communicationOffice}</span>
              </p>
              <p className="flex items-center gap-2 mt-2">
                <Mail size={16} className="text-amber-700 shrink-0" />
                <a href={`mailto:${company.email}`} className="text-amber-700 font-bold hover:underline">{company.email}</a>
              </p>
              <p className="flex items-center gap-2 mt-2">
                <Phone size={16} className="text-amber-700 shrink-0" />
                <a href={`tel:${company.phone}`} className="text-amber-700 font-bold hover:underline">{company.phone}</a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
