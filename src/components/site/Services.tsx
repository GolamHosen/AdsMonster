"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowUpRight, Sparkles, CheckCircle2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { getIcon } from "@/lib/icon-map";
import type { services } from "@/db/schema";

type Service = typeof services.$inferSelect;

export function Services({ items }: { items: Service[] }) {
  const [activeFilter, setActiveFilter] = useState("all");

  const filterTabs = [
    { id: "all", label: "All Services" },
    { id: "paid-search", label: "Search & Video" },
    { id: "social", label: "Social Ads" },
    { id: "cro", label: "Landing Pages & CRO" },
  ];

  const filteredItems = items.filter((service) => {
    if (activeFilter === "all") return true;
    if (activeFilter === "paid-search") {
      return service.slug.includes("google") || service.slug.includes("youtube");
    }
    if (activeFilter === "social") {
      return (
        service.slug.includes("meta") ||
        service.slug.includes("tiktok") ||
        service.slug.includes("linkedin")
      );
    }
    if (activeFilter === "cro") {
      return service.slug.includes("cro") || service.slug.includes("landing");
    }
    return true;
  });

  return (
    <section id="services" className="relative py-24 overflow-hidden border-t border-[#104042]/8 bg-[#E8F4F4]">
      <div className="mx-auto max-w-7xl px-6">
        {/* Section Heading with Motion */}
        <motion.div
          className="mx-auto max-w-2xl text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6 }}
        >
          <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-[#006402] bg-[#AEFF1C]/15 px-3.5 py-1.5 rounded-full border border-[#AEFF1C]/30">
            <Sparkles className="h-3.5 w-3.5" /> What We Deliver
          </span>
          <h2 className="mt-4 text-3xl font-extrabold text-[#104042] sm:text-4xl lg:text-5xl font-display">
            High-Converting Paid Media
          </h2>
          <p className="mt-4 text-lg text-[#5E5E5E] leading-relaxed">
            Engineered to lower customer acquisition costs, capture market share, and maximize ROAS.
          </p>

          {/* Interactive Filter Tabs */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-2">
            {filterTabs.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveFilter(tab.id)}
                className={`relative rounded-full px-4 py-2 text-xs sm:text-sm font-bold transition-all ${
                  activeFilter === tab.id
                    ? "text-white"
                    : "bg-white text-[#5E5E5E] hover:text-[#104042] border border-[#104042]/10"
                }`}
              >
                {activeFilter === tab.id && (
                  <motion.span
                    layoutId="service-filter-pill"
                    className="absolute inset-0 rounded-full shadow-md bg-[#006402] border border-t-white/25"
                    transition={{ type: "spring", stiffness: 350, damping: 30 }}
                  />
                )}
                <span className="relative z-10">{tab.label}</span>
              </button>
            ))}
          </div>
        </motion.div>

        {/* Staggered Animated Grid of Services */}
        <motion.div
          layout
          className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
        >
          <AnimatePresence mode="popLayout">
            {filteredItems.map((service, index) => {
              const Icon = getIcon(service.icon);
              return (
                <motion.div
                  layout
                  key={service.id}
                  initial={{ opacity: 0, scale: 0.94, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.94, y: 15 }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                  whileHover={{ y: -6 }}
                  className="group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-[#104042]/10 bg-white p-8 shadow-sm transition-all hover:border-[#AEFF1C]/50 hover:shadow-xl hover:shadow-[#AEFF1C]/10"
                >
                  {/* Subtle Top Accent Glow on hover */}
                  <div className="absolute top-0 left-0 right-0 h-1 opacity-0 group-hover:opacity-100 transition-opacity" style={{ background: "linear-gradient(90deg, #006402, #AEFF1C, #006402)" }} />

                  <div>
                    <div className="flex items-center justify-between">
                      <motion.span
                        className="grid h-14 w-14 place-items-center rounded-2xl bg-[#AEFF1C]/10 text-[#006402] group-hover:bg-[#AEFF1C] group-hover:text-[#104042] transition-colors duration-300 shadow-sm"
                        whileHover={{ rotate: 12, scale: 1.1 }}
                      >
                        <Icon className="h-7 w-7" />
                      </motion.span>
                      <span className="grid h-10 w-10 place-items-center rounded-full bg-[#E8F4F4] text-[#104042]/40 transition group-hover:bg-[#AEFF1C]/15 group-hover:text-[#006402]">
                        <ArrowUpRight className="h-5 w-5 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                      </span>
                    </div>

                    <Link href={`/services/${service.slug}`} className="block">
                      <h3 className="mt-6 text-xl font-bold text-[#104042] group-hover:text-[#006402] transition-colors font-display">
                        {service.title}
                      </h3>
                    </Link>
                    <p className="mt-3 text-sm leading-relaxed text-[#5E5E5E]">
                      {service.description}
                    </p>
                  </div>

                  <div className="mt-6 pt-5 border-t border-[#104042]/8 flex items-center justify-between text-xs font-semibold text-[#5E5E5E]">
                    <span className="flex items-center gap-1.5 text-[#006402]">
                      <CheckCircle2 className="h-4 w-4" /> Full Campaign Management
                    </span>
                    <Link
                      href={`/services/${service.slug}`}
                      className="text-[#104042] font-bold hover:text-[#006402] transition"
                    >
                      Learn More &rarr;
                    </Link>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}
