import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import {
  SERVICES_LIST,
  getServiceBySlug,
  getAllServiceSlugs,
} from "@/data/services-data";
import { getSiteSettings } from "@/lib/site-data";
import { Header } from "@/components/site/Header";
import { ContactSection } from "@/components/site/ContactSection";
import { Footer } from "@/components/site/Footer";
import { CursorGlow } from "@/components/animations/CursorGlow";
import { HeroVisuals } from "@/components/animations/HeroVisuals";
import { GorgeousButton } from "@/components/ui/GorgeousButton";
import {
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Phone,
  Mail,
  Star,
  ShieldCheck,
  ChevronRight,
  TrendingUp,
} from "lucide-react";

interface ServicePageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return getAllServiceSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: ServicePageProps): Promise<Metadata> {
  const { slug } = await params;
  const service = getServiceBySlug(slug);

  if (!service) {
    return { title: "Service Not Found – AdsMonster" };
  }

  return {
    title: `${service.title} – AdsMonster`,
    description: service.description,
  };
}

export default async function ServiceDetailPage({ params }: ServicePageProps) {
  const { slug } = await params;
  const service = getServiceBySlug(slug);

  if (!service) {
    notFound();
  }

  const settings = (await getSiteSettings()) ?? {
    id: 0,
    siteName: "AdsMonster",
    tagline: "Power your growth with smart ads",
    heroHeading: "Hi there, Welcome to AdsMonster.",
    heroSubtext:
      "AdsMonster is a results-driven digital advertising agency specializing in Google, Meta, YouTube, TikTok Ads and LinkedIn Ads to help brands scale faster and smarter.",
    ratingValue: "4.8",
    ratingCount: "24k rating",
    yearsExperience: "8+",
    aboutTitle: "About Us",
    aboutText:
      "AdsMonster is your growth partner, focused on smart ads that drive real results, attract the right audience, and help your business grow faster.",
    whyChooseTitle: "WHY CHOOSE US",
    whyChooseText:
      "We partner with brands to deliver consistent, scalable growth through smart strategy, data-driven execution, and a results-first mindset.",
    ctaTitle: "Ready to Grow Your Business Online?",
    ctaSubtext: "Let's work together to create marketing that actually works.",
    newsletterTitle: "Signup Our Newsletter to Get Update Information.",
    contactEmail: "hello@adsmonster.com",
    contactPhone: "+1 (555) 010-2030",
    contactAddress: "123 Growth Avenue, Suite 400, New York, NY",
    facebookUrl: "#",
    instagramUrl: "#",
    linkedinUrl: "#",
    twitterUrl: "#",
    updatedAt: new Date(),
  };

  return (
    <main className="min-h-screen bg-[#E2F1F1] text-[#5E5E5E]">
      <CursorGlow />
      <Header siteName={settings.siteName} />

      {/* Hero Section with Breadcrumb */}
      <section className="relative overflow-hidden bg-[#E2F1F1] text-[#104042] pt-28 pb-20 md:pt-32 md:pb-24 lg:pt-36 lg:pb-28">
        <HeroVisuals />

        <div className="relative mx-auto max-w-7xl px-6">
          {/* Breadcrumb Navigation */}
          <nav className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#104042]/50 mb-6">
            <Link href="/" className="hover:text-[#006402] transition">
              Home
            </Link>
            <ChevronRight className="h-3.5 w-3.5" />
            <Link href="/services" className="hover:text-[#006402] transition">
              Services
            </Link>
            <ChevronRight className="h-3.5 w-3.5" />
            <span className="text-[#006402]">{service.title}</span>
          </nav>

          <div className="grid gap-10 lg:grid-cols-12 lg:items-center">
            <div className="lg:col-span-8">
              <span className="inline-flex items-center gap-2 rounded-full border border-[#006402]/20 bg-white/90 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-[#006402] backdrop-blur-md shadow-sm">
                <Sparkles className="h-3.5 w-3.5" />
                {service.badge}
              </span>

              <h1 className="mt-5 text-4xl font-extrabold text-[#104042] sm:text-5xl lg:text-6xl font-display leading-tight">
                {service.heroTitle}
              </h1>

              <p className="mt-4 text-lg text-[#5E5E5E] max-w-2xl leading-relaxed">
                {service.description}
              </p>

              <div className="mt-8 flex flex-wrap items-center gap-4">
                <GorgeousButton
                  href="#contact"
                  variant="primary"
                  size="lg"
                  confettiOnClick
                >
                  Request Free Audit
                </GorgeousButton>

                <GorgeousButton
                  href="/pricing"
                  variant="secondary"
                  size="lg"
                >
                  View Pricing Plans
                </GorgeousButton>
              </div>
            </div>

            {/* Metric Highlights Bento in Hero */}
            <div className="lg:col-span-4 space-y-3.5">
              {service.metrics.map((metric, i) => (
                <div
                  key={i}
                  className="rounded-2xl border border-[#104042]/10 bg-white/90 p-5 backdrop-blur-md shadow-lg"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-[#006402]">
                      {metric.label}
                    </span>
                    <TrendingUp className="h-4 w-4 text-[#006402]" />
                  </div>
                  <p className="mt-2 text-3xl font-extrabold text-[#104042] font-display">
                    {metric.value}
                  </p>
                  <p className="mt-1 text-xs text-[#5E5E5E]">{metric.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Main Content & Sidebar Section */}
      <section className="mx-auto max-w-7xl px-6 py-20">
        <div className="grid gap-12 lg:grid-cols-12 items-start">
          {/* Main Left Column */}
          <div className="lg:col-span-8 space-y-12">
            {/* Detailed Overview */}
            <div className="rounded-3xl border border-[#104042]/10 bg-white p-8 sm:p-10 shadow-sm">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#104042] font-display">
                About This Service
              </h2>
              <div className="mt-5 space-y-4 text-base leading-relaxed text-[#5E5E5E]">
                <p>{service.longDescription}</p>
              </div>
            </div>

            {/* Service Includes Checklist */}
            <div className="rounded-3xl border border-[#104042]/10 bg-white p-8 sm:p-10 shadow-sm">
              <div className="flex items-center gap-2">
                <span className="grid h-8 w-8 place-items-center rounded-xl bg-[#AEFF1C]/20 text-[#006402]">
                  <CheckCircle2 className="h-5 w-5" />
                </span>
                <h2 className="text-2xl font-extrabold text-[#104042] font-display">
                  Service Includes :
                </h2>
              </div>

              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                {service.includes.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-3 rounded-2xl border border-[#104042]/8 bg-[#E8F4F4]/30 p-4 transition hover:border-[#AEFF1C]/50 hover:bg-white"
                  >
                    <CheckCircle2 className="h-5 w-5 text-[#006402] shrink-0 mt-0.5" />
                    <span className="text-sm font-semibold text-[#104042]">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Our Range of Customer Services */}
            <div className="rounded-3xl border border-[#104042]/10 bg-white p-8 sm:p-10 shadow-sm">
              <span className="text-xs font-bold uppercase tracking-widest text-[#006402] bg-[#AEFF1C]/15 px-3.5 py-1.5 rounded-full border border-[#AEFF1C]/30">
                Strategic Framework
              </span>
              <h2 className="mt-4 text-2xl sm:text-3xl font-extrabold text-[#104042] font-display">
                Our Range of Customer Services
              </h2>

              <div className="mt-8 grid gap-5 sm:grid-cols-2">
                {service.customerServices.map((cs, idx) => (
                  <div
                    key={idx}
                    className="rounded-2xl border border-[#104042]/10 bg-white p-6 shadow-sm transition hover:border-[#AEFF1C]/50 hover:shadow-md"
                  >
                    <span className="inline-block rounded-xl bg-[#104042] px-3 py-1 text-xs font-bold uppercase tracking-wider text-[#AEFF1C]">
                      0{idx + 1}
                    </span>
                    <h3 className="mt-4 text-lg font-bold text-[#104042] font-display">
                      {cs.title}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-[#5E5E5E]">
                      {cs.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Deliverables */}
            <div className="rounded-3xl border border-[#104042]/10 bg-white p-8 sm:p-10 shadow-sm">
              <h2 className="text-2xl font-extrabold text-[#104042] font-display">
                What You Get Every Month
              </h2>
              <ul className="mt-6 space-y-3">
                {service.deliverables.map((deliv, idx) => (
                  <li
                    key={idx}
                    className="flex items-center gap-3 text-sm font-semibold text-[#104042]"
                  >
                    <span className="h-2 w-2 rounded-full bg-[#006402]" />
                    {deliv}
                  </li>
                ))}
              </ul>
            </div>

            {/* FAQs */}
            {service.faq.length > 0 && (
              <div className="rounded-3xl border border-[#104042]/10 bg-white p-8 sm:p-10 shadow-sm">
                <h2 className="text-2xl font-extrabold text-[#104042] font-display">
                  Frequently Asked Questions
                </h2>
                <div className="mt-6 space-y-5">
                  {service.faq.map((item, idx) => (
                    <div
                      key={idx}
                      className="rounded-2xl border border-[#104042]/10 bg-[#E8F4F4]/20 p-5"
                    >
                      <h3 className="text-base font-bold text-[#104042] font-display">
                        {item.q}
                      </h3>
                      <p className="mt-2 text-sm leading-relaxed text-[#5E5E5E]">
                        {item.a}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Sidebar Column */}
          <div className="lg:col-span-4 space-y-8 sticky top-24">
            {/* All Services Navigation Card */}
            <div className="overflow-hidden rounded-3xl border border-[#104042]/10 bg-white p-6 shadow-sm">
              <h3 className="text-base font-extrabold uppercase tracking-wider text-[#104042] font-display pb-4 border-b border-[#104042]/10">
                All Services
              </h3>
              <div className="mt-4 space-y-1.5">
                {SERVICES_LIST.map((item) => {
                  const isActive = item.slug === service.slug;
                  return (
                    <Link
                      key={item.slug}
                      href={`/services/${item.slug}`}
                      className={`flex items-center justify-between rounded-xl px-4 py-3 text-xs font-bold uppercase tracking-wider transition ${
                        isActive
                          ? "bg-[#104042] text-[#AEFF1C] shadow-md"
                          : "text-[#104042]/80 hover:bg-[#E8F4F4] hover:text-[#006402]"
                      }`}
                    >
                      <span>{item.navLabel}</span>
                      <ChevronRight
                        className={`h-4 w-4 ${
                          isActive ? "text-[#AEFF1C]" : "text-[#104042]/40"
                        }`}
                      />
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* Booking / Quick Contact Box */}
            <div className="rounded-3xl border border-[#AEFF1C]/20 bg-[#104042] p-8 text-white shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 h-40 w-40 rounded-full bg-[#AEFF1C]/10 blur-2xl pointer-events-none" />

              <span className="text-xs font-bold uppercase tracking-widest text-[#AEFF1C]">
                Get In Touch
              </span>
              <h3 className="mt-2 text-2xl font-extrabold text-white font-display">
                Interested in Booking with us?
              </h3>
              <p className="mt-3 text-sm text-white/70">
                Book a 1-on-1 strategy call to review your current campaigns and receive a free audit.
              </p>

              <div className="mt-6 space-y-3">
                <a
                  href={`mailto:${settings.contactEmail}`}
                  className="flex items-center gap-3 text-sm font-semibold text-white/90 hover:text-[#AEFF1C] transition"
                >
                  <span className="grid h-8 w-8 place-items-center rounded-xl bg-white/10 text-[#AEFF1C]">
                    <Mail className="h-4 w-4" />
                  </span>
                  <span>{settings.contactEmail}</span>
                </a>

                <a
                  href={`tel:${settings.contactPhone}`}
                  className="flex items-center gap-3 text-sm font-semibold text-white/90 hover:text-[#AEFF1C] transition"
                >
                  <span className="grid h-8 w-8 place-items-center rounded-xl bg-white/10 text-[#AEFF1C]">
                    <Phone className="h-4 w-4" />
                  </span>
                  <span>{settings.contactPhone}</span>
                </a>
              </div>

              <div className="mt-8">
                <GorgeousButton
                  href="#contact"
                  variant="primary"
                  size="md"
                  className="w-full justify-center"
                  confettiOnClick
                >
                  Free Consultation
                </GorgeousButton>
              </div>
            </div>

            {/* Social Proof Trust Card */}
            <div className="rounded-3xl border border-[#104042]/10 bg-white p-6 shadow-sm text-center">
              <div className="flex justify-center items-center gap-1 text-amber-400">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-amber-400" />
                ))}
              </div>
              <p className="mt-2 text-2xl font-extrabold text-[#104042] font-display">
                {settings.ratingValue} / 5.0
              </p>
              <p className="text-xs text-[#5E5E5E] font-medium">{settings.ratingCount}</p>
              <div className="mt-4 pt-4 border-t border-[#104042]/10 flex items-center justify-center gap-2 text-xs font-semibold text-[#006402]">
                <ShieldCheck className="h-4 w-4" /> Verified Client Reviews
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Embedded Contact Section */}
      <ContactSection settings={settings} />

      {/* Footer */}
      <Footer settings={settings} />
    </main>
  );
}
