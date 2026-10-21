CREATE TABLE `admins` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`email` text NOT NULL,
	`password_hash` text NOT NULL,
	`role` text DEFAULT 'admin' NOT NULL,
	`is_active` integer DEFAULT true NOT NULL,
	`failed_login_count` integer DEFAULT 0 NOT NULL,
	`locked_until` integer,
	`last_login_at` integer,
	`last_login_ip` text,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `admins_email_unique` ON `admins` (`email`);--> statement-breakpoint
CREATE TABLE `audit_logs` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`admin_id` integer,
	`action` text NOT NULL,
	`entity` text,
	`entity_id` text,
	`ip` text,
	`metadata` text,
	`created_at` integer NOT NULL,
	FOREIGN KEY (`admin_id`) REFERENCES `admins`(`id`) ON UPDATE no action ON DELETE set null
);
--> statement-breakpoint
CREATE TABLE `client_sessions` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`client_id` integer NOT NULL,
	`token_hash` text NOT NULL,
	`user_agent` text,
	`ip` text,
	`expires_at` integer NOT NULL,
	`created_at` integer NOT NULL,
	`revoked_at` integer,
	FOREIGN KEY (`client_id`) REFERENCES `clients`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `client_sessions_token_hash_unique` ON `client_sessions` (`token_hash`);--> statement-breakpoint
CREATE TABLE `clients` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`email` text NOT NULL,
	`password_hash` text NOT NULL,
	`phone` text DEFAULT '' NOT NULL,
	`company` text DEFAULT '' NOT NULL,
	`website` text DEFAULT '' NOT NULL,
	`is_active` integer DEFAULT true NOT NULL,
	`last_login_at` integer,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `clients_email_unique` ON `clients` (`email`);--> statement-breakpoint
CREATE TABLE `how_it_works_steps` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`step_number` integer NOT NULL,
	`title` text NOT NULL,
	`description` text NOT NULL,
	`order` integer DEFAULT 0 NOT NULL,
	`created_at` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `leads` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`email` text NOT NULL,
	`phone` text DEFAULT '' NOT NULL,
	`company` text DEFAULT '' NOT NULL,
	`service_interest` text DEFAULT '' NOT NULL,
	`budget` text DEFAULT '' NOT NULL,
	`message` text DEFAULT '' NOT NULL,
	`status` text DEFAULT 'new' NOT NULL,
	`source` text DEFAULT 'website' NOT NULL,
	`ip` text,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `newsletter_subscribers` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`email` text NOT NULL,
	`status` text DEFAULT 'active' NOT NULL,
	`ip` text,
	`created_at` integer NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `newsletter_subscribers_email_unique` ON `newsletter_subscribers` (`email`);--> statement-breakpoint
CREATE TABLE `package_orders` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`order_number` text NOT NULL,
	`client_id` integer NOT NULL,
	`package_name` text NOT NULL,
	`package_slug` text NOT NULL,
	`price` text NOT NULL,
	`amount` integer DEFAULT 0 NOT NULL,
	`billing_cycle` text DEFAULT 'monthly' NOT NULL,
	`ad_networks` text DEFAULT 'Google Ads, Meta Ads' NOT NULL,
	`monthly_ad_spend` text DEFAULT 'Up to $10k' NOT NULL,
	`features` text,
	`status` text DEFAULT 'pending_review' NOT NULL,
	`invoice_number` text NOT NULL,
	`invoice_status` text DEFAULT 'sent' NOT NULL,
	`invoice_sent_at` integer,
	`payment_method` text DEFAULT 'manual_invoice' NOT NULL,
	`payment_status` text DEFAULT 'unpaid' NOT NULL,
	`stripe_session_id` text,
	`stripe_payment_intent_id` text,
	`paypal_order_id` text,
	`paypal_capture_id` text,
	`paid_at` integer,
	`client_notes` text DEFAULT '' NOT NULL,
	`admin_notes` text DEFAULT '' NOT NULL,
	`billing_address` text DEFAULT '' NOT NULL,
	`tax_id` text DEFAULT '' NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`client_id`) REFERENCES `clients`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `package_orders_order_number_unique` ON `package_orders` (`order_number`);--> statement-breakpoint
