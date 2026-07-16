import { Link } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import {
  Building2, Rocket, HeartHandshake, FileCheck2, Landmark,
  Percent, ArrowRight, Phone, Star, CheckCircle, TrendingUp,
  Shield, Award, Users
} from "lucide-react";

/* ---------- DATA ---------- */
const stats = [
  { value: "500+", label: "Businesses Served", icon: Users },
  { value: "₹50Cr+", label: "Funding Facilitated", icon: TrendingUp },
  { value: "98%", label: "Success Rate", icon: Award },
  { value: "6+", label: "Years Legacy", icon: Shield },
];

const segments = [
  {
    icon: Building2,
    title: "For Corporates",
    subtitle: "1000+ Employees / ₹250Cr+ Turnover",
    color: "from-blue-600 to-blue-800",
    items: ["Corporate Compliance & GST", "Company Registration (ROC)", "Fundraising & Investor Readiness", "DPR & Pitch Deck Creation"],
  },
  {
    icon: Rocket,
    title: "For Startups & MSMEs",
    subtitle: "Ideation to Growth Stage",
    color: "from-orange-500 to-orange-700",
    items: ["Business Registration & Setup", "Government Schemes & Subsidies", "MSME Loans & Funding", "Certifications (ISO, FSSAI, etc.)"],
  },
  {
    icon: HeartHandshake,
    title: "For NGOs / Trusts",
    subtitle: "Charitable, SHGs, Trusts",
    color: "from-purple-600 to-purple-800",
    items: ["NGO Registration (Trust/Society/Sec 8)", "FCRA Registration & Compliance", "Government Grants for NGOs", "80G & 12A Certification"],
  },
];

const quickLinks = [
  { icon: FileCheck2, title: "Business Registration", desc: "Start smart — from OPC, LLP to full company setup", to: "/services", color: "bg-blue-50 text-blue-600" },
  { icon: Landmark, title: "Government Schemes", desc: "MSME, PMEGP, Mudra Loan & every scheme you qualify for", to: "/government-schemes", color: "bg-orange-50 text-orange-600" },
  { icon: Percent, title: "GST & Tax", desc: "Compliance, filing, and advisory for businesses of all sizes", to: "/services", color: "bg-green-50 text-green-600" },
];

const testimonials = [
  { quote: "Artha Ventures helped us secure MSME funding through PMEGP scheme. Their team was very professional and guided us at every step.", name: "Ramesh Patel", role: "Founder, Digital Fresh", rating: 5 },
  { quote: "Their expertise in company registration and compliance saved us months of effort. Highly recommended for every entrepreneur.", name: "Priya Mehta", role: "Co-Founder, TechBridge", rating: 5 },
  { quote: "Got our NGO registered and 80G certification done within weeks. Their team was very responsive and knowledgeable.", name: "Amit Sharma", role: "Trustee, Asha Foundation", rating: 5 },
];

/* ---------- COUNTER HOOK ---------- */
function useCountUp(target, duration = 2000) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          let start = 0;
          const num = parseInt(target.replace(/\D/g, "")) || 0;
          if (!num) { setCount(target); return; }
          const step = num / (duration / 16);
          const timer = setInterval(() => {
            start += step;
            if (start >= num) {
              setCount(target);
              clearInterval(timer);
            } else {
              const prefix = target.replace(/[\d.]+/, "");
              setCount(Math.floor(start) + (prefix.includes("+") ? "" : ""));
            }
          }, 16);
          observer.disconnect();
        }
      },
      { threshold: 0.5 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target, duration]);

  return { count, ref };
}

/* ---------- STAT CARD ---------- */
function StatCard({ value, label, icon: Icon, delay }) {
  const { count, ref } = useCountUp(value);
  return (
    <div
      ref={ref}
      className="stat-card"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="flex justify-center mb-3">
        <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center">
          <Icon size={22} className="text-orange-400" />
        </div>
      </div>
      <div className="stat-value">{count || value}</div>
      <div className="stat-label">{label}</div>
    </div>
  );
}

