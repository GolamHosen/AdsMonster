import type { Metadata } from "next";
import { getSiteSettings, getStats } from "@/lib/site-data";
import { Header } from "@/components/site/Header";
import { ContactSection } from "@/components/site/ContactSection";
import { Footer } from "@/components/site/Footer";
import { CursorGlow } from "@/components/animations/CursorGlow";
import { AboutPageContent } from "@/components/site/AboutPageContent";

export const metadata: Metadata = {
  title: "About Us – AdsMonster | Results-Driven Digital Advertising Agency",
  description:
    "Learn about AdsMonster — a results-driven digital advertising agency specializing in Google, Meta, TikTok, YouTube, and LinkedIn Ads to help brands scale faster and smarter.",
};

export default async function AboutPage() {
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

  const stats = await getStats();

  return (
    <main className="min-h-screen bg-[#E2F1F1] text-[#5E5E5E]">
      <CursorGlow />
      <Header siteName={settings.siteName} />
      <AboutPageContent settings={settings} stats={stats} />
      <ContactSection settings={settings} />
      <Footer settings={settings} />
    </main>
  );
}
