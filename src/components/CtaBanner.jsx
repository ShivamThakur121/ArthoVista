import { Link } from "react-router-dom";
import { ArrowRight, Phone } from "lucide-react";

export default function CtaBanner({
  title = "Ready to Grow Your Business?",
  subtitle = "Book a free consultation with our experts. Get a tailored roadmap for your business growth.",
  primaryLabel = "Get Free Consultation",
  primaryTo = "/contact",
  showPhone = true,
}) {
  return (
    <section className="max-w-7xl mx-auto px-6 md:px-8 my-16">
      <div className="bg-orange-600 rounded-2xl px-8 py-12 md:py-16 text-center">
        <h3 className="font-display text-white text-2xl md:text-4xl font-bold">{title}</h3>
        <p className="text-orange-50 mt-3 max-w-xl mx-auto">{subtitle}</p>
        <div className="flex flex-wrap gap-3 justify-center mt-7">
          <Link to={primaryTo} className="bg-white text-orange-600 font-semibold px-6 py-3 rounded-md hover:bg-orange-50 transition-colors inline-flex items-center gap-2">
            {primaryLabel} <ArrowRight size={16} />
          </Link>
          {showPhone && (
            <a href="tel:+919899902568" className="btn-outline-white">
              <Phone size={16} /> +91 98999 02568
            </a>
          )}
        </div>
      </div>
    </section>
  );
}