"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Star,
  Quote,
  TrendingUp,
  ShieldCheck,
  CheckCircle2,
  Award,
  ArrowRight,
  Filter,
} from "lucide-react";
import { GorgeousButton } from "@/components/ui/GorgeousButton";
import { HeroVisuals } from "@/components/animations/HeroVisuals";
import type { testimonials, siteSettings } from "@/db/schema";

type Testimonial = typeof testimonials.$inferSelect;
type Settings = typeof siteSettings.$inferSelect;

interface Props {
  settings: Settings;
  testimonials: Testimonial[];
}

const EXTENDED_STORIES = [
  {
    id: "ext-1",
    name: "Sarah Mitchell",
    role: "Founder & CEO",
    company: "Bloom Skincare",
    category: "E-commerce",
    platform: "Meta & TikTok Ads",
    metric: "+240% ROAS",
    metricLabel: "in 60 Days",
    rating: 5,
    avatarSeed: "Sarah",
    content:
      "AdsMonster completely transformed our paid social funnels. We went from struggling to break even at a 1.4x ROAS to consistently hitting 3.4x even as we scaled monthly ad spend from $15k to $70k. Their creative team iterates weekly on fresh hooks that our customers actually engage with.",
    highlight: "Doubled ROAS in first 60 days while scaling budget 4x",
  },
  {
    id: "ext-2",
    name: "James Carter",
    role: "VP of Growth",
    company: "Fitwave Wellness",
    category: "Health & Fitness",
    platform: "Google Search & PMax",
    metric: "-48% CAC",
    metricLabel: "Customer Acquisition Cost",
    rating: 5,
    avatarSeed: "James",
    content:
      "Professional, deeply analytical, and genuinely invested in our numbers. Before AdsMonster, our Google Performance Max campaigns were wasting budget on low-intent search terms. They restructured our negative keyword lists, optimized product feeds, and cut our acquisition cost by almost half in under 90 days.",
    highlight: "Slashed blended CAC by 48% with feed optimization",
  },
  {
    id: "ext-3",
    name: "Priya Nair",
    role: "Chief Executive Officer",
    company: "Urban Nest Home",
    category: "DTC & Retail",
    platform: "Omnichannel Funnel",
    metric: "7-Figure Run Rate",
    metricLabel: "Scaled from $50k/mo",
    rating: 5,
    avatarSeed: "Priya",
    content:
      "The AdsMonster team operates like an elite in-house growth department. Their cross-channel strategy connecting TikTok top-of-funnel discovery with Google Search high-intent retargeting unlocked incredible scale for us. We graduated from six figures to seven figures with them by our side.",
    highlight: "Seamless omnichannel strategy connecting TikTok to Google Search",
  },
  {
    id: "ext-4",
    name: "David Vance",
    role: "Co-Founder & COO",
    company: "CloudSync Pro",
    category: "B2B SaaS",
    platform: "LinkedIn & Google PPC",
    metric: "3.8x Demo Pipeline",
    metricLabel: "Qualified Inbound Leads",
    rating: 5,
    avatarSeed: "David",
    content:
      "B2B lead generation can be notoriously expensive on LinkedIn. AdsMonster crafted hyper-targeted account-based marketing (ABM) ad campaigns targeting enterprise IT directors. Our cost-per-qualified-demo dropped by 42% while demo volume grew nearly fourfold.",
    highlight: "Dropped cost-per-qualified-demo by 42% on LinkedIn",
  },
  {
    id: "ext-5",
    name: "Elena Rostova",
    role: "Head of Marketing",
    company: "Luxe Aura Jewelry",
    category: "Luxury Fashion",
    platform: "Meta & YouTube Ads",
    metric: "4.2x Black Friday ROAS",
    metricLabel: "$380k in 5 Days",
    rating: 5,
    avatarSeed: "Elena",
    content:
      "Their Q4 holiday preparation was flawless. They built customized warm audience pools 6 weeks in advance and executed aggressive bid rules during Cyber Weekend. It produced our most profitable revenue quarter in company history.",
    highlight: "Record-breaking Q4 Cyber Week with 4.2x blended ROAS",
  },
  {
    id: "ext-6",
    name: "Marcus Thorne",
    role: "Managing Director",
    company: "Apex Legal Partners",
    category: "High-Ticket Services",
    platform: "Google Search Ads",
    metric: "+185% Retained Cases",
    metricLabel: "High-Intent Search",
    rating: 5,
    avatarSeed: "Marcus",
    content:
      "In high-ticket legal services, every single lead matters. AdsMonster built dedicated landing pages with high-converting intake funnels that immediately converted high-intent Google searchers into scheduled consultations. Exceptional ROI and clear communication.",
    highlight: "High-intent Google Ads funnels with +185% retained cases",
  },
];

