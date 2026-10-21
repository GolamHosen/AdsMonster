"use client";

import React, { useRef } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import { triggerConfetti } from "@/components/animations/confetti";

interface GorgeousButtonProps {
  children: React.ReactNode;
  href?: string;
  onClick?: (e: React.MouseEvent) => void;
  variant?: "primary" | "secondary" | "dark" | "outline";
  size?: "sm" | "md" | "lg";
  icon?: React.ReactNode;
  showIcon?: boolean;
  showShimmer?: boolean;
  showPulseDot?: boolean;
  confettiOnClick?: boolean;
  className?: string;
  wrapperClassName?: string;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
}

export function GorgeousButton({
  children,
  href,
  onClick,
  variant = "primary",
  size = "md",
  icon,
  showIcon = true,
  showShimmer = true,
  showPulseDot = false,
  confettiOnClick = false,
  className = "",
  wrapperClassName = "",
  type = "button",
  disabled = false,
}: GorgeousButtonProps) {
  const buttonRef = useRef<HTMLDivElement>(null);

  const handleClick = (e: React.MouseEvent) => {
    if (disabled) return;
    if (confettiOnClick) {
      triggerConfetti();
    }
    if (onClick) {
      onClick(e);
    }
  };

  // Sizing definitions
  const sizeClasses = {
    sm: "px-4 py-2 text-xs",
    md: "px-6 py-3 text-xs sm:text-sm",
    lg: "px-8 py-4 text-sm sm:text-base",
  }[size];

  // Variant styles: Simple, authoritative, luxury, gorgeous!
  let variantClasses = "";
  if (variant === "primary") {
    variantClasses =
      "relative bg-[#006402] text-white font-bold tracking-wide rounded-[10px] shadow-[0_10px_25px_-5px_rgba(0,100,2,0.45)] hover:shadow-[0_16px_36px_-4px_rgba(0,100,2,0.65)] border border-[#006402] border-t-white/25 active:translate-y-0.5";
  } else if (variant === "secondary") {
    variantClasses =
      "relative bg-white/95 text-[#104042] font-bold tracking-wide rounded-[10px] border border-[#104042]/15 shadow-sm hover:border-[#006402] hover:bg-white hover:text-[#006402] hover:shadow-md";
  } else if (variant === "dark") {
    variantClasses =
      "relative bg-[#104042] text-white font-bold tracking-wide rounded-[10px] border border-white/10 shadow-lg hover:border-[#AEFF1C]/40 hover:shadow-xl hover:shadow-[#AEFF1C]/10";
  } else if (variant === "outline") {
    variantClasses =
      "relative bg-transparent text-[#006402] font-bold tracking-wide rounded-[10px] border-2 border-[#006402] hover:bg-[#006402] hover:text-white";
  }

  const content = (
    <motion.span
      ref={buttonRef}
      whileHover={{ scale: disabled ? 1 : 1.03, y: disabled ? 0 : -2 }}
      whileTap={{ scale: disabled ? 1 : 0.97 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
      className={`group inline-flex items-center justify-center gap-2.5 overflow-hidden transition-all duration-300 select-none ${sizeClasses} ${variantClasses} ${
        disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
      } ${className}`}
    >
      {/* Animated Light Shimmer Beam */}
      {showShimmer && variant === "primary" && (
        <motion.span
          className="pointer-events-none absolute inset-0 -skew-x-12"
          initial={{ x: "-150%" }}
          animate={{ x: "200%" }}
          transition={{
            repeat: Infinity,
            repeatDelay: 2.8,
            duration: 1.2,
            ease: "easeInOut",
          }}
          style={{
            background:
              "linear-gradient(90deg, transparent 0%, rgba(255, 255, 255, 0.28) 50%, transparent 100%)",
          }}
        />
      )}



      {/* Button Text */}
      <span className="relative z-10 flex items-center gap-2">
        {children}
      </span>

      {/* Icon with Hover Slide */}
      {showIcon && icon !== null && (
        icon ? (
          <span className="relative z-10 transition-transform duration-200 group-hover:translate-x-1">
            {icon}
          </span>
        ) : (
          <ArrowRight className="relative z-10 h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
        )
      )}
    </motion.span>
  );

  if (href) {
    if (href.startsWith("#") || href.startsWith("http") || href.startsWith("mailto") || href.startsWith("tel")) {
      return (
        <a href={href} onClick={handleClick} className={`inline-block ${wrapperClassName}`}>
          {content}
        </a>
      );
    }
    return (
      <Link href={href} onClick={handleClick} className={`inline-block ${wrapperClassName}`}>
        {content}
      </Link>
    );
  }

  return (
    <button type={type} onClick={handleClick} disabled={disabled} className={`inline-block bg-transparent p-0 border-0 ${wrapperClassName}`}>
      {content}
    </button>
  );
}
