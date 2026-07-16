import { Link } from "react-router-dom";
import { Phone, ArrowRight } from "lucide-react";

export default function StickyBar() {
  return (
    <div className="sticky-bar flex justify-around">
      <div className="flex items-center gap-3 overflow-hidden">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-orange-500" />
          </span>
          <span className="text-white/70 text-xs font-inter hidden sm:block">
            Expert advisors available · Mon–Sat 9:30AM–6PM
          </span>
        </div>
      </div>

      <div className="flex items-center gap-3 shrink-0">
        <a
          href="tel:+918888802588"
          className="hidden sm:flex items-center gap-1.5 text-white/60 hover:text-white text-xs font-inter transition-colors"
        >
          <Phone size={13} className="text-orange-500" />
          +91 88888 02588
        </a>
      </div>
      <div className="flex items-center gap-3 shrink-0">
        <Link to="/" className="sticky-consult-btn">
          <Phone size={13} />
          Free Consultation
          <ArrowRight size={13} />
        </Link>
      </div>

    </div>
  );
}
