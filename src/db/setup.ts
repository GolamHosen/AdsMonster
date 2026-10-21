import "dotenv/config";
import { readFileSync, existsSync } from "node:fs";
import { join } from "node:path";
import { createClient } from "@libsql/client";
import * as schema from "./schema";
import { drizzle } from "drizzle-orm/libsql";
import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";

async function setup() {
  console.log("Setting up database schema & seed data...");

  // Determine target URL:
  const rawTursoUrl = process.env.TURSO_DATABASE_URL?.trim();
  const rawTursoToken = process.env.TURSO_AUTH_TOKEN?.trim();

  // If TURSO_DATABASE_URL is set and reachable, use it, otherwise local.db
  let targetUrl = rawTursoUrl && rawTursoUrl.length > 0 ? rawTursoUrl : "file:local.db";

  console.log(`Connecting to: ${targetUrl.startsWith("libsql://") ? targetUrl : "file:local.db"}`);
  
  let client = createClient({
    url: targetUrl,
    authToken: rawTursoToken,
  });

  // Test connectivity
  try {
    await client.execute("SELECT 1");
  } catch (err: any) {
    console.warn("Could not connect to configured URL (network/DNS/auth). Falling back to file:local.db", err?.message || err);
    client.close();
    targetUrl = "file:local.db";
    client = createClient({ url: targetUrl });
  }

  // Load migration SQL
  const migrationPath = join(process.cwd(), "drizzle", "0000_complete_chimera.sql");
  if (!existsSync(migrationPath)) {
    console.error("Migration file not found at:", migrationPath);
    process.exit(1);
  }

  const rawSql = readFileSync(migrationPath, "utf-8");
  // Split on statement breakpoint
  const statements = rawSql
    .split("--> statement-breakpoint")
    .map((s) => s.trim())
    .filter((s) => s.length > 0);

  console.log(`Applying ${statements.length} schema statements...`);
  for (const statement of statements) {
    try {
      await client.execute(statement);
    } catch (err: any) {
      // Ignore if table or index already exists
      if (!err.message?.includes("already exists")) {
        console.warn("Warning executing statement:", err.message);
      }
    }
  }

  console.log("Schema applied successfully! Now seeding default data...");

  const db = drizzle(client, { schema });

  // 1. Admin account
  const email = (process.env.ADMIN_EMAIL ?? "admin@adsmonster.com").toLowerCase();
  const password = process.env.ADMIN_PASSWORD ?? "ChangeMe!2024Secure";

  const [existingAdmin] = await db
    .select({ id: schema.admins.id })
    .from(schema.admins)
    .where(eq(schema.admins.email, email))
    .limit(1);

  if (!existingAdmin) {
    const passwordHash = await bcrypt.hash(password, 12);
    await db.insert(schema.admins).values({
      name: "Site Owner",
      email,
      passwordHash,
      role: "owner",
    });
    console.log(`Created admin account: ${email}`);
  }

  // 2. Site Settings
  const [existingSettings] = await db.select().from(schema.siteSettings).limit(1);
  if (!existingSettings) {
    await db.insert(schema.siteSettings).values({
      siteName: "Ads Monster",
      tagline: "High-ROI Digital Advertising Agency",
      heroHeading: "Scale Your Revenue with High-Converting Ads",
      heroSubtext: "We plan, build, and optimize high-ROI ad campaigns across Google, Meta, TikTok, and LinkedIn.",
      contactEmail: "hello@adsmonster.com",
    });
    console.log("Created default site settings.");
  }

  // 3. Stats
  const existingStats = await db.select().from(schema.stats).limit(1);
  if (existingStats.length === 0) {
    await db.insert(schema.stats).values([
      { label: "Ad Spend Managed", value: "$45M+", description: "Total budget scaled profitably", icon: "DollarSign", order: 1 },
      { label: "ROAS Average", value: "4.8x", description: "Across client campaigns", icon: "TrendingUp", order: 2 },
      { label: "Active Clients", value: "120+", description: "E-commerce and B2B brands", icon: "Users", order: 3 },
      { label: "Campaigns Launched", value: "1,500+", description: "Data-driven ad funnels", icon: "Award", order: 4 },
    ]);
    console.log("Created default stats.");
  }

  // 4. Services
  const existingServices = await db.select().from(schema.services).limit(1);
  if (existingServices.length === 0) {
    await db.insert(schema.services).values([
      {
        title: "Google PPC & Search Ads",
        slug: "google-ppc-ads",
        description: "Target high-intent buyers actively searching for your services with maximum ROI.",
        icon: "Target",
        order: 1,
      },
      {
        title: "Meta (Facebook & IG) Ads",
        slug: "meta-ads",
        description: "Scale hyper-targeted creative funnels across Facebook and Instagram feeds and reels.",
        icon: "Zap",
        order: 2,
      },
      {
        title: "Conversion Rate Optimization",
        slug: "cro-optimization",
        description: "Design and split-test high-converting landing pages that turn ad clicks into paying clients.",
        icon: "TrendingUp",
        order: 3,
      },
    ]);
    console.log("Created default services.");
  }

  console.log("Database setup and seeding completed successfully!");
  client.close();
}

setup().catch((err) => {
  console.error("Setup failed:", err);
  process.exit(1);
});
