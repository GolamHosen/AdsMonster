"use client";

import { useEffect, useRef } from "react";
import { animate } from "animejs";

export function HeroVisuals() {
  const containerRef = useRef<HTMLDivElement>(null);
  const ring1Ref = useRef<SVGCircleElement>(null);
  const ring2Ref = useRef<SVGCircleElement>(null);
  const ring3Ref = useRef<SVGCircleElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Animate glowing floating background orbs with anime.js
    const orbs = containerRef.current.querySelectorAll(".anime-orb");
    orbs.forEach((orb, i) => {
      animate(orb, {
        translateY: [0, i % 2 === 0 ? -24 : 24, 0],
        translateX: [0, i % 3 === 0 ? 18 : -18, 0],
        scale: [1, 1.15, 0.95, 1],
        opacity: [0.35, 0.65, 0.35],
        duration: 4000 + i * 1200,
        ease: "inOutQuad",
        loop: true,
      });
    });

    // Animate pulse radar rings with anime.js
    if (ring1Ref.current && ring2Ref.current && ring3Ref.current) {
      animate(ring1Ref.current, {
        r: [60, 140],
        opacity: [0.6, 0],
        duration: 3200,
        ease: "outQuad",
        loop: true,
      });

      animate(ring2Ref.current, {
        r: [60, 140],
        opacity: [0.5, 0],
        duration: 3200,
        delay: 1100,
        ease: "outQuad",
        loop: true,
      });

      animate(ring3Ref.current, {
        r: [60, 140],
        opacity: [0.4, 0],
        duration: 3200,
        delay: 2200,
        ease: "outQuad",
        loop: true,
      });
    }
  }, []);

  return (
    <div
      ref={containerRef}
      className="pointer-events-none absolute inset-0 overflow-hidden"
      aria-hidden="true"
    >
      {/* AdsMonster Neon Lime & Deep Green Floating Glow Orbs */}
      <div
        className="anime-orb absolute -top-24 -left-24 h-96 w-96 rounded-full blur-[100px]"
        style={{ background: "radial-gradient(circle, rgba(174, 255, 28, 0.3) 0%, transparent 70%)" }}
      />

      <div
        className="anime-orb absolute -bottom-20 left-1/3 h-80 w-80 rounded-full blur-[90px]"
        style={{ background: "radial-gradient(circle, rgba(169, 199, 199, 0.25) 0%, transparent 70%)" }}
      />

      {/* Anime.js Floating Luxury Sparkles */}
      <div className="absolute inset-0">
        {[
          { top: "18%", left: "12%", size: 6, color: "#006402" },
          { top: "28%", left: "42%", size: 4, color: "#AEFF1C" },
          { top: "65%", left: "8%", size: 5, color: "#104042" },
          { top: "75%", left: "35%", size: 6, color: "#006402" },
          { top: "22%", left: "85%", size: 5, color: "#AEFF1C" },
          { top: "82%", left: "70%", size: 7, color: "#006402" },
          { top: "45%", left: "92%", size: 4, color: "#104042" },
          { top: "12%", left: "62%", size: 6, color: "#AEFF1C" },
        ].map((pt, idx) => (
          <div
            key={idx}
            className="anime-orb absolute rounded-full opacity-40 shadow-sm"
            style={{
              top: pt.top,
              left: pt.left,
              width: pt.size,
              height: pt.size,
              backgroundColor: pt.color,
              boxShadow: `0 0 10px ${pt.color}`,
            }}
          />
        ))}
      </div>

      {/* AdsMonster Concentric Radar Rings */}
      <svg
        className="absolute top-1/2 left-3/4 -translate-x-1/2 -translate-y-1/2 h-[340px] w-[340px] opacity-25 hidden lg:block"
        viewBox="0 0 300 300"
      >
        <circle
          ref={ring1Ref}
          cx="150"
          cy="150"
          r="60"
          fill="none"
          stroke="#006402"
          strokeWidth="1.5"
        />
        <circle
          ref={ring2Ref}
          cx="150"
          cy="150"
          r="60"
          fill="none"
          stroke="#104042"
          strokeWidth="1.5"
        />
        <circle
          ref={ring3Ref}
          cx="150"
          cy="150"
          r="60"
          fill="none"
          stroke="#006402"
          strokeWidth="1"
        />
        <circle cx="150" cy="150" r="6" fill="#006402" />
      </svg>
    </div>
  );
}
