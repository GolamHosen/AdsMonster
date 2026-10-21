import "dotenv/config";
import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";
import { db, pool } from "@/db";
import {
  admins,
  services,
  stats,
  howItWorksSteps,
  testimonials,
  siteSettings,
} from "@/db/schema";

async function main() {
  console.log("Seeding database (Turso / SQLite)...");

  // --- Admin account -------------------------------------------------
  const email = (process.env.ADMIN_EMAIL ?? "admin@adsmonster.com").toLowerCase();
  const password = process.env.ADMIN_PASSWORD ?? "ChangeMe!2024Secure";

  const [existingAdmin] = await db
    .select({ id: admins.id })
    .from(admins)
    .where(eq(admins.email, email))
    .limit(1);

  if (!existingAdmin) {
    const passwordHash = await bcrypt.hash(password, 12);
    await db.insert(admins).values({
      name: "Site Owner",
      email,
      passwordHash,
      role: "owner",
    });
    console.log(`Created admin account: ${email}`);
  } else {
    console.log("Admin account already exists, skipping.");
  }

  // --- Site settings ---------------------------------------------------
  const existingSettings = await db.select().from(siteSettings).limit(1);
  if (existingSettings.length === 0) {
    await db.insert(siteSettings).values({});
    console.log("Created default site settings.");
  }

  // --- Services ----------------------------------------------------------
  const existingServices = await db.select().from(services).limit(1);
  if (existingServices.length === 0) {
    await db.insert(services).values([
      {
        title: "Google Pay per click Ads",
        slug: "google-pay-per-click-ads",
        description:
          "Run cost-effective pay-per-click campaigns focused on traffic, leads, and high-margin ROI.",
        icon: "Target",
        order: 1,
      },
      {
        title: "Google Search Ads",
        slug: "google-search-ads",
        description:
          "Reach high-intent customers searching for your products or services and turn clicks into qualified leads.",
        icon: "Search",
        order: 2,
      },
      {
        title: "Meta Ads (Facebook & Instagram)",
        slug: "meta-ads",
        description:
          "Target the right people with high-converting ads across Facebook and Instagram.",
        icon: "Instagram",
        order: 3,
      },
      {
        title: "TikTok Ads",
        slug: "tiktok-ads",
        description:
          "Create scroll-stopping ads that boost visibility, engagement, and fast-paced growth.",
        icon: "Music2",
        order: 4,
      },
      {
        title: "YouTube Ads",
        slug: "youtube-ads",
        description:
          "Engage your audience with impactful video ads that build trust and drive massive action.",
        icon: "Youtube",
        order: 5,
      },
      {
        title: "Linkden Ads",
        slug: "linkden-ads",
        description:
          "B2B lead generation campaigns that put your brand directly in front of C-suite decision-makers.",
        icon: "Linkedin",
        order: 6,
      },
      {
        title: "Search Engine Optimization",
        slug: "search-engine-optimization",
        description:
          "Increase organic traffic, improve rankings, and grow long-term online visibility and authority.",
        icon: "Globe",
        order: 7,
      },
    ]);
    console.log("Seeded services.");
  }

  // --- Stats / counters -----------------------------------------------
  const existingStats = await db.select().from(stats).limit(1);
  if (existingStats.length === 0) {
    await db.insert(stats).values([
      {
        label: "Project Done",
        value: "1,200+",
        description: "Successfully completed a wide range of digital marketing projects",
        icon: "Briefcase",
        order: 1,
      },
      {
        label: "Happy Clients",
        value: "480+",
        description: "Client success is at the heart of everything we do.",
        icon: "Smile",
        order: 2,
      },
      {
        label: "Award Winning",
        value: "15+",
        description: "We're proud to be recognized by leading industry platforms",
        icon: "Award",
        order: 3,
      },
    ]);
    console.log("Seeded stats.");
  }

  // --- How it works steps ----------------------------------------------
  const existingSteps = await db.select().from(howItWorksSteps).limit(1);
  if (existingSteps.length === 0) {
    await db.insert(howItWorksSteps).values([
      {
        stepNumber: 1,
        title: "Discovery Call",
        description: "We learn about your business, goals, and audience to shape the right strategy.",
        order: 1,
      },
      {
        stepNumber: 2,
        title: "Strategy & Plan",
        description: "We build a data-backed media plan across the right channels and budgets.",
        order: 2,
      },
      {
        stepNumber: 3,
        title: "Launch Campaigns",
        description: "Our team builds, launches and optimizes high-performing ad campaigns.",
        order: 3,
      },
      {
        stepNumber: 4,
        title: "Scale & Report",
        description: "We scale what works and deliver transparent reporting every step of the way.",
        order: 4,
      },
    ]);
    console.log("Seeded how-it-works steps.");
  }

  // --- Testimonials -------------------------------------------------
  const existingTestimonials = await db.select().from(testimonials).limit(1);
  if (existingTestimonials.length === 0) {
    await db.insert(testimonials).values([
      {
        name: "Sarah Mitchell",
        role: "Founder",
        company: "Bloom Skincare",
        content:
          "AdsMonster transformed our ad performance. Our ROAS doubled within the first two months of working with them.",
        rating: 5,
        avatarSeed: "Sarah",
        order: 1,
      },
      {
        name: "James Carter",
        role: "Marketing Director",
        company: "Fitwave",
        content:
          "Professional, data-driven, and genuinely invested in our growth. Best agency partnership we've had.",
        rating: 5,
        avatarSeed: "James",
        order: 2,
      },
      {
        name: "Priya Nair",
        role: "CEO",
        company: "Urban Nest",
        content:
          "The team's strategic approach to Meta and Google Ads helped us scale from 6 to 7 figures in revenue.",
        rating: 5,
        avatarSeed: "Priya",
        order: 3,
      },
    ]);
    console.log("Seeded testimonials.");
  }

  console.log("Seeding complete.");
}

main()
  .catch((err) => {
    console.error(err);
    process.exitCode = 1;
  })
  .finally(async () => {
    await pool.end();
  });
