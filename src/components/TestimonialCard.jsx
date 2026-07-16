import { Star } from "lucide-react";

export default function TestimonialCard({ quote, name, role }) {
  return (
    <div className="bg-white rounded-xl p-6 card-shadow border border-slate-100 text-left">
      <div className="flex gap-1 text-orange-500 mb-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star key={i} size={16} fill="currentColor" strokeWidth={0} />
        ))}
      </div>
      <p className="text-sm text-slate-600 leading-relaxed">"{quote}"</p>
      <div className="flex items-center gap-3 mt-5">
        <div className="w-9 h-9 rounded-full bg-navy/10 flex items-center justify-center text-navy font-semibold text-sm">
          {name.charAt(0)}
        </div>
        <div>
          <div className="text-sm font-semibold text-navy">{name}</div>
          <div className="text-xs text-slate-500">{role}</div>
        </div>
      </div>
    </div>
  );
}
