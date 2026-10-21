import {
  getSiteSettings,
  getPublishedServices,
  getStats,
  getHowItWorksSteps,
  getPublishedTestimonials,
} from "@/lib/site-data";
import { Header } from "@/components/site/Header";
import { Hero } from "@/components/site/Hero";
import { Services } from "@/components/site/Services";
import { WhyChooseUs } from "@/components/site/WhyChooseUs";
import { CTA } from "@/components/site/CTA";
import { HowItWorks } from "@/components/site/HowItWorks";
import { Testimonials } from "@/components/site/Testimonials";
import { Newsletter } from "@/components/site/Newsletter";
import { ContactSection } from "@/components/site/ContactSection";
import { Footer } from "@/components/site/Footer";

import { CursorGlow } from "@/components/animations/CursorGlow";

export const dynamic = "force-dynamic";

const FALLBACK_SETTINGS = {
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

export default async function HomePage() {
  const [settings, services, stats, steps, testimonials] = await Promise.all([
    getSiteSettings(),
    getPublishedServices(),
    getStats(),
    getHowItWorksSteps(),
    getPublishedTestimonials(),
  ]);

  const resolvedSettings = settings ?? FALLBACK_SETTINGS;

  return (
    <main className="min-h-screen bg-[#E2F1F1] relative">
      <CursorGlow />
      <Header siteName={resolvedSettings.siteName} />
      <Hero settings={resolvedSettings} />
      <Services items={services} />
      <WhyChooseUs settings={resolvedSettings} items={stats} />
      <CTA settings={resolvedSettings} />
      <HowItWorks steps={steps} />
      <Testimonials items={testimonials} />
      <Newsletter settings={resolvedSettings} />
      <ContactSection settings={resolvedSettings} />
      <Footer settings={resolvedSettings} />
    </main>
  );
}
