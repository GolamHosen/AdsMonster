"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  ShieldCheck,
  CheckCircle2,
  ChevronDown,
  Calendar,
  Zap,
  HelpCircle,
  MessageSquare,
} from "lucide-react";
import { HeroVisuals } from "@/components/animations/HeroVisuals";
import { ContactForm } from "@/components/site/ContactForm";
import type { siteSettings } from "@/db/schema";

type Settings = typeof siteSettings.$inferSelect;

interface Props {
  settings: Settings;
}

const AUDIT_STEPS = [
  {
    step: "01",
    title: "Account Structure Deep-Dive",
    desc: "We analyze campaign segmentation, bidding algorithms, audience overlaps, and wasted spend.",
  },
  {
    step: "02",
    title: "Creative & Copy Benchmark",
    desc: "We review CTR, engagement rates, visual fatigue, and provide 5 instant angle recommendations.",
  },
  {
    step: "03",
    title: "Conversion Tracking & CAPI Check",
    desc: "We verify server-side tracking, offline events, and ROAS attribution accuracy.",
  },
  {
    step: "04",
    title: "Custom 90-Day Scaling Roadmap",
    desc: "You receive a clear forecast of target ROAS, optimal budget split, and expected revenue.",
  },
];

const CONTACT_FAQS = [
  {
    q: "How soon will I receive my ad account audit?",
    a: "Within 24 business hours of receiving view-only access to your ad accounts, our senior media strategist will prepare a detailed video and slide deck breakdown of your growth opportunities.",
  },
  {
    q: "Do you require long-term contracts or lock-ins?",
    a: "Never. All AdsMonster client partnerships are structured on flexible month-to-month agreements. We believe you should stay because we produce profitable results, not because of a legal contract.",
  },
  {
    q: "What ad spend levels do you typically work with?",
    a: "We work with scaling brands spending between $2,000/month up to enterprise brands spending $150,000+/month across Google, Meta, TikTok, YouTube, and LinkedIn Ads.",
  },
  {
    q: "Will you need admin rights to our ad accounts?",
    a: "No! For audits and initial reviews, we only request standard 'Read-Only' or 'Analyst' access. You retain 100% ownership and control of your ad accounts, pixels, and data at all times.",
  },
  {
    q: "Do you also create the ad creatives and video copy?",
    a: "Yes! Depending on your tier, our in-house creative studio produces static ads, motion graphics, video hooks, UGC adaptations, and high-converting ad copy every single week.",
  },
];

