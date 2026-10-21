"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";

export function CursorGlow() {
  const glowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Only enable on pointer-capable devices (not on mobile touch screens)
    if (typeof window === "undefined" || !window.matchMedia("(pointer: fine)").matches) {
      return;
    }

    const glow = glowRef.current;
    if (!glow) return;

    gsap.set(glow, { xPercent: -50, yPercent: -50, opacity: 0 });

    const xTo = gsap.quickTo(glow, "x", { duration: 0.6, ease: "power3.out" });
    const yTo = gsap.quickTo(glow, "y", { duration: 0.6, ease: "power3.out" });

    let isVisible = false;

    const handleMouseMove = (e: MouseEvent) => {
      if (!isVisible) {
        gsap.to(glow, { opacity: 1, duration: 0.3 });
        isVisible = true;
      }
      xTo(e.clientX);
      yTo(e.clientY);
    };

    const handleMouseLeave = () => {
      gsap.to(glow, { opacity: 0, duration: 0.4 });
      isVisible = false;
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    document.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  return (
    <div
      ref={glowRef}
      className="pointer-events-none fixed top-0 left-0 z-40 hidden h-96 w-96 rounded-full opacity-0 blur-3xl transition-opacity md:block"
      style={{
        background:
          "radial-gradient(circle, rgba(174, 255, 28, 0.16) 0%, rgba(16, 64, 66, 0.08) 45%, transparent 70%)",
      }}
      aria-hidden="true"
    />
  );
}
