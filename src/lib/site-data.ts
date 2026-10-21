import "server-only";
import { asc, eq } from "drizzle-orm";
import { db, isDatabaseConfigured } from "@/db";
import {
  siteSettings,
  services,
  stats,
  howItWorksSteps,
  testimonials,
} from "@/db/schema";

export const FALLBACK_SERVICES: (typeof services.$inferSelect)[] = [
  {
    id: 1,
    title: "Google Pay per click Ads",
    slug: "google-pay-per-click-ads",
    description:
      "Run cost-effective pay-per-click campaigns focused on traffic, leads, and high-margin ROI.",
    icon: "Target",
    order: 1,
    published: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 2,
    title: "Google Search Ads",
    slug: "google-search-ads",
    description:
      "Reach high-intent customers searching for your products or services and turn clicks into qualified leads.",
    icon: "Search",
    order: 2,
    published: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 3,
    title: "Meta Ads (Facebook & Instagram)",
    slug: "meta-ads",
    description:
      "Target the right people with high-converting ads across Facebook and Instagram.",
    icon: "Instagram",
    order: 3,
    published: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 4,
    title: "TikTok Ads",
    slug: "tiktok-ads",
    description:
      "Create scroll-stopping ads that boost visibility, engagement, and fast-paced growth.",
    icon: "Music2",
    order: 4,
    published: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 5,
    title: "YouTube Ads",
    slug: "youtube-ads",
    description:
      "Engage your audience with impactful video ads that build trust and drive massive action.",
    icon: "Youtube",
    order: 5,
    published: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 6,
    title: "Linkden Ads",
    slug: "linkden-ads",
    description:
      "B2B lead generation campaigns that put your brand directly in front of C-suite decision-makers.",
    icon: "Linkedin",
    order: 6,
    published: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 7,
    title: "Search Engine Optimization",
    slug: "search-engine-optimization",
    description:
      "Increase organic traffic, improve rankings, and grow long-term online visibility and authority.",
    icon: "Globe",
    order: 7,
    published: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

export const FALLBACK_STATS: (typeof stats.$inferSelect)[] = [
  {
    id: 1,
    label: "Project Done",
    value: "1,200+",
    description: "Successfully completed a wide range of digital marketing projects",
    icon: "Briefcase",
    order: 1,
    createdAt: new Date(),
  },
  {
    id: 2,
    label: "Happy Clients",
    value: "480+",
    description: "Client success is at the heart of everything we do.",
    icon: "Smile",
    order: 2,
    createdAt: new Date(),
  },
  {
    id: 3,
    label: "Award Winning",
    value: "15+",
    description: "We're proud to be recognized by leading industry platforms",
    icon: "Award",
    order: 3,
    createdAt: new Date(),
  },
];

export const FALLBACK_STEPS: (typeof howItWorksSteps.$inferSelect)[] = [
  {
    id: 1,
    stepNumber: 1,
    title: "Discovery Call",
    description: "We learn about your business, goals, and audience to shape the right strategy.",
    order: 1,
    createdAt: new Date(),
  },
  {
    id: 2,
    stepNumber: 2,
    title: "Strategy & Plan",
    description: "We build a data-backed media plan across the right channels and budgets.",
    order: 2,
    createdAt: new Date(),
  },
  {
    id: 3,
    stepNumber: 3,
    title: "Launch Campaigns",
    description: "Our team builds, launches and optimizes high-performing ad campaigns.",
    order: 3,
    createdAt: new Date(),
  },
  {
    id: 4,
    stepNumber: 4,
    title: "Scale & Report",
    description: "We scale what works and deliver transparent reporting every step of the way.",
    order: 4,
    createdAt: new Date(),
  },
];

export const FALLBACK_TESTIMONIALS: (typeof testimonials.$inferSelect)[] = [
  {
    id: 1,
    name: "Sarah Mitchell",
    role: "Founder",
    company: "Bloom Skincare",
    content:
      "AdsMonster transformed our ad performance. Our ROAS doubled within the first two months of working with them.",
    rating: 5,
    avatarSeed: "Sarah",
    published: true,
    order: 1,
    createdAt: new Date(),
  },
  {
    id: 2,
    name: "James Carter",
    role: "Marketing Director",
    company: "Fitwave",
    content:
      "Professional, data-driven, and genuinely invested in our growth. Best agency partnership we've had.",
    rating: 5,
    avatarSeed: "James",
    published: true,
    order: 2,
    createdAt: new Date(),
  },
  {
    id: 3,
    name: "Priya Nair",
    role: "CEO",
    company: "Urban Nest",
    content:
      "The team's strategic approach to Meta and Google Ads helped us scale from 6 to 7 figures in revenue.",
    rating: 5,
    avatarSeed: "Priya",
    published: true,
    order: 3,
    createdAt: new Date(),
  },
];

export async function getSiteSettings() {
  if (!isDatabaseConfigured) return null;
  try {
    const [settings] = await db.select().from(siteSettings).limit(1);
    return settings ?? null;
  } catch (err) {
    console.warn("[SiteData] Database unavailable, using fallback settings:", err);
    return null;
  }
}

export async function getPublishedServices() {
  if (!isDatabaseConfigured) return FALLBACK_SERVICES;
  try {
    const rows = await db
      .select()
      .from(services)
      .where(eq(services.published, true))
      .orderBy(asc(services.order));
    return rows.length > 0 ? rows : FALLBACK_SERVICES;
  } catch (err) {
    console.warn("[SiteData] Database unavailable, using fallback services:", err);
    return FALLBACK_SERVICES;
  }
}

export async function getStats() {
  if (!isDatabaseConfigured) return FALLBACK_STATS;
  try {
    const rows = await db.select().from(stats).orderBy(asc(stats.order));
    return rows.length > 0 ? rows : FALLBACK_STATS;
  } catch (err) {
    console.warn("[SiteData] Database unavailable, using fallback stats:", err);
    return FALLBACK_STATS;
  }
}

export async function getHowItWorksSteps() {
  if (!isDatabaseConfigured) return FALLBACK_STEPS;
  try {
    const rows = await db.select().from(howItWorksSteps).orderBy(asc(howItWorksSteps.order));
    return rows.length > 0 ? rows : FALLBACK_STEPS;
  } catch (err) {
    console.warn("[SiteData] Database unavailable, using fallback steps:", err);
    return FALLBACK_STEPS;
  }
}

export async function getPublishedTestimonials() {
  if (!isDatabaseConfigured) return FALLBACK_TESTIMONIALS;
  try {
    const rows = await db
      .select()
      .from(testimonials)
      .where(eq(testimonials.published, true))
      .orderBy(asc(testimonials.order));
    return rows.length > 0 ? rows : FALLBACK_TESTIMONIALS;
  } catch (err) {
    console.warn("[SiteData] Database unavailable, using fallback testimonials:", err);
    return FALLBACK_TESTIMONIALS;
  }
}
