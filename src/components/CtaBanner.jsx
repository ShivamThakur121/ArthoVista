import { Link } from "react-router-dom";
import { ArrowRight, Phone } from "lucide-react";
import { useConsultation } from "../context/ConsultationContext";

export default function CtaBanner({
  title = "Ready to Grow Your Business?",
  subtitle = "Book a free consultation with our experts. Get a tailored roadmap for your business growth.",
  primaryLabel = "Get Free Consultation",
  primaryTo = "/contact",
  showPhone = true,
}) {
  const { openConsultationModal } = useConsultation();

  return (
    <section className="max-w-7xl mx-auto px-6 md:px-8 my-16">
      <div className="bg-gradient-to-r from-green-500 via-blue-500 to-green-500 rounded-3xl px-8 py-12 md:py-16 text-center border border-white/20 shadow-xl text-white">
        <h3 className="font-display text-white text-2xl md:text-4xl font-bold">{title}</h3>
        <p className="text-white/90 mt-3 max-w-xl mx-auto font-medium">{subtitle}</p>
        <div className="flex flex-wrap gap-3 justify-center mt-7">
          <button
            onClick={() => openConsultationModal(title)}
            className="bg-white text-slate-900 font-bold px-7 py-3.5 rounded-xl hover:bg-slate-100 transition-all inline-flex items-center gap-2 shadow-md cursor-pointer"
          >
            {primaryLabel} <ArrowRight size={16} />
          </button>
          {showPhone && (
            <a href="tel:+919899902568" className="bg-white/15 hover:bg-white/25 text-white font-bold px-6 py-3.5 rounded-xl transition-all border border-white/20 inline-flex items-center gap-2">
              <Phone size={16} /> +91 98999 02568
            </a>
          )}
        </div>
      </div>
    </section>
  );
}