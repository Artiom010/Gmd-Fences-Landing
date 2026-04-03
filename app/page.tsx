"use client";

import { useState, type ReactNode } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Phone, Mail, Menu, X, ChevronDown,
  CheckCircle, ArrowRight, Star,
  Shield, Zap, Wrench,
  Globe, Truck, Settings,
} from "lucide-react";
import dynamic from "next/dynamic";
import { REGIONAL_SITE_CARDS } from "@/lib/regions";

const InteractiveGlobe = dynamic(() => import("@/components/InteractiveGlobe"), {
  ssr: false,
  loading: () => (
    <div className="mx-auto w-full max-w-[min(100%,56rem)] overflow-visible px-1 py-4 sm:px-2 sm:py-6">
      <div className="mx-auto flex aspect-square w-[min(100%,min(88dvh,920px))] max-w-full items-center justify-center rounded-full bg-slate-100 shadow-[0_12px_40px_-16px_rgba(15,23,42,0.12)] ring-1 ring-slate-200/90">
        <Globe className="h-12 w-12 animate-spin text-slate-300" aria-hidden />
      </div>
    </div>
  ),
});

// ── Constants ─────────────────────────────────────────────────────────────────
const COMPANY_PHONE = "+1 (800) 000-0000";
const COMPANY_EMAIL = "info@gmdfences.com";
const CURRENT_YEAR = new Date().getUTCFullYear();

/** SEO catalog — exact names per spec; blocks are informational only (not links). */
const PRODUCT_CATEGORIES: { heading: string; icon: ReactNode; types: string[] }[] = [
  {
    heading: "Fences",
    icon: <FenceIcon />,
    types: [
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
    ],
  },
  {
    heading: "Gates",
    icon: <GateIcon />,
    types: [
      "Swing Gates",
      "Wicket Gates / Pedestrian Gates",
      "Sliding Gate",
      "Cantilever Gate",
      "Bi-Folding Gate",
      "Articulated Sliding Gate",
      "Telescopic Sliding Gate",
    ],
  },
  {
    heading: "Automation",
    icon: <Zap size={22} />,
    types: ["Gate Automation", "Wicket Gate Automation", "Other Automation Solutions"],
  },
  {
    heading: "Parking Blockers",
    icon: <ParkIcon />,
    types: ["Parking Blockers"],
  },
];

const WHY_CHOOSE_ITEMS = [
  "Modern fence and gate systems",
  "Solutions for residential, commercial and industrial properties",
  "Engineering-focused approach",
  "Reliable communication and project support",
  "International company structure with regional projects",
] as const;

/** Block 7 — required regional links (Romania, Moldova, Bulgaria). */
const REGIONAL_PROJECTS_TZ = [
  {
    country: "Romania",
    url: "https://gardurimd.ro",
    blurb: "Official GMD project for Romania.",
  },
  {
    country: "Moldova",
    url: "https://garduri.md",
    blurb: "Official GMD project for Moldova.",
  },
  {
    country: "Bulgaria",
    url: "https://ogradigmd.bg",
    blurb: "Official GMD project for Bulgaria.",
  },
] as const;

const STEPS = [
  { n: "01", label: "Request a Quote",   desc: "Submit your details via phone or email. We respond within 24 hours." },
  { n: "02", label: "Design & Approval", desc: "We prepare technical designs and material specs for your approval." },
  { n: "03", label: "Manufacturing",     desc: "Your system is precision-manufactured in our certified facility." },
  { n: "04", label: "Delivery & Install",desc: "On-time delivery to your site with full installation support." },
];

const FAQ = [
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

// ── Contact form schema ───────────────────────────────────────────────────────
const contactSchema = z.object({
  name:    z.string().min(2, "Name is required"),
  email:   z.string().email("Valid email is required"),
  phone:   z.string().optional(),
  message: z.string().min(10, "Message must be at least 10 characters"),
});
type ContactForm = z.infer<typeof contactSchema>;

// ── SVG icons ─────────────────────────────────────────────────────────────────
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

/** Light blueprint-style grid (gardurimd-inspired). */
function SectionGridBg() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      <div
        className="absolute inset-0 opacity-[0.4]"
        style={{
          backgroundImage:
            "linear-gradient(to right, #d4d8e0 1px, transparent 1px), linear-gradient(to bottom, #d4d8e0 1px, transparent 1px)",
          backgroundSize: "44px 44px",
          maskImage: "linear-gradient(to bottom, #000 0%, #000 52%, transparent 96%)",
          WebkitMaskImage: "linear-gradient(to bottom, #000 0%, #000 52%, transparent 96%)",
        }}
      />
    </div>
  );
}

