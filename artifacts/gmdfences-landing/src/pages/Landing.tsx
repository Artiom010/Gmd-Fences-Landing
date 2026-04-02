import { useState, useEffect, lazy, Suspense } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Phone, Mail, Menu, X, ChevronDown, ChevronLeft, ChevronRight,
  CheckCircle, ArrowRight, Star, MapPin, Shield, Zap, Award, Wrench,
  Globe, Building2, Truck, Settings
} from "lucide-react";

const InteractiveGlobe = lazy(() => import("../components/InteractiveGlobe"));

const contactSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Valid email is required"),
  phone: z.string().optional(),
  message: z.string().min(10, "Message must be at least 10 characters"),
});
type ContactForm = z.infer<typeof contactSchema>;

const COMPANY_PHONE = "+1 (800) 000-0000";
const COMPANY_EMAIL = "info@gmdfences.com";

const REGIONAL = [
  { country: "Romania",  flag: "🇷🇴", url: "https://gardurimd.ro",   domain: "gardurimd.ro",   city: "Bucharest",  lat: 45.9, lng: 24.9 },
  { country: "Moldova",  flag: "🇲🇩", url: "https://garduri.md",     domain: "garduri.md",     city: "Chișinău",   lat: 47.0, lng: 28.9 },
  { country: "Bulgaria", flag: "🇧🇬", url: "https://ogradigmd.bg",   domain: "ogradigmd.bg",   city: "Sofia",      lat: 42.7, lng: 25.5 },
];

const PRODUCTS = [
  { title: "Fence Panels",       icon: <FenceIcon />,      types: ["Louver Fence","Horizontal Profile Fence","Horizontal Picket Fence","Vertical Louver Fence","Picket Fence","Vertical Profile Fence 20x20","Vertical Profile Fence 40x20","Inside Profile Fence","Inside Profile Fence U-45","Profile Fence LUX"] },
  { title: "Gates",              icon: <GateIcon />,       types: ["Swing Gates","Wicket / Pedestrian Gates","Sliding Gate","Cantilever Gate","Bi-Folding Gate","Articulated Sliding Gate","Telescopic Sliding Gate"] },
  { title: "Automation",         icon: <Zap size={22} />,  types: ["Gate Automation","Wicket Gate Automation","Other Automation Solutions"] },
  { title: "Parking Blockers",   icon: <ParkIcon />,       types: ["Parking Blockers"] },
];

const ADVANTAGES = [
  { icon: Award,     title: "Commercial Quality",         desc: "Manufacturing standards that exceed residential requirements, built to last decades." },
  { icon: Shield,    title: "High Strength & Security",   desc: "Engineered for maximum durability with anti-corrosion treatment and premium steel." },
  { icon: Wrench,    title: "Anti-Corrosion Coatings",   desc: "Powder-coated finishes and galvanized options protect against all weather conditions." },
  { icon: Building2, title: "Factory-Direct Pricing",    desc: "No middlemen — direct from our factory floor to your property at honest prices." },
  { icon: Truck,     title: "USA-Wide Delivery",          desc: "Reliable logistics to your location across the entire United States." },
];

const STEPS = [
  { n: "01", label: "Request a Quote",     desc: "Submit your details via phone or email. We respond within 24 hours." },
  { n: "02", label: "Design & Approval",   desc: "We prepare technical designs and material specs for your approval." },
  { n: "03", label: "Manufacturing",       desc: "Your system is precision-manufactured in our certified facility." },
  { n: "04", label: "Delivery & Install",  desc: "On-time delivery to your site with full installation support." },
];

const FAQ = [
  { q: "Do you provide fence and gate solutions in the USA?",           a: "Yes. GMD Fences provides information, consultation and product supply for fence systems, gate solutions, automation options and related products across the USA." },
  { q: "Can I contact you before the full website launches?",           a: "Absolutely. You can reach us by phone or send a request using the form on this page. We'll respond within 24 hours." },
  { q: "Do you offer gate automation solutions?",                       a: "Yes. We offer gate automation, wicket gate automation and a range of other automation systems for residential and commercial properties." },
  { q: "Where can I find your regional websites?",                      a: "Links to our official regional sites for Romania (gardurimd.ro), Moldova (garduri.md) and Bulgaria (ogradigmd.bg) are in the International Presence section below." },
];

