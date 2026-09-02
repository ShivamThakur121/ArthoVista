import {
  MapPin, Eye, Target, Award, Lightbulb, ShieldCheck,
  User, BarChart3, FileText, Phone, Mail, Clock,
  TrendingUp, Heart, HandCoins, Star, Building2
} from "lucide-react";
import { Link } from "react-router-dom";
import useDocumentMetadata from "../hooks/useDocumentMetadata";
import { useConsultation } from "../context/ConsultationContext";

const stats = [
  { value: "500+", label: "MSMEs Served" },
  { value: "₹50Cr+", label: "Funding Facilitated" },
  { value: "10+", label: "Years of Expertise" },
  { value: "28+", label: "States Covered" },
];

const highlights = [
  { icon: MapPin, title: "Pan-India Reach", desc: "24+ states served, headquartered in Noida — India's MSME capital.", color: "text-blue-600 bg-blue-50" },
  { icon: Award, title: "KVIC Empanelled", desc: "Officially empanelled with KVIC and MSME ministry for scheme facilitation.", color: "text-purple-600 bg-purple-50" },
  { icon: HandCoins, title: "PMEGP Facilitated", desc: "Consistently ranked one of India's top scheme grants and executions.", color: "text-green-600 bg-green-50" },
  { icon: Heart, title: "People First", desc: "We don't rest until you get your funding — our commission is literally growth.", color: "text-orange-600 bg-orange-50" },
];

const journey = [
  { year: "2018", title: "Founded in Noida", desc: "Started with expert consultants helping UP MSMEs navigate PMEGP and Udyam applications.", icon: Building2 },
  { year: "2019", title: "KVIC Empanelment", desc: "Became officially empanelled with KVIC to facilitate PMEGP subsidy schemes across India.", icon: Award },
  { year: "2021", title: "Pan-India Expansion", desc: "Expanded services to 24+ states, helping businesses access funding and government schemes.", icon: TrendingUp },
  { year: "2024", title: "₹50Cr+ Milestone", desc: "Surpassed ₹50 Crore in funding facilitated for MSMEs and startups across India.", icon: Star },
];

const values = [
  { icon: Eye, title: "Transparency", desc: "No hidden fees. Every step, cost and timeline is easy to implement and upfront." },
  { icon: Award, title: "Excellence", desc: "98% approval rate through short-listed work with a team that gets it right the first time." },
  { icon: ShieldCheck, title: "Integrity", desc: "We never promise what we can't deliver. If a scheme doesn't fit, we tell you upfront." },
  { icon: Lightbulb, title: "Innovation", desc: "Proprietary DPR drafting, digital filing systems, and real-time application tracking." },
];

const team = [
  { icon: User, role: "Founder & CEO", desc: "Leading the vision with 15+ years of experience in MSME consulting and government facilitation.", color: "from-orange-500 to-orange-700" },
  { icon: BarChart3, role: "Head of Operations", desc: "Ensuring smooth processing of all applications and direct coordination across India.", color: "from-blue-500 to-blue-700" },
  { icon: FileText, role: "DPR & Documentation Lead", desc: "Specialised in preparing Detailed Project Reports with 95% approval rate.", color: "from-purple-500 to-purple-700" },
];

