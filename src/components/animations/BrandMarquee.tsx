"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";

const PARTNERS = [
  { name: "Google Premier Partner", tag: "Search & PMax" },
  { name: "Meta Business Partner", tag: "FB & Instagram" },
  { name: "TikTok Ads Partner", tag: "Video & Spark Ads" },
  { name: "YouTube Certified", tag: "Action & Discovery" },
  { name: "LinkedIn Marketing", tag: "B2B Lead Gen" },
  { name: "Shopify Plus Partner", tag: "E-Commerce CRO" },
];

export function BrandMarquee() {
  const marqueeRef = useRef<HTMLDivElement>(null);
  const tweenRef = useRef<gsap.core.Tween | null>(null);

  useEffect(() => {
    const el = marqueeRef.current;
    if (!el) return;

    // Duplicate list to create a seamless infinite loop
    tweenRef.current = gsap.to(el, {
      xPercent: -50,
      repeat: -1,
      duration: 28,
      ease: "none",
    });

    const handleMouseEnter = () => tweenRef.current?.timeScale(0.3);
    const handleMouseLeave = () => tweenRef.current?.timeScale(1);

    el.addEventListener("mouseenter", handleMouseEnter);
    el.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      el.removeEventListener("mouseenter", handleMouseEnter);
      el.removeEventListener("mouseleave", handleMouseLeave);
      tweenRef.current?.kill();
    };
  }, []);

  const items = [...PARTNERS, ...PARTNERS];

  return (
    <div className="relative w-full overflow-hidden border-y border-white/10 bg-[#0c3234] py-6">
      <div className="pointer-events-none absolute left-0 top-0 z-10 h-full w-28 bg-gradient-to-r from-[#0c3234] to-transparent" />
      <div className="pointer-events-none absolute right-0 top-0 z-10 h-full w-28 bg-gradient-to-l from-[#0c3234] to-transparent" />

      <div className="mb-3 text-center">
        <span className="text-[11px] font-bold uppercase tracking-widest text-[#AEFF1C]/70">
          Official Agency Partner Certifications & Networks
        </span>
      </div>

      <div ref={marqueeRef} className="flex w-max items-center gap-6 cursor-grab active:cursor-grabbing">
        {items.map((partner, index) => (
          <div
            key={index}
            className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-5 py-2.5 backdrop-blur-md transition-all hover:scale-105 hover:border-[#AEFF1C]/40 hover:bg-white/10"
          >
            <div className="h-2 w-2 rounded-full bg-[#AEFF1C] animate-ping" />
            <span className="text-sm font-bold text-white whitespace-nowrap">{partner.name}</span>
            <span className="rounded-full bg-[#AEFF1C]/15 px-2.5 py-0.5 text-[10px] font-bold text-[#AEFF1C] whitespace-nowrap border border-[#AEFF1C]/20">
              {partner.tag}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