// ── Inline SVG icons ──────────────────────────────────────────────────────────
function FenceIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
      <line x1="4" y1="2" x2="4" y2="22" /><line x1="9" y1="2" x2="9" y2="22" />
      <line x1="14" y1="2" x2="14" y2="22" /><line x1="19" y1="2" x2="19" y2="22" />
      <line x1="2" y1="7" x2="22" y2="7" /><line x1="2" y1="17" x2="22" y2="17" />
    </svg>
  );
}
function GateIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
      <rect x="2" y="6" width="9" height="16" rx="1" /><rect x="13" y="6" width="9" height="16" rx="1" />
      <line x1="11" y1="13" x2="13" y2="13" /><line x1="1" y1="3" x2="23" y2="3" />
    </svg>
  );
}
function ParkIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
      <rect x="3" y="11" width="18" height="10" rx="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  );
}
function FencePattern() {
  return (
    <svg className="absolute inset-0 w-full h-full opacity-[0.035]" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <pattern id="fp2" x="0" y="0" width="80" height="100" patternUnits="userSpaceOnUse">
          <rect x="8" y="0" width="7" height="100" fill="white" />
          <rect x="28" y="0" width="7" height="100" fill="white" />
          <rect x="48" y="0" width="7" height="100" fill="white" />
          <rect x="68" y="0" width="7" height="100" fill="white" />
          <rect x="0" y="25" width="80" height="5" fill="white" opacity="0.6" />
          <rect x="0" y="68" width="80" height="5" fill="white" opacity="0.6" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#fp2)" />
    </svg>
  );
}