export function ContactPageContent({ settings }: Props) {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  return (
    <div className="relative">
      {/* Header Banner */}
      <section className="relative overflow-hidden bg-[#E2F1F1] text-[#104042] pt-28 pb-20 md:pt-36 md:pb-28 text-center border-b border-[#104042]/10">
        <HeroVisuals />

        <div className="relative mx-auto max-w-4xl px-6">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.1 }}
            className="text-4xl font-extrabold sm:text-5xl lg:text-6xl font-display leading-tight text-[#104042]"
          >
            Let&apos;s Build Your Next{" "}
            <span className="text-[#006402] relative inline-block underline decoration-[#AEFF1C] decoration-8 underline-offset-4">
              High-ROAS Campaign.
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.2 }}
            className="mt-5 text-lg sm:text-xl text-[#104042]/80 max-w-2xl mx-auto leading-relaxed"
          >
            Ready to scale profitably? Fill out the brief form below and our lead media buyer will conduct a comprehensive audit of your ad performance — 100% free with zero obligation.
          </motion.p>
        </div>
      </section>

      {/* Main Contact Section */}
      <section className="mx-auto max-w-7xl px-6 py-20">
        <div className="grid gap-12 lg:grid-cols-12 items-start">
          {/* Left Column: Agency Contact Details & Value Props (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#006402] bg-[#AEFF1C]/15 px-3 py-1 rounded-full border border-[#AEFF1C]/30">
                Reach Out Directly
              </span>
              <h2 className="mt-3 text-2xl sm:text-3xl font-extrabold text-[#104042] font-display">
                We Answer Every Inquiry Within 24 Hours
              </h2>
              <p className="mt-2 text-sm text-[#5E5E5E] leading-relaxed">
                Whether you are launching a new product line or scaling existing spend to six figures, we are here to support your growth.
              </p>
            </div>

            {/* Direct Cards */}
            <div className="space-y-3.5">
              <motion.a
                href={`mailto:${settings.contactEmail}`}
                whileHover={{ x: 4 }}
                className="flex items-start gap-4 rounded-2xl border border-[#104042]/10 bg-white p-4 shadow-sm transition hover:border-[#AEFF1C]/60 hover:shadow-md"
              >
                <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-[#104042] text-[#AEFF1C] shadow-md">
                  <Mail className="h-6 w-6" />
                </span>
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-[#5E5E5E]">Email Our Team</p>
                  <p className="mt-0.5 text-sm font-bold text-[#104042] hover:text-[#006402] transition">
                    {settings.contactEmail}
                  </p>
                  <p className="text-[11px] text-[#5E5E5E]">Direct inbox monitored continuously</p>
                </div>
              </motion.a>

              <motion.a
                href={`tel:${settings.contactPhone}`}
                whileHover={{ x: 4 }}
                className="flex items-start gap-4 rounded-2xl border border-[#104042]/10 bg-white p-4 shadow-sm transition hover:border-[#AEFF1C]/60 hover:shadow-md"
              >
                <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-[#104042] text-[#AEFF1C] shadow-md">
                  <Phone className="h-6 w-6" />
                </span>
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-[#5E5E5E]">Direct Phone Line</p>
                  <p className="mt-0.5 text-sm font-bold text-[#104042] hover:text-[#006402] transition">
                    {settings.contactPhone}
                  </p>
                  <p className="text-[11px] text-[#5E5E5E]">Mon–Fri from 9:00 AM – 6:00 PM EST</p>
                </div>
              </motion.a>

              <div className="flex items-start gap-4 rounded-2xl border border-[#104042]/10 bg-white p-4 shadow-sm">
                <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-[#104042] text-[#AEFF1C] shadow-md">
                  <MapPin className="h-6 w-6" />
                </span>
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-[#5E5E5E]">Headquarters</p>
                  <p className="mt-0.5 text-sm font-bold text-[#104042]">{settings.contactAddress}</p>
                  <p className="text-[11px] text-[#5E5E5E]">In-person meetings by appointment</p>
                </div>
              </div>
            </div>

            {/* Guarantees Box */}
            <div className="rounded-2xl border border-[#006402]/15 bg-[#E8F4F4] p-5">
              <h3 className="text-sm font-bold text-[#104042] flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-[#006402]" />
                The AdsMonster Privacy Pledge
              </h3>
              <p className="mt-2 text-xs leading-relaxed text-[#5E5E5E]">
                All data, ad creative, and metrics shared with us are held under strict mutual NDA confidentiality. We never share account metrics or creative angles outside our senior audit team.
              </p>
              <div className="mt-3 flex items-center gap-4 text-xs font-semibold text-[#006402]">
                <span className="flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5" /> Fast 24h Turnaround
                </span>
                <span className="flex items-center gap-1">
                  <CheckCircle2 className="h-3.5 w-3.5" /> 100% Free Audit
                </span>
              </div>
            </div>
          </div>

          {/* Right Column: Contact Form (7 cols) */}
          <div className="lg:col-span-7">
            <div className="rounded-3xl border border-[#104042]/10 bg-white p-2 sm:p-4 shadow-lg shadow-[#104042]/5">
              <div className="px-6 pt-4 pb-2">
                <div className="flex items-center justify-between">
                  <span className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-[#006402] bg-[#AEFF1C]/15 px-3 py-1 rounded-full">
                    <Zap className="h-3.5 w-3.5" /> Priority Intake
                  </span>
                  <span className="text-xs text-[#5E5E5E] font-medium">Takes 60 seconds</span>
                </div>
                <h3 className="mt-2 text-xl font-extrabold text-[#104042] font-display">
                  Request Your Free Ad Strategy Audit
                </h3>
              </div>
              <ContactForm />
            </div>
          </div>
        </div>
      </section>

      {/* What You Get in the Audit */}
      <section className="bg-white py-20 border-y border-[#104042]/10">
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-bold uppercase tracking-wider text-[#006402] bg-[#AEFF1C]/15 px-3 py-1 rounded-full border border-[#AEFF1C]/30">
              Audit Deliverables
            </span>
            <h2 className="mt-3 text-3xl font-extrabold text-[#104042] font-display">
              What Happens After You Submit
            </h2>
            <p className="mt-2 text-sm text-[#5E5E5E]">
              We don&apos;t do generic sales presentations. Here is the concrete value you receive:
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {AUDIT_STEPS.map((item) => (
              <div
                key={item.step}
                className="relative rounded-2xl border border-[#104042]/10 bg-[#E8F4F4]/40 p-6 transition-all hover:bg-white hover:shadow-lg hover:border-[#AEFF1C]/50"
              >
                <span className="text-2xl font-extrabold text-[#006402] font-display">
                  {item.step}
                </span>
                <h3 className="mt-3 text-base font-bold text-[#104042]">{item.title}</h3>
                <p className="mt-2 text-xs leading-relaxed text-[#5E5E5E]">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="mx-auto max-w-4xl px-6 py-20">
        <div className="text-center mb-12">
          <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#006402] bg-[#AEFF1C]/15 px-3 py-1 rounded-full border border-[#AEFF1C]/30">
            <HelpCircle className="h-3.5 w-3.5" /> Frequently Asked Questions
          </span>
          <h2 className="mt-3 text-3xl font-extrabold text-[#104042] font-display">
            Questions Before Contacting Us?
          </h2>
          <p className="mt-2 text-sm text-[#5E5E5E]">
            Here are honest answers to the most common questions brands ask us.
          </p>
        </div>

        <div className="space-y-3">
          {CONTACT_FAQS.map((faq, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div
                key={idx}
                className="overflow-hidden rounded-2xl border border-[#104042]/10 bg-white transition shadow-sm"
              >
                <button
                  type="button"
                  onClick={() => setOpenFaq(isOpen ? null : idx)}
                  className="flex w-full items-center justify-between p-5 text-left text-sm font-bold text-[#104042] hover:bg-[#E8F4F4]/50 transition"
                >
                  <span className="pr-4">{faq.q}</span>
                  <ChevronDown
                    className={`h-4 w-4 shrink-0 text-[#104042] transition-transform duration-200 ${
                      isOpen ? "rotate-180 text-[#006402]" : ""
                    }`}
                  />
                </button>
                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="border-t border-[#104042]/8 px-5 py-4 text-xs sm:text-sm leading-relaxed text-[#5E5E5E] bg-[#E8F4F4]/20"
                    >
                      {faq.a}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
