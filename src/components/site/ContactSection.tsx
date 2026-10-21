"use client";

import { motion } from "framer-motion";
import { Mail, Phone, MapPin, Sparkles, Clock, ShieldCheck } from "lucide-react";
import type { siteSettings } from "@/db/schema";
import { ContactForm } from "./ContactForm";

type Settings = typeof siteSettings.$inferSelect;

export function ContactSection({ settings }: { settings: Settings }) {
  return (
    <section id="contact" className="relative bg-[#E8F4F4] py-24 overflow-hidden border-t border-[#104042]/10">
      <div className="mx-auto grid max-w-7xl gap-12 px-6 md:grid-cols-5 items-start">
        {/* Left Column: Agency Contact Details with Framer Motion */}
        <motion.div
          className="md:col-span-2"
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6 }}
        >
          <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-[#006402] bg-[#AEFF1C]/15 px-3.5 py-1.5 rounded-full border border-[#AEFF1C]/30">
            <Sparkles className="h-3.5 w-3.5" /> Start Scaling Today
          </span>

          <h2 className="mt-4 text-3xl font-extrabold text-[#104042] sm:text-4xl lg:text-5xl font-display leading-tight">
            Let&apos;s Build Your Growth Plan
          </h2>

          <p className="mt-4 text-base text-[#5E5E5E] leading-relaxed">
            Share your goals and challenges. We&apos;ll audit your current ad account structure and deliver a free customized scaling roadmap.
          </p>

          <div className="mt-10 space-y-4">
            <motion.div
              className="flex items-start gap-4 rounded-2xl border border-[#104042]/10 bg-white p-4 shadow-sm transition hover:border-[#AEFF1C]/50 hover:shadow-md"
              whileHover={{ x: 4 }}
            >
              <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-[#104042] text-[#AEFF1C] shadow-md">
                <Mail className="h-6 w-6" />
              </span>
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-[#5E5E5E]">Direct Email</p>
                <a
                  href={`mailto:${settings.contactEmail}`}
                  className="mt-0.5 text-sm font-bold text-[#104042] hover:text-[#006402] transition"
                >
                  {settings.contactEmail}
                </a>
              </div>
            </motion.div>

            <motion.div
              className="flex items-start gap-4 rounded-2xl border border-[#104042]/10 bg-white p-4 shadow-sm transition hover:border-[#AEFF1C]/50 hover:shadow-md"
              whileHover={{ x: 4 }}
            >
              <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-[#104042] text-[#AEFF1C] shadow-md">
                <Phone className="h-6 w-6" />
              </span>
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-[#5E5E5E]">Direct Phone</p>
                <a
                  href={`tel:${settings.contactPhone}`}
                  className="mt-0.5 text-sm font-bold text-[#104042] hover:text-[#006402] transition"
                >
                  {settings.contactPhone}
                </a>
              </div>
            </motion.div>

            <motion.div
              className="flex items-start gap-4 rounded-2xl border border-[#104042]/10 bg-white p-4 shadow-sm transition hover:border-[#AEFF1C]/50 hover:shadow-md"
              whileHover={{ x: 4 }}
            >
              <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-[#104042] text-[#AEFF1C] shadow-md">
                <MapPin className="h-6 w-6" />
              </span>
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-[#5E5E5E]">Office Location</p>
                <p className="mt-0.5 text-sm font-bold text-[#104042]">{settings.contactAddress}</p>
              </div>
            </motion.div>
          </div>

          <div className="mt-8 flex items-center gap-6 text-xs font-semibold text-[#5E5E5E]">
            <span className="flex items-center gap-1.5 text-[#006402]">
              <Clock className="h-4 w-4" /> Response &lt; 24 hrs
            </span>
            <span className="flex items-center gap-1.5 text-[#104042]">
              <ShieldCheck className="h-4 w-4 text-[#006402]" /> Strict NDA Guaranteed
            </span>
          </div>
        </motion.div>

        {/* Right Column: Contact Form */}
        <motion.div
          className="md:col-span-3"
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6, delay: 0.15 }}
        >
          <ContactForm />
        </motion.div>
      </div>
    </section>
  );
}
