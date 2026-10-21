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

  // Load migration SQL or use embedded fallback
  const migrationPath = join(process.cwd(), "drizzle", "0000_complete_chimera.sql");
  let statements: string[] = [];

  if (existsSync(migrationPath)) {
    const rawSql = readFileSync(migrationPath, "utf-8");
    statements = rawSql
      .split("--> statement-breakpoint")
      .map((s) => s.trim())
      .filter((s) => s.length > 0);
  } else {
    console.log("Migration file not found in drizzle/. Applying embedded schema definitions...");
    statements = [
      `CREATE TABLE IF NOT EXISTS \`admins\` (
        \`id\` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
        \`name\` text NOT NULL,
        \`email\` text NOT NULL,
        \`password_hash\` text NOT NULL,
        \`role\` text DEFAULT 'admin' NOT NULL,
        \`is_active\` integer DEFAULT true NOT NULL,
        \`failed_login_count\` integer DEFAULT 0 NOT NULL,
        \`locked_until\` integer,
        \`last_login_at\` integer,
        \`last_login_ip\` text,
        \`created_at\` integer NOT NULL,
        \`updated_at\` integer NOT NULL
      )`,
      `CREATE UNIQUE INDEX IF NOT EXISTS \`admins_email_unique\` ON \`admins\` (\`email\`)`,
      `CREATE TABLE IF NOT EXISTS \`audit_logs\` (
        \`id\` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
        \`admin_id\` integer,
        \`action\` text NOT NULL,
        \`entity\` text,
        \`entity_id\` text,
        \`ip\` text,
        \`metadata\` text,
        \`created_at\` integer NOT NULL,
        FOREIGN KEY (\`admin_id\`) REFERENCES \`admins\`(\`id\`) ON UPDATE no action ON DELETE set null
      )`,
      `CREATE TABLE IF NOT EXISTS \`client_sessions\` (
        \`id\` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
        \`client_id\` integer NOT NULL,
        \`token_hash\` text NOT NULL,
        \`user_agent\` text,
        \`ip\` text,
        \`expires_at\` integer NOT NULL,
        \`created_at\` integer NOT NULL,
        \`revoked_at\` integer,
        FOREIGN KEY (\`client_id\`) REFERENCES \`clients\`(\`id\`) ON UPDATE no action ON DELETE cascade
      )`,
      `CREATE UNIQUE INDEX IF NOT EXISTS \`client_sessions_token_hash_unique\` ON \`client_sessions\` (\`token_hash\`)`,
      `CREATE TABLE IF NOT EXISTS \`clients\` (
        \`id\` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
        \`name\` text NOT NULL,
        \`email\` text NOT NULL,
        \`password_hash\` text NOT NULL,
        \`phone\` text DEFAULT '' NOT NULL,
        \`company\` text DEFAULT '' NOT NULL,
        \`website\` text DEFAULT '' NOT NULL,
        \`is_active\` integer DEFAULT true NOT NULL,
        \`last_login_at\` integer,
        \`created_at\` integer NOT NULL,
        \`updated_at\` integer NOT NULL
      )`,
      `CREATE UNIQUE INDEX IF NOT EXISTS \`clients_email_unique\` ON \`clients\` (\`email\`)`,
      `CREATE TABLE IF NOT EXISTS \`how_it_works_steps\` (
        \`id\` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
        \`step_number\` integer NOT NULL,
        \`title\` text NOT NULL,
        \`description\` text NOT NULL,
        \`order\` integer DEFAULT 0 NOT NULL,
        \`created_at\` integer NOT NULL
      )`,
      `CREATE TABLE IF NOT EXISTS \`leads\` (
        \`id\` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
        \`name\` text NOT NULL,
        \`email\` text NOT NULL,
        \`phone\` text DEFAULT '' NOT NULL,
        \`company\` text DEFAULT '' NOT NULL,
        \`service_interest\` text DEFAULT '' NOT NULL,
        \`budget\` text DEFAULT '' NOT NULL,
        \`message\` text DEFAULT '' NOT NULL,
        \`status\` text DEFAULT 'new' NOT NULL,
        \`source\` text DEFAULT 'website' NOT NULL,
        \`ip\` text,
        \`created_at\` integer NOT NULL,
        \`updated_at\` integer NOT NULL
      )`,
      `CREATE TABLE IF NOT EXISTS \`newsletter_subscribers\` (
        \`id\` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
        \`email\` text NOT NULL,
        \`status\` text DEFAULT 'active' NOT NULL,
        \`ip\` text,
        \`created_at\` integer NOT NULL
      )`,
      `CREATE UNIQUE INDEX IF NOT EXISTS \`newsletter_subscribers_email_unique\` ON \`newsletter_subscribers\` (\`email\`)`,
      `CREATE TABLE IF NOT EXISTS \`package_orders\` (
        \`id\` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
        \`order_number\` text NOT NULL,
        \`client_id\` integer NOT NULL,
        \`package_name\` text NOT NULL,
        \`package_slug\` text NOT NULL,
        \`price\` text NOT NULL,
        \`amount\` integer DEFAULT 0 NOT NULL,
        \`billing_cycle\` text DEFAULT 'monthly' NOT NULL,
        \`ad_networks\` text DEFAULT 'Google Ads, Meta Ads' NOT NULL,
        \`monthly_ad_spend\` text DEFAULT 'Up to $10k' NOT NULL,
        \`features\` text,
        \`status\` text DEFAULT 'pending_review' NOT NULL,
        \`invoice_number\` text NOT NULL,
        \`invoice_status\` text DEFAULT 'sent' NOT NULL,
        \`invoice_sent_at\` integer,
        \`payment_method\` text DEFAULT 'manual_invoice' NOT NULL,
        \`payment_status\` text DEFAULT 'unpaid' NOT NULL,
        \`stripe_session_id\` text,
        \`stripe_payment_intent_id\` text,
        \`paypal_order_id\` text,
        \`paypal_capture_id\` text,
        \`paid_at\` integer,
        \`client_notes\` text DEFAULT '' NOT NULL,
        \`admin_notes\` text DEFAULT '' NOT NULL,
        \`billing_address\` text DEFAULT '' NOT NULL,
        \`tax_id\` text DEFAULT '' NOT NULL,
        \`created_at\` integer NOT NULL,
        \`updated_at\` integer NOT NULL,
        FOREIGN KEY (\`client_id\`) REFERENCES \`clients\`(\`id\`) ON UPDATE no action ON DELETE cascade
      )`,
      `CREATE UNIQUE INDEX IF NOT EXISTS \`package_orders_order_number_unique\` ON \`package_orders\` (\`order_number\`)`,
      `CREATE UNIQUE INDEX IF NOT EXISTS \`package_orders_invoice_number_unique\` ON \`package_orders\` (\`invoice_number\`)`,
      `CREATE TABLE IF NOT EXISTS \`rate_limits\` (
        \`id\` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
        \`bucket_key\` text NOT NULL,
        \`count\` integer DEFAULT 1 NOT NULL,
        \`window_start\` integer NOT NULL
      )`,
      `CREATE TABLE IF NOT EXISTS \`services\` (
        \`id\` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
        \`title\` text NOT NULL,
        \`slug\` text NOT NULL,
        \`description\` text NOT NULL,
        \`icon\` text DEFAULT 'Megaphone' NOT NULL,
        \`order\` integer DEFAULT 0 NOT NULL,
        \`published\` integer DEFAULT true NOT NULL,
        \`created_at\` integer NOT NULL,
        \`updated_at\` integer NOT NULL
      )`,
      `CREATE UNIQUE INDEX IF NOT EXISTS \`services_slug_unique\` ON \`services\` (\`slug\`)`,
      `CREATE TABLE IF NOT EXISTS \`sessions\` (
        \`id\` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
        \`admin_id\` integer NOT NULL,
        \`token_hash\` text NOT NULL,
        \`user_agent\` text,
        \`ip\` text,
        \`expires_at\` integer NOT NULL,
        \`created_at\` integer NOT NULL,
        \`revoked_at\` integer,
        FOREIGN KEY (\`admin_id\`) REFERENCES \`admins\`(\`id\`) ON UPDATE no action ON DELETE cascade
      )`,
      `CREATE UNIQUE INDEX IF NOT EXISTS \`sessions_token_hash_unique\` ON \`sessions\` (\`token_hash\`)`,
      `CREATE TABLE IF NOT EXISTS \`site_settings\` (
        \`id\` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
        \`site_name\` text DEFAULT 'AdsMonster' NOT NULL,
        \`tagline\` text DEFAULT 'Power your growth with smart ads' NOT NULL,
        \`hero_heading\` text DEFAULT 'Hi there, Welcome to AdsMonster.' NOT NULL,
        \`hero_subtext\` text DEFAULT 'AdsMonster is a results-driven digital advertising agency specializing in Google, Meta, YouTube, TikTok Ads and LinkedIn Ads to help brands scale faster and smarter.' NOT NULL,
        \`rating_value\` text DEFAULT '4.8' NOT NULL,
        \`rating_count\` text DEFAULT '24k rating' NOT NULL,
        \`years_experience\` text DEFAULT '8+' NOT NULL,
        \`about_title\` text DEFAULT 'About Us' NOT NULL,
        \`about_text\` text DEFAULT 'AdsMonster is your growth partner, focused on smart ads that drive real results, attract the right audience, and help your business grow faster.' NOT NULL,
        \`why_choose_title\` text DEFAULT 'WHY CHOOSE US' NOT NULL,
        \`why_choose_text\` text DEFAULT 'We partner with brands to deliver consistent, scalable growth through smart strategy, data-driven execution, and a results-first mindset. Here''s what sets us apart and earns our clients'' trust.' NOT NULL,
        \`cta_title\` text DEFAULT 'Ready to Grow Your Business Online?' NOT NULL,
        \`cta_subtext\` text DEFAULT 'Let''s work together to create marketing that actually works.' NOT NULL,
        \`newsletter_title\` text DEFAULT 'Signup Our Newsletter to Get Update Information.' NOT NULL,
        \`contact_email\` text DEFAULT 'hello@adsmonster.com' NOT NULL,
        \`contact_phone\` text DEFAULT '+1 (555) 010-2030' NOT NULL,
        \`contact_address\` text DEFAULT '123 Growth Avenue, Suite 400, New York, NY' NOT NULL,
        \`facebook_url\` text DEFAULT '#' NOT NULL,
        \`instagram_url\` text DEFAULT '#' NOT NULL,
        \`linkedin_url\` text DEFAULT '#' NOT NULL,
        \`twitter_url\` text DEFAULT '#' NOT NULL,
        \`updated_at\` integer NOT NULL
      )`,
      `CREATE TABLE IF NOT EXISTS \`stats\` (
        \`id\` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
        \`label\` text NOT NULL,
        \`value\` text NOT NULL,
        \`description\` text DEFAULT '' NOT NULL,
        \`icon\` text DEFAULT 'TrendingUp' NOT NULL,
        \`order\` integer DEFAULT 0 NOT NULL,
        \`created_at\` integer NOT NULL
      )`,
      `CREATE TABLE IF NOT EXISTS \`testimonials\` (
        \`id\` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
        \`name\` text NOT NULL,
        \`role\` text DEFAULT '' NOT NULL,
        \`company\` text DEFAULT '' NOT NULL,
        \`content\` text NOT NULL,
        \`rating\` integer DEFAULT 5 NOT NULL,
        \`avatar_seed\` text DEFAULT 'A' NOT NULL,
        \`published\` integer DEFAULT true NOT NULL,
        \`order\` integer DEFAULT 0 NOT NULL,
        \`created_at\` integer NOT NULL
      )`
    ];
  }

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
