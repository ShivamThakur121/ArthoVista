import { Link } from "react-router-dom";
import { Phone, Sparkles, ArrowRight } from "lucide-react";
import { useConsultation } from "../context/ConsultationContext";

export default function PageHero({
  title,
  subtitle,
  eyebrow = "MSME & Startup Advisory",
  primaryLabel = "Free Consultation",
  secondaryLabel,
  secondaryTo,
}) {
  const { openConsultationModal } = useConsultation();

  return (
    <section className="relative overflow-hidden bg-slate-900 text-white py-14 md:py-20 border-b border-slate-800">
      {/* Background 3D subtle lighting */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-teal-500/10 blur-[100px] rounded-full pointer-events-none" />
      <div className="grid-bg opacity-20" />

      <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
        {eyebrow && (
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-teal-500/10 border border-teal-500/20 text-teal-400 text-xs font-semibold uppercase tracking-wider mb-5">
            <Sparkles size={13} className="text-amber-400" />
            {eyebrow}
          </div>
        )}
        <h1 className="font-display text-3xl md:text-5xl font-black tracking-tight text-white leading-tight">
          {title}
        </h1>
        {subtitle && (
          <p className="text-slate-300 text-sm md:text-base mt-4 max-w-2xl mx-auto leading-relaxed">
            {subtitle}
          </p>
        )}
        <div className="flex flex-wrap gap-4 justify-center mt-7">
          <button
            onClick={() => openConsultationModal(title || "General Consultation")}
            className="btn-3d inline-flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white font-bold text-sm px-6 py-3 rounded-xl transition-all cursor-pointer"
          >
            <Phone size={15} />
            <span>{primaryLabel}</span>
            <ArrowRight size={15} />
          </button>
          {secondaryLabel && (
            <Link
              to={secondaryTo}
              className="inline-flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 font-semibold text-sm px-6 py-3 rounded-xl transition-all"
            >
              {secondaryLabel}
            </Link>
          )}
        </div>
      </div>
    </section>
  );
}