function CardStripeWash() {
  return (
    <div
      className="pointer-events-none absolute inset-0 opacity-[0.05]"
      style={{
        backgroundImage:
          "repeating-linear-gradient(-45deg, #0f172a 0, #0f172a 1px, transparent 1px, transparent 11px)",
      }}
    />
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────
export default function Page() {
  const [menuOpen, setMenuOpen]         = useState(false);
  const [openFaq, setOpenFaq]           = useState<number | null>(null);
  const [submitted, setSubmitted]       = useState(false);
  const [confirmationEmailSent, setConfirmationEmailSent] = useState(true);
  const [formError, setFormError]       = useState<string | null>(null);
  const [activeRegion, setActiveRegion] = useState<string | null>(null);
  const [globeFly, setGlobeFly] = useState<{ key: number; name: string } | null>(null);

  const { register, handleSubmit, formState: { errors, isSubmitting }, reset } =
    useForm<ContactForm>({ resolver: zodResolver(contactSchema) });

  const scrollTo = (id: string) => {
    setMenuOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  async function onSubmit(data: ContactForm) {
    setFormError(null);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const err = (await res.json().catch(() => ({}))) as { error?: string };
        setFormError(err.error || "Something went wrong. Please call us or try again later.");
        return;
      }
      const payload = (await res.json().catch(() => ({}))) as { confirmationEmailSent?: boolean };
      setConfirmationEmailSent(payload.confirmationEmailSent !== false);
      setSubmitted(true);
      reset();
    } catch {
      setFormError("Network error. Please try again or call us.");
    }
  }

  return (
    <div className="min-h-screen overflow-x-hidden bg-white font-['Inter',sans-serif] text-[#1B2537]">

      <header className="relative z-50 w-full border-b border-white/10 bg-[#0D1520] shadow-[0_4px_24px_-4px_rgba(0,0,0,0.35)]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="flex h-16 items-center justify-between">
            <button type="button" onClick={() => scrollTo("home")} className="flex items-center gap-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/img/logo.svg"
                alt=""
                className="h-9 w-auto shrink-0 opacity-95 brightness-0 invert"
              />
              <span className="hidden sm:block">
                <span className="text-xl font-black tracking-tight text-white">GMD</span>
                <span className="text-xl font-black tracking-tight text-[#F4C430]">Fences</span>
              </span>
            </button>

            <nav className="hidden items-center gap-8 md:flex" aria-label="Primary">
              {[
                ["home", "Home"],
                ["products", "Products"],
                ["world", "International"],
                ["contact", "Contact"],
              ].map(([id, label]) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => scrollTo(id)}
                  className="text-sm font-medium text-white/70 transition-colors hover:text-[#F4C430]"
                >
                  {label}
                </button>
              ))}
            </nav>

            <div className="hidden items-center gap-4 md:flex">
              <a
                href={`tel:${COMPANY_PHONE.replace(/\s/g, "")}`}
                className="flex items-center gap-2 text-sm font-medium text-white/70 transition-colors hover:text-[#F4C430]"
              >
                <Phone className="h-4 w-4" aria-hidden />
                {COMPANY_PHONE}
              </a>
              <button
                type="button"
                onClick={() => scrollTo("contact")}
                className="rounded-lg bg-[#F4C430] px-5 py-2.5 text-sm font-bold text-[#0D1520] shadow-lg shadow-[#F4C430]/20 transition-all hover:bg-[#e0b020]"
              >
                Get a Quote
              </button>
            </div>

            <button
              type="button"
              onClick={() => setMenuOpen(!menuOpen)}
              className="p-1.5 text-white md:hidden"
              aria-expanded={menuOpen}
              aria-label={menuOpen ? "Close menu" : "Open menu"}
            >
              {menuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {menuOpen && (
          <div className="border-t border-white/10 bg-[#0D1520]/98 px-6 py-5 backdrop-blur-xl md:hidden">
            <div className="flex flex-col gap-1">
              {[
                ["home", "Home"],
                ["products", "Products"],
                ["world", "International"],
                ["contact", "Contact"],
              ].map(([id, label]) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => scrollTo(id)}
                  className="border-b border-white/10 py-3.5 text-left text-sm font-semibold text-white/80"
                >
                  {label}
                </button>
              ))}
            </div>
            <div className="mt-4 flex flex-col gap-3 pt-2">
              <a href={`tel:${COMPANY_PHONE.replace(/\s/g, "")}`} className="flex items-center gap-2 text-sm font-bold text-[#F4C430]">
                <Phone className="h-4 w-4" aria-hidden />
                {COMPANY_PHONE}
              </a>
              <button
                type="button"
                onClick={() => scrollTo("contact")}
                className="w-full rounded-lg bg-[#F4C430] py-3 text-sm font-bold text-[#0D1520]"
              >
                Get a Quote
              </button>
            </div>
          </div>
        )}
      </header>

      <section id="home" className="relative flex min-h-screen items-center">
        <div className="absolute inset-0 bg-gradient-to-br from-[#060C17] via-[#0D1520] to-[#152035]" />
        <FencePattern />
        <div className="pointer-events-none absolute left-1/4 top-1/3 h-96 w-96 rounded-full bg-[#F4C430]/5 blur-3xl" />
        <div className="pointer-events-none absolute right-1/4 top-1/2 h-64 w-64 rounded-full bg-blue-500/[0.08] blur-3xl" />
        <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-[#060C17]/90 to-transparent" />

        <div className="relative mx-auto w-full max-w-7xl px-4 pb-24 pt-16 sm:px-6 sm:pt-20 lg:px-8 lg:pt-24">
          <div className="max-w-3xl">
            <div className="mb-8 flex items-center gap-3">
              <div className="flex items-center gap-1" aria-hidden>
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-[#F4C430] text-[#F4C430]" />
                ))}
              </div>
              <div className="h-5 w-px bg-white/20" aria-hidden />
              <span className="text-sm font-medium text-white/50">Commercial quality for residential use</span>
            </div>

            <h1 className="mb-6 text-5xl font-black leading-[1.05] tracking-tight text-white sm:text-6xl lg:text-7xl">
              Custom Fences, Gates <span className="text-[#F4C430]">&amp; Automation</span>
              <br />
              <span className="text-white">in the USA</span>
            </h1>

            <p className="mb-3 max-w-xl text-lg leading-relaxed text-white/60">
              GMD Fences provides modern fence systems, gate solutions, automation options and parking control products for{" "}
              <strong className="text-white/80">residential, commercial and industrial</strong> needs in the USA.
            </p>
            <p className="mb-10 max-w-lg text-sm leading-relaxed text-white/50">
              International company structure with regional projects — contact us for product information and consultation.
            </p>

            <div className="mb-14 flex flex-wrap gap-4">
              <button
                type="button"
                onClick={() => scrollTo("contact")}
                className="group flex items-center gap-2 rounded-xl bg-[#F4C430] px-7 py-4 text-sm font-bold text-[#0D1520] shadow-xl shadow-[#F4C430]/20 transition-all hover:bg-[#e0b020]"
              >
                Request information
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" aria-hidden />
              </button>
              <button
                type="button"
                onClick={() => scrollTo("world")}
                className="group flex items-center gap-2 rounded-xl border border-white/20 px-7 py-4 text-sm font-semibold text-white transition-all hover:border-[#F4C430]/40 hover:bg-white/10"
              >
                <Globe className="h-4 w-4" aria-hidden />
                Regional presence
              </button>
            </div>

            <div className="grid grid-cols-3 gap-4 border-t border-white/10 pt-10 sm:max-w-lg">
              {[
                { val: "10+", lbl: "Years" },
                { val: "4", lbl: "Markets" },
                { val: "1M+", lbl: "Meters" },
              ].map(({ val, lbl }) => (
                <div key={lbl} className="text-center sm:text-left">
                  <p className="text-2xl font-black text-[#F4C430]">{val}</p>
                  <p className="text-xs text-white/40">{lbl}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="absolute bottom-6 left-1/2 z-[1] -translate-x-1/2 text-white/25">
          <ChevronDown className="h-5 w-5" aria-hidden />
        </div>
      </section>

      <section id="contact" className="bg-white py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid items-start gap-16 lg:grid-cols-2">
            <div>
              <h2 className="text-3xl font-black leading-tight text-[#0D1520] sm:text-4xl">Website Under Development</h2>

              <p className="mb-8 mt-6 max-w-md text-sm leading-relaxed text-slate-600 sm:text-base">
                Our full website is currently under development. In the meantime, you can contact GMD Fences for product information, project details, delivery options and consultation across the USA.
              </p>

              <p className="mb-2 text-xs font-bold uppercase tracking-wider text-slate-500">Phone</p>
              <a
                href={`tel:${COMPANY_PHONE.replace(/\s/g, "")}`}
                className="mb-8 inline-block text-2xl font-black text-[#0D1520] transition-colors hover:text-[#F4C430]"
              >
                {COMPANY_PHONE}
              </a>

              <div className="mb-8 grid grid-cols-2 gap-3">
                {[
                  { val: "10+", lbl: "Years in Manufacturing" },
                  { val: "1M+", lbl: "Meters of Fence Installed" },
                  { val: "4", lbl: "Active Regional Markets" },
                  { val: "100%", lbl: "Factory-Direct Products" },
                ].map(({ val, lbl }) => (
                  <div key={lbl} className="flex items-center gap-3 rounded-xl border border-slate-100 bg-slate-50 p-4">
                    <span className="text-2xl font-black text-[#0D1520]">{val}</span>
                    <span className="text-xs leading-tight text-slate-500">{lbl}</span>
                  </div>
                ))}
              </div>

              <div className="flex flex-col gap-3 sm:flex-row">
                <a
                  href={`tel:${COMPANY_PHONE.replace(/\s/g, "")}`}
                  className="flex flex-1 items-center gap-3 rounded-xl bg-[#0D1520] p-4 transition-colors hover:bg-[#1B2537]"
                >
                  <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-[#F4C430]">
                    <Phone className="h-4 w-4 text-[#0D1520]" aria-hidden />
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-wider text-white/40">Call Us</p>
                    <p className="text-sm font-bold text-white">{COMPANY_PHONE}</p>
                  </div>
                </a>
                <a
                  href={`mailto:${COMPANY_EMAIL}`}
                  className="flex flex-1 items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 p-4 transition-colors hover:border-[#0D1520]/30"
                >
                  <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-[#0D1520]">
                    <Mail className="h-4 w-4 text-white" aria-hidden />
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-wider text-slate-400">Email</p>
                    <p className="text-sm font-bold text-[#0D1520]">{COMPANY_EMAIL}</p>
                  </div>
                </a>
              </div>
            </div>

            <div>
              <p className="mb-6 text-lg font-black text-[#0D1520]">Email form</p>
              <div className="rounded-2xl bg-[#0D1520] p-7 shadow-2xl">
                {submitted ? (
                  <div className="text-center py-14">
                    <div className="w-16 h-16 bg-green-500/15 rounded-full flex items-center justify-center mx-auto mb-4 border border-green-500/20">
                      <CheckCircle className="w-7 h-7 text-green-400" aria-hidden />
                    </div>
                    <p className="text-lg font-semibold text-white">Thank you. Your request has been sent.</p>
                    {!confirmationEmailSent && (
                      <p className="mx-auto mt-4 max-w-sm text-sm leading-relaxed text-white/55">
                        We could not send a confirmation email to your address (check spam). Your message was still received — we will contact you.
                      </p>
                    )}
                    <button
                      type="button"
                      onClick={() => {
                        setSubmitted(false);
                        setFormError(null);
                        setConfirmationEmailSent(true);
                      }}
                      className="mt-6 text-sm font-semibold text-[#F4C430] underline underline-offset-2 hover:no-underline"
                    >
                      Send another request
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="field-name" className="block text-white/50 text-[10px] font-bold mb-2 uppercase tracking-wider">
                          Name *
                        </label>
                        <input
                          id="field-name"
                          {...register("name")}
                          type="text"
                          autoComplete="name"
                          className="w-full rounded-xl border border-white/10 bg-white/10 px-4 py-3 text-sm text-white placeholder-white/25 transition-all focus:border-[#F4C430]/50 focus:bg-white/15 focus:outline-none"
                        />
                        {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name.message}</p>}
                      </div>
                      <div>
                        <label htmlFor="field-email" className="block text-white/50 text-[10px] font-bold mb-2 uppercase tracking-wider">
                          Email *
                        </label>
                        <input
                          id="field-email"
                          {...register("email")}
                          type="email"
                          autoComplete="email"
                          className="w-full rounded-xl border border-white/10 bg-white/10 px-4 py-3 text-sm text-white placeholder-white/25 transition-all focus:border-[#F4C430]/50 focus:bg-white/15 focus:outline-none"
                        />
                        {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email.message}</p>}
                      </div>
                    </div>
                    <div>
                      <label htmlFor="field-phone" className="block text-white/50 text-[10px] font-bold mb-2 uppercase tracking-wider">
                        Phone
                      </label>
                      <input
                        id="field-phone"
                        {...register("phone")}
                        type="tel"
                        autoComplete="tel"
                        className="w-full rounded-xl border border-white/10 bg-white/10 px-4 py-3 text-sm text-white placeholder-white/25 transition-all focus:border-[#F4C430]/50 focus:bg-white/15 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label htmlFor="field-message" className="block text-white/50 text-[10px] font-bold mb-2 uppercase tracking-wider">
                        Message *
                      </label>
                      <textarea
                        id="field-message"
                        {...register("message")}
                        rows={4}
                        className="w-full resize-none rounded-xl border border-white/10 bg-white/10 px-4 py-3 text-sm text-white placeholder-white/25 transition-all focus:border-[#F4C430]/50 focus:bg-white/15 focus:outline-none"
                      />
                      {errors.message && <p className="text-red-400 text-xs mt-1">{errors.message.message}</p>}
                    </div>
                    {formError && (
                      <p className="rounded-lg border border-red-500/40 bg-red-500/10 px-3 py-2 text-xs text-red-200" role="alert">
                        {formError}
                      </p>
                    )}
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#F4C430] py-3.5 text-sm font-bold text-[#0D1520] shadow-lg shadow-[#F4C430]/20 transition-all hover:bg-[#e0b020] disabled:opacity-60"
                    >
                      {isSubmitting ? (
                        <span className="h-5 w-5 animate-spin rounded-full border-2 border-[#0D1520]/30 border-t-[#0D1520]" />
                      ) : (
                        <>
                          <span>Send Request</span>
                          <ArrowRight className="w-4 h-4" />
                        </>
                      )}
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ════ MANUFACTURING, INSTALLATION, DELIVERY (Block 4) ═════════════════ */}
      <section id="manufacturing" className="relative overflow-hidden bg-[#0D1520] py-20">
        <FencePattern />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid items-center gap-14 lg:grid-cols-2">
            <div>
              <h2 className="mb-6 text-3xl font-black leading-tight text-white sm:text-4xl">
                Manufacturing, Installation and Delivery in the USA
              </h2>
              <p className="mb-8 text-sm leading-relaxed text-white/55">
                GMD Fences offers fence and gate manufacturing, professional installation support and reliable delivery solutions across the USA. We focus on durable systems for residential, commercial and industrial properties, combining modern design, practical engineering and dependable service.
              </p>
              <button
                type="button"
                onClick={() => scrollTo("contact")}
                className="inline-flex items-center gap-2 rounded-xl bg-[#F4C430] px-6 py-3.5 text-sm font-bold text-[#0D1520] shadow-lg transition-all hover:bg-[#e0b020]"
              >
                Request Information <ArrowRight className="h-4 w-4" aria-hidden />
              </button>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { I: Wrench, t: "In-House Manufacturing", d: "Full production control for consistent quality" },
                { I: Settings, t: "Custom Engineering", d: "Tailored designs to match your exact specs" },
                { I: Truck, t: "USA-Wide Delivery", d: "Reliable, on-time logistics to your site" },
                { I: Shield, t: "Quality Certified", d: "All products meet precision standards" },
              ].map(({ I, t, d }) => (
                <div key={t} className="rounded-2xl border border-white/10 bg-white/5 p-5 transition-all hover:bg-white/10">
                  <I className="mb-3 h-5 w-5 text-[#F4C430]" aria-hidden />
                  <p className="mb-1.5 text-sm font-bold text-white">{t}</p>
                  <p className="text-xs leading-relaxed text-white/40">{d}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ════ PRODUCT & SERVICE CATEGORIES (Block 5) ═════════════════════════ */}
      <section id="products" className="bg-[#F5F6F8] py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-14 text-center">
            <h2 className="text-3xl font-black text-[#0D1520] sm:text-4xl">Our Main Product and Service Categories</h2>
            <p className="mx-auto mt-3 max-w-xl text-sm text-slate-500">
              Informational overview of our main lines. Product pages will be added with the full site launch.
            </p>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {PRODUCT_CATEGORIES.map(({ heading, icon, types }) => (
              <div key={heading} className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm">
                <div className="flex items-center gap-3 bg-[#0D1520] p-5">
                  <div
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#F4C430] text-[#0D1520]"
                    aria-hidden
                  >
                    {icon}
                  </div>
                  <h3 className="text-base font-black text-white">{heading}</h3>
                </div>
                <ul className="list-none space-y-2.5 p-5" role="list">
                  {types.map((t) => (
                    <li key={t} className="flex items-start gap-2 text-xs text-slate-600">
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#F4C430]" aria-hidden />
                      {t}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════ WHY CHOOSE (Block 6) ═══════════════════════════════════════════ */}
      <section className="bg-white py-24">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <h2 className="mb-10 text-center text-3xl font-black text-[#0D1520] sm:text-4xl">Why Choose GMD Fences</h2>
          <ul className="list-none space-y-4 text-sm leading-relaxed text-slate-700 sm:text-base" role="list">
            {WHY_CHOOSE_ITEMS.map((item) => (
              <li key={item} className="flex gap-3">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#F4C430]" aria-hidden />
                {item}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ════ REGIONAL PROJECTS + INTERNATIONAL HUB (Blocks 7 + extended) ════ */}
      <section id="world" className="relative w-full overflow-visible bg-[#f4f5f7] py-24 text-[#0D1520]">
        <SectionGridBg />
        <div className="relative z-[1] mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="mb-4 text-center text-3xl font-black tracking-tight sm:text-4xl">Our Regional Projects</h2>
          <p className="mx-auto mb-12 max-w-2xl text-center text-sm leading-relaxed text-slate-600">
            Official regional websites for selected markets. Additional presence (USA hub, Ireland) is shown below with the interactive globe.
          </p>

          <ul className="mb-16 grid list-none gap-5 md:grid-cols-3" role="list">
            {REGIONAL_PROJECTS_TZ.map(({ country, url, blurb }) => (
              <li key={country}>
                <a
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-full flex-col rounded-2xl border border-slate-200/90 bg-white p-6 shadow-[0_4px_24px_-12px_rgba(15,23,42,0.1)] transition-colors hover:border-slate-300"
                >
                  <span className="text-lg font-black text-[#0D1520]">{country}</span>
                  <span className="mt-1 break-all text-xs font-medium text-[#F4C430]">{url.replace(/^https:\/\//, "")}</span>
                  <span className="mt-3 text-sm text-slate-600">{blurb}</span>
                </a>
              </li>
            ))}
          </ul>

          <div className="relative isolate grid items-start gap-12 border-t border-slate-200/80 pt-16 lg:grid-cols-[minmax(0,1.2fr)_minmax(280px,24rem)] lg:items-start lg:gap-12 xl:gap-16">
            <div className="relative z-0 flex min-h-0 min-w-0 w-full justify-center overflow-visible lg:max-w-none">
              <InteractiveGlobe
                flyToRequest={globeFly}
                onLocationSelect={(loc) => {
                  setActiveRegion(loc.name);
                  if (loc.url !== "#contact") window.open(loc.url, "_blank");
                  else scrollTo("contact");
                }}
              />
            </div>

            <div className="relative z-10 min-w-0 space-y-5">
              <h3 className="text-sm font-black text-[#0D1520]">All regions &amp; USA hub</h3>
              <p className="text-xs font-medium uppercase tracking-wider text-slate-500">Official sites &amp; contact</p>

              <div
                role="button"
                tabIndex={0}
                onClick={() => {
                  setGlobeFly({ key: Date.now(), name: "United States" });
                  scrollTo("contact");
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    setGlobeFly({ key: Date.now(), name: "United States" });
                    scrollTo("contact");
                  }
                }}
                className="group relative cursor-pointer overflow-hidden rounded-2xl border border-slate-200/90 bg-white p-6 shadow-[0_4px_32px_-12px_rgba(15,23,42,0.12)] transition-all hover:border-slate-300 hover:shadow-[0_8px_40px_-16px_rgba(15,23,42,0.14)]"
              >
                <CardStripeWash />
                <div className="relative z-[1] flex flex-col gap-4 sm:flex-row sm:items-start">
                  <div className="relative h-16 w-20 shrink-0 overflow-hidden rounded-xl border border-slate-200 bg-slate-50 shadow-inner">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src="/img/flags/us.svg" alt="United States flag" className="h-full w-full object-cover" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="mb-1 flex flex-wrap items-center gap-2">
                      <h3 className="text-lg font-black text-[#0D1520]">United States</h3>
                      <span className="rounded-md bg-[#0D1520] px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white">
                        Headquarters
                      </span>
                    </div>
                    <p className="text-sm text-slate-500">gmdfences.com · Under development</p>
                    <span className="mt-4 inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-bold text-[#0D1520] transition-all group-hover:border-[#0D1520] group-hover:bg-slate-50">
                      Get a quote
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" aria-hidden />
                    </span>
                  </div>
                </div>
              </div>

              {REGIONAL_SITE_CARDS.map(({ name, flagSrc, url, domain, city }) => (
                <a
                  key={name}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => {
                    setActiveRegion(name);
                    setGlobeFly({ key: Date.now(), name });
                  }}
                  className={`group relative block overflow-hidden rounded-2xl border bg-white p-6 shadow-[0_4px_32px_-12px_rgba(15,23,42,0.1)] transition-all hover:border-slate-300 hover:shadow-[0_8px_40px_-16px_rgba(15,23,42,0.12)] ${
                    activeRegion === name ? "border-[#F4C430] ring-2 ring-[#F4C430]/25" : "border-slate-200/90"
                  }`}
                >
                  <CardStripeWash />
                  <div className="pointer-events-none absolute right-6 top-6 select-none text-7xl font-black leading-none text-slate-100">
                    {name.slice(0, 2).toUpperCase()}
                  </div>
                  <div className="relative z-[1] flex flex-col gap-4 sm:flex-row sm:items-start">
                    <div className="relative h-16 w-20 shrink-0 overflow-hidden rounded-xl border border-slate-200 bg-slate-50 shadow-inner">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={flagSrc} alt={`${name} flag`} className="h-full w-full object-cover" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="mb-1 flex flex-wrap items-center gap-2">
                        <h3 className="text-lg font-black text-[#0D1520]">{name}</h3>
                        <span className="rounded-md border border-[#F4C430]/40 bg-[#F4C430]/12 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-[#b8860b]">
                          Active site
                        </span>
                      </div>
                      <p className="text-sm text-slate-500">
                        {domain} · {city}
                      </p>
                      <span className="mt-4 inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-bold text-[#0D1520] transition-all group-hover:border-[#0D1520] group-hover:bg-slate-50">
                        Visit website
                        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" aria-hidden />
                      </span>
                    </div>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ════ HOW TO PLACE AN ORDER (supplementary process) ═════════════════ */}
      <section className="bg-[#F5F6F8] py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-14 text-center">
            <span className="mb-4 block text-xs font-bold uppercase tracking-[0.2em] text-[#F4C430]">Simple Process</span>
            <h2 className="text-3xl font-black text-[#0D1520] sm:text-4xl">How to Place an Order</h2>
          </div>
          <div className="relative grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {STEPS.map(({ n, label, desc }, i) => (
              <div key={n} className="relative">
                {i < STEPS.length - 1 && (
                  <div className="absolute left-[calc(50%+2.5rem)] top-7 hidden h-px right-[-50%] bg-[#F4C430]/20 lg:block" />
                )}
                <div className="text-center">
                  <div className="relative z-10 mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#0D1520] shadow-sm">
                    <span className="text-base font-black text-[#F4C430]">{n}</span>
                  </div>
                  <h3 className="mb-2 text-sm font-black text-[#0D1520]">{label}</h3>
                  <p className="text-xs leading-relaxed text-slate-500">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════ FAQ (Block 8) ═══════════════════════════════════════════════════ */}
      <section id="faq" className="bg-white py-24">
        <div className="mx-auto max-w-2xl px-4 sm:px-6">
          <div className="mb-14 text-center">
            <h2 className="text-3xl font-black text-[#0D1520] sm:text-4xl">Frequently Asked Questions</h2>
          </div>
          <div className="space-y-3">
            {FAQ.map(({ q, a }, i) => (
              <div
                key={i}
                className={`overflow-hidden rounded-2xl border transition-all ${
                  openFaq === i ? "border-[#0D1520]/20 shadow-sm" : "border-slate-100"
                }`}
              >
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="flex w-full items-start justify-between gap-4 px-6 py-5 text-left transition-colors hover:bg-slate-50"
                  aria-expanded={openFaq === i}
                >
                  <h3 className="text-sm font-bold leading-relaxed text-[#0D1520]">{q}</h3>
                  <ChevronDown
                    className={`mt-0.5 h-5 w-5 shrink-0 text-[#F4C430] transition-transform duration-200 ${
                      openFaq === i ? "rotate-180" : ""
                    }`}
                    aria-hidden
                  />
                </button>
                {openFaq === i && (
                  <div className="px-6 pb-5">
                    <p className="border-t border-slate-100 pt-4 text-sm leading-relaxed text-slate-600">{a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════ FOOTER (Block 9) ═════════════════════════════════════════════════ */}
      <footer className="bg-[#060C17] pb-8 pt-16 text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-14 grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
            {/* Brand */}
            <div className="lg:col-span-2">
              <div className="mb-6 flex flex-wrap items-center gap-3">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/img/logo.svg"
                  alt="GMD Fences"
                  className="h-10 w-auto shrink-0 opacity-90 brightness-0 invert sm:h-11"
                />
                <span className="text-xl font-black text-white/90">
                  GMD<span className="text-[#F4C430]">Fences</span>
                </span>
              </div>
              <p className="mb-6 max-w-xs text-sm leading-relaxed text-white/40">
                An international fence manufacturing brand. Custom fences, gates, automation and parking control for the USA market.
              </p>
              <div className="space-y-3">
                <a href={`tel:${COMPANY_PHONE.replace(/\s/g,"")}`} className="flex items-center gap-2.5 text-sm text-white/50 transition-colors hover:text-[#F4C430]">
                  <Phone className="h-3.5 w-3.5 text-[#F4C430]" aria-hidden />
                  {COMPANY_PHONE}
                </a>
                <a href={`mailto:${COMPANY_EMAIL}`} className="flex items-center gap-2.5 text-sm text-white/50 transition-colors hover:text-[#F4C430]">
                  <Mail className="h-3.5 w-3.5 text-[#F4C430]" aria-hidden />
                  {COMPANY_EMAIL}
                </a>
              </div>
            </div>

            <div>
              <h4 className="mb-5 text-[10px] font-bold uppercase tracking-[0.2em] text-white/40">Navigation</h4>
              <ul className="space-y-3">
                {[["home", "Home"], ["products", "Products"], ["contact", "Contact"], ["world", "International"]].map(([id, label]) => (
                  <li key={id}>
                    <button type="button" onClick={() => scrollTo(id)} className="text-sm text-white/40 transition-colors hover:text-[#F4C430]">
                      {label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="mb-5 text-[10px] font-bold uppercase tracking-[0.2em] text-white/40">Regional projects</h4>
              <ul className="space-y-3">
                {REGIONAL_PROJECTS_TZ.map(({ country, url }) => (
                  <li key={country}>
                    <a href={url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm text-white/40 transition-colors hover:text-[#F4C430]">
                      {country}
                      <ArrowRight className="ml-auto h-3 w-3 shrink-0" aria-hidden />
                    </a>
                  </li>
                ))}
                <li>
                  <a
                    href="https://finefence.ie/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm text-white/40 transition-colors hover:text-[#F4C430]"
                  >
                    Ireland (FineFence)
                    <ArrowRight className="ml-auto h-3 w-3 shrink-0" aria-hidden />
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-8 sm:flex-row">
            <p className="text-white/20 text-xs">&copy; {CURRENT_YEAR} GMD Fences. All rights reserved.</p>
            <p className="text-white/15 text-xs">gmdfences.com — International Corporate Hub</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
