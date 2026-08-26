import { useState } from "react";
import useDocumentMetadata from "../hooks/useDocumentMetadata";
import {
  Phone, MessageCircle, Mail, MapPin, Send, Building2,
  HandCoins, Landmark, Clock, PhoneCall, CheckCircle,
  ArrowRight, Star
} from "lucide-react";

const stats = [
  { value: "120+", label: "Businesses Helped" },
  { value: "< 24h", label: "First Response" },
  { value: "98%", label: "Success Rate" },
  { value: "4.9/5", label: "Customer Rating" },
];

const channels = [
  {
    icon: Phone,
    title: "Call Us Directly",
    desc: "Speak with an expert immediately. No IVR, no waiting.",
    action: "Call Now",
    href: "tel:+919899902568",
    meta: "+91 98999 02568",
    color: "from-blue-500 to-blue-700",
    badge: "Fastest",
  },
  {
    icon: MessageCircle,
    title: "WhatsApp Chat",
    desc: "Send documents, ask questions — get replies fast.",
    action: "Open WhatsApp",
    href: "https://wa.me/919899902568",
    meta: "Avg. reply: 10 mins",
    color: "from-green-500 to-green-600",
    badge: "Popular",
  },
  {
    icon: Mail,
    title: "Email Us",
    desc: "For detailed queries, proposals, and document sharing.",
    action: "Contact Us",
    href: "https://mail.google.com/mail/?view=cm&fs=1&to=support@arthovista.com",
    meta: "support@arthovista.com",
    color: "from-purple-500 to-purple-700",
    badge: "Official",
  }
];

const quickLinks = [
  { icon: Building2, title: "Business Registration", desc: "Private Limited, OPC, LLP, Partnership, Section 8", color: "text-blue-600 bg-blue-50" },
  { icon: HandCoins, title: "MSME Loans", desc: "Working capital, term loan, Mudra, Stand-Up India", color: "text-green-600 bg-green-50" },
  { icon: Landmark, title: "Government Schemes", desc: "PMEGP, CGTMSE, Startup India, Subsidies", color: "text-orange-600 bg-orange-50" },
];

