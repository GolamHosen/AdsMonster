import { Suspense } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { getSiteSettings } from "@/lib/site-data";
import { Header } from "@/components/site/Header";
import { ContactSection } from "@/components/site/ContactSection";
import { Footer } from "@/components/site/Footer";
import { CursorGlow } from "@/components/animations/CursorGlow";
import { HeroVisuals } from "@/components/animations/HeroVisuals";
import { Sparkles, Zap, ShieldCheck } from "lucide-react";
import { PricingCards } from "@/components/site/PricingCards";

export const metadata: Metadata = {
  title: "Our Pricing – Transparent Performance Packages – AdsMonster",
  description:
    "Explore transparent pricing plans for Google, Meta, TikTok, YouTube, and LinkedIn Ads. No long-term lock-in, results-driven scaling.",
};

export default async function PricingPage() {
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
            Predictable Investment.{" "}
            <span className="text-[#006402] relative inline-block underline decoration-[#AEFF1C] decoration-8 underline-offset-4">
              Measurable Returns.
            </span>
          </h1>
          <p className="mt-4 text-lg text-[#104042]/75 max-w-2xl mx-auto">
            No hidden fees or long-term lock-ins. Pick the tier that matches your current stage, receive your instant email invoice, and scale up as revenue flows.
          </p>
        </div>
      </section>

      {/* Pricing Cards Grid */}
      <section className="mx-auto max-w-7xl px-6 py-24">
        <Suspense
          fallback={
            <div className="py-20 text-center font-bold text-[#104042]">
              Loading pricing packages...
            </div>
          }
        >
          <PricingCards />
        </Suspense>


        {/* Guarantees Box */}
        <div className="mt-16 grid gap-6 sm:grid-cols-3 text-center">
          <div className="rounded-2xl border border-[#104042]/10 bg-white p-6 shadow-sm">
            <Zap className="mx-auto h-7 w-7 text-[#006402]" />
            <h3 className="mt-3 text-base font-bold text-[#104042]">Month-to-Month Flexibility</h3>
            <p className="mt-1 text-xs text-[#5E5E5E]">No long-term locks. Stay because we produce results.</p>
          </div>
          <div className="rounded-2xl border border-[#104042]/10 bg-white p-6 shadow-sm">
            <ShieldCheck className="mx-auto h-7 w-7 text-[#006402]" />
            <h3 className="mt-3 text-base font-bold text-[#104042]">100% Account Ownership</h3>
            <p className="mt-1 text-xs text-[#5E5E5E]">All ad accounts and creative assets belong to you forever.</p>
          </div>
          <div className="rounded-2xl border border-[#104042]/10 bg-white p-6 shadow-sm">
            <Sparkles className="mx-auto h-7 w-7 text-[#006402]" />
            <h3 className="mt-3 text-base font-bold text-[#104042]">Transparent Live Reporting</h3>
            <p className="mt-1 text-xs text-[#5E5E5E]">Direct access to raw platform numbers 24 hours a day.</p>
          </div>
        </div>
      </section>

      <ContactSection settings={settings} />
      <Footer settings={settings} />
    </main>
  );
}
