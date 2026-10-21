import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().trim().toLowerCase().email().max(160),
  password: z.string().min(8).max(200),
});

export const leadSchema = z.object({
  name: z.string().trim().min(2).max(160),
  email: z.string().trim().toLowerCase().email().max(160),
  phone: z.string().trim().max(40).optional().default(""),
  company: z.string().trim().max(160).optional().default(""),
  serviceInterest: z.string().trim().max(160).optional().default(""),
  budget: z.string().trim().max(80).optional().default(""),
  message: z.string().trim().max(4000).optional().default(""),
  // honeypot field - should always be empty for real submissions
  website: z.string().max(0).optional().default(""),
});

export const newsletterSchema = z.object({
  email: z.string().trim().toLowerCase().email().max(160),
  website: z.string().max(0).optional().default(""),
});

export const serviceSchema = z.object({
  title: z.string().trim().min(2).max(160),
  slug: z
    .string()
    .trim()
    .min(2)
    .max(160)
    .regex(/^[a-z0-9-]+$/, "Slug must contain lowercase letters, numbers, and hyphens only"),
  description: z.string().trim().min(2).max(4000),
  icon: z.string().trim().min(1).max(60).default("Megaphone"),
  order: z.coerce.number().int().default(0),
  published: z.coerce.boolean().default(true),
});

export const testimonialSchema = z.object({
  name: z.string().trim().min(2).max(120),
  role: z.string().trim().max(160).optional().default(""),
  company: z.string().trim().max(160).optional().default(""),
  content: z.string().trim().min(2).max(4000),
  rating: z.coerce.number().int().min(1).max(5).default(5),
  avatarSeed: z.string().trim().max(60).optional().default("A"),
  published: z.coerce.boolean().default(true),
  order: z.coerce.number().int().default(0),
});

export const statSchema = z.object({
  label: z.string().trim().min(2).max(120),
  value: z.string().trim().min(1).max(40),
  description: z.string().trim().max(240).optional().default(""),
  icon: z.string().trim().min(1).max(60).default("TrendingUp"),
  order: z.coerce.number().int().default(0),
});

export const stepSchema = z.object({
  stepNumber: z.coerce.number().int().min(1),
  title: z.string().trim().min(2).max(160),
  description: z.string().trim().min(2).max(2000),
  order: z.coerce.number().int().default(0),
});

export const leadStatusSchema = z.object({
  status: z.enum(["new", "contacted", "qualified", "won", "lost"]),
});

export const settingsSchema = z.object({
  siteName: z.string().trim().min(1).max(120),
  tagline: z.string().trim().min(1).max(240),
  heroHeading: z.string().trim().min(1).max(240),
  heroSubtext: z.string().trim().min(1).max(2000),
  ratingValue: z.string().trim().min(1).max(10),
  ratingCount: z.string().trim().min(1).max(40),
  yearsExperience: z.string().trim().min(1).max(10),
  aboutTitle: z.string().trim().min(1).max(160),
  aboutText: z.string().trim().min(1).max(2000),
  whyChooseTitle: z.string().trim().min(1).max(160),
  whyChooseText: z.string().trim().min(1).max(2000),
  ctaTitle: z.string().trim().min(1).max(200),
  ctaSubtext: z.string().trim().min(1).max(2000),
  newsletterTitle: z.string().trim().min(1).max(200),
  contactEmail: z.string().trim().email().max(160),
  contactPhone: z.string().trim().min(1).max(40),
  contactAddress: z.string().trim().min(1).max(240),
  facebookUrl: z.string().trim().max(200).optional().default("#"),
  instagramUrl: z.string().trim().max(200).optional().default("#"),
  linkedinUrl: z.string().trim().max(200).optional().default("#"),
  twitterUrl: z.string().trim().max(200).optional().default("#"),
});

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(8).max(200),
    newPassword: z.string().min(10).max(200),
    confirmPassword: z.string().min(10).max(200),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });
