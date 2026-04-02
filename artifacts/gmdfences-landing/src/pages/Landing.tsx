import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Shield, Zap, Globe, Phone, Mail, ChevronDown, Menu, X,
  CheckCircle, ArrowRight, MapPin, Building2, Factory, Home
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
  "Louver Fence",
  "Horizontal Profile Fence",
  "Horizontal Picket Fence",
  "Vertical Louver Fence",
  "Picket Fence",
  "Vertical Profile Fence 20x20",
  "Vertical Profile Fence 40x20",
  "Inside Profile Fence",
  "Inside Profile Fence U-45",
  "Profile Fence LUX",
];

const gateTypes = [
  "Swing Gates",
  "Wicket Gates / Pedestrian Gates",
  "Sliding Gate",
  "Cantilever Gate",
  "Bi-Folding Gate",
  "Articulated Sliding Gate",
  "Telescopic Sliding Gate",
];

const automationTypes = [
  "Gate Automation",
  "Wicket Gate Automation",
  "Other Automation Solutions",
];

const parkingBlockers = ["Parking Blockers"];

const advantages = [
  { icon: Shield, text: "Modern fence and gate systems" },
  { icon: Building2, text: "Solutions for residential, commercial and industrial properties" },
  { icon: Zap, text: "Engineering-focused approach" },
  { icon: CheckCircle, text: "Reliable communication and project support" },
  { icon: Globe, text: "International company structure with regional projects" },
];

const regionalProjects = [
  {
    country: "Romania",
    url: "https://gardurimd.ro",
    description: "Official GMD project for Romania — custom fences and gates manufactured and installed across the country.",
    flag: "🇷🇴",
  },
  {
    country: "Moldova",
    url: "https://garduri.md",
    description: "Official GMD project for Moldova — complete fencing solutions for residential and commercial properties.",
    flag: "🇲🇩",
  },
  {
    country: "Bulgaria",
    url: "https://ogradigmd.bg",
    description: "Official GMD project for Bulgaria — high-quality fence and gate systems with professional installation.",
    flag: "🇧🇬",
  },
];

const faqItems = [
  {
    q: "Do you provide fence and gate solutions in the USA?",
    a: "Yes. GMD Fences provides information and support for fence systems, gate solutions, automation options and related products in the USA.",
  },
  {
    q: "Can I request information before the full website is launched?",
    a: "Yes. You can contact the company by phone or send a request through the email form on this page.",
  },
  {
    q: "Do you offer gate automation solutions?",
    a: "Yes. The company presents gate automation, wicket gate automation and other automation solutions.",
  },
  {
    q: "Where can I find your regional projects?",
    a: "Links to the official regional projects for Romania, Moldova and Bulgaria are available at the bottom of the page.",
  },
];

