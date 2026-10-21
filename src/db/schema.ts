import {
  sqliteTable,
  text,
  integer,
} from "drizzle-orm/sqlite-core";

// ---------------------------------------------------------------------------
// Enums & Status Literals
// ---------------------------------------------------------------------------
export const adminRoles = ["owner", "admin", "editor"] as const;
export type AdminRole = (typeof adminRoles)[number];

export const leadStatuses = [
  "new",
  "contacted",
  "qualified",
  "won",
  "lost",
] as const;
export type LeadStatus = (typeof leadStatuses)[number];

export const subscriberStatuses = ["active", "unsubscribed"] as const;
export type SubscriberStatus = (typeof subscriberStatuses)[number];

export const auditActions = [
  "login_success",
  "login_failed",
  "logout",
  "password_changed",
  "create",
  "update",
  "delete",
] as const;
export type AuditAction = (typeof auditActions)[number];

// ---------------------------------------------------------------------------
// Admin / Auth
// ---------------------------------------------------------------------------
export const admins = sqliteTable("admins", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  role: text("role", { enum: adminRoles }).notNull().default("admin"),
  isActive: integer("is_active", { mode: "boolean" }).notNull().default(true),
  failedLoginCount: integer("failed_login_count").notNull().default(0),
  lockedUntil: integer("locked_until", { mode: "timestamp_ms" }),
  lastLoginAt: integer("last_login_at", { mode: "timestamp_ms" }),
  lastLoginIp: text("last_login_ip"),
  createdAt: integer("created_at", { mode: "timestamp_ms" })
    .notNull()
    .$defaultFn(() => new Date()),
  updatedAt: integer("updated_at", { mode: "timestamp_ms" })
    .notNull()
    .$defaultFn(() => new Date()),
});

export const sessions = sqliteTable("sessions", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  adminId: integer("admin_id")
    .notNull()
    .references(() => admins.id, { onDelete: "cascade" }),
  tokenHash: text("token_hash").notNull().unique(),
  userAgent: text("user_agent"),
  ip: text("ip"),
  expiresAt: integer("expires_at", { mode: "timestamp_ms" }).notNull(),
  createdAt: integer("created_at", { mode: "timestamp_ms" })
    .notNull()
    .$defaultFn(() => new Date()),
  revokedAt: integer("revoked_at", { mode: "timestamp_ms" }),
});

export const auditLogs = sqliteTable("audit_logs", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  adminId: integer("admin_id").references(() => admins.id, { onDelete: "set null" }),
  action: text("action", { enum: auditActions }).notNull(),
  entity: text("entity"),
  entityId: text("entity_id"),
  ip: text("ip"),
  metadata: text("metadata", { mode: "json" }),
  createdAt: integer("created_at", { mode: "timestamp_ms" })
    .notNull()
    .$defaultFn(() => new Date()),
});

export const rateLimits = sqliteTable("rate_limits", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  bucketKey: text("bucket_key").notNull(),
  count: integer("count").notNull().default(1),
  windowStart: integer("window_start", { mode: "timestamp_ms" })
    .notNull()
    .$defaultFn(() => new Date()),
});