export default function About() {
  const { openConsultationModal } = useConsultation();
  useDocumentMetadata(
    "About Us | ArthoVista",
    "Learn about ArthoVista — KVIC empanelled MSME consulting and government scheme facilitation specialists based in Noida."
  );
  return (
    <div>
      {/* ====== HERO ====== */}
      <section className="relative py-16 px-6 overflow-hidden border-b border-slate-200">
        <div className="relative z-10 max-w-6xl mx-auto text-center">
          <p className="text-teal-700 font-semibold text-xs tracking-widest uppercase mb-4">
            PMT 2024 · Noida · KVIC Empanelled · 360 Get Field · Pan India · MSME Working
          </p>
          <div className="eyebrow">Our Story</div>
          <h1
            className="font-display font-black text-slate-900 mt-2"
            style={{ fontSize: "clamp(30px, 5vw, 54px)" }}
          >
            About <span className="highlight">ArthoVista</span>
          </h1>
          <p className="text-slate-600 font-medium mt-3">
            Empowering Uttar Pradesh MSMEs and Startup Ecosystem from Noida
          </p>
          <div className="flex flex-wrap gap-3 justify-center mt-8">
            <button
              onClick={() => openConsultationModal("About Us Strategy Call")}
              className="btn-primary-3d cursor-pointer"
            >
              <Phone size={15} /> Free Consultation
            </button>
            <Link to="/services" className="btn-outline-3d">
              <Eye size={15} /> View Services
            </Link>
          </div>
        </div>
      </section>

      {/* ====== STATS BAR ====== */}
      <section className="stats-section">
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 divide-x divide-slate-200">
          {stats.map((s) => (
            <div key={s.label} className="stat-card">
              <div className="stat-value">{s.value}</div>
              <div className="stat-label">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ====== STORY SECTION ====== */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="eyebrow">Our Story</div>
              <h2 className="section-title mb-6">
                Democratizing <span className="highlight">Business Growth</span>
              </h2>
              <blockquote className="border-l-4 border-teal-600 pl-5 italic text-slate-800 mb-6 bg-white py-3 rounded-r-xl border border-slate-200 font-medium shadow-2xs">
                "Every entrepreneur deserves the same access to government support — regardless of their education or connections."
              </blockquote>
              <p className="text-slate-600 leading-relaxed font-normal text-base">
                ArthoVista was founded with a simple mission — to democratise access to government funding, and business support for India's millions of micro, small, and medium enterprises. Based in Noida, Uttar Pradesh, we bridge the gap between ambitious entrepreneurs and the complex world of government procedures, banking systems, and compliance requirements.
              </p>

              <div className="grid sm:grid-cols-2 gap-4 mt-8">
                {highlights.map((h) => (
                  <div key={h.title} className="bg-white rounded-xl p-4 flex gap-3 border border-slate-200 shadow-2xs">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${h.color}`}>
                      <h.icon size={18} />
                    </div>
                    <div>
                      <p className="font-bold text-slate-900 text-sm">{h.title}</p>
                      <p className="text-xs font-medium text-slate-600 mt-0.5">{h.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right side - Mission & Vision */}
            <div className="space-y-5">
              <div
                className="rounded-2xl p-7 text-white relative overflow-hidden border border-teal-600/30 shadow-md"
                style={{ background: "linear-gradient(135deg, #0d9488, #0f766e)" }}
              >
                <div className="absolute top-4 right-4 opacity-10">
                  <Target size={80} />
                </div>
                <Target size={28} className="text-teal-100 mb-4" />
                <h3 className="font-display font-bold text-xl text-white mb-3">Our Mission</h3>
                <p className="text-white/90 text-sm leading-relaxed font-medium">
                  An India where no entrepreneur is left behind due to lack of knowledge, resources, or access to government benefit. We envision 1 million businesses empowered by 2030.
                </p>
              </div>

              <div
                className="rounded-2xl p-7 text-white relative overflow-hidden border border-orange-500/40 shadow-md"
                style={{ background: "linear-gradient(135deg, #ea580c, #c2410c)" }}
              >
                <div className="absolute top-4 right-4 opacity-10">
                  <Eye size={80} />
                </div>
                <Eye size={28} className="text-white mb-4" />
                <h3 className="font-display font-bold text-xl text-white mb-3">Our Vision</h3>
                <p className="text-white text-sm leading-relaxed font-medium">
                  To be India's most trusted one-stop business support platform for MSMEs and startups — making growth accessible, affordable, and achievable for every entrepreneur.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ====== JOURNEY TIMELINE ====== */}
      <section className="py-16 px-6 border-t border-slate-200 bg-white/60">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <div className="eyebrow">Our Growth Story</div>
            <h2 className="section-title">Built Over a <span className="highlight">Decade</span></h2>
          </div>

          <div className="grid md:grid-cols-4 gap-6">
            {journey.map((j) => (
              <div key={j.year} className="journey-card relative overflow-hidden bg-white p-6 rounded-2xl border border-slate-200/90 shadow-xs hover:border-teal-500 transition-all">
                <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-teal-600 via-teal-500 to-amber-400" />
                <div className="w-12 h-12 rounded-xl bg-teal-50 border border-teal-200 flex items-center justify-center mb-4">
                  <j.icon size={24} className="text-teal-600" />
                </div>
                <span className="font-display font-black text-teal-700 text-3xl tracking-tight">{j.year}</span>
                <p className="font-bold text-slate-900 mt-2 mb-2 text-base">{j.title}</p>
                <p className="text-xs font-medium text-slate-600 leading-relaxed">{j.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ====== VALUES ====== */}
      <section className="py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <div className="eyebrow">Core Principles</div>
            <h2 className="section-title">What <span className="highlight">Drives Us</span></h2>
          </div>

          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-5">
            {values.map((v, idx) => (
              <div key={v.title} className="bg-white rounded-2xl p-6 text-center border border-slate-200 shadow-xs">
                <div className="w-14 h-14 rounded-2xl bg-teal-50 flex items-center justify-center mx-auto mb-4 border border-teal-200 shadow-2xs">
                  <v.icon size={24} className="text-teal-600" />
                </div>
                <span className="text-xs font-bold text-teal-700">0{idx + 1}</span>
                <p className="font-display font-bold text-slate-900 mt-2 text-base">{v.title}</p>
                <p className="text-xs font-medium text-slate-600 mt-2 leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ====== TEAM ====== */}
      <section className="py-16 px-6 border-t border-slate-200 bg-white/60">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <div className="eyebrow">The Team</div>
            <h2
              className="font-display font-black text-slate-900"
              style={{ fontSize: "clamp(26px, 4vw, 42px)" }}
            >
              Meet <span className="highlight">ArthoVista</span>
            </h2>
            <p className="text-slate-600 mt-3 font-medium text-base">The team behind your success</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {team.map((t) => (
              <div key={t.role} className={`bg-gradient-to-br ${t.color} rounded-2xl p-8 text-center relative overflow-hidden shadow-md text-white`}>
                <div className="absolute top-0 right-0 opacity-10">
                  <t.icon size={100} />
                </div>
                <div className="w-20 h-20 rounded-2xl bg-white/20 flex items-center justify-center mx-auto mb-5 shadow-xs">
                  <t.icon size={32} className="text-white" />
                </div>
                <p className="font-display font-bold text-white text-xl">{t.role}</p>
                <p className="text-white/90 font-medium text-sm mt-3 leading-relaxed">{t.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ====== CONTACT INFO + CTA ====== */}
      <section className="py-16 px-6 border-t border-slate-200">
        <div className="max-w-6xl mx-auto">
          <div
            className="rounded-2xl p-8 md:p-12 text-center text-white relative overflow-hidden border border-teal-600/40 shadow-xl"
            style={{ background: "linear-gradient(135deg, #0f766e, #0d9488)" }}
          >
            <div className="relative z-10">
              <h3
                className="font-display font-black text-white"
                style={{ fontSize: "clamp(24px, 4vw, 40px)" }}
              >
                Let's Grow Together
              </h3>
              <p className="text-white/95 mt-3 max-w-lg mx-auto text-base font-medium">
                Join 500+ businesses that chose ArthoVista as their growth partner. Book a free consultation today.
              </p>
              <div className="flex flex-wrap gap-3 justify-center mt-7">
                <button
                  onClick={() => openConsultationModal("About Us Consultation")}
                  className="bg-white text-teal-900 font-bold px-8 py-3.5 rounded-xl hover:bg-slate-100 transition-all inline-flex items-center gap-2 shadow-md cursor-pointer"
                >
                  <Phone size={15} /> Book Free Consultation
                </button>
                <Link to="/services" className="bg-white/20 hover:bg-white/30 text-white font-bold px-7 py-3.5 rounded-xl transition-all border border-white/30">
                  <Eye size={15} /> View Services
                </Link>
              </div>
              <p className="text-white font-bold text-xs mt-5">★★★★★ 500+ businesses served</p>
            </div>
          </div>

          {/* Contact Details */}
          <div className="flex flex-wrap justify-center gap-8 mt-12 text-sm text-slate-700 font-medium">
            <a href="tel:+919899902568" className="flex items-center gap-2 hover:text-teal-600 transition-colors">
              <Phone size={16} className="text-teal-600" /> +91 98999 02568
            </a>
            <a href="mailto:support@arthovista.com" className="flex items-center gap-2 hover:text-teal-600 transition-colors">
              <Mail size={16} className="text-teal-600" /> support@arthovista.com
            </a>
            <span className="flex items-center gap-2">
              <MapPin size={16} className="text-teal-600" /> Noida, Uttar Pradesh
            </span>
            <span className="flex items-center gap-2">
              <Clock size={16} className="text-teal-600" /> Mon-Sat, 9:30 AM - 6:00 PM
            </span>
          </div>
        </div>
      </section>
    </div>
  );
}
