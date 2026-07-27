import {
  MapPin, Eye, Target, ShieldCheck, Award, Scale, Lightbulb,
  User, BarChart3, FileText, Phone, Mail, Clock, ArrowRight,
  TrendingUp, Heart, HandCoins, Star, CheckCircle, Building2
} from "lucide-react";
import { Link } from "react-router-dom";
import useDocumentMetadata from "../hooks/useDocumentMetadata";

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
  useDocumentMetadata(
    "About Us | Artha Ventures",
    "Learn about Artha Ventures (ArthoVista) — KVIC empanelled MSME consulting and government scheme facilitation specialists based in Noida."
  );
  return (
    <div>
      {/* ====== HERO ====== */}
      <section className="hero-dark relative py-16 px-6 overflow-hidden">
        <div className="grid-bg" />
        <div className="relative z-10 max-w-6xl mx-auto text-center">
          <p className="text-orange-400/80 font-semibold text-xs tracking-widest uppercase mb-4">
            PMT 2024 · Noida · KVIC Empanelled · 360 Get Field · Pan India · MSME Working
          </p>
          <div className="eyebrow text-white/60">Our Story</div>
          <h1
            className="font-display font-black text-white mt-2"
            style={{ fontSize: "clamp(30px, 5vw, 54px)" }}
          >
            About <span className="gradient-text">ArthoVista</span>
          </h1>
          <p className="text-orange-400 font-medium mt-3">
            Empowering Uttar Pradesh MSMEs and Startup Ecosystem from Noida
          </p>
          <div className="flex flex-wrap gap-3 justify-center mt-8">
            <Link to="/" className="btn-primary-3d">
              <Phone size={15} /> Free Consultation
            </Link>
            <Link to="/services" className="btn-outline-white-3d">
              <Eye size={15} /> View Services
            </Link>
          </div>
        </div>
      </section>

      {/* ====== STATS BAR ====== */}
      <section className="stats-section">
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 divide-x divide-white/10">
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
              <blockquote className="border-l-4 border-orange-500 pl-5 italic text-slate-600 mb-6 bg-orange-50/50 py-3 rounded-r-xl">
                "Every entrepreneur deserves the same access to government support — regardless of their education or connections."
              </blockquote>
              <p className="text-slate-600 leading-relaxed">
                ArthoVista was founded with a simple mission — to democratise access to government funding, and business support for India's millions of micro, small, and medium enterprises. Based in Noida, Uttar Pradesh, we bridge the gap between ambitious entrepreneurs and the complex world of government procedures, banking systems, and compliance requirements.
              </p>

              <div className="grid sm:grid-cols-2 gap-4 mt-8">
                {highlights.map((h) => (
                  <div key={h.title} className="glass-card rounded-xl p-4 flex gap-3 card-3d">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${h.color}`}>
                      <h.icon size={18} />
                    </div>
                    <div>
                      <p className="font-semibold text-navy text-sm">{h.title}</p>
                      <p className="text-xs text-slate-500 mt-0.5">{h.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right side - Mission & Vision */}
            <div className="space-y-5">
              <div
                className="rounded-2xl p-7 text-white relative overflow-hidden"
                style={{ background: "linear-gradient(135deg, #0a1628, #1a3060)" }}
              >
                <div className="absolute top-4 right-4 opacity-10">
                  <Target size={80} />
                </div>
                <Target size={28} className="text-orange-400 mb-4" />
                <h3 className="font-display font-bold text-xl text-white mb-3">Our Mission</h3>
                <p className="text-white/60 text-sm leading-relaxed">
                  An India where no entrepreneur is left behind due to lack of knowledge, resources, or access to government benefit. We envision 1 million businesses empowered by 2030.
                </p>
              </div>

              <div
                className="rounded-2xl p-7 text-white relative overflow-hidden"
                style={{ background: "linear-gradient(135deg, #ea580c, #c2410c)" }}
              >
                <div className="absolute top-4 right-4 opacity-10">
                  <Eye size={80} />
                </div>
                <Eye size={28} className="text-white/80 mb-4" />
                <h3 className="font-display font-bold text-xl text-white mb-3">Our Vision</h3>
                <p className="text-white/80 text-sm leading-relaxed">
                  To be India's most trusted one-stop business support platform for MSMEs and startups — making growth accessible, affordable, and achievable for every entrepreneur.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ====== JOURNEY TIMELINE ====== */}
      <section className="py-16 px-6" style={{ background: "linear-gradient(135deg, #f8f9fc 0%, #fdf3ec 100%)" }}>
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <div className="eyebrow">Our Growth Story</div>
            <h2 className="section-title">Built Over a <span className="highlight">Decade</span></h2>
          </div>

          <div className="grid md:grid-cols-4 gap-6">
            {journey.map((j, i) => (
              <div key={j.year} className="journey-card relative overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-orange-500 to-amber-400" />
                <j.icon size={28} className="text-orange-500 mb-4" />
                <span className="font-display font-black text-orange-600 text-2xl">{j.year}</span>
                <p className="font-semibold text-navy mt-2 mb-2">{j.title}</p>
                <p className="text-xs text-slate-500 leading-relaxed">{j.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ====== VALUES ====== */}
      <section className="py-16 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <div className="eyebrow">Core Principles</div>
            <h2 className="section-title">What <span className="highlight">Drives Us</span></h2>
          </div>

          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-5">
            {values.map((v, idx) => (
              <div key={v.title} className="glass-card rounded-2xl p-6 card-3d text-center">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-orange-100 to-orange-50 flex items-center justify-center mx-auto mb-4">
                  <v.icon size={24} className="text-orange-600" />
                </div>
                <span className="text-xs font-bold text-orange-400">0{idx + 1}</span>
                <p className="font-display font-bold text-navy mt-2">{v.title}</p>
                <p className="text-xs text-slate-500 mt-2 leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ====== TEAM ====== */}
      <section className="py-16 px-6" style={{ background: "linear-gradient(135deg, #0a1628 0%, #0f1e3a 100%)" }}>
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <div className="eyebrow text-white/50">The Team</div>
            <h2
              className="font-display font-black text-white"
              style={{ fontSize: "clamp(26px, 4vw, 42px)" }}
            >
              Meet <span className="gradient-text">ArthoVista</span>
            </h2>
            <p className="text-white/40 mt-3">The team behind your success</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {team.map((t) => (
              <div key={t.role} className={`bg-gradient-to-br ${t.color} rounded-2xl p-8 text-center relative overflow-hidden card-3d`}>
                <div className="absolute top-0 right-0 opacity-10">
                  <t.icon size={100} />
                </div>
                <div className="w-20 h-20 rounded-2xl bg-white/20 flex items-center justify-center mx-auto mb-5">
                  <t.icon size={32} className="text-white" />
                </div>
                <p className="font-display font-bold text-white text-lg">{t.role}</p>
                <p className="text-white/70 text-sm mt-3 leading-relaxed">{t.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ====== CONTACT INFO + CTA ====== */}
      <section className="py-16 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <div
            className="rounded-2xl p-8 md:p-12 text-center text-white relative overflow-hidden"
            style={{ background: "linear-gradient(135deg, #ea580c, #c2410c)" }}
          >
            <div className="absolute inset-0 opacity-10 bg-repeat" style={{ backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)", backgroundSize: "30px 30px" }} />
            <div className="relative z-10">
              <h3
                className="font-display font-black"
                style={{ fontSize: "clamp(24px, 4vw, 40px)" }}
              >
                Let's Grow Together
              </h3>
              <p className="text-orange-100 mt-3 max-w-lg mx-auto text-sm">
                Join 500+ businesses that chose ArthoVista as their growth partner. Book a free consultation today.
              </p>
              <div className="flex flex-wrap gap-3 justify-center mt-7">
                <Link to="/contact" className="bg-white text-orange-600 font-bold px-8 py-3.5 rounded-xl hover:bg-orange-50 transition-all hover:scale-105 inline-flex items-center gap-2">
                  <Phone size={15} /> Book Free Consultation
                </Link>
                <Link to="/services" className="btn-outline-white-3d">
                  <Eye size={15} /> View Services
                </Link>
              </div>
              <p className="text-orange-100/60 text-xs mt-5">★★★★★ 500+ businesses served</p>
            </div>
          </div>

          {/* Contact Details */}
          <div className="flex flex-wrap justify-center gap-8 mt-12 text-sm text-slate-500">
            <a href="tel:+919899902568" className="flex items-center gap-2 hover:text-orange-600 transition-colors">
              <Phone size={16} className="text-orange-600" /> +91 98999 02568
            </a>
            <a href="mailto:support@arthovista.com" className="flex items-center gap-2 hover:text-orange-600 transition-colors">
              <Mail size={16} className="text-orange-600" /> support@arthovista.com
            </a>
            <span className="flex items-center gap-2">
              <MapPin size={16} className="text-orange-600" /> Noida, Uttar Pradesh
            </span>
            <span className="flex items-center gap-2">
              <Clock size={16} className="text-orange-600" /> Mon-Sat, 9:30 AM - 6:00 PM
            </span>
          </div>
        </div>
      </section>
    </div>
  );
}