/* ---------- TESTIMONIAL CARD ---------- */
function TestCard({ quote, name, role, rating }) {
  return (
    <div className="glass-card rounded-2xl p-6 card-3d">
      <div className="flex gap-0.5 mb-4">
        {Array.from({ length: rating }).map((_, i) => (
          <Star key={i} size={14} className="text-amber-400 fill-amber-400" />
        ))}
      </div>
      <p className="text-slate-600 text-sm leading-relaxed mb-5">"{quote}"</p>
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white font-bold text-sm">
          {name[0]}
        </div>
        <div>
          <p className="font-semibold text-navy text-sm">{name}</p>
          <p className="text-xs text-slate-500">{role}</p>
        </div>
      </div>
    </div>
  );
}

/* ---------- HERO PARTICLES ---------- */
function HeroParticles() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {Array.from({ length: 20 }).map((_, i) => (
        <div
          key={i}
          className="particle"
          style={{
            left: `${Math.random() * 100}%`,
            animationDuration: `${6 + Math.random() * 10}s`,
            animationDelay: `${Math.random() * 8}s`,
            width: `${2 + Math.random() * 4}px`,
            height: `${2 + Math.random() * 4}px`,
            opacity: Math.random() * 0.6 + 0.2,
          }}
        />
      ))}
    </div>
  );
}

