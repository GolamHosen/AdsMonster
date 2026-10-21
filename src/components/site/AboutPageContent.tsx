"use client";

import { motion } from "framer-motion";
import {
  Check,
  ShieldCheck,
  TrendingUp,
  Award,
  Layers,
  Target,
  Users,
  Heart,
  Zap,
  Eye,
  Globe,
  Rocket,
  type LucideIcon,
} from "lucide-react";
import type { siteSettings, stats as statsSchema } from "@/db/schema";
import { SpringCounter } from "@/components/animations/SpringCounter";
import { HeroVisuals } from "@/components/animations/HeroVisuals";
import { GorgeousButton } from "@/components/ui/GorgeousButton";

type Settings = typeof siteSettings.$inferSelect;
type Stat = typeof statsSchema.$inferSelect;

const ICON_MAP: Record<string, LucideIcon> = {
  Briefcase: Target,
  Smile: Users,
  Award,
  Target,
  Users,
  Globe,
};

const CORE_VALUES = [
  {
    icon: Target,
    title: "Results First",
    description:
      "Every dollar counts. We engineer campaigns for maximum ROAS and measurable outcomes, not vanity metrics.",
  },
  {
    icon: ShieldCheck,
    title: "Full Transparency",
    description:
      "Real-time reporting, zero hidden fees. You see exactly where every dollar goes and what it returns.",
  },
  {
    icon: TrendingUp,
    title: "Data-Driven Strategy",
    description:
      "We make decisions backed by data, not guesses. Every campaign is optimized through continuous testing and analysis.",
  },
  {
    icon: Heart,
    title: "Client Partnership",
    description:
      "We don't just run ads — we become an extension of your team, invested in your long-term growth.",
  },
  {
    icon: Zap,
    title: "Speed & Agility",
    description:
      "The digital landscape moves fast. We adapt in real-time, pivoting strategies to capture emerging opportunities.",
  },
  {
    icon: Layers,
    title: "Full-Funnel Mastery",
    description:
      "From awareness to conversion and retention, we architect campaigns that cover the complete customer journey.",
  },
];

const MILESTONES = [
  { year: "2018", title: "Founded", description: "Started with a vision to make performance advertising accessible to growing brands." },
  { year: "2019", title: "First 50 Clients", description: "Scaled to managing over $500K monthly across Google & Meta platforms." },
  { year: "2021", title: "Multi-Platform", description: "Expanded to TikTok, YouTube, and LinkedIn Ads for full omnichannel coverage." },
  { year: "2023", title: "1,200+ Projects", description: "Crossed 1,200 successfully delivered projects with 3.2x average revenue growth." },
];

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.6, ease: [0.22, 1, 0.36, 1] as const },
  }),
};

