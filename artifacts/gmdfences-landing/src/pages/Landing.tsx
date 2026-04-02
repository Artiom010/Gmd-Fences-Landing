import { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Phone, Mail, Menu, X, ChevronDown, ChevronLeft, ChevronRight,
  CheckCircle, ArrowRight, Star, MapPin, Shield, Zap, Award, Wrench
} from "lucide-react";

const contactSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Valid email is required"),
  phone: z.string().optional(),
  message: z.string().min(10, "Message must be at least 10 characters"),
});
type ContactForm = z.infer<typeof contactSchema>;

const COMPANY_PHONE = "+1 (800) 000-0000";
const COMPANY_EMAIL = "info@gmdfences.com";

const fenceTypes = [
  "Louver Fence", "Horizontal Profile Fence", "Horizontal Picket Fence",
  "Vertical Louver Fence", "Picket Fence", "Vertical Profile Fence 20x20",
  "Vertical Profile Fence 40x20", "Inside Profile Fence", "Inside Profile Fence U-45", "Profile Fence LUX",
];
const gateTypes = [
  "Swing Gates", "Wicket Gates / Pedestrian Gates", "Sliding Gate",
  "Cantilever Gate", "Bi-Folding Gate", "Articulated Sliding Gate", "Telescopic Sliding Gate",
];
const automationTypes = [
  "Gate Automation", "Wicket Gate Automation", "Other Automation Solutions",
];

const products = [
  {
    title: "Metal Fence Panels",
    image: "https://www.figma.com/api/mcp/asset/559a62b6-3f6e-4255-849c-3ced4a6da00f",
    tag: "Fences",
  },
  {
    title: "Aluminum Fence Panels",
    image: "https://www.figma.com/api/mcp/asset/a77f2f7c-7a41-4b48-a577-55850af78605",
    tag: "Fences",
  },
  {
    title: "Automated Gate Systems",
    image: "https://www.figma.com/api/mcp/asset/2577c301-0136-4b93-9274-4cde0b08f971",
    tag: "Gates",
  },
];

const advantages = [
  { icon: Award, title: "Commercial Quality", desc: "Manufacturing standards that exceed residential requirements, built to last for decades." },
  { icon: Shield, title: "High Strength & High Security", desc: "Engineered for maximum durability with anti-corrosion treatment and premium materials." },
  { icon: Zap, title: "Anti-Corrosion", desc: "Powder-coated finishes and galvanized steel options protect against all weather conditions." },
  { icon: Wrench, title: "Reasonable Price", desc: "Factory-direct pricing means you get more quality for your investment than with resellers." },
];

const steps = [
  { num: "01", label: "Get a Quote", desc: "Submit your project details and receive a custom quote within 24 hours." },
  { num: "02", label: "Design", desc: "Our team prepares the technical design and material specifications." },
  { num: "03", label: "Production", desc: "Your fence or gate system is manufactured to exact specifications in our facility." },
  { num: "04", label: "Delivery", desc: "Reliable delivery to your location across the USA, on time and intact." },
];

const portfolio = [
  { title: "Fence installation for a private house", address: "address 1", img: "https://www.figma.com/api/mcp/asset/f92305eb-d721-4bad-af6d-943972921380" },
  { title: "Fence installation for a private house", address: "address 2", img: "https://www.figma.com/api/mcp/asset/e0c8e8cf-ca8a-412a-8109-25a7340fafad" },
  { title: "Fence installation for a private house", address: "address 3", img: "https://www.figma.com/api/mcp/asset/709db56c-5b80-4666-b8c8-fb6ae8f20add" },
];

const reviews = [
  {
    name: "John Newton",
    rating: 5,
    text: "Excellent service and product quality. The fence looks amazing and was installed exactly as promised. Highly recommend GMD Fences.",
  },
  {
    name: "Carl Gustavo",
    rating: 5,
    text: "Very professional team. Communication was clear from start to finish. The gate automation system works flawlessly.",
  },
  {
    name: "Sarah Mitchell",
    rating: 5,
    text: "Top quality materials and great craftsmanship. Our property looks completely transformed. Will definitely use them again.",
  },
];

const regionalProjects = [
  { country: "Romania", url: "https://gardurimd.ro", desc: "Official GMD project for Romania", flag: "🇷🇴" },
  { country: "Moldova", url: "https://garduri.md", desc: "Official GMD project for Moldova", flag: "🇲🇩" },
  { country: "Bulgaria", url: "https://ogradigmd.bg", desc: "Official GMD project for Bulgaria", flag: "🇧🇬" },
];

