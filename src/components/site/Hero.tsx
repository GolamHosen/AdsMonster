"use client";

import { Suspense, lazy, useState, useEffect } from "react";
import { BadgeCheck, Star } from "lucide-react";
import { motion } from "framer-motion";
import type { siteSettings } from "@/db/schema";
import { HeroVisuals } from "@/components/animations/HeroVisuals";
import { SpringCounter } from "@/components/animations/SpringCounter";
import { BrandMarquee } from "@/components/animations/BrandMarquee";
import { GorgeousButton } from "@/components/ui/GorgeousButton";

/* Lazy-load the 3D canvas – keeps initial bundle fast */
const Hero3DGrowthScene = lazy(() =>
  import("@/components/animations/Hero3DGrowthScene").then((m) => ({
    default: m.Hero3DGrowthScene,
  }))
);

type Settings = typeof siteSettings.$inferSelect;

/* ──────────────────────────────────────────────
   Shimmer loading fallback for 3D canvas
   ────────────────────────────────────────────── */
function Scene3DFallback() {
  return (
    <div className="relative h-full w-full flex items-center justify-center">
      {/* Shimmer placeholder */}
      <div className="relative w-56 h-56 sm:w-64 sm:h-64">
        {/* Pulsing concentric rings */}
        <div className="absolute inset-0 rounded-full border border-[#AEFF1C]/20 animate-ping" style={{ animationDuration: "3s" }} />
        <div className="absolute inset-4 rounded-full border border-[#006402]/15 animate-ping" style={{ animationDuration: "4s", animationDelay: "0.5s" }} />
        <div className="absolute inset-8 rounded-full border border-[#104042]/10 animate-ping" style={{ animationDuration: "5s", animationDelay: "1s" }} />
        {/* Center glow dot */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="h-16 w-16 rounded-full bg-gradient-to-br from-[#AEFF1C]/30 to-[#006402]/20 blur-xl animate-pulse" />
        </div>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-xs font-bold text-[#104042]/40 uppercase tracking-widest">
            Loading 3D Experience...
          </span>
        </div>
      </div>
    </div>
  );
}

/* ──────────────────────────────────────────────
   Main Hero component
   ────────────────────────────────────────────── */
export function Hero({ settings }: { settings: Settings }) {
  const [showScene, setShowScene] = useState(false);

  /* Delay mounting the 3D canvas slightly for smoother FCP */
  useEffect(() => {
    const timer = setTimeout(() => setShowScene(true), 150);
    return () => clearTimeout(timer);
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.12,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 24 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
    },
  };

  const heroHeading =
    settings.heroHeading &&
    settings.heroHeading !== "Hi there, Welcome to AdsMonster." &&
    settings.heroHeading !== "Hi there, Welcome to Ads agency."
      ? settings.heroHeading
      : "Every platform you run, pointed at one growth number.";

  const heroSubtext =
    settings.heroSubtext &&
    !settings.heroSubtext.startsWith("AdsMonster is a results-driven")
      ? settings.heroSubtext
      : `${settings.siteName || "AdsMonster"} plans and runs your Google, Facebook, Instagram, LinkedIn, YouTube, TikTok and X campaigns from a single dashboard — so the clicks and views on each one add up to pipeline, not vanity metrics.`;

  return (
    <section id="top" className="relative overflow-hidden bg-[#E2F1F1] text-[#104042]">
      {/* ─── Hero 3D Stage (Canvas, 3D Scene, HUD Card, and Content) ─── */}
      <div className="relative min-h-[86vh] lg:min-h-[90vh] flex flex-col justify-center pt-24 md:pt-28 pb-10">
        {/* 3D WebGL Growth Scene with 7 Social Media Channel Icons & Floating HUD */}
        <div className="absolute inset-0 z-0">
          {showScene ? (
            <Suspense fallback={<Scene3DFallback />}>
              <Hero3DGrowthScene />
            </Suspense>
          ) : (
            <Scene3DFallback />
          )}
        </div>

        <div className="relative z-10 mx-auto grid max-w-7xl gap-8 lg:gap-12 px-6 pb-6 md:grid-cols-12 md:items-center">
          {/* ─── Left Column: Content ─── */}
          <motion.div
            className="md:col-span-6 lg:col-span-6 max-w-xl"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {/* Agency label badge */}
            <motion.div variants={itemVariants} className="inline-block">
              <span className="inline-flex items-center gap-2 rounded-full border border-[#006402]/20 bg-white/90 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-[#006402] backdrop-blur-md shadow-sm">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#006402] opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[#006402]" />
                </span>
                <BadgeCheck className="h-3.5 w-3.5 text-[#006402]" />
                <span>Google, Meta, LinkedIn, TikTok — One Strategy</span>
              </span>
            </motion.div>

            {/* Main heading */}
            <motion.h1
              variants={itemVariants}
              className="mt-6 text-4xl font-extrabold leading-[1.1] text-[#104042] sm:text-5xl lg:text-[3.4rem] font-display tracking-tight"
            >
              {heroHeading.includes("one growth number") ? (
                <>
                  Every platform you run, pointed at{" "}
                  <em className="not-italic text-[#006402] relative inline-block underline decoration-[#AEFF1C] decoration-8 underline-offset-4">
                    one growth number.
                  </em>
                </>
              ) : (
                heroHeading
              )}
            </motion.h1>

            {/* Description */}
            <motion.p
              variants={itemVariants}
              className="mt-6 max-w-xl text-base sm:text-lg leading-relaxed text-[#4A6060]"
            >
              {heroSubtext}
            </motion.p>

            {/* CTA buttons */}
            <motion.div variants={itemVariants} className="mt-8 flex flex-wrap sm:flex-nowrap items-center gap-4">
              <GorgeousButton
                href="#contact"
                variant="primary"
                size="lg"
                confettiOnClick
                className="w-full sm:w-[270px] px-4 sm:px-6 justify-center text-center whitespace-nowrap"
                wrapperClassName="w-full sm:w-auto"
              >
                Get a Free Consultation
              </GorgeousButton>

              <GorgeousButton
                href="#services"
                variant="secondary"
                size="lg"
                showIcon={false}
                className="w-full sm:w-[270px] px-4 sm:px-6 justify-center text-center whitespace-nowrap"
                wrapperClassName="w-full sm:w-auto"
              >
                How We Measure Growth
              </GorgeousButton>
            </motion.div>

            {/* Social proof */}
            <motion.div
              variants={itemVariants}
              className="mt-10 flex flex-wrap items-center gap-4 rounded-2xl border border-[#104042]/10 bg-white/90 p-4 backdrop-blur-lg w-fit shadow-lg"
              whileHover={{ scale: 1.02 }}
            >
              <div className="flex -space-x-3">
                {[
                  { label: "S", bg: "from-[#AEFF1C] to-[#006402]" },
                  { label: "M", bg: "from-sky-400 to-indigo-500" },
                  { label: "J", bg: "from-purple-400 to-pink-500" },
                  { label: "A", bg: "from-amber-400 to-orange-500" },
                ].map((avatar, idx) => (
                  <div
                    key={idx}
                    className={`grid h-10 w-10 place-items-center rounded-full border-2 border-white bg-gradient-to-br ${avatar.bg} text-xs font-extrabold text-white shadow-md`}
                  >
                    {avatar.label}
                  </div>
                ))}
              </div>

              <div>
                <div className="flex items-center gap-1.5 text-amber-500">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
                  ))}
                  <span className="ml-1 text-base font-extrabold text-[#104042]">
                    <SpringCounter value={settings.ratingValue} />
                  </span>
                </div>
                <p className="text-xs text-[#5E5E5E] font-medium">{settings.ratingCount}</p>
              </div>
            </motion.div>
          </motion.div>

          {/* ─── Right Column: Spacer to give 3D Scene ample room ─── */}
          <div className="md:col-span-6 lg:col-span-6 pointer-events-none min-h-[300px] sm:min-h-[400px] md:min-h-[460px] lg:min-h-[520px]" />
        </div>
      </div>

      {/* GSAP Infinite Partner Marquee cleanly below the Hero Stage */}
      <div className="relative z-20">
        <BrandMarquee />
      </div>
    </section>
  );
}