CREATE UNIQUE INDEX `package_orders_invoice_number_unique` ON `package_orders` (`invoice_number`);--> statement-breakpoint
CREATE TABLE `rate_limits` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`bucket_key` text NOT NULL,
	`count` integer DEFAULT 1 NOT NULL,
	`window_start` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `services` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`title` text NOT NULL,
	`slug` text NOT NULL,
	`description` text NOT NULL,
	`icon` text DEFAULT 'Megaphone' NOT NULL,
	`order` integer DEFAULT 0 NOT NULL,
	`published` integer DEFAULT true NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `services_slug_unique` ON `services` (`slug`);--> statement-breakpoint
CREATE TABLE `sessions` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`admin_id` integer NOT NULL,
	`token_hash` text NOT NULL,
	`user_agent` text,
	`ip` text,
	`expires_at` integer NOT NULL,
	`created_at` integer NOT NULL,
	`revoked_at` integer,
	FOREIGN KEY (`admin_id`) REFERENCES `admins`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `sessions_token_hash_unique` ON `sessions` (`token_hash`);--> statement-breakpoint
CREATE TABLE `site_settings` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`site_name` text DEFAULT 'AdsMonster' NOT NULL,
	`tagline` text DEFAULT 'Power your growth with smart ads' NOT NULL,
	`hero_heading` text DEFAULT 'Hi there, Welcome to AdsMonster.' NOT NULL,
	`hero_subtext` text DEFAULT 'AdsMonster is a results-driven digital advertising agency specializing in Google, Meta, YouTube, TikTok Ads and LinkedIn Ads to help brands scale faster and smarter.' NOT NULL,
	`rating_value` text DEFAULT '4.8' NOT NULL,
	`rating_count` text DEFAULT '24k rating' NOT NULL,
	`years_experience` text DEFAULT '8+' NOT NULL,
	`about_title` text DEFAULT 'About Us' NOT NULL,
	`about_text` text DEFAULT 'AdsMonster is your growth partner, focused on smart ads that drive real results, attract the right audience, and help your business grow faster.' NOT NULL,
	`why_choose_title` text DEFAULT 'WHY CHOOSE US' NOT NULL,
	`why_choose_text` text DEFAULT 'We partner with brands to deliver consistent, scalable growth through smart strategy, data-driven execution, and a results-first mindset. Here''s what sets us apart and earns our clients'' trust.' NOT NULL,
	`cta_title` text DEFAULT 'Ready to Grow Your Business Online?' NOT NULL,
	`cta_subtext` text DEFAULT 'Let''s work together to create marketing that actually works.' NOT NULL,
	`newsletter_title` text DEFAULT 'Signup Our Newsletter to Get Update Information.' NOT NULL,
	`contact_email` text DEFAULT 'hello@adsmonster.com' NOT NULL,
	`contact_phone` text DEFAULT '+1 (555) 010-2030' NOT NULL,
	`contact_address` text DEFAULT '123 Growth Avenue, Suite 400, New York, NY' NOT NULL,
	`facebook_url` text DEFAULT '#' NOT NULL,
	`instagram_url` text DEFAULT '#' NOT NULL,
	`linkedin_url` text DEFAULT '#' NOT NULL,
	`twitter_url` text DEFAULT '#' NOT NULL,
	`updated_at` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `stats` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`label` text NOT NULL,
	`value` text NOT NULL,
	`description` text DEFAULT '' NOT NULL,
	`icon` text DEFAULT 'TrendingUp' NOT NULL,
	`order` integer DEFAULT 0 NOT NULL,
	`created_at` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `testimonials` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`role` text DEFAULT '' NOT NULL,
	`company` text DEFAULT '' NOT NULL,
	`content` text NOT NULL,
	`rating` integer DEFAULT 5 NOT NULL,
	`avatar_seed` text DEFAULT 'A' NOT NULL,
	`published` integer DEFAULT true NOT NULL,
	`order` integer DEFAULT 0 NOT NULL,
	`created_at` integer NOT NULL
);