const faqItems = [
  { q: "Do you provide fence and gate solutions in the USA?", a: "Yes. GMD Fences provides information and support for fence systems, gate solutions, automation options and related products in the USA." },
  { q: "Can I request information before the full website is launched?", a: "Yes. You can contact the company by phone or send a request through the email form on this page." },
  { q: "Do you offer gate automation solutions?", a: "Yes. The company presents gate automation, wicket gate automation and other automation solutions." },
  { q: "Where can I find your regional projects?", a: "Links to the official regional projects for Romania, Moldova and Bulgaria are available at the bottom of the page." },
];

// Simple SVG fence icon for the hero overlay
const FencePattern = () => (
  <svg className="absolute inset-0 w-full h-full opacity-[0.04]" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <pattern id="fp" x="0" y="0" width="80" height="100" patternUnits="userSpaceOnUse">
        <rect x="8" y="0" width="8" height="100" fill="white" />
        <rect x="28" y="0" width="8" height="100" fill="white" />
        <rect x="48" y="0" width="8" height="100" fill="white" />
        <rect x="68" y="0" width="8" height="100" fill="white" />
        <rect x="0" y="25" width="80" height="6" fill="white" opacity="0.7" />
        <rect x="0" y="68" width="80" height="6" fill="white" opacity="0.7" />
      </pattern>
    </defs>
    <rect width="100%" height="100%" fill="url(#fp)" />
  </svg>
);

