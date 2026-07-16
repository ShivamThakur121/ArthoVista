import { Link } from "react-router-dom";
import { Phone } from "lucide-react";

export default function PageHero({ title, subtitle, primaryLabel = "Free Consultation", primaryTo = "/contact", secondaryLabel, secondaryTo }) {
  return (
    <section className="bg-cream">
      <div className="max-w-5xl mx-auto px-6 md:px-8 py-16 md:py-20 text-center">
        <h1 className="font-display text-3xl md:text-5xl font-bold text-navy">{title}</h1>
        {subtitle && <p className="text-slate-600 mt-4 max-w-2xl mx-auto">{subtitle}</p>}
        <div className="flex flex-wrap gap-3 justify-center mt-7">
          <Link to={primaryTo} className="btn-primary">
            <Phone size={16} /> {primaryLabel}
          </Link>
          {secondaryLabel && (
            <Link to={secondaryTo} className="btn-outline">
              {secondaryLabel}
            </Link>
          )}
        </div>
      </div>
    </section>
  );
}