// ── Main component ─────────────────────────────────────────────────────────────
export default function Landing() {
  const [menuOpen, setMenuOpen]   = useState(false);
  const [scrolled, setScrolled]   = useState(false);
  const [openFaq, setOpenFaq]     = useState<number | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [activeRegion, setActiveRegion] = useState<string | null>(null);

  const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm<ContactForm>({
    resolver: zodResolver(contactSchema),
  });

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", h);
    return () => window.removeEventListener("scroll", h);
  }, []);

  const scrollTo = (id: string) => {
    setMenuOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  async function onSubmit(data: ContactForm) {
    await new Promise(r => setTimeout(r, 900));
    console.log("Form submitted:", data);
    setSubmitted(true);
    reset();
  }

  return (
    <div className="min-h-screen bg-white text-[#1B2537] font-['Inter',sans-serif]">

      {/* ════ HEADER ═════════════════════════════════════════════════════════ */}
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? "bg-[#0D1520]/98 backdrop-blur-xl shadow-2xl" : "bg-transparent"}`} data-testid="header">
        {/* Top contact strip */}
        <div className={`transition-all duration-300 ${scrolled ? "hidden" : "block"} border-b border-white/8`}>
          <div className="max-w-7xl mx-auto px-6 h-10 flex items-center justify-end gap-8">
            <a href={`tel:${COMPANY_PHONE.replace(/\s/g,"")}`} className="flex items-center gap-1.5 text-white/60 hover:text-[#F4C430] text-xs font-medium transition-colors">
              <Phone className="w-3 h-3" />{COMPANY_PHONE}
            </a>
            <a href={`mailto:${COMPANY_EMAIL}`} className="flex items-center gap-1.5 text-white/60 hover:text-[#F4C430] text-xs font-medium transition-colors">
              <Mail className="w-3 h-3" />{COMPANY_EMAIL}
            </a>
          </div>
        </div>
        {/* Main nav */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <button onClick={() => scrollTo("home")} className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-[#F4C430] flex items-center justify-center shadow-lg shadow-[#F4C430]/20">
                <span className="text-[#0D1520] font-black text-xs tracking-tighter">GMD</span>
              </div>
              <div>
                <span className="text-white font-black text-xl tracking-tight">GMD</span>
                <span className="text-[#F4C430] font-black text-xl tracking-tight">Fences</span>
              </div>
            </button>

            {/* Desktop nav */}
            <nav className="hidden md:flex items-center gap-8">
              {[["home","Home"],["products","Products"],["world","International"],["contact","Contact"]].map(([id, label]) => (
                <button key={id} onClick={() => scrollTo(id)} className="text-white/70 hover:text-[#F4C430] text-sm font-medium transition-colors">
                  {label}
                </button>
              ))}
            </nav>

            <div className="hidden md:flex items-center gap-4">
              <a href={`tel:${COMPANY_PHONE.replace(/\s/g,"")}`} className="flex items-center gap-2 text-white/70 hover:text-[#F4C430] text-sm font-medium transition-colors">
                <Phone className="w-4 h-4" />{COMPANY_PHONE}
              </a>
              <button onClick={() => scrollTo("contact")} className="px-5 py-2.5 bg-[#F4C430] text-[#0D1520] text-sm font-bold rounded-lg hover:bg-[#e0b020] transition-all shadow-lg shadow-[#F4C430]/20">
                Get a Quote
              </button>
            </div>

            <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden text-white p-1.5">
              {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="md:hidden bg-[#0D1520]/98 backdrop-blur-xl border-t border-white/10 px-6 py-5 flex flex-col gap-1">
            {[["home","Home"],["products","Products"],["world","International"],["contact","Contact"]].map(([id, label]) => (
              <button key={id} onClick={() => scrollTo(id)} className="text-left text-white/80 py-3.5 border-b border-white/8 text-sm font-semibold">
                {label}
              </button>
            ))}
            <div className="pt-4 flex flex-col gap-3">
              <a href={`tel:${COMPANY_PHONE.replace(/\s/g,"")}`} className="text-[#F4C430] text-sm font-bold flex items-center gap-2">
                <Phone className="w-4 h-4" />{COMPANY_PHONE}
              </a>
              <button onClick={() => scrollTo("contact")} className="w-full py-3 bg-[#F4C430] text-[#0D1520] font-bold rounded-lg text-sm">
                Get a Quote
              </button>
            </div>
          </div>
        )}
      </header>

      {/* ════ HERO ═══════════════════════════════════════════════════════════ */}
      <section id="home" className="relative min-h-screen flex items-center" data-testid="hero-section">
        {/* Background layers */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#060C17] via-[#0D1520] to-[#152035]" />
        <FencePattern />
        {/* Radial glow */}
        <div className="absolute top-1/3 left-1/4 w-96 h-96 rounded-full bg-[#F4C430]/5 blur-3xl pointer-events-none" />
        <div className="absolute top-1/2 right-1/4 w-64 h-64 rounded-full bg-blue-500/8 blur-3xl pointer-events-none" />
        {/* Bottom fade */}
        <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-[#060C17]/90 to-transparent" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-36 pb-24 w-full">
          <div className="max-w-3xl">
            {/* Eyebrow */}
            <div className="flex items-center gap-3 mb-8">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_,i) => <Star key={i} className="w-4 h-4 text-[#F4C430] fill-[#F4C430]" />)}
              </div>
              <div className="w-px h-5 bg-white/20" />
              <span className="text-white/50 text-sm font-medium">Commercial Quality for Residential Use</span>
            </div>

            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black text-white leading-[1.05] tracking-tight mb-6" data-testid="hero-heading">
              The Global <br />
              <span className="text-[#F4C430]">Fence & Gate</span><br />
              Brand
            </h1>

            <p className="text-white/60 text-lg leading-relaxed mb-3 max-w-xl" data-testid="hero-subtext">
              GMD Fences is an international fence manufacturing brand with regional operations in Romania, Moldova and Bulgaria — now serving the <strong className="text-white/80">United States</strong>.
            </p>
            <p className="text-white/50 text-sm leading-relaxed mb-10 max-w-lg">
              Custom fences, gates, automation systems and parking blockers for residential, commercial and industrial properties across the USA.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap gap-4 mb-14">
              <button onClick={() => scrollTo("contact")} className="group px-7 py-4 bg-[#F4C430] text-[#0D1520] font-bold text-sm rounded-xl hover:bg-[#e0b020] transition-all shadow-xl shadow-[#F4C430]/20 flex items-center gap-2">
                Request a Quote
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </button>
              <button onClick={() => scrollTo("world")} className="group px-7 py-4 border border-white/20 text-white font-semibold text-sm rounded-xl hover:bg-white/8 hover:border-[#F4C430]/40 transition-all flex items-center gap-2">
                <Globe className="w-4 h-4" /> Our Global Presence
              </button>
            </div>

            {/* Stats bar */}
            <div className="grid grid-cols-3 gap-0 border border-white/10 rounded-2xl overflow-hidden max-w-lg">
              {[
                { val: "10+",  lbl: "Years Manufacturing" },
                { val: "3",    lbl: "Regional Markets" },
                { val: "1M+",  lbl: "Meters Installed" },
              ].map(({ val, lbl }, i) => (
                <div key={i} className={`px-5 py-4 text-center bg-white/4 ${i < 2 ? "border-r border-white/10" : ""}`}>
                  <p className="text-2xl font-black text-[#F4C430]">{val}</p>
                  <p className="text-white/40 text-xs mt-0.5">{lbl}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/30 animate-bounce">
          <ChevronDown className="w-6 h-6" />
        </div>
      </section>

      {/* ════ ABOUT + CONTACT ════════════════════════════════════════════════ */}
      <section id="contact" className="py-24 bg-white" data-testid="about-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-start">
            {/* Left: About */}
            <div>
              <span className="text-[#F4C430] text-xs font-bold uppercase tracking-[0.2em] mb-4 block">Who We Are</span>
              <h2 className="text-3xl sm:text-4xl font-black text-[#0D1520] leading-tight mb-3" data-testid="about-heading">
                Metal Fence & Gate Factory
              </h2>
              <p className="text-[#0D1520]/40 font-semibold text-sm mb-6">Commercial Quality for Residential Use</p>

              {/* Status banner */}
              <div className="flex gap-3 bg-amber-50 border-l-4 border-amber-400 rounded-r-xl p-4 mb-7">
                <div className="w-2 h-2 rounded-full bg-amber-500 mt-1 flex-shrink-0 animate-pulse" />
                <div>
                  <p className="text-amber-900 font-bold text-sm">Website Under Development</p>
                  <p className="text-amber-700/80 text-xs mt-0.5 leading-relaxed">
                    Our full US website is in preparation. Contact us now for product information, quotes and delivery options across the USA.
                  </p>
                </div>
              </div>

              <p className="text-slate-600 leading-relaxed mb-8 text-sm">
                GMD Fences is a manufacturing company specializing in custom metal fences, automated gates and access control systems. With production facilities and established regional brands in Eastern Europe, we now bring the same high standards to the US market — direct from factory to your property.
              </p>

              {/* Key figures */}
              <div className="grid grid-cols-2 gap-3 mb-8">
                {[
                  { val: "10+",   lbl: "Years in Manufacturing" },
                  { val: "1M+",   lbl: "Meters of Fence Installed" },
                  { val: "3",     lbl: "Active Regional Markets" },
                  { val: "100%",  lbl: "Factory-Direct Products" },
                ].map(({ val, lbl }) => (
                  <div key={lbl} className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl border border-slate-100">
                    <span className="text-2xl font-black text-[#0D1520]">{val}</span>
                    <span className="text-slate-500 text-xs leading-tight">{lbl}</span>
                  </div>
                ))}
              </div>

              {/* Contact chips */}
              <div className="flex flex-col sm:flex-row gap-3">
                <a href={`tel:${COMPANY_PHONE.replace(/\s/g,"")}`} className="flex items-center gap-3 p-4 bg-[#0D1520] rounded-xl hover:bg-[#1B2537] transition-colors flex-1" data-testid="contact-phone">
                  <div className="w-9 h-9 rounded-lg bg-[#F4C430] flex items-center justify-center flex-shrink-0">
                    <Phone className="w-4 h-4 text-[#0D1520]" />
                  </div>
                  <div>
                    <p className="text-white/40 text-[10px] uppercase tracking-wider">Call Us</p>
                    <p className="text-white font-bold text-sm">{COMPANY_PHONE}</p>
                  </div>
                </a>
                <a href={`mailto:${COMPANY_EMAIL}`} className="flex items-center gap-3 p-4 bg-slate-50 border border-slate-200 rounded-xl hover:border-[#0D1520]/30 transition-colors flex-1" data-testid="contact-email">
                  <div className="w-9 h-9 rounded-lg bg-[#0D1520] flex items-center justify-center flex-shrink-0">
                    <Mail className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <p className="text-slate-400 text-[10px] uppercase tracking-wider">Email</p>
                    <p className="text-[#0D1520] font-bold text-sm">{COMPANY_EMAIL}</p>
                  </div>
                </a>
              </div>
            </div>

            {/* Right: Contact Form */}
            <div>
              <span className="text-[#F4C430] text-xs font-bold uppercase tracking-[0.2em] mb-4 block">Free Consultation</span>
              <h2 className="text-2xl font-black text-[#0D1520] mb-6">Send Us a Request</h2>

              <div className="bg-[#0D1520] rounded-2xl p-7 shadow-2xl">
                {submitted ? (
                  <div className="text-center py-14" data-testid="form-success">
                    <div className="w-16 h-16 bg-green-500/15 rounded-full flex items-center justify-center mx-auto mb-4 border border-green-500/20">
                      <CheckCircle className="w-7 h-7 text-green-400" />
                    </div>
                    <h3 className="text-xl font-black text-white mb-2">Thank you.</h3>
                    <p className="text-white/50 text-sm">Your request has been sent.</p>
                    <button onClick={() => setSubmitted(false)} className="mt-6 text-[#F4C430] text-sm font-semibold underline-offset-2 underline hover:no-underline">
                      Send another request
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" data-testid="contact-form">
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-white/50 text-[10px] font-bold mb-2 uppercase tracking-wider">Your Name *</label>
                        <input {...register("name")} type="text" placeholder="Full name"
                          className="w-full px-4 py-3 rounded-xl bg-white/6 border border-white/8 text-white placeholder-white/25 focus:outline-none focus:border-[#F4C430]/50 focus:bg-white/10 transition-all text-sm"
                          data-testid="input-name" />
                        {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name.message}</p>}
                      </div>
                      <div>
                        <label className="block text-white/50 text-[10px] font-bold mb-2 uppercase tracking-wider">Email Address *</label>
                        <input {...register("email")} type="email" placeholder="your@email.com"
                          className="w-full px-4 py-3 rounded-xl bg-white/6 border border-white/8 text-white placeholder-white/25 focus:outline-none focus:border-[#F4C430]/50 focus:bg-white/10 transition-all text-sm"
                          data-testid="input-email" />
                        {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email.message}</p>}
                      </div>
                    </div>
                    <div>
                      <label className="block text-white/50 text-[10px] font-bold mb-2 uppercase tracking-wider">Phone Number</label>
                      <input {...register("phone")} type="tel" placeholder="+1 (000) 000-0000"
                        className="w-full px-4 py-3 rounded-xl bg-white/6 border border-white/8 text-white placeholder-white/25 focus:outline-none focus:border-[#F4C430]/50 focus:bg-white/10 transition-all text-sm"
                        data-testid="input-phone" />
                    </div>
                    <div>
                      <label className="block text-white/50 text-[10px] font-bold mb-2 uppercase tracking-wider">Message *</label>
                      <textarea {...register("message")} rows={4} placeholder="Describe your project, dimensions, type of fence or gate…"
                        className="w-full px-4 py-3 rounded-xl bg-white/6 border border-white/8 text-white placeholder-white/25 focus:outline-none focus:border-[#F4C430]/50 focus:bg-white/10 transition-all text-sm resize-none"
                        data-testid="input-message" />
                      {errors.message && <p className="text-red-400 text-xs mt-1">{errors.message.message}</p>}
                    </div>
                    <button type="submit" disabled={isSubmitting}
                      className="w-full py-3.5 bg-[#F4C430] text-[#0D1520] font-bold rounded-xl hover:bg-[#e0b020] transition-all disabled:opacity-60 flex items-center justify-center gap-2 text-sm shadow-lg shadow-[#F4C430]/20"
                      data-testid="button-submit">
                      {isSubmitting
                        ? <span className="w-5 h-5 border-2 border-[#0D1520]/30 border-t-[#0D1520] rounded-full animate-spin" />
                        : <><span>Send Request</span><ArrowRight className="w-4 h-4" /></>}
                    </button>
                    <p className="text-center text-white/25 text-xs">We'll reply within 24 hours</p>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ════ MANUFACTURING ══════════════════════════════════════════════════ */}
      <section className="py-20 bg-[#0D1520] relative overflow-hidden" data-testid="manufacturing-section">
        <FencePattern />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-14 items-center">
            <div>
              <span className="text-[#F4C430] text-xs font-bold uppercase tracking-[0.2em] mb-4 block">Capabilities</span>
              <h2 className="text-3xl sm:text-4xl font-black text-white leading-tight mb-6" data-testid="manufacturing-heading">
                Manufacturing,<br />Installation & Delivery<br />
                <span className="text-[#F4C430]">in the USA</span>
              </h2>
              <p className="text-white/55 leading-relaxed mb-8 text-sm">
                GMD Fences offers end-to-end solutions from our manufacturing plant to your property. We handle design, production, logistics and installation support for fence and gate projects of any scale across the United States.
              </p>
              <button onClick={() => scrollTo("contact")} className="inline-flex items-center gap-2 px-6 py-3.5 bg-[#F4C430] text-[#0D1520] font-bold rounded-xl hover:bg-[#e0b020] transition-all shadow-lg text-sm">
                Request a Quote <ArrowRight className="w-4 h-4" />
              </button>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { I: Wrench,    t: "In-House Manufacturing",  d: "Full production control for consistent quality" },
                { I: Settings,  t: "Custom Engineering",       d: "Tailored designs to match your exact specs" },
                { I: Truck,     t: "USA-Wide Delivery",        d: "Reliable, on-time logistics to your site" },
                { I: Shield,    t: "Quality Certified",        d: "All products meet precision standards" },
              ].map(({ I, t, d }) => (
                <div key={t} className="bg-white/4 border border-white/8 rounded-2xl p-5 hover:bg-white/8 transition-all">
                  <I className="w-5 h-5 text-[#F4C430] mb-3" />
                  <p className="text-white font-bold text-sm mb-1.5">{t}</p>
                  <p className="text-white/40 text-xs leading-relaxed">{d}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ════ PRODUCTS ═══════════════════════════════════════════════════════ */}
      <section id="products" className="py-24 bg-[#F5F6F8]" data-testid="products-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <span className="text-[#F4C430] text-xs font-bold uppercase tracking-[0.2em] mb-4 block">Our Offer</span>
            <h2 className="text-3xl sm:text-4xl font-black text-[#0D1520]" data-testid="products-heading">Products & Services</h2>
            <p className="text-slate-500 text-sm mt-3 max-w-xl mx-auto">
              Our full catalog covers every aspect of perimeter security and property boundaries — from decorative panels to full automation systems.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {PRODUCTS.map(({ title, icon, types }) => (
              <div key={title} className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden group hover:shadow-md hover:-translate-y-0.5 transition-all">
                <div className="p-5 bg-[#0D1520] flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#F4C430] flex items-center justify-center text-[#0D1520] flex-shrink-0">
                    {icon}
                  </div>
                  <h3 className="text-white font-black text-base" data-testid={`cat-${title.toLowerCase().replace(/\s/g,"-")}`}>{title}</h3>
                </div>
                <ul className="p-5 space-y-2.5">
                  {types.map(t => (
                    <li key={t} className="flex items-start gap-2 text-xs text-slate-600">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#F4C430] mt-1.5 flex-shrink-0" />{t}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════ ADVANTAGES ═════════════════════════════════════════════════════ */}
      <section className="py-24 bg-white" data-testid="advantages-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <span className="text-[#F4C430] text-xs font-bold uppercase tracking-[0.2em] mb-4 block">Why GMD Fences</span>
            <h2 className="text-3xl sm:text-4xl font-black text-[#0D1520]" data-testid="advantages-heading">Our Advantages</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-6">
            {ADVANTAGES.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="text-center group p-6 rounded-2xl border border-slate-100 hover:border-[#F4C430]/30 hover:bg-amber-50/30 transition-all">
                <div className="w-14 h-14 rounded-2xl bg-[#0D1520] flex items-center justify-center mx-auto mb-5 group-hover:bg-[#1B2537] transition-colors shadow-sm">
                  <Icon className="w-6 h-6 text-[#F4C430]" />
                </div>
                <h3 className="text-xs font-black text-[#0D1520] mb-2.5 leading-tight">{title}</h3>
                <p className="text-slate-500 text-xs leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════ HOW TO ORDER ═══════════════════════════════════════════════════ */}
      <section className="py-20 bg-[#F5F6F8]" data-testid="order-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <span className="text-[#F4C430] text-xs font-bold uppercase tracking-[0.2em] mb-4 block">Simple Process</span>
            <h2 className="text-3xl sm:text-4xl font-black text-[#0D1520]">How to Place an Order</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 relative">
            {STEPS.map(({ n, label, desc }, i) => (
              <div key={i} className="relative">
                {i < STEPS.length - 1 && <div className="hidden lg:block absolute top-7 left-[calc(50%+2.5rem)] right-[-50%] h-px bg-[#F4C430]/20" />}
                <div className="text-center">
                  <div className="w-14 h-14 rounded-2xl bg-[#0D1520] flex items-center justify-center mx-auto mb-4 relative z-10 shadow-sm">
                    <span className="text-[#F4C430] font-black text-base">{n}</span>
                  </div>
                  <h3 className="text-sm font-black text-[#0D1520] mb-2">{label}</h3>
                  <p className="text-slate-500 text-xs leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════ INTERNATIONAL PRESENCE — GLOBE ════════════════════════════════ */}
      <section id="world" className="py-24 bg-[#0D1520] relative overflow-hidden" data-testid="regional-section">
        <FencePattern />
        {/* Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-blue-600/5 blur-3xl pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-[#F4C430] text-xs font-bold uppercase tracking-[0.2em] mb-4 block">Global Brand</span>
            <h2 className="text-3xl sm:text-4xl font-black text-white mb-4" data-testid="regional-heading">
              Our International Presence
            </h2>
            <p className="text-white/50 text-sm max-w-lg mx-auto">
              GMD Fences operates official regional websites across Europe. Click a country on the globe to explore that market's platform.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Globe */}
            <div className="flex justify-center">
              <Suspense fallback={
                <div className="w-72 h-72 sm:w-96 sm:h-96 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
                  <Globe className="w-12 h-12 text-white/20 animate-spin" />
                </div>
              }>
                <InteractiveGlobe onLocationSelect={(loc) => {
                  setActiveRegion(loc.name);
                  if (loc.url !== "#contact") window.open(loc.url, "_blank");
                  else scrollTo("contact");
                }} />
              </Suspense>
            </div>

            {/* Regional cards */}
            <div className="space-y-4">
              <p className="text-white/40 text-xs uppercase tracking-wider mb-6">Click the globe or a card to visit the regional site</p>

              {/* USA card */}
              <div
                onClick={() => scrollTo("contact")}
                className="group flex items-center gap-4 bg-blue-500/10 border border-blue-500/20 rounded-2xl p-5 cursor-pointer hover:bg-blue-500/15 hover:border-blue-500/40 transition-all"
                data-testid="regional-usa"
              >
                <div className="text-4xl">🇺🇸</div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="text-white font-black text-base">United States</p>
                    <span className="text-[10px] font-bold px-2 py-0.5 bg-blue-500/30 text-blue-300 rounded-full">HEADQUARTERS</span>
                  </div>
                  <p className="text-white/40 text-xs">gmdfences.com · Under Development</p>
                </div>
                <ArrowRight className="w-5 h-5 text-blue-400/50 group-hover:text-blue-400 group-hover:translate-x-0.5 transition-all" />
              </div>

              {REGIONAL.map(({ country, flag, url, domain, city }) => (
                <a
                  key={country}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`group flex items-center gap-4 rounded-2xl p-5 border transition-all ${
                    activeRegion === country
                      ? "bg-[#F4C430]/10 border-[#F4C430]/40 shadow-lg shadow-[#F4C430]/5"
                      : "bg-white/4 border-white/8 hover:bg-white/8 hover:border-[#F4C430]/30"
                  }`}
                  data-testid={`regional-${country.toLowerCase()}`}
                >
                  <div className="text-4xl">{flag}</div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="text-white font-black text-base">{country}</p>
                      <span className="text-[10px] font-bold px-2 py-0.5 bg-[#F4C430]/15 text-[#F4C430] rounded-full">ACTIVE</span>
                    </div>
                    <p className="text-white/40 text-xs">{domain} · {city}</p>
                  </div>
                  <ArrowRight className={`w-5 h-5 transition-all group-hover:translate-x-0.5 ${activeRegion === country ? "text-[#F4C430]" : "text-white/20 group-hover:text-[#F4C430]"}`} />
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ════ FAQ ════════════════════════════════════════════════════════════ */}
      <section className="py-24 bg-white" data-testid="faq-section">
        <div className="max-w-2xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-14">
            <span className="text-[#F4C430] text-xs font-bold uppercase tracking-[0.2em] mb-4 block">FAQ</span>
            <h2 className="text-3xl sm:text-4xl font-black text-[#0D1520]" data-testid="faq-heading">Frequently Asked Questions</h2>
          </div>
          <div className="space-y-3">
            {FAQ.map(({ q, a }, i) => (
              <div key={i} className={`rounded-2xl border overflow-hidden transition-all ${openFaq === i ? "border-[#0D1520]/20 shadow-sm" : "border-slate-100"}`} data-testid={`faq-${i}`}>
                <button onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-start justify-between gap-4 px-6 py-5 text-left hover:bg-slate-50 transition-colors">
                  <h3 className="text-sm font-bold text-[#0D1520] leading-relaxed">{q}</h3>
                  <ChevronDown className={`w-5 h-5 text-[#F4C430] flex-shrink-0 mt-0.5 transition-transform duration-200 ${openFaq === i ? "rotate-180" : ""}`} />
                </button>
                {openFaq === i && (
                  <div className="px-6 pb-5">
                    <p className="text-slate-600 text-sm leading-relaxed border-t border-slate-100 pt-4">{a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════ FOOTER ═════════════════════════════════════════════════════════ */}
      <footer className="bg-[#060C17] text-white pt-16 pb-8" data-testid="footer">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-14">
            {/* Brand col */}
            <div className="lg:col-span-2">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-lg bg-[#F4C430] flex items-center justify-center">
                  <span className="text-[#0D1520] font-black text-xs">GMD</span>
                </div>
                <span className="font-black text-xl">GMD<span className="text-[#F4C430]">Fences</span></span>
              </div>
              <p className="text-white/40 text-sm leading-relaxed max-w-xs mb-6">
                An international fence manufacturing brand. Custom fences, gates, automation and parking control for the USA market.
              </p>
              <div className="space-y-3">
                <a href={`tel:${COMPANY_PHONE.replace(/\s/g,"")}`} className="flex items-center gap-2.5 text-white/50 hover:text-[#F4C430] transition-colors text-sm" data-testid="footer-phone">
                  <Phone className="w-3.5 h-3.5 text-[#F4C430]" />{COMPANY_PHONE}
                </a>
                <a href={`mailto:${COMPANY_EMAIL}`} className="flex items-center gap-2.5 text-white/50 hover:text-[#F4C430] transition-colors text-sm" data-testid="footer-email">
                  <Mail className="w-3.5 h-3.5 text-[#F4C430]" />{COMPANY_EMAIL}
                </a>
              </div>
            </div>

            <div>
              <h4 className="text-white/40 font-bold text-[10px] uppercase tracking-[0.2em] mb-5">Navigation</h4>
              <ul className="space-y-3">
                {[["home","Home"],["products","Products"],["world","International"],["contact","Contact"]].map(([id, label]) => (
                  <li key={id}>
                    <button onClick={() => scrollTo(id)} className="text-white/40 hover:text-[#F4C430] text-sm transition-colors">
                      {label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="text-white/40 font-bold text-[10px] uppercase tracking-[0.2em] mb-5">Regional Websites</h4>
              <ul className="space-y-3">
                {REGIONAL.map(({ country, url, flag }) => (
                  <li key={country}>
                    <a href={url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-white/40 hover:text-[#F4C430] text-sm transition-colors" data-testid={`footer-${country.toLowerCase()}`}>
                      <span>{flag}</span>{country} <ArrowRight className="w-3 h-3 ml-auto" />
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="border-t border-white/8 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-white/20 text-xs">&copy; {new Date().getFullYear()} GMD Fences. All rights reserved.</p>
            <p className="text-white/15 text-xs">gmdfences.com — International Corporate Hub</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