export default function Landing() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [reviewIdx, setReviewIdx] = useState(0);

  const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm<ContactForm>({
    resolver: zodResolver(contactSchema),
    defaultValues: { name: "", email: "", phone: "", message: "" },
  });

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", h);
    return () => window.removeEventListener("scroll", h);
  }, []);

  const scrollTo = (id: string) => {
    setMenuOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  async function onSubmit(data: ContactForm) {
    await new Promise(r => setTimeout(r, 900));
    console.log("Submitted:", data);
    setSubmitted(true);
    reset();
  }

  return (
    <div className="min-h-screen bg-white text-[#1B2537] font-['Inter',sans-serif]">

      {/* ─── HEADER ─────────────────────────────────────────── */}
      <header
        data-testid="header"
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-[#1B2537]/97 backdrop-blur-md shadow-lg"
            : "bg-[#1B2537]/90 backdrop-blur-sm"
        }`}
      >
        {/* Top strip */}
        <div className="border-b border-white/10 py-1.5 hidden lg:block">
          <div className="max-w-7xl mx-auto px-6 flex justify-end items-center gap-6">
            <a href={`tel:${COMPANY_PHONE.replace(/\s/g, "")}`} className="flex items-center gap-1.5 text-white/70 hover:text-[#F4C430] text-xs font-medium transition-colors" data-testid="header-phone-top">
              <Phone className="w-3 h-3" />
              {COMPANY_PHONE}
            </a>
            <a href={`mailto:${COMPANY_EMAIL}`} className="flex items-center gap-1.5 text-white/70 hover:text-[#F4C430] text-xs font-medium transition-colors">
              <Mail className="w-3 h-3" />
              {COMPANY_EMAIL}
            </a>
          </div>
        </div>
        {/* Main nav */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16">
            <a href="#" onClick={e => { e.preventDefault(); scrollTo("home"); }} className="flex items-center gap-2.5" data-testid="logo-link">
              <div className="w-9 h-9 rounded bg-[#F4C430] flex items-center justify-center">
                <span className="text-[#1B2537] font-black text-xs tracking-tight leading-none">GMD</span>
              </div>
              <div className="leading-tight">
                <span className="text-white font-black text-lg tracking-tight block">GMD<span className="text-[#F4C430]">Fences</span></span>
              </div>
            </a>

            <nav className="hidden md:flex items-center gap-7" aria-label="Main navigation">
              {["home","products","contact"].map(id => (
                <button key={id} onClick={() => scrollTo(id)} className="text-white/80 hover:text-[#F4C430] text-sm font-medium capitalize transition-colors" data-testid={`nav-${id}`}>
                  {id.charAt(0).toUpperCase() + id.slice(1)}
                </button>
              ))}
              <a href={`tel:${COMPANY_PHONE.replace(/\s/g, "")}`} className="flex items-center gap-1.5 text-white/80 hover:text-[#F4C430] text-sm font-medium transition-colors lg:hidden">
                <Phone className="w-4 h-4" />
                {COMPANY_PHONE}
              </a>
              <button
                onClick={() => scrollTo("contact")}
                className="px-5 py-2.5 bg-[#F4C430] text-[#1B2537] text-sm font-bold rounded hover:bg-[#e0b020] transition-colors shadow"
                data-testid="header-cta"
              >
                Request Information
              </button>
            </nav>

            <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden text-white p-1" data-testid="menu-toggle">
              {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {menuOpen && (
          <div className="md:hidden bg-[#1B2537] border-t border-white/10 px-4 py-4 flex flex-col gap-1" data-testid="mobile-menu">
            {["home","products","contact"].map(id => (
              <button key={id} onClick={() => scrollTo(id)} className="text-left text-white/80 py-3 border-b border-white/10 text-sm font-medium capitalize">
                {id.charAt(0).toUpperCase() + id.slice(1)}
              </button>
            ))}
            <a href={`tel:${COMPANY_PHONE.replace(/\s/g, "")}`} className="text-[#F4C430] py-3 text-sm font-semibold">{COMPANY_PHONE}</a>
            <button onClick={() => scrollTo("contact")} className="mt-2 w-full py-3 bg-[#F4C430] text-[#1B2537] font-bold text-sm rounded">
              Request Information
            </button>
          </div>
        )}
      </header>

      {/* ─── HERO ───────────────────────────────────────────── */}
      <section id="home" className="relative min-h-screen flex items-center overflow-hidden" data-testid="hero-section">
        {/* Dark background with fence texture */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#0D1520] via-[#1B2537] to-[#0D1520]">
          <FencePattern />
          {/* Subtle gradient overlay bottom */}
          <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-[#0D1520]/80 to-transparent" />
        </div>

        {/* Hero image - right side accent */}
        <div className="absolute right-0 top-0 bottom-0 w-1/2 hidden lg:block overflow-hidden">
          <img
            src={`https://www.figma.com/api/mcp/asset/559a62b6-3f6e-4255-849c-3ced4a6da00f`}
            alt="Custom metal fence panel"
            className="w-full h-full object-cover opacity-30"
            onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#1B2537] via-[#1B2537]/50 to-transparent" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-20">
          <div className="max-w-2xl">
            {/* Stars */}
            <div className="flex items-center gap-1 mb-6">
              {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 text-[#F4C430] fill-[#F4C430]" />)}
              <span className="text-white/60 text-sm ml-2">Commercial Quality for Residential Use</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white leading-tight mb-6" data-testid="hero-heading">
              Custom Fences, Gates<br />
              <span className="text-[#F4C430]">and Automation</span><br />
              Solutions in the USA
            </h1>

            <p className="text-white/70 text-lg leading-relaxed mb-8 max-w-lg" data-testid="hero-subtext">
              GMD Fences provides modern fence systems, gate solutions, automation options and parking control products for residential, commercial and industrial needs in the USA.
            </p>

            <div className="flex flex-wrap gap-4 mb-12">
              <button
                onClick={() => scrollTo("contact")}
                className="px-7 py-3.5 bg-[#F4C430] text-[#1B2537] font-bold text-sm rounded hover:bg-[#e0b020] transition-all shadow-lg flex items-center gap-2"
                data-testid="hero-cta-primary"
              >
                Buy it / Learn More
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => scrollTo("contact")}
                className="px-7 py-3.5 border border-white/30 text-white font-semibold text-sm rounded hover:bg-white/10 transition-all"
                data-testid="hero-cta-secondary"
              >
                Contact Us
              </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 border-t border-white/10 pt-8">
              {[
                { num: "10+", label: "Years Manufacturing" },
                { num: "2M+", label: "Meters Installed" },
                { num: "1000+", label: "Projects Completed" },
              ].map(({ num, label }) => (
                <div key={label}>
                  <p className="text-3xl font-black text-[#F4C430]">{num}</p>
                  <p className="text-white/60 text-xs mt-1">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/40 animate-bounce">
          <ChevronDown className="w-6 h-6" />
        </div>
      </section>

      {/* ─── ABOUT / UNDER DEVELOPMENT + CONTACT ─────────────── */}
      <section id="about" className="py-20 bg-white" data-testid="about-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-start">
            {/* Left: About text */}
            <div>
              <span className="text-[#F4C430] text-sm font-bold uppercase tracking-widest mb-3 block">About Us</span>
              <h2 className="text-3xl sm:text-4xl font-black text-[#1B2537] mb-4" data-testid="under-development-heading">
                Metal Fence and Gate Factory
              </h2>
              <p className="text-[#1B2537]/60 text-sm font-semibold mb-6">Commercial Quality for Residential Use</p>

              {/* Alert */}
              <div className="flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6">
                <div className="w-2 h-2 bg-amber-500 rounded-full mt-1.5 flex-shrink-0 animate-pulse" />
                <div>
                  <p className="text-amber-800 font-bold text-sm mb-1">Website Under Development</p>
                  <p className="text-amber-700 text-sm leading-relaxed">
                    Our full website is currently under development. In the meantime, you can contact GMD Fences for product information, project details, delivery options and consultation across the USA.
                  </p>
                </div>
              </div>

              <p className="text-slate-600 leading-relaxed mb-8">
                GMD Fences is a manufacturing company specializing in custom metal fences, gates, and automation systems. With production facilities and a network of regional partners across Europe, we now serve the USA market with the same high-quality standards our customers expect.
              </p>

              {/* Stats row */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
                {[
                  { val: "10+", label: "In-Home\nManufacturing" },
                  { val: "200+", label: "Production\nCapacity" },
                  { val: "1M+", label: "2 Million\nMeters" },
                  { val: "100%", label: "Precision\nCertified" },
                ].map(({ val, label }) => (
                  <div key={val} className="text-center p-4 bg-slate-50 rounded-xl border border-slate-100">
                    <p className="text-2xl font-black text-[#1B2537]">{val}</p>
                    <p className="text-xs text-slate-500 mt-1 whitespace-pre-line leading-tight">{label}</p>
                  </div>
                ))}
              </div>

              {/* Contact info */}
              <div className="flex flex-col sm:flex-row gap-4">
                <a href={`tel:${COMPANY_PHONE.replace(/\s/g, "")}`} className="flex items-center gap-3 p-4 bg-[#1B2537] rounded-xl hover:bg-[#253447] transition-colors group flex-1" data-testid="contact-phone-link">
                  <div className="w-10 h-10 rounded-lg bg-[#F4C430] flex items-center justify-center flex-shrink-0">
                    <Phone className="w-4 h-4 text-[#1B2537]" />
                  </div>
                  <div>
                    <p className="text-white/50 text-xs">Phone</p>
                    <p className="text-white font-bold text-sm" data-testid="contact-phone">{COMPANY_PHONE}</p>
                  </div>
                </a>
                <a href={`mailto:${COMPANY_EMAIL}`} className="flex items-center gap-3 p-4 bg-slate-50 border border-slate-100 rounded-xl hover:border-[#1B2537]/20 transition-colors group flex-1" data-testid="contact-email-link">
                  <div className="w-10 h-10 rounded-lg bg-[#1B2537] flex items-center justify-center flex-shrink-0">
                    <Mail className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <p className="text-slate-400 text-xs">Email</p>
                    <p className="text-[#1B2537] font-bold text-sm" data-testid="contact-email">{COMPANY_EMAIL}</p>
                  </div>
                </a>
              </div>
            </div>

            {/* Right: Contact form */}
            <div id="contact">
              <span className="text-[#F4C430] text-sm font-bold uppercase tracking-widest mb-3 block">Get In Touch</span>
              <h2 className="text-2xl font-black text-[#1B2537] mb-6">Send Us a Request</h2>

              <div className="bg-[#1B2537] rounded-2xl p-7">
                {submitted ? (
                  <div className="text-center py-12" data-testid="form-success">
                    <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                      <CheckCircle className="w-8 h-8 text-green-400" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">Thank you.</h3>
                    <p className="text-white/60">Your request has been sent.</p>
                    <button onClick={() => setSubmitted(false)} className="mt-6 text-[#F4C430] text-sm font-semibold underline hover:no-underline">
                      Send another request
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" data-testid="contact-form">
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="name" className="block text-white/70 text-xs font-semibold mb-1.5 uppercase tracking-wide">Name *</label>
                        <input
                          id="name"
                          type="text"
                          {...register("name")}
                          className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/10 text-white placeholder-white/30 focus:outline-none focus:border-[#F4C430]/60 focus:bg-white/15 transition-all text-sm"
                          placeholder="Your name"
                          data-testid="input-name"
                        />
                        {errors.name && <p className="text-red-400 text-xs mt-1" data-testid="error-name">{errors.name.message}</p>}
                      </div>
                      <div>
                        <label htmlFor="email" className="block text-white/70 text-xs font-semibold mb-1.5 uppercase tracking-wide">Email *</label>
                        <input
                          id="email"
                          type="email"
                          {...register("email")}
                          className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/10 text-white placeholder-white/30 focus:outline-none focus:border-[#F4C430]/60 focus:bg-white/15 transition-all text-sm"
                          placeholder="your@email.com"
                          data-testid="input-email"
                        />
                        {errors.email && <p className="text-red-400 text-xs mt-1" data-testid="error-email">{errors.email.message}</p>}
                      </div>
                    </div>
                    <div>
                      <label htmlFor="phone" className="block text-white/70 text-xs font-semibold mb-1.5 uppercase tracking-wide">Phone</label>
                      <input
                        id="phone"
                        type="tel"
                        {...register("phone")}
                        className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/10 text-white placeholder-white/30 focus:outline-none focus:border-[#F4C430]/60 focus:bg-white/15 transition-all text-sm"
                        placeholder="+1 (000) 000-0000"
                        data-testid="input-phone"
                      />
                    </div>
                    <div>
                      <label htmlFor="message" className="block text-white/70 text-xs font-semibold mb-1.5 uppercase tracking-wide">Message *</label>
                      <textarea
                        id="message"
                        rows={4}
                        {...register("message")}
                        className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/10 text-white placeholder-white/30 focus:outline-none focus:border-[#F4C430]/60 focus:bg-white/15 transition-all text-sm resize-none"
                        placeholder="Describe your project..."
                        data-testid="input-message"
                      />
                      {errors.message && <p className="text-red-400 text-xs mt-1" data-testid="error-message">{errors.message.message}</p>}
                    </div>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full py-3.5 bg-[#F4C430] text-[#1B2537] font-bold rounded-lg hover:bg-[#e0b020] transition-all disabled:opacity-60 flex items-center justify-center gap-2 text-sm"
                      data-testid="button-submit"
                    >
                      {isSubmitting ? <span className="w-5 h-5 border-2 border-[#1B2537]/30 border-t-[#1B2537] rounded-full animate-spin" /> : <>Send Request <ArrowRight className="w-4 h-4" /></>}
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── MANUFACTURING / DELIVERY ────────────────────────── */}
      <section className="py-20 bg-[#1B2537] relative overflow-hidden" data-testid="manufacturing-section">
        <FencePattern />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="text-[#F4C430] text-sm font-bold uppercase tracking-widest mb-3 block">Our Capabilities</span>
              <h2 className="text-3xl sm:text-4xl font-black text-white mb-6" data-testid="manufacturing-heading">
                Manufacturing, Installation<br />and Delivery in the USA
              </h2>
              <p className="text-white/70 leading-relaxed mb-8">
                GMD Fences offers fence and gate manufacturing, professional installation support and reliable delivery solutions across the USA. We focus on durable systems for residential, commercial and industrial properties, combining modern design, practical engineering and dependable service.
              </p>
              <button onClick={() => scrollTo("contact")} className="px-6 py-3.5 bg-[#F4C430] text-[#1B2537] font-bold rounded hover:bg-[#e0b020] transition-all flex items-center gap-2 text-sm" data-testid="manufacturing-cta">
                Request a Quote <ArrowRight className="w-4 h-4" />
              </button>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { Icon: Wrench, label: "In-house Manufacturing", desc: "Full production control for consistent quality" },
                { Icon: CheckCircle, label: "Professional Installation", desc: "Certified installation teams" },
                { Icon: MapPin, label: "USA-Wide Delivery", desc: "Reliable logistics to your site" },
                { Icon: Shield, label: "Quality Guarantee", desc: "All products precision-certified" },
              ].map(({ Icon, label, desc }) => (
                <div key={label} className="bg-white/5 border border-white/10 rounded-xl p-5 hover:bg-white/10 transition-all">
                  <Icon className="w-6 h-6 text-[#F4C430] mb-3" />
                  <p className="text-white font-bold text-sm mb-1">{label}</p>
                  <p className="text-white/50 text-xs leading-relaxed">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─── OUR PRODUCTS ─────────────────────────────────────── */}
      <section id="products" className="py-20 bg-[#F8F9FA]" data-testid="products-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <span className="text-[#F4C430] text-sm font-bold uppercase tracking-widest mb-3 block">What We Offer</span>
            <h2 className="text-3xl sm:text-4xl font-black text-[#1B2537]" data-testid="products-heading">Our Main Product and Service Categories</h2>
          </div>

          {/* Product image cards */}
          <div className="grid sm:grid-cols-3 gap-6 mb-14">
            {products.map(({ title, image, tag }) => (
              <div key={title} className="group relative rounded-2xl overflow-hidden bg-[#1B2537] aspect-[4/3] shadow-lg">
                <img src={image} alt={title} className="w-full h-full object-cover opacity-70 group-hover:opacity-90 group-hover:scale-105 transition-all duration-500"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300"><rect fill="%23253447" width="400" height="300"/><text fill="%23F4C430" x="50%" y="50%" font-family="Inter,sans-serif" font-size="16" text-anchor="middle" dominant-baseline="middle">Fence Product</text></svg>';
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1B2537] via-transparent to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-5">
                  <span className="inline-block text-[#F4C430] text-xs font-bold uppercase tracking-wider mb-1">{tag}</span>
                  <p className="text-white font-bold text-base">{title}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Category lists */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Fences */}
            <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm" data-testid="category-fences">
              <div className="w-11 h-11 rounded-xl bg-[#1B2537] flex items-center justify-center mb-4">
                <svg className="w-5 h-5 text-[#F4C430]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                  <line x1="4" y1="3" x2="4" y2="21" /><line x1="9" y1="3" x2="9" y2="21" />
                  <line x1="14" y1="3" x2="14" y2="21" /><line x1="19" y1="3" x2="19" y2="21" />
                  <line x1="2" y1="8" x2="22" y2="8" /><line x1="2" y1="16" x2="22" y2="16" />
                </svg>
              </div>
              <h3 className="text-base font-black text-[#1B2537] mb-4 border-b border-slate-100 pb-3" data-testid="heading-fences">Fences</h3>
              <ul className="space-y-2">
                {fenceTypes.map(t => <li key={t} className="flex items-start gap-2 text-xs text-slate-600"><span className="w-1.5 h-1.5 rounded-full bg-[#F4C430] mt-1.5 flex-shrink-0" />{t}</li>)}
              </ul>
            </div>

            {/* Gates */}
            <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm" data-testid="category-gates">
              <div className="w-11 h-11 rounded-xl bg-[#1B2537] flex items-center justify-center mb-4">
                <svg className="w-5 h-5 text-[#F4C430]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                  <rect x="2" y="6" width="9" height="15" rx="1" /><rect x="13" y="6" width="9" height="15" rx="1" />
                  <line x1="11" y1="12" x2="13" y2="12" /><line x1="2" y1="3" x2="22" y2="3" />
                </svg>
              </div>
              <h3 className="text-base font-black text-[#1B2537] mb-4 border-b border-slate-100 pb-3" data-testid="heading-gates">Gates</h3>
              <ul className="space-y-2">
                {gateTypes.map(t => <li key={t} className="flex items-start gap-2 text-xs text-slate-600"><span className="w-1.5 h-1.5 rounded-full bg-[#F4C430] mt-1.5 flex-shrink-0" />{t}</li>)}
              </ul>
            </div>

            {/* Automation */}
            <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm" data-testid="category-automation">
              <div className="w-11 h-11 rounded-xl bg-[#1B2537] flex items-center justify-center mb-4">
                <Zap className="w-5 h-5 text-[#F4C430]" />
              </div>
              <h3 className="text-base font-black text-[#1B2537] mb-4 border-b border-slate-100 pb-3" data-testid="heading-automation">Automation</h3>
              <ul className="space-y-2">
                {automationTypes.map(t => <li key={t} className="flex items-start gap-2 text-xs text-slate-600"><span className="w-1.5 h-1.5 rounded-full bg-[#F4C430] mt-1.5 flex-shrink-0" />{t}</li>)}
              </ul>
            </div>

            {/* Parking Blockers */}
            <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm" data-testid="category-parking">
              <div className="w-11 h-11 rounded-xl bg-[#1B2537] flex items-center justify-center mb-4">
                <svg className="w-5 h-5 text-[#F4C430]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                  <rect x="3" y="11" width="18" height="10" rx="2" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
              </div>
              <h3 className="text-base font-black text-[#1B2537] mb-4 border-b border-slate-100 pb-3" data-testid="heading-parking">Parking Blockers</h3>
              <ul className="space-y-2">
                <li className="flex items-start gap-2 text-xs text-slate-600"><span className="w-1.5 h-1.5 rounded-full bg-[#F4C430] mt-1.5 flex-shrink-0" />Parking Blockers</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ─── ADVANTAGES ───────────────────────────────────────── */}
      <section className="py-20 bg-white" data-testid="advantages-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <span className="text-[#F4C430] text-sm font-bold uppercase tracking-widest mb-3 block">Why Us</span>
            <h2 className="text-3xl sm:text-4xl font-black text-[#1B2537]" data-testid="advantages-heading">Why Choose GMD Fences</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {advantages.map(({ icon: Icon, title, desc }, i) => (
              <div key={i} className="text-center group p-6 rounded-2xl hover:bg-[#F8F9FA] transition-all border border-transparent hover:border-slate-100" data-testid={`advantage-${i}`}>
                <div className="w-16 h-16 rounded-2xl bg-[#1B2537] flex items-center justify-center mx-auto mb-5 group-hover:bg-[#253447] transition-colors">
                  <Icon className="w-7 h-7 text-[#F4C430]" />
                </div>
                <h3 className="text-sm font-black text-[#1B2537] mb-3">{title}</h3>
                <p className="text-slate-500 text-xs leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── HOW TO ORDER ─────────────────────────────────────── */}
      <section className="py-20 bg-[#F8F9FA]" data-testid="order-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <span className="text-[#F4C430] text-sm font-bold uppercase tracking-widest mb-3 block">Process</span>
            <h2 className="text-3xl sm:text-4xl font-black text-[#1B2537]">How to Place an Order</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map(({ num, label, desc }, i) => (
              <div key={i} className="relative">
                {i < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-8 left-[calc(50%+2.5rem)] right-[-50%] h-px bg-slate-200" />
                )}
                <div className="text-center">
                  <div className="w-16 h-16 rounded-2xl bg-[#1B2537] flex items-center justify-center mx-auto mb-4 relative z-10">
                    <span className="text-[#F4C430] font-black text-lg">{num}</span>
                  </div>
                  <h3 className="text-sm font-black text-[#1B2537] mb-2">{label}</h3>
                  <p className="text-slate-500 text-xs leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── PORTFOLIO ────────────────────────────────────────── */}
      <section className="py-20 bg-white" data-testid="portfolio-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-12">
            <div>
              <span className="text-[#F4C430] text-sm font-bold uppercase tracking-widest mb-3 block">Our Work</span>
              <h2 className="text-3xl sm:text-4xl font-black text-[#1B2537]">Portfolio</h2>
            </div>
            <button onClick={() => scrollTo("contact")} className="text-[#1B2537] text-sm font-bold flex items-center gap-1.5 hover:text-[#F4C430] transition-colors">
              See All <ChevronRight className="w-4 h-4" />
            </button>
          </div>
          <div className="grid sm:grid-cols-3 gap-6">
            {portfolio.map(({ title, address, img }, i) => (
              <div key={i} className="group rounded-2xl overflow-hidden bg-slate-100 shadow-sm hover:shadow-lg transition-shadow" data-testid={`portfolio-${i}`}>
                <div className="aspect-[4/3] overflow-hidden">
                  <img src={img} alt={title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300"><rect fill="%23253447" width="400" height="300"/><text fill="%23F4C430" x="50%" y="50%" font-family="Inter" font-size="14" text-anchor="middle" dominant-baseline="middle">Fence Installation</text></svg>';
                    }}
                  />
                </div>
                <div className="p-5">
                  <p className="text-[#1B2537] font-bold text-sm mb-1">{title}</p>
                  <div className="flex items-center gap-1 text-slate-400 text-xs">
                    <MapPin className="w-3 h-3" />
                    {address}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── REVIEWS ──────────────────────────────────────────── */}
      <section className="py-20 bg-[#F8F9FA]" data-testid="reviews-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-12">
            <div>
              <span className="text-[#F4C430] text-sm font-bold uppercase tracking-widest mb-3 block">Testimonials</span>
              <h2 className="text-3xl sm:text-4xl font-black text-[#1B2537]">Reviews from Clients</h2>
            </div>
            <div className="flex gap-2">
              <button onClick={() => setReviewIdx(Math.max(0, reviewIdx - 1))} className="w-10 h-10 rounded-xl border border-slate-200 flex items-center justify-center hover:border-[#1B2537] hover:text-[#1B2537] transition-colors text-slate-400">
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button onClick={() => setReviewIdx(Math.min(reviews.length - 1, reviewIdx + 1))} className="w-10 h-10 rounded-xl border border-slate-200 flex items-center justify-center hover:border-[#1B2537] hover:text-[#1B2537] transition-colors text-slate-400">
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
          <div className="grid sm:grid-cols-3 gap-6">
            {reviews.map(({ name, rating, text }, i) => (
              <div key={i} className={`bg-white rounded-2xl p-6 border shadow-sm transition-all ${i === reviewIdx ? "border-[#1B2537]" : "border-slate-100"}`} data-testid={`review-${i}`}>
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(rating)].map((_, s) => <Star key={s} className="w-4 h-4 text-[#F4C430] fill-[#F4C430]" />)}
                </div>
                <p className="text-slate-600 text-sm leading-relaxed mb-5">{text}</p>
                <div className="flex items-center gap-3 border-t border-slate-100 pt-4">
                  <div className="w-9 h-9 rounded-full bg-[#1B2537] flex items-center justify-center text-[#F4C430] font-bold text-sm">
                    {name.charAt(0)}
                  </div>
                  <div>
                    <p className="text-[#1B2537] font-bold text-sm">{name}</p>
                    <p className="text-slate-400 text-xs">Verified Client</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── REGIONAL PROJECTS ────────────────────────────────── */}
      <section className="py-20 bg-[#1B2537] relative overflow-hidden" data-testid="regional-section">
        <FencePattern />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <span className="text-[#F4C430] text-sm font-bold uppercase tracking-widest mb-3 block">International Brand</span>
            <h2 className="text-3xl sm:text-4xl font-black text-white mb-4" data-testid="regional-heading">Our Regional Projects</h2>
            <p className="text-white/60 max-w-xl mx-auto text-sm">GMD Fences operates official regional platforms across Europe. Our international presence ensures consistent quality standards worldwide.</p>
          </div>
          <div className="grid sm:grid-cols-3 gap-6 max-w-3xl mx-auto">
            {regionalProjects.map(({ country, url, desc, flag }) => (
              <a
                key={country}
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="group bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/10 hover:border-[#F4C430]/40 transition-all hover:-translate-y-1"
                data-testid={`regional-${country.toLowerCase()}`}
              >
                <div className="text-4xl mb-4">{flag}</div>
                <h3 className="text-white font-black text-lg mb-2 flex items-center gap-2">
                  {country}
                  <ArrowRight className="w-4 h-4 text-[#F4C430] opacity-0 group-hover:opacity-100 transition-opacity" />
                </h3>
                <p className="text-white/50 text-xs mb-3">{desc}</p>
                <span className="text-[#F4C430] text-xs font-semibold">{url}</span>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ─── FAQ ──────────────────────────────────────────────── */}
      <section className="py-20 bg-white" data-testid="faq-section">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-14">
            <span className="text-[#F4C430] text-sm font-bold uppercase tracking-widest mb-3 block">FAQ</span>
            <h2 className="text-3xl sm:text-4xl font-black text-[#1B2537]" data-testid="faq-heading">Frequently Asked Questions</h2>
          </div>
          <div className="space-y-3">
            {faqItems.map(({ q, a }, i) => (
              <div key={i} className="border border-slate-100 rounded-xl overflow-hidden" data-testid={`faq-item-${i}`}>
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-start justify-between gap-4 px-6 py-5 text-left hover:bg-slate-50 transition-colors"
                  data-testid={`faq-toggle-${i}`}
                >
                  <h3 className="text-sm font-bold text-[#1B2537] leading-relaxed">{q}</h3>
                  <ChevronDown className={`w-5 h-5 text-[#F4C430] flex-shrink-0 mt-0.5 transition-transform duration-200 ${openFaq === i ? "rotate-180" : ""}`} />
                </button>
                {openFaq === i && (
                  <div className="px-6 pb-5" data-testid={`faq-answer-${i}`}>
                    <p className="text-slate-600 text-sm leading-relaxed border-t border-slate-100 pt-4">{a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── FOOTER ───────────────────────────────────────────── */}
      <footer className="bg-[#0D1520] text-white py-14" data-testid="footer">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
            {/* Brand */}
            <div className="lg:col-span-2">
              <div className="flex items-center gap-2.5 mb-5">
                <div className="w-9 h-9 rounded bg-[#F4C430] flex items-center justify-center">
                  <span className="text-[#1B2537] font-black text-xs tracking-tight">GMD</span>
                </div>
                <span className="font-black text-xl tracking-tight">GMD<span className="text-[#F4C430]">Fences</span></span>
              </div>
              <p className="text-white/50 text-sm leading-relaxed max-w-xs mb-6">
                Custom fences, gates, automation and parking blockers for residential, commercial and industrial properties in the USA.
              </p>
              <div className="space-y-3">
                <a href={`tel:${COMPANY_PHONE.replace(/\s/g, "")}`} className="flex items-center gap-2 text-white/60 hover:text-[#F4C430] transition-colors text-sm" data-testid="footer-phone">
                  <Phone className="w-4 h-4 text-[#F4C430] flex-shrink-0" />
                  {COMPANY_PHONE}
                </a>
                <a href={`mailto:${COMPANY_EMAIL}`} className="flex items-center gap-2 text-white/60 hover:text-[#F4C430] transition-colors text-sm" data-testid="footer-email">
                  <Mail className="w-4 h-4 text-[#F4C430] flex-shrink-0" />
                  {COMPANY_EMAIL}
                </a>
              </div>
            </div>

            <div>
              <h4 className="text-white font-bold text-xs uppercase tracking-widest mb-5">Navigation</h4>
              <ul className="space-y-3">
                {["Home", "Products", "Contact"].map(item => (
                  <li key={item}>
                    <button onClick={() => scrollTo(item.toLowerCase())} className="text-white/50 hover:text-[#F4C430] text-sm transition-colors">
                      {item}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="text-white font-bold text-xs uppercase tracking-widest mb-5">Regional Projects</h4>
              <ul className="space-y-3">
                {regionalProjects.map(({ country, url }) => (
                  <li key={country}>
                    <a href={url} target="_blank" rel="noopener noreferrer" className="text-white/50 hover:text-[#F4C430] text-sm transition-colors flex items-center gap-1.5" data-testid={`footer-regional-${country.toLowerCase()}`}>
                      {country} <ArrowRight className="w-3 h-3" />
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="border-t border-white/10 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-white/30 text-xs">&copy; {new Date().getFullYear()} GMD Fences. All rights reserved.</p>
            <p className="text-white/20 text-xs">gmdfences.com</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
