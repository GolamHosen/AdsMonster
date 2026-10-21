"use client";

import { motion } from "framer-motion";
import { Check, ShieldCheck, TrendingUp, Award, Layers } from "lucide-react";
import type { siteSettings } from "@/db/schema";
import { SpringCounter } from "@/components/animations/SpringCounter";

type Settings = typeof siteSettings.$inferSelect;

export function About({ settings }: { settings: Settings }) {
  const features = [
    { text: "Transparent live reporting", icon: ShieldCheck },
    { text: "Dedicated media strategist", icon: Award },
    { text: "Data-driven creative testing", icon: TrendingUp },
    { text: "Full-funnel scalable systems", icon: Layers },
  ];

  return (
    <section id="about" className="relative mx-auto max-w-7xl px-6 py-24 overflow-hidden">
      <div className="grid items-center gap-14 md:grid-cols-2">
        {/* Left Column: Story & Features with Framer Motion */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          <span className="inline-flex items-center gap-2 rounded-full bg-[#AEFF1C]/15 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-[#006402] border border-[#AEFF1C]/30">
            About AdsMonster Agency
          </span>
          <h2 className="mt-4 text-3xl font-extrabold text-[#104042] sm:text-4xl lg:text-5xl font-display leading-tight">
            {settings.aboutTitle}
          </h2>
          <p className="mt-5 text-lg leading-relaxed text-[#5E5E5E]">
            {settings.aboutText}
          </p>

          <div className="mt-8 grid gap-3.5 sm:grid-cols-2">
            {features.map((item, idx) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={item.text}
                  className="flex items-center gap-3 rounded-2xl border border-[#104042]/10 bg-white p-3.5 shadow-sm transition-all hover:border-[#AEFF1C]/50 hover:shadow-md"
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1, duration: 0.5 }}
                  whileHover={{ scale: 1.02 }}
                >
                  <span className="grid h-8 w-8 place-items-center rounded-xl bg-[#AEFF1C]/15 text-[#006402]">
                    <Icon className="h-4 w-4" />
                  </span>
                  <span className="text-sm font-semibold text-[#104042]">{item.text}</span>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Right Column: Visual Bento Metric Cards with React Spring */}
        <motion.div
          className="grid grid-cols-2 gap-5"
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.7, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* Main Hero Card */}
          <motion.div
            className="col-span-2 relative overflow-hidden rounded-3xl bg-[#104042] p-8 text-white shadow-xl border border-[#AEFF1C]/10"
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

          {/* Rating Card */}
          <motion.div
            className="rounded-3xl border border-[#AEFF1C]/20 bg-[#AEFF1C]/10 p-6 shadow-sm"
            whileHover={{ y: -4, scale: 1.02 }}
          >
            <p className="text-3xl sm:text-4xl font-extrabold text-[#006402] font-display">
              <SpringCounter value={settings.ratingValue} />
            </p>
            <p className="mt-1 text-sm font-semibold text-[#104042]">{settings.ratingCount}</p>
            <p className="mt-1 text-xs text-[#104042]/60">Google & Trustpilot verified</p>
          </motion.div>

          {/* Platforms Card */}
          <motion.div
            className="rounded-3xl border border-[#104042]/15 bg-white p-6 shadow-sm"
            whileHover={{ y: -4, scale: 1.02 }}
          >
            <p className="text-3xl sm:text-4xl font-extrabold text-[#104042] font-display">
              <SpringCounter value="5+" />
            </p>
            <p className="mt-1 text-sm font-semibold text-[#104042]">Major Ad Networks</p>
            <p className="mt-1 text-xs text-[#5E5E5E]">Google, Meta, TikTok, YT, LinkedIn</p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