// ---------------------------------------------------------------------------
// Public site content
// ---------------------------------------------------------------------------
export const siteSettings = sqliteTable("site_settings", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  siteName: text("site_name").notNull().default("AdsMonster"),
  tagline: text("tagline").notNull().default("Power your growth with smart ads"),
  heroHeading: text("hero_heading").notNull().default("Hi there, Welcome to AdsMonster."),
  heroSubtext: text("hero_subtext").notNull().default(
    "AdsMonster is a results-driven digital advertising agency specializing in Google, Meta, YouTube, TikTok Ads and LinkedIn Ads to help brands scale faster and smarter.",
  ),
  ratingValue: text("rating_value").notNull().default("4.8"),
  ratingCount: text("rating_count").notNull().default("24k rating"),
  yearsExperience: text("years_experience").notNull().default("8+"),
  aboutTitle: text("about_title").notNull().default("About Us"),
  aboutText: text("about_text").notNull().default(
    "AdsMonster is your growth partner, focused on smart ads that drive real results, attract the right audience, and help your business grow faster.",
  ),
  whyChooseTitle: text("why_choose_title").notNull().default("WHY CHOOSE US"),
  whyChooseText: text("why_choose_text").notNull().default(
    "We partner with brands to deliver consistent, scalable growth through smart strategy, data-driven execution, and a results-first mindset. Here's what sets us apart and earns our clients' trust.",
  ),
  ctaTitle: text("cta_title").notNull().default("Ready to Grow Your Business Online?"),
  ctaSubtext: text("cta_subtext").notNull().default(
    "Let's work together to create marketing that actually works.",
  ),
  newsletterTitle: text("newsletter_title").notNull().default(
    "Signup Our Newsletter to Get Update Information.",
  ),
  contactEmail: text("contact_email").notNull().default("hello@adsmonster.com"),
  contactPhone: text("contact_phone").notNull().default("+1 (555) 010-2030"),
  contactAddress: text("contact_address").notNull().default(
    "123 Growth Avenue, Suite 400, New York, NY",
  ),
  facebookUrl: text("facebook_url").notNull().default("#"),
  instagramUrl: text("instagram_url").notNull().default("#"),
  linkedinUrl: text("linkedin_url").notNull().default("#"),
  twitterUrl: text("twitter_url").notNull().default("#"),
  updatedAt: integer("updated_at", { mode: "timestamp_ms" })
    .notNull()
    .$defaultFn(() => new Date()),
});

export const services = sqliteTable("services", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  title: text("title").notNull(),
  slug: text("slug").notNull().unique(),
  description: text("description").notNull(),
  icon: text("icon").notNull().default("Megaphone"),
  order: integer("order").notNull().default(0),
  published: integer("published", { mode: "boolean" }).notNull().default(true),
  createdAt: integer("created_at", { mode: "timestamp_ms" })
    .notNull()
    .$defaultFn(() => new Date()),
  updatedAt: integer("updated_at", { mode: "timestamp_ms" })
    .notNull()
    .$defaultFn(() => new Date()),
});

export const stats = sqliteTable("stats", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  label: text("label").notNull(),
  value: text("value").notNull(),
  description: text("description").notNull().default(""),
  icon: text("icon").notNull().default("TrendingUp"),
  order: integer("order").notNull().default(0),
  createdAt: integer("created_at", { mode: "timestamp_ms" })
    .notNull()
    .$defaultFn(() => new Date()),
});

export const howItWorksSteps = sqliteTable("how_it_works_steps", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  stepNumber: integer("step_number").notNull(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  order: integer("order").notNull().default(0),
  createdAt: integer("created_at", { mode: "timestamp_ms" })
    .notNull()
    .$defaultFn(() => new Date()),
});

export const testimonials = sqliteTable("testimonials", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  role: text("role").notNull().default(""),
  company: text("company").notNull().default(""),
  content: text("content").notNull(),
  rating: integer("rating").notNull().default(5),
  avatarSeed: text("avatar_seed").notNull().default("A"),
  published: integer("published", { mode: "boolean" }).notNull().default(true),
  order: integer("order").notNull().default(0),
  createdAt: integer("created_at", { mode: "timestamp_ms" })
    .notNull()
    .$defaultFn(() => new Date()),
});

// ---------------------------------------------------------------------------
// Leads / Contact + Newsletter
// ---------------------------------------------------------------------------
export const leads = sqliteTable("leads", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  email: text("email").notNull(),
  phone: text("phone").notNull().default(""),
  company: text("company").notNull().default(""),
  serviceInterest: text("service_interest").notNull().default(""),
  budget: text("budget").notNull().default(""),
  message: text("message").notNull().default(""),
  status: text("status", { enum: leadStatuses }).notNull().default("new"),
  source: text("source").notNull().default("website"),
  ip: text("ip"),
  createdAt: integer("created_at", { mode: "timestamp_ms" })
    .notNull()
    .$defaultFn(() => new Date()),
  updatedAt: integer("updated_at", { mode: "timestamp_ms" })
    .notNull()
    .$defaultFn(() => new Date()),
});

export const newsletterSubscribers = sqliteTable("newsletter_subscribers", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  email: text("email").notNull().unique(),
  status: text("status", { enum: subscriberStatuses }).notNull().default("active"),
  ip: text("ip"),
  createdAt: integer("created_at", { mode: "timestamp_ms" })
    .notNull()
    .$defaultFn(() => new Date()),
});