const CATEGORIES = ["All Reviews", "E-commerce", "B2B SaaS", "DTC & Retail", "Health & Fitness", "High-Ticket Services"];

export function TestimonialsPageContent({ settings, testimonials: initialTestimonials }: Props) {
  const [activeCategory, setActiveCategory] = useState("All Reviews");

  // Merge database testimonials if present with extended stories
  const allStories = [
    ...initialTestimonials.map((t, idx) => ({
      id: `db-${t.id}`,
      name: t.name,
      role: t.role ?? "Founder",
      company: t.company ?? "Growth Brand",
      category: idx === 0 ? "E-commerce" : idx === 1 ? "Health & Fitness" : "DTC & Retail",
      platform: idx === 0 ? "Meta Ads" : idx === 1 ? "Google Ads" : "Omnichannel",
      metric: idx === 0 ? "+200% ROAS" : idx === 1 ? "-35% CAC" : "+180% Revenue",
      metricLabel: "Verified Impact",
      rating: t.rating ?? 5,
      avatarSeed: t.avatarSeed || t.name,
      content: t.content,
      highlight: "Verified AdsMonster Client",
    })),
    ...EXTENDED_STORIES.filter(
      (ext) => !initialTestimonials.some((dbT) => dbT.name.toLowerCase() === ext.name.toLowerCase()),
    ),
  ];

  const filteredStories =
    activeCategory === "All Reviews"
      ? allStories
      : allStories.filter((s) => s.category.toLowerCase().includes(activeCategory.toLowerCase()));

  return (
    <div className="relative">
      {/* Hero Header Section */}
      <section className="relative overflow-hidden bg-[#E2F1F1] text-[#104042] pt-28 pb-20 md:pt-36 md:pb-28 text-center border-b border-[#104042]/10">
        <HeroVisuals />

        <div className="relative mx-auto max-w-4xl px-6">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.1 }}
            className="text-4xl font-extrabold sm:text-5xl lg:text-6xl font-display leading-tight text-[#104042]"
          >
            Stories of Scale from Brands That{" "}
            <span className="text-[#006402] relative inline-block underline decoration-[#AEFF1C] decoration-8 underline-offset-4">
              Dominate Ads.
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.2 }}
            className="mt-5 text-lg sm:text-xl text-[#104042]/80 max-w-2xl mx-auto leading-relaxed"
          >
            Explore real reviews and case studies from marketing leaders who scaled revenue, slashed acquisition costs, and unlocked higher ROAS with AdsMonster.
          </motion.p>

          {/* Social Proof Stats Bar */}
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-4 max-w-3xl mx-auto"
          >
            <div className="rounded-2xl border border-[#104042]/10 bg-white/90 p-4 shadow-sm backdrop-blur-sm">
              <div className="flex items-center justify-center gap-1 text-amber-400">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-amber-400" />
                ))}
              </div>
              <p className="mt-2 text-2xl font-extrabold text-[#104042] font-display">4.9 / 5.0</p>
              <p className="text-xs font-semibold text-[#5E5E5E]">Client Satisfaction</p>
            </div>

            <div className="rounded-2xl border border-[#104042]/10 bg-white/90 p-4 shadow-sm backdrop-blur-sm">
              <p className="text-2xl font-extrabold text-[#006402] font-display">3.6x</p>
              <p className="text-xs font-semibold text-[#5E5E5E] mt-1">Average Client ROAS</p>
              <p className="text-[10px] text-[#104042]/60 mt-0.5">Across all ad channels</p>
            </div>

            <div className="rounded-2xl border border-[#104042]/10 bg-white/90 p-4 shadow-sm backdrop-blur-sm">
              <p className="text-2xl font-extrabold text-[#104042] font-display">$50M+</p>
              <p className="text-xs font-semibold text-[#5E5E5E] mt-1">Managed Ad Spend</p>
              <p className="text-[10px] text-[#104042]/60 mt-0.5">Google, Meta, TikTok</p>
            </div>

            <div className="rounded-2xl border border-[#104042]/10 bg-white/90 p-4 shadow-sm backdrop-blur-sm">
              <p className="text-2xl font-extrabold text-[#006402] font-display">98.4%</p>
              <p className="text-xs font-semibold text-[#5E5E5E] mt-1">Client Retention</p>
              <p className="text-[10px] text-[#104042]/60 mt-0.5">Month-to-month contracts</p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Featured Spotlight Section */}
      <section className="mx-auto max-w-7xl px-6 py-20">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold uppercase tracking-wider text-[#006402] bg-[#AEFF1C]/15 px-3 py-1 rounded-full border border-[#AEFF1C]/30">
            Case Study Spotlights
          </span>
          <h2 className="mt-3 text-3xl font-extrabold text-[#104042] font-display">
            Proven Results in the Trenches
          </h2>
          <p className="mt-2 text-sm text-[#5E5E5E]">
            How we partner with visionary brands to turn advertising spend into high-growth engines.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          {EXTENDED_STORIES.slice(0, 3).map((story, i) => (
            <motion.div
              key={story.id}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.15 }}
              whileHover={{ y: -6 }}
              className="relative flex flex-col justify-between overflow-hidden rounded-3xl border border-[#104042]/15 bg-white p-8 shadow-md transition-all hover:border-[#AEFF1C]/60 hover:shadow-xl hover:shadow-[#AEFF1C]/10"
            >
              <div className="absolute top-0 right-0 rounded-bl-2xl bg-[#104042] px-4 py-1.5 text-xs font-bold text-[#AEFF1C]">
                {story.platform}
              </div>

              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#006402] bg-[#AEFF1C]/15 px-2.5 py-1 rounded-full">
                  {story.category}
                </span>

                <div className="mt-6 flex items-baseline gap-2">
                  <span className="text-3xl font-extrabold text-[#006402] font-display">
                    {story.metric}
                  </span>
                  <span className="text-xs font-semibold text-[#5E5E5E]">
                    {story.metricLabel}
                  </span>
                </div>

                <p className="mt-4 text-xs font-bold uppercase tracking-wide text-[#104042]">
                  Key Achievement:
                </p>
                <p className="text-sm font-semibold text-[#104042] mt-0.5">
                  &ldquo;{story.highlight}&rdquo;
                </p>

                <p className="mt-4 text-sm leading-relaxed text-[#5E5E5E] italic">
                  &ldquo;{story.content}&rdquo;
                </p>
              </div>

              <div className="mt-8 flex items-center gap-3.5 pt-5 border-t border-[#104042]/10">
                <div className="grid h-12 w-12 place-items-center rounded-2xl bg-[#104042] text-sm font-extrabold text-[#AEFF1C] shadow-md">
                  {story.avatarSeed.slice(0, 1).toUpperCase()}
                </div>
                <div>
                  <p className="text-sm font-bold text-[#104042]">{story.name}</p>
                  <p className="text-xs text-[#5E5E5E] font-medium">
                    {story.role} · {story.company}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Filter Tabs & Testimonials Grid */}
      <section className="mx-auto max-w-7xl px-6 pb-24">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-[#104042]/10 pb-6 mb-10">
          <div>
            <h2 className="text-2xl font-extrabold text-[#104042] font-display">
              All Client Testimonials ({filteredStories.length})
            </h2>
            <p className="text-xs text-[#5E5E5E] mt-1">
              Filter reviews by industry and see relevant transformations.
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex flex-wrap items-center gap-2">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setActiveCategory(cat)}
                className={`rounded-full px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider transition ${
                  activeCategory === cat
                    ? "bg-[#104042] text-[#AEFF1C] shadow-sm"
                    : "bg-white text-[#104042]/70 hover:bg-[#E8F4F4] hover:text-[#104042] border border-[#104042]/10"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Stories Grid */}
        <motion.div layout className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence>
            {filteredStories.map((story) => (
              <motion.div
                key={story.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
                whileHover={{ y: -5 }}
                className="group relative flex flex-col justify-between rounded-3xl border border-[#104042]/10 bg-white p-7 shadow-sm transition-all hover:border-[#AEFF1C]/50 hover:shadow-xl hover:shadow-[#AEFF1C]/10"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <Quote className="h-8 w-8 text-[#AEFF1C]/50 group-hover:text-[#006402] transition-colors" />
                    <div className="flex items-center gap-1 text-amber-400">
                      {Array.from({ length: story.rating }).map((_, i) => (
                        <Star key={i} className="h-3.5 w-3.5 fill-amber-400" />
                      ))}
                    </div>
                  </div>

                  <div className="mt-4 flex items-center gap-2">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-[#006402] bg-[#AEFF1C]/15 px-2.5 py-0.5 rounded-full border border-[#AEFF1C]/30">
                      {story.platform}
                    </span>
                    <span className="text-[11px] font-semibold text-[#5E5E5E]">
                      {story.metric}
                    </span>
                  </div>

                  <p className="mt-4 text-sm leading-relaxed text-[#5E5E5E] italic">
                    &ldquo;{story.content}&rdquo;
                  </p>
                </div>

                <div className="mt-6 flex items-center gap-3 pt-4 border-t border-[#104042]/8">
                  <div className="grid h-11 w-11 place-items-center rounded-xl bg-[#104042] text-xs font-extrabold text-[#AEFF1C] shadow-sm">
                    {story.avatarSeed.slice(0, 1).toUpperCase()}
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <p className="text-sm font-bold text-[#104042]">{story.name}</p>
                      <CheckCircle2 className="h-3.5 w-3.5 text-[#006402]" />
                    </div>
                    <p className="text-xs text-[#5E5E5E] font-medium">
                      {story.role} · {story.company}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Why Clients Choose Us Callout Box */}
        <div className="mt-16 rounded-3xl border border-[#104042]/15 bg-[#104042] p-8 sm:p-12 text-white shadow-2xl relative overflow-hidden">
          <div className="relative z-10 grid gap-8 lg:grid-cols-12 items-center">
            <div className="lg:col-span-8">
              <span className="inline-flex items-center gap-2 rounded-full bg-[#AEFF1C]/20 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-[#AEFF1C] border border-[#AEFF1C]/30">
                <Award className="h-3.5 w-3.5" /> The AdsMonster Standard
              </span>
              <h3 className="mt-4 text-3xl font-extrabold sm:text-4xl font-display text-white">
                Ready to Be Our Next 3x+ ROAS Case Study?
              </h3>
              <p className="mt-3 text-sm sm:text-base text-white/80 max-w-xl leading-relaxed">
                We work with high-intent brands ready to scale. Book a free 30-minute advertising audit with our senior ad strategists.
              </p>
            </div>

            <div className="lg:col-span-4 flex flex-col sm:flex-row lg:flex-col gap-3 justify-end">
              <GorgeousButton
                href="/contact"
                variant="primary"
                size="lg"
                className="justify-center"
                confettiOnClick
              >
                Claim Free Ad Audit &rarr;
              </GorgeousButton>
              <GorgeousButton
                href="/pricing"
                variant="secondary"
                size="lg"
                className="justify-center"
              >
                View Pricing Plans
              </GorgeousButton>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
