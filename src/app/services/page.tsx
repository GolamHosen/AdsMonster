import type { Metadata } from "next";
import Link from "next/link";
import { SERVICES_LIST } from "@/data/services-data";
import { getSiteSettings } from "@/lib/site-data";
import { Header } from "@/components/site/Header";
import { ContactSection } from "@/components/site/ContactSection";
import { Footer } from "@/components/site/Footer";
import { CursorGlow } from "@/components/animations/CursorGlow";
import { HeroVisuals } from "@/components/animations/HeroVisuals";
import { ArrowUpRight, CheckCircle2 } from "lucide-react";

export const metadata: Metadata = {
  title: "Our Services – AdsMonster Performance Ads",
  description:
    "Explore our full suite of performance advertising services: Google PPC, Google Search, Meta Ads, TikTok Ads, YouTube Ads, LinkedIn Ads, and SEO.",
};

export default async function ServicesOverviewPage() {
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

      {/* Header Banner */}
      <section className="relative overflow-hidden bg-[#E2F1F1] text-[#104042] pt-28 pb-20 md:pt-32 md:pb-24 lg:pt-36 lg:pb-28 text-center">
        <HeroVisuals />

        <div className="relative mx-auto max-w-4xl px-6">
          <h1 className="text-4xl font-extrabold sm:text-5xl lg:text-6xl font-display leading-tight text-[#104042]">
            <span className="text-[#006402] relative inline-block underline decoration-[#AEFF1C] decoration-8 underline-offset-4">
              High-Performance
            </span>{" "}
            Advertising Services
          </h1>
          <p className="mt-4 text-lg text-[#104042]/75 max-w-2xl mx-auto">
            Everything you need to grow online ads, traffic, and conversions. Tailored strategy for every major ad channel.
          </p>
        </div>
      </section>

      {/* Services Grid */}
      <section className="mx-auto max-w-7xl px-6 py-24">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {SERVICES_LIST.map((service, idx) => (
            <Link
              key={service.slug}
              href={`/services/${service.slug}`}
              className="group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-[#104042]/10 bg-white p-8 shadow-sm transition-all hover:border-[#AEFF1C]/50 hover:shadow-xl hover:shadow-[#AEFF1C]/10 hover:-translate-y-1.5"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="grid h-12 w-12 place-items-center rounded-2xl bg-[#AEFF1C]/15 text-[#006402] text-sm font-extrabold group-hover:bg-[#AEFF1C] group-hover:text-[#104042] transition-colors">
                    0{idx + 1}
                  </span>
                  <span className="grid h-10 w-10 place-items-center rounded-full bg-[#E8F4F4] text-[#104042]/50 transition group-hover:bg-[#AEFF1C]/20 group-hover:text-[#006402]">
                    <ArrowUpRight className="h-5 w-5 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </span>
                </div>

                <h2 className="mt-6 text-xl font-bold text-[#104042] font-display group-hover:text-[#006402] transition-colors">
                  {service.title}
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-[#5E5E5E]">
                  {service.description}
                </p>
              </div>

              <div className="mt-6 pt-5 border-t border-[#104042]/8 flex items-center justify-between text-xs font-semibold text-[#006402]">
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4" /> Full Management
                </span>
                <span className="text-[#104042] font-bold group-hover:text-[#006402]">
                  Explore Details &rarr;
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <ContactSection settings={settings} />
      <Footer settings={settings} />
    </main>
  );
}
