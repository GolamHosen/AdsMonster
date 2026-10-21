"use client";

import { motion } from "framer-motion";
import { getIcon } from "@/lib/icon-map";
import type { siteSettings, stats } from "@/db/schema";
import { SpringCounter } from "@/components/animations/SpringCounter";

type Settings = typeof siteSettings.$inferSelect;
type Stat = typeof stats.$inferSelect;

export function WhyChooseUs({ settings, items }: { settings: Settings; items: Stat[] }) {
  return (
    <section id="why-us" className="relative mx-auto max-w-7xl px-6 py-24 overflow-hidden">
      <motion.div
        className="mx-auto max-w-2xl text-center"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.6 }}
      >
        <span className="text-xs font-bold uppercase tracking-widest text-[#006402] bg-[#AEFF1C]/15 px-3.5 py-1.5 rounded-full border border-[#AEFF1C]/30">
          {settings.whyChooseTitle}
        </span>
        <h2 className="mt-4 text-3xl font-extrabold text-[#104042] sm:text-4xl lg:text-5xl font-display">
          Growth You Can Measure
        </h2>
        <p className="mt-4 text-lg text-[#5E5E5E] leading-relaxed">
          {settings.whyChooseText}
        </p>
      </motion.div>

      <div className="mt-16 grid gap-8 sm:grid-cols-3">
        {items.map((stat, index) => {
          const Icon = getIcon(stat.icon);
          return (
            <motion.div
              key={stat.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.6, delay: index * 0.15 }}
              whileHover={{ y: -6, scale: 1.02 }}
              className="relative overflow-hidden rounded-3xl border border-[#104042]/10 bg-white p-8 text-center shadow-sm transition-all hover:border-[#AEFF1C]/50 hover:shadow-xl hover:shadow-[#AEFF1C]/10"
            >
              <div className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-[#104042] text-[#AEFF1C] shadow-lg">
                <Icon className="h-8 w-8" />
              </div>

              <p className="mt-6 text-4xl sm:text-5xl font-extrabold text-[#104042] font-display">
                <SpringCounter value={stat.value} />
              </p>

              <h3 className="mt-2 text-lg font-bold text-[#104042]">{stat.label}</h3>

              <p className="mt-3 text-sm leading-relaxed text-[#5E5E5E]">
                {stat.description}
              </p>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