export default function Contact() {
  useDocumentMetadata(
    "Contact Us | ArthoVista",
    "Get in touch with ArthoVista for business registration, subsidies, loans, and startup consulting. Contact our team in Noida."
  );
  const [formData, setFormData] = useState({ name: "", phone: "", email: "", service: "", message: "" });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || "Something went wrong. Please try again.");
      }

      setSubmitted(true);
      setFormData({ name: "", phone: "", email: "", service: "", message: "" });
      setTimeout(() => setSubmitted(false), 6000);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };


  return (
    <div>
      {/* ====== HERO ====== */}
      <section className="hero-dark relative py-16 px-6 overflow-hidden">
        <div className="grid-bg" />
        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <span className="inline-flex items-center gap-2 bg-green-500/15 text-green-400 border border-green-500/20 text-xs font-semibold px-4 py-2 rounded-full mb-6">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-400" />
            </span>
            Experts Are Online — Available Now
          </span>
          <h1
            className="font-display font-black text-white"
            style={{ fontSize: "clamp(30px, 5vw, 54px)" }}
          >
            Get In <span className="gradient-text">Touch</span>
          </h1>
          <p className="text-white/50 mt-4 max-w-xl mx-auto">
            Our experts are ready to help you take your business to the next level. Free consultation, no commitment.
          </p>
          <p className="text-sm text-white/30 mt-3 flex items-center justify-center gap-2">
            <Clock size={14} className="text-orange-400" />
            Mon-Sat, 9:30 AM - 6:00 PM IST · Free Consultation
          </p>
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

      {/* ====== CONTACT CHANNELS ====== */}
      <section className="py-12 px-6 border-b border-slate-800/40">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-3 gap-5">
            {channels.map((c) => (
              <a
                key={c.title}
                href={c.href}
                target={c.href.startsWith("http") ? "_blank" : undefined}
                rel="noreferrer"
                className="glass-card-dark rounded-2xl overflow-hidden card-3d group border border-slate-700 hover:border-teal-500 transition-all"
              >
                <div className={`bg-gradient-to-br ${c.color} p-5 relative`}>
                  <span className="absolute top-3 right-3 bg-white/20 text-white text-[10px] font-bold px-2 py-0.5 rounded-full border border-white/20">
                    {c.badge}
                  </span>
                  <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center shadow-sm">
                    <c.icon size={22} className="text-white" />
                  </div>
                </div>
                <div className="p-5">
                  <h3 className="font-display font-bold text-white text-lg drop-shadow-sm">{c.title}</h3>
                  <p className="text-slate-100 text-sm font-medium mt-1">{c.desc}</p>
                  <p className="text-xs font-semibold text-teal-300 mt-2">{c.meta}</p>
                  <div className="mt-4 inline-flex items-center gap-1 text-teal-400 font-bold text-sm group-hover:gap-3 transition-all">
                    {c.action} <ArrowRight size={13} />
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ====== MAIN CONTACT SECTION ====== */}
      <section className="py-14 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-[1fr_1.3fr] gap-10">
            {/* Left Side */}
            <div>
              <div className="eyebrow">We're Here to Help</div>
              <h2 className="section-title text-white mb-3">
                Let's <span className="highlight">Talk Business</span>
              </h2>
              <p className="text-slate-100 text-base font-medium mb-8">
                Choose your preferred way to connect with our MSME experts.
              </p>

              {/* Office Info */}
              <div className="glass-card-dark rounded-2xl p-6 mb-6 card-3d border border-slate-700">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-orange-500/20 rounded-xl flex items-center justify-center shrink-0 shadow-sm">
                    <MapPin size={20} className="text-orange-400" />
                  </div>
                  <div>
                    <p className="font-bold text-white text-base">Visit Our Office in Noida</p>
                    <p className="text-sm font-medium text-slate-100 mt-1">Logix Cyber Park, Sector 62, Noida, UP - 201309</p>
                    <div className="flex flex-wrap gap-2 mt-3">
                      {["Business Registration", "MSME Loans", "Govt. Schemes", "PMEGP"].map((t) => (
                        <span key={t} className="text-[11px] bg-slate-800 border border-slate-600 rounded-full px-2.5 py-1 text-teal-300 font-bold">
                          {t}
                        </span>
                      ))}
                    </div>
                    <p className="text-xs text-slate-200 font-semibold mt-3 flex items-center gap-1.5">
                      <Clock size={12} className="text-teal-400" />
                      Mon-Sat 9:30 AM - 6:00 PM · 500+ approved visits
                    </p>
                  </div>
                </div>
              </div>

              {/* Quick Links */}
              <div className="grid grid-cols-1 gap-3 mb-6">
                {quickLinks.map((q) => (
                  <div key={q.title} className="glass-card-dark rounded-xl p-4 flex items-center gap-3 card-3d border border-slate-700">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${q.color}`}>
                      <q.icon size={18} />
                    </div>
                    <div className="flex-1">
                      <p className="font-bold text-white text-sm">{q.title}</p>
                      <p className="text-xs font-medium text-slate-200 mt-0.5">{q.desc}</p>
                    </div>
                    <ArrowRight size={14} className="text-teal-400" />
                  </div>
                ))}
              </div>

              <p className="text-xs text-slate-200 font-semibold flex items-center gap-2">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-400" />
                </span>
                3 experts online — Ready to assist you right now
              </p>
            </div>

            {/* Right - Form */}
            <div>
              <div
                className="rounded-2xl overflow-hidden border border-slate-700 shadow-2xl"
              >
                <div
                  className="p-5 flex items-center justify-between"
                  style={{ background: "linear-gradient(135deg, rgba(10,22,40,0.9), rgba(26,48,96,0.9))" }}
                >
                  <div>
                    <h2 className="font-display font-bold text-white text-lg drop-shadow-sm">Send Us a Message</h2>
                    <p className="text-slate-200 text-xs font-medium mt-0.5">We'll get back to you within 24 hours</p>
                  </div>
                  <div className="flex gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={13} className="text-amber-400 fill-amber-400" />
                    ))}
                  </div>
                </div>

                <div className="bg-slate-900/90 p-7">
                  {submitted ? (
                    <div className="py-12 text-center">
                      <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                        <CheckCircle size={32} className="text-green-400" />
                      </div>
                      <h3 className="font-display font-bold text-white text-xl">Message Sent!</h3>
                      <p className="text-slate-200 mt-2 text-sm font-medium">Our expert will call you within 24 hours.</p>
                    </div>
                  ) : (
                    <form className="space-y-4" onSubmit={handleSubmit}>
                      <div className="grid sm:grid-cols-2 gap-4">
                        <div>
                          <label className="text-xs font-bold text-slate-200 block mb-1.5">Full Name *</label>
                          <input
                            type="text"
                            placeholder="Ramesh Kumar"
                            required
                            className="w-full px-4 py-3 rounded-xl bg-slate-800 text-white placeholder-slate-400 border border-slate-600 text-sm font-medium focus:outline-none focus:border-teal-500 transition-all"
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          />
                        </div>
                        <div>
                          <label className="text-xs font-bold text-slate-200 block mb-1.5">Phone Number *</label>
                          <input
                            type="tel"
                            placeholder="98999 02568"
                            required
                            className="w-full px-4 py-3 rounded-xl bg-slate-800 text-white placeholder-slate-400 border border-slate-600 text-sm font-medium focus:outline-none focus:border-teal-500 transition-all"
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          />
                        </div>
                      </div>
                      <div>
                        <label className="text-xs font-bold text-slate-200 block mb-1.5">Email Address</label>
                        <input
                          type="email"
                          placeholder="ramesh@example.com"
                          className="w-full px-4 py-3 rounded-xl bg-slate-800 text-white placeholder-slate-400 border border-slate-600 text-sm font-medium focus:outline-none focus:border-teal-500 transition-all"
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        />
                      </div>
                      <div>
                        <label className="text-xs font-bold text-slate-200 block mb-1.5">Service Interested In</label>
                        <select
                          className="w-full px-4 py-3 rounded-xl bg-slate-800 text-white border border-slate-600 text-sm font-medium focus:outline-none focus:border-teal-500 transition-all"
                          onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                        >
                          <option value="" className="bg-slate-900">Select service</option>
                          <option className="bg-slate-900">Business Registration</option>
                          <option className="bg-slate-900">Government Schemes</option>
                          <option className="bg-slate-900">Loan Products</option>
                          <option className="bg-slate-900">Certifications</option>
                          <option className="bg-slate-900">GST & Tax</option>
                          <option className="bg-slate-900">NGO Services</option>
                          <option className="bg-slate-900">Digital Marketing</option>
                          <option className="bg-slate-900">DPR & Pitch Deck</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-xs font-bold text-slate-200 block mb-1.5">Tell Us About Your Business</label>
                        <textarea
                          rows={4}
                          placeholder="Tell us what you need help with — business stage, industry, funding requirements..."
                          className="w-full px-4 py-3 rounded-xl bg-slate-800 text-white placeholder-slate-400 border border-slate-600 text-sm font-medium focus:outline-none focus:border-teal-500 transition-all resize-none"
                          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        />
                      </div>
                      {error && (
                        <div className="flex items-center gap-2 bg-red-950/80 border border-red-700 text-red-200 rounded-xl px-4 py-3 text-sm font-semibold">
                          <span className="shrink-0">⚠️</span>
                          <span>{error}</span>
                        </div>
                      )}
                      <button
                        type="submit"
                        disabled={loading}
                        className="btn-primary-3d w-full justify-center disabled:opacity-60 disabled:cursor-not-allowed shadow-lg shadow-teal-500/25"
                      >
                        {loading ? (
                          <>
                            <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            Sending…
                          </>
                        ) : (
                          <>
                            Send Message
                            <Send size={15} />
                          </>
                        )}
                      </button>
                      <p className="text-center text-xs font-medium text-slate-300">
                        Your information is secure · No hidden fees · 100% Confidential
                      </p>
                    </form>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ====== MAP + ADDRESS ====== */}
      <section className="py-14 px-6 border-t border-slate-800/40">
        <div className="max-w-6xl mx-auto">
          <div className="glass-card-dark rounded-2xl overflow-hidden border border-slate-700/60">
            <div className="grid md:grid-cols-2">
              <div className="p-8">
                <div className="eyebrow">Our Location</div>
                <h3 className="section-title text-white text-3xl mb-4">Visit Our Office</h3>
                <p className="text-slate-100 text-sm font-medium mb-6">
                  We'd love to meet you in person and discuss your business growth strategy.
                </p>
                <div className="space-y-4">
                  {[
                    { icon: MapPin, text: "Logix Cyber Park, Noida Sector 62, Uttar Pradesh - 201309" },
                    { icon: Phone, text: "+91 98999 02568" },
                    { icon: Mail, text: "support@arthovista.com" },
                    { icon: Clock, text: "Mon-Sat, 9:30 AM - 6:00 PM IST" },
                  ].map(({ icon: Icon, text }) => (
                    <div key={text} className="flex items-start gap-3 text-sm text-slate-100 font-medium">
                      <Icon size={16} className="text-orange-400 mt-0.5 shrink-0" />
                      <span>{text}</span>
                    </div>
                  ))}
                </div>
                <div className="flex gap-3 mt-8">
                  <a href="tel:+919899902568" className="btn-primary-3d">
                    <PhoneCall size={14} /> Call Now
                  </a>
                  <a
                    href="https://wa.me/919899902568"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-bold text-sm px-5 py-3 rounded-xl transition-all hover:-translate-y-1 hover:shadow-lg hover:shadow-green-500/20"
                  >
                    <MessageCircle size={14} /> WhatsApp
                  </a>
                </div>
              </div>
              <div
                className="min-h-[300px] flex items-center justify-center relative overflow-hidden"
                style={{ background: "linear-gradient(135deg, rgba(10,22,40,0.85), rgba(26,48,96,0.85))" }}
              >
                <div className="grid-bg" />
                <div className="relative z-10 text-center p-6">
                  <div className="w-16 h-16 bg-orange-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-sm">
                    <MapPin size={28} className="text-orange-400" />
                  </div>
                  <p className="text-white font-bold text-lg">Logix Cyber Park</p>
                  <p className="text-slate-200 text-sm font-medium mt-1">Noida Sector 62, UP</p>
                  <a
                    href="https://maps.google.com/?q=Logix+Cyber+Park+Noida+Sector+62"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 mt-4 text-orange-400 text-sm hover:text-orange-300 transition-colors font-bold"
                  >
                    Open in Google Maps <ArrowRight size={13} />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
