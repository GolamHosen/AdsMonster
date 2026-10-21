"use client";

import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import type { siteSettings } from "@/db/schema";
import { GorgeousButton } from "@/components/ui/GorgeousButton";

type Settings = typeof siteSettings.$inferSelect;

export function CTA({ settings }: { settings: Settings }) {
  return (
    <section className="relative mx-auto max-w-7xl px-6 pb-24 overflow-hidden">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 30 }}
        whileInView={{ opacity: 1, scale: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="relative overflow-hidden rounded-[3rem] bg-[#104042] px-8 py-20 text-center shadow-xl sm:px-16"
      >

        <div className="relative z-10 max-w-3xl mx-auto">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-[#AEFF1C]/15 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-[#AEFF1C] backdrop-blur-md">
            <Sparkles className="h-3.5 w-3.5" /> High-Impact Advertising
          </span>

          <h2 className="mt-5 text-3xl font-extrabold text-white sm:text-4xl lg:text-5xl font-display leading-tight">
            {settings.ctaTitle}
          </h2>

          <p className="mx-auto mt-4 max-w-xl text-lg text-white/70 leading-relaxed">
            {settings.ctaSubtext}
          </p>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <GorgeousButton
              href="#contact"
              variant="primary"
              size="lg"
              confettiOnClick
            >
              Start Your Growth Plan
            </GorgeousButton>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