/* ---------- MAIN HOME ---------- */
export default function Home() {
  const [formData, setFormData] = useState({ name: "", phone: "", email: "", service: "" });
  const [status, setStatus] = useState("idle"); // idle | loading | success | error
  const [errMsg, setErrMsg] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("loading");
    setErrMsg("");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          phone: formData.phone,
          email: formData.email,
          service: formData.service || "General Consultation",
          source: "website-home-hero",
        }),
      });
      const data = await res.json();
      if (data.success) {
        setStatus("success");
      } else {
        setErrMsg(data.message || "Something went wrong.");
        setStatus("error");
      }
    } catch {
      setErrMsg("Network error. Please try again.");
      setStatus("error");
    }
  };

  return (
    <div>
      {/* ====== HERO SECTION ====== */}
      <section className="hero-dark relative min-h-[90vh] flex items-center">
        <div className="grid-bg" />
        <HeroParticles />

        {/* Orbit decorations */}
        <div className="orbit-ring absolute" style={{ width: 300, height: 300, top: "10%", right: "5%", animationDuration: "20s" }} />
        <div className="orbit-ring absolute" style={{ width: 200, height: 200, top: "20%", right: "12%", opacity: 0.5 }} />

        <div className="relative z-10 w-full max-w-6xl mx-auto px-6 md:px-10 py-16 grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="animate-slide-left">
            <span className="badge-orange mb-6 inline-block">
              Trusted by 500+ Businesses Across India
            </span>
            <h1
              className="font-display font-black text-white leading-tight"
              style={{ fontSize: "clamp(34px, 5vw, 58px)" }}
            >
              Grow Your{" "}
              <span className="gradient-text relative">
                Business Wings
                <svg className="absolute -bottom-2 left-0 w-full" height="4" viewBox="0 0 200 4">
                  <path d="M0 2 Q50 0 100 2 Q150 4 200 2" stroke="#f2711c" strokeWidth="2" fill="none" strokeLinecap="round" />
                </svg>
              </span>
              <br />with Artha Ventures
            </h1>
            <p className="text-white/60 mt-6 text-base leading-relaxed max-w-lg">
              End-to-end support for MSMEs and startups — from registration and certifications to government funding and digital growth.
            </p>

            {/* Badges */}
            <div className="flex flex-wrap gap-6 mt-8">
              {[
                { val: "500+", lab: "Clients" },
                { val: "₹50Cr+", lab: "Funded" },
                { val: "98%", lab: "Success" },
              ].map((b) => (
                <div key={b.lab} className="text-center">
                  <div className="text-2xl font-display font-black gradient-text">{b.val}</div>
                  <div className="text-xs text-white/40 mt-0.5">{b.lab}</div>
                </div>
              ))}
            </div>

            <div className="flex flex-wrap gap-3 mt-8">
              <Link to="/contact" className="btn-primary-3d">
                <Phone size={15} />
                Free Consultation
                <ArrowRight size={15} />
              </Link>
              <Link to="/services" className="btn-outline-white-3d">
                Explore Services
              </Link>
            </div>

            {/* Trust badges */}
            <div className="flex flex-wrap gap-4 mt-8">
              {["KVIC Empanelled", "MSME Certified", "Startup India Partner"].map((b) => (
                <span key={b} className="flex items-center gap-1.5 text-xs text-white/50">
                  <CheckCircle size={12} className="text-green-400" />
                  {b}
                </span>
              ))}
            </div>
          </div>

          {/* Right — Lead Form */}
          <div className="animate-slide-right lg:animate-scale-in">
            <div
              className="glass-card-dark rounded-2xl p-7 md:p-8 relative overflow-hidden"
              style={{ boxShadow: "0 30px 80px rgba(0,0,0,0.4), 0 0 0 1px rgba(242,113,28,0.15)" }}
            >
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-orange-500 via-amber-400 to-orange-600" />
              <h2 className="font-display font-bold text-white text-xl mb-1">
                Get Free Business Assessment
              </h2>
              <p className="text-white/50 text-sm mb-6">
                Our expert will call you within 24 hours.
              </p>

              {status === "success" ? (
                <div className="py-10 text-center">
                  <CheckCircle size={48} className="text-green-400 mx-auto mb-4" />
                  <p className="text-white font-semibold text-lg">Consultation Requested!</p>
                  <p className="text-white/50 text-sm mt-2">Thank you! Our expert will call you within 24 hours.</p>
                </div>
              ) : (
                <form className="space-y-4" onSubmit={handleSubmit}>
                  <input
                    type="text"
                    placeholder="Full Name"
                    required
                    className="input-3d"
                    style={{ background: "rgba(255,255,255,0.06)", color: "white", borderColor: "rgba(255,255,255,0.1)" }}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                  <input
                    type="tel"
                    placeholder="Phone Number"
                    required
                    className="input-3d"
                    style={{ background: "rgba(255,255,255,0.06)", color: "white", borderColor: "rgba(255,255,255,0.1)" }}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  />
                  <input
                    type="email"
                    placeholder="Email Address"
                    className="input-3d"
                    style={{ background: "rgba(255,255,255,0.06)", color: "white", borderColor: "rgba(255,255,255,0.1)" }}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                  <select
                    className="input-3d"
                    style={{ background: "#10214a", color: "rgba(255,255,255,0.8)", borderColor: "rgba(255,255,255,0.1)" }}
                    onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                    required
                  >
                    <option value="" style={{ background: "#10214a" }}>Select Service</option>
                    <option style={{ background: "#10214a" }}>Business Registration</option>
                    <option style={{ background: "#10214a" }}>Government Schemes</option>
                    <option style={{ background: "#10214a" }}>Loan Products</option>
                    <option style={{ background: "#10214a" }}>Certifications</option>
                    <option style={{ background: "#10214a" }}>GST & Tax</option>
                    <option style={{ background: "#10214a" }}>NGO Services</option>
                    <option style={{ background: "#10214a" }}>Digital Marketing</option>
                    <option style={{ background: "#10214a" }}>DPR & Pitch Deck</option>
                  </select>

                  {status === "error" && (
                    <p className="text-red-400 text-xs bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">
                      {errMsg}
                    </p>
                  )}

                  <button
                    type="submit"
                    disabled={status === "loading"}
                    className="btn-primary-3d w-full justify-center disabled:opacity-70"
                  >
                    {status === "loading" ? "Booking..." : "Book Free Consultation"}
                    <ArrowRight size={15} />
                  </button>
                  <p className="text-center text-xs text-white/30">
                    No hidden fees · 100% Confidential
                  </p>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ====== STATS SECTION ====== */}
      <section className="stats-section">
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 divide-x divide-white/10">
          {stats.map((s, i) => (
            <StatCard key={s.label} {...s} delay={i * 100} />
          ))}
        </div>
      </section>

      {/* ====== WE SERVE SECTION ====== */}
      <section className="py-20 px-6 max-w-6xl mx-auto">
        <div className="text-center mb-14">
          <div className="eyebrow">Solutions for Every Business</div>
          <h2 className="section-title">
            We Serve <span className="highlight">Every Business</span>
          </h2>
          <p className="text-slate-500 mt-3 max-w-xl mx-auto">
            Tailored solutions for businesses of all sizes and types.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {segments.map((s, i) => (
            <div
              key={s.title}
              className="service-block rounded-2xl overflow-hidden glass-card perspective-wrapper"
              style={{ animationDelay: `${i * 150}ms` }}
            >
              <div className={`bg-gradient-to-br ${s.color} p-6`}>
                <div className="w-12 h-12 rounded-xl bg-white/15 flex items-center justify-center mb-4">
                  <s.icon size={22} className="text-white" />
                </div>
                <h3 className="font-display font-bold text-white text-xl">{s.title}</h3>
                <p className="text-white/60 text-xs mt-1">{s.subtitle}</p>
              </div>
              <div className="p-6">
                <ul className="space-y-3">
                  {s.items.map((item) => (
                    <li key={item} className="flex items-start gap-2 text-sm text-slate-600">
                      <CheckCircle size={14} className="text-orange-500 mt-0.5 shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
                <Link
                  to="/services"
                  className="mt-6 inline-flex items-center gap-1 text-orange-600 font-semibold text-sm hover:gap-3 transition-all"
                >
                  Learn More <ArrowRight size={14} />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ====== QUICK LINKS SECTION ====== */}
      <section className="py-16 bg-gradient-to-br from-slate-50 to-orange-50/30">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <div className="eyebrow">Quick Access</div>
            <h2 className="section-title">Popular <span className="highlight">Services</span></h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {quickLinks.map((q) => (
              <Link
                key={q.title}
                to={q.to}
                className="glass-card rounded-2xl p-6 card-3d group"
              >
                <div className={`w-12 h-12 rounded-xl ${q.color} bg-opacity-10 flex items-center justify-center mb-4`}>
                  <q.icon size={22} />
                </div>
                <h4 className="font-display font-bold text-navy text-lg mb-2">{q.title}</h4>
                <p className="text-slate-500 text-sm leading-relaxed">{q.desc}</p>
                <div className="mt-4 flex items-center gap-1 text-orange-600 font-semibold text-sm opacity-0 group-hover:opacity-100 transition-opacity">
                  Get Started <ArrowRight size={13} />
                </div>
              </Link>
            ))}

            {/* CTA Card */}
            <div
              className="rounded-2xl p-6 text-white flex flex-col justify-between card-3d"
              style={{ background: "linear-gradient(135deg, #0a1628 0%, #1a3060 100%)", boxShadow: "0 20px 50px rgba(10,22,40,0.3)" }}
            >
              <div>
                <div className="w-12 h-12 rounded-xl bg-orange-500/20 flex items-center justify-center mb-4">
                  <Phone size={22} className="text-orange-400" />
                </div>
                <h4 className="font-display font-bold text-xl mb-2">Free 30-min Consultation</h4>
                <p className="text-white/50 text-sm">No commitment. No hidden fees. Just expert guidance.</p>
              </div>
              <Link to="/contact" className="btn-primary-3d mt-6 justify-center">
                Book Now <ArrowRight size={15} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ====== WHY ARTHA SECTION ====== */}
      <section className="py-20 px-6 max-w-6xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="eyebrow">Why Choose Us</div>
            <h2 className="section-title">
              India's Most <span className="highlight">Trusted</span>
              <br />MSME Advisor
            </h2>
            <p className="text-slate-500 mt-4 leading-relaxed">
              We combine deep regulatory expertise with a proven track record — helping businesses unlock funding, stay compliant, and scale fast.
            </p>
            <div className="grid sm:grid-cols-2 gap-4 mt-8">
              {[
                { icon: Shield, title: "100% Transparent", desc: "No hidden charges. Clear timelines and pricing." },
                { icon: Award, title: "KVIC Empanelled", desc: "Officially recognized for scheme facilitation." },
                { icon: TrendingUp, title: "₹50Cr+ Facilitated", desc: "Consistent track record of securing funding." },
                { icon: Users, title: "500+ Happy Clients", desc: "Businesses across 24+ states trust us." },
              ].map((f) => (
                <div key={f.title} className="glass-card rounded-xl p-4 flex gap-3 card-3d">
                  <div className="w-10 h-10 rounded-lg bg-orange-50 flex items-center justify-center shrink-0">
                    <f.icon size={18} className="text-orange-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-navy text-sm">{f.title}</p>
                    <p className="text-slate-500 text-xs mt-0.5">{f.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Visual */}
          <div className="relative hidden lg:block">
            <div
              className="rounded-2xl p-8 text-white text-center animate-breathe"
              style={{ background: "linear-gradient(135deg, #0a1628 0%, #1a3060 100%)", boxShadow: "0 30px 80px rgba(10,22,40,0.25)" }}
            >
              <div className="text-6xl font-display font-black gradient-text">98%</div>
              <p className="text-white/60 mt-2">Application Success Rate</p>
              <div className="mt-6 grid grid-cols-3 gap-3">
                {["₹50Cr+ Funded", "500+ Clients", "6+ Years"].map((t) => (
                  <div key={t} className="bg-white/10 rounded-lg p-3">
                    <p className="text-xs text-white/70">{t}</p>
                  </div>
                ))}
              </div>
              <Link to="/contact" className="btn-primary-3d mt-6 w-full justify-center">
                Start Today <ArrowRight size={15} />
              </Link>
            </div>

            {/* Floating badges */}
            <div className="absolute -top-4 -left-4 bg-white rounded-xl shadow-xl p-3 flex items-center gap-2">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle size={14} className="text-green-600" />
              </div>
              <span className="text-xs font-semibold text-navy">PMEGP Approved!</span>
            </div>
            <div className="absolute -bottom-4 -right-4 bg-white rounded-xl shadow-xl p-3 flex items-center gap-2">
              <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                <Star size={14} className="text-orange-600 fill-orange-600" />
              </div>
              <span className="text-xs font-semibold text-navy">5-Star Rated</span>
            </div>
          </div>
        </div>
      </section>

      {/* ====== TESTIMONIALS ====== */}
      <section className="py-20" style={{ background: "linear-gradient(135deg, #fdf3ec 0%, #fff7f3 100%)" }}>
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <div className="eyebrow">Client Stories</div>
            <h2 className="section-title">What Our <span className="highlight">Clients Say</span></h2>
            <p className="text-slate-500 mt-3">Real results from real businesses we've helped grow.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <TestCard key={t.name} {...t} />
            ))}
          </div>
          <div className="text-center mt-10">
            <Link to="/about" className="inline-flex items-center gap-2 text-orange-600 font-semibold text-sm hover:gap-4 transition-all">
              View More Success Stories <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>

      {/* ====== CTA BANNER ====== */}
      <section
        className="relative py-20 px-6 overflow-hidden"
        style={{ background: "linear-gradient(135deg, #0a1628 0%, #0f1e3a 100%)" }}
      >
        <div className="grid-bg" />
        <HeroParticles />
        <div className="relative z-10 max-w-3xl mx-auto text-center">
          <div className="eyebrow text-white/60">Get Started Today</div>
          <h2
            className="font-display font-black text-white"
            style={{ fontSize: "clamp(28px, 4vw, 46px)" }}
          >
            Ready to <span className="gradient-text">Grow Your Business?</span>
          </h2>
          <p className="text-white/50 mt-4 max-w-lg mx-auto">
            Join 500+ businesses that chose Artha Ventures as their trusted growth partner.
          </p>
          <div className="flex flex-wrap gap-3 justify-center mt-8">
            <Link to="/contact" className="btn-primary-3d">
              <Phone size={15} />
              Book Free Consultation
              <ArrowRight size={15} />
            </Link>
            <a href="tel:+918888802588" className="btn-outline-white-3d">
              +91 88888 02588
            </a>
          </div>
          <p className="text-white/30 text-xs mt-5">
            ★★★★★ &nbsp;Rated 5.0 · No hidden fees · Callback in 24 hours
          </p>
        </div>
      </section>
    </div>
  );
}
