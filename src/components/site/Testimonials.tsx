"use client";

import { motion } from "framer-motion";
import { Star, Quote, Sparkles } from "lucide-react";
import type { testimonials } from "@/db/schema";

type Testimonial = typeof testimonials.$inferSelect;

export function Testimonials({ items }: { items: Testimonial[] }) {
  return (
    <section id="testimonials" className="relative mx-auto max-w-7xl px-6 py-24 overflow-hidden">
      <motion.div
        className="mx-auto max-w-2xl text-center"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.6 }}
      >
        <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-[#006402] bg-[#AEFF1C]/15 px-3.5 py-1.5 rounded-full border border-[#AEFF1C]/30">
          <Sparkles className="h-3.5 w-3.5" /> Client Success Stories
        </span>
        <h2 className="mt-4 text-3xl font-extrabold text-[#104042] sm:text-4xl lg:text-5xl font-display">
          Trusted by Growth Brands
        </h2>
        <p className="mt-4 text-lg text-[#5E5E5E]">
          Real founders and marketing leaders sharing their experience scaling with AdsMonster.
        </p>
      </motion.div>

      <div className="mt-16 grid gap-8 md:grid-cols-3">
        {items.map((t, index) => (
          <motion.div
            key={t.id}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.6, delay: index * 0.15 }}
            whileHover={{ y: -6, scale: 1.02 }}
            className="group relative flex flex-col justify-between rounded-3xl border border-[#104042]/10 bg-white p-8 shadow-sm transition-all hover:border-[#AEFF1C]/50 hover:shadow-xl hover:shadow-[#AEFF1C]/10"
          >
            <div>
              <div className="flex items-center justify-between">
                <Quote className="h-9 w-9 text-[#AEFF1C]/40 group-hover:text-[#AEFF1C] transition-colors" />
                <div className="flex items-center gap-1 text-amber-400">
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-amber-400" />
                  ))}
                </div>
              </div>

              <p className="mt-5 text-base leading-relaxed text-[#5E5E5E] italic">
                &ldquo;{t.content}&rdquo;
              </p>
            </div>

            <div className="mt-8 flex items-center gap-3.5 pt-5 border-t border-[#104042]/8">
              <div className="grid h-12 w-12 place-items-center rounded-2xl bg-[#104042] text-sm font-extrabold text-[#AEFF1C] shadow-md">
                {t.avatarSeed.slice(0, 1).toUpperCase()}
              </div>
              <div>
                <p className="text-sm font-bold text-[#104042]">{t.name}</p>
                <p className="text-xs text-[#5E5E5E] font-medium">
                  {[t.role, t.company].filter(Boolean).join(" · ")}
                </p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