export function AboutPageContent({
  settings,
  stats,
}: {
  settings: Settings;
  stats: Stat[];
}) {
  return (
    <>
      {/* ─── Hero Banner ─── */}
      <section className="relative overflow-hidden bg-[#E2F1F1] text-[#104042] pt-28 pb-20 md:pt-32 md:pb-24 lg:pt-36 lg:pb-28 text-center">
        <HeroVisuals />

        <motion.div
          className="relative mx-auto max-w-4xl px-6"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          <h1 className="text-4xl font-extrabold sm:text-5xl lg:text-6xl font-display leading-tight text-[#104042]">
            Your Growth Partner in <br className="hidden sm:block" />
            <span className="text-[#006402] relative inline-block underline decoration-[#AEFF1C] decoration-8 underline-offset-4">
              Performance Advertising
            </span>
          </h1>
          <p className="mt-5 text-lg text-[#104042]/75 max-w-2xl mx-auto leading-relaxed">
            {settings.aboutText}
          </p>
        </motion.div>
      </section>

      {/* ─── Mission & Vision ─── */}
      <section className="mx-auto max-w-7xl px-6 py-24">
        <div className="grid gap-8 md:grid-cols-2">
          <motion.div
            className="rounded-3xl border border-[#104042]/10 bg-white p-8 sm:p-10 shadow-sm hover:shadow-lg transition-shadow"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            <span className="inline-flex items-center gap-2 rounded-full bg-[#AEFF1C]/15 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-[#006402] border border-[#AEFF1C]/30">
              <Rocket className="h-3.5 w-3.5" /> Our Mission
            </span>
            <h2 className="mt-5 text-2xl font-extrabold text-[#104042] font-display leading-tight sm:text-3xl">
              Making Performance Advertising Accessible
            </h2>
            <p className="mt-4 text-base leading-relaxed text-[#5E5E5E]">
              We exist to democratize high-performance digital advertising. Every brand — from ambitious startups to scaling enterprises — deserves access to the same caliber of strategy, creative, and optimization that drives category leaders. Our mission is to turn ad spend into predictable, scalable revenue.
            </p>
          </motion.div>

          <motion.div
            className="rounded-3xl border border-[#104042]/10 bg-white p-8 sm:p-10 shadow-sm hover:shadow-lg transition-shadow"
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.7, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          >
            <span className="inline-flex items-center gap-2 rounded-full bg-[#AEFF1C]/15 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-[#006402] border border-[#AEFF1C]/30">
              <Eye className="h-3.5 w-3.5" /> Our Vision
            </span>
            <h2 className="mt-5 text-2xl font-extrabold text-[#104042] font-display leading-tight sm:text-3xl">
              The Go-To Growth Engine for Brands
            </h2>
            <p className="mt-4 text-base leading-relaxed text-[#5E5E5E]">
              We envision a world where every growth-stage brand can compete at the highest level through intelligent, data-driven advertising. By combining human expertise with cutting-edge technology, we&apos;re building the agency that makes category dominance achievable for everyone.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ─── Stats / Metric Bento Cards ─── */}
      <section className="mx-auto max-w-7xl px-6 pb-24">
        <motion.div
          className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
        >
          {/* Main hero card */}
          <motion.div
            className="sm:col-span-2 relative overflow-hidden rounded-3xl bg-[#104042] p-8 text-white shadow-xl border border-[#AEFF1C]/10"
            variants={fadeUp}
            custom={0}
            whileHover={{ y: -4, scale: 1.01 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
          >
            <div className="absolute top-0 right-0 h-48 w-48 rounded-full bg-[#AEFF1C]/10 blur-3xl pointer-events-none" />
            <span className="text-xs font-bold uppercase tracking-wider text-[#AEFF1C]">
              Proven Results
            </span>
            <p className="mt-1 text-sm text-white/60">Average Client Growth</p>
            <p className="mt-3 text-4xl sm:text-5xl font-extrabold text-white font-display">
              <SpringCounter value="3.2x Revenue" />
            </p>
            <p className="mt-2 text-xs text-white/40">
              Measured within first 90 days across e-commerce & B2B accounts.
            </p>
          </motion.div>

          {/* Dynamic stats from DB */}
          {stats.map((stat, idx) => {
            const IconComp = ICON_MAP[stat.icon] ?? Award;
            return (
              <motion.div
                key={stat.id}
                className="rounded-3xl border border-[#104042]/15 bg-white p-6 shadow-sm hover:shadow-md transition-shadow"
                variants={fadeUp}
                custom={idx + 1}
                whileHover={{ y: -4, scale: 1.02 }}
              >
                <span className="grid h-10 w-10 place-items-center rounded-xl bg-[#AEFF1C]/15 text-[#006402]">
                  <IconComp className="h-5 w-5" />
                </span>
                <p className="mt-3 text-3xl font-extrabold text-[#104042] font-display">
                  <SpringCounter value={stat.value} />
                </p>
                <p className="mt-1 text-sm font-semibold text-[#104042]">
                  {stat.label}
                </p>
                <p className="mt-1 text-xs text-[#5E5E5E]">
                  {stat.description}
                </p>
              </motion.div>
            );
          })}

          {/* Rating card */}
          <motion.div
            className="rounded-3xl border border-[#AEFF1C]/20 bg-[#AEFF1C]/10 p-6 shadow-sm"
            variants={fadeUp}
            custom={stats.length + 1}
            whileHover={{ y: -4, scale: 1.02 }}
          >
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-[#006402]/10 text-[#006402]">
              <Award className="h-5 w-5" />
            </span>
            <p className="mt-3 text-3xl font-extrabold text-[#006402] font-display">
              <SpringCounter value={settings.ratingValue} />
            </p>
            <p className="mt-1 text-sm font-semibold text-[#104042]">
              {settings.ratingCount}
            </p>
            <p className="mt-1 text-xs text-[#104042]/60">
              Google & Trustpilot verified
            </p>
          </motion.div>
        </motion.div>
      </section>

      {/* ─── Core Values ─── */}
      <section className="bg-white py-24">
        <div className="mx-auto max-w-7xl px-6">
          <motion.div
            className="text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-flex items-center gap-2 rounded-full bg-[#AEFF1C]/15 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-[#006402] border border-[#AEFF1C]/30">
              Our DNA
            </span>
            <h2 className="mt-5 text-3xl font-extrabold text-[#104042] sm:text-4xl lg:text-5xl font-display">
              Core Values That Drive Us
            </h2>
            <p className="mt-4 text-base text-[#5E5E5E] max-w-2xl mx-auto">
              These aren't just words on a wall — they're the principles that shape every campaign, every decision, and every client relationship.
            </p>
          </motion.div>

          <motion.div
            className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
          >
            {CORE_VALUES.map((value, idx) => {
              const Icon = value.icon;
              return (
                <motion.div
                  key={value.title}
                  className="group rounded-2xl border border-[#104042]/10 bg-[#E8F4F4]/50 p-6 transition-all hover:border-[#AEFF1C]/50 hover:shadow-lg hover:bg-white"
                  variants={fadeUp}
                  custom={idx}
                  whileHover={{ y: -4 }}
                >
                  <span className="grid h-12 w-12 place-items-center rounded-2xl bg-[#AEFF1C]/15 text-[#006402] transition-colors group-hover:bg-[#006402] group-hover:text-white">
                    <Icon className="h-5 w-5" />
                  </span>
                  <h3 className="mt-4 text-lg font-bold text-[#104042]">
                    {value.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-[#5E5E5E]">
                    {value.description}
                  </p>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* ─── Timeline / Milestones ─── */}
      <section className="mx-auto max-w-7xl px-6 py-24">
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <span className="inline-flex items-center gap-2 rounded-full bg-[#AEFF1C]/15 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-[#006402] border border-[#AEFF1C]/30">
            Our Journey
          </span>
          <h2 className="mt-5 text-3xl font-extrabold text-[#104042] sm:text-4xl font-display">
            From Vision to Impact
          </h2>
        </motion.div>

        <div className="mt-14 relative">
          {/* Timeline line */}
          <div className="hidden md:block absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-[#AEFF1C]/0 via-[#AEFF1C]/40 to-[#AEFF1C]/0 -translate-y-1/2" />

          <div className="grid gap-8 md:grid-cols-4">
            {MILESTONES.map((milestone, idx) => (
              <motion.div
                key={milestone.year}
                className="relative text-center"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.15, duration: 0.6 }}
              >
                <div className="hidden md:flex mx-auto mb-4 h-4 w-4 rounded-full bg-[#006402] border-4 border-[#E8F4F4] relative z-10 shadow-md" />
                <div className="rounded-2xl border border-[#104042]/10 bg-white p-6 shadow-sm hover:shadow-md transition-shadow">
                  <span className="text-2xl font-extrabold text-[#006402] font-display">
                    {milestone.year}
                  </span>
                  <h3 className="mt-2 text-base font-bold text-[#104042]">
                    {milestone.title}
                  </h3>
                  <p className="mt-2 text-xs text-[#5E5E5E] leading-relaxed">
                    {milestone.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA Section ─── */}
      <section className="mx-auto max-w-7xl px-6 pb-24">
        <motion.div
          className="relative overflow-hidden rounded-3xl bg-[#104042] p-10 sm:p-16 text-center shadow-2xl border border-[#AEFF1C]/10"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <div className="pointer-events-none absolute -top-20 -left-20 h-64 w-64 rounded-full bg-[#AEFF1C]/10 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-20 -right-20 h-64 w-64 rounded-full bg-[#006402]/15 blur-3xl" />

          <h2 className="relative text-3xl font-extrabold text-white sm:text-4xl font-display">
            Ready to Partner with Us?
          </h2>
          <p className="relative mt-4 text-base text-white/70 max-w-xl mx-auto">
            Let's turn your ad budget into predictable, scalable revenue. Book a free strategy call and see the AdsMonster difference.
          </p>
          <div className="relative mt-8 flex justify-center">
            <GorgeousButton
              href="/contact"
              variant="primary"
              size="lg"
              confettiOnClick
            >
              Get Free Strategy Call
            </GorgeousButton>
          </div>
        </motion.div>
      </section>
    </>
  );
}