export default function Landing() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm<ContactForm>({
    resolver: zodResolver(contactSchema),
  });

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  async function onSubmit(data: ContactForm) {
    await new Promise(r => setTimeout(r, 800));
    console.log("Form submitted:", data);
    setSubmitted(true);
    reset();
  }

  const scrollTo = (id: string) => {
    setMenuOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-[#f8f9fb] text-[#0d1a2d]">
      {/* HEADER */}
      <header
        data-testid="header"
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? "bg-white/95 backdrop-blur-md shadow-sm border-b border-slate-100" : "bg-transparent"}`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-18">
            {/* Logo */}
            <a href="#" onClick={e => { e.preventDefault(); scrollTo("home"); }} className="flex items-center gap-2 group" data-testid="logo-link">
              <div className="w-9 h-9 rounded-lg bg-[#0d2d6e] flex items-center justify-center shadow">
                <span className="text-white font-black text-sm tracking-tight">GMD</span>
              </div>
              <span className="font-black text-xl text-[#0d2d6e] tracking-tight hidden sm:block">GMD<span className="text-[#f59e0b]">Fences</span></span>
            </a>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-6" aria-label="Main navigation">
              <button onClick={() => scrollTo("home")} className="text-sm font-medium text-slate-600 hover:text-[#0d2d6e] transition-colors" data-testid="nav-home">Home</button>
              <button onClick={() => scrollTo("products")} className="text-sm font-medium text-slate-600 hover:text-[#0d2d6e] transition-colors" data-testid="nav-products">Products</button>
              <button onClick={() => scrollTo("contact")} className="text-sm font-medium text-slate-600 hover:text-[#0d2d6e] transition-colors" data-testid="nav-contact">Contact</button>
              <a href={`tel:${COMPANY_PHONE.replace(/\s/g, "")}`} className="text-sm font-semibold text-[#0d2d6e] hover:text-[#1a3f8f] transition-colors flex items-center gap-1.5" data-testid="header-phone">
                <Phone className="w-3.5 h-3.5" />
                {COMPANY_PHONE}
              </a>
              <button
                onClick={() => scrollTo("contact")}
                className="px-4 py-2 bg-[#0d2d6e] text-white text-sm font-semibold rounded-lg hover:bg-[#1a3f8f] transition-colors shadow-sm"
                data-testid="header-cta"
              >
                Request Information
              </button>
            </nav>

            {/* Mobile menu toggle */}
            <div className="flex md:hidden items-center gap-3">
              <a href={`tel:${COMPANY_PHONE.replace(/\s/g, "")}`} className="text-[#0d2d6e]" data-testid="mobile-phone">
                <Phone className="w-5 h-5" />
              </a>
              <button onClick={() => setMenuOpen(!menuOpen)} className="text-slate-700 p-1" data-testid="menu-toggle" aria-label="Toggle menu">
                {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile nav */}
        {menuOpen && (
          <div className="md:hidden bg-white border-t border-slate-100 shadow-lg px-4 py-4 flex flex-col gap-3" data-testid="mobile-menu">
            <button onClick={() => scrollTo("home")} className="text-left text-sm font-medium text-slate-700 py-2 border-b border-slate-50">Home</button>
            <button onClick={() => scrollTo("products")} className="text-left text-sm font-medium text-slate-700 py-2 border-b border-slate-50">Products</button>
            <button onClick={() => scrollTo("contact")} className="text-left text-sm font-medium text-slate-700 py-2 border-b border-slate-50">Contact</button>
            <a href={`tel:${COMPANY_PHONE.replace(/\s/g, "")}`} className="text-sm font-semibold text-[#0d2d6e] py-2 flex items-center gap-2">{COMPANY_PHONE}</a>
            <button
              onClick={() => scrollTo("contact")}
              className="w-full py-2.5 bg-[#0d2d6e] text-white text-sm font-semibold rounded-lg"
            >
              Request Information
            </button>
          </div>
        )}
      </header>

      {/* HERO */}
      <section id="home" className="relative min-h-screen flex items-center overflow-hidden" data-testid="hero-section">
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#071524] via-[#0d2d6e] to-[#0a1f4e]">
          <div className="absolute inset-0 opacity-10">
            <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="fence-pattern" x="0" y="0" width="60" height="80" patternUnits="userSpaceOnUse">
                  <rect x="5" y="0" width="6" height="80" fill="white" rx="1" />
                  <rect x="19" y="0" width="6" height="80" fill="white" rx="1" />
                  <rect x="33" y="0" width="6" height="80" fill="white" rx="1" />
                  <rect x="47" y="0" width="6" height="80" fill="white" rx="1" />
                  <rect x="0" y="20" width="60" height="5" fill="white" rx="1" opacity="0.6" />
                  <rect x="0" y="55" width="60" height="5" fill="white" rx="1" opacity="0.6" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#fence-pattern)" />
            </svg>
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-[#071524]/60 via-transparent to-transparent" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16 lg:pt-32">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-1.5 mb-6">
              <span className="w-2 h-2 bg-[#f59e0b] rounded-full animate-pulse" />
              <span className="text-white/90 text-sm font-medium">Serving the USA</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white leading-tight mb-6" data-testid="hero-heading">
              Custom Fences, Gates<br />
              <span className="text-[#f59e0b]">and Automation Solutions</span>
              <br />in the USA
            </h1>

            <p className="text-lg text-white/80 max-w-xl mb-10 leading-relaxed" data-testid="hero-subtext">
              GMD Fences provides modern fence systems, gate solutions, automation options and parking control products for residential, commercial and industrial needs in the USA.
            </p>

            <div className="flex flex-wrap gap-4">
              <button
                onClick={() => scrollTo("contact")}
                className="px-6 py-3.5 bg-[#f59e0b] text-white font-bold rounded-xl hover:bg-[#d97706] transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 flex items-center gap-2"
                data-testid="hero-cta-primary"
              >
                Request Information
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => scrollTo("contact")}
                className="px-6 py-3.5 bg-white/10 backdrop-blur-sm border border-white/30 text-white font-semibold rounded-xl hover:bg-white/20 transition-all"
                data-testid="hero-cta-secondary"
              >
                Contact Us
              </button>
            </div>

            <div className="mt-12 flex flex-wrap gap-6">
              {[
                { Icon: Home, label: "Residential" },
                { Icon: Building2, label: "Commercial" },
                { Icon: Factory, label: "Industrial" },
              ].map(({ Icon, label }) => (
                <div key={label} className="flex items-center gap-2 text-white/70">
                  <Icon className="w-4 h-4 text-[#f59e0b]" />
                  <span className="text-sm font-medium">{label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/50 animate-bounce">
          <ChevronDown className="w-6 h-6" />
        </div>
      </section>

      {/* UNDER DEVELOPMENT + CONTACT */}
      <section id="contact" className="py-20 bg-white" data-testid="contact-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center mb-10">
            <div className="inline-flex items-center gap-2 bg-amber-50 border border-amber-200 text-amber-700 rounded-full px-4 py-1.5 mb-6 text-sm font-semibold">
              <span className="w-2 h-2 bg-amber-500 rounded-full animate-pulse" />
              Site Under Development
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-[#0d2d6e] mb-4" data-testid="under-development-heading">Website Under Development</h2>
            <p className="text-slate-600 text-lg leading-relaxed">
              Our full website is currently under development. In the meantime, you can contact GMD Fences for product information, project details, delivery options and consultation across the USA.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-10 items-start max-w-5xl mx-auto">
            {/* Contact info */}
            <div>
              <h3 className="text-xl font-bold text-[#0d2d6e] mb-6">Get in Touch</h3>
              <div className="space-y-5">
                <a
                  href={`tel:${COMPANY_PHONE.replace(/\s/g, "")}`}
                  className="flex items-center gap-4 p-5 bg-slate-50 rounded-2xl border border-slate-100 hover:border-[#0d2d6e]/20 hover:bg-blue-50 transition-all group"
                  data-testid="contact-phone-link"
                >
                  <div className="w-12 h-12 rounded-xl bg-[#0d2d6e] flex items-center justify-center flex-shrink-0 group-hover:bg-[#1a3f8f] transition-colors">
                    <Phone className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 font-medium uppercase tracking-wide mb-0.5">Phone</p>
                    <p className="text-lg font-bold text-[#0d2d6e]" data-testid="contact-phone">{COMPANY_PHONE}</p>
                  </div>
                </a>

                <a
                  href={`mailto:${COMPANY_EMAIL}`}
                  className="flex items-center gap-4 p-5 bg-slate-50 rounded-2xl border border-slate-100 hover:border-[#0d2d6e]/20 hover:bg-blue-50 transition-all group"
                  data-testid="contact-email-link"
                >
                  <div className="w-12 h-12 rounded-xl bg-[#f59e0b] flex items-center justify-center flex-shrink-0">
                    <Mail className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 font-medium uppercase tracking-wide mb-0.5">Email</p>
                    <p className="text-lg font-bold text-[#0d2d6e]" data-testid="contact-email">{COMPANY_EMAIL}</p>
                  </div>
                </a>

                <div className="flex items-start gap-4 p-5 bg-slate-50 rounded-2xl border border-slate-100">
                  <div className="w-12 h-12 rounded-xl bg-slate-200 flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-5 h-5 text-slate-500" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 font-medium uppercase tracking-wide mb-0.5">Service Area</p>
                    <p className="text-base font-semibold text-slate-700">United States of America</p>
                    <p className="text-sm text-slate-500">Residential, Commercial & Industrial</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact form */}
            <div className="bg-slate-50 rounded-2xl p-6 sm:p-8 border border-slate-100">
              {submitted ? (
                <div className="text-center py-8" data-testid="form-success">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="w-8 h-8 text-green-600" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-800 mb-2">Thank you.</h3>
                  <p className="text-slate-600">Your request has been sent. We will get back to you shortly.</p>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="mt-6 text-sm text-[#0d2d6e] font-semibold underline hover:no-underline"
                  >
                    Send another request
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" data-testid="contact-form">
                  <h3 className="text-lg font-bold text-[#0d2d6e] mb-5">Send a Request</h3>

                  <div>
                    <label htmlFor="name" className="block text-sm font-semibold text-slate-700 mb-1.5">Name <span className="text-red-500">*</span></label>
                    <input
                      id="name"
                      type="text"
                      {...register("name")}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0d2d6e]/30 focus:border-[#0d2d6e] transition-all text-sm"
                      placeholder="Your full name"
                      data-testid="input-name"
                    />
                    {errors.name && <p className="text-red-500 text-xs mt-1" data-testid="error-name">{errors.name.message}</p>}
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-semibold text-slate-700 mb-1.5">Email <span className="text-red-500">*</span></label>
                    <input
                      id="email"
                      type="email"
                      {...register("email")}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0d2d6e]/30 focus:border-[#0d2d6e] transition-all text-sm"
                      placeholder="your@email.com"
                      data-testid="input-email"
                    />
                    {errors.email && <p className="text-red-500 text-xs mt-1" data-testid="error-email">{errors.email.message}</p>}
                  </div>

                  <div>
                    <label htmlFor="phone" className="block text-sm font-semibold text-slate-700 mb-1.5">Phone</label>
                    <input
                      id="phone"
                      type="tel"
                      {...register("phone")}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0d2d6e]/30 focus:border-[#0d2d6e] transition-all text-sm"
                      placeholder="+1 (000) 000-0000"
                      data-testid="input-phone"
                    />
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-sm font-semibold text-slate-700 mb-1.5">Message <span className="text-red-500">*</span></label>
                    <textarea
                      id="message"
                      rows={4}
                      {...register("message")}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0d2d6e]/30 focus:border-[#0d2d6e] transition-all text-sm resize-none"
                      placeholder="Describe your project or inquiry..."
                      data-testid="input-message"
                    />
                    {errors.message && <p className="text-red-500 text-xs mt-1" data-testid="error-message">{errors.message.message}</p>}
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3.5 bg-[#0d2d6e] text-white font-bold rounded-xl hover:bg-[#1a3f8f] transition-all disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
                    data-testid="button-submit"
                  >
                    {isSubmitting ? (
                      <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <>Send Request <ArrowRight className="w-4 h-4" /></>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* MANUFACTURING, INSTALLATION & DELIVERY */}
      <section className="py-20 bg-gradient-to-br from-[#0d2d6e] to-[#071524]" data-testid="manufacturing-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl sm:text-4xl font-black text-white mb-6" data-testid="manufacturing-heading">
                Manufacturing, Installation<br />and Delivery in the USA
              </h2>
              <p className="text-white/80 text-lg leading-relaxed mb-8">
                GMD Fences offers fence and gate manufacturing, professional installation support and reliable delivery solutions across the USA. We focus on durable systems for residential, commercial and industrial properties, combining modern design, practical engineering and dependable service.
              </p>
              <button
                onClick={() => scrollTo("contact")}
                className="px-6 py-3.5 bg-[#f59e0b] text-white font-bold rounded-xl hover:bg-[#d97706] transition-all shadow-lg flex items-center gap-2 inline-flex"
                data-testid="manufacturing-cta"
              >
                Request a Quote
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: "Manufacturing", desc: "In-house production for consistent quality", icon: Factory },
                { label: "Installation", desc: "Professional installation teams", icon: CheckCircle },
                { label: "Delivery", desc: "Reliable logistics across the USA", icon: MapPin },
                { label: "Consultation", desc: "Expert guidance on every project", icon: Shield },
              ].map(({ label, desc, icon: Icon }) => (
                <div key={label} className="bg-white/10 backdrop-blur-sm border border-white/10 rounded-2xl p-5 hover:bg-white/15 transition-all">
                  <Icon className="w-6 h-6 text-[#f59e0b] mb-3" />
                  <p className="text-white font-bold text-sm mb-1">{label}</p>
                  <p className="text-white/60 text-xs leading-relaxed">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* PRODUCT CATEGORIES */}
      <section id="products" className="py-20 bg-white" data-testid="products-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <span className="text-xs font-bold uppercase tracking-widest text-[#f59e0b] mb-3 block">What We Offer</span>
            <h2 className="text-3xl sm:text-4xl font-black text-[#0d2d6e] mb-4" data-testid="products-heading">Our Main Product and Service Categories</h2>
            <p className="text-slate-500 max-w-xl mx-auto">From decorative fences to automated gate systems — we cover every aspect of property access and security.</p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Fences */}
            <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100" data-testid="category-fences">
              <div className="w-12 h-12 bg-[#0d2d6e] rounded-xl flex items-center justify-center mb-5">
                <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="4" y1="3" x2="4" y2="21" />
                  <line x1="9" y1="3" x2="9" y2="21" />
                  <line x1="14" y1="3" x2="14" y2="21" />
                  <line x1="19" y1="3" x2="19" y2="21" />
                  <line x1="2" y1="8" x2="22" y2="8" />
                  <line x1="2" y1="16" x2="22" y2="16" />
                </svg>
              </div>
              <h3 className="text-lg font-black text-[#0d2d6e] mb-4" data-testid="heading-fences">Fences</h3>
              <ul className="space-y-2">
                {fenceTypes.map(item => (
                  <li key={item} className="flex items-start gap-2 text-sm text-slate-600">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#f59e0b] mt-1.5 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* Gates */}
            <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100" data-testid="category-gates">
              <div className="w-12 h-12 bg-[#0d2d6e] rounded-xl flex items-center justify-center mb-5">
                <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="2" y="6" width="9" height="15" rx="1" />
                  <rect x="13" y="6" width="9" height="15" rx="1" />
                  <line x1="11" y1="12" x2="13" y2="12" />
                  <line x1="2" y1="3" x2="22" y2="3" />
                </svg>
              </div>
              <h3 className="text-lg font-black text-[#0d2d6e] mb-4" data-testid="heading-gates">Gates</h3>
              <ul className="space-y-2">
                {gateTypes.map(item => (
                  <li key={item} className="flex items-start gap-2 text-sm text-slate-600">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#f59e0b] mt-1.5 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* Automation */}
            <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100" data-testid="category-automation">
              <div className="w-12 h-12 bg-[#0d2d6e] rounded-xl flex items-center justify-center mb-5">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-black text-[#0d2d6e] mb-4" data-testid="heading-automation">Automation</h3>
              <ul className="space-y-2">
                {automationTypes.map(item => (
                  <li key={item} className="flex items-start gap-2 text-sm text-slate-600">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#f59e0b] mt-1.5 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* Parking Blockers */}
            <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100" data-testid="category-parking">
              <div className="w-12 h-12 bg-[#0d2d6e] rounded-xl flex items-center justify-center mb-5">
                <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="11" width="18" height="10" rx="2" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
              </div>
              <h3 className="text-lg font-black text-[#0d2d6e] mb-4" data-testid="heading-parking">Parking Blockers</h3>
              <ul className="space-y-2">
                {parkingBlockers.map(item => (
                  <li key={item} className="flex items-start gap-2 text-sm text-slate-600">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#f59e0b] mt-1.5 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* WHY CHOOSE US */}
      <section className="py-20 bg-slate-50" data-testid="advantages-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <span className="text-xs font-bold uppercase tracking-widest text-[#f59e0b] mb-3 block">Our Edge</span>
            <h2 className="text-3xl sm:text-4xl font-black text-[#0d2d6e]" data-testid="advantages-heading">Why Choose GMD Fences</h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 max-w-5xl mx-auto">
            {advantages.map(({ icon: Icon, text }, i) => (
              <div
                key={i}
                className="flex items-start gap-4 p-6 bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md hover:border-[#0d2d6e]/20 transition-all"
                data-testid={`advantage-${i}`}
              >
                <div className="w-10 h-10 rounded-xl bg-[#0d2d6e]/10 flex items-center justify-center flex-shrink-0">
                  <Icon className="w-5 h-5 text-[#0d2d6e]" />
                </div>
                <p className="text-slate-700 font-semibold text-sm leading-relaxed pt-1.5">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* REGIONAL PROJECTS */}
      <section className="py-20 bg-white" data-testid="regional-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <span className="text-xs font-bold uppercase tracking-widest text-[#f59e0b] mb-3 block">Brand Network</span>
            <h2 className="text-3xl sm:text-4xl font-black text-[#0d2d6e] mb-4" data-testid="regional-heading">Our Regional Projects</h2>
            <p className="text-slate-500 max-w-xl mx-auto">GMD Fences operates across multiple countries through dedicated regional platforms.</p>
          </div>

          <div className="grid sm:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {regionalProjects.map(({ country, url, description, flag }) => (
              <a
                key={country}
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="group block bg-slate-50 rounded-2xl p-6 border border-slate-100 hover:border-[#0d2d6e]/30 hover:shadow-lg transition-all hover:-translate-y-1"
                data-testid={`regional-${country.toLowerCase()}`}
              >
                <div className="text-4xl mb-3">{flag}</div>
                <h3 className="text-lg font-black text-[#0d2d6e] mb-2 flex items-center gap-2">
                  {country}
                  <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed mb-3">{description}</p>
                <span className="text-xs text-[#0d2d6e] font-semibold truncate block">{url}</span>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 bg-slate-50" data-testid="faq-section">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <span className="text-xs font-bold uppercase tracking-widest text-[#f59e0b] mb-3 block">FAQ</span>
            <h2 className="text-3xl sm:text-4xl font-black text-[#0d2d6e]" data-testid="faq-heading">Frequently Asked Questions</h2>
          </div>

          <div className="space-y-3">
            {faqItems.map(({ q, a }, i) => (
              <div
                key={i}
                className="bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm"
                data-testid={`faq-item-${i}`}
              >
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-start justify-between gap-4 p-5 sm:p-6 text-left hover:bg-slate-50 transition-colors"
                  data-testid={`faq-toggle-${i}`}
                  aria-expanded={openFaq === i}
                >
                  <h3 className="text-sm sm:text-base font-bold text-[#0d2d6e] leading-relaxed">{q}</h3>
                  <ChevronDown
                    className={`w-5 h-5 text-slate-400 flex-shrink-0 mt-0.5 transition-transform duration-200 ${openFaq === i ? "rotate-180" : ""}`}
                  />
                </button>
                {openFaq === i && (
                  <div className="px-5 sm:px-6 pb-5 sm:pb-6" data-testid={`faq-answer-${i}`}>
                    <p className="text-slate-600 text-sm leading-relaxed border-t border-slate-100 pt-4">{a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-[#071524] text-white py-14" data-testid="footer">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">
            {/* Brand */}
            <div className="lg:col-span-2">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-9 h-9 rounded-lg bg-[#0d2d6e] flex items-center justify-center">
                  <span className="text-white font-black text-sm tracking-tight">GMD</span>
                </div>
                <span className="font-black text-xl tracking-tight">GMD<span className="text-[#f59e0b]">Fences</span></span>
              </div>
              <p className="text-white/60 text-sm leading-relaxed max-w-xs">
                Custom fences, gates, automation and parking blockers for residential, commercial and industrial properties in the USA.
              </p>
              <div className="mt-5 space-y-2">
                <a href={`tel:${COMPANY_PHONE.replace(/\s/g, "")}`} className="flex items-center gap-2 text-white/70 hover:text-white transition-colors text-sm" data-testid="footer-phone">
                  <Phone className="w-4 h-4 text-[#f59e0b]" />
                  {COMPANY_PHONE}
                </a>
                <a href={`mailto:${COMPANY_EMAIL}`} className="flex items-center gap-2 text-white/70 hover:text-white transition-colors text-sm" data-testid="footer-email">
                  <Mail className="w-4 h-4 text-[#f59e0b]" />
                  {COMPANY_EMAIL}
                </a>
              </div>
            </div>

            {/* Navigation */}
            <div>
              <h4 className="text-sm font-bold text-white/90 uppercase tracking-widest mb-4">Navigation</h4>
              <ul className="space-y-2.5">
                {["Home", "Products", "Contact"].map(item => (
                  <li key={item}>
                    <button
                      onClick={() => scrollTo(item.toLowerCase())}
                      className="text-white/60 hover:text-white text-sm transition-colors"
                    >
                      {item}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Regional */}
            <div>
              <h4 className="text-sm font-bold text-white/90 uppercase tracking-widest mb-4">Regional Projects</h4>
              <ul className="space-y-2.5">
                {regionalProjects.map(({ country, url }) => (
                  <li key={country}>
                    <a
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-white/60 hover:text-[#f59e0b] text-sm transition-colors flex items-center gap-1.5"
                      data-testid={`footer-regional-${country.toLowerCase()}`}
                    >
                      {country}
                      <ArrowRight className="w-3 h-3" />
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="border-t border-white/10 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-white/40 text-xs">
              &copy; {new Date().getFullYear()} GMD Fences. All rights reserved.
            </p>
            <p className="text-white/30 text-xs">
              gmdfences.com
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