// ---------------------------------------------------------------------------
// Clients & Package Orders
// ---------------------------------------------------------------------------
export const packageOrderStatuses = [
  "pending_review",
  "active",
  "completed",
  "cancelled",
] as const;
export type PackageOrderStatus = (typeof packageOrderStatuses)[number];

export const invoiceStatuses = [
  "sent",
  "pending",
  "paid",
] as const;
export type InvoiceStatus = (typeof invoiceStatuses)[number];

export const paymentStatuses = [
  "unpaid",
  "paid",
  "failed",
  "refunded",
] as const;
export type PaymentStatus = (typeof paymentStatuses)[number];

export const paymentMethods = [
  "stripe",
  "paypal",
  "manual_invoice",
] as const;
export type PaymentMethod = (typeof paymentMethods)[number];

export const clients = sqliteTable("clients", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  phone: text("phone").notNull().default(""),
  company: text("company").notNull().default(""),
  website: text("website").notNull().default(""),
  isActive: integer("is_active", { mode: "boolean" }).notNull().default(true),
  lastLoginAt: integer("last_login_at", { mode: "timestamp_ms" }),
  createdAt: integer("created_at", { mode: "timestamp_ms" })
    .notNull()
    .$defaultFn(() => new Date()),
  updatedAt: integer("updated_at", { mode: "timestamp_ms" })
    .notNull()
    .$defaultFn(() => new Date()),
});

export const clientSessions = sqliteTable("client_sessions", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  clientId: integer("client_id")
    .notNull()
    .references(() => clients.id, { onDelete: "cascade" }),
  tokenHash: text("token_hash").notNull().unique(),
  userAgent: text("user_agent"),
  ip: text("ip"),
  expiresAt: integer("expires_at", { mode: "timestamp_ms" }).notNull(),
  createdAt: integer("created_at", { mode: "timestamp_ms" })
    .notNull()
    .$defaultFn(() => new Date()),
  revokedAt: integer("revoked_at", { mode: "timestamp_ms" }),
});

export const packageOrders = sqliteTable("package_orders", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  orderNumber: text("order_number").notNull().unique(),
  clientId: integer("client_id")
    .notNull()
    .references(() => clients.id, { onDelete: "cascade" }),
  packageName: text("package_name").notNull(),
  packageSlug: text("package_slug").notNull(),
  price: text("price").notNull(),
  amount: integer("amount").notNull().default(0),
  billingCycle: text("billing_cycle").notNull().default("monthly"),
  adNetworks: text("ad_networks").notNull().default("Google Ads, Meta Ads"),
  monthlyAdSpend: text("monthly_ad_spend").notNull().default("Up to $10k"),
  features: text("features", { mode: "json" }),
  status: text("status", { enum: packageOrderStatuses }).notNull().default("pending_review"),
  invoiceNumber: text("invoice_number").notNull().unique(),
  invoiceStatus: text("invoice_status", { enum: invoiceStatuses }).notNull().default("sent"),
  invoiceSentAt: integer("invoice_sent_at", { mode: "timestamp_ms" }),
  paymentMethod: text("payment_method", { enum: paymentMethods }).notNull().default("manual_invoice"),
  paymentStatus: text("payment_status", { enum: paymentStatuses }).notNull().default("unpaid"),
  stripeSessionId: text("stripe_session_id"),
  stripePaymentIntentId: text("stripe_payment_intent_id"),
  paypalOrderId: text("paypal_order_id"),
  paypalCaptureId: text("paypal_capture_id"),
  paidAt: integer("paid_at", { mode: "timestamp_ms" }),
  clientNotes: text("client_notes").notNull().default(""),
  adminNotes: text("admin_notes").notNull().default(""),
  billingAddress: text("billing_address").notNull().default(""),
  taxId: text("tax_id").notNull().default(""),
  createdAt: integer("created_at", { mode: "timestamp_ms" })
    .notNull()
    .$defaultFn(() => new Date()),
  updatedAt: integer("updated_at", { mode: "timestamp_ms" })
    .notNull()
    .$defaultFn(() => new Date()),
});

export type Client = typeof clients.$inferSelect;
export type NewClient = typeof clients.$inferInsert;
export type PackageOrder = typeof packageOrders.$inferSelect;
export type NewPackageOrder = typeof packageOrders.$inferInsert;

