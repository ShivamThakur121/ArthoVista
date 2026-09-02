import { Phone, ArrowRight, ShieldCheck } from "lucide-react";
import { useConsultation } from "../context/ConsultationContext";

export default function StickyBar() {
  const { openConsultationModal } = useConsultation();

  return (
    <div className="bg-white text-slate-700 px-4 sm:px-6 py-2 flex justify-between items-center text-xs border-b border-slate-200 shadow-2xs">
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
          </span>
          <span className="text-slate-600 font-medium hidden sm:inline-flex items-center gap-1.5">
            <ShieldCheck size={13} className="text-amber-500" />
            Official MSME Consultation Hub · Live Support (Mon–Sat 9:30 AM–6:00 PM)
          </span>
        </div>
      </div>

      <a
        href="tel:+919899902568"
        className="hidden md:flex items-center gap-1.5 text-slate-600 hover:text-primary-600 font-semibold transition-colors"
      >
        <Phone size={12} className="text-primary-600" />
        +91 98999 02568
      </a>

      <div className="flex items-center gap-4 shrink-0">
        <button
          onClick={() => openConsultationModal("General Consultation")}
          className="btn-3d inline-flex items-center gap-1.5 bg-gradient-to-r from-green-500 via-blue-500 to-green-500 hover:opacity-95 text-white font-bold text-[11px] px-3.5 py-1.5 rounded-lg transition-all cursor-pointer shadow-xs"
        >
          <span>Free Consultation</span>
          <ArrowRight size={12} />
        </button>
      </div>
    </div>
  );
}
